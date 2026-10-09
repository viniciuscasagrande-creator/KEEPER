export interface ComprasSummaryItem {
  name: string;
  value: number | null;
  formatted?: string;
  available: boolean;
}

export interface PurchaseRequest {
  id: string;
  code: string;
  item: string;
  department: string;
  requester: string;
  costCenter: string;
  estimatedValue: number;
  date: string;
  status: 'EM_COTACAO' | 'AGUARDANDO_APROVACAO' | 'PEDIDO_EMITIDO' | 'CONCLUIDO' | 'REJEITADO';
  urgency: 'ALTA' | 'MEDIA' | 'BAIXA';
  justification?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierCnpj: string;
  description: string;
  totalAmount: number;
  issueDate: string;
  deliveryDate: string;
  status: 'APROVADO' | 'EM_TRANSITO' | 'RECEBIDO' | 'CANCELADO';
  paymentTerms: string;
  costCenter: string;
}

export interface Supplier {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  category: string;
  rating: number;
  status: 'HOMOLOGADO' | 'EM_ANALISE' | 'BLOQUEADO';
  contactEmail: string;
  phone: string;
}

export interface DepartmentBudget {
  department: string;
  costCenter: string;
  budget: number;
  spent: number;
  committed: number;
  available: number;
}

export interface ComprasDashboardResponse {
  kpis: {
    openRequestsCount: number;
    pendingApprovalsCount: number;
    activeOrdersCount: number;
    activeSuppliersCount: number;
    budgetTotal: number;
    budgetUtilized: number;
    monthlySavings: number;
  };
  recentRequests: PurchaseRequest[];
  recentOrders: PurchaseOrder[];
  suppliers: Supplier[];
  budgetByDepartment: DepartmentBudget[];
  corporateContext: string;
  generatedAt: string;
}

export interface CreatePurchaseRequestDto {
  item: string;
  department: string;
  requester: string;
  costCenter: string;
  estimatedValue: number;
  urgency?: 'ALTA' | 'MEDIA' | 'BAIXA';
  justification: string;
}

export interface CreatePurchaseOrderDto {
  supplierId?: string;
  supplierName: string;
  supplierCnpj: string;
  description: string;
  totalAmount: number;
  costCenter: string;
  paymentTerms: string;
  deliveryDate: string;
}

const ORIGIN = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/$/, '');

// Fallback memory state for seamless client operation
let localRequests: PurchaseRequest[] = [
  {
    id: 'req-01',
    code: 'SOL-2026-0012',
    item: '10x Notebooks Dell Latitude i7 32GB RAM',
    department: 'Tecnologia & Cloud',
    requester: 'Lucas Santana (Tech Lead)',
    costCenter: 'CC-101 - TI & Infraestrutura Cloud',
    estimatedValue: 75000.0,
    date: '2026-10-05',
    status: 'EM_COTACAO',
    urgency: 'ALTA',
  },
  {
    id: 'req-02',
    code: 'SOL-2026-0011',
    item: 'Licenças Corporativas SaaS Datadog & AWS Enterprise',
    department: 'Tecnologia & Cloud',
    requester: 'Camila Fernandes',
    costCenter: 'CC-101 - TI & Infraestrutura Cloud',
    estimatedValue: 48000.0,
    date: '2026-10-04',
    status: 'AGUARDANDO_APROVACAO',
    urgency: 'ALTA',
  },
  {
    id: 'req-03',
    code: 'SOL-2026-0010',
    item: 'Mobiliário e Estações de Trabalho — Sede Curitiba',
    department: 'Administrativo & Facilities',
    requester: 'Mariana Duarte',
    costCenter: 'CC-204 - Operações Prediais',
    estimatedValue: 32000.0,
    date: '2026-10-02',
    status: 'PEDIDO_EMITIDO',
    urgency: 'MEDIA',
  },
  {
    id: 'req-04',
    code: 'SOL-2026-0009',
    item: 'Auditoria Externa de Compliance Contábil & Tributário',
    department: 'Controladoria & Finanças',
    requester: 'Dr. Roberto Meirelles (CRC)',
    costCenter: 'CC-302 - Controladoria Disk',
    estimatedValue: 55000.0,
    date: '2026-09-28',
    status: 'CONCLUIDO',
    urgency: 'MEDIA',
  },
  {
    id: 'req-05',
    code: 'SOL-2026-0008',
    item: 'Monitores 27" 4K para Operações de Monitoramento PDV',
    department: 'Operações de Bilheteria',
    requester: 'Marcos Vinicius',
    costCenter: 'CC-201 - Operações PDV',
    estimatedValue: 18500.0,
    date: '2026-09-25',
    status: 'EM_COTACAO',
    urgency: 'BAIXA',
  },
];

