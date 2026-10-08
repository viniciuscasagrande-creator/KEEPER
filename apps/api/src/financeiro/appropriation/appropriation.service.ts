import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@erp/database';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface ApprovedSale {
  tenantId: string;
  companyId: string;
  saleId: string;
  eventId: string;
  producerId: string;
  grossAmount: string;
  occurredAt: Date;
}

export interface RevertAppropriationInput {
  tenantId: string;
  saleId: string;
  reason?: string;
  occurredAt?: Date;
}

@Injectable()
export class AppropriationService {
  private readonly logger = new Logger(AppropriationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cálculo determinístico puro de Split com arredondamento ROUND_HALF_UP (2 casas decimais)
   */
  calculateSplit(
    grossAmount: string | number | Prisma.Decimal,
    feeRatePct: string | number | Prisma.Decimal,
  ) {
    const gross = new Prisma.Decimal(grossAmount);
    const rate = new Prisma.Decimal(feeRatePct);

    if (!gross.isFinite() || gross.lte(0)) {
      throw new BadRequestException('Valor bruto da venda deve ser um número positivo');
    }
    if (rate.lt(0) || rate.gt(100)) {
      throw new BadRequestException('Taxa percentual deve estar entre 0% e 100%');
    }

    const diskAmount = gross.mul(rate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
    const producerAmount = gross.minus(diskAmount);

    return {
      grossAmount: gross,
      diskAmount,
      producerAmount,
      rate,
    };
  }

  /**
   * Processamento transacional com bloqueio concorrente (PostgreSQL Advisory Lock)
   * e escrituração contábil em partidas dobradas.
   */
  async processApprovedSale(sale: ApprovedSale) {
    // Invocar somente após validar a origem e confirmar o estado real do pagamento.
    const gross = new Prisma.Decimal(sale.grossAmount);

    if (!gross.isFinite() || gross.lte(0)) {
      throw new BadRequestException('Valor inválido');
    }

    if (!sale.saleId || !sale.tenantId) {
      throw new BadRequestException('Origem inválida');
    }

    return this.prisma.$transaction(
      async (tx) => {
        // Serializa operações sobre a mesma venda para evitar race conditions em chamadas concorrentes.
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${sale.tenantId}),
            hashtext(${sale.saleId})
          )
        `;

        // 1. Idempotência estrita: impede que o gateway registre a mesma venda duas vezes
        const existing = await tx.saleAppropriation.findUnique({
          where: {
            tenantId_saleId: {
              tenantId: sale.tenantId,
              saleId: sale.saleId,
            },
          },
        });

        if (existing) {
          this.logger.warn(
            `[Apropriação] Venda #${sale.saleId} já apropriada anteriormente (ID: ${existing.id}). Retornando estado idempotente.`,
          );
          return {
            status: 'ALREADY_PROCESSED',
            appropriationId: existing.id,
            saleId: sale.saleId,
            grossAmount: existing.grossAmount.toString(),
            diskAmount: existing.diskAmount.toString(),
            producerAmount: existing.producerAmount.toString(),
          };
        }

        // 2. Busca e validação da carteira do evento (EventWallet)
        const wallet = await tx.eventWallet.findFirst({
          where: {
            tenantId: sale.tenantId,
            companyId: sale.companyId,
            eventId: sale.eventId,
            producerId: sale.producerId,
            status: 'OPEN',
            isCancellationBlocked: false,
          },
        });

        if (!wallet) {
          throw new NotFoundException(
            `Carteira do evento ${sale.eventId} indisponível, inexistente ou bloqueada para liquidação.`,
          );
        }

        // 3. Busca a regra de taxa DISK_FEE vigente no exato instante da venda (vigência temporal)
        const rules = await tx.eventFeeRule.findMany({
          where: {
            tenantId: sale.tenantId,
            eventWalletId: wallet.id,
            feeCode: 'DISK_FEE',
            isActive: true,
            validFrom: { lte: sale.occurredAt },
            OR: [{ validTo: null }, { validTo: { gt: sale.occurredAt } }],
          },
        });

        if (rules.length !== 1) {
          throw new BadRequestException(
            `Regra DISK_FEE ausente ou ambígua para o evento no instante da venda (${rules.length} regras encontradas).`,
          );
        }

        const rule = rules[0];

        if (
          rule.calculationType !== 'PERCENTAGE' ||
          rule.payer !== 'PRODUCER' ||
          rule.destination !== 'DISKINGRESSOS_REVENUE' ||
          rule.basisType !== 'VALOR_BRUTO_VENDA' ||
          rule.rate === null
        ) {
          throw new BadRequestException(
            `Configuração de taxa não suportada: Esperado PERCENTAGE, PRODUCER, DISKINGRESSOS_REVENUE, VALOR_BRUTO_VENDA.`,
          );
        }

        const rate = new Prisma.Decimal(rule.rate);

        if (rate.lt(0) || rate.gt(100)) {
          throw new BadRequestException('Percentual de taxa fora do intervalo permitido (0 a 100%)');
        }

        // 4. Executa a divisão matemática exata
        const split = this.calculateSplit(gross, rate);
        const disk = split.diskAmount;
        const producer = split.producerAmount;

        // 5. Snapshot imutável da regra aplicada e persistência em SaleAppropriation
        const appropriation = await tx.saleAppropriation.create({
          data: {
            tenantId: sale.tenantId,
            companyId: sale.companyId,
            saleId: sale.saleId,
            eventId: sale.eventId,
            producerId: sale.producerId,
            grossAmount: gross,
            diskAmount: disk,
            producerAmount: producer,
            feeRuleId: rule.id,
            feeSnapshot: {
              feeCode: rule.feeCode,
              calculationType: rule.calculationType,
              basisType: rule.basisType,
              payer: rule.payer,
              destination: rule.destination,
              rate: rate.toString(),
              validFrom: rule.validFrom.toISOString(),
            },
            status: 'APPROPRIATED',
          },
        });

        // 6. Escrituração contábil em partidas dobradas (FinancialJournal)
        const journal = await tx.financialJournal.create({
          data: {
            tenantId: sale.tenantId,
            sourceType: 'SALE_APPROPRIATION',
            sourceId: appropriation.id,
            status: 'POSTED',
          },
        });

        const postings = [
          {
            account: 'RECEBIVEIS_GATEWAY',
            side: 'DEBIT',
            amount: gross,
          },
          {
            account: 'OBRIGACOES_PRODUTORES',
            side: 'CREDIT',
            amount: producer,
          },
          {
            account: 'RECEITA_DISK',
            side: 'CREDIT',
            amount: disk,
          },
        ];

        // Validação formal de equilíbrio contábil: Soma dos Débitos == Soma dos Créditos
        const debits = postings
          .filter((p) => p.side === 'DEBIT')
          .reduce((a, p) => a.plus(p.amount), new Prisma.Decimal(0));

        const credits = postings
          .filter((p) => p.side === 'CREDIT')
          .reduce((a, p) => a.plus(p.amount), new Prisma.Decimal(0));

        if (!debits.eq(credits)) {
          throw new BadRequestException(
            `Lançamento financeiro desequilibrado: Débitos (R$ ${debits}) != Créditos (R$ ${credits})`,
          );
        }

        await tx.financialPosting.createMany({
          data: postings.map((p) => ({
            journalId: journal.id,
            account: p.account,
            side: p.side,
            amount: p.amount,
          })),
        });

        // 7. Atualização atômica dos acumuladores na carteira do evento
        await tx.eventWallet.update({
          where: { id: wallet.id },
          data: {
            grossTicketSales: { increment: gross },
            diskFeeTotal: { increment: disk },
            balanceAvailable: { increment: producer },
          },
        });

        this.logger.log(
          `[Apropriação] Venda #${sale.saleId} apropriada com sucesso! Disk: R$ ${disk} | Produtor: R$ ${producer}`,
        );

        return {
          status: 'APPROPRIATED',
          appropriationId: appropriation.id,
          journalId: journal.id,
          saleId: sale.saleId,
          grossAmount: gross.toString(),
          diskAmount: disk.toString(),
          producerAmount: producer.toString(),
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  /**
   * Reversão Transacional de Apropriação (Estorno Integral / Cancelamento)
   * Mantém o histórico original e gera partidas inversas com débito nas obrigações/receitas
   * e crédito nos recebíveis.
   */
  async revertAppropriation(input: RevertAppropriationInput) {
    if (!input.saleId || !input.tenantId) {
      throw new BadRequestException('Parâmetros de reversão inválidos');
    }

    return this.prisma.$transaction(
      async (tx) => {
        // Serialização com advisory lock
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${input.tenantId}),
            hashtext(${input.saleId})
          )
        `;

        const appropriation = await tx.saleAppropriation.findUnique({
          where: {
            tenantId_saleId: {
              tenantId: input.tenantId,
              saleId: input.saleId,
            },
          },
        });

        if (!appropriation) {
          throw new NotFoundException(`Apropriação da venda #${input.saleId} não encontrada para reversão.`);
        }

        if (appropriation.status === 'REVERSED') {
          return {
            status: 'ALREADY_REVERSED',
            appropriationId: appropriation.id,
            saleId: input.saleId,
          };
        }

        // Marca a apropriação original como estornada/revertida
        await tx.saleAppropriation.update({
          where: { id: appropriation.id },
          data: { status: 'REVERSED' },
        });

        // Gera documento de estorno no diário financeiro
        const reversalJournal = await tx.financialJournal.create({
          data: {
            tenantId: input.tenantId,
            sourceType: 'SALE_REFUND_REVERSAL',
            sourceId: appropriation.id,
            status: 'POSTED',
          },
        });

        const gross = appropriation.grossAmount;
        const disk = appropriation.diskAmount;
        const producer = appropriation.producerAmount;

        // Partidas inversas: D OBRIGACOES_PRODUTORES / D RECEITA_DISK / C RECEBIVEIS_GATEWAY
        const postings = [
          {
            account: 'OBRIGACOES_PRODUTORES',
            side: 'DEBIT',
            amount: producer,
          },
          {
            account: 'RECEITA_DISK',
            side: 'DEBIT',
            amount: disk,
          },
          {
            account: 'RECEBIVEIS_GATEWAY',
            side: 'CREDIT',
            amount: gross,
          },
        ];

        await tx.financialPosting.createMany({
          data: postings.map((p) => ({
            journalId: reversalJournal.id,
            account: p.account,
            side: p.side,
            amount: p.amount,
          })),
        });

        // Estorna os saldos acumulados na carteira do evento
        await tx.eventWallet.updateMany({
          where: {
            tenantId: input.tenantId,
            eventId: appropriation.eventId,
            producerId: appropriation.producerId,
          },
          data: {
            grossTicketSales: { decrement: gross },
            diskFeeTotal: { decrement: disk },
            balanceAvailable: { decrement: producer },
            refundsPaidTotal: { increment: gross },
          },
        });

        this.logger.log(
          `[Apropriação] Reversão da venda #${input.saleId} processada com sucesso! Histórico preservado.`,
        );

        return {
          status: 'REVERSED',
          reversalJournalId: reversalJournal.id,
          appropriationId: appropriation.id,
          saleId: input.saleId,
          reversedGrossAmount: gross.toString(),
          reversedDiskAmount: disk.toString(),
          reversedProducerAmount: producer.toString(),
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  /**
   * Consulta a apropriação e seus lançamentos contábeis vinculados
   */
  async getAppropriationBySaleId(tenantId: string, saleId: string) {
    const appropriation = await this.prisma.saleAppropriation.findUnique({
      where: {
        tenantId_saleId: { tenantId, saleId },
      },
    });

    if (!appropriation) {
      return null;
    }

    const journal = await this.prisma.financialJournal.findUnique({
      where: {
        tenantId_sourceType_sourceId: {
          tenantId,
          sourceType: 'SALE_APPROPRIATION',
          sourceId: appropriation.id,
        },
      },
      include: {
        postings: true,
      },
    });

    return {
      appropriation,
      journal,
    };
  }
}
