import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  PieChart,
  Bell,
  DollarSign,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Brain,
  Bot,
  Sparkles,
  Cpu,
  Sliders,
  SlidersHorizontal,
  Workflow,
  FileText,
  Layers,
  Download,
  Search,
  Building2,
  Users,
  Receipt,
  Scale,
  Gauge,
  FolderCheck,
  RefreshCw,
  Zap,
  BookOpen,
  HelpCircle,
  Send,
  Database,
  Filter,
  Check,
  Eye,
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRightSquare,
  BarChart2,
  LineChart,
  Grid,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import {
  inteligenciaClient,
  ExecDashboardResponse,
  SmartAlert,
  MonthlyEvolutionItem,
  ScenarioSimulationResult,
  EventPerformanceItem,
} from '../../services/inteligenciaClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface IntelSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const INTEL_SUBMENUS: IntelSubmenuDef[] = [
  // 1. Visão Executiva (4)
  {
    id: 'intel-exec-dashboard',
    label: 'Dashboard Executivo',
    group: 'Visão Executiva',
    icon: LayoutDashboard,
    purpose: 'Visão consolidada de indicadores e KPIs corporativos da DiskIngressos.',
    badge: 'Principal',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'intel-exec-kpis',
    label: 'Indicadores de Desempenho (KPIs)',
    group: 'Visão Executiva',
    icon: Gauge,
    purpose: 'Métricas de rentabilidade, ticket médio, volume e taxas de conveniência.',
  },
  {
    id: 'intel-exec-gerencial',
    label: 'Análise Gerencial',
    group: 'Visão Executiva',
    icon: BarChart3,
    purpose: 'DRE gerencial analítica, margens operacionais e waterfall de agregação de valor.',
  },
  {
    id: 'intel-exec-alertas',
    label: 'Central de Alertas Inteligentes',
    group: 'Visão Executiva',
    icon: Bell,
    purpose: 'Monitoramento de riscos de liquidez, desvios orçamentários e tendências operacionais.',
    badge: '4 Alertas',
    badgeColor: 'bg-amber-100 text-amber-800',
  },

  // 2. Inteligência Financeira (6)
  {
    id: 'intel-fin-receitas',
    label: 'Inteligência de Receitas',
    group: 'Inteligência Financeira',
    icon: DollarSign,
    purpose: 'Desdobramento por taxa de conveniência web/app, PDVs e locação de hardwares.',
  },
  {
    id: 'intel-fin-rentabilidade',
    label: 'Rentabilidade e Margens',
    group: 'Inteligência Financeira',
    icon: Percent,
    purpose: 'Margem de contribuição por evento, canal de distribuição e gênero de espetáculo.',
  },
  {
    id: 'intel-fin-fluxo-preditivo',
    label: 'Fluxo de Caixa Preditivo',
    group: 'Inteligência Financeira',
    icon: TrendingUp,
    purpose: 'Modelagem estatística de disponibilidades para 30, 60 e 90 dias com intervalos de confiança.',
    badge: 'Preditivo',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'intel-fin-custos',
    label: 'Inteligência de Custos',
    group: 'Inteligência Financeira',
    icon: PieChart,
    purpose: 'Análise de custos operacionais de bilheteria, gateways e despesas corporativas Disk.',
  },
  {
    id: 'intel-fin-inadimplencia',
    label: 'Análise de Inadimplência',
    group: 'Inteligência Financeira',
    icon: ShieldAlert,
    purpose: 'Controle de contestações, chargebacks de adquirentes e taxa de cobertura antifraude.',
  },
  {
    id: 'intel-fin-repasses',
    label: 'Análise de Repasses',
    group: 'Inteligência Financeira',
    icon: RefreshCw,
    purpose: 'Monitoramento de picos de liquidação e saldos em custódia fiduciária dos produtores.',
  },

  // 3. Inteligência de Eventos (5)
  {
    id: 'intel-evt-performance',
    label: 'Performance de Eventos',
    group: 'Inteligência de Eventos',
    icon: Activity,
    purpose: 'Vendas acumuladas, curvas de lote, conversão e velocidade de bilheteria.',
  },
  {
    id: 'intel-evt-previsao',
    label: 'Previsão de Vendas',
    group: 'Inteligência de Eventos',
    icon: Sparkles,
    purpose: 'Estimativas de machine learning para ritmo de esgotamento e picos de demanda.',
  },
  {
    id: 'intel-evt-ocupacao',
    label: 'Ocupação e Demanda',
    group: 'Inteligência de Eventos',
    icon: Layers,
    purpose: 'Taxa de ocupação por setor em teatros, arenas e espaços para eventos.',
  },
  {
    id: 'intel-evt-cancelamentos',
    label: 'Análise de Cancelamentos',
    group: 'Inteligência de Eventos',
    icon: AlertTriangle,
    purpose: 'Índice de devoluções, trocas de ingressos e recomposição de taxas.',
  },
  {
    id: 'intel-evt-comportamento',
    label: 'Comportamento de Compras',
    group: 'Inteligência de Eventos',
    icon: Users,
    purpose: 'Padrão temporal de compra, antecipação de compra do público e canais preferenciais.',
  },

  // 4. Inteligência Empresarial (5)
  {
    id: 'intel-emp-compras',
    label: 'Análise de Compras',
    group: 'Inteligência Empresarial',
    icon: FolderCheck,
    purpose: 'Gastos corporativos por centro de custo, fornecedores estratégicos e saving obtido.',
  },
  {
    id: 'intel-emp-rh',
    label: 'Inteligência de RH',
    group: 'Inteligência Empresarial',
    icon: Users,
    purpose: 'Turnover, headcount por departamento, custo de folha per capita e absenteísmo.',
  },
  {
    id: 'intel-emp-fiscal',
    label: 'Inteligência Fiscal',
    group: 'Inteligência Empresarial',
    icon: Receipt,
    purpose: 'Carga tributária efetiva da Disk, retenções federais e apurações municipais de ISS.',
  },
  {
    id: 'intel-emp-contabil',
    label: 'Inteligência Contábil',
    group: 'Inteligência Empresarial',
    icon: Scale,
    purpose: 'Demonstrações contábeis auditáveis, balanço societário segregado e índices de solvência.',
  },
  {
    id: 'intel-emp-eficiencia',
    label: 'Eficiência Operacional',
    group: 'Inteligência Empresarial',
    icon: Zap,
    purpose: 'Índice de produtividade operacional, custo por ingresso emitido e SLA de atendimento.',
  },

  // 5. Inteligência Artificial (6)
  {
    id: 'intel-ai-assistente',
    label: 'Assistente Inteligente Keeper',
    group: 'Inteligência Artificial',
    icon: Bot,
    purpose: 'Copilot corporativo treinado para responder consultas estratégicas em linguagem natural.',
    badge: 'IA Copilot',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'intel-ai-preditiva',
    label: 'Análise Preditiva',
    group: 'Inteligência Artificial',
    icon: Brain,
    purpose: 'Projeções estatísticas baseadas em séries temporais históricas da bilheteria.',
  },
  {
    id: 'intel-ai-anomalias',
    label: 'Detecção de Anomalias',
    group: 'Inteligência Artificial',
    icon: ShieldAlert,
    purpose: 'Identificação preditiva de fraudes, desvios atípicos de margem e divergências financeiras.',
  },
  {
    id: 'intel-ai-recomendacoes',
    label: 'Recomendações Inteligentes',
    group: 'Inteligência Artificial',
    icon: Sparkles,
    purpose: 'Sugestões automatizadas de precificação de lotes, datas de repasse e gestão de estoques.',
  },
  {
    id: 'intel-ai-simulador',
    label: 'Simulador de Cenários',
    group: 'Inteligência Artificial',
    icon: Sliders,
    purpose: 'Simulação what-if de sensibilidade de margem com variações de volume, taxa e despesas.',
    badge: 'Simulador',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'intel-ai-automacoes',
    label: 'Automações Inteligentes',
    group: 'Inteligência Artificial',
    icon: Workflow,
    purpose: 'Workflows supervisionados com gatilhos condicionais e autorização de alçadas.',
  },

  // 6. Dados e Relatórios (5)
  {
    id: 'intel-rep-central',
    label: 'Central de Relatórios',
    group: 'Dados e Relatórios',
    icon: FileText,
    purpose: 'Biblioteca corporativa de relatórios gerenciais consolidados para a diretoria.',
  },
  {
    id: 'intel-rep-builder',
    label: 'Construtor de Relatórios',
    group: 'Dados e Relatórios',
    icon: SlidersHorizontal,
    purpose: 'Criação visual de consultas customizadas com filtros multi-tabelas.',
  },
  {
    id: 'intel-rep-custom-dash',
    label: 'Painéis Personalizados',
    group: 'Dados e Relatórios',
    icon: LayoutDashboard,
    purpose: 'Configuração de dashboards executivos sob medida para cada diretoria da Disk.',
  },
  {
    id: 'intel-rep-export',
    label: 'Exportações e Agendamentos',
    group: 'Dados e Relatórios',
    icon: Download,
    purpose: 'Agendamento de remessas periódicas de relatórios por e-mail e integração webhook.',
  },
  {
    id: 'intel-rep-qualidade',
    label: 'Qualidade dos Dados',
    group: 'Dados e Relatórios',
    icon: Database,
    purpose: 'Monitoramento da saúde dos pipelines ETL, latência dos dados e trilhas de auditoria.',
  },

  // 7. Governança e Controle (4)
  {
    id: 'intel-gov-auditoria',
    label: 'Auditoria Analítica',
    group: 'Governança e Controle',
    icon: Lock,
    purpose: 'Registro rigoroso de acessos analíticos e conformidade com privacidade e LGPD.',
  },
  {
    id: 'intel-gov-permissoes',
    label: 'Permissões de Inteligência',
    group: 'Governança e Controle',
    icon: ShieldCheck,
    purpose: 'Matriz RBAC granular para controle de relatórios confidenciais e métricas de margem.',
  },
  {
    id: 'intel-gov-modelos',
    label: 'Modelos e Indicadores',
    group: 'Governança e Controle',
    icon: BookOpen,
    purpose: 'Dicionário oficial de métricas homologadas e regras de cálculo do ERP Keeper.',
  },
  {
    id: 'intel-gov-config',
    label: 'Configurações de Inteligência',
    group: 'Governança e Controle',
    icon: Sliders,
    purpose: 'Parâmetros de conexão com bancos legados, períodos fiscais e thresholds de IA.',
  },
];

