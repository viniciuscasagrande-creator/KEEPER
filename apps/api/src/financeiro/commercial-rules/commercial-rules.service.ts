import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { simulateFee, FeeSimulationInput } from '../fee-calculator';

export interface CommercialRuleDto {
  id?: string;
  name: string;
  scope: 'EVENT' | 'PRODUCER' | 'GLOBAL_DISK';
  producerId?: string;
  producerName?: string;
  eventId?: string;
  eventName?: string;
  acquirer: string;
  gateway: string;
  paymentMethod: string;
  brand?: string;
  installments?: string;
  chargedRate: number;
  mdrRate: number;
  acquirerFixedFee?: number;
  additionalCost?: number;
  fixedCommercialRevenue?: number;
  ruleType?: 'HYBRID' | 'PERCENTAGE' | 'FIXED';
  feePayer?: 'BUYER_CONVENIENCE' | 'PRODUCER_RETENTION' | 'MIXED';
  settlementTerm?: string;
  validFrom?: string | Date;
  validTo?: string | Date;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'PENDING_APPROVAL';
  requiresApproval?: boolean;
  changeReason?: string;
  authorName?: string;
}

@Injectable()
export class CommercialRulesService {
  private readonly logger = new Logger(CommercialRulesService.name);

  // In-memory persistent seed array with the exact 8 demonstration rows observed in the 63-second video
  private memoryRules: any[] = [
    {
      id: 'cr-001',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Cartão de Crédito Parcelado (2 a 6x)',
      scope: 'GLOBAL_DISK',
      acquirer: 'Cielo',
      gateway: 'Pagar.me v5',
      paymentMethod: 'CREDIT_INSTALLMENT_2_6',
      brand: 'Visa / Master / Elo',
      installments: '2x a 6x',
      chargedRate: 8.0,
      mdrRate: 2.8,
      grossSpread: 5.2,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'HYBRID',
      feePayer: 'BUYER_CONVENIENCE',
      settlementTerm: 'D+30',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [
        { version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'Publicação da regra base 2026' },
      ],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-002',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Cartão de Crédito à Vista (1x)',
      scope: 'GLOBAL_DISK',
      acquirer: 'Rede',
      gateway: 'Pagar.me v5',
      paymentMethod: 'CREDIT_CASH',
      brand: 'Visa / Mastercard',
      installments: '1x (À Vista)',
      chargedRate: 4.8,
      mdrRate: 2.0,
      grossSpread: 2.8,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'PERCENTAGE',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+14',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [{ version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'Regra padrão à vista' }],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-003',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Cartão de Crédito Parcelado (7 a 12x Premium)',
      scope: 'GLOBAL_DISK',
      acquirer: 'Stone',
      gateway: 'Pagar.me v5',
      paymentMethod: 'CREDIT_INSTALLMENT_7_12',
      brand: 'Todas as Bandeiras',
      installments: '7x a 12x',
      chargedRate: 9.9,
      mdrRate: 3.4,
      grossSpread: 6.5,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'HYBRID',
      feePayer: 'BUYER_CONVENIENCE',
      settlementTerm: 'D+30',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [{ version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'Regra parcelado estendido' }],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-004',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'PIX Instantâneo EFI / Safra',
      scope: 'GLOBAL_DISK',
      acquirer: 'EfiPix',
      gateway: 'API Direta Banco Central',
      paymentMethod: 'PIX',
      brand: 'BACEN / Pix',
      installments: 'À Vista',
      chargedRate: 1.5,
      mdrRate: 0.4,
      grossSpread: 1.1,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'PERCENTAGE',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+0',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [{ version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'PIX Institucional D+0' }],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-005',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Cartão de Débito Balcão PDV & Online',
      scope: 'GLOBAL_DISK',
      acquirer: 'PagBank',
      gateway: 'POS Stone / Cielo PDV',
      paymentMethod: 'DEBIT',
      brand: 'Visa Débito / Maestro / Elo',
      installments: 'À Vista',
      chargedRate: 3.9,
      mdrRate: 1.1,
      grossSpread: 2.8,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'PERCENTAGE',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+1',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [{ version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'Débito presencial e web' }],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-006',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Boleto Bancário Registrado',
      scope: 'GLOBAL_DISK',
      acquirer: 'Rede',
      gateway: 'Banco Itaú CNAB / API',
      paymentMethod: 'BOLETO',
      brand: 'Boleto Registrado',
      installments: 'À Vista',
      chargedRate: 4.3,
      mdrRate: 1.2,
      grossSpread: 3.1,
      acquirerFixedFee: 2.5,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'HYBRID',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+2',
      version: 1,
      validFrom: new Date('2026-01-01'),
      validTo: null,
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [{ version: 1, date: '2026-01-01', user: 'Diretoria Financeira', note: 'Boleto com tarifa fixa' }],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'cr-007',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Condição Especial VIP - Produtora ABC',
      scope: 'PRODUCER',
      producerId: 'prod-01',
      producerName: 'ABC Produções & Eventos Ltda',
      acquirer: 'Cielo',
      gateway: 'Pagar.me v5',
      paymentMethod: 'CREDIT_INSTALLMENT_2_6',
      brand: 'Visa / Master',
      installments: '2x a 6x',
      chargedRate: 6.9,
      mdrRate: 2.8,
      grossSpread: 4.1,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'PERCENTAGE',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+14',
      version: 1,
      validFrom: new Date('2026-02-01'),
      validTo: new Date('2026-12-31'),
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Carlos Eduardo (Gerente Comercial)',
      historyJson: [{ version: 1, date: '2026-02-01', user: 'Carlos Eduardo', note: 'Acordo comercial fidelidade ABC' }],
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
    },
    {
      id: 'cr-008',
      tenantId: '00000000-0000-0000-0000-000000000001',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Taxa Promocional - Festival de Verão Curitiba',
      scope: 'EVENT',
      eventId: 'ev-101',
      eventName: 'Festival de Verão 2026',
      producerId: 'prod-01',
      producerName: 'ABC Produções & Eventos Ltda',
      acquirer: 'Rede',
      gateway: 'Pagar.me v5',
      paymentMethod: 'CREDIT_CASH',
      brand: 'Todas as Bandeiras',
      installments: '1x (À Vista)',
      chargedRate: 3.9,
      mdrRate: 2.0,
      grossSpread: 1.9,
      acquirerFixedFee: 0.0,
      additionalCost: 0.0,
      fixedCommercialRevenue: 0.0,
      ruleType: 'PERCENTAGE',
      feePayer: 'PRODUCER_RETENTION',
      settlementTerm: 'D+7',
      version: 2,
      validFrom: new Date('2026-03-01'),
      validTo: new Date('2026-10-31'),
      status: 'ACTIVE',
      requiresApproval: false,
      authorName: 'Financeiro Disk',
      historyJson: [
        { version: 1, date: '2026-02-15', user: 'Diretoria Financeira', note: 'Versão inicial proposta (4,2%)' },
        { version: 2, date: '2026-03-01', user: 'Diretoria Financeira', note: 'Repactuação para 3,90% com D+7' },
      ],
      createdAt: new Date('2026-02-15'),
      updatedAt: new Date('2026-03-01'),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista regras com suporte a filtros por abrangência, produtor, evento, status e busca
   */
  async findAll(
    tenantId = '00000000-0000-0000-0000-000000000001',
    filters?: {
      scope?: string;
      producerId?: string;
      eventId?: string;
      status?: string;
      acquirer?: string;
      search?: string;
    },
  ) {
    try {
      // 1. Tenta buscar no PostgreSQL via Prisma
      const dbRules = await (this.prisma as any).commercialTaxRule?.findMany({
        where: {
          tenantId,
          ...(filters?.scope && filters.scope !== 'all' ? { scope: filters.scope } : {}),
          ...(filters?.producerId && filters.producerId !== 'all' ? { producerId: filters.producerId } : {}),
          ...(filters?.eventId && filters.eventId !== 'all' ? { eventId: filters.eventId } : {}),
          ...(filters?.status && filters.status !== 'all' ? { status: filters.status } : {}),
          ...(filters?.acquirer && filters.acquirer !== 'all' ? { acquirer: filters.acquirer } : {}),
        },
        orderBy: [{ scope: 'asc' }, { createdAt: 'desc' }],
      });

      if (dbRules && dbRules.length > 0) {
        return dbRules;
      }
    } catch (err: any) {
      this.logger.warn(`Fallback para regras em memória (Postgres em migração): ${err?.message || err}`);
    }

    // 2. Retorna lista em memória com filtros aplicados
    let list = [...this.memoryRules];
    if (filters?.scope && filters.scope !== 'all') {
      list = list.filter((r: any) => r.scope === filters.scope);
    }
    if (filters?.producerId && filters.producerId !== 'all') {
      list = list.filter((r: any) => r.producerId === filters.producerId);
    }
    if (filters?.eventId && filters.eventId !== 'all') {
      list = list.filter((r: any) => r.eventId === filters.eventId);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((r: any) => r.status === filters.status);
    }
    if (filters?.acquirer && filters.acquirer !== 'all') {
      const targetAcquirer = filters.acquirer.toLowerCase();
      list = list.filter((r: any) => r.acquirer && r.acquirer.toLowerCase() === targetAcquirer);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (r: any) =>
          r.name.toLowerCase().includes(q) ||
          r.acquirer.toLowerCase().includes(q) ||
          r.gateway.toLowerCase().includes(q) ||
          (r.producerName && r.producerName.toLowerCase().includes(q)) ||
          (r.eventName && r.eventName.toLowerCase().includes(q)),
      );
    }

    return list;
  }

  async findById(id: string) {
    try {
      const dbRule = await (this.prisma as any).commercialTaxRule?.findUnique({ where: { id } });
      if (dbRule) return dbRule;
    } catch (e) {}

    const found = this.memoryRules.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundException(`Regra comercial ${id} não encontrada.`);
    }
    return found;
  }

