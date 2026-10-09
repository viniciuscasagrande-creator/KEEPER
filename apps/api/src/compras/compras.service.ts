import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export type PurchaseRequestStatus =
  | 'EM_COTACAO'
  | 'AGUARDANDO_APROVACAO'
  | 'PEDIDO_EMITIDO'
  | 'CONCLUIDO'
  | 'REJEITADO';

export type PurchaseRequestUrgency = 'ALTA' | 'MEDIA' | 'BAIXA';
export type PurchaseOrderStatus = 'APROVADO' | 'EM_TRANSITO' | 'RECEBIDO' | 'CANCELADO';
export type SupplierStatus = 'HOMOLOGADO' | 'EM_ANALISE' | 'BLOQUEADO';

export interface PurchaseRequestItem {
  id: string;
  code: string;
  item: string;
  department: string;
  requester: string;
  costCenter: string;
  estimatedValue: number;
  date: string;
  status: PurchaseRequestStatus;
  urgency: PurchaseRequestUrgency;
  justification?: string;
}

export interface PurchaseOrderItem {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierCnpj: string;
  description: string;
  totalAmount: number;
  issueDate: string;
  deliveryDate: string;
  status: PurchaseOrderStatus;
  paymentTerms: string;
  costCenter: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  tradeName: string;
  cnpj: string;
  category: string;
  rating: number;
  status: SupplierStatus;
  contactEmail: string;
  phone: string;
}

export interface ComprasDashboardData {
  kpis: {
    openRequestsCount: number;
    pendingApprovalsCount: number;
    activeOrdersCount: number;
    activeSuppliersCount: number;
    budgetTotal: number;
    budgetUtilized: number;
    monthlySavings: number;
  };
  recentRequests: PurchaseRequestItem[];
  recentOrders: PurchaseOrderItem[];
  suppliers: SupplierItem[];
  budgetByDepartment: Array<{
    department: string;
    costCenter: string;
    budget: number;
    spent: number;
    committed: number;
    available: number;
  }>;
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

@Injectable()
export class ComprasService {
  private readonly logger = new Logger(ComprasService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Mock de dados operacionais em memória da Disk Empresa
  private purchaseRequests: PurchaseRequestItem[] = [
    {
      id: 'req-01',
      code: 'SOL-2026-0012',
      item: '10x Notebooks Dell Latitude i7 32GB RAM',
      department: 'Tecnologia & Cloud',
      requester: 'Lucas Santana (Tech Lead)',
      costCenter: 'CC-101 - TI & Infraestrutura Cloud',
      estimatedValue: 75000.0,
      date: '2026-10-05',
      status: 'EM_COTACAO' as const,
      urgency: 'ALTA' as const,
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
      status: 'AGUARDANDO_APROVACAO' as const,
      urgency: 'ALTA' as const,
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
      status: 'PEDIDO_EMITIDO' as const,
      urgency: 'MEDIA' as const,
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
      status: 'CONCLUIDO' as const,
      urgency: 'MEDIA' as const,
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
      status: 'EM_COTACAO' as const,
      urgency: 'BAIXA' as const,
    },
  ];

  private purchaseOrders: PurchaseOrderItem[] = [
    {
      id: 'ord-01',
      orderNumber: 'PED-2026-00431',
      supplierName: 'Dell Computadores do Brasil Ltda',
      supplierCnpj: '72.381.189/0001-10',
      description: 'Aquisição de Servidores e Estações de Desenvolvimento TI',
      totalAmount: 75000.0,
      issueDate: '2026-10-02',
      deliveryDate: '2026-10-18',
      status: 'APROVADO' as const,
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
      status: 'RECEBIDO' as const,
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
      status: 'EM_TRANSITO' as const,
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
      status: 'RECEBIDO' as const,
      paymentTerms: '15 / 30 / 45 dias',
      costCenter: 'CC-302 - Controladoria Disk',
    },
  ];

  private suppliers: SupplierItem[] = [
    {
      id: 'sup-01',
      name: 'Dell Computadores do Brasil Ltda',
      tradeName: 'Dell Technologies',
      cnpj: '72.381.189/0001-10',
      category: 'Hardware & Equipamentos',
      rating: 4.9,
      status: 'HOMOLOGADO' as const,
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
      status: 'HOMOLOGADO' as const,
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
      status: 'HOMOLOGADO' as const,
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
      status: 'HOMOLOGADO' as const,
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
      status: 'HOMOLOGADO' as const,
      contactEmail: 'vendasgov@kalunga.com.br',
      phone: '(11) 3346-9966',
    },
  ];

  async getDashboard(tenantId: string, companyId: string): Promise<ComprasDashboardData> {
    return {
      kpis: {
        openRequestsCount: 12,
        pendingApprovalsCount: 5,
        activeOrdersCount: 18,
        activeSuppliersCount: 42,
        budgetTotal: 650000.0,
        budgetUtilized: 432500.0,
        monthlySavings: 38400.0, // Economia obtida por negociações em RFQ
      },
      recentRequests: this.purchaseRequests,
      recentOrders: this.purchaseOrders,
      suppliers: this.suppliers,
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

  async getRequests(tenantId: string, companyId: string) {
    return this.purchaseRequests;
  }

  async createRequest(tenantId: string, companyId: string, dto: CreatePurchaseRequestDto) {
    const nextNum = (this.purchaseRequests.length + 13).toString().padStart(4, '0');
    const newReq = {
      id: `req-${Date.now()}`,
      code: `SOL-2026-${nextNum}`,
      item: dto.item,
      department: dto.department,
      requester: dto.requester,
      costCenter: dto.costCenter,
      estimatedValue: dto.estimatedValue,
      date: new Date().toISOString().split('T')[0],
      status: 'EM_COTACAO' as const,
      urgency: dto.urgency || ('MEDIA' as const),
    };

    this.purchaseRequests.unshift(newReq);
    this.logger.log(`Solicitação de compra ${newReq.code} criada com sucesso para ${dto.department}`);
    return newReq;
  }

  async approveRequest(tenantId: string, companyId: string, id: string, approved: boolean) {
    const req = this.purchaseRequests.find((r) => r.id === id);
    if (!req) {
      throw new Error(`Solicitação com ID ${id} não foi encontrada.`);
    }
    req.status = approved ? 'PEDIDO_EMITIDO' : 'REJEITADO';
    this.logger.log(`Solicitação ${req.code} ${approved ? 'aprovada' : 'rejeitada'}`);
    return { success: true, request: req, message: `Solicitação ${req.code} ${approved ? 'aprovada e autorizada para emissão de pedido' : 'rejeitada'}.` };
  }

  async getOrders(tenantId: string, companyId: string) {
    return this.purchaseOrders;
  }

  async createOrder(tenantId: string, companyId: string, dto: CreatePurchaseOrderDto) {
    const nextNum = (this.purchaseOrders.length + 432).toString();
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `PED-2026-00${nextNum}`,
      supplierName: dto.supplierName,
      supplierCnpj: dto.supplierCnpj,
      description: dto.description,
      totalAmount: dto.totalAmount,
      issueDate: new Date().toISOString().split('T')[0],
      deliveryDate: dto.deliveryDate || '2026-10-30',
      status: 'APROVADO' as const,
      paymentTerms: dto.paymentTerms || '30 dias Boleto',
      costCenter: dto.costCenter,
    };

    this.purchaseOrders.unshift(newOrder);
    this.logger.log(`Pedido de compra ${newOrder.orderNumber} emitido para ${dto.supplierName}`);
    return newOrder;
  }

  async getSuppliers(tenantId: string, companyId: string) {
    return this.suppliers;
  }
}
