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

export const InteligenciaModuleView: React.FC<Props> = ({
  activeSection = 'intel-exec-dashboard',
  onSelectSection,
}) => {
  const [sectionId, setSectionId] = useState<string>(activeSection);
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light');
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>('right');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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

  // Agrupamento dos 35 submenus
  const groupedSubmenus = useMemo(() => {
    const groups: Record<string, IntelSubmenuDef[]> = {};
    INTEL_SUBMENUS.forEach((sm) => {
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

  // ==========================================
  // SIDEBAR PROPORCIONAL & EXPANSÍVEL
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
        {/* Topo do Sidebar */}
        <div
          className={`p-4 border-b flex flex-col gap-3 ${
            isLight ? 'border-slate-100 bg-slate-50/70 rounded-t-2xl' : 'border-slate-800 bg-slate-950/40 rounded-t-2xl'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">Inteligência</span>
                <span className="text-[11px] opacity-75 font-medium">35 submenus · 7 grupos</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarSide(sidebarSide === 'right' ? 'left' : 'right')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400'
                }`}
                title={sidebarSide === 'right' ? 'Mover menu para a Esquerda' : 'Mover menu para a Direita'}
              >
                {sidebarSide === 'right' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setSidebarTheme(sidebarTheme === 'light' ? 'dark' : 'light')}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Alternar tema claro/escuro da barra lateral"
              >
                {sidebarTheme === 'light' ? 'Escuro' : 'Claro'}
              </button>
            </div>
          </div>

          {/* Busca de submenus */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-50" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Buscar entre os 35 submenus..."
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-400'
              }`}
            />
          </div>
        </div>

        {/* Lista rolável de grupos e itens */}
        <div className="p-2 overflow-y-auto flex-1 space-y-3 custom-scrollbar text-xs">
          {Object.entries(groupedSubmenus).map(([groupName, items]) => {
            const isCollapsed = collapsedGroups[groupName];
            return (
              <div key={groupName} className="space-y-1">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-semibold tracking-wide text-[11px] uppercase transition-colors ${
                    isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{groupName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {items.length}
                    </span>
                  </div>
                  {isCollapsed ? <ChevronRight className="w-3 h-3 opacity-60" /> : <ChevronDown className="w-3 h-3 opacity-60" />}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pl-1">
                    {items.map((item) => {
                      const isActive = item.id === sectionId;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSection(item.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1.8 rounded-lg transition-all group ${
                            isActive
                              ? isLight
                                ? 'bg-indigo-50 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-2xs'
                                : 'bg-indigo-950/70 text-indigo-200 font-bold border-l-3 border-indigo-400 shadow-2xs'
                              : isLight
                              ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                isActive
                                  ? isLight
                                    ? 'text-indigo-600'
                                    : 'text-indigo-400'
                                  : isLight
                                  ? 'text-slate-400 group-hover:text-slate-600'
                                  : 'text-slate-500 group-hover:text-slate-300'
                              }`}
                            />
                            <span className="truncate text-xs leading-snug">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
                                item.badgeColor || 'bg-slate-200 text-slate-700'
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

        {/* Rodapé da Sidebar */}
        <div
          className={`p-3 border-t text-[11px] flex items-center justify-between ${
            isLight ? 'border-slate-100 bg-slate-50/50 text-slate-500' : 'border-slate-800 bg-slate-950/40 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Motor IA Ativo</span>
          </div>
          <span className="font-mono text-[10px]">Keeper v2.4</span>
        </div>
      </aside>
    );
  };

  // ==========================================
  // VIEW: DASHBOARD EXECUTIVO PRINCIPAL
  // ==========================================
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
      <div className="space-y-6">
        {/* 1. OS 4 CARDS PRINCIPAIS EM CONFORMIDADE COM O PROTÓTIPO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Vendas na Plataforma (GMV) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendas na plataforma</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                +12.5% MoM
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                R$ 2,4 mi
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                {formatCurrency(kpis.vendasPlataforma)}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{kpis.totalIngressos.toLocaleString('pt-BR')} ingressos emitidos</span>
              <span className="font-semibold text-slate-700">42 eventos</span>
            </div>
            <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium flex items-center gap-1">
              <Lock className="w-3 h-3 shrink-0" />
              <span>Custódia fiduciária de produtores</span>
            </div>
          </div>

          {/* Card 2: Receita própria Disk */}
          <div className="bg-white rounded-2xl border border-indigo-200/90 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-white via-indigo-50/20 to-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Receita própria Disk</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                +9.9% MoM
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
                R$ 214 mil
              </div>
              <div className="text-xs font-mono text-indigo-700 mt-0.5">
                {formatCurrency(kpis.receitaPropriaDisk)}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-indigo-800">
              <span>Taxas de conveniência & PDV</span>
              <span className="font-semibold">MDR & Serviços</span>
            </div>
            <div className="mt-2 text-[10px] text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 shrink-0 text-indigo-600" />
              <span>Receita líquida societária Disk</span>
            </div>
          </div>

          {/* Card 3: Obrigações com produtores */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Obrigações com produtores</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                Conta Escrow
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                R$ 1,8 mi
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                {formatCurrency(kpis.obrigacoesProdutores)}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>28 produtores ativos</span>
              <span className="font-semibold text-slate-700">Pico 15/10: R$ 420k</span>
            </div>
            <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 shrink-0 text-rose-600" />
              <span>Segregação patrimonial ativa</span>
            </div>
          </div>

          {/* Card 4: Resultado operacional */}
          <div className="bg-white rounded-2xl border border-emerald-200/90 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-white via-emerald-50/20 to-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Resultado operacional</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Margem 31.9%
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
                R$ 68 mil
              </div>
              <div className="text-xs font-mono text-emerald-700 mt-0.5">
                {formatCurrency(kpis.resultadoOperacional)}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
              <span>Despesas: R$ 145,8 mil</span>
              <span className="font-semibold text-emerald-900">+14.2% MoM</span>
            </div>
            <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 shrink-0 text-emerald-600" />
              <span>Superávit corporativo líquido</span>
            </div>
          </div>
        </div>

        {/* 2. EVOLUÇÃO MENSAL ILUSTRATIVA (MAI A SET) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                Evolução mensal ilustrativa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativo histórico: Receita própria Disk vs. Despesas Disk corporativas
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                <span>Receita própria Disk</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
                <span>Despesas Disk</span>
              </div>
            </div>
          </div>

          {/* Gráfico de barras comparativas */}
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-64 border-b border-slate-200 px-2">
              {monthly.map((m) => {
                const maxVal = 240000;
                const recHeightPercent = Math.min(100, Math.round((m.receitaPropria / maxVal) * 100));
                const expHeightPercent = Math.min(100, Math.round((m.despesasDisk / maxVal) * 100));

                return (
                  <div key={m.mes} className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2.5 w-full justify-center h-full pb-2">
                      {/* Barra Receita Própria */}
                      <div className="flex flex-col items-center w-5 sm:w-10">
                        <span className="text-[10px] font-semibold text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                          {formatCurrency(m.receitaPropria)}
                        </span>
                        <div
                          style={{ height: `${recHeightPercent}%` }}
                          className="w-full bg-indigo-600 rounded-t-md shadow-2xs group-hover:bg-indigo-700 transition-all cursor-pointer"
                          title={`Receita própria Disk (${m.mes}): ${formatCurrency(m.receitaPropria)}`}
                        />
                      </div>

                      {/* Barra Despesas */}
                      <div className="flex flex-col items-center w-5 sm:w-10">
                        <span className="text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                          {formatCurrency(m.despesasDisk)}
                        </span>
                        <div
                          style={{ height: `${expHeightPercent}%` }}
                          className="w-full bg-slate-300 rounded-t-md shadow-2xs group-hover:bg-slate-400 transition-all cursor-pointer"
                          title={`Despesas Disk (${m.mes}): ${formatCurrency(m.despesasDisk)}`}
                        />
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-xs font-bold text-slate-800">{m.mes}</span>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        +{formatCurrency(m.resultado)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Escala de referência */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 px-2 font-mono">
              <span>R$ 80 mil</span>
              <span>R$ 120 mil</span>
              <span>R$ 160 mil</span>
              <span>R$ 200 mil</span>
              <span>R$ 240 mil</span>
            </div>

            <div className="mt-3 text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>* Números consolidados auditáveis através dos módulos Contábil e Financeiro da DiskIngressos.</span>
              <button
                onClick={() => handleSelectSection('intel-exec-gerencial')}
                className="text-indigo-600 hover:text-indigo-800 font-bold not-italic flex items-center gap-1"
              >
                <span>Ver DRE Waterfall</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. ANÁLISES INTELIGENTES & ALERTAS PROATIVOS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Análises inteligentes & detecção proativa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nesta área, o Keeper apresenta alertas sobre variações de receitas, riscos de liquidez, despesas e tendências detectadas nos dados reais.
              </p>
            </div>

            {/* Filtros de severidade */}
            <div className="flex items-center gap-1.5">
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {filteredAlerts.map((alert) => {
              const isCritico = alert.severidade === 'critico';
              const isAlerta = alert.severidade === 'alerta';
              const isAtencao = alert.severidade === 'atencao';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCritico
                      ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                      : isAlerta
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                      : isAtencao
                      ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                      : 'bg-indigo-50/40 border-indigo-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                    <span className="text-[11px] text-slate-600 font-mono">{alert.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{alert.titulo}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.descricao}</p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Confiança IA: <strong>{alert.confiancaPercent}%</strong></span>
                    </div>

                    <button
                      onClick={() => showNotification(`Ação iniciada para o alerta: ${alert.titulo}`)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors"
                    >
                      Auditar / Agir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. MOTOR DE INTELIGÊNCIA KEEPER — CONEXÃO MULTI-DEPARTAMENTAL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Conexão com os demais módulos do ERP Keeper
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              O motor de inteligência consolida pipelines de leitura em tempo real sem alterar diretamente os registros de origem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {(dashboardData?.conexoesModulos || []).map((conn) => (
              <div
                key={conn.modulo}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{conn.modulo}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{conn.descricao}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-mono text-indigo-700 font-semibold">
                  {conn.metricaChave}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-indigo-900 text-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <span className="font-bold text-white block">MOTOR DE INTELIGÊNCIA KEEPER</span>
                <span className="text-indigo-200 text-[11px]">Consolidação, cruzamento, modelos preditivos e recomendações supervisionadas</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSelectSection('intel-ai-simulador')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulador What-If</span>
              </button>
              <button
                onClick={() => handleSelectSection('intel-ai-assistente')}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Abrir Copilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. DESDOBRAMENTO DE CANAIS DE RECEITA PRÓPRIA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Composição da receita própria DiskIngressos (Setembro/2026)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Origem dos R$ 214.320,00 faturados por taxas e prestação de serviços tecnológicos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {(dashboardData?.distribuicaoReceitas || []).map((canal) => (
              <div key={canal.canal} className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-600 block h-8 leading-snug">
                  {canal.canal}
                </span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(canal.valor)}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-bold text-indigo-700">{canal.percentual}% do total</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {canal.variacaoMoM}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: SIMULADOR DE CENÁRIOS (WHAT-IF)
  // ==========================================
  const renderSimulador = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Simulador de Cenários Preditivos (What-If)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ajuste as variáveis de volume de ingressos (GMV), taxa de conveniência média e despesas corporativas para projetar o impacto no resultado operacional.
            </p>
          </div>

          {/* Painel de Parâmetros com Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-4">
            {/* Slider 1: Variação de GMV */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Volume de Vendas (GMV)</span>
                <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${simGmv >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
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
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>-30%</span>
                <span>Base (R$ 2,4M)</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Slider 2: Variação na Taxa de Conveniência */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Taxa de Conveniência Disk</span>
                <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${simFee >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
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
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>-20%</span>
                <span>Base (~8.86%)</span>
                <span>+30%</span>
              </div>
            </div>

            {/* Slider 3: Despesas Corporativas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Despesas Corporativas</span>
                <span className={`font-mono font-extrabold px-2 py-0.5 rounded ${simExpenses <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
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
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Calcular Projeção do Cenário</span>
            </button>
          </div>
        </div>

        {/* Resultados da Simulação */}
        {simResult && (
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-indigo-950">Resultados da Simulação Projetada</h3>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Margem Projetada: {simResult.impactoMargemPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">GMV Total Projetado</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(simResult.projecaoGmvTotal)}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Custódia Produtores: {formatCurrency(simResult.projecaoCustodiaProdutores)}</span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-[11px] font-semibold text-indigo-700 uppercase">Receita Própria Projetada</span>
                <div className="text-xl font-bold text-indigo-950 mt-1">
                  {formatCurrency(simResult.projecaoReceitaDisk)}
                </div>
                <span className="text-[10px] text-indigo-600 block mt-1">Taxas & Serviços Disk</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Despesas Projetadas</span>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(simResult.projecaoDespesasDisk)}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Custos fixos & variáveis</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase">Resultado Operacional</span>
                <div className="text-xl font-bold text-emerald-950 mt-1">
                  {formatCurrency(simResult.projecaoResultadoOperacional)}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                  {simResult.projecaoResultadoOperacional > 68450 ? '▲ Aumento de Lucro' : '▼ Compressão de Margem'}
                </span>
              </div>
            </div>

            {/* Recomendações da IA */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" />
                Diagnóstico & Parecer Estratégico da IA
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {simResult.recomendacoesIA.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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

  // ==========================================
  // VIEW: ASSISTENTE INTELIGENTE KEEPER (COPILOT)
  // ==========================================
  const renderCopilot = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col h-[700px]">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Assistente Inteligente Keeper Copilot
                </h2>
                <p className="text-xs text-slate-500">
                  Consultas estratégicas em linguagem natural conectadas ao Data Warehouse da DiskIngressos
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Modo Auditável (Read-Only)
            </span>
          </div>

          {/* Quick Prompts Chips */}
          <div className="py-3 flex flex-wrap gap-2 border-b border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 self-center mr-1">Sugestões rápidas:</span>
            {[
              'Qual foi o GMV total de vendas?',
              'Qual a receita própria da Disk e margem?',
              'Quanto temos em custódia fiduciária de produtores?',
              'Quais eventos têm maior ocupação esta semana?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendCopilotQuery(chip)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"
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
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1 items-center">
                      <span className="font-semibold">Fontes auditadas:</span>
                      {msg.sources.map((src, sIdx) => (
                        <span key={sIdx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
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
          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
              placeholder="Digite sua pergunta gerencial sobre receitas, despesas, repasses ou eventos..."
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
            />
            <button
              onClick={() => handleSendCopilotQuery()}
              disabled={isCopilotThinking || !copilotQuery.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW: PERFORMANCE DE EVENTOS & OCUPAÇÃO
  // ==========================================
  const renderEventosPerformance = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Performance de Eventos & Curva de Demanda
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Taxa de ocupação de setores, ingressos vendidos e receita própria de taxas gerada para a Disk
              </p>
            </div>

            <button
              onClick={() => showNotification('Relatório de performance de eventos exportado em PDF!')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 self-start"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Evento & Espaço</th>
                  <th className="py-2.5 px-3">Ocupação</th>
                  <th className="py-2.5 px-3 text-right">Ingressos Vendidos</th>
                  <th className="py-2.5 px-3 text-right">Receita Taxas Disk</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {eventPerformances.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{evt.nome}</div>
                      <div className="text-[11px] text-slate-500">{evt.local}</div>
                    </td>
                    <td className="py-3 px-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${evt.ocupacao}%` }}
                            className={`h-full rounded-full ${
                              evt.ocupacao >= 90 ? 'bg-emerald-500' : evt.ocupacao >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-slate-800 w-10 text-right">
                          {evt.ocupacao}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      {evt.ingressosVendidos.toLocaleString('pt-BR')} un
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700">
                      {formatCurrency(evt.receitaTaxasDisk)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
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

  // ==========================================
  // VIEW: GERENCIAL WATERFALL P&L
  // ==========================================
  const renderGerencialWaterfall = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              DRE Gerencial Analítica — Conciliação Waterfall
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstração passo a passo da segregação do GMV da bilheteria até a apuração do lucro operacional da Disk
            </p>
          </div>

          <div className="space-y-3 pt-6 max-w-3xl">
            <div className="p-3.5 rounded-xl bg-slate-100 flex items-center justify-between border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800">1. Vendas Totais da Plataforma (GMV de Bilheteria)</span>
                <span className="text-[11px] text-slate-500 block">Total transacionado nos canais Web, App e PDV</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-slate-900">R$ 2.418.900,00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 flex items-center justify-between border border-rose-200 ml-4">
              <div>
                <span className="text-xs font-bold text-rose-900">(-) Obrigações com Produtores (Custódia Fiduciária)</span>
                <span className="text-[11px] text-rose-700 block">Valores de ingressos pertencentes aos contratantes (Escrow)</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-rose-700">- R$ 1.846.500,00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 flex items-center justify-between border border-rose-200 ml-4">
              <div>
                <span className="text-xs font-bold text-rose-900">(-) Tarifas de Gateways & MDR Bancário de Repasse</span>
                <span className="text-[11px] text-rose-700 block">Custo financeiro de processamento de cartão e adquirentes</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-rose-700">- R$ 358.080,00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 flex items-center justify-between border border-indigo-200">
              <div>
                <span className="text-xs font-bold text-indigo-900">(=) Receita Operacional Própria DiskIngressos</span>
                <span className="text-[11px] text-indigo-700 block">Taxas de conveniência, spread de serviços e bilheteria</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-indigo-950">R$ 214.320,00</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 flex items-center justify-between border border-amber-200 ml-4">
              <div>
                <span className="text-xs font-bold text-amber-900">(-) Impostos sobre Serviços (ISS, PIS, COFINS)</span>
                <span className="text-[11px] text-amber-700 block">Alíquota efetiva apurada de 8.65% sobre a receita própria</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-amber-800">- R$ 18.538,68</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200 ml-4">
              <div>
                <span className="text-xs font-bold text-slate-800">(-) Despesas Corporativas Administrativas & RH</span>
                <span className="text-[11px] text-slate-500 block">Folha de pagamento corporativa, infraestrutura em nuvem e compras</span>
              </div>
              <span className="font-mono text-sm font-extrabold text-slate-700">- R$ 127.331,32</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-sm font-extrabold block">(=) Resultado Líquido Operacional Disk</span>
                <span className="text-xs text-emerald-100">Margem líquida de 31.94% sobre a receita própria</span>
              </div>
              <span className="font-mono text-lg font-black">R$ 68.450,00</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW GENÉRICA PARA SUBMENUS ADICIONAIS
  // ==========================================
  const renderGenericSubmenu = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                {React.createElement(currentSubmenu.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">{currentSubmenu.label}</h2>
                <p className="text-xs text-slate-500">{currentSubmenu.group} · {currentSubmenu.purpose}</p>
              </div>
            </div>

            {currentSubmenu.badge && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${currentSubmenu.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                {currentSubmenu.badge}
              </span>
            )}
          </div>

          <div className="py-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Módulo Analítico Integrado</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Os dados de <strong>{currentSubmenu.label}</strong> estão conectados diretamente aos bancos transacionais do ERP Keeper sob política de leitura auditada e segregação patrimonial.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => showNotification(`Relatório de ${currentSubmenu.label} gerado com sucesso!`)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
              >
                Gerar Relatório Deste Submenu
              </button>
              <button
                onClick={() => handleSelectSection('intel-exec-dashboard')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Voltar ao Dashboard
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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL COM LETRAS ESCURAS, ALTO CONTRASTE E BANNER DE SEGREGAÇÃO */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>ERP KEEPER</span>
                <span>/</span>
                <span className="text-indigo-600 font-bold">MÓDULO INTELIGÊNCIA</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">{currentSubmenu.label}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-indigo-600" />
                CENTRAL DE INTELIGÊNCIA ESTRATÉGICA & BI
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                DiskIngressos · Cruzamento Corporativo, Modelagem Preditiva & Inteligência Artificial
              </p>
            </div>

            {/* Ações do Header */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Atualizar dados analíticos"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>

              <button
                onClick={() => handleSelectSection('intel-ai-simulador')}
                className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulador What-If</span>
              </button>

              <button
                onClick={() => handleSelectSection('intel-ai-assistente')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Assistente Copilot</span>
              </button>
            </div>
          </div>

          {/* BANNER MANDATÓRIO DE SEGREGAÇÃO PATRIMONIAL */}
          <div className="mt-4 p-3.5 bg-slate-900 text-slate-100 rounded-xl flex items-start gap-3 text-xs border border-slate-800 shadow-xs">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-400">Regra de Ouro DiskIngressos:</strong> Os indicadores de vendas na plataforma (GMV: <strong>R$ 2,4 mi</strong>) e saldos em custódia fiduciária dos produtores (<strong>R$ 1,8 mi</strong>) são rigorosamente segregados e <strong>NUNCA</strong> incorporados como receita corporativa da Disk. A receita própria da Disk é estritamente composta por taxas de conveniência, PDV e serviços (<strong>R$ 214 mil</strong>).
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL COM LAYOUT FLEXÍVEL & BARRA LATERAL PROPORCIONAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Barra Lateral posicionada à Esquerda se selecionada */}
          {sidebarSide === 'left' && renderSidebar()}

          {/* Área Central de Conteúdo */}
          <main className="flex-1 w-full min-w-0">
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

          {/* Barra Lateral posicionada à Direita (Padrão) */}
          {sidebarSide === 'right' && renderSidebar()}
        </div>
      </div>
    </div>
  );
};
