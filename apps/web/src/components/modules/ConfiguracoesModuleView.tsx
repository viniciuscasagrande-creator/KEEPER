import React, { useState, useEffect, useMemo } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Users,
  Workflow,
  Zap,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Lock,
  Key,
  Globe,
  Radio,
  Clock,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Sliders,
  Bell,
  Cpu,
  Hash,
  Check,
  X,
  Layers,
  MapPin,
  Laptop,
  CheckSquare,
  AlertCircle,
  Copy,
  Terminal,
  Send,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  configuracoesClient,
  ConfiguracoesOverview,
  Company,
  Branch,
  User,
  Role,
  PermissionItem,
  WorkflowDef,
  AuditLogItem,
  IntegrationItem,
  SystemHealth,
} from '../../services/configuracoesClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface ConfSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const CONF_SUBMENUS: ConfSubmenuDef[] = [
  // 1. Visão Geral & Parâmetros (3)
  {
    id: 'conf-dashboard',
    label: 'Dashboard de Configurações',
    group: 'Visão Geral & Parâmetros',
    icon: Activity,
    purpose: 'Métricas de saúde, latência, uptime e infraestrutura core da DiskIngressos.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'conf-gerais',
    label: 'Parâmetros Gerais do ERP',
    group: 'Visão Geral & Parâmetros',
    icon: SlidersHorizontal,
    purpose: 'Fuso horário, moeda padrão BRL, dados institucionais e logos.',
  },
  {
    id: 'conf-seguranca',
    label: 'Políticas de Segurança',
    group: 'Visão Geral & Parâmetros',
    icon: ShieldCheck,
    purpose: 'Tempo de expiração de sessão, complexidade de senha e política de 2FA obrigatória.',
    badge: 'MFA Ativo',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },

  // 2. Estrutura Corporativa & Multiempresa (4)
  {
    id: 'conf-empresas',
    label: 'Empresas & Unidades',
    group: 'Estrutura Corporativa & Multiempresa',
    icon: Building2,
    purpose: 'Cadastro de matriz DiskIngressos, holdings e consolidação contábil/fiscal.',
    badge: 'Matriz',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'conf-filiais',
    label: 'Filiais & PDVs Físicos',
    group: 'Estrutura Corporativa & Multiempresa',
    icon: MapPin,
    purpose: 'Quiosques Shopping Mueller, Palladium, Bilheterias Teatros Guaíra e Positivo.',
  },
  {
    id: 'conf-centros-custo',
    label: 'Centros de Custo & Departamentos',
    group: 'Estrutura Corporativa & Multiempresa',
    icon: Layers,
    purpose: 'Mapeamento departamental corporativo (Diretoria, Finanças, Bilheteria, TI).',
  },
  {
    id: 'conf-regimes',
    label: 'Inscrições & Regimes Tributários',
    group: 'Estrutura Corporativa & Multiempresa',
    icon: FileText,
    purpose: 'Inscrições estaduais, municipais de Curitiba e enquadramento no Lucro Real.',
  },

  // 3. Gestão de Identidade & Acesso (4)
  {
    id: 'conf-usuarios',
    label: 'Usuários & Colaboradores',
    group: 'Gestão de Identidade & Acesso',
    icon: Users,
    purpose: 'Gestão de contas de colaboradores, emails institucionais e controle de status.',
    badge: '48 Ativos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'conf-roles',
    label: 'Perfis de Acesso & RBAC',
    group: 'Gestão de Identidade & Acesso',
    icon: Shield,
    purpose: 'Definição de papéis corporativos: Admin, Diretoria, Bilheteiro e Fiscal.',
  },
  {
    id: 'conf-permissoes',
    label: 'Matriz Granular de Permissões',
    group: 'Gestão de Identidade & Acesso',
    icon: Key,
    purpose: 'Controle granular por tela, ação (ver, criar, editar, aprovar) e recurso.',
  },
  {
    id: 'conf-sessoes',
    label: 'Sessões Ativas & Dispositivos',
    group: 'Gestão de Identidade & Acesso',
    icon: Laptop,
    purpose: 'Auditoria de conexões ativas, IPs, navegadores e revogação remota de tokens.',
  },

  // 4. Automação, Workflows & Regras (4)
  {
    id: 'conf-workflows',
    label: 'Motor de Workflow & Alçadas',
    group: 'Automação, Workflows & Regras',
    icon: Workflow,
    purpose: 'Hierarquia de aprovações condicionais para pagamentos > R$ 5k e compras > R$ 1.5k.',
    badge: '6 Regras',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'conf-regras',
    label: 'Motor de Regras (Rule Engine)',
    group: 'Automação, Workflows & Regras',
    icon: Sliders,
    purpose: 'Regras lógicas de validação de split, retenção de produtor e limites operacionais.',
  },
  {
    id: 'conf-templates',
    label: 'Modelos de Documentos & E-mails',
    group: 'Automação, Workflows & Regras',
    icon: FileText,
    purpose: 'Templates oficiais para borderôs, recibos de liquidação e notificações automáticas.',
  },
  {
    id: 'conf-notificacoes',
    label: 'Canais de Notificação',
    group: 'Automação, Workflows & Regras',
    icon: Bell,
    purpose: 'Roteamento de alertas críticos via Slack, WhatsApp, SMS e E-mail.',
  },

  // 5. Integrações & Conectores (5)
  {
    id: 'conf-hub',
    label: 'Hub Central de Integrações',
    group: 'Integrações & Conectores',
    icon: Zap,
    purpose: 'Conectores ativos com Asaas, Stone, Cielo, Bancos e motor de bilheteria.',
    badge: '8 Conectores',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'conf-webhooks',
    label: 'Webhooks & Eventos de Venda',
    group: 'Integrações & Conectores',
    icon: Radio,
    purpose: 'Stream em tempo real de ingressos emitidos e sincronização com o ERP.',
  },
  {
    id: 'conf-api-keys',
    label: 'Chaves de API & Tokens',
    group: 'Integrações & Conectores',
    icon: Key,
    purpose: 'Gerenciamento seguro de API Keys com escopos e expiração automática.',
  },
  {
    id: 'conf-fiscais',
    label: 'Conectores Fiscais & Prefeituras',
    group: 'Integrações & Conectores',
    icon: Server,
    purpose: 'Webservice da Prefeitura de Curitiba (ISS.Curitiba) com Certificado A1.',
  },
  {
    id: 'conf-open-finance',
    label: 'Conexão Bancária & Open Finance',
    group: 'Integrações & Conectores',
    icon: Globe,
    purpose: 'Conciliação automática com Banco do Brasil, Bradesco e Itaú.',
  },

  // 6. Governança, Trilha & Auditoria (4)
  {
    id: 'conf-auditoria',
    label: 'Trilha de Auditoria (CDC)',
    group: 'Governança, Trilha & Auditoria',
    icon: CheckSquare,
    purpose: 'Logs imutáveis de alterações com diff de valores, IP, timestamp e hash SHA-256.',
    badge: 'Imutável',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'conf-backup',
    label: 'Backups & Disaster Recovery',
    group: 'Governança, Trilha & Auditoria',
    icon: Database,
    purpose: 'Rotinas automáticas diárias de snapshots PostgreSQL na AWS S3.',
  },
  {
    id: 'conf-lgpd',
    label: 'Privacidade & LGPD',
    group: 'Governança, Trilha & Auditoria',
    icon: Lock,
    purpose: 'Gestão de consentimentos, anonimização e conformidade de dados sensíveis.',
  },
  {
    id: 'conf-logs',
    label: 'Logs de Sistema & Monitoramento',
    group: 'Governança, Trilha & Auditoria',
    icon: Terminal,
    purpose: 'Telemetria de microsserviços, stack traces e diagnóstico de erros.',
  },
];

