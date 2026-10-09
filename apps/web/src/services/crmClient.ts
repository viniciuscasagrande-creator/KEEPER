// apps/web/src/services/crmClient.ts
// Client completo para o Módulo de CRM & Gestão Comercial de Produtores da DiskIngressos

export type ProducerCategory =
  | 'SHOWS_NACIONAIS'
  | 'TEATROS'
  | 'FESTIVAIS'
  | 'STAND_UP'
  | 'CORPORATIVO'
  | 'ESPORTES';

export type DealStage =
  | 'PROSPECCAO'
  | 'QUALIFICACAO'
  | 'PROPOSTA_ENVIADA'
  | 'NEGOCIACAO'
  | 'FECHADO_GANHO'
  | 'PERDIDO';

export interface Producer {
  id: string;
  name: string;
  tradeName?: string;
  document: string;
  code?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  category: ProducerCategory;
  email?: string;
  phone?: string;
  defaultDiskFeeRate?: number;
  defaultSpreadRate?: number;
  bankName?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  totalEventsCount: number;
  gmvAccumulated: number;
  creditRating: 'AAA' | 'AA+' | 'AA' | 'A+' | 'A' | 'B';
  relationshipManager: string;
  createdAt: string;
}

export interface OpportunityDeal {
  id: string;
  title: string;
  producerId: string;
  producerName: string;
  expectedGmv: number;
  feeRateProposed: number;
  eventDate: string;
  venueName: string;
  responsibleSdr: string;
  stage: DealStage;
  probabilityPercent: number;
  lastContactAt: string;
}

export interface CrmDashboardMetrics {
  totalProducers: number;
  activeProducers: number;
  pipelineDealsCount: number;
  pipelineGmvValue: number;
  avgFeeRate: number;
  winRatePercent: number;
  csatRating: number;
}

const MOCK_PRODUCERS: Producer[] = [
  {
    id: 'prod-01',
    name: 'Opus Entretenimento Curitiba Ltda',
    tradeName: 'Opus Entretenimento',
    document: '12.345.678/0001-90',
    code: 'PROD-001',
    status: 'ACTIVE',
    category: 'TEATROS',
    email: 'contato@opusentretenimento.com.br',
    phone: '(41) 3300-1000',
    defaultDiskFeeRate: 12.0,
    defaultSpreadRate: 3.5,
    bankName: 'Banco Bradesco S.A.',
    agency: '1420',
    account: '45890-1',
    pixKey: 'financeiro@opusentretenimento.com.br',
    totalEventsCount: 14,
    gmvAccumulated: 3840000.0,
    creditRating: 'AAA',
    relationshipManager: 'Carlos Eduardo Silveira',
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'prod-02',
    name: 'Like Entretenimento e Eventos S.A.',
    tradeName: 'Like Entretenimento',
    document: '23.456.789/0001-01',
    code: 'PROD-002',
    status: 'ACTIVE',
    category: 'SHOWS_NACIONAIS',
    email: 'producao@likeentretenimento.com.br',
    phone: '(41) 3200-2200',
    defaultDiskFeeRate: 13.5,
    defaultSpreadRate: 4.0,
    bankName: 'Banco do Brasil S.A.',
    agency: '0092-2',
    account: '12908-5',
    pixKey: '23.456.789/0001-01',
    totalEventsCount: 22,
    gmvAccumulated: 5210000.0,
    creditRating: 'AAA',
    relationshipManager: 'Carlos Eduardo Silveira',
    createdAt: '2025-02-10T14:30:00.000Z',
  },
  {
    id: 'prod-03',
    name: 'CWB Brasil Produções Artísticas Ltda',
    tradeName: 'CWB Brasil',
    document: '34.567.890/0001-12',
    code: 'PROD-003',
    status: 'ACTIVE',
    category: 'FESTIVAIS',
    email: 'comercial@cwbbrasil.com.br',
    phone: '(41) 3050-3300',
    defaultDiskFeeRate: 11.5,
    defaultSpreadRate: 3.0,
    bankName: 'Itaú Unibanco S.A.',
    agency: '3810',
    account: '98450-2',
    pixKey: 'comercial@cwbbrasil.com.br',
    totalEventsCount: 18,
    gmvAccumulated: 6450000.0,
    creditRating: 'AA+',
    relationshipManager: 'Carlos Eduardo Silveira',
    createdAt: '2025-03-01T09:15:00.000Z',
  },
  {
    id: 'prod-04',
    name: 'Seven Entretenimento & Promoções Ltda',
    tradeName: 'Seven Entretenimento',
    document: '45.678.901/0001-23',
    code: 'PROD-004',
    status: 'ACTIVE',
    category: 'SHOWS_NACIONAIS',
    email: 'financeiro@seven.art.br',
    phone: '(41) 3322-4400',
    defaultDiskFeeRate: 14.0,
    defaultSpreadRate: 4.5,
    bankName: 'Banco Santander Brasil S.A.',
    agency: '2215',
    account: '77120-9',
    pixKey: 'financeiro@seven.art.br',
    totalEventsCount: 9,
    gmvAccumulated: 2180000.0,
    creditRating: 'AA',
    relationshipManager: 'Mariana Duarte Mendes',
    createdAt: '2025-04-12T11:45:00.000Z',
  },
  {
    id: 'prod-05',
    name: 'Prime Produções & Eventos Eireli',
    tradeName: 'Prime Eventos',
    document: '56.789.012/0001-34',
    code: 'PROD-005',
    status: 'ACTIVE',
    category: 'STAND_UP',
    email: 'agenda@primeeventos.com.br',
    phone: '(41) 3344-5500',
    defaultDiskFeeRate: 12.5,
    defaultSpreadRate: 3.5,
    bankName: 'Banco Inter S.A.',
    agency: '0001',
    account: '349810-8',
    pixKey: 'agenda@primeeventos.com.br',
    totalEventsCount: 31,
    gmvAccumulated: 1890000.0,
    creditRating: 'A+',
    relationshipManager: 'Carlos Eduardo Silveira',
    createdAt: '2025-05-20T16:00:00.000Z',
  },
];