let localOrders: PurchaseOrder[] = [
  {
    id: 'ord-01',
    orderNumber: 'PED-2026-00431',
    supplierName: 'Dell Computadores do Brasil Ltda',
    supplierCnpj: '72.381.189/0001-10',
    description: 'Aquisição de Servidores e Estações de Desenvolvimento TI',
    totalAmount: 75000.0,
    issueDate: '2026-10-02',
    deliveryDate: '2026-10-18',
    status: 'APROVADO',
    paymentTerms: '28 / 56 dias via Boleto',
    costCenter: 'CC-101 - TI & Infraestrutura Cloud',
  },
  {
    id: 'ord-02',
    orderNumber: 'PED-2026-00430',
    supplierName: 'Amazon Web Services Latam Ltda',
    supplierCnpj: '33.000.111/0001-99',
    description: 'Contrato Anual de Infraestrutura Cloud & CDN Dedicada',
    totalAmount: 145000.0,
    issueDate: '2026-10-01',
    deliveryDate: '2026-10-01',
    status: 'RECEBIDO',
    paymentTerms: 'Mensal Débito Automático',
    costCenter: 'CC-101 - TI & Infraestrutura Cloud',
  },
  {
    id: 'ord-03',
    orderNumber: 'PED-2026-00429',
    supplierName: 'Office Tower Gestão Predial S.A.',
    supplierCnpj: '44.222.333/0001-88',
    description: 'Reforma e Mobiliário Ergonômico Recepção e Operações',
    totalAmount: 32000.0,
    issueDate: '2026-09-26',
    deliveryDate: '2026-10-12',
    status: 'EM_TRANSITO',
    paymentTerms: '30% Sinal + 70% na Entrega',
    costCenter: 'CC-204 - Operações Prediais',
  },
  {
    id: 'ord-04',
    orderNumber: 'PED-2026-00428',
    supplierName: 'Baker Tilly Brasil Auditores Independentes',
    supplierCnpj: '55.333.444/0001-77',
    description: 'Auditoria Societária Independente Exercício 2026',
    totalAmount: 55000.0,
    issueDate: '2026-09-20',
    deliveryDate: '2026-10-05',
    status: 'RECEBIDO',
    paymentTerms: '15 / 30 / 45 dias',
    costCenter: 'CC-302 - Controladoria Disk',
  },
];

const localSuppliers: Supplier[] = [
  {
    id: 'sup-01',
    name: 'Dell Computadores do Brasil Ltda',
    tradeName: 'Dell Technologies',
    cnpj: '72.381.189/0001-10',
    category: 'Hardware & Equipamentos',
    rating: 4.9,
    status: 'HOMOLOGADO',
    contactEmail: 'corporativo@dell.com.br',
    phone: '(11) 4004-0100',
  },
  {
    id: 'sup-02',
    name: 'Amazon Web Services Latam Ltda',
    tradeName: 'AWS Brasil',
    cnpj: '33.000.111/0001-99',
    category: 'Infraestrutura Cloud & TI',
    rating: 5.0,
    status: 'HOMOLOGADO',
    contactEmail: 'billing-latam@amazon.com',
    phone: '(11) 3958-4000',
  },
  {
    id: 'sup-03',
    name: 'Office Tower Gestão Predial S.A.',
    tradeName: 'Office Tower Facilities',
    cnpj: '44.222.333/0001-88',
    category: 'Facilities & Mobiliário',
    rating: 4.6,
    status: 'HOMOLOGADO',
    contactEmail: 'comercial@officetower.com.br',
    phone: '(41) 3222-9000',
  },
  {
    id: 'sup-04',
    name: 'Baker Tilly Brasil Auditores Independentes',
    tradeName: 'Baker Tilly',
    cnpj: '55.333.444/0001-77',
    category: 'Consultoria & Auditoria',
    rating: 4.8,
    status: 'HOMOLOGADO',
    contactEmail: 'contato@bakertilly.com.br',
    phone: '(41) 3010-8800',
  },
  {
    id: 'sup-05',
    name: 'Kalunga Comércio e Indústria Gráfica S.A.',
    tradeName: 'Kalunga Corporativo',
    cnpj: '43.283.811/0001-50',
    category: 'Suprimentos & Escritório',
    rating: 4.5,
    status: 'HOMOLOGADO',
    contactEmail: 'vendasgov@kalunga.com.br',
    phone: '(11) 3346-9966',
  },
];

