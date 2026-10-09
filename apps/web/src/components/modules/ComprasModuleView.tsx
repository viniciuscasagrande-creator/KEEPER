import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  Search,
  Plus,
  Filter,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Download,
  Building2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Sliders,
  CalendarClock,
  PackageCheck,
  Award,
  FileCheck,
  RefreshCw,
  X,
  Lock,
  PanelRight,
  PanelLeft,
  Sun,
  Moon,
  Info,
  Percent,
  Tag,
  ClipboardCheck,
  Users,
  Receipt,
  Truck,
  RotateCcw,
  Check,
  Star,
  ExternalLink,
  Laptop,
  Package,
  ArrowRightLeft,
  Boxes,
} from 'lucide-react';
import {
  comprasClient,
  ComprasDashboardResponse,
  PurchaseRequest,
  PurchaseOrder,
  Supplier,
  StockItem,
  Warehouse,
  KardexMovement,
} from '../../services/comprasClient';

export interface ComprasSubmenuDef {
  id: string;
  label: string;
  group:
    | 'Visão Geral'
    | 'Armazenagem & Almoxarifado'
    | 'Fornecedores e Cotações'
    | 'Pedidos e Contratações'
    | 'Recebimento e Almoxarifado'
    | 'Gestão Financeira'
    | 'Patrimônio e Tecnologia'
    | 'Controle e Governança';
  icon: React.ElementType;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const COMPRAS_SUBMENUS: ComprasSubmenuDef[] = [
  // 1. Visão Geral (3)
  {
    id: 'comp-dashboard',
    label: 'Dashboard de Compras',
    group: 'Visão Geral',
    icon: ShoppingCart,
    purpose: 'KPIs, cotações em andamento, pedidos emitidos e acompanhamento orçamentário.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'comp-solicitacoes',
    label: 'Central de Solicitações',
    group: 'Visão Geral',
    icon: FileText,
    purpose: 'Requisições internas de compras da empresa com triagem e fluxos de aprovação.',
    badge: '12 Abertas',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'comp-planejamento',
    label: 'Planejamento de Compras',
    group: 'Visão Geral',
    icon: CalendarClock,
    purpose: 'Previsão de demanda de suprimentos corporativos, TI e compras sazonais da Disk.',
  },

  // 2. Armazenagem & Almoxarifado (6)
  {
    id: 'est-products',
    label: 'Catálogo de Produtos & SKUs',
    group: 'Armazenagem & Almoxarifado',
    icon: Package,
    purpose: 'Cadastro técnico de materiais, insumos de bilheteria e especificações de SKUs.',
    badge: '4.280 un',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'est-warehouses',
    label: 'Almoxarifados & Localizações',
    group: 'Armazenagem & Almoxarifado',
    icon: Building2,
    purpose: 'Gestão dos centros de distribuição física: Sede Curitiba, teatros e quiosques.',
  },
  {
    id: 'est-kardex',
    label: 'Movimentações Kardex',
    group: 'Armazenagem & Almoxarifado',
    icon: ArrowRightLeft,
    purpose: 'Extrato detalhado de entradas por compras, saídas para eventos e saldos.',
    badge: 'Kardex',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'est-inventory',
    label: 'Inventário Físico & Ajustes',
    group: 'Armazenagem & Almoxarifado',
    icon: ClipboardCheck,
    purpose: 'Contagens cíclicas, balanços de estoque e lançamentos de quebras/ajustes.',
  },
  {
    id: 'est-requisicoes',
    label: 'Requisições de Consumo',
    group: 'Armazenagem & Almoxarifado',
    icon: FileText,
    purpose: 'Solicitações internas de materiais pelas equipes de evento e escritórios.',
  },
  {
    id: 'est-ponto-pedido',
    label: 'Ponto de Pedido & Reposição',
    group: 'Armazenagem & Almoxarifado',
    icon: AlertTriangle,
    purpose: 'Níveis críticos de estoque mínimo com disparo automático de compras.',
    badge: '1 Alerta',
    badgeColor: 'bg-rose-100 text-rose-800',
  },

  // 3. Fornecedores e Cotações (5)
  {
    id: 'comp-fornecedores',
    label: 'Cadastro de Fornecedores',
    group: 'Fornecedores e Cotações',
    icon: Building2,
    purpose: 'Registro de parceiros comerciais corporativos, dados fiscais, bancários e contatos.',
  },
  {
    id: 'comp-homologacao',
    label: 'Homologação de Fornecedores',
    group: 'Fornecedores e Cotações',
    icon: ShieldCheck,
    purpose: 'Validação de compliance, CNDs, regularidade fiscal e capacidade de fornecimento.',
    badge: 'Compliance',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'comp-rfq',
    label: 'Solicitação de Cotação (RFQ)',
    group: 'Fornecedores e Cotações',
    icon: Sparkles,
    purpose: 'Disparo de concorrências comerciais com envio de RFQ para múltiplos fornecedores.',
  },
  {
    id: 'comp-mapa-comparativo',
    label: 'Mapa Comparativo',
    group: 'Fornecedores e Cotações',
    icon: Sliders,
    purpose: 'Comparativo lado a lado de propostas com análise de custo, frete e prazos.',
    badge: 'RFQ Ativa',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'comp-negociacao',
    label: 'Negociação Comercial',
    group: 'Fornecedores e Cotações',
    icon: TrendingDown,
    purpose: 'Registro de rodadas de negociação e cálculo de economia obtida (Saving).',
  },

  // 3. Pedidos e Contratações (5)
  {
    id: 'comp-pedidos',
    label: 'Pedidos de Compra',
    group: 'Pedidos e Contratações',
    icon: PackageCheck,
    purpose: 'Emissão, envio eletrônico e rastreamento de ordens de compra autorizadas.',
    badge: '18 Ativos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'comp-contratos',
    label: 'Contratos de Fornecimento',
    group: 'Pedidos e Contratações',
    icon: FileCheck,
    purpose: 'Gestão de contratos com prazos, reajustes pelo IPCA/IGP-M e renovações.',
  },
  {
    id: 'comp-recorrentes',
    label: 'Compras Recorrentes',
    group: 'Pedidos e Contratações',
    icon: RefreshCw,
    purpose: 'Automação de pedidos mensais contínuos (suprimentos, links dedicados e serviços).',
  },
  {
    id: 'comp-servicos',
    label: 'Aquisição de Serviços',
    group: 'Pedidos e Contratações',
    icon: Users,
    purpose: 'Contratação de terceirizados, consultorias contábeis, jurídicas e prediais.',
  },
  {
    id: 'comp-aprovacoes',
    label: 'Aprovações de Compras',
    group: 'Pedidos e Contratações',
    icon: Award,
    purpose: 'Alçadas de aprovação por centro de custo, valor financeiro e diretoria.',
    badge: 'Alçadas',
    badgeColor: 'bg-purple-100 text-purple-800',
  },

  // 5. Recebimento e Almoxarifado (4)
  {
    id: 'comp-recebimento',
    label: 'Recebimento de Materiais',
    group: 'Recebimento e Almoxarifado',
    icon: Truck,
    purpose: 'Conferência física no almoxarifado corporativo e conferência cega de mercadorias.',
  },
  {
    id: 'comp-aceite-servicos',
    label: 'Aceite de Serviços',
    group: 'Recebimento e Almoxarifado',
    icon: ClipboardCheck,
    purpose: 'Medição e aprovação formal de entregáveis antes da liberação do pagamento.',
  },
  {
    id: 'comp-devolucoes',
    label: 'Devoluções e Trocas',
    group: 'Recebimento e Almoxarifado',
    icon: RotateCcw,
    purpose: 'Gestão de RMA, envio de itens com defeito e emissão de notas de estorno.',
  },
  {
    id: 'comp-documentos',
    label: 'Documentos de Compra',
    group: 'Recebimento e Almoxarifado',
    icon: Receipt,
    purpose: 'Arquivo eletrônico de minutas, catálogos, propostas técnicas e recibos.',
  },

  // 5. Gestão Financeira (4)
  {
    id: 'comp-orcamento',
    label: 'Orçamento de Compras',
    group: 'Gestão Financeira',
    icon: DollarSign,
    purpose: 'Acompanhamento do teto orçamentário anual e controle de despesas CapEx e OpEx.',
  },
  {
    id: 'comp-centros-custos',
    label: 'Centros de Custos',
    group: 'Gestão Financeira',
    icon: Layers,
    purpose: 'Apropriação e rateio das aquisições pelas diretorias corporativas da Disk.',
  },
  {
    id: 'comp-contas-pagar',
    label: 'Integração Contas a Pagar',
    group: 'Gestão Financeira',
    icon: TrendingUp,
    purpose: 'Geração automática de títulos na Tesouraria após aceite ou entrada de NF.',
    badge: 'Tesouraria',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'comp-impostos',
    label: 'Impostos nas Aquisições',
    group: 'Gestão Financeira',
    icon: Percent,
    purpose: 'Tratamento de DIFAL, ICMS-ST e retenções de tributos (IR, CSRF, ISS) na fonte.',
  },

  // 6. Patrimônio e Tecnologia (3)
  {
    id: 'comp-ativos',
    label: 'Aquisição de Ativos',
    group: 'Patrimônio e Tecnologia',
    icon: Laptop,
    purpose: 'Incorporação de novos bens ao ativo imobilizado (notebooks, servidores, móveis).',
  },
  {
    id: 'comp-licencas',
    label: 'Licenças e Assinaturas',
    group: 'Patrimônio e Tecnologia',
    icon: Tag,
    purpose: 'Gestão de assentos e subscrições de softwares corporativos (AWS, Datadog, Slack).',
  },
  {
    id: 'comp-garantias',
    label: 'Garantias e Manutenção',
    group: 'Patrimônio e Tecnologia',
    icon: ShieldCheck,
    purpose: 'Prazos de cobertura de garantia de fábrica e contratos de suporte 24/7.',
  },

  // 7. Controle e Governança (4)
  {
    id: 'comp-relatorios',
    label: 'Relatórios de Compras',
    group: 'Controle e Governança',
    icon: FileText,
    purpose: 'Demonstrativos de saving acumulado, lead time de compras e Pareto por fornecedor.',
  },
  {
    id: 'comp-avaliacao',
    label: 'Avaliação de Fornecedores',
    group: 'Controle e Governança',
    icon: Award,
    purpose: 'Índice de Qualificação de Fornecedores (IQF) por pontualidade e conformidade.',
  },
  {
    id: 'comp-auditoria',
    label: 'Auditoria e Histórico',
    group: 'Controle e Governança',
    icon: ShieldCheck,
    purpose: 'Trilha de auditoria com rastreabilidade completa desde a requisição até o pagamento.',
  },
  {
    id: 'comp-configuracoes',
    label: 'Configurações de Compras',
    group: 'Controle e Governança',
    icon: Sliders,
    purpose: 'Parâmetros de alçadas de aprovação, prazos padrão e matriz de responsabilidades.',
  },
];

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function ComprasModuleView({
  activeSection = 'comp-dashboard',
  onSelectSection,
}: Props) {
  const [sectionId, setSectionId] = useState<string>(activeSection || 'comp-dashboard');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configuração da Barra Lateral (Proporcional à página, posicionada à direita por padrão, visual claro)
  const [sidebarSide, setSidebarSide] = useState<'right' | 'left'>('right');
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light');

  // Estado dos Dados
  const [dashboardData, setDashboardData] = useState<ComprasDashboardResponse | null>(null);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [kardex, setKardex] = useState<KardexMovement[]>([]);

  // Filtros de Solicitações
  const [requestSearch, setRequestSearch] = useState('');
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');

  // Filtros de Estoque
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all');
  const [stockWarehouseFilter, setStockWarehouseFilter] = useState('all');

  // Modais Interativos
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedRequestForApproval, setSelectedRequestForApproval] = useState<PurchaseRequest | null>(null);