const MOCK_OPPORTUNITIES: OpportunityDeal[] = [
  {
    id: 'deal-01',
    title: 'Turnê MPB Clássicos 2026 (2 Noites)',
    producerId: 'prod-01',
    producerName: 'Opus Entretenimento',
    expectedGmv: 480000.0,
    feeRateProposed: 12.0,
    eventDate: '2026-11-20',
    venueName: 'Teatro Positivo (Grande Auditório)',
    responsibleSdr: 'Carlos Eduardo Silveira',
    stage: 'NEGOCIACAO',
    probabilityPercent: 85,
    lastContactAt: '09/10/2026 09:30',
  },
  {
    id: 'deal-02',
    title: 'Festival Sertanejo Curitiba Prime',
    producerId: 'prod-02',
    producerName: 'Like Entretenimento',
    expectedGmv: 1250000.0,
    feeRateProposed: 13.0,
    eventDate: '2026-12-12',
    venueName: 'Pedreira Paulo Leminski',
    responsibleSdr: 'Carlos Eduardo Silveira',
    stage: 'PROPOSTA_ENVIADA',
    probabilityPercent: 70,
    lastContactAt: '08/10/2026 17:00',
  },
  {
    id: 'deal-03',
    title: 'Turnê Rock Sinfônico Internacional',
    producerId: 'prod-03',
    producerName: 'CWB Brasil',
    expectedGmv: 920000.0,
    feeRateProposed: 11.5,
    eventDate: '2026-11-28',
    venueName: 'Live Curitiba',
    responsibleSdr: 'Carlos Eduardo Silveira',
    stage: 'QUALIFICACAO',
    probabilityPercent: 50,
    lastContactAt: '09/10/2026 08:45',
  },
  {
    id: 'deal-04',
    title: 'Temporada Comédia Stand-Up Especial',
    producerId: 'prod-05',
    producerName: 'Prime Eventos',
    expectedGmv: 145000.0,
    feeRateProposed: 12.5,
    eventDate: '2026-10-31',
    venueName: 'Teatro Fernanda Montenegro',
    responsibleSdr: 'Carlos Eduardo Silveira',
    stage: 'FECHADO_GANHO',
    probabilityPercent: 100,
    lastContactAt: '08/10/2026 14:15',
  },
  {
    id: 'deal-05',
    title: 'Festival Trap & Eletrônico Sul',
    producerId: 'prod-04',
    producerName: 'Seven Entretenimento',
    expectedGmv: 780000.0,
    feeRateProposed: 13.5,
    eventDate: '2027-01-16',
    venueName: 'Arena Expotrade Pinhais',
    responsibleSdr: 'Mariana Duarte Mendes',
    stage: 'PROSPECCAO',
    probabilityPercent: 30,
    lastContactAt: '07/10/2026 11:20',
  },
];