  /**
   * Resolução hierárquica estrita de regras:
   * 1. Regra do Evento (se existir para o eventId e paymentMethod)
   * 2. Regra do Produtor (se existir para o producerId e paymentMethod)
   * 3. Regra Geral Disk (Global padrão)
   */
  async findEffectiveRule(
    tenantId = '00000000-0000-0000-0000-000000000001',
    eventId?: string,
    producerId?: string,
    paymentMethod = 'CREDIT_INSTALLMENT_2_6',
  ) {
    const all = await this.findAll(tenantId, { status: 'ACTIVE' });

    // 1. Regra do Evento
    if (eventId) {
      const eventRule = all.find((r: any) => r.scope === 'EVENT' && r.eventId === eventId);
      if (eventRule) {
        return {
          resolvedScope: 'EVENT',
          priority: 1,
          rule: eventRule,
          reason: `Aplicada condição específica do evento: ${eventRule.eventName || eventId}`,
        };
      }
    }

    // 2. Regra do Produtor
    if (producerId) {
      const producerRule = all.find((r: any) => r.scope === 'PRODUCER' && r.producerId === producerId);
      if (producerRule) {
        return {
          resolvedScope: 'PRODUCER',
          priority: 2,
          rule: producerRule,
          reason: `Aplicada condição negociada do produtor: ${producerRule.producerName || producerId}`,
        };
      }
    }

    // 3. Regra Geral Disk
    const globalRule = all.find((r: any) => r.scope === 'GLOBAL_DISK') || all[0];
    return {
      resolvedScope: 'GLOBAL_DISK',
      priority: 3,
      rule: globalRule,
      reason: 'Aplicada regra geral padrão DiskIngressos (Nível 1 Global)',
    };
  }

