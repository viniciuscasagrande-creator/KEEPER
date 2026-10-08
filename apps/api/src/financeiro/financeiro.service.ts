import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilService } from '../contabil/contabil.service';
import { CreateFinancialAccountDto } from './dto/create-financial-account.dto';
import { CreatePayableTitleDto } from './dto/create-payable-title.dto';
import { CreateReceivableTitleDto } from './dto/create-receivable-title.dto';
import { LiquidateTitleDto } from './dto/liquidate-title.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { MovementType, TitleStatus } from '@erp/database';

@Injectable()
export class FinanceiroService {
  private readonly logger = new Logger(FinanceiroService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly contabilService: ContabilService,
  ) {}

  // ==========================================
  // CONTAS BANCÁRIAS E CAIXA (TREASURY)
  // ==========================================

  async getAccounts(tenantId: string, companyId: string) {
    const accounts = await this.prisma.financialAccount.findMany({
      where: { tenantId, companyId, status: 'ACTIVE' },
      include: {
        movements: {
          select: { movementType: true, amount: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return accounts.map((acc) => {
      let currentBalance = Number(acc.initialBalance);

      for (const m of acc.movements) {
        const val = Number(m.amount);
        if (m.movementType === MovementType.RECEIPT || m.movementType === MovementType.INTEREST) {
          currentBalance += val;
        } else if (
          m.movementType === MovementType.PAYMENT ||
          m.movementType === MovementType.FEE
        ) {
          currentBalance -= val;
        }
      }

      return {
        id: acc.id,
        name: acc.name,
        type: acc.type,
        bankCode: acc.bankCode,
        agency: acc.agency,
        accountNumber: acc.accountNumber,
        currency: acc.currency,
        initialBalance: Number(acc.initialBalance),
        currentBalance,
      };
    });
  }

  async createAccount(tenantId: string, companyId: string, dto: CreateFinancialAccountDto) {
    return this.prisma.financialAccount.create({
      data: {
        tenantId,
        companyId,
        branchId: dto.branchId,
        name: dto.name.trim(),
        type: dto.type,
        bankCode: dto.bankCode,
        agency: dto.agency,
        accountNumber: dto.accountNumber,
        initialBalance: dto.initialBalance || 0,
        status: 'ACTIVE',
      },
    });
  }

  // ==========================================
  // CONTAS A PAGAR (ACCOUNTS PAYABLE)
  // ==========================================

  async getPayables(
    tenantId: string,
    companyId: string,
    filters?: { status?: string; startDate?: string; endDate?: string; search?: string },
  ) {
    const where: any = { tenantId, companyId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.dueDate = {};
      if (filters.startDate) where.dueDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.dueDate.lte = new Date(filters.endDate);
    }

    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.payableTitle.findMany({
      where,
      include: {
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
        category: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createPayableTitle(
    tenantId: string,
    companyId: string,
    userId: string | undefined,
    dto: CreatePayableTitleDto,
  ) {
    const installmentsCount = dto.installmentsCount || 1;
    const intervalDays = dto.intervalDays || 30;
    const totalAmount = Number(dto.totalAmount);
    const installmentAmount = +(totalAmount / installmentsCount).toFixed(4);

    const firstDueDate = new Date(dto.dueDate);

    // Build installment records
    const installmentsData = [];
    for (let i = 1; i <= installmentsCount; i++) {
      const currentDueDate = new Date(firstDueDate);
      currentDueDate.setDate(currentDueDate.getDate() + (i - 1) * intervalDays);

      // Adjust last installment to prevent fractional roundoff difference
      const amount =
        i === installmentsCount
          ? +(totalAmount - installmentAmount * (installmentsCount - 1)).toFixed(4)
          : installmentAmount;

      installmentsData.push({
        installmentNumber: i,
        dueDate: currentDueDate,
        amount,
        status: TitleStatus.OPEN,
      });
    }

    const createdTitle = await this.prisma.payableTitle.create({
      data: {
        tenantId,
        companyId,
        supplierId: dto.supplierId,
        description: dto.description.trim(),
        documentNumber: dto.documentNumber?.trim(),
        issueDate: new Date(dto.issueDate),
        dueDate: firstDueDate,
        totalAmount,
        categoryId: dto.categoryId,
        costCenterId: dto.costCenterId,
        projectId: dto.projectId,
        status: TitleStatus.OPEN,
        installments: {
          create: installmentsData,
        },
      },
      include: {
        installments: true,
      },
    });

    this.logger.log(
      `[Financeiro] Título a Pagar criado com sucesso: ${createdTitle.id} (${installmentsCount} parcelas, Total: R$ ${totalAmount})`,
    );

    // Automatic accounting provision (D - Despesa, C - Fornecedor a Pagar)
    // If expenseAccountId is passed, generate double entry automatically
    if (dto.expenseAccountId) {
      try {
        // Find default Suppliers Payable account (Passivo Circulante 2.1.01)
        const supplierAccount = await this.prisma.accountingAccount.findFirst({
          where: {
            companyId,
            code: { startsWith: '2.1' },
            isAnalytical: true,
          },
        });

        if (supplierAccount) {
          await this.contabilService.createJournalEntry(tenantId, companyId, userId, {
            entryDate: dto.issueDate,
            description: `[PROVISÃO] ${dto.description} (Ref. Título #${createdTitle.documentNumber || createdTitle.id})`,
            sourceType: 'FINANCIAL_PAYABLE',
            sourceId: createdTitle.id,
            lines: [
              {
                accountId: dto.expenseAccountId,
                debitAmount: totalAmount,
                costCenterId: dto.costCenterId,
                projectId: dto.projectId,
                description: `Despesa provisionada - ${dto.description}`,
              },
              {
                accountId: supplierAccount.id,
                creditAmount: totalAmount,
                description: `Obrigação com fornecedores - ${dto.description}`,
              },
            ],
          });
        }
      } catch (accountingErr) {
        this.logger.warn(
          `Não foi possível gerar provisão contábil automática: ${(accountingErr as Error).message}`,
        );
      }
    }

    return createdTitle;
  }

  async liquidatePayableInstallment(
    tenantId: string,
    companyId: string,
    installmentId: string,
    userId: string | undefined,
    dto: LiquidateTitleDto,
  ) {
    const installment = await this.prisma.payableInstallment.findFirst({
      where: { id: installmentId },
      include: { title: true },
    });

    if (!installment || installment.title.tenantId !== tenantId) {
      throw new NotFoundException(`Parcela a pagar com ID '${installmentId}' não foi encontrada`);
    }

    if (installment.status === TitleStatus.PAID) {
      throw new BadRequestException('Esta parcela já está totalmente liquidada');
    }

    const netAmountPaid =
      Number(dto.amountPaid) +
      Number(dto.interestAmount || 0) +
      Number(dto.fineAmount || 0) -
      Number(dto.discountAmount || 0);

    return this.prisma.$transaction(async (tx) => {
      // 1. Register financial movement
      const movement = await tx.financialMovement.create({
        data: {
          tenantId,
          companyId,
          financialAccountId: dto.financialAccountId,
          sourceType: 'PAYABLE_INSTALLMENT',
          sourceId: installment.id,
          movementType: MovementType.PAYMENT,
          amount: netAmountPaid,
          movementDate: new Date(dto.paymentDate),
          description:
            dto.description ||
            `Liquidação Parcela ${installment.installmentNumber} - ${installment.title.description}`,
          status: 'POSTED',
        },
      });

      // 2. Update installment status
      const updatedInstallment = await tx.payableInstallment.update({
        where: { id: installmentId },
        data: {
          paidAmount: Number(dto.amountPaid),
          interestAmount: Number(dto.interestAmount || 0),
          fineAmount: Number(dto.fineAmount || 0),
          discountAmount: Number(dto.discountAmount || 0),
          status: TitleStatus.PAID,
        },
      });

      // 3. Check if all installments for this title are paid
      const allInstallments = await tx.payableInstallment.findMany({
        where: { payableTitleId: installment.payableTitleId },
      });

      const allPaid = allInstallments.every((i) => i.id === installmentId || i.status === TitleStatus.PAID);
      if (allPaid) {
        await tx.payableTitle.update({
          where: { id: installment.payableTitleId },
          data: { status: TitleStatus.PAID },
        });
      } else {
        await tx.payableTitle.update({
          where: { id: installment.payableTitleId },
          data: { status: TitleStatus.PARTIALLY_PAID },
        });
      }

      this.logger.log(
        `[Financeiro] Parcela ${installment.installmentNumber} do título ${installment.payableTitleId} baixada com sucesso (R$ ${netAmountPaid})`,
      );

      return {
        message: 'Parcela liquidada com sucesso',
        installment: updatedInstallment,
        movement,
      };
    });
  }

  // ==========================================
  // CONTAS A RECEBER (ACCOUNTS RECEIVABLE)
  // ==========================================

  async getReceivables(
    tenantId: string,
    companyId: string,
    filters?: { status?: string; startDate?: string; endDate?: string; search?: string },
  ) {
    const where: any = { tenantId, companyId };

    if (filters?.status) where.status = filters.status;

    if (filters?.startDate || filters?.endDate) {
      where.dueDate = {};
      if (filters.startDate) where.dueDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.dueDate.lte = new Date(filters.endDate);
    }

    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.receivableTitle.findMany({
      where,
      include: {
        installments: {
          orderBy: { installmentNumber: 'asc' },
        },
        category: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async createReceivableTitle(
    tenantId: string,
    companyId: string,
    userId: string | undefined,
    dto: CreateReceivableTitleDto,
  ) {
    const installmentsCount = dto.installmentsCount || 1;
    const intervalDays = dto.intervalDays || 30;
    const totalAmount = Number(dto.totalAmount);
    const installmentAmount = +(totalAmount / installmentsCount).toFixed(4);

    const firstDueDate = new Date(dto.dueDate);

    const installmentsData = [];
    for (let i = 1; i <= installmentsCount; i++) {
      const currentDueDate = new Date(firstDueDate);
      currentDueDate.setDate(currentDueDate.getDate() + (i - 1) * intervalDays);

      const amount =
        i === installmentsCount
          ? +(totalAmount - installmentAmount * (installmentsCount - 1)).toFixed(4)
          : installmentAmount;

      installmentsData.push({
        installmentNumber: i,
        dueDate: currentDueDate,
        amount,
        status: TitleStatus.OPEN,
      });
    }

    const createdTitle = await this.prisma.receivableTitle.create({
      data: {
        tenantId,
        companyId,
        customerId: dto.customerId,
        description: dto.description.trim(),
        documentNumber: dto.documentNumber?.trim(),
        issueDate: new Date(dto.issueDate),
        dueDate: firstDueDate,
        totalAmount,
        categoryId: dto.categoryId,
        costCenterId: dto.costCenterId,
        projectId: dto.projectId,
        status: TitleStatus.OPEN,
        installments: {
          create: installmentsData,
        },
      },
      include: {
        installments: true,
      },
    });

    this.logger.log(
      `[Financeiro] Título a Receber criado com sucesso: ${createdTitle.id} (${installmentsCount} parcelas, Total: R$ ${totalAmount})`,
    );

    // Automatic accounting provision (D - Clientes a Receber, C - Receita Operacional)
    if (dto.revenueAccountId) {
      try {
        const clientAccount = await this.prisma.accountingAccount.findFirst({
          where: {
            companyId,
            code: { startsWith: '1.1.02' },
            isAnalytical: true,
          },
        });

        if (clientAccount) {
          await this.contabilService.createJournalEntry(tenantId, companyId, userId, {
            entryDate: dto.issueDate,
            description: `[RECEITA PROVISIONADA] ${dto.description} (Ref. Título #${createdTitle.documentNumber || createdTitle.id})`,
            sourceType: 'FINANCIAL_RECEIVABLE',
            sourceId: createdTitle.id,
            lines: [
              {
                accountId: clientAccount.id,
                debitAmount: totalAmount,
                description: `Clientes a receber - ${dto.description}`,
              },
              {
                accountId: dto.revenueAccountId,
                creditAmount: totalAmount,
                costCenterId: dto.costCenterId,
                projectId: dto.projectId,
                description: `Receita bruta faturada - ${dto.description}`,
              },
            ],
          });
        }
      } catch (accountingErr) {
        this.logger.warn(
          `Não foi possível gerar provisão contábil de receita: ${(accountingErr as Error).message}`,
        );
      }
    }

    return createdTitle;
  }

  async liquidateReceivableInstallment(
    tenantId: string,
    companyId: string,
    installmentId: string,
    userId: string | undefined,
    dto: LiquidateTitleDto,
  ) {
    const installment = await this.prisma.receivableInstallment.findFirst({
      where: { id: installmentId },
      include: { title: true },
    });

    if (!installment || installment.title.tenantId !== tenantId) {
      throw new NotFoundException(`Parcela a receber '${installmentId}' não foi encontrada`);
    }

    if (installment.status === TitleStatus.PAID) {
      throw new BadRequestException('Esta parcela a receber já está totalmente liquidada');
    }

    const netReceived =
      Number(dto.amountPaid) +
      Number(dto.interestAmount || 0) +
      Number(dto.fineAmount || 0) -
      Number(dto.discountAmount || 0);

    return this.prisma.$transaction(async (tx) => {
      // 1. Financial movement
      const movement = await tx.financialMovement.create({
        data: {
          tenantId,
          companyId,
          financialAccountId: dto.financialAccountId,
          sourceType: 'RECEIVABLE_INSTALLMENT',
          sourceId: installment.id,
          movementType: MovementType.RECEIPT,
          amount: netReceived,
          movementDate: new Date(dto.paymentDate),
          description:
            dto.description ||
            `Recebimento Parcela ${installment.installmentNumber} - ${installment.title.description}`,
          status: 'POSTED',
        },
      });

      // 2. Update installment
      const updatedInstallment = await tx.receivableInstallment.update({
        where: { id: installmentId },
        data: {
          receivedAmount: Number(dto.amountPaid),
          interestAmount: Number(dto.interestAmount || 0),
          fineAmount: Number(dto.fineAmount || 0),
          discountAmount: Number(dto.discountAmount || 0),
          status: TitleStatus.PAID,
        },
      });

      // 3. Update title
      const allInstallments = await tx.receivableInstallment.findMany({
        where: { receivableTitleId: installment.receivableTitleId },
      });

      const allPaid = allInstallments.every((i) => i.id === installmentId || i.status === TitleStatus.PAID);
      await tx.receivableTitle.update({
        where: { id: installment.receivableTitleId },
        data: { status: allPaid ? TitleStatus.PAID : TitleStatus.PARTIALLY_PAID },
      });

      return {
        message: 'Recebimento liquidado com sucesso',
        installment: updatedInstallment,
        movement,
      };
    });
  }

  // ==========================================
  // TRANSFERÊNCIAS ENTRE CONTAS
  // ==========================================

  async createTransfer(tenantId: string, companyId: string, dto: CreateTransferDto) {
    if (dto.sourceAccountId === dto.destinationAccountId) {
      throw new BadRequestException('A conta de origem e a conta de destino devem ser diferentes');
    }

    const [source, dest] = await Promise.all([
      this.prisma.financialAccount.findFirst({ where: { id: dto.sourceAccountId, companyId } }),
      this.prisma.financialAccount.findFirst({ where: { id: dto.destinationAccountId, companyId } }),
    ]);

    if (!source || !dest) {
      throw new NotFoundException('Uma ou ambas as contas financeiras informadas não existem');
    }

    const transferAmount = Number(dto.amount);
    const transferDate = new Date(dto.transferDate);

    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.financialTransfer.create({
        data: {
          tenantId,
          companyId,
          sourceAccountId: dto.sourceAccountId,
          destinationAccountId: dto.destinationAccountId,
          amount: transferAmount,
          transferDate,
          status: 'COMPLETED',
        },
      });

      // Saída da conta origem
      await tx.financialMovement.create({
        data: {
          tenantId,
          companyId,
          financialAccountId: dto.sourceAccountId,
          sourceType: 'FINANCIAL_TRANSFER',
          sourceId: transfer.id,
          movementType: MovementType.PAYMENT,
          amount: transferAmount,
          movementDate: transferDate,
          description: `Transferência enviada para ${dest.name}: ${dto.description || ''}`,
          status: 'POSTED',
        },
      });

      // Entrada na conta destino
      await tx.financialMovement.create({
        data: {
          tenantId,
          companyId,
          financialAccountId: dto.destinationAccountId,
          sourceType: 'FINANCIAL_TRANSFER',
          sourceId: transfer.id,
          movementType: MovementType.RECEIPT,
          amount: transferAmount,
          movementDate: transferDate,
          description: `Transferência recebida de ${source.name}: ${dto.description || ''}`,
          status: 'POSTED',
        },
      });

      return transfer;
    });
  }

  // ==========================================
  // EXTRATO E SUMÁRIO DE TESOURARIA
  // ==========================================

  async getMovements(
    tenantId: string,
    companyId: string,
    filters?: { accountId?: string; startDate?: string; endDate?: string },
  ) {
    const where: any = { tenantId, companyId };

    if (filters?.accountId) where.financialAccountId = filters.accountId;
    if (filters?.startDate || filters?.endDate) {
      where.movementDate = {};
      if (filters.startDate) where.movementDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.movementDate.lte = new Date(filters.endDate);
    }

    return this.prisma.financialMovement.findMany({
      where,
      include: {
        account: { select: { id: true, name: true, type: true } },
      },
      orderBy: { movementDate: 'desc' },
      take: 100,
    });
  }

  async getFinancialSummary(tenantId: string, companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const accounts = await this.getAccounts(tenantId, companyId);
    const totalCash = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

    const [payablesMonth, receivablesMonth, overduePayable, overdueReceivable] = await Promise.all([
      this.prisma.payableInstallment.aggregate({
        where: {
          title: { tenantId, companyId },
          dueDate: { gte: startOfMonth, lte: endOfMonth },
          status: { in: [TitleStatus.OPEN, TitleStatus.PARTIALLY_PAID] },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.receivableInstallment.aggregate({
        where: {
          title: { tenantId, companyId },
          dueDate: { gte: startOfMonth, lte: endOfMonth },
          status: { in: [TitleStatus.OPEN, TitleStatus.PARTIALLY_PAID] },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payableInstallment.aggregate({
        where: {
          title: { tenantId, companyId },
          dueDate: { lt: now },
          status: { in: [TitleStatus.OPEN, TitleStatus.OVERDUE] },
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.receivableInstallment.aggregate({
        where: {
          title: { tenantId, companyId },
          dueDate: { lt: now },
          status: { in: [TitleStatus.OPEN, TitleStatus.OVERDUE] },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      availableCash: totalCash,
      totalPayableMonth: Number(payablesMonth._sum.amount || 0),
      countPayableMonth: payablesMonth._count,
      totalReceivableMonth: Number(receivablesMonth._sum.amount || 0),
      countReceivableMonth: receivablesMonth._count,
      overduePayable: Number(overduePayable._sum.amount || 0),
      countOverduePayable: overduePayable._count,
      overdueReceivable: Number(overdueReceivable._sum.amount || 0),
      countOverdueReceivable: overdueReceivable._count,
      netCashflowProjected:
        Number(receivablesMonth._sum.amount || 0) - Number(payablesMonth._sum.amount || 0),
    };
  }
}
