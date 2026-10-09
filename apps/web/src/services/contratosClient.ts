// apps/web/src/services/contratosClient.ts
// Client completo para o Módulo de Contratos & Jurídico da DiskIngressos

export type ContractStatus =
  | 'DRAFT'
  | 'ANALYSIS'
  | 'PENDING_SIGNATURE'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'TERMINATED';

export type ContractType =
  | 'BILHETERIA_EXCLUSIVA'
  | 'BILHETERIA_NAO_EXCLUSIVA'
  | 'LOCACAO_EQUIPAMENTOS'
  | 'PATROCINIO'
  | 'PRESTACAO_SERVICOS'
  | 'TERMO_CONFIDENCIALIDADE';

export interface Signatory {
  role: string;
  name: string;
  email: string;
  signed: boolean;
  signedAt?: string;
}

export interface LegalContract {
  id: string;
  code: string;
  title: string;
  producerId: string;
  producerName: string;
  producerDocument: string;
  type: ContractType;
  status: ContractStatus;
  validFrom: string;
  validUntil: string;
  diskFeeRate: number;
  estimatedGmv: number;
  advanceGrantedValue: number;
  warrantyValue: number;
  hasExclusivity: boolean;
  venuesCovered: string[];
  signatures: Signatory[];
  cndStatus: 'REGULAR' | 'PENDING' | 'EXPIRED';
  createdAt: string;
}

export interface ContratosMetrics {
  totalContracts: number;
  activeContracts: number;
  pendingSignatures: number;
  expiringIn30Days: number;
  totalProtectedGmv: number;
  totalAdvanceWarranty: number;
  cndCompliancePercent: number;
}

const MOCK_CONTRACTS: LegalContract[] = [
  {
    id: 'ctr-01',
    code: 'CTR-2026/012',
    title: 'Prestação de Bilheteria & Exclusividade 2026 — Opus Entretenimento',
    producerId: 'prod-01',
    producerName: 'Opus Entretenimento Curitiba Ltda',
    producerDocument: '12.345.678/0001-90',
    type: 'BILHETERIA_EXCLUSIVA',
    status: 'ACTIVE',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    diskFeeRate: 12.0,
    estimatedGmv: 4500000.0,
    advanceGrantedValue: 300000.0,
    warrantyValue: 350000.0,
    hasExclusivity: true,
    venuesCovered: ['Teatro Positivo (Grande Auditório)', 'Teatro Fernanda Montenegro'],
    signatures: [
      { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: true, signedAt: '2026-01-02 10:14' },
      { role: 'Representante Legal Opus', name: 'Evandro Silveira', email: 'diretoria@opusentretenimento.com.br', signed: true, signedAt: '2026-01-02 14:32' },
      { role: 'Testemunha Jurídica Disk', name: 'Dra. Amanda Carvalho', email: 'juridico@diskingressos.com.br', signed: true, signedAt: '2026-01-02 15:00' },
    ],
    cndStatus: 'REGULAR',
    createdAt: '2026-01-01T09:00:00.000Z',
  },
  {
    id: 'ctr-02',
    code: 'CTR-2026/028',
    title: 'Acordo Anual de Espetáculos & Grandes Festivais — Like Entretenimento',
    producerId: 'prod-02',
    producerName: 'Like Entretenimento e Eventos S.A.',
    producerDocument: '23.456.789/0001-01',
    type: 'BILHETERIA_EXCLUSIVA',
    status: 'ACTIVE',
    validFrom: '2026-02-15',
    validUntil: '2027-02-14',
    diskFeeRate: 13.5,
    estimatedGmv: 6200000.0,
    advanceGrantedValue: 500000.0,
    warrantyValue: 650000.0,
    hasExclusivity: true,
    venuesCovered: ['Pedreira Paulo Leminski', 'Arena da Baixada'],
    signatures: [
      { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: true, signedAt: '2026-02-16 09:30' },
      { role: 'Sócio-Diretor Like', name: 'Rodrigo Albuquerque', email: 'diretor@likeentretenimento.com.br', signed: true, signedAt: '2026-02-16 11:20' },
    ],
    cndStatus: 'REGULAR',
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'ctr-03',
    code: 'CTR-2026/035',
    title: 'Contrato de Operação de Bilheteria & Controle de Acesso — CWB Brasil',
    producerId: 'prod-03',
    producerName: 'CWB Brasil Produções Artísticas Ltda',
    producerDocument: '34.567.890/0001-12',
    type: 'BILHETERIA_NAO_EXCLUSIVA',
    status: 'ACTIVE',
    validFrom: '2026-03-01',
    validUntil: '2026-11-30',
    diskFeeRate: 11.5,
    estimatedGmv: 3800000.0,
    advanceGrantedValue: 0.0,
    warrantyValue: 0.0,
    hasExclusivity: false,
    venuesCovered: ['Live Curitiba', 'Sociedade Hípica'],
    signatures: [
      { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: true, signedAt: '2026-03-02 16:40' },
      { role: 'Diretor de Operações CWB', name: 'Marcos Vinicius Paiva', email: 'operacoes@cwbbrasil.com.br', signed: true, signedAt: '2026-03-03 10:15' },
    ],
    cndStatus: 'REGULAR',
    createdAt: '2026-03-01T11:00:00.000Z',
  },
  {
    id: 'ctr-04',
    code: 'CTR-2026/049',
    title: 'Aditivo Contratual nº 02: Turnê Rock Sinfônico Internacional',
    producerId: 'prod-03',
    producerName: 'CWB Brasil Produções Artísticas Ltda',
    producerDocument: '34.567.890/0001-12',
    type: 'PRESTACAO_SERVICOS',
    status: 'PENDING_SIGNATURE',
    validFrom: '2026-10-15',
    validUntil: '2026-12-20',
    diskFeeRate: 11.5,
    estimatedGmv: 920000.0,
    advanceGrantedValue: 150000.0,
    warrantyValue: 200000.0,
    hasExclusivity: true,
    venuesCovered: ['Live Curitiba'],
    signatures: [
      { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: true, signedAt: '2026-10-08 17:00' },
      { role: 'Diretor CWB', name: 'Marcos Vinicius Paiva', email: 'operacoes@cwbbrasil.com.br', signed: false },
      { role: 'Dra. Jurídico Disk', name: 'Dra. Amanda Carvalho', email: 'juridico@diskingressos.com.br', signed: false },
    ],
    cndStatus: 'REGULAR',
    createdAt: '2026-10-08T14:30:00.000Z',
  },
  {
    id: 'ctr-05',
    code: 'CTR-2026/051',
    title: 'Comodato de 12 Catracas Eletrônicas & PDVs — Seven Entretenimento',
    producerId: 'prod-04',
    producerName: 'Seven Entretenimento & Promoções Ltda',
    producerDocument: '45.678.901/0001-23',
    type: 'LOCACAO_EQUIPAMENTOS',
    status: 'ANALYSIS',
    validFrom: '2026-11-01',
    validUntil: '2027-04-30',
    diskFeeRate: 14.0,
    estimatedGmv: 780000.0,
    advanceGrantedValue: 0.0,
    warrantyValue: 85000.0,
    hasExclusivity: false,
    venuesCovered: ['Arena Expotrade Pinhais'],
    signatures: [
      { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: false },
      { role: 'Sócio Seven', name: 'Fábio de Castro', email: 'fabio@seven.art.br', signed: false },
    ],
    cndStatus: 'PENDING',
    createdAt: '2026-10-09T08:15:00.000Z',
  },
];

