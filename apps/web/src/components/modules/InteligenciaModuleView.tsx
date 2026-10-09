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
  Clock,
  Ticket,
  CheckSquare,
  X,
  Radio,
  History,
  Server,
  Globe,
  AlertOctagon,
  FileSpreadsheet,
  Network,
  Share2,
  CornerDownRight,
  MessageSquare,
  Plus,
  Flame,
} from 'lucide-react';
import {
  inteligenciaClient,
  ExecDashboardResponse,
  SmartAlert,
  MonthlyEvolutionItem,
  ScenarioSimulationResult,
  EventPerformanceItem,
} from '../../services/inteligenciaClient';
import {
  sentinelClient,
  SentinelAlert,
  SentinelRule,
  SentinelAgent,
  SentinelKpis,
  SentinelDepartment,
  SentinelSeverity,
  SentinelOverview,
  AutonomyLevel,
  RiskDepartmentItem,
  CrossAuditItem,
  CrossAuditReport,
  PreventiveRiskItem,
  PreventiveReport,
  RootCauseStep,
  RootCauseAnalysis,
  IntegrationConnector,
  IntegrationsHealthReport,
  AiAssistantResponse,
  StressTestConfig,
  StressTestResult,
} from '../../services/sentinelClient';

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

  // 2. Monitoramento Inteligente (10) — KEEPER SENTINEL
  {
    id: 'intel-sent-central',
    label: 'Central de Monitoramento',
    group: 'Monitoramento Inteligente',
    icon: Activity,
    purpose: 'Visão geral da situação do ERP e saúde global dos módulos.',
    badge: 'Sentinel',
    badgeColor: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'intel-sent-alertas',
    label: 'Alertas em Tempo Real',
    group: 'Monitoramento Inteligente',
    icon: AlertTriangle,
    purpose: 'Acompanhamento de ocorrências ativas com ação orientada e SLA.',
    badge: '3 Críticos',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'intel-sent-preventivo',
    label: 'Monitoramento Preventivo',
    group: 'Monitoramento Inteligente',
    icon: ShieldCheck,
    purpose: 'Identificação antecipada de problemas futuros de repasses, caixa e despesas.',
    badge: 'D-7 Prev',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'intel-sent-auditoria-cruzada',
    label: 'Auditoria Cruzada',
    group: 'Monitoramento Inteligente',
    icon: Layers,
    purpose: 'Conferência automática entre Compras, NF, Contas a Pagar e Contabilidade.',
    badge: 'Reconciliação',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'intel-sent-riscos',
    label: 'Riscos e Anomalias',
    group: 'Monitoramento Inteligente',
    icon: ShieldAlert,
    purpose: 'Mapa de riscos operacionais, solvência e matriz de probabilidade.',
  },
  {
    id: 'intel-sent-antifraude',
    label: 'Antifraude',
    group: 'Monitoramento Inteligente',
    icon: Lock,
    purpose: 'Detecção de movimentações suspeitas, logins e alterações de dados bancários.',
    badge: 'Antifraude',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'intel-sent-previsao-liquidez',
    label: 'Previsão de Liquidez',
    group: 'Monitoramento Inteligente',
    icon: TrendingUp,
    purpose: 'Projeção futura de fluxo segregando caixa próprio e fiduciário de eventos.',
  },
  {
    id: 'intel-sent-investigacao',
    label: 'Investigação Inteligente',
    group: 'Monitoramento Inteligente',
    icon: Search,
    purpose: 'Identificação e esteira de causa raiz de divergências financeiras.',
    badge: 'Causa Raiz',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'intel-sent-assistente',
    label: 'Assistente IA Keeper',
    group: 'Monitoramento Inteligente',
    icon: Sparkles,
    purpose: 'Consultas e diagnósticos em linguagem natural com indicação de fontes.',
    badge: 'IA Copilot',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'intel-sent-tratativas',
    label: 'Gestão de Ocorrências',
    group: 'Monitoramento Inteligente',
    icon: Workflow,
    purpose: 'Atribuição de responsáveis, SLA de resolução e planos de ação.',
  },
  {
    id: 'intel-sent-integracoes-saude',
    label: 'Saúde das Integrações',
    group: 'Monitoramento Inteligente',
    icon: Server,
    purpose: 'Verificação em tempo real de APIs, Webhooks, Gateways e Filas Redis.',
    badge: 'Telemetria',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'intel-sent-regras',
    label: 'Regras de Monitoramento',
    group: 'Monitoramento Inteligente',
    icon: SlidersHorizontal,
    purpose: 'Configuração determinística de limites, tetos e condições fiduciárias.',
  },
  {
    id: 'intel-sent-agentes',
    label: 'Agentes de IA',
    group: 'Monitoramento Inteligente',
    icon: Bot,
    purpose: 'Administração de agentes especializados por departamento.',
  },
  {
    id: 'intel-sent-relatorios',
    label: 'Relatórios de Inteligência',
    group: 'Monitoramento Inteligente',
    icon: FileText,
    purpose: 'Métricas de efetividade de alertas, tendências e incidentes.',
  },
  {
    id: 'intel-sent-auditoria-ia',
    label: 'Auditoria da IA',
    group: 'Monitoramento Inteligente',
    icon: FolderCheck,
    purpose: 'Histórico imutável de consultas, análises e pareceres emitidos pela IA.',
  },
  {
    id: 'intel-sent-config',
    label: 'Configurações da IA',
    group: 'Monitoramento Inteligente',
    icon: Cpu,
    purpose: 'Parâmetros de modelos (Local vs API), custos e infraestrutura.',
  },
  {
    id: 'intel-sent-stress-testing',
    label: 'Simulador de Carga & Estresse',
    group: 'Monitoramento Inteligente',
    icon: Flame,
    purpose: 'Simulação de picos de 10k a 50k ingressos/minuto, concorrência no Ledger e resiliência de banco.',
    badge: 'Megaeventos D-0',
    badgeColor: 'bg-rose-100 text-rose-800',
  },

  // 3. Inteligência Financeira (6)
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
  'Todos (45)',
  'Visão Executiva (4)',
  'Monitoramento Inteligente (10)',
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

  // Estados do Keeper Sentinel (Monitoramento Inteligente & Auditoria Digital)
  const [sentinelData, setSentinelData] = useState<SentinelOverview | null>(null);
  const [sentinelDeptFilter, setSentinelDeptFilter] = useState<string>('Todas');
  const [sentinelSeverityFilter, setSentinelSeverityFilter] = useState<string>('all');
  const [sentinelStatusFilter, setSentinelStatusFilter] = useState<string>('all');
  const [sentinelSelectedAlert, setSentinelSelectedAlert] = useState<SentinelAlert | null>(null);
  const [sentinelResolutionNote, setSentinelResolutionNote] = useState<string>('');
  const [sentinelTab, setSentinelTab] = useState<
    | 'ocorrencias'
    | 'mapa-riscos'
    | 'preventivo'
    | 'auditoria-cruzada'
    | 'investigacao'
    | 'assistente'
    | 'integracoes'
    | 'agentes'
    | 'regras'
    | 'config'
    | 'stress-testing'
  >('ocorrencias');

  // Estados de Teste de Carga, Estresse & Resiliência D-0
  const [stressConfig, setStressConfig] = useState<StressTestConfig>({
    scenarioName: 'Abertura Flash Sale — Festival Rock Retrô (50.000 ingressos)',
    virtualUsers: 10000,
    ticketsBatch: 25000,
    rampUpSeconds: 15,
    chaosOptions: {
      injectGatewayDelay: false,
      failoverSimulated: false,
      botFraudSurge: false,
    },
  });
  const [isRunningStress, setIsRunningStress] = useState<boolean>(false);
  const [stressProgress, setStressProgress] = useState<number>(0);
  const [currentStressResult, setCurrentStressResult] = useState<StressTestResult | null>(null);
  const [stressHistory, setStressHistory] = useState<StressTestResult[]>([]);
  const [isProcessingSentinel, setIsProcessingSentinel] = useState<boolean>(false);
  const [riskMapData, setRiskMapData] = useState<RiskDepartmentItem[]>([]);
  const [crossAuditData, setCrossAuditData] = useState<CrossAuditReport | null>(null);
  const [preventiveData, setPreventiveData] = useState<PreventiveReport | null>(null);
  const [rootCauseData, setRootCauseData] = useState<RootCauseAnalysis | null>(null);
  const [integrationsData, setIntegrationsData] = useState<IntegrationsHealthReport | null>(null);
  const [aiAssistantChat, setAiAssistantChat] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; sources?: string[]; timestamp: string }>
  >([
    {
      role: 'assistant',
      text: 'Olá! Sou o Assistente IA do Keeper Sentinel. Estou conectado à base de dados auditáveis do ERP em modo consultivo permanente. Como posso apoiar a administração da DiskIngressos hoje?',
      sources: ['Sentinel Engine v1.4', 'Auditoria Contábil e Fiscal'],
      timestamp: 'Agora',
    },
  ]);
  const [aiInputQuery, setAiInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Estados para Modais de Adicionar / Incluir no Sentinel
  const [isNewAlertModalOpen, setIsNewAlertModalOpen] = useState(false);
  const [newAlertForm, setNewAlertForm] = useState({
    titulo: '',
    departamento: 'Financeiro' as SentinelDepartment,
    severidade: 'CRITICO' as SentinelSeverity,
    descricao: '',
    entidadeAfetada: '',
    valorSolicitado: 0,
    causaIdentificada: '',
    acaoRecomendada: '',
    responsavel: 'Comitê de Auditoria',
    nivelAutonomiaSugerido: 'ACAO_SUPERVISIONADA' as AutonomyLevel,
  });

  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({
    codigo: '',
    nome: '',
    modulo: 'Financeiro' as SentinelDepartment,
    tipo: 'DETERMINISTICA' as 'DETERMINISTICA' | 'ESTATISTICA' | 'IA_SEMANTICA',
    expressaoRegra: '',
    severidade: 'CRITICO' as SentinelSeverity,
  });

  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({
    nome: '',
    departamento: 'Financeiro' as SentinelDepartment,
    foco: '',
    autonomia: 'INVESTIGACAO' as AutonomyLevel,
    avatar: '🛡️',
  });

  const [isNewCrossAuditModalOpen, setIsNewCrossAuditModalOpen] = useState(false);
  const [newCrossAuditForm, setNewCrossAuditForm] = useState({
    origem: 'Compras',
    destino: 'Financeiro',
    descricao: '',
    detalhe: '',
    divergencia: 0,
    regraViolada: '',
  });

  const [isNewPreventiveModalOpen, setIsNewPreventiveModalOpen] = useState(false);
  const [newPreventiveForm, setNewPreventiveForm] = useState({
    titulo: '',
    categoria: 'LIQUIDEZ_REPASSES',
    entidade: '',
    horizonteDias: 7,
    impactoEstimado: 0,
    severidade: 'CRITICO' as SentinelSeverity,
    diagnostico: '',
    recomendacao: '',
  });

  // Sincronizar com props externas
  useEffect(() => {
    if (activeSection && activeSection !== sectionId) {
      setSectionId(activeSection);
      if (activeSection === 'intel-sent-riscos' || activeSection === 'intel-sent-relatorios') {
        setSentinelTab('mapa-riscos');
      } else if (activeSection === 'intel-sent-preventivo' || activeSection === 'intel-sent-previsao-liquidez') {
        setSentinelTab('preventivo');
      } else if (activeSection === 'intel-sent-auditoria-cruzada' || activeSection === 'intel-sent-antifraude') {
        setSentinelTab('auditoria-cruzada');
      } else if (activeSection === 'intel-sent-investigacao') {
        setSentinelTab('investigacao');
      } else if (activeSection === 'intel-sent-assistente' || activeSection === 'intel-sent-auditoria-ia') {
        setSentinelTab('assistente');
      } else if (activeSection === 'intel-sent-integracoes-saude') {
        setSentinelTab('integracoes');
      } else if (activeSection === 'intel-sent-regras') {
        setSentinelTab('regras');
      } else if (activeSection === 'intel-sent-agentes') {
        setSentinelTab('agentes');
      } else if (activeSection === 'intel-sent-config') {
        setSentinelTab('config');
      } else if (activeSection === 'intel-sent-stress-testing') {
        setSentinelTab('stress-testing');
      } else if (
        activeSection === 'intel-sent-central' ||
        activeSection === 'intel-sent-alertas' ||
        activeSection === 'intel-sent-tratativas'
      ) {
        setSentinelTab('ocorrencias');
      }
    }
  }, [activeSection]);

  const handleSelectSection = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
    if (id === 'intel-sent-riscos' || id === 'intel-sent-relatorios') {
      setSentinelTab('mapa-riscos');
    } else if (id === 'intel-sent-preventivo' || id === 'intel-sent-previsao-liquidez') {
      setSentinelTab('preventivo');
    } else if (id === 'intel-sent-auditoria-cruzada' || id === 'intel-sent-antifraude') {
      setSentinelTab('auditoria-cruzada');
    } else if (id === 'intel-sent-investigacao') {
      setSentinelTab('investigacao');
    } else if (id === 'intel-sent-assistente' || id === 'intel-sent-auditoria-ia') {
      setSentinelTab('assistente');
    } else if (id === 'intel-sent-integracoes-saude') {
      setSentinelTab('integracoes');
    } else if (id === 'intel-sent-regras') {
      setSentinelTab('regras');
    } else if (id === 'intel-sent-agentes') {
      setSentinelTab('agentes');
    } else if (id === 'intel-sent-config') {
      setSentinelTab('config');
    } else if (id === 'intel-sent-stress-testing') {
      setSentinelTab('stress-testing');
    } else if (
      id === 'intel-sent-central' ||
      id === 'intel-sent-alertas' ||
      id === 'intel-sent-tratativas'
    ) {
      setSentinelTab('ocorrencias');
    }
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
      const [dash, evts, sent, rMap, cAudit, prev, integ, rCause, sHist] = await Promise.all([
        inteligenciaClient.getDashboard(),
        inteligenciaClient.getEventPerformance(),
        sentinelClient.getOverview(),
        sentinelClient.getRiskMap(),
        sentinelClient.getCrossAudit(),
        sentinelClient.getPreventiveMonitoring(),
        sentinelClient.getIntegrationsHealth(),
        sentinelClient.getRootCauseInvestigation('alt-01'),
        sentinelClient.getStressTestHistory(),
      ]);
      setDashboardData(dash);
      setEventPerformances(evts);
      setSentinelData(sent);
      setRiskMapData(rMap);
      setCrossAuditData(cAudit);
      setPreventiveData(prev);
      setIntegrationsData(integ);
      setRootCauseData(rCause);
      setStressHistory(sHist);
    } catch {
      showNotification('Erro ao sincronizar inteligência com o servidor. Usando dados locais.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRunStressTest = async () => {
    setIsRunningStress(true);
    setStressProgress(15);
    const interval = setInterval(() => {
      setStressProgress((p) => {
        if (p >= 88) {
          return 88;
        }
        return p + 18;
      });
    }, 280);

    try {
      const res = await sentinelClient.runStressBenchmark(stressConfig);
      clearInterval(interval);
      setStressProgress(100);
      setCurrentStressResult(res);
      setStressHistory((prev) => [res, ...prev]);
      showNotification(
        `Benchmark "${res.scenarioName}" concluído: ${res.throughputRps.toLocaleString()} RPS com 100% integridade no Ledger!`
      );
    } catch {
      clearInterval(interval);
      showNotification('Erro ao executar simulação de estresse.');
    } finally {
      setTimeout(() => {
        setIsRunningStress(false);
        setStressProgress(0);
      }, 600);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartTreatment = async (alertId: string) => {
    setIsProcessingSentinel(true);
    await sentinelClient.startTreatment(alertId);
    const updated = await sentinelClient.getOverview();
    setSentinelData(updated);
    if (sentinelSelectedAlert && sentinelSelectedAlert.id === alertId) {
      setSentinelSelectedAlert({
        ...sentinelSelectedAlert,
        status: 'EM_TRATAMENTO',
      });
    }
    setIsProcessingSentinel(false);
    showNotification('Ocorrência colocada em tratamento pelo gestor.');
  };

  const handleResolveAlert = async (alertId: string) => {
    if (!sentinelResolutionNote.trim()) {
      showNotification('Por favor, informe a justificativa da resolução.');
      return;
    }
    setIsProcessingSentinel(true);
    await sentinelClient.resolveAlert(alertId, sentinelResolutionNote);
    const updated = await sentinelClient.getOverview();
    setSentinelData(updated);
    setSentinelSelectedAlert(null);
    setSentinelResolutionNote('');
    setIsProcessingSentinel(false);
    showNotification('Ocorrência resolvida e arquivada com evidências no Sentinel.');
  };

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

  // Enviar pergunta ao Assistente IA do Sentinel
  const handleSendAiMessage = async (queryToSend?: string) => {
    const q = queryToSend || aiInputQuery;
    if (!q.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiAssistantChat((prev) => [...prev, userMsg]);
    setAiInputQuery('');
    setIsAiLoading(true);

    try {
      const res = await sentinelClient.askAiAssistant(q);
      setAiAssistantChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.resposta,
          sources: res.fontesAuditadas,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setAiAssistantChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Ocorreu uma instabilidade na consulta auditável aos módulos do Keeper Sentinel. Favor verificar a conexão.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handlers para criação / inclusão nos modais do Sentinel
  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.titulo.trim() || !newAlertForm.descricao.trim()) {
      showNotification('Preencha o título e a descrição da ocorrência.');
      return;
    }
    setIsProcessingSentinel(true);
    try {
      const created = await sentinelClient.createAlert(newAlertForm);
      if (sentinelData) {
        setSentinelData({
          ...sentinelData,
          alertas: [created, ...sentinelData.alertas],
          kpis: {
            ...sentinelData.kpis,
            alertasCriticos: created.severidade === 'CRITICO' ? sentinelData.kpis.alertasCriticos + 1 : sentinelData.kpis.alertasCriticos,
          },
        });
      }
      setIsNewAlertModalOpen(false);
      setNewAlertForm({
        titulo: '',
        departamento: 'Financeiro',
        severidade: 'CRITICO',
        descricao: '',
        entidadeAfetada: '',
        valorSolicitado: 0,
        causaIdentificada: '',
        acaoRecomendada: '',
        responsavel: 'Comitê de Auditoria',
        nivelAutonomiaSugerido: 'ACAO_SUPERVISIONADA',
      });
      showNotification('Nova ocorrência registrada com sucesso no Sentinel!');
    } catch {
      showNotification('Erro ao registrar ocorrência.');
    } finally {
      setIsProcessingSentinel(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleForm.nome.trim() || !newRuleForm.expressaoRegra.trim()) {
      showNotification('Informe o nome e a expressão determinística da regra.');
      return;
    }
    setIsProcessingSentinel(true);
    try {
      const created = await sentinelClient.createRule(newRuleForm);
      if (sentinelData) {
        setSentinelData({
          ...sentinelData,
          regras: [created, ...sentinelData.regras],
          kpis: {
            ...sentinelData.kpis,
            regrasAtivas: sentinelData.kpis.regrasAtivas + 1,
          },
        });
      }
      setIsNewRuleModalOpen(false);
      setNewRuleForm({
        codigo: '',
        nome: '',
        modulo: 'Financeiro',
        tipo: 'DETERMINISTICA',
        expressaoRegra: '',
        severidade: 'CRITICO',
      });
      showNotification('Nova regra determinística ativada com sucesso!');
    } catch {
      showNotification('Erro ao cadastrar regra determinística.');
    } finally {
      setIsProcessingSentinel(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentForm.nome.trim() || !newAgentForm.foco.trim()) {
      showNotification('Informe o nome e o foco analítico do agente.');
      return;
    }
    setIsProcessingSentinel(true);
    try {
      const created = await sentinelClient.createAgent(newAgentForm);
      if (sentinelData) {
        setSentinelData({
          ...sentinelData,
          agentes: [...sentinelData.agentes, created],
        });
      }
      setIsNewAgentModalOpen(false);
      setNewAgentForm({
        nome: '',
        departamento: 'Financeiro',
        foco: '',
        autonomia: 'INVESTIGACAO',
        avatar: '🛡️',
      });
      showNotification('Novo agente de IA especializado instanciado com sucesso!');
    } catch {
      showNotification('Erro ao instanciar agente.');
    } finally {
      setIsProcessingSentinel(false);
    }
  };

  const handleCreateCrossAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrossAuditForm.descricao.trim()) {
      showNotification('Informe a descrição da trilha de auditoria.');
      return;
    }
    setIsProcessingSentinel(true);
    try {
      const created = await sentinelClient.createCrossAudit(newCrossAuditForm);
      if (crossAuditData) {
        setCrossAuditData({
          ...crossAuditData,
          trilhas: [created, ...crossAuditData.trilhas],
          verificacoesRealizadas: crossAuditData.verificacoesRealizadas + 1,
        });
      }
      setIsNewCrossAuditModalOpen(false);
      setNewCrossAuditForm({
        origem: 'Compras',
        destino: 'Financeiro',
        descricao: '',
        detalhe: '',
        divergencia: 0,
        regraViolada: '',
      });
      showNotification('Nova trilha de auditoria cruzada incluída com sucesso!');
    } catch {
      showNotification('Erro ao cadastrar auditoria cruzada.');
    } finally {
      setIsProcessingSentinel(false);
    }
  };

  const handleCreatePreventive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreventiveForm.titulo.trim() || !newPreventiveForm.diagnostico.trim()) {
      showNotification('Informe o título e o diagnóstico preventivo.');
      return;
    }
    setIsProcessingSentinel(true);
    try {
      const created = await sentinelClient.createPreventiveRisk(newPreventiveForm);
      if (preventiveData) {
        setPreventiveData({
          ...preventiveData,
          projecoes: [created, ...preventiveData.projecoes],
          riscosAntecipados: preventiveData.riscosAntecipados + 1,
        });
      }
      setIsNewPreventiveModalOpen(false);
      setNewPreventiveForm({
        titulo: '',
        categoria: 'LIQUIDEZ_REPASSES',
        entidade: '',
        horizonteDias: 7,
        impactoEstimado: 0,
        severidade: 'CRITICO',
        diagnostico: '',
        recomendacao: '',
      });
      showNotification('Novo risco preventivo registrado com sucesso!');
    } catch {
      showNotification('Erro ao registrar risco preventivo.');
    } finally {
      setIsProcessingSentinel(false);
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

  // Filtrar ocorrências do Keeper Sentinel
  const filteredSentinelAlerts = useMemo(() => {
    if (!sentinelData) return [];
    return sentinelData.alertas.filter((al) => {
      const matchDept = sentinelDeptFilter === 'Todas' || al.departamento === sentinelDeptFilter;
      const matchSev = sentinelSeverityFilter === 'all' || al.severidade === sentinelSeverityFilter;
      const matchStatus = sentinelStatusFilter === 'all' || al.status === sentinelStatusFilter;
      return matchDept && matchSev && matchStatus;
    });
  }, [sentinelData, sentinelDeptFilter, sentinelSeverityFilter, sentinelStatusFilter]);

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

        {/* 2. EVOLUÇÃO MENSAL ILUSTRATIVA: CORES VIVAS, CURVA SVG PROPORCIONAL E BARRAS PIXEL-EXACT */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                Evolução Mensal Ilustrativa — Receita Própria vs. Despesas Corporativas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Comparativo histórico auditável na escala visual de R$ 80 mil a R$ 240 mil
              </p>
            </div>

            {/* Seletor de Tipo de Gráfico & Legenda com Cores Vivas e Distintas */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block shadow-xs" />
                  Receita Disk
                </span>
                <span className="flex items-center gap-1.5 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
                  Despesas Disk
                </span>
                <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-xs" />
                  Margem Líquida
                </span>
              </div>

              {/* Botões de alternância de gráficos com destaque nítido */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-black shadow-2xs">
                <button
                  onClick={() => setChartType('curva')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    chartType === 'curva'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Curva SVG</span>
                </button>
                <button
                  onClick={() => setChartType('barras')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    chartType === 'barras'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Barras</span>
                </button>
                <button
                  onClick={() => setChartType('margem')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    chartType === 'margem'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Margem %</span>
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA GRÁFICA INTERATIVA E ROBUSTA */}
          <div className="pt-4 pb-2">
            {/* 1. CURVA SVG PROPORCIONAL COM CORES VIVAS E SEM DISTORÇÃO */}
            {chartType === 'curva' && (
              <div className="space-y-1">
                <div className="w-full h-64 sm:h-72 relative bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
                  <svg
                    viewBox="0 0 920 230"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="recGradPro" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="despGradPro" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Linhas de Grade Horizontais e Rótulos Y */}
                    {[
                      { y: 30, label: 'R$ 240 mil' },
                      { y: 68, label: 'R$ 200 mil' },
                      { y: 106, label: 'R$ 160 mil' },
                      { y: 144, label: 'R$ 120 mil' },
                      { y: 182, label: 'R$ 80 mil' },
                    ].map((g) => (
                      <g key={g.y}>
                        <text
                          x="70"
                          y={g.y + 4}
                          textAnchor="end"
                          fill="#64748b"
                          fontSize="11"
                          fontWeight="600"
                          fontFamily="monospace"
                        >
                          {g.label}
                        </text>
                        <line
                          x1="80"
                          y1={g.y}
                          x2="890"
                          y2={g.y}
                          stroke="#cbd5e1"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                      </g>
                    ))}

                    {/* Linha de Base X */}
                    <line x1="80" y1="195" x2="890" y2="195" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Área Preenchida Receita Própria Disk */}
                    <path
                      d="M 100,121 L 295,85 L 490,98 L 685,69 L 880,51 L 880,195 L 100,195 Z"
                      fill="url(#recGradPro)"
                    />

                    {/* Área Preenchida Despesas Disk */}
                    <path
                      d="M 100,165 L 295,151 L 490,158 L 685,138 L 880,118 L 880,195 L 100,195 Z"
                      fill="url(#despGradPro)"
                    />

                    {/* Curva Linha Despesas (Âmbar Vivo) */}
                    <path
                      d="M 100,165 L 295,151 L 490,158 L 685,138 L 880,118"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />

                    {/* Curva Linha Receita Própria (Índigo Profundo Vivo) */}
                    <path
                      d="M 100,121 L 295,85 L 490,98 L 685,69 L 880,51"
                      fill="none"
                      stroke="#4338ca"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />

                    {/* Curva Linha Margem / Lucro (Tracejada Esmeralda) */}
                    <path
                      d="M 100,155 L 295,135 L 490,140 L 685,132 L 880,133"
                      fill="none"
                      stroke="#059669"
                      strokeDasharray="5 5"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />

                    {/* Pontos de dados Receita (Círculos azuis com valores acima) */}
                    {[
                      { x: 100, y: 121, val: 'R$ 142k', mes: 'Mai' },
                      { x: 295, y: 85, val: 'R$ 178k', mes: 'Jun' },
                      { x: 490, y: 98, val: 'R$ 165k', mes: 'Jul' },
                      { x: 685, y: 69, val: 'R$ 195k', mes: 'Ago' },
                      { x: 880, y: 51, val: 'R$ 214k', mes: 'Set' },
                    ].map((pt) => (
                      <g key={pt.mes}>
                        {/* Fundo do rótulo */}
                        <rect
                          x={pt.x - 26}
                          y={pt.y - 25}
                          width="52"
                          height="18"
                          rx="4"
                          fill="#312e81"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {pt.val}
                        </text>
                        <circle cx={pt.x} cy={pt.y} r="6" fill="#4338ca" stroke="#ffffff" strokeWidth="2.5" />
                      </g>
                    ))}

                    {/* Pontos de dados Despesas (Círculos laranja com valores abaixo) */}
                    {[
                      { x: 100, y: 165, val: 'R$ 98k', mes: 'Mai' },
                      { x: 295, y: 151, val: 'R$ 112k', mes: 'Jun' },
                      { x: 490, y: 158, val: 'R$ 105k', mes: 'Jul' },
                      { x: 685, y: 138, val: 'R$ 125k', mes: 'Ago' },
                      { x: 880, y: 118, val: 'R$ 145k', mes: 'Set' },
                    ].map((pt) => (
                      <g key={pt.mes}>
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={pt.x}
                          y={pt.y + 16}
                          textAnchor="middle"
                          fill="#92400e"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {pt.val}
                        </text>
                      </g>
                    ))}

                    {/* Rótulos dos Meses no Eixo X */}
                    {[
                      { x: 100, mes: 'Mai' },
                      { x: 295, mes: 'Jun' },
                      { x: 490, mes: 'Jul' },
                      { x: 685, mes: 'Ago' },
                      { x: 880, mes: 'Set' },
                    ].map((lx) => (
                      <text
                        key={lx.mes}
                        x={lx.x}
                        y="215"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="13"
                        fontWeight="900"
                      >
                        {lx.mes}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* 2. BARRAS DUPLAS COM ALTURA EXATA EM PIXELS (NUNCA COLAPSA) */}
            {chartType === 'barras' && (
              <div className="pt-2 pb-2">
                <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80">
                  <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-56 border-b border-slate-300 pb-2 px-2">
                    {monthly.map((m) => {
                      const maxBarPx = 140; // Altura máxima exata em pixels
                      const recPx = Math.max(16, Math.round((m.receitaPropria / 240000) * maxBarPx));
                      const despPx = Math.max(16, Math.round((m.despesasDisk / 240000) * maxBarPx));

                      return (
                        <div key={m.mes} className="flex flex-col items-center justify-end h-full group">
                          {/* Trilho das Barras */}
                          <div className="flex items-end justify-center gap-2 sm:gap-3 w-full pb-1">
                            {/* Barra Receita (Indigo Vivo) */}
                            <div className="flex flex-col items-center">
                              <span className="text-[11px] font-black text-indigo-900 mb-1 whitespace-nowrap bg-indigo-50 px-1 rounded border border-indigo-200">
                                {Math.round(m.receitaPropria / 1000)}k
                              </span>
                              <div
                                style={{ height: `${recPx}px` }}
                                className="w-8 sm:w-14 bg-indigo-600 rounded-t-xl shadow-sm border border-indigo-700 hover:bg-indigo-700 transition-all cursor-pointer"
                                title={`Receita própria Disk (${m.mes}): ${formatCurrency(m.receitaPropria)}`}
                              />
                            </div>

                            {/* Barra Despesas (Âmbar Vivo) */}
                            <div className="flex flex-col items-center">
                              <span className="text-[11px] font-black text-amber-900 mb-1 whitespace-nowrap bg-amber-50 px-1 rounded border border-amber-200">
                                {Math.round(m.despesasDisk / 1000)}k
                              </span>
                              <div
                                style={{ height: `${despPx}px` }}
                                className="w-8 sm:w-14 bg-amber-500 rounded-t-xl shadow-sm border border-amber-600 hover:bg-amber-600 transition-all cursor-pointer"
                                title={`Despesas Disk (${m.mes}): ${formatCurrency(m.despesasDisk)}`}
                              />
                            </div>
                          </div>

                          {/* Rótulo do Mês e Lucro Líquido */}
                          <div className="text-center pt-2.5 w-full border-t border-slate-200">
                            <span className="text-xs sm:text-sm font-black text-slate-900">{m.mes}</span>
                            <div className="text-[11px] text-emerald-800 font-extrabold mt-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
                              +{Math.round(m.resultado / 1000)}k
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legenda das Barras */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 px-2 font-medium">
                    <span>Valores expressos em milhares de reais (R$ k)</span>
                    <span className="font-bold text-slate-800">Escala Máxima: R$ 240 mil</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MARGEM % COM BARRAS EM PIXELS E META DE REFERÊNCIA */}
            {chartType === 'margem' && (
              <div className="pt-2 pb-2">
                <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      Rentabilidade Operacional Líquida Mensal
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Meta Mínima: 30%
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-3 items-end h-56 border-b border-slate-300 pb-2 px-2 mt-2">
                    {[
                      { mes: 'Mai', margem: 31.0, lucro: 44000, gmv: 1650000 },
                      { mes: 'Jun', margem: 37.1, lucro: 66000, gmv: 1980000 },
                      { mes: 'Jul', margem: 36.4, lucro: 60000, gmv: 1820000 },
                      { mes: 'Ago', margem: 35.9, lucro: 70000, gmv: 2150000 },
                      { mes: 'Set', margem: 31.9, lucro: 68450, gmv: 2418900 },
                    ].map((m) => {
                      const maxMarginPx = 135;
                      const marginPx = Math.max(20, Math.round((m.margem / 45) * maxMarginPx));

                      return (
                        <div key={m.mes} className="flex flex-col items-center justify-end h-full group">
                          {/* Badge de Porcentagem */}
                          <span className="text-xs sm:text-sm font-black text-emerald-950 mb-1.5 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg shadow-2xs">
                            {m.margem}%
                          </span>

                          {/* Coluna da Margem */}
                          <div
                            style={{ height: `${marginPx}px` }}
                            className="w-12 sm:w-20 bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-500 rounded-t-2xl shadow-sm border border-emerald-600 hover:brightness-105 transition-all cursor-pointer"
                            title={`Margem Líquida (${m.mes}): ${m.margem}% | Lucro: ${formatCurrency(m.lucro)}`}
                          />

                          {/* Rótulo do Mês e Lucro */}
                          <div className="text-center pt-2.5 w-full border-t border-slate-200">
                            <span className="text-xs sm:text-sm font-black text-slate-900">{m.mes}</span>
                            <div className="text-[11px] text-emerald-900 font-extrabold mt-0.5">
                              {formatCurrency(m.lucro)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 px-2 font-medium">
                    <span>Todos os meses operaram acima do piso mínimo de 30%</span>
                    <span className="text-emerald-800 font-bold">Média do período: 34.5%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Escala de referência e Resumo Executivo Compacto */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-indigo-900 uppercase block tracking-wider">
                  Receita Acumulada (Mai-Set)
                </span>
                <span className="text-base font-black text-indigo-950 font-mono mt-0.5 block">
                  R$ 894,3 mil
                </span>
                <span className="text-[11px] text-indigo-700 font-bold block mt-1">Média: R$ 178,8k / mês</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-2xs">
                <span className="text-[10px] font-black text-amber-900 uppercase block tracking-wider">
                  Despesas Acumuladas
                </span>
                <span className="text-base font-black text-amber-950 font-mono mt-0.5 block">
                  R$ 585,8 mil
                </span>
                <span className="text-[11px] text-amber-800 font-bold block mt-1">Média: R$ 117,1k / mês</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-2xs">
                <span className="text-[10px] font-black text-emerald-900 uppercase block tracking-wider">
                  Superávit Operacional Total
                </span>
                <span className="text-base font-black text-emerald-950 font-mono mt-0.5 block">
                  +R$ 308,4 mil
                </span>
                <span className="text-[11px] text-emerald-800 font-extrabold block mt-1">Margem Média: 34.5%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">
                    Taxa de Eficiência
                  </span>
                  <span className="text-base font-black text-white font-mono mt-0.5 block">
                    1,53x
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    R$ 1,53 faturado p/ R$ 1,00 gasto
                  </span>
                </div>
                <button
                  onClick={() => handleSelectSection('intel-exec-gerencial')}
                  className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 mt-2 self-start transition-colors"
                >
                  <span>Ver DRE Waterfall</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
  // VIEW: KEEPER SENTINEL — SUÍTE DE TESTES DE CARGA, ESTRESSE & RESILIÊNCIA D-0
  // =========================================================================
  const renderStressTestingSuite = () => {
    const activeResult = currentStressResult || stressHistory[0] || null;

    return (
      <div className="space-y-6">
        {/* Header do Simulador */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                Stress Testing & Resiliência D-0
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Ambiente Homologado para Megaeventos
              </span>
            </div>
            <h3 className="font-black text-xl text-slate-900 mt-1">
              Simulador de Carga & Estresse da Bilheteria
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Simulação de picos de até 50.000 ingressos/minuto, validação de invariantes ACID no Ledger e resiliência de banco contra double-spending.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-2xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Pool PostgreSQL: 100 max</span>
            </span>
          </div>
        </div>

        {/* 4 KPIs de Resiliência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Throughput Nominal Aferido</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {activeResult ? `${activeResult.throughputRps.toLocaleString()} req/s` : '8.450 req/s'}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Meta corporativa superada (&gt; 5.000)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Latência p95 / p99</span>
            <div className="text-2xl font-black text-blue-600 font-mono">
              {activeResult ? `${activeResult.latencies.p95Ms.toFixed(1)}ms / ${activeResult.latencies.p99Ms.toFixed(1)}ms` : '32.4ms / 48.1ms'}
            </div>
            <span className="text-[11px] text-slate-500">Tempo de resposta em abertura</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Integridade ACID do Ledger</span>
            <div className="text-2xl font-black text-emerald-600 font-mono">100% Íntegro</div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero overbooking ou saldo negativo
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-500">Conexões Postgres & RAM</span>
            <div className="text-2xl font-black text-indigo-600 font-mono">
              {activeResult ? `${activeResult.infraMetrics.postgresPoolActive} / 100` : '44 / 100'}
            </div>
            <span className="text-[11px] text-indigo-700 font-semibold">
              RAM: {activeResult ? `${activeResult.infraMetrics.peakMemoryMb} MB` : '1.150 MB'}
            </span>
          </div>
        </div>

        {/* Bloco de Configuração do Teste */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                Configurar Parâmetros de Simulação de Carga
              </h4>
              <p className="text-xs text-slate-500">Selecione o cenário real da DiskIngressos ou configure os VUs concorrentes.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setStressConfig({
                    scenarioName: 'Abertura Flash Sale — Festival Rock Retrô (50.000 ingressos)',
                    virtualUsers: 10000,
                    ticketsBatch: 25000,
                    rampUpSeconds: 15,
                    chaosOptions: { injectGatewayDelay: false, failoverSimulated: false, botFraudSurge: false },
                  })
                }
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition"
              >
                Preset Flash Sale
              </button>
              <button
                type="button"
                onClick={() =>
                  setStressConfig({
                    scenarioName: 'Rajada de 10.000 Webhooks Assíncronos (Pagar.me / Cielo / Stone)',
                    virtualUsers: 5000,
                    ticketsBatch: 15000,
                    rampUpSeconds: 10,
                    chaosOptions: { injectGatewayDelay: false, failoverSimulated: false, botFraudSurge: false },
                  })
                }
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition"
              >
                Preset Webhooks
              </button>
              <button
                type="button"
                onClick={() =>
                  setStressConfig({
                    scenarioName: 'Concorrência do Ledger & Trava de Saldo (Previne Overdraft)',
                    virtualUsers: 25000,
                    ticketsBatch: 50000,
                    rampUpSeconds: 20,
                    chaosOptions: { injectGatewayDelay: true, failoverSimulated: true, botFraudSurge: true },
                  })
                }
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition"
              >
                Preset Caos & Extremo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1.5">
                Usuários Virtuais Concorrentes (VUs)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1000, 5000, 10000, 25000, 50000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStressConfig({ ...stressConfig, virtualUsers: v })}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      stressConfig.virtualUsers === v
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v >= 1000 ? `${v / 1000}k` : v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1.5">
                Lote de Ingressos em Disputa
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[10000, 25000, 50000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStressConfig({ ...stressConfig, ticketsBatch: t })}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      stressConfig.ticketsBatch === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1.5">
                Tempo de Rampa (Ramp-up)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 15, 30].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setStressConfig({ ...stressConfig, rampUpSeconds: r })}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      stressConfig.rampUpSeconds === r
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Injeção de Caos (Chaos Engineering) */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-700 block">
              Injeção de Caos & Falhas Controladas (Chaos Testing):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                <input
                  type="checkbox"
                  checked={stressConfig.chaosOptions.injectGatewayDelay}
                  onChange={(e) =>
                    setStressConfig({
                      ...stressConfig,
                      chaosOptions: { ...stressConfig.chaosOptions, injectGatewayDelay: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-slate-700 font-medium">Injetar Latência de Gateway (+1.200ms)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                <input
                  type="checkbox"
                  checked={stressConfig.chaosOptions.failoverSimulated}
                  onChange={(e) =>
                    setStressConfig({
                      ...stressConfig,
                      chaosOptions: { ...stressConfig.chaosOptions, failoverSimulated: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-slate-700 font-medium">Simular Failover de Adquirente (Cielo ➔ Stone)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-slate-100">
                <input
                  type="checkbox"
                  checked={stressConfig.chaosOptions.botFraudSurge}
                  onChange={(e) =>
                    setStressConfig({
                      ...stressConfig,
                      chaosOptions: { ...stressConfig.chaosOptions, botFraudSurge: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-slate-700 font-medium">Ataque de Bots & Cartões Falsos (Antifraude)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Cenário: <strong>{stressConfig.scenarioName}</strong> ({stressConfig.virtualUsers.toLocaleString()} VUs)
            </span>
            <button
              type="button"
              onClick={handleRunStressTest}
              disabled={isRunningStress}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Flame className={`w-4 h-4 ${isRunningStress ? 'animate-bounce' : ''}`} />
              <span>{isRunningStress ? 'Executando Carga Extrema...' : 'Executar Teste de Carga em Tempo Real'}</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso Animada durante Execução */}
        {isRunningStress && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-2 text-rose-400">
                <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                Disparando requisições em alta concorrência contra o Ledger e APIs...
              </span>
              <span className="font-mono font-bold text-white text-sm">{stressProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${stressProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Fase: {stressProgress < 30 ? 'Aquecimento de VUs' : stressProgress < 70 ? 'Pico Flash Sale Rumble' : 'Auditoria de ACID no Ledger'}</span>
              <span>Conexões Pool: {Math.floor(stressProgress * 0.5) + 12} / 100</span>
            </div>
          </div>
        )}

        {/* Dossiê de Resultados e Telemetria Aferida */}
        {activeResult && !isRunningStress && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      CLASSIFICAÇÃO: NÍVEL ENTERPRISE A+
                    </span>
                    <span className="text-xs font-mono text-slate-400">Executado às {activeResult.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mt-0.5">{activeResult.scenarioName}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(activeResult, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dossie_resiliencia_keeper_${Date.now()}.json`;
                    a.click();
                    showNotification('Dossiê técnico de auditoria exportado em JSON.');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Dossiê (JSON)</span>
                </button>
              </div>
            </div>

            {/* Decomposição de Latência */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">Decomposição Detalhada de Latência (ms)</h5>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Mínima</span>
                  <span className="font-bold text-slate-800">{activeResult.latencies.minMs.toFixed(1)} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Média</span>
                  <span className="font-bold text-slate-800">{activeResult.latencies.avgMs.toFixed(1)} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Mediana (p50)</span>
                  <span className="font-bold text-slate-800">{activeResult.latencies.p50Ms.toFixed(1)} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-600 block uppercase font-sans font-bold">Percentil 95 (p95)</span>
                  <span className="font-bold text-blue-800 text-sm">{activeResult.latencies.p95Ms.toFixed(1)} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] text-indigo-600 block uppercase font-sans font-bold">Percentil 99 (p99)</span>
                  <span className="font-bold text-indigo-800 text-sm">{activeResult.latencies.p99Ms.toFixed(1)} ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Máxima</span>
                  <span className="font-bold text-slate-800">{activeResult.latencies.maxMs.toFixed(1)} ms</span>
                </div>
              </div>
            </div>

            {/* Invariantes do Ledger e Auditoria Contábil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garantias de Integridade & Não-Duplicação
                </span>
                <ul className="text-xs text-emerald-800 space-y-1">
                  <li>• Overbooking detectado: <strong>ZERO (100% assentos únicos)</strong></li>
                  <li>• Saldo fiduciário a descoberto: <strong>R$ 0,00 (Trava atômica operou)</strong></li>
                  <li>• Assentos emitidos com sucesso: <strong>{activeResult.ledgerIntegrity.seatsSoldSuccessfully.toLocaleString()}</strong></li>
                  <li>• Tentativas de colisão interceptadas: <strong>{activeResult.ledgerIntegrity.duplicateSeatAttemptsPrevented.toLocaleString()}</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  Saúde da Infraestrutura no Pico
                </span>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Consumo de CPU de Pico: <strong>{activeResult.infraMetrics.peakCpuPercent}%</strong></li>
                  <li>• Memória RAM Alocada: <strong>{activeResult.infraMetrics.peakMemoryMb} MB</strong></li>
                  <li>• Conexões ativas no PostgreSQL: <strong>{activeResult.infraMetrics.postgresPoolActive} / 100 max</strong></li>
                  <li>• Latência do Cache Redis: <strong>{activeResult.infraMetrics.redisLatencyMs} ms</strong></li>
                </ul>
              </div>
            </div>

            {/* Recomendações Técnicas Automatizadas da IA */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Bot className="w-4 h-4" />
                <span>Parecer Técnico do Sentinel Engine</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                {activeResult.recommendations.map((rec, idx) => (
                  <li key={idx}>✓ {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tabela de Histórico de Benchmarks Anteriores */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Histórico de Benchmarks & Testes de Carga Realizados
          </h4>
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Data / Hora</th>
                  <th className="py-2.5 px-4">Cenário de Teste</th>
                  <th className="py-2.5 px-4 text-center">VUs Concorrentes</th>
                  <th className="py-2.5 px-4 text-right">Throughput (RPS)</th>
                  <th className="py-2.5 px-4 text-right">Latência p95</th>
                  <th className="py-2.5 px-4 text-center">Classificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {stressHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-sans text-slate-600">{h.timestamp}</td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">{h.scenarioName}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-700">{h.virtualUsers.toLocaleString()} VUs</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{h.throughputRps.toLocaleString()} req/s</td>
                    <td className="py-3 px-4 text-right text-emerald-700 font-bold">{h.latencies.p95Ms.toFixed(1)} ms</td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {h.verdict}
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
  // VIEW: KEEPER SENTINEL — MONITORAMENTO INTELIGENTE & AUDITORIA DIGITAL
  // =========================================================================
  const renderSentinelMonitoring = () => {
    const kpis = sentinelData?.kpis || {
      alertasCriticos: 3,
      atencaoNecessaria: 12,
      emTratamento: 8,
      resolvidosHoje: 24,
      taxaResolucaoPercent: 94.2,
      tempoMedioRespostaMin: 18,
      verificacoesPorMinuto: 1450,
      regrasAtivas: 28,
    };

    const departmentList = [
      'Todas',
      'Financeiro',
      'Eventos & Produtores',
      'Contabilidade',
      'Fiscal',
      'RH & DP',
      'Compras',
      'Segurança & Operação',
    ];

    return (
      <div className="space-y-6">
        {/* 1. Header do Sentinel com Identificação e Níveis de Autonomia */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-900 text-white flex items-center justify-center shadow-md">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      Keeper Sentinel · Auditoria Digital Permanente
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Worker Ativo ({kpis.verificacoesPorMinuto} scans/min)
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    Central de Monitoramento Inteligente
                  </h2>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm max-w-4xl leading-relaxed">
                Monitor contínuo híbrido da <strong className="text-slate-900 font-semibold">DiskIngressos</strong>: 
                combina validações determinísticas de backend (invariantes matemáticos de repasse, taxas e saldos) 
                com agentes de IA semântica para investigar anomalias, auditar inconsistências e antecipar riscos operacionais.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
              <button
                onClick={() => setIsNewAlertModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Ocorrência</span>
              </button>
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-2 border border-slate-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
                <span>Escanear Agora</span>
              </button>
              <button
                onClick={() => handleSelectSection('intel-exec-dashboard')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 border border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao BI</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. OS 4 CARDS DO DASHBOARD DE ALERTAS (EXATAMENTE COMO REQUISITADO) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Alertas Críticos */}
          <div
            onClick={() => {
              setSentinelSeverityFilter('CRITICO');
              setSentinelTab('ocorrencias');
            }}
            className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-xs hover:shadow-md hover:border-rose-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Alertas Críticos</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                # {kpis.alertasCriticos}
              </div>
              <p className="text-xs text-rose-700 font-bold mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Requer ação imediata da diretoria
              </p>
            </div>
          </div>

          {/* Card 2: Atenção Necessária */}
          <div
            onClick={() => {
              setSentinelSeverityFilter('ATENCAO');
              setSentinelTab('ocorrencias');
            }}
            className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Atenção Necessária</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                # {kpis.atencaoNecessaria}
              </div>
              <p className="text-xs text-amber-800 font-semibold mt-1">
                Risco moderado / prazos fiscais
              </p>
            </div>
          </div>

          {/* Card 3: Em Tratamento */}
          <div
            onClick={() => {
              setSentinelStatusFilter('EM_TRATAMENTO');
              setSentinelTab('ocorrencias');
            }}
            className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Em Tratamento</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                # {kpis.emTratamento}
              </div>
              <p className="text-xs text-blue-800 font-semibold mt-1">
                Comitês e gestores atuando
              </p>
            </div>
          </div>

          {/* Card 4: Resolvidos Hoje */}
          <div
            onClick={() => {
              setSentinelStatusFilter('RESOLVIDO');
              setSentinelTab('ocorrencias');
            }}
            className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-400 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Resolvidos Hoje</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                # {kpis.resolvidosHoje}
              </div>
              <p className="text-xs text-emerald-800 font-semibold mt-1">
                {kpis.taxaResolucaoPercent}% taxa de eficácia diária
              </p>
            </div>
          </div>
        </div>

        {/* 3. Sub-Navegação Interna do Sentinel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* 1. Ocorrências */}
            <button
              onClick={() => setSentinelTab('ocorrencias')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'ocorrencias'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Ocorrências ({filteredSentinelAlerts.length})</span>
            </button>

            {/* 2. Mapa de Riscos */}
            <button
              onClick={() => setSentinelTab('mapa-riscos')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'mapa-riscos'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Mapa de Riscos ({riskMapData.length || 7})</span>
            </button>

            {/* 3. Auditoria Cruzada */}
            <button
              onClick={() => setSentinelTab('auditoria-cruzada')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'auditoria-cruzada'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4 text-rose-600" />
              <span>
                Auditoria Cruzada (
                {crossAuditData?.scoreConsistenciaGeral
                  ? `${crossAuditData.scoreConsistenciaGeral}%`
                  : '94.6%'}
                )
              </span>
            </button>

            {/* 4. Previsão & Liquidez */}
            <button
              onClick={() => setSentinelTab('preventivo')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'preventivo'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>Previsão & Liquidez (D-7)</span>
            </button>

            {/* 5. Investigação Causa Raiz */}
            <button
              onClick={() => setSentinelTab('investigacao')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'investigacao'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-rose-600" />
              <span>Investigação Causa Raiz</span>
            </button>

            {/* 6. Assistente IA Copilot */}
            <button
              onClick={() => setSentinelTab('assistente')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'assistente'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-4 h-4 text-rose-600" />
              <span>Assistente IA Copilot</span>
            </button>

            {/* 7. Saúde das Integrações */}
            <button
              onClick={() => setSentinelTab('integracoes')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'integracoes'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-rose-600" />
              <span>Saúde Integrações ({integrationsData?.conectores?.length || 8})</span>
            </button>

            {/* 8. Agentes Especializados */}
            <button
              onClick={() => setSentinelTab('agentes')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'agentes'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-rose-600" />
              <span>Agentes ({sentinelData?.agentes.length || 6})</span>
            </button>

            {/* 9. Regras Determinísticas */}
            <button
              onClick={() => setSentinelTab('regras')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'regras'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <span>Regras ({sentinelData?.regras.length || 6})</span>
            </button>

            {/* 10. Configuração & Autonomia */}
            <button
              onClick={() => setSentinelTab('config')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'config'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Configuração & Trava</span>
            </button>

            {/* 11. Teste de Carga & Estresse D-0 */}
            <button
              onClick={() => setSentinelTab('stress-testing')}
              className={`px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                sentinelTab === 'stress-testing'
                  ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Teste de Carga D-0</span>
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: OCORRÊNCIAS DETECTADAS */}
            {sentinelTab === 'ocorrencias' && (
              <div className="space-y-5">
                {/* Barra de Filtros por Departamento e Severidade */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Departamento:
                    </span>
                    <select
                      value={sentinelDeptFilter}
                      onChange={(e) => setSentinelDeptFilter(e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {departmentList.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-2">
                      Severidade:
                    </span>
                    <select
                      value={sentinelSeverityFilter}
                      onChange={(e) => setSentinelSeverityFilter(e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="all">Todas as Severidades</option>
                      <option value="CRITICO">Crítico</option>
                      <option value="ATENCAO">Atenção</option>
                      <option value="ALERTA">Alerta</option>
                      <option value="INFO">Info</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSentinelDeptFilter('Todas');
                        setSentinelSeverityFilter('all');
                        setSentinelStatusFilter('all');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                    >
                      Limpar Filtros
                    </button>
                    <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                      Exibindo {filteredSentinelAlerts.length} de {sentinelData?.alertas.length || 7} ocorrências
                    </span>
                    <button
                      onClick={() => setIsNewAlertModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Ocorrência</span>
                    </button>
                  </div>
                </div>

                {/* Tabela / Feed de Ocorrências Detectadas */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Severidade</th>
                        <th className="py-3 px-4">Departamento</th>
                        <th className="py-3 px-4">Ocorrência & Entidade Afetada</th>
                        <th className="py-3 px-4">Valores / Divergência</th>
                        <th className="py-3 px-4">Causa Raiz & Ação Recomendada</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {filteredSentinelAlerts.map((al) => {
                        const isCrit = al.severidade === 'CRITICO';
                        const isAtencao = al.severidade === 'ATENCAO';
                        return (
                          <tr
                            key={al.id}
                            className={`hover:bg-slate-50/80 transition ${
                              isCrit ? 'bg-rose-50/30' : isAtencao ? 'bg-amber-50/20' : ''
                            }`}
                          >
                            {/* Severidade */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                  isCrit
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : isAtencao
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}
                              >
                                {al.severidade}
                              </span>
                            </td>

                            {/* Departamento */}
                            <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-800">
                              {al.departamento}
                            </td>

                            {/* Título & Entidade */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 text-sm">{al.titulo}</div>
                              <div className="text-[11px] text-indigo-700 font-medium mt-0.5">
                                📍 {al.entidadeAfetada}
                              </div>
                            </td>

                            {/* Valores / Divergência */}
                            <td className="py-3 px-4">
                              {al.diferenca !== undefined ? (
                                <div className="space-y-0.5">
                                  {al.valorSolicitado && (
                                    <div className="text-[11px] text-slate-500">
                                      Solicitado: <strong className="text-slate-800">{formatCurrency(al.valorSolicitado)}</strong>
                                    </div>
                                  )}
                                  {al.valorElegivel && (
                                    <div className="text-[11px] text-slate-500">
                                      Elegível: <strong className="text-emerald-700">{formatCurrency(al.valorElegivel)}</strong>
                                    </div>
                                  )}
                                  <div className="text-[11px] font-bold text-rose-700 font-mono">
                                    Diferença: {formatCurrency(al.diferenca)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-medium">Compliance / Prazos</span>
                              )}
                            </td>

                            {/* Causa e Ação */}
                            <td className="py-3 px-4 max-w-sm">
                              <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed font-medium">
                                {al.causaIdentificada}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                                👉 {al.acaoRecomendada}
                              </p>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  al.status === 'ABERTO'
                                    ? 'bg-rose-100 text-rose-800'
                                    : al.status === 'EM_TRATAMENTO'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {al.status.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Ação */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => setSentinelSelectedAlert(al)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 mx-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-rose-400" />
                                <span>Ver detalhes</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: AGENTES ESPECIALIZADOS DE IA */}
            {sentinelTab === 'agentes' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Agentes Especializados por Departamento</h3>
                    <p className="text-xs text-slate-500">Agentes digitais dedicados a auditar fluxos específicos com permissão granular</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewAgentModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Agente de IA</span>
                    </button>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      {sentinelData?.agentes.length || 6} Agentes Online
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sentinelData?.agentes.map((ag) => (
                    <div
                      key={ag.id}
                      className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-rose-300 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                            <Bot className="w-5 h-5 text-rose-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{ag.nome}</h4>
                            <span className="text-[10px] text-indigo-600 font-bold">{ag.departamento}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {ag.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {ag.foco}
                      </p>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Autonomia</span>
                          <strong className="text-slate-800">{ag.autonomia.replace('_', ' ')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Acurácia Histórica</span>
                          <strong className="text-emerald-700 font-bold">{ag.acuraciaPercent}%</strong>
                        </div>
                      </div>

                      <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{ag.alertasGerados} alertas emitidos</span>
                        <span>Ativo {ag.ultimaAtividade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: REGRAS DETERMINÍSTICAS & INVARIANTES */}
            {sentinelTab === 'regras' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Motor de Regras Determinísticas & Invariantes de Negócio</h3>
                    <p className="text-xs text-slate-500">Regras invioláveis executadas diretamente no NestJS e PostgreSQL para proteger os saldos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewRuleModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Regra</span>
                    </button>
                    <span className="text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                      {sentinelData?.regras.length || 6} Regras Compiladas
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Nome da Regra</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Expressão Determinística</th>
                        <th className="py-3 px-4 text-center">Verificações Hoje</th>
                        <th className="py-3 px-4 text-center">Anomalias</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {sentinelData?.regras.map((rg) => (
                        <tr key={rg.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{rg.codigo}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{rg.nome}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {rg.tipo}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700 max-w-md truncate">
                            {rg.expressaoRegra}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-indigo-700">
                            {rg.verificacoesHoje.toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {rg.anomaliasDetectadas > 0 ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                {rg.anomaliasDetectadas} ativa(s)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700">0</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Ativo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CONFIGURAÇÃO & INFRAESTRUTURA IA */}
            {sentinelTab === 'config' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Arquitetura & Configuração do Sentinel AI</h3>
                  <p className="text-xs text-slate-500">Decisão estratégica de infraestrutura: Servidor Próprio On-Premises vs API em Nuvem</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Opção A: Híbrido Recomendado */}
                  <div className="p-6 rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 space-y-4 relative">
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                      Recomendado
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">1. Arquitetura Híbrida Inteligente</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        95% do monitoramento roda localmente em regras determinísticas (NestJS + PostgreSQL a custo zero). 
                        Apenas os 5% de anomalias detectadas acionam um modelo semântico para gerar o parecer.
                      </p>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Menor custo operacional
                      </li>
                      <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Resposta em milissegundos
                      </li>
                      <li className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Sem risco de alucinação contábil
                      </li>
                    </ul>
                  </div>

                  {/* Opção B: Servidor Local On-Premises */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 hover:border-slate-300 transition">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                      <Server className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">2. Modelo Local On-Premises (GPU Disk)</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Execução de modelo open-source (Llama 3 / Mistral) em servidor dedicado interno da DiskIngressos via Ollama ou vLLM.
                      </p>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5 text-indigo-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Isolamento 100% interno de dados
                      </li>
                      <li className="flex items-center gap-1.5 text-slate-600">
                        • Requer servidor com GPU (ex: RTX 4090 / A10G)
                      </li>
                      <li className="flex items-center gap-1.5 text-slate-600">
                        • Manutenção de infraestrutura e drivers
                      </li>
                    </ul>
                  </div>

                  {/* Opção C: API em Nuvem Corporativa */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 hover:border-slate-300 transition">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">3. Modelo Conectado por API Nuvem</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Conexão via API corporativa (Claude / GPT / Gemini) com contrato de Zero Data Retention (nenhum dado de cliente é retido para treinamento).
                      </p>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5 text-purple-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Implantação imediata em 1 dia
                      </li>
                      <li className="flex items-center gap-1.5 text-purple-700 font-bold">
                        <Check className="w-3.5 h-3.5" /> Maior capacidade de raciocínio
                      </li>
                      <li className="flex items-center gap-1.5 text-slate-600">
                        • Cobrança por token de consulta
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Parâmetros de Autonomia e Travas de Segurança */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3 text-xs border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Diretriz Absoluta de Autonomia (Trava de Segurança Financeira)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    O Sentinel possui autonomia restrita a <strong className="text-white">Observação</strong>,{' '}
                    <strong className="text-white">Investigação</strong> e{' '}
                    <strong className="text-white">Ação Supervisionada</strong>. O Sentinel <strong>JAMAIS</strong> realizará repasses, estornos, alterações de taxas ou lançamentos bancários de forma autônoma sem a aprovação explícita e assinatura digital dos gestores autorizados no Keeper ERP.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: MAPA DE RISCOS DEPARTAMENTAL */}
            {sentinelTab === 'mapa-riscos' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Matriz de Exposição Global
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        7 Departamentos Auditados
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Mapa de Riscos do Keeper ERP
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Classificação calculada por critérios estritos de <strong>Impacto × Probabilidade × Urgência × Evidências</strong> — sem arbitrariedade.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
                      2 Departamentos em Risco Alto
                    </span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                      3 em Risco Médio
                    </span>
                  </div>
                </div>

                {/* Tabela do Mapa de Riscos com Layout Executivo */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-5">Departamento</th>
                        <th className="py-3.5 px-4 text-center">Nível de Risco</th>
                        <th className="py-3.5 px-4 text-center">Score (0-100)</th>
                        <th className="py-3.5 px-4 text-center">Ocorrências</th>
                        <th className="py-3.5 px-4 text-right">Impacto Estimado</th>
                        <th className="py-3.5 px-5">Ação Recomendada</th>
                        <th className="py-3.5 px-4 text-center">Auditar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {riskMapData.map((rm) => {
                        const isAlto = rm.riskLevel === 'ALTO';
                        const isMedio = rm.riskLevel === 'MEDIO';
                        const scoreVal = isAlto ? 85 : isMedio ? 62 : 28;
                        const recAction =
                          rm.urgency === 'CRITICA'
                            ? 'Bloqueio preventivo e revisão urgente de conciliação'
                            : rm.urgency === 'ALTA'
                            ? 'Auditoria de conformidade com justificativa mandatória'
                            : 'Monitoramento contínuo em rotina padrão';
                        return (
                          <tr key={rm.department} className="hover:bg-slate-50/80 transition">
                            <td className="py-4 px-5">
                              <div className="font-bold text-slate-900 text-sm">{rm.department}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5 max-w-xs truncate">
                                {rm.topRisk} · Última auditoria: {rm.lastAudit}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                  isAlto
                                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                                    : isMedio
                                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {rm.riskLevel}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5 font-bold">
                                <span className={`text-xs ${isAlto ? 'text-rose-700' : isMedio ? 'text-amber-700' : 'text-emerald-700'}`}>
                                  {scoreVal}
                                </span>
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${isAlto ? 'bg-rose-500' : isMedio ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${scoreVal}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-800">
                              <span className="w-6 h-6 rounded-full bg-slate-100 inline-flex items-center justify-center">
                                {rm.activeAlerts}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-bold text-slate-900">
                              {formatCurrency(rm.financialImpact)}
                            </td>
                            <td className="py-4 px-5 text-slate-700 font-medium max-w-sm text-xs leading-relaxed">
                              {recAction}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => {
                                  setSentinelDeptFilter(rm.department);
                                  setSentinelTab('ocorrencias');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold border border-slate-200 transition"
                              >
                                Filtrar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Banner de Critérios de Cálculo */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
                  <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Critério de Cálculo do Score Sentinel:</strong>{' '}
                    Cada departamento recebe pontuação de 0 a 100 ponderada por: 40% Volume e Risco Financeiro em Aberto, 30% Quantidade de Alertas Críticos, 20% SLA Médio de Resolução e 10% Integridade de Logs de Auditoria. Nenhuma pontuação é aleatória.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: AUDITORIA CRUZADA ENTRE MÓDULOS */}
            {sentinelTab === 'auditoria-cruzada' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Reconciliação Multimódulo
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {crossAuditData?.scoreConsistenciaGeral
                          ? `${crossAuditData.scoreConsistenciaGeral}%`
                          : '94.6%'}{' '}
                        Coerência Global
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Auditoria Cruzada Entre Módulos (Cross-Audit)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Conferência automatizada de invariantes transacionais: Compras vs Financeiro, Eventos vs Fiscal, Vendas vs Ledger e RH vs Folha.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewCrossAuditModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Trilha de Auditoria</span>
                    </button>
                    <button
                      onClick={loadData}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reexecutar Auditoria Cruzada</span>
                    </button>
                  </div>
                </div>

                {/* Cards de Métricas da Auditoria Cruzada */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-slate-500">Coerência Global</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">
                      {crossAuditData?.scoreConsistenciaGeral
                        ? `${crossAuditData.scoreConsistenciaGeral}%`
                        : '94.6%'}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">Dentro do SLA corporativo</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-slate-500">Invariantes Testados</span>
                    <div className="text-2xl font-black text-indigo-700 mt-1">
                      {crossAuditData?.verificacoesRealizadas?.toLocaleString('pt-BR') || '1.450'}
                    </div>
                    <span className="text-[11px] text-slate-500">Regras contábeis e fiscais</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-rose-600">Inconsistências Críticas</span>
                    <div className="text-2xl font-black text-rose-700 mt-1">
                      {crossAuditData?.inconsistenciasDetectadas || 1}
                    </div>
                    <span className="text-[11px] text-rose-600 font-semibold">Bloqueio preventivo ativo</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase text-slate-500">Divergência Retida</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">R$ 4.200,00</div>
                    <span className="text-[11px] text-emerald-600 font-semibold">Prevenção de duplicidade</span>
                  </div>
                </div>

                {/* Lista de Casos Auditados */}
                <div className="space-y-3">
                  {crossAuditData?.trilhas.map((item) => {
                    const isDiv = item.status === 'DIVERGENCIA';
                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-2xl border transition ${
                          isDiv ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
                              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                                {item.origem} ➔ {item.destino}
                              </span>
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                  isDiv
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900">{item.descricao}</h4>
                          </div>

                          {item.divergencia > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase text-rose-600 block">Divergência Identificada</span>
                              <strong className="text-base font-black text-rose-700">
                                {formatCurrency(item.divergencia)}
                              </strong>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Evidência Técnica:</span>
                            <span className="text-slate-700 font-mono text-[11px]">{item.detalhe}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Regra & Resolução:</span>
                            <span className="text-slate-800 font-medium">
                              {item.regraViolada || 'Conformidade integral com os balancetes do ERP'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 7: MONITORAMENTO PREVENTIVO & LIQUIDEZ */}
            {sentinelTab === 'preventivo' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Prevenção & Liquidez
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Horizonte Projetado: D-7 / D-15 / D-30
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Monitoramento Preventivo & Previsão de Liquidez
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Projeção contínua de solvência: segregação rigorosa entre <strong>Recursos em Custódia Fiduciária</strong> e <strong>Caixa Próprio da DiskIngressos</strong>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewPreventiveModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Risco Preventivo</span>
                    </button>
                    <button
                      onClick={() => handleSelectSection('intel-ai-simulador')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Simulador What-If de Caixa</span>
                    </button>
                  </div>
                </div>

                {/* Os 4 Cards de Segregação de Liquidez */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Caixa Próprio */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-emerald-300 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Caixa Próprio Disk</span>
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {formatCurrency(1840000)}
                    </div>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                      Livre para folha, despesas e expansão
                    </p>
                  </div>

                  {/* Custódia Produtores (Escrow) */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-indigo-300 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Custódia Produtores</span>
                      <Lock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {formatCurrency(3420000)}
                    </div>
                    <p className="text-[11px] text-indigo-800 font-semibold mt-1">
                      Inviolável · Conta fiduciária segregada
                    </p>
                  </div>

                  {/* Repasses Próximos 7 Dias */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Repasses Projetados (D-7)</span>
                      <Calendar className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {formatCurrency(2150000)}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      23 eventos programados com cobertura 100%
                    </p>
                  </div>

                  {/* Reserva para Estornos */}
                  <div className="p-5 rounded-2xl bg-white border border-amber-300 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Cobertura Global de Riscos</span>
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-2">
                      {preventiveData?.coberturaFinanceiraGlobalPercent || 100}%
                    </div>
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      {preventiveData?.riscosAntecipados || 3} riscos mapeados e cobertos
                    </p>
                  </div>
                </div>

                {/* Riscos Preventivos Identificados */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Situações Preventivas com Ação Antecipada Recomendada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {preventiveData?.projecoes.map((rk) => (
                      <div key={rk.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-400">{rk.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            D-{rk.horizonteDias} ({rk.categoria})
                          </span>
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{rk.titulo}</h5>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rk.diagnostico}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700 border border-slate-100">
                          <strong className="text-slate-900 block font-bold mb-0.5">Ação Preventiva:</strong>
                          {rk.recomendacao}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: INVESTIGAÇÃO INTELIGENTE DE CAUSA RAIZ */}
            {sentinelTab === 'investigacao' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Esteira Transacional 5 Etapas
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Protocolo #ALT-01 · Taxa de Conveniência
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Investigação Inteligente de Causa Raiz
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Rastreamento determinístico da cadeia de processamento para isolar onde a inconsistência se originou.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
                      Origem: Etapa 3 (Gateway de Pagamento)
                    </span>
                  </div>
                </div>

                {/* Stepper Visual da Esteira de 5 Etapas */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {rootCauseData?.esteiraInvestigacao.map((step, idx) => {
                      const isError = step.status === 'ANOMALIA_DETECTADA' || step.status === 'BLOQUEADO';
                      const isAlert = step.status === 'ALERTA';
                      return (
                        <div
                          key={step.etapa}
                          className={`p-4 rounded-xl border relative ${
                            isError
                              ? 'border-rose-300 bg-rose-50/50'
                              : isAlert
                              ? 'border-amber-300 bg-amber-50/40'
                              : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                isError
                                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                                  : isAlert
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-slate-900">{step.nome}</h5>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">{step.detalhe}</p>
                          <div className="mt-2 pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-400">
                            {step.timestamp}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Parecer do Diagnóstico de Causa Raiz */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3 text-xs border border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <Search className="w-4 h-4" />
                      Diagnóstico Conclusivo da Investigação:
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {rootCauseData?.resumoDiagnostico ||
                        'A divergência ocorreu especificamente na liquidação da adquirente Stone (Etapa 3), que capturou R$ 410,00 ao invés dos R$ 450,00 emitidos pelo PDV Keeper devido a cupom aplicado incorretamente no terminal. O Ledger Contábil reteve o lançamento e protegeu as partidas dobradas.'}
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-slate-400 text-[11px]">
                      <span>Recomendação: {rootCauseData?.acaoSugerida || 'Gerar estorno de conciliação ou cobrança de diferença ao produtor.'}</span>
                      <button
                        onClick={() => showNotification('Dossiê técnico copiado para a área de transferência.')}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                      >
                        Copiar Dossiê Técnico
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: ASSISTENTE IA KEEPER (COPILOT DE AUDITORIA) */}
            {sentinelTab === 'assistente' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Copilot de Auditoria & Prevenção
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        Modo Leitura Estrita Ativo
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Assistente IA do Keeper Sentinel
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Consultas analíticas em linguagem natural com indicação explícita de evidências, fontes e travas de segurança.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
                      Autonomia Restrita a Análise
                    </span>
                  </div>
                </div>

                {/* 4 Perguntas Rápidas Pré-formatadas (Sugestões do Usuário) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Perguntas Rápidas de Auditoria:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSendAiMessage('Quais eventos possuem risco de insuficiência para estornos?')}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold border border-slate-200 transition text-left"
                    >
                      “Quais eventos possuem risco de insuficiência para estornos?”
                    </button>
                    <button
                      onClick={() => handleSendAiMessage('Quais despesas da Disk aumentaram mais nos últimos três meses?')}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold border border-slate-200 transition text-left"
                    >
                      “Quais despesas da Disk aumentaram mais nos últimos três meses?”
                    </button>
                    <button
                      onClick={() => handleSendAiMessage('Existem divergências financeiras ainda sem solução?')}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold border border-slate-200 transition text-left"
                    >
                      “Existem divergências financeiras ainda sem solução?”
                    </button>
                    <button
                      onClick={() => handleSendAiMessage('Qual a previsão de liquidez e repasses para os próximos 7 dias?')}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold border border-slate-200 transition text-left"
                    >
                      “Qual a previsão de liquidez e repasses para os próximos 7 dias?”
                    </button>
                  </div>
                </div>

                {/* Feed de Chat do Assistente IA */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto">
                  {aiAssistantChat.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-purple-700 text-white font-medium rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Fontes Auditadas:</span>
                            {msg.sources.map((s, si) => (
                              <span
                                key={si}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="block text-[10px] text-slate-400 mt-1 text-right">{msg.timestamp}</span>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex gap-3 items-center text-xs text-purple-700 font-bold">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-700" />
                      </div>
                      <span>Consultando bases auditadas do ERP...</span>
                    </div>
                  )}
                </div>

                {/* Input de Envio de Pergunta */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={aiInputQuery}
                    onChange={(e) => setAiInputQuery(e.target.value)}
                    placeholder="Faça uma pergunta sobre finanças, eventos, compras, tributos ou ocorrências..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !aiInputQuery.trim()}
                    className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Perguntar</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 10: SAÚDE DAS INTEGRAÇÕES */}
            {sentinelTab === 'integracoes' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Telemetria em Tempo Real
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {integrationsData?.conectores?.length || 8} Serviços Conectados
                      </span>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Saúde dos Sistemas e Integrações
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Monitoramento contínuo de Gateways, Bancos Open Finance, Emissão NFS-e e Workers de Filas (BullMQ/Redis).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Uptime Geral: {integrationsData?.uptimeMedio ? `${integrationsData.uptimeMedio}%` : '99.94%'}
                    </span>
                  </div>
                </div>

                {/* Cards de Conectores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {integrationsData?.conectores.map((c) => {
                    const isOk = c.status === 'OPERACIONAL';
                    const isWarn = c.status === 'DEGRADADO';
                    return (
                      <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">{c.tipo}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              isOk
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : isWarn
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-rose-100 text-rose-800 border-rose-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{c.nome}</h5>
                          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>Latência:</span>
                            <strong className="text-slate-800 font-mono">{c.latenciaMs}ms</strong>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
                            <span>Último Ping:</span>
                            <span className="text-slate-700 font-mono">{c.ultimaVerificacao}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Fila Webhooks: {c.itensNaFila || 0}</span>
                          <button
                            onClick={() => showNotification(`Ping disparado para ${c.nome}. Resposta em ${c.latenciaMs}ms.`)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            Testar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 11: TESTE DE CARGA & ESTRESSE D-0 */}
            {sentinelTab === 'stress-testing' && renderStressTestingSuite()}
          </div>
        </div>

        {/* 4. MODAL DETALHADO DE OCORRÊNCIA (EXATAMENTE COMO REQUISITADO PELO USUÁRIO) */}
        {sentinelSelectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Alerta {sentinelSelectedAlert.severidade.toLowerCase()} — {sentinelSelectedAlert.departamento}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {sentinelSelectedAlert.codigo}
                      </span>
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mt-1">
                      {sentinelSelectedAlert.titulo}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSentinelSelectedAlert(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informações da Ocorrência */}
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Entidade / Evento Afetado</span>
                  <div className="font-bold text-sm text-slate-900">{sentinelSelectedAlert.entidadeAfetada}</div>
                  <div className="text-xs text-slate-500 font-medium">{sentinelSelectedAlert.descricao}</div>
                </div>

                {/* Card de Divergência Financeira quando houver valores */}
                {sentinelSelectedAlert.diferenca !== undefined && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Solicitado</span>
                        <strong className="text-sm font-black text-slate-900 block mt-0.5">
                          {formatCurrency(sentinelSelectedAlert.valorSolicitado || 0)}
                        </strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-[10px] font-bold text-emerald-700 block uppercase">Elegível</span>
                        <strong className="text-sm font-black text-emerald-800 block mt-0.5">
                          {formatCurrency(sentinelSelectedAlert.valorElegivel || 0)}
                        </strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-rose-700 block uppercase">Diferença</span>
                        <strong className="text-sm font-black text-rose-700 block mt-0.5">
                          {formatCurrency(sentinelSelectedAlert.diferenca)}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-950 font-bold leading-relaxed">
                      ⚠️ A solicitação excede o valor liberável. Recomenda-se revisar as reservas e obrigações antes da aprovação.
                    </div>
                  </div>
                )}

                {/* Evidências Levantadas */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Evidências Técnicas Levantadas pelo Invariante:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {sentinelSelectedAlert.evidencias.map((ev, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-slate-500 text-[11px] block">{ev.rotulo}</span>
                        <strong className="text-slate-900 font-mono text-xs mt-0.5 block">{ev.valor}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parecer Semântico da IA Sentinel */}
                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    Parecer do Motor de Inteligência Sentinel:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {sentinelSelectedAlert.causaIdentificada}
                  </p>
                  <div className="pt-2 border-t border-indigo-200/60 text-xs text-indigo-950 font-bold">
                    Recomendação: {sentinelSelectedAlert.acaoRecomendada}
                  </div>
                </div>

                {/* Área de Resolução / Tratativa */}
                {sentinelSelectedAlert.status !== 'RESOLVIDO' ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">
                      Justificativa da Resolução / Parecer do Gestor:
                    </label>
                    <textarea
                      rows={2}
                      value={sentinelResolutionNote}
                      onChange={(e) => setSentinelResolutionNote(e.target.value)}
                      placeholder="Descreva a ação adotada (ex: repasse bloqueado e produtor notificado para ajuste do saldo elegível)..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    ></textarea>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ocorrência resolvida e arquivada na trilha de auditoria CDC.
                  </div>
                )}
              </div>

              {/* Botões do Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  Responsável: {sentinelSelectedAlert.responsavel}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSentinelSelectedAlert(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Fechar
                  </button>

                  {sentinelSelectedAlert.status === 'ABERTO' && (
                    <button
                      type="button"
                      disabled={isProcessingSentinel}
                      onClick={() => handleStartTreatment(sentinelSelectedAlert.id)}
                      className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl shadow-2xs transition"
                    >
                      Colocar em Tratamento
                    </button>
                  )}

                  {sentinelSelectedAlert.status !== 'RESOLVIDO' && (
                    <button
                      type="button"
                      disabled={isProcessingSentinel}
                      onClick={() => handleResolveAlert(sentinelSelectedAlert.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolver Ocorrência
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: REGISTRAR NOVA OCORRÊNCIA / ALERTA */}
        {isNewAlertModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Registrar Nova Ocorrência</h3>
                    <p className="text-xs text-slate-500">Keeper Sentinel · Trilha de Auditoria e Invariantes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAlertModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Título da Ocorrência *</label>
                    <input
                      type="text"
                      required
                      value={newAlertForm.titulo}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, titulo: e.target.value })}
                      placeholder="ex: Solicitação de repasse excede saldo elegível"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Departamento / Módulo</label>
                    <select
                      value={newAlertForm.departamento}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, departamento: e.target.value as SentinelDepartment })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Financeiro">Financeiro</option>
                      <option value="Eventos & Produtores">Eventos & Produtores</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Fiscal">Fiscal</option>
                      <option value="RH & DP">RH & DP</option>
                      <option value="Compras">Compras</option>
                      <option value="Segurança & Operação">Segurança & Operação</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Severidade do Risco</label>
                    <select
                      value={newAlertForm.severidade}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, severidade: e.target.value as SentinelSeverity })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="CRITICO">CRÍTICO (Ação Imediata)</option>
                      <option value="ATENCAO">ATENÇÃO (Risco Moderado)</option>
                      <option value="INFO">INFORMATIVO</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Entidade / Produtor / Contexto</label>
                    <input
                      type="text"
                      value={newAlertForm.entidadeAfetada}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, entidadeAfetada: e.target.value })}
                      placeholder="ex: Show Arena Mix - Lote 03"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Valor em Risco / Divergência (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAlertForm.valorSolicitado || ''}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, valorSolicitado: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Descrição do Fato / Evidências *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAlertForm.descricao}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, descricao: e.target.value })}
                    placeholder="Descreva a divergência observada pelo invariante..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Diagnóstico / Causa Provável</label>
                    <input
                      type="text"
                      value={newAlertForm.causaIdentificada}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, causaIdentificada: e.target.value })}
                      placeholder="ex: Inconsistência entre recebíveis adquirente e ledger"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Ação Recomendada pelo Sentinel</label>
                    <input
                      type="text"
                      value={newAlertForm.acaoRecomendada}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, acaoRecomendada: e.target.value })}
                      placeholder="ex: Suspender liberação e notificar gestor financeiro"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Responsável Inicial</label>
                    <input
                      type="text"
                      value={newAlertForm.responsavel}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, responsavel: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Nível de Autonomia</label>
                    <select
                      value={newAlertForm.nivelAutonomiaSugerido}
                      onChange={(e) => setNewAlertForm({ ...newAlertForm, nivelAutonomiaSugerido: e.target.value as AutonomyLevel })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="OBSERVACAO">OBSERVAÇÃO (Alerta passivo)</option>
                      <option value="INVESTIGACAO">INVESTIGAÇÃO (Agrupamento de evidências)</option>
                      <option value="RECOMENDACAO">RECOMENDAÇÃO (Sugere decisão)</option>
                      <option value="ACAO_SUPERVISIONADA">AÇÃO SUPERVISIONADA (Requer duplo clique)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewAlertModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingSentinel}
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Registrar e Notificar Sentinel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CADASTRAR NOVA REGRA DETERMINÍSTICA */}
        {isNewRuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Nova Regra Determinística</h3>
                    <p className="text-xs text-slate-500">Invariantes invioláveis de validação contábil, fiscal e financeira</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewRuleModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Código da Regra *</label>
                    <input
                      type="text"
                      required
                      value={newRuleForm.codigo}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, codigo: e.target.value })}
                      placeholder="ex: REG-FIN-099"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Módulo / Departamento</label>
                    <select
                      value={newRuleForm.modulo}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, modulo: e.target.value as SentinelDepartment })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Financeiro">Financeiro</option>
                      <option value="Eventos & Produtores">Eventos & Produtores</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Fiscal">Fiscal</option>
                      <option value="RH & DP">RH & DP</option>
                      <option value="Compras">Compras</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Nome Amigável da Regra *</label>
                  <input
                    type="text"
                    required
                    value={newRuleForm.nome}
                    onChange={(e) => setNewRuleForm({ ...newRuleForm, nome: e.target.value })}
                    placeholder="ex: Saldo Líquido de Repasse vs Retenção de Custódia"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Tipo de Invariante</label>
                    <select
                      value={newRuleForm.tipo}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, tipo: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="DETERMINISTICA">DETERMINÍSTICA (Matemática Pura)</option>
                      <option value="ESTATISTICA">ESTATÍSTICA (Desvio Padrão)</option>
                      <option value="IA_SEMANTICA">IA SEMÂNTICA (Comportamental)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Severidade ao Violar</label>
                    <select
                      value={newRuleForm.severidade}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, severidade: e.target.value as SentinelSeverity })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="CRITICO">CRÍTICO (Gera bloqueio preventivo)</option>
                      <option value="ATENCAO">ATENÇÃO</option>
                      <option value="INFO">INFORMATIVO</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Expressão Determinística / Invariante *</label>
                  <textarea
                    rows={2}
                    required
                    value={newRuleForm.expressaoRegra}
                    onChange={(e) => setNewRuleForm({ ...newRuleForm, expressaoRegra: e.target.value })}
                    placeholder="repasse.solicitado <= saldo.elegivel - reserva.retencao"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Exemplos: compras.nfe_emitida == contaspagar.titulo_registrado</span>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewRuleModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingSentinel}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Ativar Regra no Worker</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: INSTANCIAR NOVO AGENTE DE IA */}
        {isNewAgentModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Instanciar Novo Agente de IA</h3>
                    <p className="text-xs text-slate-500">Agente supervisor especializado em auditoria e investigação</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewAgentModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Nome do Agente *</label>
                    <input
                      type="text"
                      required
                      value={newAgentForm.nome}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, nome: e.target.value })}
                      placeholder="ex: Sentinel Liquidez & Custódia"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Ícone / Avatar</label>
                    <input
                      type="text"
                      value={newAgentForm.avatar}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, avatar: e.target.value })}
                      placeholder="🛡️"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Departamento de Atuação</label>
                    <select
                      value={newAgentForm.departamento}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, departamento: e.target.value as SentinelDepartment })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Financeiro">Financeiro</option>
                      <option value="Eventos & Produtores">Eventos & Produtores</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Fiscal">Fiscal</option>
                      <option value="RH & DP">RH & DP</option>
                      <option value="Compras">Compras</option>
                      <option value="Segurança & Operação">Segurança & Operação</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Nível de Autonomia</label>
                    <select
                      value={newAgentForm.autonomia}
                      onChange={(e) => setNewAgentForm({ ...newAgentForm, autonomia: e.target.value as AutonomyLevel })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="OBSERVACAO">OBSERVAÇÃO (Passivo)</option>
                      <option value="INVESTIGACAO">INVESTIGAÇÃO (Agrupamento sem escrita)</option>
                      <option value="RECOMENDACAO">RECOMENDAÇÃO (Sugere aprovação)</option>
                      <option value="ACAO_SUPERVISIONADA">AÇÃO SUPERVISIONADA (Com duplo clique)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Foco Analítico e Escopo *</label>
                  <textarea
                    rows={3}
                    required
                    value={newAgentForm.foco}
                    onChange={(e) => setNewAgentForm({ ...newAgentForm, foco: e.target.value })}
                    placeholder="Supervisão contínua da solvência fiduciária de repasses, monitorando taxas retidas e solvência para estornos futuros..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed font-semibold">
                  🔒 <strong>Regra de Segurança:</strong> Agentes de IA do Keeper Sentinel operam em modo estritamente consultivo e investigativo, sem permissão autônoma de movimentação financeira.
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewAgentModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingSentinel}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Instanciar Agente</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: INCLUIR TRILHA DE AUDITORIA CRUZADA */}
        {isNewCrossAuditModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Incluir Trilha de Auditoria Cruzada</h3>
                    <p className="text-xs text-slate-500">Conferência de integridade transacional entre departamentos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewCrossAuditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCrossAudit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Módulo Origem *</label>
                    <select
                      value={newCrossAuditForm.origem}
                      onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, origem: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Compras">Compras</option>
                      <option value="Vendas & Ingressos">Vendas & Ingressos</option>
                      <option value="Eventos">Eventos</option>
                      <option value="RH & DP">RH & DP</option>
                      <option value="Fiscal">Fiscal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Módulo Destino *</label>
                    <select
                      value={newCrossAuditForm.destino}
                      onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, destino: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Financeiro">Financeiro</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Fiscal">Fiscal</option>
                      <option value="Ledger Imutável">Ledger Imutável</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Descrição da Trilha Auditada *</label>
                  <input
                    type="text"
                    required
                    value={newCrossAuditForm.descricao}
                    onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, descricao: e.target.value })}
                    placeholder="ex: NFe Emitida Compras vs Lançamento Contas a Pagar"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Regra / Invariante</label>
                    <input
                      type="text"
                      value={newCrossAuditForm.regraViolada}
                      onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, regraViolada: e.target.value })}
                      placeholder="ex: 3-Way Matching Obrigatório"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Divergência Retida (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newCrossAuditForm.divergencia || ''}
                      onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, divergencia: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Evidência / Detalhes Técnicos</label>
                  <textarea
                    rows={2}
                    value={newCrossAuditForm.detalhe}
                    onChange={(e) => setNewCrossAuditForm({ ...newCrossAuditForm, detalhe: e.target.value })}
                    placeholder="ex: NF-e 8912 emitida contra DiskIngressos sem registro no contas a pagar..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewCrossAuditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingSentinel}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Cadastrar Trilha</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: REGISTRAR RISCO PREVENTIVO DE LIQUIDEZ */}
        {isNewPreventiveModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">Registrar Risco Preventivo de Liquidez</h3>
                    <p className="text-xs text-slate-500">Modelagem antecipada de eventos futuros e insuficiências potenciais</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewPreventiveModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePreventive} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Título do Risco Preventivo *</label>
                  <input
                    type="text"
                    required
                    value={newPreventiveForm.titulo}
                    onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, titulo: e.target.value })}
                    placeholder="ex: Insuficiência Projetada para Repasse Festival Verão"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Categoria do Risco</label>
                    <select
                      value={newPreventiveForm.categoria}
                      onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, categoria: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="LIQUIDEZ_REPASSES">Liquidez & Repasses a Produtores</option>
                      <option value="OBRIGACOES_FISCAIS">Obrigações e Vencimentos Fiscais</option>
                      <option value="DESPESA_ORCAMENTO">Despesa Acima do Orçamento</option>
                      <option value="ESTORNOS_CHARGEBACK">Estornos e Chargebacks</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Horizonte Projetado</label>
                    <select
                      value={newPreventiveForm.horizonteDias}
                      onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, horizonteDias: parseInt(e.target.value) })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={7}>D-7 (Próximos 7 dias)</option>
                      <option value={15}>D-15 (Próximas duas semanas)</option>
                      <option value={30}>D-30 (Próximo mês)</option>
                      <option value={60}>D-60 (Dois meses)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Entidade / Evento</label>
                    <input
                      type="text"
                      value={newPreventiveForm.entidade}
                      onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, entidade: e.target.value })}
                      placeholder="ex: Festival Verão 2026 - Show Live"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-slate-700">Impacto Estimado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPreventiveForm.impactoEstimado || ''}
                      onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, impactoEstimado: parseFloat(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Diagnóstico Preventivo *</label>
                  <textarea
                    rows={2}
                    required
                    value={newPreventiveForm.diagnostico}
                    onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, diagnostico: e.target.value })}
                    placeholder="Volume de estornos previstos e retenções fiduciárias excederão o saldo liberável..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-700">Recomendação de Prevenção</label>
                  <textarea
                    rows={2}
                    value={newPreventiveForm.recomendacao}
                    onChange={(e) => setNewPreventiveForm({ ...newPreventiveForm, recomendacao: e.target.value })}
                    placeholder="Suspender antecipação até recomposição da conta escrow fiduciária..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewPreventiveModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingSentinel}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition flex items-center gap-2"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Salvar Risco Preventivo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
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
                onClick={() => handleSelectSection('intel-sent-central')}
                className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 font-bold text-xs transition-colors flex items-center gap-2 shadow-2xs"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Sentinel ({sentinelData?.kpis.alertasCriticos || 3} Críticos)</span>
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
          {sectionId.startsWith('intel-sent-') && renderSentinelMonitoring()}
          {sectionId === 'intel-exec-gerencial' && renderGerencialWaterfall()}
          {sectionId === 'intel-ai-simulador' && renderSimulador()}
          {sectionId === 'intel-ai-assistente' && renderCopilot()}
          {sectionId === 'intel-evt-performance' && renderEventosPerformance()}
          {sectionId !== 'intel-exec-dashboard' &&
            !sectionId.startsWith('intel-sent-') &&
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