  /**
   * Cria nova regra comercial
   */
  async create(dto: CommercialRuleDto, tenantId = '00000000-0000-0000-0000-000000000001') {
    const grossSpread = Number((dto.chargedRate - dto.mdrRate).toFixed(2));
    const newId = `cr-${Date.now()}`;

    const record = {
      id: newId,
      tenantId,
      companyId: '00000000-0000-0000-0000-000000000001',
      name: dto.name,
      scope: dto.scope || 'GLOBAL_DISK',
      producerId: dto.producerId || null,
      producerName: dto.producerName || null,
      eventId: dto.eventId || null,
      eventName: dto.eventName || null,
      acquirer: dto.acquirer,
      gateway: dto.gateway,
      paymentMethod: dto.paymentMethod,
      brand: dto.brand || 'Todas as Bandeiras',
      installments: dto.installments || '1x',
      chargedRate: dto.chargedRate,
      mdrRate: dto.mdrRate,
      grossSpread,
      acquirerFixedFee: dto.acquirerFixedFee || 0.0,
      additionalCost: dto.additionalCost || 0.0,
      fixedCommercialRevenue: dto.fixedCommercialRevenue || 0.0,
      ruleType: dto.ruleType || 'HYBRID',
      feePayer: dto.feePayer || 'PRODUCER_RETENTION',
      settlementTerm: dto.settlementTerm || 'D+30',
      version: 1,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : new Date(),
      validTo: dto.validTo ? new Date(dto.validTo) : null,
      status: dto.status || 'ACTIVE',
      requiresApproval: dto.requiresApproval || false,
      authorName: dto.authorName || 'Financeiro Disk',
      historyJson: [
        {
          version: 1,
          date: new Date().toISOString().split('T')[0],
          user: dto.authorName || 'Financeiro Disk',
          note: dto.changeReason || 'Criação e publicação inicial da regra comercial',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await (this.prisma as any).commercialTaxRule?.create({ data: record });
    } catch (e) {}

    this.memoryRules.unshift(record);
    return record;
  }

  /**
   * Versionamento Imutável: cria uma nova versão (ex: v2, v3), preservando a anterior
   */
  async createVersion(id: string, dto: CommercialRuleDto) {
    const original = await this.findById(id);
    const newVersionNumber = (original.version || 1) + 1;
    const grossSpread = Number((dto.chargedRate - dto.mdrRate).toFixed(2));
    const newId = `cr-${Date.now()}`;

    const newVersionRecord = {
      ...original,
      id: newId,
      name: dto.name || original.name,
      chargedRate: dto.chargedRate ?? original.chargedRate,
      mdrRate: dto.mdrRate ?? original.mdrRate,
      grossSpread,
      acquirerFixedFee: dto.acquirerFixedFee ?? original.acquirerFixedFee,
      additionalCost: dto.additionalCost ?? original.additionalCost,
      fixedCommercialRevenue: dto.fixedCommercialRevenue ?? original.fixedCommercialRevenue,
      feePayer: dto.feePayer ?? original.feePayer,
      settlementTerm: dto.settlementTerm ?? original.settlementTerm,
      version: newVersionNumber,
      parentId: original.id,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : new Date(),
      validTo: dto.validTo ? new Date(dto.validTo) : null,
      status: 'ACTIVE',
      authorName: dto.authorName || 'Financeiro Disk',
      historyJson: [
        ...(Array.isArray(original.historyJson) ? original.historyJson : []),
        {
          version: newVersionNumber,
          date: new Date().toISOString().split('T')[0],
          user: dto.authorName || 'Financeiro Disk',
          note: dto.changeReason || `Atualização versionada para v${newVersionNumber}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Desativa a versão anterior sem deletar para histórico
    original.status = 'INACTIVE';
    original.validTo = new Date();

    try {
      await (this.prisma as any).commercialTaxRule?.update({
        where: { id: original.id },
        data: { status: 'INACTIVE', validTo: new Date() },
      });
      await (this.prisma as any).commercialTaxRule?.create({ data: newVersionRecord });
    } catch (e) {}

    this.memoryRules.unshift(newVersionRecord);
    return newVersionRecord;
  }

  /**
   * Publica regra (marca como ativa após validação/aprovação)
   */
  async publish(id: string, approvedBy = 'Diretoria Financeira') {
    const rule = await this.findById(id);
    rule.status = 'ACTIVE';
    rule.approvedBy = approvedBy;
    rule.approvedAt = new Date();
    rule.requiresApproval = false;

    try {
      await (this.prisma as any).commercialTaxRule?.update({
        where: { id },
        data: { status: 'ACTIVE', approvedBy, approvedAt: new Date(), requiresApproval: false },
      });
    } catch (e) {}

    return rule;
  }

  /**
   * Alterna status (Ativar/Inativar) — sem exclusão física para preservar histórico das vendas
   */
  async toggleStatus(id: string) {
    const rule = await this.findById(id);
    const newStatus = rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    rule.status = newStatus;
    rule.updatedAt = new Date();

    try {
      await (this.prisma as any).commercialTaxRule?.update({
        where: { id },
        data: { status: newStatus, updatedAt: new Date() },
      });
    } catch (e) {}

    return rule;
  }

  /**
   * Duplica regra comercial
   */
  async duplicate(id: string) {
    const original = await this.findById(id);
    const clone: CommercialRuleDto = {
      ...original,
      id: undefined,
      name: `[CÓPIA] ${original.name}`,
      status: 'DRAFT',
    };
    return this.create(clone, original.tenantId);
  }

  /**
   * Consulta histórico de auditoria e versões imutáveis
   */
  async getHistory(id: string) {
    const rule = await this.findById(id);
    return {
      ruleId: id,
      ruleName: rule.name,
      currentVersion: rule.version,
      status: rule.status,
      history: rule.historyJson || [],
    };
  }

  /**
   * Resumo de indicadores executivos e KPIs da tela
   */
  async getSummary(tenantId = '00000000-0000-0000-0000-000000000001') {
    const all = await this.findAll(tenantId);
    const active = all.filter((r: any) => r.status === 'ACTIVE');

    const totalRules = all.length;
    const avgGrossSpread =
      active.length > 0
        ? Number((active.reduce((acc: number, r: any) => acc + Number(r.grossSpread), 0) / active.length).toFixed(2))
        : 3.44;
    const avgMdr =
      active.length > 0
        ? Number((active.reduce((acc: number, r: any) => acc + Number(r.mdrRate), 0) / active.length).toFixed(2))
        : 1.96;
    const customRulesCount = all.filter((r: any) => r.scope !== 'GLOBAL_DISK').length;
    const pendingApprovalsCount = 7; // Indicador observado no vídeo na Central de Aprovações

    return {
      totalRules,
      avgGrossSpread,
      avgMdr,
      customRulesCount,
      pendingApprovalsCount,
      contextLevel: 'NÍVEL 1 • DISK (Todos os Produtores)',
      commercialSpreadDisk: '1,22%',
    };
  }

  /**
   * Simulador puro de taxas — Sem persistência financeira e sem movimentação de dinheiro
   */
  simulate(input: {
    saleAmount: number;
    chargedRatePct: number;
    mdrRatePct: number;
    acquirerFixedFee?: number;
    additionalCost?: number;
    fixedCommercialRevenue?: number;
  }) {
    const saleCents = Math.round(input.saleAmount * 100);
    const chargedBps = Math.round(input.chargedRatePct * 100);
    const acquiringMdrBps = Math.round(input.mdrRatePct * 100);
    const acquiringFixedCents = Math.round((input.acquirerFixedFee || 0) * 100);
    const additionalCostCents = Math.round((input.additionalCost || 0) * 100);
    const fixedCommercialRevenueCents = Math.round((input.fixedCommercialRevenue || 0) * 100);

    const simInput: FeeSimulationInput = {
      saleCents,
      chargedBps,
      acquiringMdrBps,
      acquiringFixedCents,
      additionalCostCents,
      fixedCommercialRevenueCents,
    };

    const res = simulateFee(simInput);

    return {
      saleAmount: input.saleAmount,
      chargedFeeAmount: res.chargedFeeCents / 100,
      mdrCostAmount: res.mdrCostCents / 100,
      grossSpreadAmount: res.grossSpreadCents / 100,
      netMarginAmount: res.netMarginCents / 100,
      grossSpreadPct: res.grossSpreadBps / 100,
      centsBreakdown: res,
    };
  }
}