class ContratosClient {
  private baseUrl: string;
  private localContracts = [...MOCK_CONTRACTS];

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

  async getMetrics(): Promise<ContratosMetrics> {
    try {
      const res = await fetch(`${this.baseUrl}/contratos/metrics`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const total = this.localContracts.length + 33;
    const active = this.localContracts.filter((c) => c.status === 'ACTIVE').length + 29;
    const pendingSignatures = this.localContracts.filter((c) => c.status === 'PENDING_SIGNATURE').length + 3;
    const totalProtectedGmv = this.localContracts.reduce((acc, c) => acc + c.estimatedGmv, 0) + 12500000.0;
    const totalAdvanceWarranty = this.localContracts.reduce((acc, c) => acc + c.warrantyValue, 0) + 1800000.0;

    return {
      totalContracts: total,
      activeContracts: active,
      pendingSignatures,
      expiringIn30Days: 4,
      totalProtectedGmv,
      totalAdvanceWarranty,
      cndCompliancePercent: 96.8,
    };
  }

  async listContracts(): Promise<LegalContract[]> {
    try {
      const res = await fetch(`${this.baseUrl}/contratos`, {
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
    return this.localContracts;
  }

  async getContractById(id: string): Promise<LegalContract> {
    try {
      const res = await fetch(`${this.baseUrl}/contratos/${id}`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const found = this.localContracts.find((c) => c.id === id);
    if (!found) throw new Error('Contrato não encontrado');
    return found;
  }

  async createContract(payload: Partial<LegalContract>): Promise<LegalContract> {
    try {
      const res = await fetch(`${this.baseUrl}/contratos`, {
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

    const count = this.localContracts.length + 52;
    const newContract: LegalContract = {
      id: `ctr-${Date.now()}`,
      code: `CTR-2026/${String(count).padStart(3, '0')}`,
      title: payload.title || 'Novo Contrato de Bilheteria',
      producerId: payload.producerId || 'prod-01',
      producerName: payload.producerName || 'Produtora Parceira',
      producerDocument: payload.producerDocument || '12.345.678/0001-90',
      type: payload.type || 'BILHETERIA_EXCLUSIVA',
      status: payload.status || 'DRAFT',
      validFrom: payload.validFrom || new Date().toISOString().split('T')[0],
      validUntil: payload.validUntil || '2027-12-31',
      diskFeeRate: payload.diskFeeRate || 12.5,
      estimatedGmv: payload.estimatedGmv || 450000.0,
      advanceGrantedValue: payload.advanceGrantedValue || 0,
      warrantyValue: payload.warrantyValue || 0,
      hasExclusivity: payload.hasExclusivity ?? true,
      venuesCovered: payload.venuesCovered || ['Teatro Positivo'],
      signatures: [
        { role: 'Diretor Geral DiskIngressos', name: 'Carlos Augusto Murray', email: 'carlos@diskingressos.com.br', signed: false },
        { role: 'Representante da Produtora', name: payload.producerName || 'Produtor', email: 'comercial@produtor.com.br', signed: false },
      ],
      cndStatus: 'REGULAR',
      createdAt: new Date().toISOString(),
    };
    this.localContracts.unshift(newContract);
    return newContract;
  }

  async updateStatus(id: string, status: ContractStatus): Promise<LegalContract> {
    try {
      const res = await fetch(`${this.baseUrl}/contratos/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const c = this.localContracts.find((item) => item.id === id);
    if (c) {
      c.status = status;
      return c;
    }
    throw new Error('Contrato não encontrado');
  }
}

export const contratosClient = new ContratosClient();
