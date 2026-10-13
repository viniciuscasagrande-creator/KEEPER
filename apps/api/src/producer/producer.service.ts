import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SettlementService } from '../financeiro/settlement/settlement.service';
import { CreatePayoutRequestDto, CreateAdvanceRequestDto } from './dto/producer-requests.dto';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

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

    const overview = await this.settlementService.getProducerFinancialOverview(tenantId, producerId);

    if (overview && overview.events && overview.events.length > 0) {
      return overview.events.map((ev: any) => ({
        id: ev.id,
        name: ev.name,
        date: ev.date || '2026-10-25',
        venue: ev.venue || 'Local Principal',
        status: 'VENDAS_ABERTAS',
        ticketsTotal: 10000,
        ticketsSold: Math.round(Number(ev.vendasBrutas || 0) / 75) || 0,
        occupancyPct: 0,
        grossSales: ev.vendasBrutas || 0,
        balanceAvailableForRepayment: ev.disponivel || 0,
      }));
    }

    return [];
  }

  /**
   * 2. GET /api/v1/producer/events/:id
   * Detalhes operacionais e de vendas de um evento específico
   */
  async getEventDetail(tenantId: string, producerId: string, eventId: string) {
    const detail = await this.settlementService.getEventFinancialDetail(tenantId, eventId);
    if (!detail) {
      throw new NotFoundException(`Evento com ID '${eventId}' não encontrado.`);
    }

    return {
      id: detail.eventId,
      name: detail.eventName,
      date: detail.date,
      venue: detail.venue,
      status: 'VENDAS_ABERTAS',
      producerId: detail.producerId,
      producerName: detail.producerName,
      salesOverview: {
        grossSales: detail.vendasBrutas,
        diskFeeTotal: detail.taxas.taxaDisk,
        netRevenue: detail.saldoEconomico,
        balanceAvailable: detail.saldoDisponivel,
      },
    };
  }

  /**
   * Painel analítico do evento com métricas de vendas e liquidação
   */
  async getEventDashboard(tenantId: string, producerId: string, eventId: string) {
    return this.getEventDetail(tenantId, producerId, eventId);
  }

  /**
   * 3. GET /api/v1/producer/finance/summary
   * Posição financeira consolidada de todos os eventos do produtor
   */
  async getFinancialSummary(tenantId: string, producerId: string) {
    this.logger.log(`Calculando sumário financeiro consolidado do produtor ${producerId}`);
    const overview = await this.settlementService.getProducerFinancialOverview(tenantId, producerId);

    const pendingCount = await this.prisma.settlementSchedule.count({
      where: {
        tenantId,
        producerId,
        status: 'PENDING',
      },
    });

    const kpis = overview?.consolidatedKpis || {
      saldoTotal: 0,
      disponivel: 0,
      aReceber: 0,
      emAntecipacao: 0,
      emRepasse: 0,
      despesas: 0,
      bloqueado: 0,
      projetado: 0,
    };

    return {
      producerId,
      producerName: overview?.producer?.name || 'Produtor',
      document: overview?.producer?.cnpj || '',
      bankDestination: {
        bankName: overview?.producer?.bankName || '',
        agency: overview?.producer?.agency || '',
        account: overview?.producer?.account || '',
        pixKey: overview?.producer?.pixKey || '',
      },
      consolidatedBalances: {
        grossTicketSalesTotal: overview?.totals?.vendas || 0,
        diskIntermediationFees: 0,
        gatewayProcessingFees: 0,
        eventOperatingExpenses: kpis.despesas,
        advancesTotal: kpis.emAntecipacao,
        repaymentsAlreadyPaid: 0,
        repaymentsInReview: kpis.emRepasse,
        fiduciaryBlockedReserve: kpis.bloqueado,
        netBalanceAvailableImmediately: kpis.disponivel,
        projectedGrossFinal: kpis.projetado,
      },
      activeEventsCount: overview?.events?.length || 0,
      pendingPayoutRequestsCount: pendingCount,
    };
  }

  /**
   * 4. GET /api/v1/producer/finance/events/:id
   * Carteira e saldos do evento analítico
   */
  async getEventWallet(tenantId: string, producerId: string, eventId: string) {
    const detail = await this.settlementService.getEventFinancialDetail(tenantId, eventId);
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
      expenses: detail.despesas?.items || [],
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
   * Produtor solicita um repasse oficial (Persistência real no PostgreSQL via Prisma)
   */
  async createPayoutRequest(tenantId: string, producerId: string, dto: CreatePayoutRequestDto) {
    this.logger.log(`Recebendo solicitação de repasse de R$ ${dto.amount} para o evento ${dto.eventId}`);

    const result = await this.settlementService.scheduleRepayment(tenantId, producerId, dto.eventId, {
      amount: dto.amount,
      scheduledDate: new Date().toISOString().split('T')[0],
      destinationBank: dto.bankName || 'Itaú Unibanco S.A.',
      pixKey: dto.pixKey,
      overrideLimit: false,
    });

    return {
      success: true,
      message: 'Solicitação de repasse registrada com sucesso no banco de dados e enviada para aprovação!',
      request: result.repayment,
    };
  }

  /**
   * 7. GET /api/v1/producer/finance/payout-requests
   * Acompanhamento dos repasses solicitados diretamente da tabela settlement_schedules
   */
  async getPayoutRequests(tenantId: string, producerId: string, eventId?: string) {
    const dbSchedules = await this.prisma.settlementSchedule.findMany({
      where: {
        tenantId,
        ...(producerId ? { producerId } : {}),
        ...(eventId && eventId !== 'all' ? { eventWalletId: eventId } : {}),
      },
      include: {
        wallet: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return (dbSchedules || []).map((s) => ({
      id: s.id,
      requestNumber: s.scheduleNumber,
      eventId: s.eventWalletId,
      eventName: s.wallet?.eventName || 'Evento DiskIngressos',
      producerId: s.producerId,
      producerName: s.wallet?.producerName || 'Produtora',
      amount: Number(s.amount),
      paymentMethod: s.paymentMethod,
      destinationAccount: s.destinationPixKey || s.destinationBank || 'Conta Cadastrada',
      status: s.status,
      requestedAt: s.createdAt.toISOString(),
      paidAt: s.paidAt?.toISOString(),
      timeline: [
        { step: 'SOLICITADO', label: 'Solicitado pelo Produtor', time: s.createdAt.toLocaleString('pt-BR'), status: 'COMPLETED' },
        { step: 'ANALISE', label: 'Análise de Retenções', time: 'Em processamento', status: s.status === 'PAID' ? 'COMPLETED' : 'IN_PROGRESS' },
        { step: 'APROVACAO', label: 'Aprovação de Alçada', status: s.status === 'PAID' ? 'COMPLETED' : 'PENDING' },
        { step: 'LIQUIDACAO', label: 'Liquidação Bancária PIX', status: s.status === 'PAID' ? 'COMPLETED' : 'PENDING' },
      ],
    }));
  }

  /**
   * 8. POST /api/v1/producer/finance/advance-requests
   * Solicitação de antecipação contratual (Advance) com persistência em PostgreSQL
   */
  async createAdvanceRequest(tenantId: string, producerId: string, dto: CreateAdvanceRequestDto) {
    this.logger.log(`Recebendo pedido de advance de R$ ${dto.requestedAmount} para o evento ${dto.eventId}`);

    const feeRate = dto.advanceFeeRate ?? 2.5;

    const result = await this.settlementService.requestAdvance(tenantId, producerId, dto.eventId, {
      requestedAmount: dto.requestedAmount,
      advanceFeeRate: feeRate,
      destinationBank: 'Itaú Unibanco (341)',
      pixKey: 'pix@produtor.com.br',
    });

    return {
      success: true,
      message: `Solicitação de antecipação registrada com sucesso no banco de dados!`,
      advance: result.advance,
    };
  }

  /**
   * 9. GET /api/v1/producer/finance/advance-requests
   * Lista as antecipações salvas no banco de dados via Prisma
   */
  async getAdvanceRequests(tenantId: string, producerId: string, eventId?: string) {
    const dbAdvances = await this.prisma.producerAdvance.findMany({
      where: {
        tenantId,
        ...(producerId ? { producerId } : {}),
        ...(eventId && eventId !== 'all' ? { eventWalletId: eventId } : {}),
      },
      include: {
        wallet: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return (dbAdvances || []).map((a) => ({
      id: a.id,
      advanceNumber: a.advanceNumber,
      eventId: a.eventWalletId,
      eventName: a.wallet?.eventName || 'Evento',
      producerId: a.producerId,
      producerName: a.wallet?.producerName || 'Produtor',
      requestedAmount: Number(a.requestedAmount),
      advanceFeeRate: Number(a.advanceFeeRate),
      advanceFeeCost: Number(a.advanceFeeCost),
      netAmount: Number(a.netAmount),
      status: a.status,
      requestedAt: a.createdAt.toISOString(),
      paidAt: a.paidAt?.toISOString(),
      justification: 'Solicitação registrada via Portal do Produtor',
      warranties: 'Trava sobre recebíveis do evento',
    }));
  }
}
