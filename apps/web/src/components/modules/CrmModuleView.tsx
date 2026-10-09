import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sliders,
  FileText,
  Star,
  ShieldCheck,
  Calendar,
  MapPin,
  Percent,
  Headphones,
  Award,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Eye,
  CreditCard,
  Building2,
  Layers,
  Sparkles,
  X,
  Check,
  Lock,
} from 'lucide-react';
import {
  crmClient,
  Producer,
  OpportunityDeal,
  CrmDashboardMetrics,
  ProducerCategory,
  DealStage,
} from '../../services/crmClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface CrmSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const CRM_SUBMENUS: CrmSubmenuDef[] = [
  // 1. Visão Geral & Funil Comercial (4)
  {
    id: 'crm-dashboard',
    label: 'Dashboard Comercial de Produtores',
    group: 'Visão Geral & Funil Comercial',
    icon: TrendingUp,
    purpose: 'Indicadores de captação, novos shows e GMV projetado para a bilheteria.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'crm-pipeline',
    label: 'Central de Deals & Pipeline',
    group: 'Visão Geral & Funil Comercial',
    icon: Target,
    purpose: 'Kanban dinâmico de negociações de espetáculos, shows e turnês.',
    badge: '19 Deals',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'crm-metas',
    label: 'Metas & Performance Comercial',
    group: 'Visão Geral & Funil Comercial',
    icon: Award,
    purpose: 'Desempenho dos executivos de contas e SDRs da equipe de captação Disk.',
  },
  {
    id: 'crm-alertas',
    label: 'Alertas Comerciais & Renovações',
    group: 'Visão Geral & Funil Comercial',
    icon: AlertCircle,
    purpose: 'Contratos de exclusividade próximos do vencimento e prazos de concorrência.',
    badge: '3 Alertas',
    badgeColor: 'bg-amber-100 text-amber-800',
  },

  // 2. Cadastro & Gestão 360º de Produtores (5)
  {
    id: 'crm-produtores',
    label: 'Carteira Geral de Produtores',
    group: 'Cadastro & Gestão 360º de Produtores',
    icon: Users,
    purpose: 'Base consolidada de parceiros, CNPJs, histórico de GMV e classificação.',
    badge: '42 Produtores',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'crm-homologacao',
    label: 'Homologação & Compliance',
    group: 'Cadastro & Gestão 360º de Produtores',
    icon: ShieldCheck,
    purpose: 'Qualificação jurídica, certidões negativas de débito e due diligence de sócios.',
  },
  {
    id: 'crm-contatos',
    label: 'Contatos & Representantes',
    group: 'Cadastro & Gestão 360º de Produtores',
    icon: Briefcase,
    purpose: 'Mapeamento de sócios, diretores artísticos, produtores executivos e roadies.',
  },
  {
    id: 'crm-segmentacao',
    label: 'Segmentação & Categorias',
    group: 'Cadastro & Gestão 360º de Produtores',
    icon: Layers,
    purpose: 'Categorização: Shows Nacionais, Teatros, Festivais, Stand-Up e Corporativos.',
  },
  {
    id: 'crm-historico',
    label: 'Histórico de Relacionamento',
    group: 'Cadastro & Gestão 360º de Produtores',
    icon: Clock,
    purpose: 'Linha do tempo auditável de reuniões, visitas comerciais, atas e negociações.',
  },

  // 3. Negociação de Eventos & Propostas (5)
  {
    id: 'crm-funil-eventos',
    label: 'Funil de Vendas de Shows',
    group: 'Negociação de Eventos & Propostas',
    icon: Target,
    purpose: 'Etapas de prospecção e fechamento de novos espetáculos em Curitiba e Brasil.',
  },
  {
    id: 'crm-propostas',
    label: 'Gerador de Propostas Comerciais',
    group: 'Negociação de Eventos & Propostas',
    icon: FileText,
    purpose: 'Simulação automatizada de taxas Disk, limites de adiantamento e exclusividade.',
  },
  {
    id: 'crm-versoes-propostas',
    label: 'Histórico de Versões & Propostas',
    group: 'Negociação de Eventos & Propostas',
    icon: Sliders,
    purpose: 'Controle de revisões, contrapropostas e concessão de taxas comerciais.',
  },
  {
    id: 'crm-pracas-casas',
    label: 'Praças & Casas Homologadas',
    group: 'Negociação de Eventos & Propostas',
    icon: MapPin,
    purpose: 'Cadastro técnico de venues: Teatro Positivo, Guairão, Pedreira e Live Curitiba.',
  },
  {
    id: 'crm-leads',
    label: 'Captação de Novos Produtores (Leads)',
    group: 'Negociação de Eventos & Propostas',
    icon: Sparkles,
    purpose: 'Mapeamento ativo de produtoras concorrentes e novos eventos independentes.',
  },

  // 4. Condições Comerciais, Taxas & Acordos (4)
  {
    id: 'crm-tabelas-taxas',
    label: 'Tabelas de Taxa por Produtor',
    group: 'Condições Comerciais, Taxas & Acordos',
    icon: Percent,
    purpose: 'Taxa de conveniência Disk, MDR de cartão, taxas de débito e spread acordado.',
    badge: 'Acordos',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'crm-acordos-advance',
    label: 'Acordos de Antecipação & Advance',
    group: 'Condições Comerciais, Taxas & Acordos',
    icon: DollarSign,
    purpose: 'Condições contratuais para advance com garantia real da receita de bilheteria.',
  },
  {
    id: 'crm-exclusividade',
    label: 'Exclusividade & Bônus de Volume',
    group: 'Condições Comerciais, Taxas & Acordos',
    icon: Award,
    purpose: 'Cláusulas de exclusividade territorial e escalonamento de take-rate por volume anual.',
  },
  {
    id: 'crm-locacao-equipamentos',
    label: 'Locação & Comodato de Hardwares',
    group: 'Condições Comerciais, Taxas & Acordos',
    icon: Building2,
    purpose: 'Gestão de catracas eletrônicas, PDVs fixos e coletores PDA dedicados ao produtor.',
  },

  // 5. Atendimento & Suporte ao Produtor (4)
  {
    id: 'crm-chamados',
    label: 'Central de Chamados do Produtor',
    group: 'Atendimento & Suporte ao Produtor',
    icon: Headphones,
    purpose: 'Solicitações operacionais: abertura de lote extra, troca de assento e borderô.',
    badge: '0 Críticos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'crm-portal-produtor',
    label: 'Portal do Produtor (Acesso & Permissões)',
    group: 'Atendimento & Suporte ao Produtor',
    icon: Users,
    purpose: 'Gestão de logins para visualização em tempo real de vendas de ingressos.',
  },
  {
    id: 'crm-csat',
    label: 'Pesquisas de Satisfação & NPS',
    group: 'Atendimento & Suporte ao Produtor',
    icon: Star,
    purpose: 'Métricas de satisfação pós-evento com a entrega de bilheteria e suporte.',
    badge: '4.9 ⭐',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'crm-incidentes',
    label: 'Gestão de Ocorrências Comerciais',
    group: 'Atendimento & Suporte ao Produtor',
    icon: AlertCircle,
    purpose: 'Tratativa de reclamações de produtores e divergências com casas de show.',
  },

  // 6. Governança Comercial & Relatórios (4)
  {
    id: 'crm-relatorios-conversao',
    label: 'Relatórios de Conversão Comercial',
    group: 'Governança Comercial & Relatórios',
    icon: FileText,
    purpose: 'LTV de produtores, custo de aquisição (CAC) e margem média por show realizado.',
  },
  {
    id: 'crm-auditoria-comercial',
    label: 'Trilha de Auditoria Comercial',
    group: 'Governança Comercial & Relatórios',
    icon: ShieldCheck,
    purpose: 'Histórico auditável de descontos concedidos, alterações de taxa e comissões.',
  },
  {
    id: 'crm-alcadas',
    label: 'Matriz de Alçadas Comerciais',
    group: 'Governança Comercial & Relatórios',
    icon: Lock,
    purpose: 'Limites de desconto na taxa Disk e aprovações de advance pela Diretoria.',
  },
  {
    id: 'crm-config',
    label: 'Configurações do CRM',
    group: 'Governança Comercial & Relatórios',
    icon: Sliders,
    purpose: 'Etapas do funil, categorias artísticas e canais de prospecção comercial.',
  },
];

