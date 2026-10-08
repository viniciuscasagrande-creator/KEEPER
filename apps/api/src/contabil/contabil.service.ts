import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { OpenPeriodDto } from './dto/open-period.dto';
import { ReverseJournalEntryDto } from './dto/reverse-journal-entry.dto';
import { AccountNature, AccountType } from '@erp/database';

@Injectable()
export class ContabilService {
  private readonly logger = new Logger(ContabilService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // PLANO DE CONTAS (CHART OF ACCOUNTS)
  // ==========================================

  async getChartOfAccounts(tenantId: string, companyId: string) {
    return this.prisma.accountingAccount.findMany({
      where: { tenantId, companyId },
      include: {
        parent: {
          select: { id: true, code: true, name: true },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  async createAccount(tenantId: string, companyId: string, dto: CreateAccountingAccountDto) {
    const existing = await this.prisma.accountingAccount.findFirst({
      where: { companyId, code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Conta contábil com o código '${dto.code}' já existe nesta empresa`,
      );
    }

    if (dto.parentId) {
      const parent = await this.prisma.accountingAccount.findFirst({
        where: { id: dto.parentId, companyId },
      });

      if (!parent) {
        throw new NotFoundException(`Conta pai com ID '${dto.parentId}' não foi encontrada`);
      }

      // If parent was marked as analytical, convert it to synthetic (since it now has children)
      if (parent.isAnalytical) {
        await this.prisma.accountingAccount.update({
          where: { id: parent.id },
          data: { isAnalytical: false },
        });
      }
    }

    return this.prisma.accountingAccount.create({
      data: {
        tenantId,
        companyId,
        code: dto.code.trim(),
        name: dto.name.trim(),
        accountType: dto.accountType,
        nature: dto.nature,
        parentId: dto.parentId,
        isAnalytical: dto.isAnalytical,
        level: dto.level || dto.code.split('.').length,
        active: true,
      },
    });
  }

  // ==========================================
  // PERÍODOS CONTÁBEIS (ACCOUNTING PERIODS)
  // ==========================================

  async getPeriods(tenantId: string, companyId: string) {
    return this.prisma.accountingPeriod.findMany({
      where: { tenantId, companyId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async openPeriod(tenantId: string, companyId: string, dto: OpenPeriodDto) {
    const existing = await this.prisma.accountingPeriod.findUnique({
      where: {
        companyId_year_month: {
          companyId,
          year: dto.year,
          month: dto.month,
        },
      },
    });

    if (existing) {
      if (existing.status === 'OPEN') {
        return existing;
      }
      return this.prisma.accountingPeriod.update({
        where: { id: existing.id },
        data: { status: 'OPEN', closedAt: null, closedBy: null },
      });
    }

    return this.prisma.accountingPeriod.create({
      data: {
        tenantId,
        companyId,
        year: dto.year,
        month: dto.month,
        status: 'OPEN',
      },
    });
  }

  async closePeriod(tenantId: string, companyId: string, periodId: string, userId?: string) {
    const period = await this.prisma.accountingPeriod.findFirst({
      where: { id: periodId, companyId },
    });

    if (!period) {
      throw new NotFoundException(`Período contábil '${periodId}' não encontrado`);
    }

    return this.prisma.accountingPeriod.update({
      where: { id: periodId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closedBy: userId,
      },
    });
  }

  // ==========================================
  // RAZÃO GERAL & PARTIDAS DOBRADAS (JOURNAL)
  // ==========================================

  async getJournalEntries(
    tenantId: string,
    companyId: string,
    filters?: { startDate?: string; endDate?: string; limit?: number },
  ) {
    const where: any = { tenantId, companyId };

    if (filters?.startDate || filters?.endDate) {
      where.entryDate = {};
      if (filters.startDate) where.entryDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.entryDate.lte = new Date(filters.endDate);
    }

    return this.prisma.journalEntry.findMany({
      where,
      include: {
        lines: {
          include: {
            account: { select: { id: true, code: true, name: true, nature: true } },
            costCenter: { select: { id: true, code: true, name: true } },
          },
        },
        originalReversal: true,
        reversalOf: true,
      },
      orderBy: { entryDate: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async createJournalEntry(
    tenantId: string,
    companyId: string,
    userId: string | undefined,
    dto: CreateJournalEntryDto,
  ) {
    // 1. Rigorous double-entry balance validation: Sum(Debits) === Sum(Credits)
    let totalDebits = 0;
    let totalCredits = 0;

    for (const line of dto.lines) {
      totalDebits += Number(line.debitAmount || 0);
      totalCredits += Number(line.creditAmount || 0);
    }

    const difference = Math.abs(totalDebits - totalCredits);
    if (difference > 0.0001) {
      throw new BadRequestException(
        `Partidas dobradas desbalanceadas! Débitos (R$ ${totalDebits.toFixed(2)}) devem ser estritamente iguais a Créditos (R$ ${totalCredits.toFixed(2)}). Diferença: R$ ${difference.toFixed(2)}`,
      );
    }

    if (totalDebits === 0) {
      throw new BadRequestException('O lançamento contábil não pode ter valor zero');
    }

    // 2. Validate period status for entry date
    const entryDate = new Date(dto.entryDate);
    const year = entryDate.getUTCFullYear();
    const month = entryDate.getUTCMonth() + 1;

    let period = await this.prisma.accountingPeriod.findUnique({
      where: {
        companyId_year_month: {
          companyId,
          year,
          month,
        },
      },
    });

    if (!period) {
      // Auto-open period if it doesn't exist yet
      period = await this.prisma.accountingPeriod.create({
        data: {
          tenantId,
          companyId,
          year,
          month,
          status: 'OPEN',
        },
      });
    }

    if (period.status !== 'OPEN') {
      throw new BadRequestException(
        `O período contábil ${month.toString().padStart(2, '0')}/${year} está com status '${period.status}' e não aceita novos lançamentos`,
      );
    }

    // 3. Validate accounts are analytical
    const accountIds = dto.lines.map((l) => l.accountId);
    const accounts = await this.prisma.accountingAccount.findMany({
      where: { id: { in: accountIds }, companyId },
    });

    if (accounts.length !== accountIds.length) {
      throw new NotFoundException('Uma ou mais contas contábeis informadas não existem nesta empresa');
    }

    for (const acc of accounts) {
      if (!acc.isAnalytical) {
        throw new BadRequestException(
          `A conta '${acc.code} - ${acc.name}' é sintética (totalizadora) e não pode receber lançamentos diretos`,
        );
      }
    }

    // 4. Generate next sequential entry number for the company
    const lastEntry = await this.prisma.journalEntry.findFirst({
      where: { companyId },
      orderBy: { entryNumber: 'desc' },
      select: { entryNumber: true },
    });

    const nextNumber = (lastEntry?.entryNumber ? BigInt(lastEntry.entryNumber) : BigInt(0)) + BigInt(1);

    // 5. Execute atomic transaction
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          tenantId,
          companyId,
          periodId: period.id,
          entryNumber: nextNumber,
          entryDate,
          description: dto.description.trim(),
          sourceType: dto.sourceType || 'MANUAL',
          sourceId: dto.sourceId,
          status: 'POSTED',
          createdBy: userId,
          lines: {
            create: dto.lines.map((l) => ({
              accountId: l.accountId,
              costCenterId: l.costCenterId,
              projectId: l.projectId,
              debitAmount: l.debitAmount || 0,
              creditAmount: l.creditAmount || 0,
              description: l.description?.trim() || dto.description.trim(),
            })),
          },
        },
        include: {
          lines: {
            include: {
              account: { select: { code: true, name: true } },
            },
          },
        },
      });

      this.logger.log(
        `[Contábil] Lançamento nº ${nextNumber.toString()} gravado com sucesso no Razão (${dto.lines.length} partidas, Total: R$ ${totalDebits.toFixed(2)})`,
      );

      return {
        ...entry,
        entryNumber: entry.entryNumber.toString(),
      };
    });
  }

  async reverseJournalEntry(
    tenantId: string,
    companyId: string,
    entryId: string,
    userId: string | undefined,
    dto: ReverseJournalEntryDto,
  ) {
    const originalEntry = await this.prisma.journalEntry.findFirst({
      where: { id: entryId, companyId },
      include: {
        lines: true,
        originalReversal: true,
      },
    });

    if (!originalEntry) {
      throw new NotFoundException(`Lançamento contábil original '${entryId}' não encontrado`);
    }

    if (originalEntry.originalReversal) {
      throw new BadRequestException('Este lançamento já foi estornado anteriormente');
    }

    // Invert debits and credits
    const reversalLines = originalEntry.lines.map((line) => ({
      accountId: line.accountId,
      costCenterId: line.costCenterId,
      projectId: line.projectId,
      debitAmount: Number(line.creditAmount),
      creditAmount: Number(line.debitAmount),
      description: `[ESTORNO] ${dto.reason} (Ref. Lançamento #${originalEntry.entryNumber.toString()})`,
    }));

    // Create the reversal entry and link them via JournalReversal
    return this.prisma.$transaction(async (tx) => {
      const lastEntry = await tx.journalEntry.findFirst({
        where: { companyId },
        orderBy: { entryNumber: 'desc' },
        select: { entryNumber: true },
      });

      const nextNumber =
        (lastEntry?.entryNumber ? BigInt(lastEntry.entryNumber) : BigInt(0)) + BigInt(1);

      const reversalEntry = await tx.journalEntry.create({
        data: {
          tenantId,
          companyId,
          periodId: originalEntry.periodId,
          entryNumber: nextNumber,
          entryDate: new Date(),
          description: `ESTORNO: ${dto.reason}`,
          sourceType: 'REVERSAL',
          sourceId: originalEntry.id,
          status: 'POSTED',
          createdBy: userId,
          lines: {
            create: reversalLines,
          },
        },
      });

      await tx.journalReversal.create({
        data: {
          originalEntryId: originalEntry.id,
          reversalEntryId: reversalEntry.id,
          reason: dto.reason,
          createdBy: userId,
        },
      });

      return {
        message: 'Lançamento estornado com sucesso através de contrapartida de igual valor',
        originalEntryId: originalEntry.id,
        reversalEntryId: reversalEntry.id,
        reversalEntryNumber: nextNumber.toString(),
      };
    });
  }

  // ==========================================
  // RELATÓRIOS CONTÁBEIS (DRE & BALANCETE)
  // ==========================================

  async getTrialBalance(tenantId: string, companyId: string, startDate?: string, endDate?: string) {
    const accounts = await this.prisma.accountingAccount.findMany({
      where: { tenantId, companyId, active: true },
      orderBy: { code: 'asc' },
    });

    const linesWhere: any = {
      entry: {
        tenantId,
        companyId,
      },
    };

    if (startDate || endDate) {
      linesWhere.entry.entryDate = {};
      if (startDate) linesWhere.entry.entryDate.gte = new Date(startDate);
      if (endDate) linesWhere.entry.entryDate.lte = new Date(endDate);
    }

    const lines = await this.prisma.journalLine.findMany({
      where: linesWhere,
      select: {
        accountId: true,
        debitAmount: true,
        creditAmount: true,
      },
    });

    const accountTotals: Record<string, { totalDebit: number; totalCredit: number }> = {};
    for (const line of lines) {
      if (!accountTotals[line.accountId]) {
        accountTotals[line.accountId] = { totalDebit: 0, totalCredit: 0 };
      }
      accountTotals[line.accountId].totalDebit += Number(line.debitAmount);
      accountTotals[line.accountId].totalCredit += Number(line.creditAmount);
    }

    const report = accounts.map((acc) => {
      const totals = accountTotals[acc.id] || { totalDebit: 0, totalCredit: 0 };
      const balance =
        acc.nature === AccountNature.DEBIT
          ? totals.totalDebit - totals.totalCredit
          : totals.totalCredit - totals.totalDebit;

      return {
        id: acc.id,
        code: acc.code,
        name: acc.name,
        type: acc.accountType,
        nature: acc.nature,
        isAnalytical: acc.isAnalytical,
        totalDebit: totals.totalDebit,
        totalCredit: totals.totalCredit,
        finalBalance: balance,
      };
    });

    const sumDebits = report.reduce((sum, r) => sum + r.totalDebit, 0);
    const sumCredits = report.reduce((sum, r) => sum + r.totalCredit, 0);

    return {
      period: { startDate, endDate },
      totalDebits: sumDebits,
      totalCredits: sumCredits,
      isBalanced: Math.abs(sumDebits - sumCredits) < 0.01,
      accounts: report,
    };
  }

  async getDRE(tenantId: string, companyId: string, startDate?: string, endDate?: string) {
    // 4. Receitas (REVENUE) e 5. Despesas/Custos (EXPENSE)
    const trialBalance = await this.getTrialBalance(tenantId, companyId, startDate, endDate);

    const revenues = trialBalance.accounts.filter(
      (a) => a.type === AccountType.REVENUE && a.isAnalytical,
    );
    const expenses = trialBalance.accounts.filter(
      (a) => a.type === AccountType.EXPENSE && a.isAnalytical,
    );

    const totalRevenue = revenues.reduce((sum, a) => sum + a.finalBalance, 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + a.finalBalance, 0);
    const netResult = totalRevenue - totalExpenses;

    return {
      title: 'Demonstração do Resultado do Exercício (DRE)',
      regime: 'Competência',
      grossRevenue: totalRevenue,
      operatingExpenses: totalExpenses,
      netResult,
      isProfitable: netResult >= 0,
      revenueBreakdown: revenues,
      expenseBreakdown: expenses,
    };
  }
}