export const comprasClient = {
  async getPainel(): Promise<{ items: ComprasSummaryItem[]; source: string; generatedAt: string }> {
    try {
      const res = await fetch(`${ORIGIN}/compras/painel`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        items: [
          { name: 'Solicitações em aberto', value: 12, formatted: '12 Abertas', available: true },
          { name: 'Aguardando aprovação', value: 5, formatted: '5 Pendentes', available: true },
          { name: 'Pedidos em andamento', value: 18, formatted: '18 Ativos', available: true },
          { name: 'Fornecedores homologados', value: 42, formatted: '42 Ativos', available: true },
          { name: 'Economia em cotações', value: 38400, formatted: 'R$ 38.400,00', available: true },
        ],
        source: 'FALLBACK_LOCAL_STORAGE',
        generatedAt: new Date().toISOString(),
      };
    }
  },

  async getDashboard(): Promise<ComprasDashboardResponse> {
    try {
      const res = await fetch(`${ORIGIN}/compras/dashboard`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        kpis: {
          openRequestsCount: 12,
          pendingApprovalsCount: 5,
          activeOrdersCount: 18,
          activeSuppliersCount: 42,
          budgetTotal: 650000.0,
          budgetUtilized: 432500.0,
          monthlySavings: 38400.0,
        },
        recentRequests: localRequests,
        recentOrders: localOrders,
        suppliers: localSuppliers,
        budgetByDepartment: [
          {
            department: 'Tecnologia & Cloud',
            costCenter: 'CC-101 TI',
            budget: 280000.0,
            spent: 193000.0,
            committed: 48000.0,
            available: 39000.0,
          },
          {
            department: 'Operações e PDVs',
            costCenter: 'CC-201 Operações',
            budget: 120000.0,
            spent: 72000.0,
            committed: 18500.0,
            available: 29500.0,
          },
          {
            department: 'Administrativo & Predial',
            costCenter: 'CC-204 Facilities',
            budget: 90000.0,
            spent: 58000.0,
            committed: 14000.0,
            available: 18000.0,
          },
          {
            department: 'Controladoria & Jurídico',
            costCenter: 'CC-302 Controladoria',
            budget: 100000.0,
            spent: 65000.0,
            committed: 20000.0,
            available: 15000.0,
          },
          {
            department: 'Comercial & Marketing',
            costCenter: 'CC-301 Comercial',
            budget: 60000.0,
            spent: 44500.0,
            committed: 8000.0,
            available: 7500.0,
          },
        ],
        corporateContext: 'Disk Ingressos Entretenimento S.A. — Despesas 100% Corporativas',
        generatedAt: new Date().toISOString(),
      };
    }
  },

  async getRequests(): Promise<PurchaseRequest[]> {
    try {
      const res = await fetch(`${ORIGIN}/compras/solicitacoes`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return [...localRequests];
    }
  },

  async createRequest(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    try {
      const res = await fetch(`${ORIGIN}/compras/solicitacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const newReq: PurchaseRequest = {
        id: `req-${Date.now()}`,
        code: `SOL-2026-00${localRequests.length + 13}`,
        item: dto.item,
        department: dto.department,
        requester: dto.requester,
        costCenter: dto.costCenter,
        estimatedValue: dto.estimatedValue,
        date: new Date().toISOString().split('T')[0],
        status: 'EM_COTACAO',
        urgency: dto.urgency || 'MEDIA',
        justification: dto.justification,
      };
      localRequests = [newReq, ...localRequests];
      return newReq;
    }
  },

  async approveRequest(id: string, approved: boolean = true): Promise<{ success: boolean; request: PurchaseRequest }> {
    try {
      const res = await fetch(`${ORIGIN}/compras/solicitacoes/${id}/aprovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const found = localRequests.find((r) => r.id === id);
      if (found) {
        found.status = approved ? 'PEDIDO_EMITIDO' : 'REJEITADO';
        return { success: true, request: found };
      }
      throw new Error(`Solicitação não encontrada: ${id}`);
    }
  },

  async getOrders(): Promise<PurchaseOrder[]> {
    try {
      const res = await fetch(`${ORIGIN}/compras/pedidos`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return [...localOrders];
    }
  },

  async createOrder(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    try {
      const res = await fetch(`${ORIGIN}/compras/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const newOrder: PurchaseOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `PED-2026-00${localOrders.length + 432}`,
        supplierName: dto.supplierName,
        supplierCnpj: dto.supplierCnpj,
        description: dto.description,
        totalAmount: dto.totalAmount,
        issueDate: new Date().toISOString().split('T')[0],
        deliveryDate: dto.deliveryDate || '2026-10-30',
        status: 'APROVADO',
        paymentTerms: dto.paymentTerms || '30 dias Boleto',
        costCenter: dto.costCenter,
      };
      localOrders = [newOrder, ...localOrders];
      return newOrder;
    }
  },

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const res = await fetch(`${ORIGIN}/compras/fornecedores`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return [...localSuppliers];
    }
  },
};