export const GROUPS_LIST = [
  'Todos (35)',
  'Visão Executiva (4)',
  'Inteligência Financeira (6)',
  'Inteligência de Eventos (5)',
  'Inteligência Empresarial (5)',
  'Inteligência Artificial (6)',
  'Dados e Relatórios (5)',
  'Governança e Controle (4)',
];

export const InteligenciaModuleView: React.FC<Props> = ({
  activeSection = 'intel-exec-dashboard',
  onSelectSection,
}) => {
  const [sectionId, setSectionId] = useState<string>(activeSection);
  const [selectedGroupTab, setSelectedGroupTab] = useState<string>('Todos (35)');
  const [hubSearch, setHubSearch] = useState<string>('');
  const [chartType, setChartType] = useState<'curva' | 'barras' | 'margem'>('curva');

  // Dados da API
  const [dashboardData, setDashboardData] = useState<ExecDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados do Simulador de Cenários
  const [simGmv, setSimGmv] = useState<number>(0);
  const [simFee, setSimFee] = useState<number>(0);
  const [simExpenses, setSimExpenses] = useState<number>(0);
  const [simResult, setSimResult] = useState<ScenarioSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Estados do Copilot
  const [copilotQuery, setCopilotQuery] = useState<string>('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; sources?: string[] }>>([
    {
      sender: 'assistant',
      text: 'Olá! Sou o Assistente Inteligente Keeper. Posso responder sobre o GMV da plataforma, receitas próprias da DiskIngressos, custódia de produtores, margens operacionais e projeções. Como posso apoiar sua decisão hoje?',
      sources: ['Diretrizes DiskIngressos', 'Data Warehouse Keeper'],
    },
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);

  // Eventos Performance
  const [eventPerformances, setEventPerformances] = useState<EventPerformanceItem[]>([]);

  // Filtros de Alertas
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('all');

  // Sincronizar com props externas
  useEffect(() => {
    if (activeSection && activeSection !== sectionId) {
      setSectionId(activeSection);
    }
  }, [activeSection]);

  const handleSelectSection = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
    // Rolagem suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Carregar dados
  const loadData = async () => {
    try {
      setIsRefreshing(true);
      const [dash, evts] = await Promise.all([
        inteligenciaClient.getDashboard(),
        inteligenciaClient.getEventPerformance(),
      ]);
      setDashboardData(dash);
      setEventPerformances(evts);
    } catch {
      showNotification('Erro ao sincronizar inteligência com o servidor. Usando dados locais.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Executar simulação what-if
  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true);
      const res = await inteligenciaClient.simulateScenario({
        variacaoGmvPercent: simGmv,
        variacaoTaxaConvenienciaPercent: simFee,
        variacaoDespesasPercent: simExpenses,
        mesesProjecao: 3,
      });
      setSimResult(res);
      showNotification('Cenário recalculado com sucesso pelo motor preditivo!');
    } catch {
      alert('Erro ao calcular simulação.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Enviar pergunta ao Copilot
  const handleSendCopilotQuery = async (queryToSend?: string) => {
    const q = queryToSend || copilotQuery;
    if (!q.trim()) return;

    setCopilotMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setCopilotQuery('');
    setIsCopilotThinking(true);

    try {
      const res = await inteligenciaClient.queryCopilot(q);
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.resposta,
          sources: res.fontes,
        },
      ]);
    } catch {
      setCopilotMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Desculpe, ocorreu uma instabilidade ao consultar os modelos. Verifique a conexão com o servidor.',
        },
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Filtragem dos 35 submenus para o Hub integrado no Dashboard
  const filteredHubSubmenus = useMemo(() => {
    return INTEL_SUBMENUS.filter((sm) => {
      const matchSearch =
        sm.label.toLowerCase().includes(hubSearch.toLowerCase()) ||
        sm.purpose.toLowerCase().includes(hubSearch.toLowerCase()) ||
        sm.group.toLowerCase().includes(hubSearch.toLowerCase());

      const matchGroup =
        selectedGroupTab === 'Todos (35)' ||
        sm.group.toLowerCase().includes(selectedGroupTab.split(' ')[0].toLowerCase());

      return matchSearch && matchGroup;
    });
  }, [hubSearch, selectedGroupTab]);

  const currentSubmenu = INTEL_SUBMENUS.find((s) => s.id === sectionId) || INTEL_SUBMENUS[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Filtrar alertas inteligentes
  const filteredAlerts = useMemo(() => {
    if (!dashboardData) return [];
    if (alertSeverityFilter === 'all') return dashboardData.alertasInteligentes;
    return dashboardData.alertasInteligentes.filter((a) => a.severidade === alertSeverityFilter);
  }, [dashboardData, alertSeverityFilter]);

  // =========================================================================
  // VIEW: DASHBOARD EXECUTIVO PRINCIPAL (CARDS MAIORES, MAIS LARGOS E HUB)
  // =========================================================================
  const renderDashboardExecutivo = () => {
    const kpis = dashboardData?.kpis || {
      vendasPlataforma: 2418900.0,
      receitaPropriaDisk: 214320.0,
      obrigacoesProdutores: 1846500.0,
      resultadoOperacional: 68450.0,
      margemOperacionalPercent: 31.94,
      despesasPropriasDisk: 145870.0,
      totalIngressos: 16288,
      ticketMedio: 148.5,
      eventosAtivos: 42,
      produtoresAtivos: 28,
    };

    const monthly = dashboardData?.evolucaoMensal || [];

    return (
      <div className="space-y-8">
        {/* 1. OS 4 CARDS PRINCIPAIS: EXPANDIDOS, MAIORES, MAIS LARGOS E IMPONENTES */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-600" />
              Painel Consolidado de Indicadores Principais
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              Competência: Outubro / 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card 1: Vendas na Plataforma (GMV) - Ultra Largo */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                    Vendas na Plataforma (GMV)
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                    +12.5% MoM
                  </span>
                </div>

                <div className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mt-1">
                  R$ 2,4 mi
                </div>
                <div className="text-sm font-mono font-semibold text-slate-600 mt-1">
                  {formatCurrency(kpis.vendasPlataforma)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">{kpis.totalIngressos.toLocaleString('pt-BR')} ingressos emitidos</span>
                  <span className="font-bold text-slate-800">42 eventos ativos</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Ticket Médio: <strong>{formatCurrency(kpis.ticketMedio)}</strong></span>
                  <span className="text-indigo-600 font-bold">28 Produtores</span>
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Custódia fiduciária de produtores (Conta Escrow)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Receita própria Disk - Ultra Largo */}
            <div className="bg-gradient-to-br from-indigo-50/60 via-white to-indigo-50/20 rounded-3xl border-2 border-indigo-200/90 p-7 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-indigo-300 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-800 uppercase tracking-wider">
                    Receita Própria Disk
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-900">
                    +9.9% MoM
                  </span>
                </div>

                <div className="text-4xl xl:text-5xl font-black text-indigo-950 tracking-tight mt-1">
                  R$ 214 mil
                </div>
                <div className="text-sm font-mono font-bold text-indigo-700 mt-1">
                  {formatCurrency(kpis.receitaPropriaDisk)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-900">
                  <span className="font-medium">Taxas de conveniência Web/App</span>
                  <span className="font-bold">PDVs & Bilheteria</span>
                </div>
                <div className="text-xs text-indigo-700 flex items-center justify-between">
                  <span>Margem sobre GMV: <strong>8.86%</strong></span>
                  <span className="font-bold text-emerald-700">MDR & Hardwares</span>
                </div>
                <div className="text-[11px] text-indigo-800 bg-indigo-100/70 border border-indigo-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-indigo-700" />
                  <span>Receita líquida própria societária escriturada</span>
                </div>
              </div>
            </div>

            {/* Card 3: Obrigações com produtores - Ultra Largo */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                    Obrigações com Produtores
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800">
                    Conta Escrow
                  </span>
                </div>

                <div className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mt-1">
                  R$ 1,8 mi
                </div>
                <div className="text-sm font-mono font-semibold text-slate-600 mt-1">
                  {formatCurrency(kpis.obrigacoesProdutores)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">28 contratos ativos</span>
                  <span className="font-bold text-slate-800">100% Conciliado</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Pico em 15/10: <strong>R$ 420.000</strong></span>
                  <span className="text-purple-700 font-bold">TED / PIX Lote</span>
                </div>
                <div className="text-[11px] text-rose-800 bg-rose-50/90 border border-rose-200/80 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>Passivo fiduciário segregado (não é caixa livre)</span>
                </div>
              </div>
            </div>

            {/* Card 4: Resultado operacional - Ultra Largo */}
            <div className="bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 rounded-3xl border-2 border-emerald-200/90 p-7 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    Resultado Operacional
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                    Margem 31.9%
                  </span>
                </div>

                <div className="text-4xl xl:text-5xl font-black text-emerald-950 tracking-tight mt-1">
                  R$ 68 mil
                </div>
                <div className="text-sm font-mono font-bold text-emerald-700 mt-1">
                  {formatCurrency(kpis.resultadoOperacional)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-900">
                  <span className="font-medium">Despesas Disk: R$ 145,8 mil</span>
                  <span className="font-black text-emerald-800">+14.2% MoM</span>
                </div>
                <div className="text-xs text-emerald-700 flex items-center justify-between">
                  <span>EBITDA Gerencial: <strong>R$ 82.100</strong></span>
                  <span className="font-bold">Superávit</span>
                </div>
                <div className="text-[11px] text-emerald-900 bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>Lucro operacional consolidado da empresa Disk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EVOLUÇÃO MENSAL ILUSTRATIVA: COMPACTA, COM GRÁFICOS SVG E SELETOR DE MODOS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Evolução Mensal Ilustrativa — Receita Própria vs. Despesas Corporativas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Escala visual de R$ 80 mil a R$ 240 mil com margem operacional auditável
              </p>
            </div>

            {/* Seletor de Tipo de Gráfico & Legenda */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                  Receita Disk
                </span>
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
                  Despesas Disk
                </span>
              </div>

              {/* Botões de alternância de gráficos */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setChartType('curva')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    chartType === 'curva'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Curva SVG</span>
                </button>
                <button
                  onClick={() => setChartType('barras')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    chartType === 'barras'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Barras</span>
                </button>
                <button
                  onClick={() => setChartType('margem')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    chartType === 'margem'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Percent className="w-3 h-3" />
                  <span>Margem %</span>
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA GRÁFICA INTERATIVA E COMPACTA */}
          <div className="pt-4 pb-2">
            {chartType === 'curva' && (
              <div className="space-y-2">
                <div className="w-full h-52 sm:h-56 relative">
                  <svg
                    viewBox="0 0 500 170"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="despGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lucroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Linhas de grade horizontais sutis */}
                    {[20, 50, 80, 110, 140].map((y) => (
                      <line
                        key={y}
                        x1="35"
                        y1={y}
                        x2="480"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Área sombreada Receita Própria */}
                    <path
                      d="M 40,88.6 L 145,63.4 L 250,72.5 L 355,51.5 L 460,38.0 L 460,150 L 40,150 Z"
                      fill="url(#recGrad)"
                    />

                    {/* Área sombreada Despesas */}
                    <path
                      d="M 40,119.4 L 145,109.6 L 250,114.5 L 355,100.5 L 460,86.0 L 460,150 L 40,150 Z"
                      fill="url(#despGrad)"
                    />

                    {/* Linha Curva Despesas */}
                    <path
                      d="M 40,119.4 L 145,109.6 L 250,114.5 L 355,100.5 L 460,86.0"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2.5"
                    />

                    {/* Linha Curva Receita Própria */}
                    <path
                      d="M 40,88.6 L 145,63.4 L 250,72.5 L 355,51.5 L 460,38.0"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                    />

                    {/* Linha de Lucro / Margem (Tracejada Verde) */}
                    <path
                      d="M 40,135 L 145,123 L 250,127 L 355,121 L 460,122"
                      fill="none"
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth="2"
                    />

                    {/* Pontos de dados Receita (Círculos interativos com tooltips) */}
                    {[
                      { x: 40, y: 88.6, val: 'R$ 142k', mes: 'Mai' },
                      { x: 145, y: 63.4, val: 'R$ 178k', mes: 'Jun' },
                      { x: 250, y: 72.5, val: 'R$ 165k', mes: 'Jul' },
                      { x: 355, y: 51.5, val: 'R$ 195k', mes: 'Ago' },
                      { x: 460, y: 38.0, val: 'R$ 214k', mes: 'Set' },
                    ].map((pt) => (
                      <g key={pt.mes} className="cursor-pointer group">
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          fill="#312e81"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {pt.val}
                        </text>
                      </g>
                    ))}

                    {/* Pontos de dados Despesas */}
                    {[
                      { x: 40, y: 119.4, val: 'R$ 98k', mes: 'Mai' },
                      { x: 145, y: 109.6, val: 'R$ 112k', mes: 'Jun' },
                      { x: 250, y: 114.5, val: 'R$ 105k', mes: 'Jul' },
                      { x: 355, y: 100.5, val: 'R$ 125k', mes: 'Ago' },
                      { x: 460, y: 86.0, val: 'R$ 145k', mes: 'Set' },
                    ].map((pt) => (
                      <g key={pt.mes} className="cursor-pointer group">
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#64748b" stroke="#ffffff" strokeWidth="2" />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Eixos X e Escala Inferior */}
                <div className="flex items-center justify-between text-xs text-slate-700 px-4 pt-1 font-bold">
                  <span className="text-center w-12">Mai</span>
                  <span className="text-center w-12">Jun</span>
                  <span className="text-center w-12">Jul</span>
                  <span className="text-center w-12">Ago</span>
                  <span className="text-center w-12">Set</span>
                </div>
              </div>
            )}

            {chartType === 'barras' && (
              <div className="pt-2 pb-2">
                <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-48 border-b border-slate-200 px-2">
                  {monthly.map((m) => {
                    const maxVal = 240000;
                    const recHeightPercent = Math.min(100, Math.round((m.receitaPropria / maxVal) * 100));
                    const expHeightPercent = Math.min(100, Math.round((m.despesasDisk / maxVal) * 100));

                    return (
                      <div key={m.mes} className="flex flex-col items-center h-full justify-end group">
                        <div className="flex items-end gap-1.5 sm:gap-3 w-full justify-center h-full pb-2">
                          {/* Barra Receita */}
                          <div className="flex flex-col items-center w-6 sm:w-10">
                            <span className="text-[10px] font-black text-indigo-700 mb-1 whitespace-nowrap">
                              {Math.round(m.receitaPropria / 1000)}k
                            </span>
                            <div
                              style={{ height: `${recHeightPercent}%` }}
                              className="w-full bg-indigo-600 rounded-t-lg shadow-xs group-hover:bg-indigo-700 transition-all cursor-pointer"
                              title={`Receita própria Disk (${m.mes}): ${formatCurrency(m.receitaPropria)}`}
                            />
                          </div>

                          {/* Barra Despesas */}
                          <div className="flex flex-col items-center w-6 sm:w-10">
                            <span className="text-[10px] font-bold text-slate-500 mb-1 whitespace-nowrap">
                              {Math.round(m.despesasDisk / 1000)}k
                            </span>
                            <div
                              style={{ height: `${expHeightPercent}%` }}
                              className="w-full bg-slate-300 rounded-t-lg shadow-xs group-hover:bg-slate-400 transition-all cursor-pointer"
                              title={`Despesas Disk (${m.mes}): ${formatCurrency(m.despesasDisk)}`}
                            />
                          </div>
                        </div>

                        <div className="text-center pt-2 w-full">
                          <span className="text-xs font-black text-slate-900">{m.mes}</span>
                          <div className="text-[10px] text-emerald-700 font-bold">
                            +{Math.round(m.resultado / 1000)}k
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {chartType === 'margem' && (
              <div className="pt-2 pb-2">
                <div className="grid grid-cols-5 gap-3 items-end h-48 border-b border-slate-200 px-2">
                  {[
                    { mes: 'Mai', margem: 31.0, lucro: 44000 },
                    { mes: 'Jun', margem: 37.1, lucro: 66000 },
                    { mes: 'Jul', margem: 36.4, lucro: 60000 },
                    { mes: 'Ago', margem: 35.9, lucro: 70000 },
                    { mes: 'Set', margem: 31.9, lucro: 68450 },
                  ].map((m) => {
                    const barHeight = Math.round((m.margem / 45) * 100);
                    return (
                      <div key={m.mes} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-xs font-black text-emerald-800 mb-1">
                          {m.margem}%
                        </span>
                        <div
                          style={{ height: `${barHeight}%` }}
                          className="w-10 sm:w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl shadow-xs group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all cursor-pointer"
                          title={`Margem líquida (${m.mes}): ${m.margem}% — Lucro: ${formatCurrency(m.lucro)}`}
                        />
                        <div className="text-center pt-2">
                          <span className="text-xs font-bold text-slate-800">{m.mes}</span>
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            +{formatCurrency(m.lucro)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Escala de referência e Resumo Executivo Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Receita Acumulada (Mai-Set)</span>
                <span className="text-sm font-black text-slate-900 font-mono">R$ 894,3 mil</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Média: R$ 178,8k / mês</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Despesas Acumuladas</span>
                <span className="text-sm font-black text-slate-900 font-mono">R$ 585,8 mil</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Média: R$ 117,1k / mês</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Superávit Acumulado</span>
                <span className="text-sm font-black text-emerald-950 font-mono">+R$ 308,4 mil</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Margem Média: 34.5%</span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">Taxa de Eficiência</span>
                  <span className="text-sm font-black text-indigo-950 font-mono">1,53x</span>
                </div>
                <button
                  onClick={() => handleSelectSection('intel-exec-gerencial')}
                  className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 mt-1"
                >
                  <span>Ver DRE Waterfall</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CENTRAL DE NAVEGAÇÃO DOS 35 SUBMENUS INTEGRADA DIRETAMENTE NO DASHBOARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Central de Navegação de Inteligência — 35 Submenus Integrados
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Acesse diretamente qualquer submenu dos 7 grupos estratégicos sem restrições de espaço lateral.
              </p>
            </div>

            {/* Busca rápida nos submenus */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={hubSearch}
                onChange={(e) => setHubSearch(e.target.value)}
                placeholder="Filtrar entre os 35 submenus..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Abas dos 7 Grupos */}
          <div className="py-4 flex flex-wrap gap-2 border-b border-slate-100">
            {GROUPS_LIST.map((groupTab) => (
              <button
                key={groupTab}
                onClick={() => setSelectedGroupTab(groupTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGroupTab === groupTab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {groupTab}
              </button>
            ))}
          </div>

          {/* Grade dos Submenus (Cards Maiores e Mais Largos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6">
            {filteredHubSubmenus.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.id === sectionId;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/60 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>

                      {item.badge ? (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-600 uppercase">
                          {item.group.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {item.purpose}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Acessar Função</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHubSubmenus.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhum submenu encontrado para o termo "{hubSearch}".
            </div>
          )}
        </div>

        {/* 4. ANÁLISES INTELIGENTES & ALERTAS PROATIVOS EM CARDS LARGOS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Análises Inteligentes & Detecção de Riscos em Tempo Real
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Alertas estratégicos sobre variações de receita, liquidez de eventos e controle orçamentário
              </p>
            </div>

            {/* Filtros de severidade */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'critico', label: 'Crítico' },
                { id: 'alerta', label: 'Alerta' },
                { id: 'atencao', label: 'Atenção' },
                { id: 'info', label: 'Info' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAlertSeverityFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    alertSeverityFilter === f.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {filteredAlerts.map((alert) => {
              const isCritico = alert.severidade === 'critico';
              const isAlerta = alert.severidade === 'alerta';
              const isAtencao = alert.severidade === 'atencao';

              return (
                <div
                  key={alert.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCritico
                      ? 'bg-rose-50/50 border-rose-200/90 hover:border-rose-300'
                      : isAlerta
                      ? 'bg-amber-50/50 border-amber-200/90 hover:border-amber-300'
                      : isAtencao
                      ? 'bg-blue-50/50 border-blue-200/90 hover:border-blue-300'
                      : 'bg-indigo-50/50 border-indigo-200/90 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.8 rounded-full uppercase tracking-wider ${
                        isCritico
                          ? 'bg-rose-100 text-rose-800'
                          : isAlerta
                          ? 'bg-amber-100 text-amber-800'
                          : isAtencao
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {alert.categoria} · {alert.severidade.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">{alert.timestamp}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{alert.titulo}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{alert.descricao}</p>

                  <div className="mt-5 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Confiança IA: <strong>{alert.confiancaPercent}%</strong></span>
                    </div>

                    <button
                      onClick={() => showNotification(`Ação iniciada para o alerta: ${alert.titulo}`)}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors self-start"
                    >
                      Auditar / Agir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. CONEXÃO COM OS DEMAIS MÓDULOS (MOTOR DE INTELIGÊNCIA) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Motor de Inteligência Keeper — Conexão Multi-Departamental
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consolidação de dados operacionais em tempo real sem alterar registros nas origens
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {(dashboardData?.conexoesModulos || []).map((conn) => (
              <div
                key={conn.modulo}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">{conn.modulo}</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{conn.descricao}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono text-indigo-700 font-bold">
                  {conn.metricaChave}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-slate-900 text-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-md border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 text-white">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">MOTOR DE INTELIGÊNCIA KEEPER v2.4</span>
                <span className="text-slate-300 text-xs">Modelagem preditiva, segregação de liquidez e recomendações supervisionadas</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleSelectSection('intel-ai-simulador')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <Sliders className="w-4 h-4" />
                <span>Simulador What-If</span>
              </button>
              <button
                onClick={() => handleSelectSection('intel-ai-assistente')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <Bot className="w-4 h-4 text-purple-600" />
                <span>Abrir Copilot IA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW: SIMULADOR DE CENÁRIOS (WHAT-IF) EXPANDIDO EM TELA CHEIA
  // =========================================================================
  const renderSimulador = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-emerald-600" />
                Simulador de Cenários Preditivos (What-If)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ajuste os parâmetros para projetar receitas da Disk, obrigações com produtores e resultado operacional.
              </p>
            </div>

            <button
              onClick={() => handleSelectSection('intel-exec-dashboard')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Dashboard</span>
            </button>
          </div>

          {/* Painel de Parâmetros com Sliders Amplos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-4">
            {/* Slider 1: Variação de GMV */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Volume de Vendas (GMV)</span>
                <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg ${simGmv >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {simGmv > 0 ? `+${simGmv}%` : `${simGmv}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                value={simGmv}
                onChange={(e) => setSimGmv(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                <span>-30%</span>
                <span>Base (R$ 2,4M)</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Slider 2: Variação na Taxa de Conveniência */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Taxa de Conveniência Disk</span>
                <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg ${simFee >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {simFee > 0 ? `+${simFee}%` : `${simFee}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="2"
                value={simFee}
                onChange={(e) => setSimFee(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                <span>-20%</span>
                <span>Base (~8.86%)</span>
                <span>+30%</span>
              </div>
            </div>

            {/* Slider 3: Despesas Corporativas */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Despesas Corporativas</span>
                <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg ${simExpenses <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {simExpenses > 0 ? `+${simExpenses}%` : `${simExpenses}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="5"
                value={simExpenses}
                onChange={(e) => setSimExpenses(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2"
              />
              <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                <span>-20%</span>
                <span>Base (R$ 145k)</span>
                <span>+40%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Calcular Projeção do Cenário</span>
            </button>
          </div>
        </div>

        {/* Resultados da Simulação */}
        {simResult && (
          <div className="bg-white rounded-3xl border border-indigo-200 p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-100">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-indigo-950">Resultados da Simulação Projetada</h3>
              </div>
              <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
                Margem Projetada: {simResult.impactoMargemPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase">GMV Total Projetado</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {formatCurrency(simResult.projecaoGmvTotal)}
                </div>
                <span className="text-xs text-slate-500 block mt-2">Custódia Produtores: {formatCurrency(simResult.projecaoCustodiaProdutores)}</span>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
                <span className="text-xs font-bold text-indigo-800 uppercase">Receita Própria Projetada</span>
                <div className="text-2xl font-black text-indigo-950 mt-1">
                  {formatCurrency(simResult.projecaoReceitaDisk)}
                </div>
                <span className="text-xs text-indigo-700 block mt-2">Taxas & Serviços Disk</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase">Despesas Projetadas</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {formatCurrency(simResult.projecaoDespesasDisk)}
                </div>
                <span className="text-xs text-slate-500 block mt-2">Custos fixos & operacionais</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Resultado Operacional</span>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {formatCurrency(simResult.projecaoResultadoOperacional)}
                </div>
                <span className="text-xs text-emerald-700 font-bold block mt-2">
                  {simResult.projecaoResultadoOperacional > 68450 ? '▲ Aumento de Rentabilidade' : '▼ Compressão de Margem'}
                </span>
              </div>
            </div>

            {/* Recomendações da IA */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                Diagnóstico & Parecer Estratégico da IA
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {simResult.recomendacoesIA.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // VIEW: ASSISTENTE INTELIGENTE KEEPER (COPILOT) EM TELA CHEIA
  // =========================================================================
  const renderCopilot = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs flex flex-col h-[750px]">
          <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Assistente Inteligente Keeper Copilot
                </h2>
                <p className="text-xs text-slate-500">
                  Consultas estratégicas em linguagem natural conectadas ao Data Warehouse da DiskIngressos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                Modo Auditável (Read-Only)
              </span>
              <button
                onClick={() => handleSelectSection('intel-exec-dashboard')}
                className="px-3 py-1 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="py-3 flex flex-wrap gap-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 self-center mr-1">Sugestões rápidas:</span>
            {[
              'Qual foi o GMV total de vendas?',
              'Qual a receita própria da Disk e margem?',
              'Quanto temos em custódia fiduciária de produtores?',
              'Quais eventos têm maior ocupação esta semana?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendCopilotQuery(chip)}
                className="text-xs px-3 py-1 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {copilotMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{msg.text}</p>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1.5 items-center">
                      <span className="font-bold">Fontes auditadas:</span>
                      {msg.sources.map((src, sIdx) => (
                        <span key={sIdx} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    EU
                  </div>
                )}
              </div>
            ))}

            {isCopilotThinking && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic">
                <Bot className="w-4 h-4 animate-spin text-purple-600" />
                <span>O Keeper Copilot está cruzando os dados analíticos...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
              placeholder="Digite sua pergunta gerencial sobre receitas, despesas, repasses ou eventos..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
            />
            <button
              onClick={() => handleSendCopilotQuery()}
              disabled={isCopilotThinking || !copilotQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW: PERFORMANCE DE EVENTOS & OCUPAÇÃO EM TELA CHEIA
  // =========================================================================
  const renderEventosPerformance = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-indigo-600" />
                Performance de Eventos & Curva de Demanda
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Taxa de ocupação de setores, ingressos vendidos e receita própria de taxas gerada para a Disk
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showNotification('Relatório de performance exportado em PDF!')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportar PDF</span>
              </button>
              <button
                onClick={() => handleSelectSection('intel-exec-dashboard')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Dashboard</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Evento & Espaço</th>
                  <th className="py-3 px-4">Taxa de Ocupação</th>
                  <th className="py-3 px-4 text-right">Ingressos Vendidos</th>
                  <th className="py-3 px-4 text-right">Receita Taxas Disk</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {eventPerformances.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{evt.nome}</div>
                      <div className="text-[11px] text-slate-500">{evt.local}</div>
                    </td>
                    <td className="py-3.5 px-4 w-60">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${evt.ocupacao}%` }}
                            className={`h-full rounded-full ${
                              evt.ocupacao >= 90 ? 'bg-emerald-500' : evt.ocupacao >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <span className="font-black text-xs text-slate-800 w-12 text-right">
                          {evt.ocupacao}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs">
                      {evt.ingressosVendidos.toLocaleString('pt-BR')} un
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-xs text-indigo-700">
                      {formatCurrency(evt.receitaTaxasDisk)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW: GERENCIAL WATERFALL P&L EM TELA CHEIA
  // =========================================================================
  const renderGerencialWaterfall = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                DRE Gerencial Analítica — Conciliação Waterfall
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Demonstração passo a passo da segregação do GMV da bilheteria até a apuração do lucro operacional da Disk
              </p>
            </div>

            <button
              onClick={() => handleSelectSection('intel-exec-dashboard')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Dashboard</span>
            </button>
          </div>

          <div className="space-y-3.5 pt-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-100 flex items-center justify-between border border-slate-200">
              <div>
                <span className="text-sm font-bold text-slate-800">1. Vendas Totais da Plataforma (GMV de Bilheteria)</span>
                <span className="text-xs text-slate-500 block">Total transacionado nos canais Web, App e PDV</span>
              </div>
              <span className="font-mono text-base font-black text-slate-900">R$ 2.418.900,00</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 flex items-center justify-between border border-rose-200 ml-6">
              <div>
                <span className="text-sm font-bold text-rose-900">(-) Obrigações com Produtores (Custódia Fiduciária)</span>
                <span className="text-xs text-rose-700 block">Valores de ingressos pertencentes aos contratantes (Escrow)</span>
              </div>
              <span className="font-mono text-base font-black text-rose-700">- R$ 1.846.500,00</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 flex items-center justify-between border border-rose-200 ml-6">
              <div>
                <span className="text-sm font-bold text-rose-900">(-) Tarifas de Gateways & MDR Bancário de Repasse</span>
                <span className="text-xs text-rose-700 block">Custo financeiro de processamento de cartão e adquirentes</span>
              </div>
              <span className="font-mono text-base font-black text-rose-700">- R$ 358.080,00</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 flex items-center justify-between border border-indigo-200">
              <div>
                <span className="text-sm font-bold text-indigo-900">(=) Receita Operacional Própria DiskIngressos</span>
                <span className="text-xs text-indigo-700 block">Taxas de conveniência, spread de serviços e bilheteria</span>
              </div>
              <span className="font-mono text-base font-black text-indigo-950">R$ 214.320,00</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 flex items-center justify-between border border-amber-200 ml-6">
              <div>
                <span className="text-sm font-bold text-amber-900">(-) Impostos sobre Serviços (ISS, PIS, COFINS)</span>
                <span className="text-xs text-amber-700 block">Alíquota efetiva apurada de 8.65% sobre a receita própria</span>
              </div>
              <span className="font-mono text-base font-black text-amber-800">- R$ 18.538,68</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between border border-slate-200 ml-6">
              <div>
                <span className="text-sm font-bold text-slate-800">(-) Despesas Corporativas Administrativas & RH</span>
                <span className="text-xs text-slate-500 block">Folha corporativa, infraestrutura em nuvem e compras de suprimentos</span>
              </div>
              <span className="font-mono text-base font-black text-slate-700">- R$ 127.331,32</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-md">
              <div>
                <span className="text-base font-black block">(=) Resultado Líquido Operacional Disk</span>
                <span className="text-xs text-emerald-100">Margem líquida de 31.94% sobre a receita própria</span>
              </div>
              <span className="font-mono text-xl font-black">R$ 68.450,00</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW GENÉRICA PARA SUBMENUS ADICIONAIS COM RETORNO AO HUB
  // =========================================================================
  const renderGenericSubmenu = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                {React.createElement(currentSubmenu.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{currentSubmenu.label}</h2>
                <p className="text-xs text-slate-500">{currentSubmenu.group} · {currentSubmenu.purpose}</p>
              </div>
            </div>

            <button
              onClick={() => handleSelectSection('intel-exec-dashboard')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Dashboard</span>
            </button>
          </div>

          <div className="py-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Módulo Analítico Integrado</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Os dados de <strong>{currentSubmenu.label}</strong> estão conectados diretamente aos bancos transacionais do ERP Keeper sob política de leitura auditada e segregação patrimonial.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={() => showNotification(`Relatório de ${currentSubmenu.label} gerado com sucesso!`)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                Gerar Relatório Deste Submenu
              </button>
              <button
                onClick={() => handleSelectSection('intel-exec-dashboard')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Voltar ao Dashboard Geral
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL AMPLO, COM TIPOGRAFIA ESCURA E BANNER DE SEGREGAÇÃO */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>ERP KEEPER</span>
                <span>/</span>
                <span className="text-indigo-600">INTELIGÊNCIA ESTRATÉGICA</span>
                <span>/</span>
                <span className="text-slate-900">{currentSubmenu.label}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-3">
                <Brain className="w-8 h-8 text-indigo-600" />
                CENTRAL DE INTELIGÊNCIA EXECUTIVA & BI
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                DiskIngressos · Consolidação Estratégica, Modelagem Preditiva & Inteligência Artificial
              </p>
            </div>

            {/* Ações do Header */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-2 shadow-2xs"
                title="Atualizar dados analíticos"
              >
                <RefreshCw className={`w-4 h-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>

              <button
                onClick={() => handleSelectSection('intel-ai-simulador')}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center gap-2 shadow-2xs"
              >
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Simulador What-If</span>
              </button>

              <button
                onClick={() => handleSelectSection('intel-ai-assistente')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <Bot className="w-4 h-4" />
                <span>Assistente Copilot</span>
              </button>
            </div>
          </div>

          {/* BANNER MANDATÓRIO DE SEGREGAÇÃO PATRIMONIAL */}
          <div className="mt-5 p-4 bg-slate-900 text-slate-100 rounded-2xl flex items-start gap-3.5 text-xs border border-slate-800 shadow-xs">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-400">Regra de Ouro DiskIngressos:</strong> Os indicadores de vendas totais na plataforma (GMV: <strong>R$ 2,4 mi</strong>) e os recursos sob custódia dos produtores (<strong>R$ 1,8 mi</strong>) são rigorosamente segregados e <strong>NUNCA</strong> incorporados como receita corporativa da Disk. A receita própria da Disk é estritamente composta por taxas de conveniência, PDV e serviços (<strong>R$ 214 mil</strong>).
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO AMPLA E EXPANDIDA (SEM BARRA LATERAL QUE APERTE OS CARDS) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <main className="w-full">
          {sectionId === 'intel-exec-dashboard' && renderDashboardExecutivo()}
          {sectionId === 'intel-exec-gerencial' && renderGerencialWaterfall()}
          {sectionId === 'intel-ai-simulador' && renderSimulador()}
          {sectionId === 'intel-ai-assistente' && renderCopilot()}
          {sectionId === 'intel-evt-performance' && renderEventosPerformance()}
          {sectionId !== 'intel-exec-dashboard' &&
            sectionId !== 'intel-exec-gerencial' &&
            sectionId !== 'intel-ai-simulador' &&
            sectionId !== 'intel-ai-assistente' &&
            sectionId !== 'intel-evt-performance' &&
            renderGenericSubmenu()}
        </main>
      </div>
    </div>
  );
};