  // Formulário Nova Solicitação
  const [newItemName, setNewItemName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Tecnologia & Cloud');
  const [newRequester, setNewRequester] = useState('');
  const [newCostCenter, setNewCostCenter] = useState('CC-101 - TI & Infraestrutura Cloud');
  const [newEstimatedValue, setNewEstimatedValue] = useState<number>(5000);
  const [newUrgency, setNewUrgency] = useState<'ALTA' | 'MEDIA' | 'BAIXA'>('MEDIA');
  const [newJustification, setNewJustification] = useState('');

  // Formulário Novo Pedido
  const [newOrderSupplier, setNewOrderSupplier] = useState('');
  const [newOrderCnpj, setNewOrderCnpj] = useState('');
  const [newOrderDesc, setNewOrderDesc] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState<number>(10000);
  const [newOrderPaymentTerms, setNewOrderPaymentTerms] = useState('30 dias via Boleto');
  const [newOrderDeliveryDate, setNewOrderDeliveryDate] = useState('2026-10-30');
  const [newOrderCostCenter, setNewOrderCostCenter] = useState('CC-101 - TI & Infraestrutura Cloud');

  // Sincronização de seção ativa
  useEffect(() => {
    if (activeSection && activeSection !== sectionId) {
      setSectionId(activeSection);
    }
  }, [activeSection]);

  const handleSelectSection = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Disparo automático de compra para reposição de estoque
  const handleTriggerReorder = (item: StockItem) => {
    const qtyToOrder = Math.max(item.minQuantity * 2, 5);
    setNewItemName(`Reposição: ${item.name} (${qtyToOrder} ${item.unit})`);
    setNewDepartment('Operações & Suprimentos');
    setNewRequester('Almoxarifado Central (Alerta de Estoque Mínimo)');
    setNewCostCenter('CC-201 - Operações PDV');
    setNewEstimatedValue(Number((item.unitCost * qtyToOrder).toFixed(2)));
    setNewUrgency('ALTA');
    setNewJustification(
      `Item ${item.sku} atingiu nível crítico: saldo atual de ${item.currentQuantity} ${item.unit}, abaixo do mínimo de ${item.minQuantity} ${item.unit}.`
    );
    setIsNewRequestModalOpen(true);
  };

  // Carregar dados da API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, reqs, ords, sups, stks, whs, kdx] = await Promise.all([
        comprasClient.getDashboard(),
        comprasClient.getRequests(),
        comprasClient.getOrders(),
        comprasClient.getSuppliers(),
        comprasClient.getStockItems(),
        comprasClient.getWarehouses(),
        comprasClient.getKardexMovements(),
      ]);
      setDashboardData(dash);
      setRequests(reqs);
      setOrders(ords);
      setSuppliers(sups);
      setStockItems(stks);
      setWarehouses(whs);
      setKardex(kdx);
    } catch {
      showNotification('Erro ao carregar dados de compras e estoque do servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Criar nova solicitação
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newRequester || !newEstimatedValue) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const created = await comprasClient.createRequest({
        item: newItemName,
        department: newDepartment,
        requester: newRequester,
        costCenter: newCostCenter,
        estimatedValue: Number(newEstimatedValue),
        urgency: newUrgency,
        justification: newJustification,
      });
      setRequests([created, ...requests]);
      setIsNewRequestModalOpen(false);
      setNewItemName('');
      setNewRequester('');
      setNewJustification('');
      showNotification(`Solicitação ${created.code} cadastrada com sucesso!`);
    } catch {
      alert('Falha ao cadastrar solicitação.');
    }
  };

  // Aprovar solicitação
  const handleApproveAction = async (id: string, approved: boolean) => {
    try {
      const res = await comprasClient.approveRequest(id, approved);
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, status: res.request.status } : r))
      );
      setIsApproveModalOpen(false);
      setSelectedRequestForApproval(null);
      showNotification(
        `Solicitação ${res.request.code} ${approved ? 'APROVADA e autorizada para pedido!' : 'REJEITADA.'}`
      );
    } catch {
      alert('Falha ao processar status da solicitação.');
    }
  };

  // Criar novo pedido
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderSupplier || !newOrderAmount) {
      alert('Por favor, preencha o fornecedor e valor total.');
      return;
    }
    try {
      const created = await comprasClient.createOrder({
        supplierName: newOrderSupplier,
        supplierCnpj: newOrderCnpj || '00.000.000/0001-00',
        description: newOrderDesc || 'Aquisição Corporativa Disk',
        totalAmount: Number(newOrderAmount),
        costCenter: newOrderCostCenter,
        paymentTerms: newOrderPaymentTerms,
        deliveryDate: newOrderDeliveryDate,
      });
      setOrders([created, ...orders]);
      setIsNewOrderModalOpen(false);
      setNewOrderSupplier('');
      setNewOrderDesc('');
      showNotification(`Pedido de compra ${created.orderNumber} emitido com sucesso!`);
    } catch {
      alert('Falha ao emitir pedido de compra.');
    }
  };

  // Agrupamento dos 28 submenus
  const groupedSubmenus = useMemo(() => {
    const groups: Record<string, ComprasSubmenuDef[]> = {};
    COMPRAS_SUBMENUS.forEach((sm) => {
      const match =
        sm.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        sm.purpose.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
        sm.group.toLowerCase().includes(sidebarSearch.toLowerCase());
      if (match) {
        if (!groups[sm.group]) groups[sm.group] = [];
        groups[sm.group].push(sm);
      }
    });
    return groups;
  }, [sidebarSearch]);

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Solicitações filtradas
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.code.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.item.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.requester.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.department.toLowerCase().includes(requestSearch.toLowerCase());
      const matchUrgency = requestUrgencyFilter === 'all' || r.urgency === requestUrgencyFilter;
      const matchStatus = requestStatusFilter === 'all' || r.status === requestStatusFilter;
      return matchSearch && matchUrgency && matchStatus;
    });
  }, [requests, requestSearch, requestUrgencyFilter, requestStatusFilter]);

  const currentSubmenu = COMPRAS_SUBMENUS.find((s) => s.id === sectionId) || COMPRAS_SUBMENUS[0];

  // ==========================================
  // COMPONENTE: BARRA LATERAL PROPORCIONAL
  // ==========================================
  const renderSidebar = () => {
    const isLight = sidebarTheme === 'light';
    return (
      <aside
        className={`w-full lg:w-80 shrink-0 transition-all duration-300 self-start sticky top-4 min-h-[820px] max-h-[calc(100vh-140px)] flex flex-col rounded-2xl shadow-sm border ${
          isLight
            ? 'bg-white border-slate-200/90 text-slate-800'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl'
        }`}
      >
        {/* Cabeçalho da Barra Lateral */}
        <div
          className={`p-4 border-b flex flex-col gap-2.5 ${
            isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800/80 bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                  Disk Empresa · 28 Submenus
                </span>
                <h3 className="text-sm font-bold tracking-tight">Módulo Compras</h3>
              </div>
            </div>

            {/* Controles de Lado e Tema */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSidebarSide(sidebarSide === 'right' ? 'left' : 'right')}
                title={`Mover para ${sidebarSide === 'right' ? 'Esquerda' : 'Direita'}`}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isLight
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {sidebarSide === 'right' ? (
                  <PanelLeft className="w-3.5 h-3.5" />
                ) : (
                  <PanelRight className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSidebarTheme(isLight ? 'dark' : 'light')}
                title={`Alternar para tema ${isLight ? 'Escuro' : 'Claro'}`}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  isLight
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                    : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar entre os 28 submenus..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border-slate-200 focus:border-blue-500 text-slate-800 placeholder-slate-400'
                  : 'bg-slate-800/90 border-slate-700 focus:border-blue-400 text-slate-100 placeholder-slate-500'
              }`}
            />
            {sidebarSearch && (
              <button
                onClick={() => setSidebarSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Lista com Rolagem dos Submenus */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs custom-scrollbar">
          {Object.entries(groupedSubmenus).map(([groupName, items]) => {
            const isCollapsed = collapsedGroups[groupName];
            return (
              <div key={groupName} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(groupName)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-bold text-[11px] tracking-wide uppercase transition-colors ${
                    isLight
                      ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {groupName}
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {items.length}
                    </span>
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1">
                    {items.map((item) => {
                      const isActive = sectionId === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSection(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left font-medium transition-all group ${
                            isActive
                              ? isLight
                                ? 'bg-blue-50/90 text-blue-700 font-bold shadow-2xs border border-blue-200/80'
                                : 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/40'
                              : isLight
                              ? 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive
                                  ? isLight
                                    ? 'text-blue-600'
                                    : 'text-blue-400'
                                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${
                                item.badgeColor || 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé da Barra Lateral */}
        <div
          className={`p-3 border-t text-[11px] flex items-center justify-between ${
            isLight
              ? 'border-slate-100 bg-slate-50/60 text-slate-500'
              : 'border-slate-800/80 bg-slate-950/40 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Compras Corporativas Online</span>
          </div>
          <button
            onClick={() => {
              setCollapsedGroups({});
              setSidebarSearch('');
            }}
            className="text-[10px] font-semibold text-blue-600 hover:underline"
          >
            Expandir todos
          </button>
        </div>
      </aside>
    );
  };

  // ==========================================
  // CONTEÚDO PRINCIPAL DAS TELAS
  // ==========================================
  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER CORPORATIVO DO MÓDULO COMPRAS — LETRAS ESCURAS E ALTO CONTRASTE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Módulo Compras & Estoque — Suprimentos, Aquisições & Almoxarifado
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Disk Empresa · Compras + Estoque Unificados
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                  DiskIngressos S.A.
                </span>
              </div>
              <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                Central unificada de requisições internas, cotações (RFQ), pedidos de compra, almoxarifados, movimentações Kardex e níveis de estoque corporativo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
              <span>Competência: <strong>Outubro / 2026</strong></span>
            </div>

            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Solicitação</span>
            </button>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Novo Pedido</span>
            </button>

            <button
              onClick={loadData}
              title="Atualizar dados de compras"
              className="h-9 w-9 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* ALERTA DE SEGREGAÇÃO CORPORATIVA EM CORES ESCURAS SOBRE FUNDO SUAVE */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-amber-950">
            <div className="font-bold flex items-center gap-2 text-amber-950">
              <span>Segregação Patrimonial Obrigatória — Disk Empresa vs. Eventos</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-200/70 text-amber-900 border border-amber-300">
                100% Corporativo
              </span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
              Este módulo gerencia exclusivamente aquisições da administração corporativa (hardware, cloud, SaaS, facilities e consultorias). Sob hipótese alguma despesas de produtores ou eventos transitam aqui; tais valores pertencem à custódia fiduciária de <strong>Financeiro de Eventos</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* KPI METERS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Solicitações Abertas</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {dashboardData?.kpis.openRequestsCount ?? 12}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
            5 aguardando aprovação técnica
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Pedidos em Andamento</span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {dashboardData?.kpis.activeOrdersCount ?? 18}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            R$ 307.000,00 comprometidos
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Fornecedores Ativos</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {dashboardData?.kpis.activeSuppliersCount ?? 42}
          </div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">
            100% CND & compliance regular
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Economia em RFQ (Saving)</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              dashboardData?.kpis.monthlySavings ?? 38400
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
            14.2% médio em negociações
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">Orçamento Disk Consumido</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">
            {((432500 / 650000) * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
            R$ 432.500 de R$ 650.000 (Out/26)
          </div>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL: SUBMENU ATIVO + BARRA LATERAL PROPORCIONAL */}
      <div className={`flex flex-col lg:flex-row gap-5 ${sidebarSide === 'left' ? 'lg:flex-row-reverse' : ''}`}>
        {/* ÁREA DE CONTEÚDO PRINCIPAL (ESQUERDA OU DIREITA CONFORME TOGGLE) */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Breadcrumb da Seção Ativa */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Compras Corporativas</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-500 font-medium">{currentSubmenu.group}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-blue-700 font-bold">{currentSubmenu.label}</span>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">
              {currentSubmenu.purpose}
            </div>
          </div>

          {/* ============================================================== */}
          {/* TELAS: RENDERIZAÇÃO CONDICIONAL POR SECTION ID                 */}
          {/* ============================================================== */}

          {/* 1. DASHBOARD DE COMPRAS (comp-dashboard) */}
          {sectionId === 'comp-dashboard' && (
            <div className="space-y-5">
              {/* ORÇAMENTO POR DEPARTAMENTO */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Execução Orçamentária por Diretoria & Centro de Custo
                    </h3>
                    <p className="text-xs text-slate-500">
                      CapEx e OpEx alocados para a operação empresarial da DiskIngressos
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectSection('comp-orcamento')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Ver detalhes completos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(dashboardData?.budgetByDepartment ?? []).map((dep, idx) => {
                    const pct = Math.min(100, Math.round((dep.spent / dep.budget) * 100));
                    return (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">{dep.department}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{dep.costCenter}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 block">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                dep.spent
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dep.budget)} ({pct}%)
                            </span>
                          </div>
                        </div>

                        {/* Barra de Progresso */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct > 90 ? 'bg-rose-500' : pct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>Comprometido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dep.committed)}</span>
                          <span className="font-semibold text-emerald-600">
                            Disponível: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dep.available)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ÚLTIMAS SOLICITAÇÕES DE COMPRA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Solicitações Recentes de Compras Corporativas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Demandas internas abertas pelas áreas de tecnologia, facilities e bilheteria
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectSection('comp-solicitacoes')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Central de Solicitações <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                      <tr>
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Item / Descrição</th>
                        <th className="py-2.5 px-3">Área Solicitante</th>
                        <th className="py-2.5 px-3">Valor Estimado</th>
                        <th className="py-2.5 px-3">Urgência</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{req.code}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 block">{req.item}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{req.costCenter}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            <span className="block font-medium">{req.department}</span>
                            <span className="text-[10px] text-slate-400">{req.requester}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              req.estimatedValue
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.urgency === 'ALTA'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : req.urgency === 'MEDIA'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === 'AGUARDANDO_APROVACAO'
                                  ? 'bg-amber-100 text-amber-800'
                                  : req.status === 'EM_COTACAO'
                                  ? 'bg-blue-100 text-blue-800'
                                  : req.status === 'PEDIDO_EMITIDO'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'CONCLUIDO'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {req.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {req.status === 'AGUARDANDO_APROVACAO' ? (
                              <button
                                onClick={() => {
                                  setSelectedRequestForApproval(req);
                                  setIsApproveModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                              >
                                Avaliar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSelectSection('comp-solicitacoes')}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PEDIDOS DE COMPRA ATIVOS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Ordens de Compra Emitidas (Em Execução ou Trânsito)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pedidos homologados com fornecedores corporativos e prazos de entrega
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectSection('comp-pedidos')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Ver todos os pedidos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                      <tr>
                        <th className="py-2.5 px-3">Nº Pedido</th>
                        <th className="py-2.5 px-3">Fornecedor</th>
                        <th className="py-2.5 px-3">Objeto da Aquisição</th>
                        <th className="py-2.5 px-3">Valor Total</th>
                        <th className="py-2.5 px-3">Condição</th>
                        <th className="py-2.5 px-3">Previsão Entrega</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 block">
                              {ord.supplierName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              CNPJ: {ord.supplierCnpj}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{ord.description}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              ord.totalAmount
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {ord.paymentTerms}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {ord.deliveryDate}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'APROVADO'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'EM_TRANSITO'
                                  ? 'bg-amber-100 text-amber-800'
                                  : ord.status === 'RECEBIDO'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ord.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. CENTRAL DE SOLICITAÇÕES (comp-solicitacoes) */}
          {sectionId === 'comp-solicitacoes' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Central de Solicitações Internas de Compras
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controle de demandas internas de TI, suprimentos e serviços corporativos
                  </p>
                </div>
                <button
                  onClick={() => setIsNewRequestModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Solicitação
                </button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por código, item ou solicitante..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={requestUrgencyFilter}
                    onChange={(e) => setRequestUrgencyFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="all">Todas as Urgências</option>
                    <option value="ALTA">Alta Urgência</option>
                    <option value="MEDIA">Média Urgência</option>
                    <option value="BAIXA">Baixa Urgência</option>
                  </select>
                </div>
                <div>
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => setRequestStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="EM_COTACAO">Em Cotação</option>
                    <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
                    <option value="PEDIDO_EMITIDO">Pedido Emitido</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="REJEITADO">Rejeitado</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Solicitações */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Item / Objeto</th>
                      <th className="py-2.5 px-3">Departamento</th>
                      <th className="py-2.5 px-3">Solicitante</th>
                      <th className="py-2.5 px-3">Valor Estimado</th>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Urgência</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{req.code}</td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 block">{req.item}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{req.costCenter}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{req.department}</td>
                        <td className="py-3 px-3 text-slate-600">{req.requester}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            req.estimatedValue
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{req.date}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.urgency === 'ALTA'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : req.urgency === 'MEDIA'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {req.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'AGUARDANDO_APROVACAO'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'EM_COTACAO'
                                ? 'bg-blue-100 text-blue-800'
                                : req.status === 'PEDIDO_EMITIDO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'CONCLUIDO'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {req.status === 'AGUARDANDO_APROVACAO' && (
                            <button
                              onClick={() => {
                                setSelectedRequestForApproval(req);
                                setIsApproveModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                            >
                              Avaliar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. CADASTRO DE FORNECEDORES (comp-fornecedores & comp-homologacao) */}
          {(sectionId === 'comp-fornecedores' || sectionId === 'comp-homologacao') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Fornecedores Corporativos Homologados da Disk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Parceiros comerciais avaliados em compliance, regularidade fiscal e entrega
                  </p>
                </div>
                <button
                  onClick={() => alert('Abrir modal de cadastro de novo fornecedor corporativo')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Homologar Novo Fornecedor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((sup) => (
                  <div
                    key={sup.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                          {sup.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{sup.tradeName}</h4>
                        <span className="text-xs text-slate-500 block">{sup.name}</span>
                        <span className="text-[11px] font-mono text-slate-400 block">CNPJ: {sup.cnpj}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {sup.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{sup.rating.toFixed(1)} / 5.0 (IQF)</span>
                      </div>
                      <div className="space-x-2 text-[11px]">
                        <span>{sup.phone}</span>
                        <span>·</span>
                        <span className="text-blue-600">{sup.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MAPA COMPARATIVO & RFQ (comp-mapa-comparativo & comp-rfq & comp-negociacao) */}
          {(sectionId === 'comp-mapa-comparativo' || sectionId === 'comp-rfq' || sectionId === 'comp-negociacao') && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                      RFQ-2026-0042
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Mapa Comparativo de Cotações: 10x Notebooks Dell Latitude i7
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Centro de Custo: CC-101 TI · Concorrência comercial entre 3 distribuidores homologados
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showNotification('Pedido de compra gerado com a Dell Technologies (Saving: R$ 9.800,00)');
                      handleSelectSection('comp-pedidos');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Adjudicar Vencedor Recomendado
                  </button>
                </div>
              </div>

              {/* Matriz Comparativa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fornecedor 1 (Vencedor) */}
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/20 relative space-y-3">
                  <div className="absolute -top-3 right-3 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs">
                    Melhor Custo-Benefício
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Dell Technologies Brasil</span>
                    <span className="text-[10px] text-slate-500">Fabricante Direto</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700">
                    R$ 75.000,00
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-emerald-200/60">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prazo Entrega:</span>
                      <strong className="text-slate-800">12 dias úteis</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Garantia:</span>
                      <strong className="text-slate-800">36 meses ProSupport</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Condição:</span>
                      <strong className="text-slate-800">28 / 56 dias Boleto</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saving Obtido:</span>
                      <strong className="text-emerald-700">R$ 9.800,00 (-11.5%)</strong>
                    </div>
                  </div>
                </div>

                {/* Fornecedor 2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Lenovo Enterprise Corp</span>
                    <span className="text-[10px] text-slate-500">Distribuidor Autorizado</span>
                  </div>
                  <div className="text-2xl font-black text-slate-700">
                    R$ 82.500,00
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prazo Entrega:</span>
                      <strong className="text-slate-800">20 dias úteis</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Garantia:</span>
                      <strong className="text-slate-800">24 meses On-site</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Condição:</span>
                      <strong className="text-slate-800">30 dias Boleto</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saving Obtido:</span>
                      <strong className="text-slate-600">R$ 2.300,00 (-2.7%)</strong>
                    </div>
                  </div>
                </div>

                {/* Fornecedor 3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">HP Enterprise Latam</span>
                    <span className="text-[10px] text-slate-500">Distribuidor Tier 1</span>
                  </div>
                  <div className="text-2xl font-black text-slate-700">
                    R$ 84.800,00
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prazo Entrega:</span>
                      <strong className="text-slate-800">15 dias úteis</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Garantia:</span>
                      <strong className="text-slate-800">36 meses Balcão</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Condição:</span>
                      <strong className="text-slate-800">15 / 30 dias</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Saving Obtido:</span>
                      <strong className="text-slate-500">R$ 0,00 (Preço Base)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PEDIDOS DE COMPRA (comp-pedidos) */}
          {sectionId === 'comp-pedidos' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Ordens e Pedidos de Compra Emitidos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gestão dos pedidos corporativos oficiais autorizados pela diretoria Disk
                  </p>
                </div>
                <button
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Emitir Novo Pedido
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Nº Pedido</th>
                      <th className="py-2.5 px-3">Fornecedor</th>
                      <th className="py-2.5 px-3">Objeto</th>
                      <th className="py-2.5 px-3">Valor Total</th>
                      <th className="py-2.5 px-3">Condição</th>
                      <th className="py-2.5 px-3">Emissão</th>
                      <th className="py-2.5 px-3">Entrega</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-800 block">
                            {ord.supplierName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ord.supplierCnpj}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{ord.description}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            ord.totalAmount
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{ord.paymentTerms}</td>
                        <td className="py-3 px-3 text-slate-500 font-mono">{ord.issueDate}</td>
                        <td className="py-3 px-3 font-medium text-slate-700 font-mono">
                          {ord.deliveryDate}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'APROVADO'
                                ? 'bg-blue-100 text-blue-800'
                                : ord.status === 'EM_TRANSITO'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'RECEBIDO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. CATÁLOGO DE PRODUTOS & SKUS (est-products) */}
          {sectionId === 'est-products' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Catálogo de Produtos, Materiais & SKUs em Estoque
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controle físico e financeiro de insumos de bilheteria, hardware PDV e suprimentos corporativos
                  </p>
                </div>
                <button
                  onClick={() => alert('Abrir modal de cadastro de novo SKU')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Produto / SKU
                </button>
              </div>

              {/* Filtros de Estoque */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por SKU ou descrição..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={stockCategoryFilter}
                    onChange={(e) => setStockCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="all">Todas as Categorias</option>
                    <option value="Insumos Bilheteria">Insumos Bilheteria</option>
                    <option value="Controle de Acesso">Controle de Acesso</option>
                    <option value="Suprimentos TI">Suprimentos TI</option>
                    <option value="Identificação & Acesso">Identificação & Acesso</option>
                    <option value="Hardware PDV">Hardware PDV</option>
                  </select>
                </div>
                <div>
                  <select
                    value={stockWarehouseFilter}
                    onChange={(e) => setStockWarehouseFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="all">Todos os Almoxarifados</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabela de SKUs */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Código SKU</th>
                      <th className="py-2.5 px-3">Material / Descrição</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3">Almoxarifado</th>
                      <th className="py-2.5 px-3 text-right">Saldo Atual</th>
                      <th className="py-2.5 px-3 text-right">Mínimo</th>
                      <th className="py-2.5 px-3 text-right">Custo Médio</th>
                      <th className="py-2.5 px-3 text-right">Valor Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockItems
                      .filter((stk) => {
                        const mSearch =
                          stk.sku.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          stk.name.toLowerCase().includes(stockSearch.toLowerCase());
                        const mCat = stockCategoryFilter === 'all' || stk.category === stockCategoryFilter;
                        const mWh = stockWarehouseFilter === 'all' || stk.warehouse.includes(stockWarehouseFilter);
                        return mSearch && mCat && mWh;
                      })
                      .map((stk) => (
                        <tr key={stk.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{stk.sku}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 block">{stk.name}</span>
                            <span className="text-[10px] text-slate-400">Unidade: {stk.unit}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{stk.category}</td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">{stk.warehouse}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                            {stk.currentQuantity.toLocaleString('pt-BR')} {stk.unit}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                            {stk.minQuantity.toLocaleString('pt-BR')} {stk.unit}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              stk.unitCost
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                              stk.totalValue
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                stk.status === 'CRITICO'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : stk.status === 'ATENCAO'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {stk.status === 'CRITICO' ? 'Reposição Urgente' : stk.status === 'ATENCAO' ? 'Atenção' : 'Regular'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {stk.status !== 'NORMAL' ? (
                              <button
                                onClick={() => handleTriggerReorder(stk)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-2xs whitespace-nowrap cursor-pointer flex items-center gap-1 ml-auto"
                              >
                                <span>⚡ Repor via Compra</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Em nível ideal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. ALMOXARIFADOS & LOCALIZAÇÕES (est-warehouses) */}
          {sectionId === 'est-warehouses' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Almoxarifados & Centros de Distribuição Disk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Locais físicos de armazenagem de bobinas, bilheteria, totens e equipamentos
                  </p>
                </div>
                <button
                  onClick={() => alert('Abrir modal de novo almoxarifado')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Almoxarifado
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouses.map((wh) => (
                  <div
                    key={wh.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-600 block">{wh.code}</span>
                          <h4 className="text-sm font-bold text-slate-900">{wh.name}</h4>
                          <span className="text-xs text-slate-500">{wh.location}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Ativo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Responsável</span>
                        <strong className="text-slate-800">{wh.manager}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Valor em Custódia</span>
                        <strong className="text-blue-700">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            wh.totalValue
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MOVIMENTAÇÕES KARDEX (est-kardex) */}
          {sectionId === 'est-kardex' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Livro Kardex de Movimentações de Estoque
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rastreabilidade em tempo real de entradas de compras, requisições de consumo e transferências
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Competência: Outubro / 2026</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Código SKU</th>
                      <th className="py-2.5 px-3">Item / Material</th>
                      <th className="py-2.5 px-3">Tipo de Operação</th>
                      <th className="py-2.5 px-3 text-right">Qtd</th>
                      <th className="py-2.5 px-3">Documento de Origem</th>
                      <th className="py-2.5 px-3">Almoxarifado</th>
                      <th className="py-2.5 px-3">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kardex.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-500">{k.date}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{k.sku}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{k.itemName}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              k.type === 'ENTRADA_COMPRA'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : k.type === 'TRANSFERENCIA'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {k.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-bold font-mono ${
                            k.quantity > 0 ? 'text-emerald-700' : 'text-slate-800'
                          }`}
                        >
                          {k.quantity > 0 ? `+${k.quantity}` : k.quantity}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-blue-700 font-semibold">
                          {k.sourceDoc}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{k.warehouse}</td>
                        <td className="py-3 px-3 text-slate-500">{k.responsible}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. PONTO DE PEDIDO & REPOSIÇÃO (est-ponto-pedido) */}
          {sectionId === 'est-ponto-pedido' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                      Monitor de Reposição
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Alertas de Estoque Mínimo & Disparo de Compras
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Itens que atingiram o ponto crítico de ressuprimento — integração automática com Solicitações de Compra
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {stockItems
                  .filter((i) => i.status !== 'NORMAL')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{item.sku}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                            {item.status === 'CRITICO' ? 'Estoque Crítico' : 'Estoque de Atenção'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span>Local: <strong>{item.warehouse}</strong></span>
                          <span>Saldo Atual: <strong className="text-rose-700">{item.currentQuantity} {item.unit}</strong></span>
                          <span>Estoque Mínimo: <strong>{item.minQuantity} {item.unit}</strong></span>
                          <span>Custo Unitário: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitCost)}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => handleTriggerReorder(item)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Disparar Solicitação de Compra</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* DEMAIS SUBMENUS (FALLBACK COM VISUAL CORPORATIVO DEDICADO) */}
          {![
            'comp-dashboard',
            'comp-solicitacoes',
            'comp-fornecedores',
            'comp-homologacao',
            'comp-mapa-comparativo',
            'comp-rfq',
            'comp-negociacao',
            'comp-pedidos',
            'est-products',
            'est-warehouses',
            'est-kardex',
            'est-ponto-pedido',
          ].includes(sectionId) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="border-b pb-4 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <currentSubmenu.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {currentSubmenu.label}
                    </h3>
                    <p className="text-xs text-slate-500">{currentSubmenu.purpose}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Escopo Operacional
                  </span>
                  <p className="text-xs font-semibold text-slate-800">
                    Disk Ingressos Entretenimento S.A.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Rotina estritamente corporativa integrada ao Razão e Contas a Pagar.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Status do Fluxo
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Parâmetros e Alçadas Homologadas
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Conformidade com a política interna de compras e compliance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Ação Disponível
                  </span>
                  <button
                    onClick={() =>
                      showNotification(`Ação executada com sucesso para ${currentSubmenu.label}!`)
                    }
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Executar Rotina
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Info className="w-4 h-4 text-blue-600" />
                  Diretrizes de Governança de Compras Disk:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Todas as aquisições acima de R$ 10.000,00 exigem concorrência prévia com no mínimo 3 cotações.</li>
                  <li>Contratos recorrentes de SaaS e TI devem possuir justificativa técnica e avaliação de segurança.</li>
                  <li>Títulos a pagar são gerados automaticamente na Tesouraria após aceite técnico e espelho de NF.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* BARRA LATERAL PROPORCIONAL COM OS 28 SUBMENUS */}
        {renderSidebar()}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: NOVA SOLICITAÇÃO DE COMPRA                            */}
      {/* ============================================================== */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold">Nova Solicitação de Compra Corporativa</h3>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Item / Objeto Solicitado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5x Cadeiras Ergonômicas NR-17 Sede Curitiba"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Departamento *</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Tecnologia & Cloud">Tecnologia & Cloud</option>
                    <option value="Administrativo & Facilities">Administrativo & Facilities</option>
                    <option value="Controladoria & Finanças">Controladoria & Finanças</option>
                    <option value="Operações de Bilheteria">Operações de Bilheteria</option>
                    <option value="Comercial & Marketing">Comercial & Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Solicitante *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome / cargo"
                    value={newRequester}
                    onChange={(e) => setNewRequester(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Centro de Custo *</label>
                  <select
                    value={newCostCenter}
                    onChange={(e) => setNewCostCenter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white font-mono text-[11px]"
                  >
                    <option value="CC-101 - TI & Infraestrutura Cloud">CC-101 - TI & Infraestrutura Cloud</option>
                    <option value="CC-204 - Operações Prediais">CC-204 - Operações Prediais</option>
                    <option value="CC-302 - Controladoria Disk">CC-302 - Controladoria Disk</option>
                    <option value="CC-201 - Operações PDV">CC-201 - Operações PDV</option>
                    <option value="CC-301 - Comercial & MKT">CC-301 - Comercial & MKT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valor Estimado (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newEstimatedValue}
                    onChange={(e) => setNewEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Grau de Urgência</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="BAIXA">Baixa (Planejada)</option>
                    <option value="MEDIA">Média (Ordinária)</option>
                    <option value="ALTA">Alta (Crítica/Impacto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prazo Necessário</label>
                  <input
                    type="date"
                    defaultValue="2026-10-25"
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Justificativa de Aquisição Corporativa
                </label>
                <textarea
                  rows={2}
                  placeholder="Explique o impacto operacional e a necessidade desta despesa na Disk..."
                  value={newJustification}
                  onChange={(e) => setNewJustification(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Cadastrar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: NOVO PEDIDO DE COMPRA                                 */}
      {/* ============================================================== */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Emitir Pedido de Compra Oficial</h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Fornecedor Homologado *
                </label>
                <select
                  required
                  value={newOrderSupplier}
                  onChange={(e) => {
                    setNewOrderSupplier(e.target.value);
                    const found = suppliers.find((s) => s.name === e.target.value);
                    if (found) setNewOrderCnpj(found.cnpj);
                  }}
                  className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="">Selecione o Fornecedor...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.tradeName} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Objeto / Descrição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contrato Anual de Suporte Cloud Datadog & AWS"
                  value={newOrderDesc}
                  onChange={(e) => setNewOrderDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valor Total (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Condição de Pagamento</label>
                  <select
                    value={newOrderPaymentTerms}
                    onChange={(e) => setNewOrderPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="30 dias via Boleto">30 dias via Boleto</option>
                    <option value="28 / 56 dias via Boleto">28 / 56 dias via Boleto</option>
                    <option value="15 / 30 / 45 dias">15 / 30 / 45 dias</option>
                    <option value="Mensal Débito Automático">Mensal Débito Automático</option>
                    <option value="À Vista na Entrega">À Vista na Entrega</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prazo de Entrega</label>
                  <input
                    type="date"
                    value={newOrderDeliveryDate}
                    onChange={(e) => setNewOrderDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Centro de Custo</label>
                  <select
                    value={newOrderCostCenter}
                    onChange={(e) => setNewOrderCostCenter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:border-blue-500 focus:outline-none bg-white font-mono text-[11px]"
                  >
                    <option value="CC-101 - TI & Infraestrutura Cloud">CC-101 TI & Cloud</option>
                    <option value="CC-204 - Operações Prediais">CC-204 Facilities</option>
                    <option value="CC-302 - Controladoria Disk">CC-302 Controladoria</option>
                    <option value="CC-201 - Operações PDV">CC-201 Bilheterias</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Emitir Ordem de Compra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: APROVAÇÃO DE SOLICITAÇÃO                              */}
      {/* ============================================================== */}
      {isApproveModalOpen && selectedRequestForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold">Alçada de Aprovação de Compras</h3>
              </div>
              <button
                onClick={() => {
                  setIsApproveModalOpen(false);
                  setSelectedRequestForApproval(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Código:</span>
                  <strong className="font-mono">{selectedRequestForApproval.code}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <strong className="text-slate-900 text-right">{selectedRequestForApproval.item}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Área:</span>
                  <span>{selectedRequestForApproval.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solicitante:</span>
                  <span>{selectedRequestForApproval.requester}</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-bold">Valor Estimado:</span>
                  <strong className="text-blue-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      selectedRequestForApproval.estimatedValue
                    )}
                  </strong>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Ao aprovar esta requisição, o departamento de compras estará autorizado a homologar cotações
                e emitir o respectivo pedido oficial de compra.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleApproveAction(selectedRequestForApproval.id, false)}
                  className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold transition-colors"
                >
                  Rejeitar Solicitação
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveAction(selectedRequestForApproval.id, true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Aprovar Requisição
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
