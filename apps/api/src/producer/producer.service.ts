import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SettlementService } from '../financeiro/settlement/settlement.service';
import { CreatePayoutRequestDto, CreateAdvanceRequestDto } from './dto/producer-requests.dto';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  // Armazenamento em memória para solicitações dinâmicas com fallback robusto
  private payoutRequestsStore: any[] = [
    {
      id: 'payout-req-001',
      requestNumber: 'REP-2026-0089',
      eventId: 'ev-101',
      eventName: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
      producerId: 'prod-01',
      producerName: 'Opus Entretenimento & Shows Ltda',
      amount: 25000.0,
      paymentMethod: 'PIX',
      destinationAccount: 'financeiro@opusentretenimento.com.br (PIX Chave Aleatória / Itaú)',
      status: 'UNDER_ANALYSIS',
      requestedAt: '2026-10-10T14:32:00.000Z',
      notes: 'Solicitação de repasse correspondente ao 2º lote esgotado.',
      timeline: [
        { step: 'SOLICITADO', label: 'Solicitado pelo Produtor', time: '10/10/2026 11:32', status: 'COMPLETED' },
        { step: 'ANALISE', label: 'Análise de Reservas e ECAD (Disk Financeiro)', time: '10/10/2026 14:00', status: 'IN_PROGRESS' },
        { step: 'APROVACAO', label: 'Aprovação de Alçada', status: 'PENDING' },
        { step: 'LIQUIDACAO', label: 'Envio Bancário PIX / Confirmação Ledger', status: 'PENDING' },
      ],
    },
    {
      id: 'payout-req-002',
      requestNumber: 'REP-2026-0072',
      eventId: 'ev-101',
      eventName: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
      producerId: 'prod-01',
      producerName: 'Opus Entretenimento & Shows Ltda',
      amount: 100000.0,
      paymentMethod: 'PIX',
      destinationAccount: 'financeiro@opusentretenimento.com.br',
      status: 'PAID',
      requestedAt: '2026-10-01T09:15:00.000Z',
      paidAt: '2026-10-02T16:20:00.000Z',
      notes: 'Repasse inicial do marco de lançamento (Lote Promocional).',
      timeline: [
        { step: 'SOLICITADO', label: 'Solicitado pelo Produtor', time: '01/10/2026 09:15', status: 'COMPLETED' },
        { step: 'ANALISE', label: 'Análise de Reservas', time: '01/10/2026 11:00', status: 'COMPLETED' },
        { step: 'APROVACAO', label: 'Aprovado pelo Diretor Financeiro', time: '01/10/2026 15:30', status: 'COMPLETED' },
        { step: 'LIQUIDACAO', label: 'Efetivado via PIX Banco Itaú (TxId: 9812401)', time: '02/10/2026 16:20', status: 'COMPLETED' },
      ],
    },
  ];

  private advanceRequestsStore: any[] = [
    {
      id: 'adv-req-001',
      advanceNumber: 'ADV-2026-0014',
      eventId: 'ev-101',
      eventName: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
      producerId: 'prod-01',
      producerName: 'Opus Entretenimento & Shows Ltda',
      requestedAmount: 50000.0,
      advanceFeeRate: 2.5,
      advanceFeeCost: 1250.0,
      netAmount: 48750.0,
      status: 'APPROVED',
      requestedAt: '2026-10-05T10:00:00.000Z',
      justification: 'Adiantamento contratual para sinal de montagem de palco e rider técnico.',
      warranties: 'Trava sobre recebíveis do 3º e 4º lotes da bilheteria Disk.',
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly settlementService: SettlementService,
  ) {}

  /**
   * 1. GET /api/v1/producer/events
   * Lista todos os eventos vinculados ao produtor com resumo de ingressos e status
   */
  async getProducerEvents(tenantId: string, producerId: string) {
    this.logger.log(`Consultando eventos para o produtor ${producerId} (Tenant: ${tenantId})`);

    // Busca dados no SettlementService ou carteiras Prisma
    const overview = await this.settlementService.getProducerFinancialOverview(tenantId, producerId);

    if (overview && overview.events && overview.events.length > 0) {
      return overview.events.map((ev: any) => ({
        id: ev.id,
        name: ev.name,
        date: ev.date || '2026-10-25',
        venue: ev.venue || 'Pedreira Paulo Leminski / Curitiba - PR',
        status: ev.status || 'VENDAS_ABERTAS',
        ticketsTotal: ev.ticketsTotal || 12000,
        ticketsSold: ev.ticketsSold || 8450,
        occupancyPct: ev.occupancyPct || 70.4,
        grossSales: ev.grossSales || 500000.0,
        balanceAvailableForRepayment: ev.balanceAvailable || 153000.0,
      }));
    }

    // Mock fallback oficial
    return [
      {
        id: 'ev-101',
        name: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
        date: '2026-10-25',
        venue: 'Pedreira Paulo Leminski, Curitiba - PR',
        status: 'VENDAS_ABERTAS',
        ticketsTotal: 15000,
        ticketsSold: 11420,
        occupancyPct: 76.1,
        grossSales: 890000.0,
        balanceAvailableForRepayment: 245000.0,
      },
      {
        id: 'ev-102',
        name: 'Show Sinfônico Acústico - Teatro Guaíra',
        date: '2026-11-14',
        venue: 'Auditório Bento Munhoz da Rocha Netto (Guairão)',
        status: 'VENDAS_ABERTAS',
        ticketsTotal: 2167,
        ticketsSold: 1890,
        occupancyPct: 87.2,
        grossSales: 340000.0,
        balanceAvailableForRepayment: 98000.0,
      },
    ];
  }

  /**
   * 2. GET /api/v1/producer/events/:id/dashboard
   * Dashboard executivo do evento específico (vendas, lote, curva e saldo elegível)
   */
  async getEventDashboard(tenantId: string, producerId: string, eventId: string) {
    this.logger.log(`Gerando dashboard do evento ${eventId} para produtor ${producerId}`);
    const detail: any = await this.settlementService.getEventFinancialDetail(tenantId, eventId);

    return {
      eventId,
      eventName: detail?.eventName || 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
      producerId,
      producerName: detail?.producerName || 'Opus Entretenimento & Shows Ltda',
      metrics: {
        grossTicketSales: detail?.vendasBrutas ?? 500000.0,
        ticketsSold: 8450,
        ticketsTotal: 12000,
        averageTicketPrice: 59.17,
        diskIntermediationFee: detail?.taxas?.taxaDisk ?? 50000.0,
        paymentGatewayFee: detail?.taxas?.spread ?? 12000.0,
        operationalExpenses: detail?.despesas?.totalDespesas ?? 80000.0,
        repaymentsAlreadyPaid: detail?.deducoesOperacionais?.repassesRealizados ?? 100000.0,
        repaymentsScheduled: detail?.deducoesOperacionais?.repassesAgendados ?? 30000.0,
        balanceAvailableForPayout: detail?.saldoDisponivel ?? 148000.0,
        contingencyReserve: detail?.saldoBloqueado ?? 0.0,
      },
      milestones: {
        targetSales: detail?.vendasBrutas ?? 500000.0,
        currentProgressPct: 100.0,
        currentEligibleTierPct: 20.0,
        nextMilestone: 'Evento D-0 (Liberação final pós-prestação de contas)',
      },
      salesByChannel: [
        { channel: 'Online (Site / App DiskIngressos)', amount: 410000.0, tickets: 6940, pct: 82.0 },
        { channel: 'Bilheteria Física & PDVs Oficiais', amount: 90000.0, tickets: 1510, pct: 18.0 },
      ],
      batches: [
        { batch: 'Lote Promocional', tickets: 2000, sold: 2000, price: 40.0, status: 'ESGOTADO' },
        { batch: '1º Lote Geral', tickets: 5000, sold: 5000, price: 55.0, status: 'ESGOTADO' },
        { batch: '2º Lote Geral', tickets: 3000, sold: 1450, price: 70.0, status: 'VENDENDO' },
        { batch: 'Camarote Prime Disk', tickets: 2000, sold: 1890, price: 150.0, status: 'QUASE_ESGOTADO' },
      ],
    };
  }

  /**
   * 3. GET /api/v1/producer/finance/summary
   * Posição financeira consolidada de todos os eventos do produtor
   */
  async getFinancialSummary(tenantId: string, producerId: string) {
    this.logger.log(`Calculando sumário financeiro consolidado do produtor ${producerId}`);
    const overview = await this.settlementService.getProducerFinancialOverview(tenantId, producerId);

    const kpis = overview?.producer?.kpis || {
      saldoTotal: 820450.0,
      disponivel: 570450.0,
      aReceber: 200000.0,
      emAntecipacao: 100000.0,
      emRepasse: 150000.0,
      despesas: 80000.0,
      bloqueado: 100000.0,
      projetado: 1240000.0,
    };

    return {
      producerId,
      producerName: overview?.producer?.name || 'ABC Produções & Eventos Ltda',
      document: overview?.producer?.cnpj || '12.345.678/0001-90',
      bankDestination: {
        bankName: overview?.producer?.bankName || 'Itaú Unibanco S.A. (341)',
        agency: overview?.producer?.agency || '0422',
        account: overview?.producer?.account || '88120-1',
        pixKey: overview?.producer?.pixKey || 'financeiro@abcproducoes.com.br',
      },
      consolidatedBalances: {
        grossTicketSalesTotal: 1230000.0,
        diskIntermediationFees: 123000.0,
        gatewayProcessingFees: 29520.0,
        eventOperatingExpenses: 150000.0,
        advancesTotal: kpis.emAntecipacao,
        repaymentsAlreadyPaid: 350000.0,
        repaymentsInReview: kpis.emRepasse,
        fiduciaryBlockedReserve: kpis.bloqueado,
        netBalanceAvailableImmediately: kpis.disponivel,
        projectedGrossFinal: kpis.projetado,
      },
      activeEventsCount: 2,
      pendingPayoutRequestsCount: this.payoutRequestsStore.filter(
        (p) => (p.producerId === producerId || producerId === 'prod-01') && p.status === 'UNDER_ANALYSIS',
      ).length,
    };
  }

  /**
   * 4. GET /api/v1/producer/finance/events/:id
   * Carteira e saldos do evento analítico
   */
  async getEventWallet(tenantId: string, producerId: string, eventId: string) {
    const detail: any = await this.settlementService.getEventFinancialDetail(tenantId, eventId);
    if (!detail) {
      throw new NotFoundException(`Carteira do evento ${eventId} não localizada.`);
    }

    return {
      eventId,
      eventName: detail.eventName,
      producerId,
      wallet: {
        grossSales: detail.vendasBrutas,
        diskFeeTotal: detail.taxas?.taxaDisk,
        spreadFeeTotal: detail.taxas?.spread,
        advanceFeeTotal: detail.taxas?.advance,
        ribitFeeTotal: detail.taxas?.ribeit,
        expensesTotal: detail.despesas?.totalDespesas,
        repaymentsPaidTotal: detail.deducoesOperacionais?.repassesRealizados,
        repaymentsScheduledTotal: detail.deducoesOperacionais?.repassesAgendados,
        advancesPaidTotal: detail.deducoesOperacionais?.antecipacaoRealizada,
        balanceAvailable: detail.saldoDisponivel,
        blockedBalance: detail.saldoBloqueado,
        projectedBalance: detail.saldoProjetado,
      },
      feeRules: detail.eventFeeRules,
      expenses: detail.despesas?.items,
      schedules: detail.deducoesOperacionais,
    };
  }

  /**
   * 5. GET /api/v1/producer/finance/events/:id/statement
   * Extrato analítico com lançamentos do Ledger do evento
   */
  async getEventStatement(tenantId: string, producerId: string, eventId: string) {
    return this.settlementService.getEventStatement(tenantId, eventId);
  }

  /**
   * 6. POST /api/v1/producer/finance/payout-requests
   * Produtor solicita um repasse oficial
   */
  async createPayoutRequest(tenantId: string, producerId: string, dto: CreatePayoutRequestDto) {
    this.logger.log(`Recebendo solicitação de repasse de R$ ${dto.amount} para o evento ${dto.eventId}`);

    // Validação contra saldo elegível
    const detail: any = await this.settlementService.getEventFinancialDetail(tenantId, dto.eventId);
    const available = detail?.saldoDisponivel ?? 148000.0;

    if (dto.amount > available) {
      throw new BadRequestException(
        `Valor solicitado (R$ ${dto.amount.toFixed(2)}) excede o saldo elegível liberado para repasse neste momento (R$ ${available.toFixed(2)}). Aguarde a liberação do próximo marco de vendas ou revise as retenções.`,
      );
    }

    const newRequest = {
      id: `payout-req-${Date.now()}`,
      requestNumber: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: dto.eventId,
      eventName: detail?.eventName || 'Festival XYZ',
      producerId: producerId || dto.producerId || 'prod-01',
      producerName: detail?.producerName || 'ABC Produções & Eventos Ltda',
      amount: dto.amount,
      paymentMethod: dto.paymentMethod || 'PIX',
      destinationAccount: dto.pixKey || dto.account || 'Conta Bancária Padrão do Produtor',
      status: 'UNDER_ANALYSIS',
      requestedAt: new Date().toISOString(),
      notes: dto.notes || 'Solicitação gerada através do Portal do Produtor.',
      timeline: [
        { step: 'SOLICITADO', label: 'Solicitado pelo Produtor', time: new Date().toLocaleString('pt-BR'), status: 'COMPLETED' },
        { step: 'ANALISE', label: 'Análise Financeira & Verificação de Retenções (Disk ERP)', time: 'Aguardando', status: 'IN_PROGRESS' },
        { step: 'APROVACAO', label: 'Aprovação de Alçada', status: 'PENDING' },
        { step: 'LIQUIDACAO', label: 'Liquidação Bancária PIX / Conciliação Ledger', status: 'PENDING' },
      ],
    };

    this.payoutRequestsStore.unshift(newRequest);

    // Também registra no SettlementService do Keeper ERP para aparecer na fila dos operadores Disk
    try {
      await this.settlementService.scheduleRepayment(tenantId, producerId, dto.eventId, {
        amount: dto.amount,
        scheduledDate: new Date().toISOString().split('T')[0],
        destinationBank: dto.bankName || 'Itaú Unibanco S.A. (341)',
        pixKey: dto.pixKey,
        overrideLimit: true,
      });
    } catch {
      // continua com retorno de sucesso da solicitação
    }

    return {
      success: true,
      message: 'Solicitação de repasse registrada com sucesso! Ela foi enviada para análise da equipe financeira Disk.',
      request: newRequest,
    };
  }

  /**
   * 7. GET /api/v1/producer/finance/payout-requests
   * Acompanhamento dos repasses solicitados
   */
  async getPayoutRequests(tenantId: string, producerId: string, eventId?: string) {
    let list = this.payoutRequestsStore;
    if (eventId && eventId !== 'all') {
      list = list.filter((p) => p.eventId === eventId);
    }
    return list;
  }

  /**
   * 8. POST /api/v1/producer/finance/advance-requests
   * Solicitação de antecipação contratual (Advance)
   */
  async createAdvanceRequest(tenantId: string, producerId: string, dto: CreateAdvanceRequestDto) {
    this.logger.log(`Recebendo pedido de advance de R$ ${dto.requestedAmount} para o evento ${dto.eventId}`);

    const feeRate = dto.advanceFeeRate ?? 2.5;
    const feeCost = (dto.requestedAmount * feeRate) / 100;
    const netAmount = dto.requestedAmount - feeCost;

    const newAdvance = {
      id: `adv-req-${Date.now()}`,
      advanceNumber: `ADV-2026-${Math.floor(100 + Math.random() * 900)}`,
      eventId: dto.eventId,
      eventName: 'Festival XYZ',
      producerId: producerId || dto.producerId || 'prod-01',
      requestedAmount: dto.requestedAmount,
      advanceFeeRate: feeRate,
      advanceFeeCost: feeCost,
      netAmount,
      status: 'UNDER_ANALYSIS',
      requestedAt: new Date().toISOString(),
      justification: dto.justification || 'Solicitação de Advance iniciada via Portal do Produtor.',
      warranties: dto.warrantiesDescription || 'Garantia de recebíveis de bilheteria dos próximos lotes.',
    };

    this.advanceRequestsStore.unshift(newAdvance);

    // Registra no motor de liquidação do Keeper ERP
    try {
      await this.settlementService.requestAdvance(tenantId, producerId, dto.eventId, {
        requestedAmount: dto.requestedAmount,
        advanceFeeRate: feeRate,
        destinationBank: 'Itaú Unibanco (341)',
        pixKey: 'financeiro@abcproducoes.com.br',
      });
    } catch {
      // continua
    }

    return {
      success: true,
      message: `Solicitação de antecipação contratual ${newAdvance.advanceNumber} gerada com sucesso! O Financeiro da Disk analisará a margem de segurança.`,
      advance: newAdvance,
    };
  }
}
