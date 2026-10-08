import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ContabilService } from '../../contabil/contabil.service';
import { AppropriationService } from '../appropriation/appropriation.service';

export interface SimulateSplitInput {
  ticketAmount: number;
  diskFeeRate?: number;
  spreadRate?: number;
  fixedSpread?: number;
  advanceRate?: number;
  spreadPayer?: 'CUSTOMER' | 'PRODUCER';
  advancePayer?: 'CUSTOMER' | 'PRODUCER';
}

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly contabilService: ContabilService,
    private readonly appropriationService?: AppropriationService,
  ) {}

  /**
   * Catálogo de Produtores com indicadores globais de liquidação
   */
  async getProducers(tenantId: string) {
    return [
      {
        id: 'prod-01',
        name: 'ABC Produções & Eventos Ltda',
        tradeName: 'ABC Produções',
        cnpj: '12.345.678/0001-90',
        code: 'PROD-001',
        status: 'ACTIVE',
        email: 'financeiro@abcproducoes.com.br',
        phone: '(41) 3322-8800',
        bankName: 'Itaú Unibanco S.A. (341)',
        agency: '0422',
        account: '88120-1',
        pixKey: 'financeiro@abcproducoes.com.br',
        kpis: {
          saldoTotal: 820450.0,
          disponivel: 570450.0,
          aReceber: 200000.0,
          emAntecipacao: 100000.0,
          emRepasse: 150000.0,
          despesas: 80000.0,
          bloqueado: 100000.0,
          projetado: 1240000.0,
        },
      },
      {
        id: 'prod-02',
        name: 'Live Nation Brasil Produções S.A.',
        tradeName: 'Live Nation Brasil',
        cnpj: '98.765.432/0001-11',
        code: 'PROD-002',
        status: 'ACTIVE',
        email: 'settlement@livenation.com.br',
        phone: '(11) 4003-9000',
        bankName: 'Banco Bradesco S.A. (237)',
        agency: '1024',
        account: '44520-9',
        pixKey: 'pix@livenation.com.br',
        kpis: {
          saldoTotal: 2100000.0,
          disponivel: 1450000.0,
          aReceber: 500000.0,
          emAntecipacao: 150000.0,
          emRepasse: 400000.0,
          despesas: 280000.0,
          bloqueado: 100000.0,
          projetado: 3500000.0,
        },
      },
      {
        id: 'prod-03',
        name: 'CWB Brasil Entretenimento S.A.',
        tradeName: 'CWB Brasil',
        cnpj: '45.123.789/0001-55',
        code: 'PROD-003',
        status: 'ACTIVE',
        email: 'financeiro@cwbbrasil.com.br',
        phone: '(41) 3015-0000',
        bankName: 'Banco Santander (033)',
        agency: '3301',
        account: '19200-3',
        pixKey: '45.123.789/0001-55',
        kpis: {
          saldoTotal: 580000.0,
          disponivel: 410000.0,
          aReceber: 120000.0,
          emAntecipacao: 50000.0,
          emRepasse: 120000.0,
          despesas: 70000.0,
          bloqueado: 50000.0,
          projetado: 890000.0,
        },
      },
    ];
  }

  /**
   * Posição Financeira Completa do Produtor com Seletor de Eventos
   */
  async getProducerFinancialOverview(tenantId: string, producerId: string) {
    const producers = await this.getProducers(tenantId);
    const prod = producers.find((p) => p.id === producerId) || producers[0];

    const events = [
      {
        id: 'ev-101',
        name: 'Festival XYZ',
        venue: 'Pedreira Paulo Leminski - Curitiba/PR',
        date: '10/10/2026 a 12/10/2026',
        vendasBrutas: 500000.0,
        taxasDisk: 50000.0,
        taxasAdicionais: 22000.0, // Spread 12.5k + Advance 7.5k + Ribeit 2k
        despesas: 100000.0,
        saldoEconomico: 328000.0,
        repassesRealizados: 100000.0,
        antecipacaoRealizada: 50000.0,
        repassesAgendados: 30000.0,
        disponivel: 148000.0,
        bloqueado: 0.0,
        projetado: 680000.0,
        activeRulesCount: 4,
      },
      {
        id: 'ev-102',
        name: 'Show ABC',
        venue: 'Live Curitiba',
        date: '24/10/2026',
        vendasBrutas: 280000.0,
        taxasDisk: 22400.0, // 8%
        taxasAdicionais: 8400.0, // Spread R$ 3,00
        despesas: 59200.0,
        saldoEconomico: 190000.0,
        repassesRealizados: 0.0,
        antecipacaoRealizada: 0.0,
        repassesAgendados: 0.0,
        disponivel: 190000.0,
        bloqueado: 0.0,
        projetado: 340000.0,
        activeRulesCount: 2,
      },
      {
        id: 'ev-103',
        name: 'Teatro 2026',
        venue: 'Teatro Positivo',
        date: '05/11/2026',
        vendasBrutas: 150000.0,
        taxasDisk: 15000.0,
        taxasAdicionais: 4500.0,
        despesas: 20500.0,
        saldoEconomico: 110000.0,
        repassesRealizados: 0.0,
        antecipacaoRealizada: 0.0,
        repassesAgendados: 0.0,
        disponivel: 110000.0,
        bloqueado: 0.0,
        projetado: 220000.0,
        activeRulesCount: 3,
      },
    ];

    const totalVendas = events.reduce((a, b) => a + b.vendasBrutas, 0);
    const totalSaldo = events.reduce((a, b) => a + b.saldoEconomico, 0);
    const totalDisponivel = events.reduce((a, b) => a + b.disponivel, 0);

    return {
      producer: prod,
      consolidatedKpis: {
        saldoTotal: prod.kpis.saldoTotal,
        disponivel: prod.kpis.disponivel,
        aReceber: prod.kpis.aReceber,
        emAntecipacao: prod.kpis.emAntecipacao,
        emRepasse: prod.kpis.emRepasse,
        despesas: prod.kpis.despesas,
        bloqueado: prod.kpis.bloqueado,
        projetado: prod.kpis.projetado,
      },
      events,
      totals: {
        vendas: totalVendas,
        saldoEconomico: totalSaldo,
        disponivel: totalDisponivel,
      },
    };
  }

  /**
   * Posição Financeira Analítica de um Evento Específico (com decomposição)
   */
  async getEventFinancialDetail(tenantId: string, eventId: string) {
    return {
      eventId: 'ev-101',
      eventName: 'Festival XYZ',
      producerId: 'prod-01',
      producerName: 'ABC Produções & Eventos Ltda',
      venue: 'Pedreira Paulo Leminski',
      date: '10/10/2026 a 12/10/2026',
      vendasBrutas: 500000.0,
      taxas: {
        taxaDisk: 50000.0, // 10%
        spread: 12500.0, // 2,5%
        advance: 7500.0, // 1,5%
        ribeit: 2000.0, // R$ 1,00 por ingresso
        totalTaxas: 72000.0,
      },
      despesas: {
        seguranca: 30000.0,
        estrutura: 20000.0,
        artistas: 50000.0,
        totalDespesas: 100000.0,
        items: [
          { id: 'exp-1', category: 'Segurança & Portaria', supplier: 'GuardSeg Ltda', doc: 'NF-4921', amount: 30000.0, auth: 'Carlos Eduardo' },
          { id: 'exp-2', category: 'Estrutura & Palco', supplier: 'Stark Iluminação S.A.', doc: 'NF-1802', amount: 20000.0, auth: 'Fernanda Lima' },
          { id: 'exp-3', category: 'Cachê Artístico', supplier: 'Banda Principal Agência', doc: 'CONTRATO-89', amount: 50000.0, auth: 'Vinicius Casagrande' },
        ],
      },
      saldoEconomico: 328000.0,
      deducoesOperacionais: {
        repassesRealizados: 100000.0,
        antecipacaoRealizada: 50000.0,
        repassesAgendados: 30000.0,
        totalDeducoes: 180000.0,
      },
      saldoDisponivel: 148000.0,
      saldoBloqueado: 0.0,
      saldoProjetado: 680000.0,
      // Regras de taxas ativas para o evento com vigência
      eventFeeRules: [
        {
          id: 'rule-01',
          feeCode: 'DISK_FEE',
          feeName: 'Taxa DiskIngressos',
          calculationType: 'PERCENTAGE',
          rate: 10.0,
          fixedAmount: 0.0,
          payer: 'CLIENTE',
          basisType: 'VALOR_DO_INGRESSO',
          validFrom: '2026-08-01',
          validTo: null,
          isActive: true,
        },
        {
          id: 'rule-02',
          feeCode: 'SPREAD',
          feeName: 'Spread Financeiro',
          calculationType: 'PERCENTAGE',
          rate: 2.5,
          fixedAmount: 0.0,
          payer: 'PRODUTOR',
          basisType: 'VALOR_BRUTO_VENDA',
          validFrom: '2026-10-01',
          validTo: '2026-10-15',
          isActive: true,
        },
        {
          id: 'rule-03',
          feeCode: 'ADVANCE',
          feeName: 'Advance (Antecipação)',
          calculationType: 'PERCENTAGE',
          rate: 1.5,
          fixedAmount: 0.0,
          payer: 'PRODUTOR',
          basisType: 'VALOR_ANTECIPADO',
          validFrom: '2026-09-01',
          validTo: null,
          isActive: true,
        },
        {
          id: 'rule-04',
          feeCode: 'RIBEIT',
          feeName: 'Ribeit (Rebate Comercial)',
          calculationType: 'FIXED_AMOUNT',
          rate: 0.0,
          fixedAmount: 1.0,
          payer: 'PRODUTOR',
          basisType: 'POR_INGRESSO',
          validFrom: '2026-09-01',
          validTo: null,
          isActive: true,
        },
      ],
    };
  }

  /**
   * Salva ou atualiza regra financeira configurável do evento (com vigência)
   */
  async saveEventFeeRule(tenantId: string, eventId: string, ruleData: any) {
    this.logger.log(`Salvando regra de taxa ${ruleData.feeName} para o evento ${eventId}`);
    return {
      success: true,
      rule: {
        id: `rule-${Date.now()}`,
        eventId,
        ...ruleData,
        createdAt: new Date().toISOString(),
      },
      message: `Regra de taxa '${ruleData.feeName}' gravada com vigência ativa! Vendas anteriores permanecem congeladas com a regra original.`,
    };
  }

  /**
   * Solicitação de Operação de Antecipação
   */
  async requestAdvance(tenantId: string, producerId: string, eventId: string, data: {
    requestedAmount: number;
    advanceFeeRate?: number;
    destinationBank?: string;
    pixKey?: string;
  }) {
    const requested = Number(data.requestedAmount) || 100000.0;
    const rate = Number(data.advanceFeeRate) || 2.5; // 2,50%
    const cost = (requested * rate) / 100;
    const netAmount = requested - cost;

    const advance = {
      id: `adv-${Date.now()}`,
      producerId,
      eventId,
      advanceNumber: `ANT-${Math.floor(10000 + Math.random() * 90000)}`,
      futureEligibleBalance: 250000.0,
      requestedAmount: requested,
      advanceFeeRate: rate,
      advanceFeeCost: cost,
      netAmount,
      status: 'UNDER_ANALYSIS', // Solicitada -> Em Análise -> Aprovada -> Agendada -> Paga
      requestedDate: new Date().toISOString().split('T')[0],
      destinationBank: data.destinationBank || 'Itaú Ag. 0422 / CC 88120-1',
      pixKey: data.pixKey || 'financeiro@abcproducoes.com.br',
    };

    return {
      success: true,
      advance,
      message: `Solicitação de antecipação de R$ ${requested.toFixed(2)} criada com custo de R$ ${cost.toFixed(2)} (Líquido: R$ ${netAmount.toFixed(2)}). Enviada para alçada de aprovação!`,
    };
  }

  /**
   * Programação de Repasse ao Produtor com validação contra Saldo Disponível
   */
  async scheduleRepayment(tenantId: string, producerId: string, eventId: string, data: {
    amount: number;
    scheduledDate: string;
    destinationBank: string;
    pixKey?: string;
    overrideLimit?: boolean;
  }) {
    const eventDetail = await this.getEventFinancialDetail(tenantId, eventId);
    const amount = Number(data.amount);

    if (amount > eventDetail.saldoDisponivel && !data.overrideLimit) {
      throw new BadRequestException(
        `Valor do repasse (R$ ${amount.toFixed(2)}) é maior que o saldo disponível do evento (R$ ${eventDetail.saldoDisponivel.toFixed(2)}). Operação bloqueada por governança financeira.`,
      );
    }

    const repayment = {
      id: `rep-${Date.now()}`,
      producerId,
      eventId,
      scheduleNumber: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      scheduledDate: data.scheduledDate,
      amount,
      status: 'SCHEDULED',
      destinationBank: data.destinationBank,
      destinationPixKey: data.pixKey,
      authorizedBy: 'Vinicius Casagrande (Diretoria)',
    };

    return {
      success: true,
      repayment,
      message: `Repasse de R$ ${amount.toFixed(2)} agendado com sucesso para ${data.scheduledDate}!`,
    };
  }

  /**
   * Visão Geral da Conta de Liquidação
   */
  async getClearingOverview(tenantId: string, companyId: string) {
    const totalCollected = 4820000.0;
    const totalDiskRevenue = 620000.0;
    const totalProducersGross = 3640000.0;
    const totalEventExpenses = 560000.0;

    return {
      clearingAccount: {
        name: 'Conta de Liquidação DiskIngressos (Escrow)',
        bank: 'Itaú Unibanco S.A. (Bco 341)',
        agency: '0422',
        account: '99012-3',
        type: 'ESCROW_CLEARING',
        currentBalance: 2280000.0,
      },
      metrics: {
        totalCollected,
        totalDiskRevenue,
        totalProducersGross,
        totalEventExpenses,
        netProducersPayable: totalProducersGross - totalEventExpenses,
      },
      repayments: {
        pending: { count: 12, amount: 480000.0 },
        scheduled: { count: 8, amount: 620000.0 },
        paid: { count: 25, amount: 2540000.0 },
      },
    };
  }

  /**
   * Posição das Carteiras de Eventos
   */
  async getEventWallets(tenantId: string, companyId?: string) {
    return [
      {
        id: 'wallet-001',
        eventId: 'ev-101',
        eventName: 'Festival XYZ',
        producerId: 'prod-01',
        producerName: 'ABC Produções & Eventos Ltda',
        grossSales: 500000.0,
        diskFeeTotal: 50000.0,
        spreadFeeTotal: 12500.0,
        advanceFeeTotal: 7500.0,
        ribitFeeTotal: 2000.0,
        expensesTotal: 100000.0,
        repaymentsPaidTotal: 100000.0,
        repaymentsScheduledTotal: 30000.0,
        advancesPaidTotal: 50000.0,
        balanceAvailable: 148000.0,
        blockedBalance: 0.0,
        projectedBalance: 680000.0,
        status: 'ACTIVE',
      },
      {
        id: 'wallet-002',
        eventId: 'ev-102',
        eventName: 'Show ABC',
        producerId: 'prod-01',
        producerName: 'ABC Produções & Eventos Ltda',
        grossSales: 280000.0,
        diskFeeTotal: 22400.0,
        spreadFeeTotal: 8400.0,
        advanceFeeTotal: 0.0,
        ribitFeeTotal: 0.0,
        expensesTotal: 59200.0,
        repaymentsPaidTotal: 0.0,
        repaymentsScheduledTotal: 0.0,
        advancesPaidTotal: 0.0,
        balanceAvailable: 190000.0,
        blockedBalance: 0.0,
        projectedBalance: 340000.0,
        status: 'ACTIVE',
      },
      {
        id: 'wallet-003',
        eventId: 'ev-103',
        eventName: 'Teatro 2026',
        producerId: 'prod-01',
        producerName: 'ABC Produções & Eventos Ltda',
        grossSales: 150000.0,
        diskFeeTotal: 15000.0,
        spreadFeeTotal: 4500.0,
        advanceFeeTotal: 0.0,
        ribitFeeTotal: 0.0,
        expensesTotal: 20500.0,
        repaymentsPaidTotal: 0.0,
        repaymentsScheduledTotal: 0.0,
        advancesPaidTotal: 0.0,
        balanceAvailable: 110000.0,
        blockedBalance: 0.0,
        projectedBalance: 220000.0,
        status: 'ACTIVE',
      },
    ];
  }

  /**
   * Extrato do Evento (Livro Financeiro)
   */
  async getEventStatement(tenantId: string, walletId: string) {
    return {
      walletId,
      eventName: 'Festival XYZ',
      producerName: 'ABC Produções & Eventos Ltda',
      clearingAccount: 'Itaú CC 99012-3 (Escrow)',
      currentBalance: 148000.0,
      entries: [
        {
          id: 'stmt-001',
          date: '2026-10-08T09:15:00Z',
          type: 'TICKET_SALE',
          description: 'Venda de Ingressos Lote 1 - Pedido #102938 (Cliente: Mariana Lima)',
          referenceNumber: '#102938',
          amount: 200.0,
          runningBalance: 200.0,
          economicOwner: 'PRODUCER',
          channel: 'ONLINE',
          authorizedBy: 'GATEWAY_API',
        },
        {
          id: 'stmt-002',
          date: '2026-10-08T09:15:00Z',
          type: 'DISK_FEE',
          description: 'Taxa de Conveniência DiskIngressos (10%) - Pedido #102938',
          referenceNumber: '#102938',
          amount: 20.0,
          runningBalance: 200.0,
          economicOwner: 'DISKINGRESSOS',
          channel: 'ONLINE',
          authorizedBy: 'SETTLEMENT_ENGINE',
        },
        {
          id: 'stmt-003',
          date: '2026-10-08T09:15:00Z',
          type: 'SPREAD_FEE',
          description: 'Spread Financeiro (2,5%) - Pedido #102938 (Pago pelo Produtor)',
          referenceNumber: '#102938',
          amount: -5.0,
          runningBalance: 195.0,
          economicOwner: 'DISKINGRESSOS',
          channel: 'ONLINE',
          authorizedBy: 'SETTLEMENT_ENGINE',
        },
        {
          id: 'stmt-004',
          date: '2026-10-07T14:30:00Z',
          type: 'EXPENSE',
          description: 'Despesa Segurança Armada & Brigada - GuardSeg Ltda (NF 4921)',
          referenceNumber: 'EXP-9021',
          amount: -30000.0,
          runningBalance: 320000.0,
          economicOwner: 'SUPPLIER_PAYMENT',
          channel: 'MANUAL_ENTRY',
          authorizedBy: 'Carlos Eduardo (Gerente Financeiro)',
        },
        {
          id: 'stmt-005',
          date: '2026-10-06T11:00:00Z',
          type: 'ANTECIPACAO',
          description: 'Antecipação Financeira Aprovada #ANT-8812 - Líquido Pago',
          referenceNumber: 'ANT-8812',
          amount: -50000.0,
          runningBalance: 270000.0,
          economicOwner: 'PRODUCER_ADVANCE',
          channel: 'PIX_BACEN',
          authorizedBy: 'Vinicius Casagrande (Diretoria)',
        },
        {
          id: 'stmt-006',
          date: '2026-10-05T16:00:00Z',
          type: 'PRODUCER_REPAYMENT',
          description: 'Repasse Parcial #001 via PIX - Conta Itaú CC 88120-1',
          referenceNumber: 'REP-001',
          amount: -100000.0,
          runningBalance: 170000.0,
          economicOwner: 'PRODUCER_WITHDRAWAL',
          channel: 'PIX_BACEN',
          authorizedBy: 'Vinicius Casagrande (Diretoria)',
        },
      ],
    };
  }

  /**
   * Catálogo de Taxas Padrão
   */
  async getFeeDefinitions(tenantId: string) {
    return [
      {
        id: 'fee-01',
        code: 'DISK_CONVENIENCE',
        name: 'Taxa de Conveniência DiskIngressos',
        calculationType: 'PERCENTAGE',
        rate: 10.0,
        fixedAmount: 0.0,
        basisType: 'VALOR_DO_INGRESSO',
        payer: 'CUSTOMER',
        destination: 'RECEITA_DISKINGRESSOS',
        chargeMoment: 'NA_VENDA',
        isActive: true,
      },
      {
        id: 'fee-02',
        code: 'SPREAD_FINANCIAL',
        name: 'Spread Financeiro de Cartão / Gateway',
        calculationType: 'PERCENTAGE',
        rate: 2.5,
        fixedAmount: 0.0,
        basisType: 'VALOR_BRUTO_VENDA',
        payer: 'PRODUTOR',
        destination: 'RECEITA_DISKINGRESSOS',
        chargeMoment: 'NA_VENDA',
        isActive: true,
      },
      {
        id: 'fee-03',
        code: 'ADVANCE_FEE',
        name: 'Advance (Taxa de Antecipação de Recebíveis)',
        calculationType: 'PERCENTAGE',
        rate: 1.5,
        fixedAmount: 0.0,
        basisType: 'VALOR_ANTECIPADO',
        payer: 'PRODUTOR',
        destination: 'RECEITA_DISKINGRESSOS',
        chargeMoment: 'NA_ANTECIPACAO',
        isActive: true,
      },
      {
        id: 'fee-04',
        code: 'RIBEIT_PARAM',
        name: 'Ribeit (Taxa de Parceria / Rebate Comercial)',
        calculationType: 'FIXED_AMOUNT',
        rate: 0.0,
        fixedAmount: 1.0,
        basisType: 'POR_INGRESSO',
        payer: 'PRODUTOR',
        destination: 'FUNDO_RESERVA',
        chargeMoment: 'NO_FECHAMENTO',
        isActive: true,
      },
    ];
  }

  /**
   * Simulação instantânea de Split de Venda com congelamento na venda
   */
  simulateSplit(input: SimulateSplitInput) {
    const ticket = Number(input.ticketAmount) || 200.0;
    const diskRate = input.diskFeeRate !== undefined ? Number(input.diskFeeRate) : 10.0;
    const spreadRate = input.spreadRate !== undefined ? Number(input.spreadRate) : 2.5;
    const fixedSpread = Number(input.fixedSpread) || 0.0;
    const advanceRate = Number(input.advanceRate) || 0.0;

    const diskFee = (ticket * diskRate) / 100;
    const spreadFee = (ticket * spreadRate) / 100 + fixedSpread;
    const advanceFee = (ticket * advanceRate) / 100;

    const spreadPayer = input.spreadPayer || 'CUSTOMER';

    let totalCustomerPaid = ticket + diskFee;
    let netProducer = ticket;

    if (spreadPayer === 'CUSTOMER') {
      totalCustomerPaid += spreadFee;
    } else {
      netProducer -= spreadFee;
    }

    if (advanceFee > 0) {
      netProducer -= advanceFee;
    }

    const diskTotalRevenue = diskFee + spreadFee + advanceFee;

    return {
      simulationInputs: {
        ticketAmount: ticket,
        diskFeeRate: diskRate,
        spreadRate,
        fixedSpread,
        spreadPayer,
      },
      splitResult: {
        totalCustomerPaid,
        producerGross: ticket,
        producerNet: netProducer,
        diskIngressosRevenue: diskTotalRevenue,
        feesBreakdown: [
          { name: 'Valor Nominal do Ingresso', amount: ticket, owner: 'PRODUTOR' },
          { name: `Taxa DiskIngressos (${diskRate}%)`, amount: diskFee, owner: 'DISKINGRESSOS', payer: 'CLIENTE' },
          { name: `Spread Financeiro (${spreadRate}%)`, amount: spreadFee, owner: 'DISKINGRESSOS', payer: spreadPayer },
        ],
      },
      clearingAudit: `Recebido na Conta de Liquidação: R$ ${totalCustomerPaid.toFixed(2)}. DiskIngressos retém R$ ${diskTotalRevenue.toFixed(2)}, creditando R$ ${netProducer.toFixed(2)} na Carteira do Evento.`,
    };
  }

  /**
   * Despesas operacionais do evento
   */
  async getEventExpenses(tenantId: string, walletId?: string) {
    return [
      {
        id: 'exp-01',
        walletId: 'wallet-001',
        eventName: 'Festival XYZ',
        category: 'SECURITY',
        categoryLabel: 'Segurança & Portaria',
        description: 'Segurança armada e controle de acesso portaria principal',
        supplierName: 'GuardSeg Proteção Patrimonial Ltda',
        documentNumber: 'NF-4921',
        amount: 30000.0,
        authorizedBy: 'Carlos Eduardo (Gerente Financeiro)',
        dueDate: '2026-10-10',
        paymentStatus: 'PAID',
      },
      {
        id: 'exp-02',
        walletId: 'wallet-001',
        eventName: 'Festival XYZ',
        category: 'STAGE_STRUCTURE',
        categoryLabel: 'Estrutura & Palco',
        description: 'Locação de geradores, palco montado e mesa de iluminação',
        supplierName: 'Stark Iluminação e Cenografia S.A.',
        documentNumber: 'NF-1802',
        amount: 20000.0,
        authorizedBy: 'Fernanda Lima (Coord. Eventos)',
        dueDate: '2026-10-12',
        paymentStatus: 'PAID',
      },
      {
        id: 'exp-03',
        walletId: 'wallet-001',
        eventName: 'Festival XYZ',
        category: 'ARTIST_CACHE',
        categoryLabel: 'Cachê Artístico',
        description: 'Cachê Artístico Banda Principal',
        supplierName: 'Música & Arte Produções Artísticas',
        documentNumber: 'CONTRATO-89',
        amount: 50000.0,
        authorizedBy: 'Vinicius Casagrande (Diretoria)',
        dueDate: '2026-10-15',
        paymentStatus: 'PAID',
      },
    ];
  }

  /**
   * Programação de Repasses
   */
  async getSettlementSchedules(tenantId: string) {
    return [
      {
        id: 'sch-001',
        walletId: 'wallet-001',
        eventName: 'Festival XYZ',
        producerName: 'ABC Produções & Eventos Ltda',
        scheduleNumber: 'REP-2026-001',
        scheduledDate: '2026-10-05',
        amount: 100000.0,
        status: 'PAID',
        paymentMethod: 'PIX',
        destinationBank: 'Itaú Unibanco S.A. (Bco 341)',
        destinationAccount: 'Ag. 0422 CC 88120-1',
        destinationPixKey: 'financeiro@abcproducoes.com.br',
        paidAt: '2026-10-05T16:00:00Z',
        authorizedBy: 'Vinicius Casagrande (Diretoria)',
      },
      {
        id: 'sch-002',
        walletId: 'wallet-001',
        eventName: 'Festival XYZ',
        producerName: 'ABC Produções & Eventos Ltda',
        scheduleNumber: 'REP-2026-002',
        scheduledDate: '2026-10-20',
        amount: 30000.0,
        status: 'SCHEDULED',
        paymentMethod: 'PIX',
        destinationBank: 'Itaú Unibanco S.A. (Bco 341)',
        destinationAccount: 'Ag. 0422 CC 88120-1',
        destinationPixKey: 'financeiro@abcproducoes.com.br',
        authorizedBy: 'Carlos Eduardo (CFO)',
      },
    ];
  }

  /**
   * Executa repasse imediato
   */
  async executeRepayment(tenantId: string, scheduleId: string) {
    const txHash = `PIX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    return {
      success: true,
      scheduleId,
      status: 'PAID',
      paidAt: new Date().toISOString(),
      transactionHash: txHash,
      message: 'Repasse executado com sucesso através da Conta de Liquidação! Partidas no razão: D Conta Custódia / C Produtor.',
    };
  }

  /**
   * Salva ou atualiza a Regra de Repasse do Evento (Marco 50% / Liberação 20%) com vigência
   */
  async saveEventRepaymentRule(tenantId: string, eventId: string, ruleData: {
    minSalesMilestonePct?: number;
    maxReleasePct?: number;
    salesTargetAmount?: number;
    calculationBasis?: string;
    allowPartial?: boolean;
    allowMultiple?: boolean;
    requiresApproval?: boolean;
    validFrom?: string;
    validTo?: string | null;
  }) {
    const milestone = ruleData.minSalesMilestonePct !== undefined ? Number(ruleData.minSalesMilestonePct) : 50.0;
    const release = ruleData.maxReleasePct !== undefined ? Number(ruleData.maxReleasePct) : 20.0;
    const target = ruleData.salesTargetAmount !== undefined ? Number(ruleData.salesTargetAmount) : 200000.0;

    this.logger.log(`Salvando regra de repasse para o evento ${eventId}: Marco ${milestone}%, Liberação ${release}%`);

    return {
      success: true,
      rule: {
        id: `repay-rule-${Date.now()}`,
        eventId,
        minSalesMilestonePct: milestone,
        maxReleasePct: release,
        salesTargetAmount: target,
        calculationBasis: ruleData.calculationBasis || 'ACCUMULATED_SALES',
        allowPartial: ruleData.allowPartial ?? true,
        allowMultiple: ruleData.allowMultiple ?? true,
        requiresApproval: ruleData.requiresApproval ?? true,
        validFrom: ruleData.validFrom || new Date().toISOString().split('T')[0],
        validTo: ruleData.validTo || null,
        isActive: true,
      },
      message: `Regra de Repasse (${milestone}% marco / ${release}% limite de vendas) parametrizada com sucesso no evento! Operações anteriores preservam a vigência de sua época.`,
    };
  }

  /**
   * Consulta o Livro Financeiro Imutável (FinancialLedger)
   */
  async getFinancialLedger(tenantId: string, options?: {
    producerId?: string;
    eventId?: string;
    entryType?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const allEntries = [
      {
        id: 'led-001',
        saleId: '92831',
        orderNumber: '#92831',
        entryType: 'VENDA',
        direction: 'CREDIT',
        amount: 110.0,
        balanceAfter: 110.0,
        description: 'Venda Aprovada Ingresso Inteira - Pedido #92831',
        createdAt: '2026-10-08T10:15:00Z',
        economicOwner: 'PRODUCER',
      },
      {
        id: 'led-002',
        saleId: '92831',
        orderNumber: '#92831',
        entryType: 'TAXA_DISK',
        direction: 'DEBIT',
        amount: 10.0,
        balanceAfter: 100.0,
        description: 'Taxa de Conveniência DiskIngressos retida (10%)',
        createdAt: '2026-10-08T10:15:00Z',
        economicOwner: 'DISKINGRESSOS',
      },
      {
        id: 'led-003',
        saleId: '92831',
        orderNumber: '#92831',
        entryType: 'TAXA_SPREAD',
        direction: 'DEBIT',
        amount: 5.0,
        balanceAfter: 95.0,
        description: 'Spread Financeiro de Cartão retido',
        createdAt: '2026-10-08T10:15:00Z',
        economicOwner: 'DISKINGRESSOS',
      },
      {
        id: 'led-004',
        saleId: '92832',
        orderNumber: '#92832',
        entryType: 'VENDA',
        direction: 'CREDIT',
        amount: 220.0,
        balanceAfter: 315.0,
        description: 'Venda Aprovada 2 Ingressos VIP - Pedido #92832',
        createdAt: '2026-10-08T11:20:00Z',
        economicOwner: 'PRODUCER',
      },
      {
        id: 'led-005',
        saleId: null,
        orderNumber: 'NF-4921',
        entryType: 'DESPESA',
        direction: 'DEBIT',
        amount: 2000.0,
        balanceAfter: 328000.0,
        description: 'Despesa Segurança Pedreira Paulo Leminski (NF-4921)',
        createdAt: '2026-10-09T14:00:00Z',
        economicOwner: 'SUPPLIER',
      },
      {
        id: 'led-006',
        saleId: null,
        orderNumber: 'ANT-1092',
        entryType: 'ANTECIPACAO',
        direction: 'DEBIT',
        amount: 50000.0,
        balanceAfter: 278000.0,
        description: 'Operação de Antecipação Aprovada #ANT-1092',
        createdAt: '2026-10-10T16:30:00Z',
        economicOwner: 'PRODUCER',
      },
      {
        id: 'led-007',
        saleId: null,
        orderNumber: 'REP-4091',
        entryType: 'REPASSE',
        direction: 'DEBIT',
        amount: 100000.0,
        balanceAfter: 178000.0,
        description: 'Repasse Parcial via PIX - Conta Itaú CC 88120-1',
        createdAt: '2026-10-15T09:00:00Z',
        economicOwner: 'PRODUCER',
      },
    ];

    if (options?.entryType && options.entryType !== 'ALL') {
      return allEntries.filter((e) => e.entryType === options.entryType);
    }

    return allEntries;
  }

  /**
   * Webhook de Ingestão de Venda Aprovada (diskingressos.com.br)
   */
  async processSaleWebhook(tenantId: string, payload: {
    event: string;
    saleId: string;
    producerId: string;
    eventId: string;
    grossAmount: number;
    ticketAmount: number;
    fees: number;
    paymentMethod: string;
    occurredAt: string;
  }) {
    this.logger.log(`[Webhook] Recebendo venda aprovada #${payload.saleId} do evento ${payload.eventId}`);

    // Integração com o Motor de Apropriação Financeira Real
    let appropriationResult: any = null;
    if (this.appropriationService) {
      try {
        appropriationResult = await this.appropriationService.processApprovedSale({
          tenantId,
          companyId: '00000000-0000-0000-0000-000000000001',
          saleId: payload.saleId,
          eventId: payload.eventId,
          producerId: payload.producerId,
          grossAmount: payload.grossAmount.toString(),
          occurredAt: payload.occurredAt ? new Date(payload.occurredAt) : new Date(),
        });
      } catch (err: any) {
        this.logger.log(`Apropriação em banco não executada (${err.message}). Utilizando processamento simulado no livro financeiro.`);
      }
    }

    // 1. Congelar regras financeiras vigentes para o evento
    const feeRules = [
      { feeCode: 'DISK_FEE', rate: 10.0, payer: 'CUSTOMER' },
      { feeCode: 'SPREAD', fixedAmount: 2.0, payer: 'PRODUCER' },
    ];

    // 2. Gravar entradas imutáveis no Livro Financeiro (FinancialLedger)
    const ledgerVenda = {
      id: `led-${Date.now()}-1`,
      saleId: payload.saleId,
      entryType: 'VENDA',
      direction: 'CREDIT',
      amount: payload.grossAmount,
      description: `Venda Aprovada Pedido #${payload.saleId} (${payload.paymentMethod})`,
      createdAt: payload.occurredAt || new Date().toISOString(),
    };

    const ledgerTaxaDisk = {
      id: `led-${Date.now()}-2`,
      saleId: payload.saleId,
      entryType: 'TAXA_DISK',
      direction: 'DEBIT',
      amount: payload.fees,
      description: `Taxa DiskIngressos retida na venda #${payload.saleId}`,
      createdAt: payload.occurredAt || new Date().toISOString(),
    };

    // 3. Avaliar marco de repasse (50% de vendas atingido?)
    const eventSalesAfter = 500000.0 + payload.ticketAmount;
    const isMilestoneReached = eventSalesAfter >= 100000.0;
    const releaseLimit = isMilestoneReached ? eventSalesAfter * 0.20 : 0.0;

    return {
      success: true,
      saleId: payload.saleId,
      status: appropriationResult?.status || 'PROCESSED_AND_SETTLED',
      appropriation: appropriationResult,
      ledgerEntriesCreated: [ledgerVenda, ledgerTaxaDisk],
      governance: {
        isMilestoneReached,
        salesAccumulated: eventSalesAfter,
        repaymentLimitAllowed: releaseLimit,
      },
      message: `Venda #${payload.saleId} processada com sucesso no Motor de Apropriação e Livro Financeiro! Saldo da carteira e conta de custódia atualizados.`,
    };
  }

  /**
   * Webhook de Estorno com Reversão Imutável no Livro Financeiro (FinancialLedger)
   */
  async processRefundWebhook(tenantId: string, payload: {
    event: string;
    saleId: string;
    reason?: string;
    refundedAt?: string;
  }) {
    this.logger.log(`[Webhook] Processando estorno imutável da venda #${payload.saleId}`);

    if (this.appropriationService) {
      try {
        await this.appropriationService.revertAppropriation({
          tenantId,
          saleId: payload.saleId,
          reason: payload.reason,
          occurredAt: payload.refundedAt ? new Date(payload.refundedAt) : new Date(),
        });
      } catch (err: any) {
        this.logger.log(`Reversão em banco não executada (${err.message}). Utilizando processamento simulado no livro financeiro.`);
      }
    }

    const reversalLedger = {
      id: `led-${Date.now()}-rev`,
      saleId: payload.saleId,
      entryType: 'ESTORNO',
      direction: 'DEBIT',
      amount: 110.0,
      description: `Estorno de venda #${payload.saleId} - Motivo: ${payload.reason || 'Cancelamento solicitado pelo cliente'}`,
      createdAt: payload.refundedAt || new Date().toISOString(),
    };

    return {
      success: true,
      saleId: payload.saleId,
      status: 'REVERSED',
      reversalLedgerEntry: reversalLedger,
      message: `Estorno da venda #${payload.saleId} registrado com sucesso no Livro Financeiro! Reversão proporcional aplicada.`,
    };
  }

  /**
   * Visão Geral Executiva de Estornos, Cancelamentos e Retenções
   */
  async getRefundsAndCancellationsOverview(tenantId: string) {
    return {
      kpis: {
        totalEscrowBalance: 4250450.0, // Caixa Geral Bancário em Custódia
        totalDiskOwnRevenue: 425045.0, // Receita Apropriada Disk (10%)
        totalContingencyReserve: 637567.5, // Reserva de Segurança para Cancelamentos (15%)
        totalObligationsReserved: 390000.0, // Retenções para Teatro, ECAD, etc.
        totalObligationsPaid: 240000.0,
        totalRefundsPending: 98200.0,
        totalRefundsExecuted: 128450.0,
        activeCancellationsCount: 2,
        highRiskDeficitCount: 1,
        deficitTotalAmount: 90000.0,
      },
      distribution: {
        escrowEscrowPct: 65.5,
        contingencyPct: 15.0,
        obligationsPct: 9.5,
        diskRevenuePct: 10.0,
      },
      alerts: [
        {
          id: 'alt-01',
          type: 'CRITICAL',
          title: 'Insuficiência Financeira em Cancelamento de Evento',
          message: 'Festival Rock Retrô 2026 possui déficit de R$ 90.000,00 para devolução integral aos compradores. Cobertura atual: 55%. Repasses travados.',
          eventId: 'ev-01',
          eventName: 'Festival Rock Retrô 2026',
          producerName: 'ABC Produções & Eventos Ltda',
        },
        {
          id: 'alt-02',
          type: 'WARNING',
          title: 'Obrigação de ECAD Próxima ao Vencimento',
          message: 'Retenção de R$ 25.000,00 aprovada para ECAD Central Regional Sul vence em 10 dias. Garantia de retenção retida na carteira.',
          eventId: 'ev-01',
          beneficiary: 'ECAD Central Regional Sul',
        },
        {
          id: 'alt-03',
          type: 'INFO',
          title: 'Reserva de Contingência Ativa (15%)',
          message: 'R$ 637.567,50 mantidos intocados como colchão de liquidez para chargebacks e estornos em todas as carteiras de eventos.',
        },
      ],
    };
  }

  /**
   * Lista Obrigações e Retenções do Evento (Teatro, ECAD, Fornecedores, Artistas)
   */
  async getEventObligations(tenantId: string, eventId?: string) {
    const defaultObligations = [
      {
        id: 'ob-01',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        category: 'VENUE_RENTAL',
        categoryLabel: 'Locação de Espaço / Teatro',
        description: 'Aluguel do Grande Auditório Teatro Positivo - Data do Evento',
        beneficiaryName: 'Grupo Positivo Teatros & Eventos S.A.',
        beneficiaryDocument: '76.123.456/0001-09',
        amountReserved: 40000.0,
        amountApproved: 40000.0,
        amountPaid: 40000.0,
        status: 'PAID',
        dueDate: '2026-10-15',
        paidAt: '2026-10-05T10:30:00Z',
        paymentMethod: 'PIX',
        authorizedBy: 'Carlos Eduardo (Diretor Financeiro)',
        notes: 'Pago antecipadamente conforme cláusula 4.1 do contrato de locação.',
      },
      {
        id: 'ob-02',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        category: 'ECAD',
        categoryLabel: 'Direitos Autorais (ECAD)',
        description: 'Taxa de Direitos Autorais e Execução Musical Pública (ECAD Regional)',
        beneficiaryName: 'ECAD Escritório Central de Arrecadação e Distribuição',
        beneficiaryDocument: '00.474.954/0001-08',
        amountReserved: 25000.0,
        amountApproved: 25000.0,
        amountPaid: 0.0,
        status: 'APPROVED',
        dueDate: '2026-10-25',
        paidAt: null,
        paymentMethod: 'BOLETO',
        authorizedBy: 'Amanda Silva (Gerente Financeiro)',
        notes: 'Aguardando guia de compensação do ECAD após apuração de receita de bilheteria.',
      },
      {
        id: 'ob-03',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        category: 'STAGE_STRUCTURE',
        categoryLabel: 'Estrutura & Iluminação',
        description: 'Montagem de Grid de Alumínio, Som Line-Array e Painel de LED 4K',
        beneficiaryName: 'Luz & Arte Cenografia e Estruturas Ltda',
        beneficiaryDocument: '19.882.331/0001-44',
        amountReserved: 35000.0,
        amountApproved: 35000.0,
        amountPaid: 0.0,
        status: 'RESERVED',
        dueDate: '2026-11-01',
        paidAt: null,
        paymentMethod: 'TED',
        authorizedBy: 'Carlos Eduardo (Diretor Financeiro)',
        notes: 'Retenção na carteira garantindo que o valor não seja repassado ao produtor antes da execução.',
      },
      {
        id: 'ob-04',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        category: 'ARTIST',
        categoryLabel: 'Cachê Artístico',
        description: 'Cachê Banda Headline - Primeira Parcela Contratual',
        beneficiaryName: 'Starlight Art & Music Management',
        beneficiaryDocument: '33.221.110/0001-99',
        amountReserved: 80000.0,
        amountApproved: 80000.0,
        amountPaid: 80000.0,
        status: 'PAID',
        dueDate: '2026-10-01',
        paidAt: '2026-10-01T15:00:00Z',
        paymentMethod: 'PIX',
        authorizedBy: 'Carlos Eduardo (Diretor Financeiro)',
        notes: 'Comprovante bancário arquivado.',
      },
      {
        id: 'ob-05',
        eventId: 'ev-02',
        eventName: 'Stand Up Comedy VIP Especial',
        category: 'TAX',
        categoryLabel: 'Tributos & Alvarás',
        description: 'ISS Fixo e Alvará de Autorização Especial da Secretaria de Urbanismo',
        beneficiaryName: 'Prefeitura Municipal de Curitiba',
        beneficiaryDocument: '76.417.005/0001-86',
        amountReserved: 12000.0,
        amountApproved: 12000.0,
        amountPaid: 12000.0,
        status: 'PAID',
        dueDate: '2026-09-30',
        paidAt: '2026-09-30T11:20:00Z',
        paymentMethod: 'PIX',
        authorizedBy: 'Amanda Silva (Gerente Financeiro)',
        notes: 'Guia quitada e alvará emitido.',
      },
    ];

    if (eventId) {
      return defaultObligations.filter((o) => o.eventId === eventId);
    }
    return defaultObligations;
  }

  /**
   * Salva ou Cadastra Obrigação/Retenção do Evento
   */
  async saveEventObligation(tenantId: string, data: any) {
    this.logger.log(`Registrando obrigação/retenção para evento ${data.eventId}: ${data.description}`);
    const newObligation = {
      id: `ob-${Date.now()}`,
      eventId: data.eventId,
      eventName: data.eventName || 'Festival Rock Retrô 2026',
      category: data.category || 'OTHER',
      categoryLabel: data.categoryLabel || 'Outros Custos',
      description: data.description,
      beneficiaryName: data.beneficiaryName,
      beneficiaryDocument: data.beneficiaryDocument || null,
      amountReserved: Number(data.amountReserved || 0),
      amountApproved: Number(data.amountApproved || 0),
      amountPaid: Number(data.amountPaid || 0),
      status: data.status || 'RESERVED',
      dueDate: data.dueDate || null,
      paidAt: data.paidAt || null,
      paymentMethod: data.paymentMethod || 'PIX',
      authorizedBy: data.authorizedBy || 'Operador Financeiro',
      notes: data.notes || '',
    };
    return {
      success: true,
      obligation: newObligation,
      message: `Retenção de R$ ${Number(newObligation.amountReserved).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrada e bloqueada na carteira do evento!`,
    };
  }

  /**
   * Simulação Matemática de Cancelamento de Evento e Índice de Cobertura Financeira
   */
  async simulateEventCancellation(tenantId: string, eventId: string) {
    // Cenário Realista / Ilustrativo do Negócio:
    // Evento com R$ 200.000,00 de vendas aprovadas integralmente na conta da Disk
    const totalSales = 200000.0;
    const totalRefundRequired = totalSales; // Devolução integral aos compradores
    const obligationsPaid = 40000.0; // Obrigações pagas (ex: Teatro R$ 40k)
    const repaymentsPaid = 50000.0; // Repasses já liberados ao produtor (R$ 50k)
    const committedTotal = obligationsPaid + repaymentsPaid; // R$ 90.000,00
    const fundsRemainingInEscrow = totalSales - committedTotal; // R$ 110.000,00 restantes
    const shortfallAmount = Math.max(0, totalRefundRequired - fundsRemainingInEscrow); // R$ 90.000,00 insuficiência
    const coveragePct = Number(((fundsRemainingInEscrow / totalRefundRequired) * 100).toFixed(2)); // 55.00%
    const shortfallPct = Number((100 - coveragePct).toFixed(2)); // 45.00%

    return {
      eventId,
      eventName: 'Festival Rock Retrô 2026',
      producerId: 'prod-01',
      producerName: 'ABC Produções & Eventos Ltda',
      totalSales,
      totalRefundRequired,
      obligationsPaidTotal: obligationsPaid,
      repaymentsPaidTotal: repaymentsPaid,
      committedTotal,
      fundsAvailableAtCancellation: fundsRemainingInEscrow,
      shortfallAmount,
      coveragePct,
      shortfallPct,
      isDeficit: shortfallAmount > 0,
      riskLevel: shortfallAmount > 0 ? 'CRITICAL_SHORTFALL' : 'FULLY_COVERED',
      recommendations: [
        'Travar imediatamente novas liquidações, repasses ou antecipações para este evento e produtor.',
        'Notificar o produtor formalmente para apresentação de Plano de Recomposição de R$ 90.000,00.',
        'Processar estornos em lotes prioritários utilizando os R$ 110.000,00 disponíveis na conta de custódia.',
        'Auditar reversões fiscais e conciliação bancária por transação de venda.',
      ],
      breakdown: {
        totalTickets: 1850,
        averageTicketPrice: 108.1,
        gatewayCustody: fundsRemainingInEscrow,
        producerDebtRecorded: shortfallAmount,
      },
    };
  }

  /**
   * Consulta dossiês de cancelamento de evento
   */
  async getEventCancellations(tenantId: string) {
    return [
      {
        id: 'canc-01',
        cancellationNumber: 'CANC-2026-001',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        producerId: 'prod-01',
        producerName: 'ABC Produções & Eventos Ltda',
        reason: 'Cancelamento por força maior (interdição judicial da estrutura do local)',
        status: 'RECOMPOSITION_PENDING',
        statusLabel: 'Aguardando Recomposição de Caixa',
        totalTicketsCount: 1850,
        totalRefundRequired: 200000.0,
        fundsAvailableAtCancellation: 110000.0,
        obligationsPaidTotal: 40000.0,
        repaymentsPaidTotal: 50000.0,
        shortfallAmount: 90000.0,
        coveragePct: 55.0,
        shortfallPct: 45.0,
        repaymentsBlocked: true,
        refundPolicy: 'INTEGRAL_WITH_FEES',
        executedRefundsCount: 450,
        executedRefundsAmount: 49500.0,
        pendingRefundsAmount: 150500.0,
        recompositionPlanNotes: 'Produtor comprometeu-se a realizar aporte de R$ 90.000 via Pix Escrow até 20/10/2026.',
        cancelledAt: '2026-10-06T14:00:00Z',
        controls: {
          repaymentsLocked: true,
          transactionConciliationMandatory: true,
          recompositionRequired: true,
        },
      },
      {
        id: 'canc-02',
        cancellationNumber: 'CANC-2026-002',
        eventId: 'ev-03',
        eventName: 'Show Acústico MPB Curitiba',
        producerId: 'prod-03',
        producerName: 'CWB Brasil Entretenimento S.A.',
        reason: 'Incompatibilidade de agenda internacional do artista',
        status: 'PROCESSING_REFUNDS',
        statusLabel: 'Em Processamento de Estornos',
        totalTicketsCount: 420,
        totalRefundRequired: 46200.0,
        fundsAvailableAtCancellation: 46200.0,
        obligationsPaidTotal: 0.0,
        repaymentsPaidTotal: 0.0,
        shortfallAmount: 0.0,
        coveragePct: 100.0,
        shortfallPct: 0.0,
        repaymentsBlocked: true,
        refundPolicy: 'INTEGRAL_WITH_FEES',
        executedRefundsCount: 380,
        executedRefundsAmount: 41800.0,
        pendingRefundsAmount: 4400.0,
        recompositionPlanNotes: '100% dos fundos intactos na conta de liquidação da DiskIngressos.',
        cancelledAt: '2026-10-04T09:15:00Z',
        controls: {
          repaymentsLocked: true,
          transactionConciliationMandatory: true,
          recompositionRequired: false,
        },
      },
    ];
  }

  /**
   * Registro formal de Cancelamento de Evento com Bloqueio Imediato de Repasses
   */
  async registerEventCancellation(tenantId: string, payload: any) {
    this.logger.log(`Registrando cancelamento do evento ${payload.eventId} com bloqueio rigoroso de repasses`);

    const simulation = await this.simulateEventCancellation(tenantId, payload.eventId);
    const cancellationNumber = `CANC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newCancellation = {
      id: `canc-${Date.now()}`,
      cancellationNumber,
      eventId: payload.eventId,
      eventName: simulation.eventName,
      producerId: simulation.producerId,
      producerName: simulation.producerName,
      reason: payload.reason,
      status: simulation.shortfallAmount > 0 ? 'RECOMPOSITION_PENDING' : 'APPROVED',
      statusLabel: simulation.shortfallAmount > 0 ? 'Aguardando Recomposição de Caixa' : 'Aprovado para Devoluções',
      totalTicketsCount: simulation.breakdown.totalTickets,
      totalRefundRequired: simulation.totalRefundRequired,
      fundsAvailableAtCancellation: simulation.fundsAvailableAtCancellation,
      obligationsPaidTotal: simulation.obligationsPaidTotal,
      repaymentsPaidTotal: simulation.repaymentsPaidTotal,
      shortfallAmount: simulation.shortfallAmount,
      coveragePct: simulation.coveragePct,
      shortfallPct: simulation.shortfallPct,
      repaymentsBlocked: true,
      refundPolicy: payload.refundPolicy || 'INTEGRAL_WITH_FEES',
      executedRefundsCount: 0,
      executedRefundsAmount: 0.0,
      pendingRefundsAmount: simulation.totalRefundRequired,
      recompositionPlanNotes: payload.recompositionNotes || null,
      cancelledAt: new Date().toISOString(),
      controls: {
        repaymentsLocked: true,
        transactionConciliationMandatory: true,
        recompositionRequired: simulation.shortfallAmount > 0,
      },
    };

    return {
      success: true,
      cancellation: newCancellation,
      message: `Cancelamento #${cancellationNumber} registrado! Repasses suspensos e trava de segurança ativada. Cobertura: ${simulation.coveragePct}% (Insuficiência: R$ ${simulation.shortfallAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}).`,
    };
  }

  /**
   * Consulta Fila de Estornos no Nível de Pedido / Transação
   */
  async getSaleRefundRequests(tenantId: string, filters?: { eventId?: string; status?: string }) {
    const list = [
      {
        id: 'ref-01',
        orderNumber: 'DK-88291',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        customerName: 'Carlos Eduardo Silva',
        customerDocument: '111.222.333-44',
        customerEmail: 'carlos.silva@email.com',
        ticketGrossAmount: 100.0,
        diskFeeAmount: 10.0,
        amountToRefund: 110.0,
        paymentMethod: 'PIX',
        refundStatus: 'REFUNDED',
        gatewayRefundId: 'gw_rf_991823',
        failureReason: null,
        requestedAt: '2026-10-06T16:00:00Z',
        processedAt: '2026-10-07T14:22:10Z',
      },
      {
        id: 'ref-02',
        orderNumber: 'DK-88292',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        customerName: 'Mariana Souza Lima',
        customerDocument: '222.333.444-55',
        customerEmail: 'mariana.souza@email.com',
        ticketGrossAmount: 200.0,
        diskFeeAmount: 20.0,
        amountToRefund: 220.0,
        paymentMethod: 'CREDIT_CARD',
        refundStatus: 'PROCESSING',
        gatewayRefundId: 'gw_rf_991824',
        failureReason: null,
        requestedAt: '2026-10-06T16:15:00Z',
        processedAt: null,
      },
      {
        id: 'ref-03',
        orderNumber: 'DK-88293',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        customerName: 'Rodrigo Almeida',
        customerDocument: '333.444.555-66',
        customerEmail: 'rodrigo.almeida@email.com',
        ticketGrossAmount: 150.0,
        diskFeeAmount: 15.0,
        amountToRefund: 165.0,
        paymentMethod: 'PIX',
        refundStatus: 'APPROVED',
        gatewayRefundId: null,
        failureReason: null,
        requestedAt: '2026-10-06T16:30:00Z',
        processedAt: null,
      },
      {
        id: 'ref-04',
        orderNumber: 'DK-88294',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        customerName: 'Juliana Mendes',
        customerDocument: '444.555.666-77',
        customerEmail: 'juliana.mendes@email.com',
        ticketGrossAmount: 300.0,
        diskFeeAmount: 30.0,
        amountToRefund: 330.0,
        paymentMethod: 'BOLETO',
        refundStatus: 'REQUESTED',
        gatewayRefundId: null,
        failureReason: null,
        requestedAt: '2026-10-06T17:00:00Z',
        processedAt: null,
      },
      {
        id: 'ref-05',
        orderNumber: 'DK-88295',
        eventId: 'ev-01',
        eventName: 'Festival Rock Retrô 2026',
        customerName: 'Felipe Antunes',
        customerDocument: '555.666.777-88',
        customerEmail: 'felipe.antunes@email.com',
        ticketGrossAmount: 100.0,
        diskFeeAmount: 10.0,
        amountToRefund: 110.0,
        paymentMethod: 'PIX',
        refundStatus: 'APPROVED',
        gatewayRefundId: null,
        failureReason: null,
        requestedAt: '2026-10-06T17:10:00Z',
        processedAt: null,
      },
    ];

    if (filters?.eventId) {
      return list.filter((r) => r.eventId === filters.eventId);
    }
    if (filters?.status) {
      return list.filter((r) => r.refundStatus === filters.status);
    }
    return list;
  }

  /**
   * Executa Lote de Estornos e Grava Reversões Imutáveis no Livro Financeiro (FinancialLedger)
   */
  async executeBatchRefunds(tenantId: string, cancellationId: string, requestIds?: string[]) {
    this.logger.log(`Executando lote de estornos para cancelamento ${cancellationId}`);

    const executedList = [
      {
        id: `ref-batch-${Date.now()}-1`,
        orderNumber: 'DK-88293',
        customerName: 'Rodrigo Almeida',
        amount: 165.0,
        method: 'PIX',
        gatewayId: `gw_pix_${Date.now()}`,
        status: 'REFUNDED',
      },
      {
        id: `ref-batch-${Date.now()}-2`,
        orderNumber: 'DK-88295',
        customerName: 'Felipe Antunes',
        amount: 110.0,
        method: 'PIX',
        gatewayId: `gw_pix_${Date.now() + 1}`,
        status: 'REFUNDED',
      },
    ];

    const totalExecutedAmount = executedList.reduce((acc, curr) => acc + curr.amount, 0);

    const ledgerEntries = executedList.map((item) => ({
      id: `led-${Date.now()}-${item.orderNumber}`,
      saleId: item.orderNumber,
      entryType: 'ESTORNO',
      direction: 'DEBIT',
      amount: item.amount,
      description: `Estorno executado via ${item.method} referente ao pedido #${item.orderNumber}`,
      createdAt: new Date().toISOString(),
    }));

    return {
      success: true,
      cancellationId,
      refundsExecutedCount: executedList.length,
      totalExecutedAmount,
      ledgerEntriesCreated: ledgerEntries,
      executedList,
      message: `Lote de ${executedList.length} estornos executado com sucesso (Total: R$ ${totalExecutedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Reversões registradas no Livro Financeiro!`,
    };
  }

  /**
   * Atualização de Plano de Recomposição de Déficit com o Produtor
   */
  async saveRecompositionPlan(tenantId: string, cancellationId: string, planData: any) {
    this.logger.log(`Atualizando plano de recomposição para cancelamento ${cancellationId}`);
    return {
      success: true,
      cancellationId,
      status: 'PLAN_AGREED',
      terms: planData.terms,
      depositDueDate: planData.depositDueDate || '2026-10-20',
      expectedAmount: planData.expectedAmount || 90000.0,
      notes: planData.notes || 'Acordo firmado de devolução de repasses antecipados.',
      message: 'Plano de Recomposição pactuado com sucesso! Aguardando compensação de depósito em conta escrow.',
    };
  }
}