export const CrmModuleView: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const [metrics, setMetrics] = useState<CrmDashboardMetrics | null>(null);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'produtores' | 'pipeline' | 'taxas' | 'suporte'
  >('dashboard');

  // Submenu search state
  const [submenuSearch, setSubmenuSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');

  // Producer Filter
  const [producerSearch, setProducerSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  // Modals
  const [isProducerModalOpen, setIsProducerModalOpen] = useState(false);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form States
  const [newProducerForm, setNewProducerForm] = useState({
    name: '',
    tradeName: '',
    document: '',
    category: 'SHOWS_NACIONAIS' as ProducerCategory,
    email: '',
    phone: '',
    defaultDiskFeeRate: 12.5,
    defaultSpreadRate: 3.5,
    bankName: 'Banco Bradesco',
    agency: '',
    account: '',
    pixKey: '',
  });

  const [newDealForm, setNewDealForm] = useState({
    title: '',
    producerId: '',
    expectedGmv: 500000,
    feeRateProposed: 12.0,
    eventDate: '2026-12-20',
    venueName: 'Teatro Positivo',
    responsibleSdr: 'Carlos Eduardo Silveira',
    stage: 'PROSPECCAO' as DealStage,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashData, prodData, dealsData] = await Promise.all([
        crmClient.getDashboard(),
        crmClient.listProducers(),
        crmClient.listOpportunities(),
      ]);
      setMetrics(dashData);
      setProducers(prodData);
      setOpportunities(dealsData);
      if (prodData.length > 0 && !newDealForm.producerId) {
        setNewDealForm((prev) => ({ ...prev, producerId: prodData[0].id }));
      }
    } catch (err) {
      console.error('Erro ao carregar dados do CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle activeSection sync with tabs
  useEffect(() => {
    if (!activeSection) return;
    if (activeSection === 'crm-dashboard') setActiveTab('dashboard');
    else if (activeSection === 'crm-pipeline' || activeSection === 'crm-funil-eventos') setActiveTab('pipeline');
    else if (activeSection === 'crm-produtores' || activeSection === 'crm-homologacao' || activeSection === 'crm-contatos') setActiveTab('produtores');
    else if (activeSection === 'crm-tabelas-taxas' || activeSection === 'crm-acordos-advance' || activeSection === 'crm-exclusividade') setActiveTab('taxas');
    else if (activeSection === 'crm-chamados' || activeSection === 'crm-csat') setActiveTab('suporte');
  }, [activeSection]);

  // Submenus filtering
  const groups = useMemo(() => {
    const list = Array.from(new Set(CRM_SUBMENUS.map((s) => s.group)));
    return ['todos', ...list];
  }, []);

  const filteredSubmenus = useMemo(() => {
    return CRM_SUBMENUS.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.purpose.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.group.toLowerCase().includes(submenuSearch.toLowerCase());
      const matchesGroup = selectedGroup === 'todos' || item.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [submenuSearch, selectedGroup]);

  // Filtered Producers
  const filteredProducers = useMemo(() => {
    return producers.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(producerSearch.toLowerCase()) ||
        (p.tradeName && p.tradeName.toLowerCase().includes(producerSearch.toLowerCase())) ||
        p.document.includes(producerSearch) ||
        (p.code && p.code.toLowerCase().includes(producerSearch.toLowerCase()));
      const matchesCategory = categoryFilter === 'TODAS' || p.category === categoryFilter;
      return matchesText && matchesCategory;
    });
  }, [producers, producerSearch, categoryFilter]);

  // Stage advancement
  const handleAdvanceStage = async (dealId: string, currentStage: DealStage) => {
    const stageFlow: DealStage[] = [
      'PROSPECCAO',
      'QUALIFICACAO',
      'PROPOSTA_ENVIADA',
      'NEGOCIACAO',
      'FECHADO_GANHO',
    ];
    const currentIndex = stageFlow.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stageFlow.length - 1) {
      const nextStage = stageFlow[currentIndex + 1];
      try {
        const updated = await crmClient.updateOpportunityStage(dealId, nextStage);
        setOpportunities((prev) => prev.map((d) => (d.id === dealId ? updated : d)));
      } catch (err) {
        console.error('Erro ao atualizar etapa do deal:', err);
      }
    }
  };

  const handleCreateProducer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await crmClient.createProducer(newProducerForm);
      setProducers((prev) => [created, ...prev]);
      setIsProducerModalOpen(false);
      setNewProducerForm({
        name: '',
        tradeName: '',
        document: '',
        category: 'SHOWS_NACIONAIS',
        email: '',
        phone: '',
        defaultDiskFeeRate: 12.5,
        defaultSpreadRate: 3.5,
        bankName: 'Banco Bradesco',
        agency: '',
        account: '',
        pixKey: '',
      });
    } catch (err) {
      console.error('Erro ao criar produtor:', err);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prod = producers.find((p) => p.id === newDealForm.producerId);
      const created = await crmClient.createOpportunity({
        ...newDealForm,
        producerName: prod ? prod.name : 'Produtor Parceiro',
      });
      setOpportunities((prev) => [created, ...prev]);
      setIsDealModalOpen(false);
      setNewDealForm({
        title: '',
        producerId: producers[0]?.id || '',
        expectedGmv: 500000,
        feeRateProposed: 12.0,
        eventDate: '2026-12-20',
        venueName: 'Teatro Positivo',
        responsibleSdr: 'Carlos Eduardo Silveira',
        stage: 'PROSPECCAO',
      });
    } catch (err) {
      console.error('Erro ao cadastrar deal:', err);
    }
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header do Módulo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>CRM & Gestão Comercial · DiskIngressos</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestão de Produtores, Parcerias & Pipeline de Espetáculos
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Central comercial dedicada à atração de grandes produtoras, negociação de espetáculos,
              gestão de contratos de exclusividade, funil de captação e relacionamento com promotores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
              title="Atualizar dados do CRM"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => setIsDealModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Novo Deal / Show</span>
            </button>

            <button
              onClick={() => setIsProducerModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cadastrar Produtor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Produtores na Carteira</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.totalProducers : '42'}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics ? metrics.activeProducers : '38'} parceiros com shows ativos</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pipeline de Deals</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.pipelineDealsCount : '19'} Negociações
            </div>
            <div className="text-xs text-indigo-700 font-semibold mt-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{metrics ? formatBRL(metrics.pipelineGmvValue) : 'R$ 5,84 mi'} projetado</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Taxa Média Disk</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.avgFeeRate.toFixed(1)}%` : '12.8%'}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Take-rate médio de conveniência
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Conversão de Shows</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.winRatePercent}%` : '78.4%'}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              Taxa de sucesso nas praças PR/SC
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Satisfação Produtor</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Star className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.csatRating} / 5.0` : '4.9 / 5.0'}
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              NPS Excelente · Suporte em eventos
            </div>
          </div>
        </div>
      </div>

      {/* 3. Submenu Hub & Quick Navigation (26 Submenus) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-bold text-slate-900">
              Central de Acesso Rápido — 26 Submenus do CRM Comercial
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              {filteredSubmenus.length} de 26
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar funcionalidade comercial..."
                value={submenuSearch}
                onChange={(e) => setSubmenuSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white w-64 text-slate-800"
              />
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {groups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp === 'todos' ? 'Todos os Grupos' : grp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submenu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSubmenus.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onSelectSection) onSelectSection(item.id);
                  if (item.id === 'crm-dashboard') setActiveTab('dashboard');
                  else if (item.id === 'crm-pipeline' || item.id === 'crm-funil-eventos') setActiveTab('pipeline');
                  else if (item.id === 'crm-produtores' || item.id === 'crm-homologacao' || item.id === 'crm-contatos') setActiveTab('produtores');
                  else if (item.id === 'crm-tabelas-taxas' || item.id === 'crm-acordos-advance' || item.id === 'crm-exclusividade') setActiveTab('taxas');
                  else if (item.id === 'crm-chamados' || item.id === 'crm-csat') setActiveTab('suporte');
                }}
                className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-white border border-slate-200 text-blue-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.purpose}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-600">{item.group.split('(')[0]}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Abas Operacionais Principais */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. Visão Geral & Dashboard Comercial</span>
          </button>

          <button
            onClick={() => setActiveTab('produtores')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'produtores'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Carteira 360º de Produtores ({producers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>3. Pipeline & Funil Kanban de Eventos ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('taxas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'taxas'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>4. Tabelas de Taxas & Condições Comerciais</span>
          </button>

          <button
            onClick={() => setActiveTab('suporte')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'suporte'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>5. Atendimento, Suporte & SLA</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* TAB 1: DASHBOARD COMERCIAL */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Ranking Top Produtores */}
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Top Produtores por Volume Acumulado (GMV)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Principais parcerias ativas em Curitiba e Região Metropolitana
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      Ranking 2026
                    </span>
                  </div>

                  <div className="space-y-3">
                    {producers.slice(0, 5).map((prod, idx) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:shadow-xs transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-700'
                                : idx === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {prod.totalEventsCount} shows realizados · Taxa Disk: {prod.defaultDiskFeeRate}%
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {formatBRL(prod.gmvAccumulated)}
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Rating {prod.creditRating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Praças Homologadas & Capacidades */}
                <div className="w-full lg:w-96 bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Praças & Venues Homologadas</h3>
                      <p className="text-xs text-slate-500">Capacidade de público e bilheterias integradas</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Teatro Positivo (Curitiba)</span>
                        <span className="text-blue-700">2.400 lugares</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assentos numerados · 4 PDVs locais · Conexão fibra dedicada
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Pedreira Paulo Leminski</span>
                        <span className="text-blue-700">25.000 pessoas</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Pista e Camarotes · 24 Catracas eletrônicas Disk · Antifraude 100%
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Live Curitiba</span>
                        <span className="text-blue-700">4.500 pessoas</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Pista premium e mezanino · Totens de autoatendimento integrados
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Teatro Guaíra (Guairão)</span>
                        <span className="text-blue-700">2.167 lugares</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Plateia, 1º e 2º Balcões · Integração borderô cultural
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Estratégicas de Mercado */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <strong>Diretriz de Segurança Comercial DiskIngressos:</strong> Toda negociação de novo espetáculo é registrada com parâmetros claros de taxa de conveniência, split de processamento de cartão (MDR) e travas automáticas no motor financeiro para impedir repasses antes da homologação da conta bancária de titularidade exclusiva do produtor homologado.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARTEIRA 360º DE PRODUTORES */}
          {activeTab === 'produtores' && (
            <div className="space-y-4">
              {/* Filtros e Busca */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por razão social, CNPJ ou código..."
                      value={producerSearch}
                      onChange={(e) => setProducerSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="TODAS">Todas as Categorias</option>
                    <option value="SHOWS_NACIONAIS">Shows Nacionais</option>
                    <option value="TEATROS">Teatros & Musicais</option>
                    <option value="FESTIVAIS">Festivais de Música</option>
                    <option value="STAND_UP">Stand-Up Comedy</option>
                    <option value="CORPORATIVO">Corporativo & Palestras</option>
                    <option value="ESPORTES">Esportes</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Exibindo <strong>{filteredProducers.length}</strong> de <strong>{producers.length}</strong> produtores
                  </span>
                  <button
                    onClick={() => setIsProducerModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Produtores */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Produtor / Razão Social</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Taxa Disk / Spread</th>
                      <th className="py-3 px-4">Conta de Repasse</th>
                      <th className="py-3 px-4">GMV Acumulado</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducers.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>CNPJ: {prod.document}</span>
                            <span>·</span>
                            <span className="text-blue-700 font-medium">{prod.code || 'PROD'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {prod.category.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.defaultDiskFeeRate}%</div>
                          <div className="text-[11px] text-slate-500">Spread: {prod.defaultSpreadRate}%</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{prod.bankName || 'Bradesco'}</div>
                          <div className="text-[11px] text-slate-500">
                            Ag: {prod.agency} / CC: {prod.account}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{formatBRL(prod.gmvAccumulated)}</div>
                          <div className="text-[11px] text-slate-500">{prod.totalEventsCount} shows</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              prod.creditRating === 'AAA'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.creditRating.startsWith('AA')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {prod.creditRating}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedProducer(prod);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver ficha 360º do produtor"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE & KANBAN DE EVENTOS */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Funil de Oportunidades & Captação de Turnês
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acompanhamento do pipeline desde o primeiro contato até o contrato assinado
                  </p>
                </div>

                <button
                  onClick={() => setIsDealModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Oportunidade</span>
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {(
                  [
                    { id: 'PROSPECCAO', label: '1. Prospecção', color: 'border-slate-300 bg-slate-50' },
                    { id: 'QUALIFICACAO', label: '2. Qualificação', color: 'border-blue-300 bg-blue-50/40' },
                    { id: 'PROPOSTA_ENVIADA', label: '3. Proposta Enviada', color: 'border-indigo-300 bg-indigo-50/40' },
                    { id: 'NEGOCIACAO', label: '4. Negociação', color: 'border-amber-300 bg-amber-50/40' },
                    { id: 'FECHADO_GANHO', label: '5. Fechado / Ganho', color: 'border-emerald-300 bg-emerald-50/40' },
                  ] as const
                ).map((col) => {
                  const colDeals = opportunities.filter((d) => d.stage === col.id);
                  const totalColGmv = colDeals.reduce((acc, curr) => acc + curr.expectedGmv, 0);

                  return (
                    <div key={col.id} className={`border rounded-xl p-3 flex flex-col ${col.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">{col.label}</span>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-full">
                          {colDeals.length}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-500 mb-3 pb-2 border-b border-slate-200/80">
                        {formatBRL(totalColGmv)}
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {colDeals.map((deal) => (
                          <div
                            key={deal.id}
                            className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:shadow-xs transition-shadow"
                          >
                            <div className="text-xs font-bold text-slate-900 leading-snug">
                              {deal.title}
                            </div>
                            <div className="text-[11px] text-blue-700 font-medium mt-1">
                              {deal.producerName}
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-900">{formatBRL(deal.expectedGmv)}</span>
                              <span className="text-slate-500">Taxa: {deal.feeRateProposed}%</span>
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                              <span>{deal.venueName}</span>
                              <span className="font-semibold text-slate-600">{deal.probabilityPercent}% prob.</span>
                            </div>

                            {col.id !== 'FECHADO_GANHO' && (
                              <button
                                onClick={() => handleAdvanceStage(deal.id, deal.stage)}
                                className="w-full mt-2.5 py-1 px-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <span>Avançar Etapa</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TABELAS DE TAXAS & CONDIÇÕES COMERCIAIS */}
          {activeTab === 'taxas' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Matriz de Taxa de Conveniência & Spread Comercial
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Condições padrão homologadas pela Diretoria Comercial da DiskIngressos para eventos em Curitiba e Região
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">Shows & Grandes Festivais</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        11.5% a 13.5%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Eventos com GMV acima de R$ 500 mil. Inclui suporte presencial completo, controle de acesso e catracas sem custo adicional.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">Teatros & Peças Culturais</span>
                      <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                        12.0% a 14.0%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Espetáculos em teatros parceiros (Positivo, Fernanda Montenegro). Inclui mapa interativo de assentos e bilheteria física.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">Stand-Up & Clubes</span>
                      <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        12.5% a 15.0%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sessões múltiplas de comédia com repasse consolidado por fim de semana e borderô online automático para o produtor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Regras de Advance */}
              <div className="p-4 border border-amber-200 bg-amber-50/60 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Política de Advance (Adiantamento de Bilheteria):</strong> A concessão de antecipação de receita para pagamento de cachê artístico só é permitida mediante avaliação de crédito (Rating AA ou AAA) e retenção mínima de 30% em garantia na conta custódia até a conclusão do evento.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATENDIMENTO, SUPORTE & SLA */}
          {activeTab === 'suporte' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Central de Atendimento Dedicado ao Produtor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Solicitações de lotes extras, alteração de valores de ingresso, cortesias e borderôs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    SLA Médio: 18 minutos
                  </span>
                </div>
              </div>

              {/* Fila de Chamados Mock */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Protocolo / Produtor</th>
                      <th className="py-3 px-4">Assunto</th>
                      <th className="py-3 px-4">Evento Vinculado</th>
                      <th className="py-3 px-4">Prioridade</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aberto em</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">#TK-4091</div>
                        <div className="text-[11px] text-slate-500">Opus Entretenimento</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        Liberação do 3º lote de pista premium
                      </td>
                      <td className="py-3 px-4 text-slate-600">Turnê MPB Clássicos</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Alta
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Em Atendimento
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">Há 25 min</td>
                    </tr>

                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">#TK-4089</div>
                        <div className="text-[11px] text-slate-500">Like Entretenimento</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        Cessão de 50 cortesias técnicas para patrocinadores
                      </td>
                      <td className="py-3 px-4 text-slate-600">Festival Sertanejo Curitiba</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          Normal
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Concluído
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">Há 2 horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: CADASTRAR PRODUTOR */}
      {isProducerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cadastrar Novo Produtor Parceiro</h2>
                <p className="text-xs text-slate-500">Adicione uma produtora à carteira homologada da DiskIngressos</p>
              </div>
              <button
                onClick={() => setIsProducerModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProducer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Razão Social / Nome Oficial</label>
                <input
                  type="text"
                  required
                  value={newProducerForm.name}
                  onChange={(e) => setNewProducerForm({ ...newProducerForm, name: e.target.value })}
                  placeholder="Ex: CWB Brasil Produções Artísticas Ltda"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    value={newProducerForm.tradeName}
                    onChange={(e) => setNewProducerForm({ ...newProducerForm, tradeName: e.target.value })}
                    placeholder="Ex: CWB Brasil"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    required
                    value={newProducerForm.document}
                    onChange={(e) => setNewProducerForm({ ...newProducerForm, document: e.target.value })}
                    placeholder="00.000.000/0001-00"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria Principal</label>
                  <select
                    value={newProducerForm.category}
                    onChange={(e) =>
                      setNewProducerForm({ ...newProducerForm, category: e.target.value as ProducerCategory })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="SHOWS_NACIONAIS">Shows Nacionais</option>
                    <option value="TEATROS">Teatros & Musicais</option>
                    <option value="FESTIVAIS">Festivais de Música</option>
                    <option value="STAND_UP">Stand-Up Comedy</option>
                    <option value="CORPORATIVO">Corporativo & Palestras</option>
                    <option value="ESPORTES">Esportes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxa Disk Padrão (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProducerForm.defaultDiskFeeRate}
                    onChange={(e) =>
                      setNewProducerForm({ ...newProducerForm, defaultDiskFeeRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Comercial</label>
                  <input
                    type="email"
                    value={newProducerForm.email}
                    onChange={(e) => setNewProducerForm({ ...newProducerForm, email: e.target.value })}
                    placeholder="contato@produtora.com.br"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={newProducerForm.phone}
                    onChange={(e) => setNewProducerForm({ ...newProducerForm, phone: e.target.value })}
                    placeholder="(41) 99999-0000"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProducerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVO DEAL / SHOW */}
      {isDealModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Nova Oportunidade / Show no Pipeline</h2>
                <p className="text-xs text-slate-500">Cadastre um novo espetáculo em negociação comercial</p>
              </div>
              <button
                onClick={() => setIsDealModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Espetáculo / Turnê</label>
                <input
                  type="text"
                  required
                  value={newDealForm.title}
                  onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  placeholder="Ex: Turnê Acústico Nacional 2026"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Produtora Responsável</label>
                <select
                  value={newDealForm.producerId}
                  onChange={(e) => setNewDealForm({ ...newDealForm, producerId: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {producers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GMV Estimado (R$)</label>
                  <input
                    type="number"
                    value={newDealForm.expectedGmv}
                    onChange={(e) =>
                      setNewDealForm({ ...newDealForm, expectedGmv: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxa Proposta (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDealForm.feeRateProposed}
                    onChange={(e) =>
                      setNewDealForm({ ...newDealForm, feeRateProposed: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Praça / Casa de Shows</label>
                  <input
                    type="text"
                    value={newDealForm.venueName}
                    onChange={(e) => setNewDealForm({ ...newDealForm, venueName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Prevista</label>
                  <input
                    type="date"
                    value={newDealForm.eventDate}
                    onChange={(e) => setNewDealForm({ ...newDealForm, eventDate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDealModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Cadastrar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FICHA 360º DO PRODUTOR */}
      {isDetailsModalOpen && selectedProducer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedProducer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedProducer.name}</h2>
                  <p className="text-xs text-slate-500">
                    CNPJ: {selectedProducer.document} · Rating {selectedProducer.creditRating}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Taxa Disk Padrão</span>
                <div className="text-sm font-bold text-slate-900">{selectedProducer.defaultDiskFeeRate}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Spread Acordado</span>
                <div className="text-sm font-bold text-slate-900">{selectedProducer.defaultSpreadRate}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Shows Realizados</span>
                <div className="text-sm font-bold text-slate-900">{selectedProducer.totalEventsCount} eventos</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">GMV Acumulado</span>
                <div className="text-sm font-bold text-emerald-700">{formatBRL(selectedProducer.gmvAccumulated)}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-700" />
                <span>Dados Bancários de Custódia & Repasse</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">Banco: </span>
                  <strong>{selectedProducer.bankName || 'Banco Bradesco S.A.'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Agência / Conta: </span>
                  <strong>{selectedProducer.agency} / {selectedProducer.account}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Chave PIX Cadastrada: </span>
                  <strong className="text-blue-700">{selectedProducer.pixKey || selectedProducer.document}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
