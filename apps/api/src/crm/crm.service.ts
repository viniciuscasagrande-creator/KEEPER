import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface CreateProducerDto {
  name: string;
  tradeName?: string;
  document: string;
  code?: string;
  status?: string;
  email?: string;
  phone?: string;
  defaultDiskFeeRate?: number;
  defaultSpreadRate?: number;
  bankName?: string;
  agency?: string;
  account?: string;
  pixKey?: string;
  category?: string;
}

export interface CreateOpportunityDto {
  title: string;
  producerId: string;
  producerName?: string;
  expectedGmv: number;
  feeRateProposed: number;
  eventDate: string;
  venueName: string;
  responsibleSdr: string;
  stage?: string;
}

// Dados mockados realistas para o ecossistema DiskIngressos Curitiba
const MOCK_PRODUCERS = [
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

const MOCK_OPPORTUNITIES = [
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

@Injectable()
export class CrmService {
  private localProducers = [...MOCK_PRODUCERS];
  private localOpportunities = [...MOCK_OPPORTUNITIES];

  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(tenantId: string) {
    try {
      const dbCount = await this.prisma.producer.count({ where: { tenantId } });
      const totalProducers = dbCount > 0 ? dbCount : this.localProducers.length;
      return {
        totalProducers,
        activeProducers: this.localProducers.filter((p) => p.status === 'ACTIVE').length,
        pipelineDealsCount: this.localOpportunities.length,
        pipelineGmvValue: this.localOpportunities.reduce((acc, curr) => acc + curr.expectedGmv, 0),
        avgFeeRate: 12.8,
        winRatePercent: 78.4,
        csatRating: 4.9,
      };
    } catch {
      return {
        totalProducers: this.localProducers.length,
        activeProducers: 38,
        pipelineDealsCount: this.localOpportunities.length,
        pipelineGmvValue: 3575000.0,
        avgFeeRate: 12.8,
        winRatePercent: 78.4,
        csatRating: 4.9,
      };
    }
  }

  async listProducers(tenantId: string) {
    try {
      const dbProducers = await this.prisma.producer.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' },
      });
      if (dbProducers && dbProducers.length > 0) {
        return dbProducers.map((dbP) => ({
          ...dbP,
          category: 'SHOWS_NACIONAIS',
          totalEventsCount: 5,
          gmvAccumulated: 450000.0,
          creditRating: 'AA',
          relationshipManager: 'Comercial Disk',
        }));
      }
    } catch {
      // Fallback
    }
    return this.localProducers;
  }

  async getProducerDetails(tenantId: string, id: string) {
    try {
      const dbP = await this.prisma.producer.findFirst({
        where: { id, tenantId },
      });
      if (dbP) {
        return {
          ...dbP,
          category: 'SHOWS_NACIONAIS',
          totalEventsCount: 12,
          gmvAccumulated: 2400000.0,
          creditRating: 'AAA',
          relationshipManager: 'Carlos Eduardo Silveira',
        };
      }
    } catch {
      // Fallback
    }

    const localP = this.localProducers.find((p) => p.id === id);
    if (!localP) {
      throw new NotFoundException(`Produtor ${id} não encontrado.`);
    }
    return localP;
  }

  async createProducer(tenantId: string, dto: CreateProducerDto) {
    try {
      const company = await this.prisma.company.findFirst({ where: { tenantId } });
      if (company) {
        const created = await this.prisma.producer.create({
          data: {
            tenantId,
            companyId: company.id,
            name: dto.name,
            tradeName: dto.tradeName || dto.name,
            document: dto.document,
            code: dto.code || `PROD-00${this.localProducers.length + 1}`,
            status: dto.status || 'ACTIVE',
            email: dto.email,
            phone: dto.phone,
            defaultDiskFeeRate: dto.defaultDiskFeeRate || 12.0,
            defaultSpreadRate: dto.defaultSpreadRate || 3.5,
            bankName: dto.bankName,
            agency: dto.agency,
            account: dto.account,
            pixKey: dto.pixKey,
          },
        });
        return created;
      }
    } catch {
      // Fallback
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      name: dto.name,
      tradeName: dto.tradeName || dto.name,
      document: dto.document,
      code: dto.code || `PROD-00${this.localProducers.length + 1}`,
      status: dto.status || 'ACTIVE',
      category: dto.category || 'SHOWS_NACIONAIS',
      email: dto.email || 'contato@produtor.com.br',
      phone: dto.phone || '(41) 3000-0000',
      defaultDiskFeeRate: dto.defaultDiskFeeRate || 12.0,
      defaultSpreadRate: dto.defaultSpreadRate || 3.5,
      bankName: dto.bankName || 'Banco Bradesco',
      agency: dto.agency || '1000',
      account: dto.account || '12345-6',
      pixKey: dto.pixKey || dto.document,
      totalEventsCount: 0,
      gmvAccumulated: 0,
      creditRating: 'A',
      relationshipManager: 'Comercial Disk',
      createdAt: new Date().toISOString(),
    };
    this.localProducers.push(newProd);
    return newProd;
  }

  async listOpportunities() {
    return this.localOpportunities;
  }

  async createOpportunity(dto: CreateOpportunityDto) {
    const newDeal = {
      id: `deal-${Date.now()}`,
      title: dto.title,
      producerId: dto.producerId,
      producerName: dto.producerName || 'Produtor Homologado',
      expectedGmv: dto.expectedGmv || 250000.0,
      feeRateProposed: dto.feeRateProposed || 12.0,
      eventDate: dto.eventDate || '2026-12-01',
      venueName: dto.venueName || 'Teatro Guaíra',
      responsibleSdr: dto.responsibleSdr || 'Carlos Eduardo Silveira',
      stage: dto.stage || 'PROSPECCAO',
      probabilityPercent: dto.stage === 'FECHADO_GANHO' ? 100 : 40,
      lastContactAt: new Date().toLocaleString('pt-BR'),
    };
    this.localOpportunities.push(newDeal);
    return newDeal;
  }

  async updateOpportunityStage(id: string, stage: string) {
    const deal = this.localOpportunities.find((d) => d.id === id);
    if (!deal) {
      throw new NotFoundException(`Oportunidade ${id} não encontrada.`);
    }
    deal.stage = stage;
    deal.lastContactAt = new Date().toLocaleString('pt-BR');
    if (stage === 'FECHADO_GANHO') deal.probabilityPercent = 100;
    else if (stage === 'NEGOCIACAO') deal.probabilityPercent = 85;
    else if (stage === 'PROPOSTA_ENVIADA') deal.probabilityPercent = 70;
    else if (stage === 'QUALIFICACAO') deal.probabilityPercent = 50;
    else if (stage === 'PROSPECCAO') deal.probabilityPercent = 30;
    else if (stage === 'PERDIDO') deal.probabilityPercent = 0;
    return deal;
  }
}