export const ConfiguracoesModuleView: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const [data, setData] = useState<ConfiguracoesOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'visao-geral' | 'multiempresa' | 'identidade' | 'workflows' | 'integracoes' | 'auditoria'
  >('visao-geral');

  // Search filter for submenus
  const [submenuSearch, setSubmenuSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');

  // Modals state
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isTestConnectionModalOpen, setIsTestConnectionModalOpen] = useState(false);
  const [testedIntegration, setTestedIntegration] = useState<IntegrationItem | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [testingPing, setTestingPing] = useState(false);

  // Forms state
  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    branchType: 'PDV_SHOPPING' as const,
    documentNumber: '08.234.567/0006-88',
    address: '',
    city: 'Curitiba',
    state: 'PR',
    activeTerminals: 2,
  });

  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    roleId: 'role-pdv',
    department: 'Operações de Bilheteria',
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await configuracoesClient.getOverview();
      setData(res);
    } catch (e) {
      console.error('Erro ao carregar dados de configurações:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync tab if activeSection changes from outside
  useEffect(() => {
    if (!activeSection) return;
    if (activeSection.startsWith('conf-dash') || activeSection.startsWith('conf-gerais') || activeSection.startsWith('conf-seguranca')) {
      setActiveTab('visao-geral');
    } else if (activeSection.startsWith('conf-emp') || activeSection.startsWith('conf-filiais') || activeSection.startsWith('conf-centros') || activeSection.startsWith('conf-regimes')) {
      setActiveTab('multiempresa');
    } else if (activeSection.startsWith('conf-usr') || activeSection.startsWith('conf-roles') || activeSection.startsWith('conf-perm') || activeSection.startsWith('conf-sess')) {
      setActiveTab('identidade');
    } else if (activeSection.startsWith('conf-work') || activeSection.startsWith('conf-regras') || activeSection.startsWith('conf-temp') || activeSection.startsWith('conf-notif')) {
      setActiveTab('workflows');
    } else if (activeSection.startsWith('conf-hub') || activeSection.startsWith('conf-web') || activeSection.startsWith('conf-api') || activeSection.startsWith('conf-fisc') || activeSection.startsWith('conf-open')) {
      setActiveTab('integracoes');
    } else if (activeSection.startsWith('conf-aud') || activeSection.startsWith('conf-back') || activeSection.startsWith('conf-lgpd') || activeSection.startsWith('conf-logs')) {
      setActiveTab('auditoria');
    }
  }, [activeSection]);

  const handleSubmenuClick = (subId: string) => {
    if (onSelectSection) {
      onSelectSection(subId);
    }
    if (subId.startsWith('conf-dash') || subId.startsWith('conf-gerais') || subId.startsWith('conf-seguranca')) {
      setActiveTab('visao-geral');
    } else if (subId.startsWith('conf-emp') || subId.startsWith('conf-filiais') || subId.startsWith('conf-centros') || subId.startsWith('conf-regimes')) {
      setActiveTab('multiempresa');
    } else if (subId.startsWith('conf-usr') || subId.startsWith('conf-roles') || subId.startsWith('conf-perm') || subId.startsWith('conf-sess')) {
      setActiveTab('identidade');
    } else if (subId.startsWith('conf-work') || subId.startsWith('conf-regras') || subId.startsWith('conf-temp') || subId.startsWith('conf-notif')) {
      setActiveTab('workflows');
    } else if (subId.startsWith('conf-hub') || subId.startsWith('conf-web') || subId.startsWith('conf-api') || subId.startsWith('conf-fisc') || subId.startsWith('conf-open')) {
      setActiveTab('integracoes');
    } else if (subId.startsWith('conf-aud') || subId.startsWith('conf-back') || subId.startsWith('conf-lgpd') || subId.startsWith('conf-logs')) {
      setActiveTab('auditoria');
    }
  };

  const filteredSubmenus = useMemo(() => {
    return CONF_SUBMENUS.filter((item) => {
      const matchSearch =
        item.label.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.purpose.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.group.toLowerCase().includes(submenuSearch.toLowerCase());
      const matchGroup = selectedGroup === 'todos' || item.group === selectedGroup;
      return matchSearch && matchGroup;
    });
  }, [submenuSearch, selectedGroup]);

  const groupsList = useMemo(() => {
    const set = new Set(CONF_SUBMENUS.map((s) => s.group));
    return ['todos', ...Array.from(set)];
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name) return;
    await configuracoesClient.createBranch('comp-matriz', branchForm);
    setIsBranchModalOpen(false);
    setBranchForm({
      name: '',
      code: '',
      branchType: 'PDV_SHOPPING',
      documentNumber: '08.234.567/0006-88',
      address: '',
      city: 'Curitiba',
      state: 'PR',
      activeTerminals: 2,
    });
    loadData();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName || !userForm.email) return;
    const role = data?.roles.find((r) => r.id === userForm.roleId);
    await configuracoesClient.createUser({
      ...userForm,
      roleName: role ? role.name : 'Operador de Bilheteria & PDV',
    });
    setIsUserModalOpen(false);
    setUserForm({
      fullName: '',
      email: '',
      roleId: 'role-pdv',
      department: 'Operações de Bilheteria',
    });
    loadData();
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name) return;
    await configuracoesClient.createRole(roleForm.name, roleForm.description);
    setIsRoleModalOpen(false);
    setRoleForm({ name: '', description: '' });
    loadData();
  };

  const handleOpenPingModal = (item: IntegrationItem) => {
    setTestedIntegration(item);
    setTestResult(null);
    setIsTestConnectionModalOpen(true);
  };

  const handleExecutePing = async () => {
    if (!testedIntegration) return;
    setTestingPing(true);
    setTestResult(null);
    try {
      const res = await configuracoesClient.pingIntegration(testedIntegration.name);
      setTestResult(res);
    } catch {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: 'Falha ao conectar com o serviço remoto.',
      });
    } finally {
      setTestingPing(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Carregando Configurações & Administração Core</h3>
        <p className="text-sm text-slate-500 mt-1">Conectando aos microsserviços e recuperando estrutura multiempresa...</p>
      </div>
    );
  }

  const health = data?.health;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* 1. Header do Módulo com Identificação Corporativa */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <Settings className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Administração Core & Governança
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Ambiente Produção
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Configurações & Administração do Sistema
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-sm max-w-4xl leading-relaxed">
              Central unificada de controle corporativo da <strong className="text-slate-900 font-semibold">DiskIngressos</strong>: 
              gestão multiempresa e filiais de bilheteria, matriz de acessos RBAC, motor de alçadas de aprovação, 
              conectores fiscais/bancários e trilha de auditoria imutável (CDC).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={loadData}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition flex items-center gap-2 border border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              Sincronizar
            </button>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Usuário
            </button>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-indigo-300" />
              Nova Filial / PDV
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Core KPIs Cards (5 Cards de Alto Impacto) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Saúde do Sistema */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saúde do Sistema</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{health?.uptimePercent}%</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Uptime
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Latência API: <strong className="text-slate-800">{health?.apiLatencyMs}ms</strong>
            </p>
          </div>
        </div>

        {/* Card 2: Estrutura Multiempresa */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Multiempresa & PDVs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {data?.companies.length || 2} <span className="text-sm font-semibold text-slate-500">Empresas</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              <strong className="text-indigo-700 font-bold">{data?.branches.length || 5} Filiais</strong> e Bilheterias ativas
            </p>
          </div>
        </div>

        {/* Card 3: Usuários & Segurança */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Usuários & Acesso</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {health?.activeSessions || 48} <span className="text-sm font-semibold text-slate-500">Sessões</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              <strong className="text-emerald-700 font-bold">{data?.roles.length || 6} Perfis RBAC</strong> com 2FA ativo
            </p>
          </div>
        </div>

        {/* Card 4: Workflows & Alçadas */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Workflows & Alçadas</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <Workflow className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {data?.workflows.length || 4} <span className="text-sm font-semibold text-slate-500">Regras</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              <strong className="text-purple-700 font-bold">96 Aprovações</strong> no mês corrente
            </p>
          </div>
        </div>

        {/* Card 5: Hub de Integrações */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-indigo-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hub de Conectores</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {data?.integrations.length || 8} <span className="text-sm font-semibold text-slate-500">Conectores</span>
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operacionais (0 Falhas)
            </p>
          </div>
        </div>
      </div>

      {/* 3. Matriz Central de Submenus (Navegação Rápida dos 24 Submenus na Tela) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h2 className="text-lg font-bold text-slate-900">Navegação Completa do Módulo (24 Submenus)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Acesso direto às configurações de governança corporativa da DiskIngressos
            </p>
          </div>

          {/* Search and Category filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={submenuSearch}
                onChange={(e) => setSubmenuSearch(e.target.value)}
                placeholder="Buscar recurso ou configuração..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-56 sm:w-64"
              />
              {submenuSearch && (
                <button
                  onClick={() => setSubmenuSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos os 6 Grupos (24)</option>
              {groupsList.filter((g) => g !== 'todos').map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Cards dos Submenus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mt-5">
          {filteredSubmenus.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSubmenuClick(item.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-200'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 truncate max-w-[130px]">
                        {item.group}
                      </span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {item.purpose}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                  <span>Acessar tela</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tabs Interativas de Trabalho */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header das Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('visao-geral')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'visao-geral'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
            1. Visão Geral & Saúde Core
          </button>

          <button
            onClick={() => setActiveTab('multiempresa')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'multiempresa'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-500" />
            2. Multiempresa & Filiais PDV ({data?.branches.length || 5})
          </button>

          <button
            onClick={() => setActiveTab('identidade')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'identidade'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            3. Usuários & Perfis RBAC ({data?.users.length || 6})
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'workflows'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4 text-indigo-500" />
            4. Motor de Workflows & Alçadas ({data?.workflows.length || 4})
          </button>

          <button
            onClick={() => setActiveTab('integracoes')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'integracoes'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-500" />
            5. Hub de Integrações ({data?.integrations.length || 8})
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'auditoria'
                ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-indigo-500" />
            6. Trilha de Auditoria CDC ({data?.auditLogs.length || 5})
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="p-6">
          {/* TAB 1: VISÃO GERAL & SAÚDE CORE */}
          {activeTab === 'visao-geral' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Telemetria de Infraestrutura & Parâmetros Core</h3>
                  <p className="text-xs text-slate-500">Status dos servidores de produção, bancos de dados e conectividade em tempo real</p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-600" />
                  {health?.environment}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Status Banco Neon */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-600" />
                      <span className="font-bold text-sm text-slate-900">PostgreSQL (Neon Cloud)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Saudável
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Pool de Conexões:</span>
                      <strong className="text-slate-800">12 / 60 ativas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tamanho do Banco:</span>
                      <strong className="text-slate-800">4.82 GB</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Último Snapshot AWS S3:</span>
                      <strong className="text-slate-800">09/10/2026 04:00</strong>
                    </div>
                  </div>
                </div>

                {/* Status Redis & Filas */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-sm text-slate-900">Redis & BullMQ (Workers)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ativo
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Jobs Processados:</span>
                      <strong className="text-slate-800">{health?.redisJobsProcessed.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Fila de Webhooks:</span>
                      <strong className="text-slate-800">0 pendentes (tempo real)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Fila de E-mails / NFS-e:</span>
                      <strong className="text-slate-800">2 em processamento</strong>
                    </div>
                  </div>
                </div>

                {/* Status Segurança & Sessões */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm text-slate-900">Políticas de Segurança & Sessão</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% Conforme
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Sessões Simultâneas:</span>
                      <strong className="text-slate-800">{health?.activeSessions} ativas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo de Expiração de Token:</span>
                      <strong className="text-slate-800">8 horas</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificado Digital A1:</span>
                      <strong className="text-emerald-700 font-bold">Válido até Out/2027</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações da Instância e Parâmetros Institucionais */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Parâmetros Globais do Sistema DiskIngressos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Fuso Horário Padrão</span>
                    <strong className="text-slate-800 text-sm mt-0.5 block">America/Sao_Paulo (UTC-3)</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Moeda Oficial</span>
                    <strong className="text-slate-800 text-sm mt-0.5 block">BRL (R$ Real Brasileiro)</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Regime Tributário Matriz</span>
                    <strong className="text-slate-800 text-sm mt-0.5 block">Lucro Real (Apuração Trimestral)</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Município de Emissão NFS-e</span>
                    <strong className="text-slate-800 text-sm mt-0.5 block">Curitiba / PR (Cód. 7535)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTIEMPRESA & FILIAIS */}
          {activeTab === 'multiempresa' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estrutura Multiempresa & Rede de Bilheterias PDV</h3>
                  <p className="text-xs text-slate-500">Gestão centralizada de CNPJs, Inscrições e pontos físicos autorizados de venda</p>
                </div>
                <button
                  onClick={() => setIsBranchModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  Cadastrar Filial / PDV
                </button>
              </div>

              {/* Empresas Cadastradas (Holdings e Matriz) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Empresas do Grupo Disk</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data?.companies.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                          <div>
                            <span className="font-bold text-sm text-slate-900">{comp.tradeName}</span>
                            <span className="text-[10px] text-slate-400 ml-2">({comp.code})</span>
                          </div>
                        </div>
                        {comp.isHeadquarter ? (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                            Matriz Operadora
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            Participações / Holding
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Razão Social</span>
                          <span className="font-semibold text-slate-800 truncate block">{comp.corporateName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">CNPJ</span>
                          <span className="font-mono font-semibold text-slate-800">{comp.documentNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Inscrição Municipal (ISS)</span>
                          <span className="font-semibold text-slate-800">{comp.municipalRegistration}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Regime Tributário</span>
                          <span className="font-semibold text-indigo-700">{comp.taxRegime.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 pt-1">
                        📍 {comp.address} - {comp.city}/{comp.state}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Filiais & PDVs Físicos */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Filiais & Pontos de Venda Físicos ({data?.branches.length})
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">Todos integrados com conciliação automática</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Ponto de Venda / Filial</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">CNPJ da Unidade</th>
                        <th className="py-3 px-4">Endereço</th>
                        <th className="py-3 px-4 text-center">Terminais PDV</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {data?.branches.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.code}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{b.name}</span>
                            <span className="text-[10px] text-slate-400">{b.city} - {b.state}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {b.branchType.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">{b.documentNumber}</td>
                          <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{b.address}</td>
                          <td className="py-3 px-4 text-center font-bold text-indigo-700">{b.activeTerminals} PDVs</td>
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
            </div>
          )}

          {/* TAB 3: GESTÃO DE IDENTIDADE & RBAC */}
          {activeTab === 'identidade' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Usuários, Credenciais & Controle de Acesso (RBAC)</h3>
                  <p className="text-xs text-slate-500">Gestão granular de contas, alçadas e permissões por departamento</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    Novo Perfil
                  </button>
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Novo Usuário
                  </button>
                </div>
              </div>

              {/* Perfis de Acesso Homologados */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Perfis de Acesso Cadastrados</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data?.roles.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{r.name}</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {r.userCount} usuários
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{r.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {r.permissions.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Colaboradores */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Colaboradores do Sistema ({data?.users.length})
                </h4>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nome do Colaborador</th>
                        <th className="py-3 px-4">E-mail Institucional</th>
                        <th className="py-3 px-4">Departamento</th>
                        <th className="py-3 px-4">Perfil RBAC</th>
                        <th className="py-3 px-4 text-center">2FA / MFA</th>
                        <th className="py-3 px-4">Último Login</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {data?.users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-bold text-slate-900">{u.fullName}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                          <td className="py-3 px-4 text-slate-700">{u.department}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-indigo-700">{u.roleName}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {u.twoFactorEnabled ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Ativado
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">{u.lastLoginAt}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {u.status}
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

          {/* TAB 4: MOTOR DE WORKFLOWS & ALÇADAS */}
          {activeTab === 'workflows' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Motor de Workflows, Alçadas & Regras de Governança</h3>
                  <p className="text-xs text-slate-500">Regras automáticas para pagamentos, compras, repasses fiduciários e homologações</p>
                </div>
                <span className="text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-purple-600" />
                  Motor de Regras Ativo (4 Workflows)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.workflows.map((wf) => (
                  <div
                    key={wf.id}
                    className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-purple-300 transition space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                          <Workflow className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{wf.name}</h4>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            {wf.module} • {wf.entity}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono text-slate-700">
                      <span className="text-slate-400 block text-[10px] font-sans">Condição de Disparo (Trigger):</span>
                      {wf.triggerCondition}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        Alçadas e Etapas de Aprovação:
                      </span>
                      {wf.steps.map((st) => (
                        <div
                          key={st.order}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/70 border border-slate-100"
                        >
                          <span className="font-semibold text-slate-800">
                            {st.order}ª Alçada: <strong className="text-indigo-600">{st.approverRole}</strong>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">SLA: {st.slaHours}h úteis</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Execuções realizadas:</span>
                      <strong className="text-slate-800">{wf.approvalsCount} aprovações</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HUB DE INTEGRAÇÕES & WEBHOOKS */}
          {activeTab === 'integracoes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hub Central de Integrações & Webhooks de Venda</h3>
                  <p className="text-xs text-slate-500">Conectores ativos com adquirentes, bancos, emissão de NFS-e e motor de bilheteria</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    8 Conectores Online
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.integrations.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</h4>
                          <span className="text-[10px] text-slate-500">{item.provider}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {item.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-600 truncate">
                      {item.endpoint}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Autenticação</span>
                        <strong className="text-slate-700">{item.authType.replace('_', ' ')}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">SLA / Uptime</span>
                        <strong className="text-emerald-700">{item.uptime}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Taxa de Sucesso</span>
                        <strong className="text-slate-800">{item.successRate}%</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">{item.lastSyncAt}</span>
                      <button
                        onClick={() => handleOpenPingModal(item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition border border-slate-200 flex items-center gap-1"
                      >
                        <Radio className="w-3 h-3 text-indigo-600" />
                        Testar Ping
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TRILHA DE AUDITORIA IMUTÁVEL (CDC) */}
          {activeTab === 'auditoria' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Trilha de Auditoria Imutável (Change Data Capture)</h3>
                  <p className="text-xs text-slate-500">Registro cronológico de todas as ações de usuários, aprovações e snapshots de segurança</p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Hash SHA-256 Validado (Integridade 100%)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Usuário Responsável</th>
                      <th className="py-3 px-4">Módulo / Entidade</th>
                      <th className="py-3 px-4 text-center">Operação</th>
                      <th className="py-3 px-4">Resumo da Alteração (Diff)</th>
                      <th className="py-3 px-4">IP / Origem</th>
                      <th className="py-3 px-4 font-mono">Hash SHA-256</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {data?.auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                          {log.createdAt}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{log.userName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.userEmail}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{log.module}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{log.entity}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              log.action === 'INSERT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.action === 'UPDATE'
                                ? 'bg-blue-100 text-blue-800'
                                : log.action === 'APPROVE'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium max-w-sm">{log.diffSummary}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {log.ipAddress}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[10px]">{log.checksum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. MODAL: NOVA FILIAL / PDV */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Cadastrar Nova Filial / PDV Físico</h3>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Ponto de Venda / Teatro</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Quiosque Shopping Estação ou Teatro Fernanda Montenegro"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código de Identificação</label>
                  <input
                    type="text"
                    placeholder="Ex: PDV-006"
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Ponto</label>
                  <select
                    value={branchForm.branchType}
                    onChange={(e) => setBranchForm({ ...branchForm, branchType: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PDV_SHOPPING">PDV Shopping Center</option>
                    <option value="BILHETERIA_TEATRO">Bilheteria Teatro / Arena</option>
                    <option value="QUIOSQUE">Quiosque / Totem</option>
                    <option value="INTERNO">Unidade Interna Disk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Av. Sete de Setembro, 2775 - Rebouças"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    value={`${branchForm.city} - ${branchForm.state}`}
                    disabled
                    className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qtd Terminais</label>
                  <input
                    type="number"
                    min="1"
                    value={branchForm.activeTerminals}
                    onChange={(e) => setBranchForm({ ...branchForm, activeTerminals: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Salvar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: NOVO USUÁRIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Cadastrar Novo Colaborador</h3>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Henrique Oliveira"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Corporativo (@diskingressos.com.br)</label>
                <input
                  type="email"
                  required
                  placeholder="lucas.oliveira@diskingressos.com.br"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perfil de Acesso (RBAC)</label>
                  <select
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {data?.roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
                ℹ️ O usuário receberá um convite por e-mail com link para definição de senha e configuração obrigatória de autenticação em duas etapas (2FA).
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: NOVO PERFIL RBAC */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Criar Novo Perfil de Acesso (RBAC)</h3>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Perfil</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Auditor Externo ou Supervisor de Bilheteria"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição e Responsabilidades</label>
                <textarea
                  rows={3}
                  placeholder="Descreva as permissões e limites de alçada deste perfil..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Criar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: TESTAR CONECTOR / PING */}
      {isTestConnectionModalOpen && testedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Teste de Conectividade & Latência</h3>
              </div>
              <button
                onClick={() => setIsTestConnectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Serviço Remoto</span>
                <h4 className="font-bold text-sm text-slate-900">{testedIntegration.name}</h4>
                <p className="text-xs text-slate-500">{testedIntegration.provider}</p>
                <div className="font-mono text-[11px] text-slate-600 break-all pt-1">
                  {testedIntegration.endpoint}
                </div>
              </div>

              {testingPing ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-xs font-semibold text-slate-600">Enviando pacote de handshake e validando SSL...</span>
                </div>
              ) : testResult ? (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Handshake Realizado com Sucesso
                    </span>
                    <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                      {testResult.latencyMs} ms
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{testResult.message}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-600">
                  Clique no botão abaixo para disparar um ping HTTPS de validação da API Key e certificado digital associado.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsTestConnectionModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Fechar
              </button>
              <button
                type="button"
                disabled={testingPing}
                onClick={handleExecutePing}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                {testingPing ? 'Testando...' : 'Executar Ping'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