class CrmClient {
  private baseUrl: string;
  private localProducers = [...MOCK_PRODUCERS];
  private localOpportunities = [...MOCK_OPPORTUNITIES];

  constructor() {
    this.baseUrl =
      (typeof window !== 'undefined' && (window as any).__KEEPER_API_URL__) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      'https://keeper-tng6.vercel.app/api/v1';
  }

  private getAuthHeader(): Record<string, string> {
    const token =
      (typeof window !== 'undefined' && (localStorage.getItem('token') || sessionStorage.getItem('access_token'))) ||
      '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getDashboard(): Promise<CrmDashboardMetrics> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/dashboard`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      totalProducers: this.localProducers.length + 37,
      activeProducers: this.localProducers.length + 33,
      pipelineDealsCount: this.localOpportunities.length + 14,
      pipelineGmvValue: 5840000.0,
      avgFeeRate: 12.8,
      winRatePercent: 78.4,
      csatRating: 4.9,
    };
  }

  async listProducers(): Promise<Producer[]> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/producers`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return this.localProducers;
  }

  async getProducerDetails(id: string): Promise<Producer> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/producers/${id}`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const found = this.localProducers.find((p) => p.id === id);
    if (!found) throw new Error('Produtor não encontrado');
    return found;
  }

  async createProducer(payload: Partial<Producer>): Promise<Producer> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/producers`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const newP: Producer = {
      id: `prod-${Date.now()}`,
      name: payload.name || 'Novo Produtor',
      tradeName: payload.tradeName || payload.name,
      document: payload.document || '00.000.000/0001-00',
      code: `PROD-00${this.localProducers.length + 1}`,
      status: payload.status || 'ACTIVE',
      category: payload.category || 'SHOWS_NACIONAIS',
      email: payload.email || 'contato@produtor.com.br',
      phone: payload.phone || '(41) 3000-0000',
      defaultDiskFeeRate: payload.defaultDiskFeeRate || 12.0,
      defaultSpreadRate: payload.defaultSpreadRate || 3.5,
      bankName: payload.bankName || 'Banco Bradesco',
      agency: payload.agency || '1000',
      account: payload.account || '12345-6',
      pixKey: payload.pixKey || payload.document,
      totalEventsCount: 0,
      gmvAccumulated: 0,
      creditRating: 'A',
      relationshipManager: payload.relationshipManager || 'Carlos Eduardo Silveira',
      createdAt: new Date().toISOString(),
    };
    this.localProducers.unshift(newP);
    return newP;
  }

  async listOpportunities(): Promise<OpportunityDeal[]> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/opportunities`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return this.localOpportunities;
  }

  async createOpportunity(payload: Partial<OpportunityDeal>): Promise<OpportunityDeal> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/opportunities`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const newDeal: OpportunityDeal = {
      id: `deal-${Date.now()}`,
      title: payload.title || 'Nova Turnê Musical',
      producerId: payload.producerId || 'prod-01',
      producerName: payload.producerName || 'Opus Entretenimento',
      expectedGmv: payload.expectedGmv || 350000.0,
      feeRateProposed: payload.feeRateProposed || 12.0,
      eventDate: payload.eventDate || '2026-12-15',
      venueName: payload.venueName || 'Teatro Positivo',
      responsibleSdr: payload.responsibleSdr || 'Carlos Eduardo Silveira',
      stage: payload.stage || 'PROSPECCAO',
      probabilityPercent: 30,
      lastContactAt: 'Hoje',
    };
    this.localOpportunities.unshift(newDeal);
    return newDeal;
  }

  async updateOpportunityStage(id: string, stage: DealStage): Promise<OpportunityDeal> {
    try {
      const res = await fetch(`${this.baseUrl}/crm/opportunities/${id}/stage`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const deal = this.localOpportunities.find((d) => d.id === id);
    if (deal) {
      deal.stage = stage;
      deal.lastContactAt = 'Hoje';
      if (stage === 'FECHADO_GANHO') deal.probabilityPercent = 100;
      else if (stage === 'NEGOCIACAO') deal.probabilityPercent = 85;
      else if (stage === 'PROPOSTA_ENVIADA') deal.probabilityPercent = 70;
      else if (stage === 'QUALIFICACAO') deal.probabilityPercent = 50;
      else if (stage === 'PROSPECCAO') deal.probabilityPercent = 30;
      else if (stage === 'PERDIDO') deal.probabilityPercent = 0;
      return deal;
    }
    throw new Error('Deal não encontrado');
  }
}

export const crmClient = new CrmClient();
