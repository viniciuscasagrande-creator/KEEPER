import React, { useState, useEffect, useMemo } from 'react';
import {
  HardHat,
  Activity,
  Layers,
  Wifi,
  Radio,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Server,
  Zap,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  AlertTriangle,
  FileCheck,
  QrCode,
  ArrowRight,
  ChevronRight,
  BatteryCharging,
  Maximize2,
  Award,
  X,
  Play,
  ArrowLeft,
} from 'lucide-react';
import {
  projetosClient,
  EventProject,
  ProjetosMetrics,
  EventProjectStatus,
  VenueType,
} from '../../services/projetosClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface ProjSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const PROJ_SUBMENUS: ProjSubmenuDef[] = [
  // 1. Visão Geral & Central de Operações de Eventos (4)
  {
    id: 'proj-dashboard',
    label: 'Dashboard Executivo de Operações & Shows',
    group: 'Visão Geral & Operações',
    icon: Activity,
    purpose: 'Visão unificada de eventos simultâneos, catracas e staff de campo.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'proj-central-eventos',
    label: 'Central de Projetos de Eventos',
    group: 'Visão Geral & Operações',
    icon: Layers,
    purpose: 'Gestão operacional de turnês, shows em estádios e teatros.',
    badge: '4 Projetos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'proj-calendario-operacoes',
    label: 'Calendário Operacional & Cronograma D-N',
    group: 'Visão Geral & Operações',
    icon: Calendar,
    purpose: 'Linha do tempo de montagem, passagens de cabos e passagens de som.',
  },
  {
    id: 'proj-kpis-operacionais',
    label: 'Indicadores de Throughput & Vazão',
    group: 'Visão Geral & Operações',
    icon: TrendingUp,
    purpose: 'Validações por minuto por catraca e tempo médio de fila.',
  },

  // 2. Infraestrutura Técnica & Conectividade (4)
  {
    id: 'proj-redes-conexoes',
    label: 'Conectividade, Links & Starlink',
    group: 'Infraestrutura Técnica & Redes',
    icon: Wifi,
    purpose: 'Links de fibra dedicada, redundância satélite e roteamento failover.',
    badge: 'Redundante',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'proj-servidores-locais',
    label: 'Servidores de Contingência (Edge Cache)',
    group: 'Infraestrutura Técnica & Redes',
    icon: Server,
    purpose: 'Servidores locais de alta performance para validação offline.',
    badge: 'Offline OK',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'proj-mapas-layout',
    label: 'Layout de Portarias & Catracas',
    group: 'Infraestrutura Técnica & Redes',
    icon: MapPin,
    purpose: 'Plantas baixas com distribuição de portões, PDVs e catracas.',
  },
  {
    id: 'proj-testes-carga',
    label: 'Testes de Carga & Simulação',
    group: 'Infraestrutura Técnica & Redes',
    icon: Cpu,
    purpose: 'Simulações de pico de leitura de QR Codes e RFID.',
  },

  // 3. Equipes de Campo & Escalas de Operação (4)
  {
    id: 'proj-escalas-campo',
    label: 'Escalas de Operadores & Técnicos',
    group: 'Equipes de Campo & Escalas',
    icon: Users,
    purpose: 'Alocação de bilheteiros, coordenadores e técnicos de suporte.',
    badge: '110 Staff',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'proj-credenciamento-staff',
    label: 'Credenciamento & Crachás de Produção',
    group: 'Equipes de Campo & Escalas',
    icon: QrCode,
    purpose: 'Emissão de crachás térmicos com QR Code para staff e técnicos.',
  },
  {
    id: 'proj-checkin-equipe',
    label: 'Ponto Eletrônico & Check-in de Campo',
    group: 'Equipes de Campo & Escalas',
    icon: CheckCircle2,
    purpose: 'Registro geolocalizado de entrada e saída das equipes no local.',
  },
  {
    id: 'proj-treinamento-operadores',
    label: 'Treinamento & Manuais de Contingência',
    group: 'Equipes de Campo & Escalas',
    icon: FileCheck,
    purpose: 'Procedimentos operacionais de contingência e atendimento ao cliente.',
  },

  // 4. Vistorias, Alvarás & Licenças Técnicas (4)
  {
    id: 'proj-alvaras-prefeitura',
    label: 'Alvarás de Funcionamento & Autorizações',
    group: 'Vistorias & Licenças',
    icon: ShieldCheck,
    purpose: 'Autorizações municipais de Curitiba e prefeituras parceiras.',
    badge: '100% Regular',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'proj-laudos-bombeiros',
    label: 'Laudos do Corpo de Bombeiros & Segurança',
    group: 'Vistorias & Licenças',
    icon: ShieldCheck,
    purpose: 'Vistoria técnica de rotas de fuga, extintores e brigada.',
  },
  {
    id: 'proj-seguranca-policia',
    label: 'Plano de Segurança & Ofícios PM/Setran',
    group: 'Vistorias & Licenças',
    icon: ShieldCheck,
    purpose: 'Comunicação oficial à Polícia Militar, Guarda Municipal e trânsito.',
  },
  {
    id: 'proj-checklists-vistoria',
    label: 'Checklist Geral de Liberação Pré-Abertura',
    group: 'Vistorias & Licenças',
    icon: CheckCircle2,
    purpose: 'Auditoria de liberação final antes da abertura dos portões.',
  },

  // 5. Monitoramento em Tempo Real (D-0) (4)
  {
    id: 'proj-monitor-portarias',
    label: 'Monitor em Tempo Real de Portões',
    group: 'Monitoramento D-0 Ao Vivo',
    icon: Activity,
    purpose: 'Fluxo ao vivo de validações por segundo em cada catraca.',
    badge: 'Ao Vivo',
    badgeColor: 'bg-red-100 text-red-800',
  },
  {
    id: 'proj-incidentes-campo',
    label: 'Ocorrências de Campo & Chamados Técnicos',
    group: 'Monitoramento D-0 Ao Vivo',
    icon: AlertTriangle,
    purpose: 'Chamados imediatos para troca de bobina, PDA ou rede.',
  },
  {
    id: 'proj-fluxo-publico',
    label: 'Curva de Entrada de Público & Picos',
    group: 'Monitoramento D-0 Ao Vivo',
    icon: TrendingUp,
    purpose: 'Gráfico em tempo real de entrada versus ingressos vendidos.',
  },
  {
    id: 'proj-telemetria-bateria',
    label: 'Telemetria de PDVs e Bateria de PDAs',
    group: 'Monitoramento D-0 Ao Vivo',
    icon: BatteryCharging,
    purpose: 'Monitoramento do nível de bateria e sinal Wi-Fi dos aparelhos móveis.',
  },

  // 6. Desmobilização, Borderô Físico & Relatórios (4)
  {
    id: 'proj-desmobilizacao',
    label: 'Checklist de Recolhimento & Desmontagem',
    group: 'Desmobilização & Pós-Show',
    icon: Sliders,
    purpose: 'Inventário reverso de catracas, cabos, switches e leitores.',
  },
  {
    id: 'proj-relatorio-pos-evento',
    label: 'Relatório Pós-Show & Incidentes',
    group: 'Desmobilização & Pós-Show',
    icon: FileCheck,
    purpose: 'Consolidação de números de portaria, falhas e melhorias.',
  },
  {
    id: 'proj-auditoria-operacional',
    label: 'Trilha de Auditoria de Liberações',
    group: 'Desmobilização & Pós-Show',
    icon: Award,
    purpose: 'Registro imutável dos horários de abertura e fechamento de portões.',
  },
  {
    id: 'proj-config',
    label: 'Parâmetros Técnicos & Alçadas',
    group: 'Desmobilização & Pós-Show',
    icon: Sliders,
    purpose: 'Tolerâncias de validação, limites de throughput e regras de acesso.',
  },
];

export const ProjetosModuleView: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const [metrics, setMetrics] = useState<ProjetosMetrics | null>(null);
  const [projects, setProjects] = useState<EventProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionId, setSectionId] = useState<string>(activeSection || 'proj-dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'eventos' | 'redes' | 'escalas' | 'monitor' | 'alvaras' | 'calendario' | 'kpis'
  >('eventos');

  // Search & Filter
  const [submenuSearch, setSubmenuSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EventProject | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form State
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    venueName: 'Teatro Positivo (Grande Auditório)',
    venueType: 'TEATRO' as VenueType,
    eventDate: '2026-11-25',
    doorsOpenTime: '19:00',
    expectedAudience: 2400,
    turnstilesTotal: 6,
    pdvsTotal: 4,
    leadCoordinator: 'Marcio Silva (Coord. Geral Operações)',
    staffAssignedCount: 12,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([
        projetosClient.getMetrics(),
        projetosClient.listProjects(),
      ]);
      setMetrics(m);
      setProjects(p);
    } catch (err) {
      console.error('Erro ao carregar dados de projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync activeSection with internal sectionId
  useEffect(() => {
    if (activeSection) {
      setSectionId(activeSection);
    }
  }, [activeSection]);

  const handleSelectSection = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSubmenu = useMemo(() => {
    return PROJ_SUBMENUS.find((s) => s.id === sectionId) || PROJ_SUBMENUS[0];
  }, [sectionId]);

  const groups = useMemo(() => {
    const list = Array.from(new Set(PROJ_SUBMENUS.map((s) => s.group)));
    return ['todos', ...list];
  }, []);

  const filteredSubmenus = useMemo(() => {
    return PROJ_SUBMENUS.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.purpose.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.group.toLowerCase().includes(submenuSearch.toLowerCase());
      const matchesGroup = selectedGroup === 'todos' || item.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [submenuSearch, selectedGroup]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesText =
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.venueName.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.code.toLowerCase().includes(projectSearch.toLowerCase());
      const matchesStatus = statusFilter === 'TODOS' || p.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [projects, projectSearch, statusFilter]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await projetosClient.createProject(newProjectForm);
      setProjects((prev) => [created, ...prev]);
      setIsNewProjectModalOpen(false);
      setNewProjectForm({
        title: '',
        venueName: 'Teatro Positivo (Grande Auditório)',
        venueType: 'TEATRO',
        eventDate: '2026-11-25',
        doorsOpenTime: '19:00',
        expectedAudience: 2400,
        turnstilesTotal: 6,
        pdvsTotal: 4,
        leadCoordinator: 'Marcio Silva (Coord. Geral Operações)',
        staffAssignedCount: 12,
      });
    } catch (err) {
      console.error('Erro ao cadastrar projeto:', err);
    }
  };

  const handleSimulateCheckin = async (projectId: string) => {
    try {
      const updated = await projetosClient.simulateCheckin(projectId, 15);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...updated } : p)));
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...updated });
      }
    } catch (err) {
      console.error('Erro ao simular checkin:', err);
    }
  };

  const renderEventosTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por código, evento ou praça..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="EM_OPERACAO">Em Operação (Ao Vivo)</option>
            <option value="MONTAGEM">Em Montagem Técnica</option>
            <option value="PLANEJAMENTO">Em Planejamento</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Exibindo <strong>{filteredProjects.length}</strong> projetos de eventos
          </span>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Tabela de Projetos */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Código / Espetáculo</th>
              <th className="py-3 px-4">Praça / Venue</th>
              <th className="py-3 px-4">Data & Horário</th>
              <th className="py-3 px-4">Capacidade / Catracas</th>
              <th className="py-3 px-4">Coordenação / Staff</th>
              <th className="py-3 px-4">Status Operacional</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{p.code}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 max-w-sm">
                    {p.title}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{p.venueName}</div>
                  <span className="text-[10px] text-slate-500">{p.venueType}</span>
                </td>

                <td className="py-3 px-4">
                  <div className="text-slate-900 font-medium">{p.eventDate}</div>
                  <div className="text-[10px] text-slate-500">Portões: {p.doorsOpenTime}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{p.expectedAudience.toLocaleString()} pessoas</div>
                  <div className="text-[11px] text-slate-500">{p.turnstilesTotal} catracas · {p.pdvsTotal} PDVs</div>
                </td>

                <td className="py-3 px-4">
                  <div className="text-slate-900 font-medium">{p.leadCoordinator.split('(')[0]}</div>
                  <div className="text-[10px] text-blue-700 font-semibold">{p.staffAssignedCount} operadores</div>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      p.status === 'EM_OPERACAO'
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : p.status === 'MONTAGEM'
                        ? 'bg-amber-100 text-amber-800'
                        : p.status === 'PLANEJAMENTO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.status === 'EM_OPERACAO'
                      ? '● Ao Vivo (Portas Abertas)'
                      : p.status === 'MONTAGEM'
                      ? 'Montagem Técnica'
                      : p.status === 'PLANEJAMENTO'
                      ? 'Planejamento D-N'
                      : 'Concluído'}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedProject(p);
                      setIsDetailsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver ficha técnica da operação"
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
  );

  const renderMonitorTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-950">
              Painel de Portaria em Tempo Real — Evento Ativo
            </h3>
            <p className="text-xs text-red-800">
              Teatro Fernanda Montenegro — Noite de Comédia Stand-Up & Gravação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">
              488 / 520 Validados
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              93.8% de Ocupação
            </div>
          </div>
          <button
            onClick={() => {
              const live = projects.find((p) => p.status === 'EM_OPERACAO');
              if (live) {
                handleSimulateCheckin(live.id);
                showNotification('Leitura simulada na portaria ativa!');
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            + Registrar Leitura
          </button>
        </div>
      </div>

      {/* Grid dos Portões e Catracas do Evento Ativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Catraca 01 (Foyer Entrada A)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Online
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">182 pessoas</div>
          <div className="text-xs text-slate-500 mt-1">Velocidade: 0.58s / leitor óptico</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-600 h-full w-[95%]" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Catraca 02 (Foyer Entrada B)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Online
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">194 pessoas</div>
          <div className="text-xs text-slate-500 mt-1">Velocidade: 0.62s / leitor óptico</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-600 h-full w-[98%]" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Catraca 03 (Acessibilidade)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Online
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">112 pessoas</div>
          <div className="text-xs text-slate-500 mt-1">Velocidade: 0.70s / leitor óptico</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-600 h-full w-[70%]" />
          </div>
        </div>
      </div>

      {/* Informações Técnicas de Tolerância */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong>Contingência de Duplicidade Ativa:</strong> Todos os leitores sincronizam via protocolo UDP local com o mini-servidor Edge Cache da DiskIngressos em menos de 15ms. Qualquer tentativa de ingresso reutilizado é bloqueada instantaneamente na catraca física mesmo se a internet da praça estiver instável.
        </div>
      </div>
    </div>
  );

  const renderRedesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Infraestrutura de Redes Redundantes & Starlink
          </h3>
          <p className="text-xs text-slate-500">
            Links contratados para arenas, estádios e teatros com tolerância a falhas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900">
                Pedreira Paulo Leminski — Links de Alta Densidade
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Operacional
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Claro Fibra Dedicada 1Gbps</div>
                <div className="text-[10px] text-slate-500">Latência: 6ms · Rota Curitiba Datacenter</div>
              </div>
              <span className="text-emerald-700 font-bold text-[10px]">Primário Ativo</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Starlink Satélite Gen 3 (250 Mbps)</div>
                <div className="text-[10px] text-slate-500">Latência: 32ms · Antena Robusta Externa</div>
              </div>
              <span className="text-indigo-700 font-bold text-[10px]">Hot Standby</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Vivo 5G Industrial Failover (180 Mbps)</div>
                <div className="text-[10px] text-slate-500">Modem Teltonika com Chip M2M Dedicado</div>
              </div>
              <span className="text-slate-600 font-bold text-[10px]">Terciário</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-bold text-slate-900">
                Servidores Locais de Contingência (Edge Cache)
              </span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
              Sincronizado
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Base Local de QR Codes:</span>
              <strong className="text-slate-900">22.500 chaves criptográficas SHA-256</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tempo de Sincronização:</span>
              <strong className="text-emerald-700">A cada 30 segundos</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Autonomia 100% Offline:</span>
              <strong className="text-blue-700">72 horas contínuas</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">No-break de Campo:</span>
              <strong className="text-emerald-700">Nobreak Senoidal 3kVA (4h bateria)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEscalasTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Escalas Operacionais de Campo & Credenciamento
          </h3>
          <p className="text-xs text-slate-500">
            Distribuição de postos por portão, horário de apresentação e crachás de acesso
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Função / Posto de Trabalho</th>
              <th className="py-3 px-4">Evento Vinculado</th>
              <th className="py-3 px-4">Efetivo Escalado</th>
              <th className="py-3 px-4">Horário de Apresentação</th>
              <th className="py-3 px-4">Responsável Técnico</th>
              <th className="py-3 px-4 text-right">Status do Ponto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">Operadores de Catracas Eletrônicas</td>
              <td className="py-3 px-4 text-slate-700">Pedreira Paulo Leminski</td>
              <td className="py-3 px-4 font-bold text-blue-700">28 operadores</td>
              <td className="py-3 px-4 text-slate-600">D-0 às 12:00</td>
              <td className="py-3 px-4 text-slate-700">Luciano Ferraz</td>
              <td className="py-3 px-4 text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Confirmado
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">Operadores de Caixa de Bilheteria Local</td>
              <td className="py-3 px-4 text-slate-700">Pedreira Paulo Leminski</td>
              <td className="py-3 px-4 font-bold text-blue-700">18 caixas</td>
              <td className="py-3 px-4 text-slate-600">D-0 às 11:30</td>
              <td className="py-3 px-4 text-slate-700">Mariana Silveira</td>
              <td className="py-3 px-4 text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Confirmado
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-3 px-4 font-bold text-slate-900">Técnicos de Suporte de TI & Redes</td>
              <td className="py-3 px-4 text-slate-700">Teatro Positivo & Pedreira</td>
              <td className="py-3 px-4 font-bold text-blue-700">8 engenheiros / técnicos</td>
              <td className="py-3 px-4 text-slate-600">D-1 às 08:00</td>
              <td className="py-3 px-4 text-slate-700">Marcio Silva</td>
              <td className="py-3 px-4 text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Em Campo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlvarasTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Vistorias Técnicas, Alvarás Municipais & Corpo de Bombeiros
          </h3>
          <p className="text-xs text-slate-500">
            Auditoria compulsória de documentação para abertura legal dos portões de acesso
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{p.title}</div>
                <div className="text-[11px] text-slate-500">{p.venueName} · {p.eventDate}</div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                100% Liberado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Alvará Prefeitura:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Deferido
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Laudo Bombeiros:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aprovado
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Ofício PM / Setran:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Protocolado
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between">
                <span className="text-slate-600">Contingência Edge:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Testado
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendarioTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Cronograma de Montagem & Contagem Regressiva (D-5 a D-0)</h3>
          <p className="text-xs text-slate-500">Fluxo cronológico de preparação técnica para os próximos espetáculos</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
          Próximo: Pedreira Paulo Leminski
        </span>
      </div>

      <div className="space-y-4">
        {[
          { day: 'D-5', time: '09:00', title: 'Vistoria Técnica de Campo & Levantamento de Infraestrutura', desc: 'Reunião no local com produção técnica, medição de aterramento e pontos de energia.', status: 'CONCLUIDO' },
          { day: 'D-3', time: '08:00', title: 'Passagem de Cabeamento Estruturado & Antenas Starlink', desc: 'Lançamento de fibra óptica blindada, fixação das antenas Starlink no alto das portarias.', status: 'CONCLUIDO' },
          { day: 'D-2', time: '10:00', title: 'Montagem de Catracas Eletrônicas & Mini-Servidor Edge Cache', desc: 'Posicionamento das 47 catracas, configuração dos switches industriais e IP estático.', status: 'CONCLUIDO' },
          { day: 'D-1', time: '14:00', title: 'Homologação de Alvarás, Teste de Bombeiros & Estresse de Leitura', desc: 'Auditoria compulsória, teste de 1.000 validações/minuto offline no Edge Server local.', status: 'EM_ANDAMENTO' },
          { day: 'D-0', time: '13:00', title: 'Briefing Operacional de Equipes & Entrega de PDAs', desc: 'Apresentação de 110 colaboradores, distribuição de rádios comunicadores e crachás.', status: 'PENDENTE' },
          { day: 'D-0', time: '17:00', title: 'Abertura Oficial dos Portões & Monitoramento ao Vivo', desc: 'Acionamento do painel D-0, telemetria de catracas e suporte presencial imediato.', status: 'PENDENTE' },
          { day: 'D-0', time: '23:30', title: 'Fechamento de Portaria, Borderô Físico & Desmobilização', desc: 'Conferência de cortesias, encerramento de catracas e inventário reverso de equipamentos.', status: 'PENDENTE' },
        ].map((step, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
              step.status === 'CONCLUIDO' ? 'bg-emerald-100 text-emerald-800' :
              step.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              {step.day} · {step.time}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  step.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-700' :
                  step.status === 'EM_ANDAMENTO' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKpisOperacionais = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Latência Starlink</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">28 ms</div>
          <span className="text-xs text-slate-500 mt-1 block">Sem perda de pacotes</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Capacidade de Pico</span>
          <div className="text-2xl font-black text-blue-700 mt-2">7.200 /h</div>
          <span className="text-xs text-slate-500 mt-1 block">Validações por hora</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bateria Média PDAs</span>
          <div className="text-2xl font-black text-purple-700 mt-2">94%</div>
          <span className="text-xs text-purple-700 font-semibold mt-1 block">38 coletores ativos</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fila Offline Edge</span>
          <div className="text-2xl font-black text-slate-900 mt-2">0 pendente</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">100% sincronizado</span>
        </div>
      </div>
    </div>
  );

  const renderGenericProjSubmenu = (item: ProjSubmenuDef) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Operações em {item.label}</span>
          <div className="text-2xl font-black text-slate-900 mt-2">100% Homologado</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Protocolo operacional DiskIngressos</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Equipamentos Vinculados</span>
          <div className="text-2xl font-black text-blue-700 mt-2">47 Unidades</div>
          <span className="text-xs text-slate-500 mt-1 block">Alocadas na praça principal</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status de Prontidão</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">Pronto para Show</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Auditoria técnica aprovada</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">{item.label}</h3>
            <p className="text-xs text-slate-500">{item.purpose}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification(`Relatório operacional de ${item.label} gerado com sucesso!`)}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Exportar Relatório Técnico
            </button>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              + Novo Registro
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Referência Técnica</th>
                <th className="py-3 px-4">Espetáculo / Local</th>
                <th className="py-3 px-4">Responsável em Campo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 4).map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {p.code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{p.title}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{p.venueName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{p.leadCoordinator.split('(')[0]}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedProject(p);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-blue-700 hover:underline font-bold"
                    >
                      Ficha Técnica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const isDashboardHub = sectionId === 'proj-dashboard';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {isDashboardHub ? (
        <>
          {/* 1. Header do Módulo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <HardHat className="w-4 h-4" />
              <span>Projetos & Operações de Campo · DiskIngressos</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Central de Projetos, Conectividade & Operações de Campo
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Engenharia de campo para controle de acesso, dimensionamento de catracas eletrônicas,
              links redundantes de fibra e Starlink, servidores locais offline (Edge Cache) e monitoramento ao vivo no dia do show.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
              title="Atualizar projetos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => {
                const live = projects.find((p) => p.status === 'EM_OPERACAO');
                if (live) handleSimulateCheckin(live.id);
                else if (projects.length > 0) handleSimulateCheckin(projects[0].id);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300 shadow-2xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simular Check-in (+15)</span>
            </button>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Scorecards Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Projetos de Eventos</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.totalProjects : '22'}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics ? metrics.liveEventsToday : '1'} evento ao vivo hoje</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Catracas em Campo</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <HardHat className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.turnstilesDeployed : '47'} Catracas
            </div>
            <div className="text-xs text-indigo-700 font-semibold mt-1">
              Conectadas e monitoradas
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Equipe Operacional</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.staffInField : '110'} Pessoas
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              Supervisores, caixas e técnicos
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Throughput de Portaria</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.avgValidationSpeedSec}s` : '0.65s'}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              Tempo médio por QR Code
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Conectividade & Redes</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Wifi className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              Fibra + Satélite
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              100% Starlink redundante
            </div>
          </div>
        </div>
      </div>

      {/* 3. Submenu Hub & Quick Navigation (24 Submenus) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-bold text-slate-900">
              Central de Acesso Rápido — 24 Submenus de Projetos
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              {filteredSubmenus.length} de 24
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar funcionalidade de infraestrutura..."
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
            const isCurrent = sectionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
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
            onClick={() => setActiveTab('eventos')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'eventos'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Central de Projetos de Eventos ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-red-600" />
            <span>2. Monitor D-0 em Tempo Real (Portarias)</span>
          </button>

          <button
            onClick={() => setActiveTab('redes')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'redes'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>3. Conectividade, Redes & Starlink</span>
          </button>

          <button
            onClick={() => setActiveTab('escalas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'escalas'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Escalas de Campo & Staff</span>
          </button>

          <button
            onClick={() => setActiveTab('alvaras')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'alvaras'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>5. Vistorias, Alvarás & Bombeiros</span>
          </button>

          <button
            onClick={() => setActiveTab('calendario')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'calendario'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>6. Cronograma D-N</span>
          </button>

          <button
            onClick={() => setActiveTab('kpis')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>7. Telemetria & KPIs</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'eventos' && renderEventosTab()}
          {activeTab === 'monitor' && renderMonitorTab()}
          {activeTab === 'redes' && renderRedesTab()}
          {activeTab === 'escalas' && renderEscalasTab()}
          {activeTab === 'alvaras' && renderAlvarasTab()}
          {activeTab === 'calendario' && renderCalendarioTab()}
          {activeTab === 'kpis' && renderKpisOperacionais()}
        </div>
      </div>
    </>
  ) : (
    /* DEDICATED SCREEN VIEW FOR SPECIFIC SUBMENU */
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectSection('proj-dashboard')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Hub de Projetos</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Projetos & Infraestrutura · {currentSubmenu?.group || 'Módulo'}
                </span>
                {currentSubmenu?.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentSubmenu.badgeColor || 'bg-blue-100 text-blue-800'}`}>
                    {currentSubmenu.badge}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                {currentSubmenu?.icon && React.createElement(currentSubmenu.icon, { className: 'w-6 h-6 text-blue-700' })}
                <span>{currentSubmenu?.label || 'Visualização Dedicada'}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {currentSubmenu?.purpose || 'Planejamento e controle de campo para controle de acesso.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const live = projects.find((p) => p.status === 'EM_OPERACAO');
                if (live) handleSimulateCheckin(live.id);
                else if (projects.length > 0) handleSimulateCheckin(projects[0].id);
                showNotification('Simulação de check-in efetuada com sucesso!');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors border border-emerald-300 shadow-2xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simular Check-in (+15)</span>
            </button>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED SUBMENU CONTENT */}
      {(sectionId === 'proj-central-eventos' || sectionId === 'proj-dimensionamento-catracas' || sectionId === 'proj-dimensionamento-pdvs' || sectionId === 'proj-mapas-layout') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderEventosTab()}
        </div>
      )}
      {(sectionId === 'proj-monitor-portarias' || sectionId === 'proj-incidentes-campo' || sectionId === 'proj-fluxo-publico' || sectionId === 'proj-telemetria-bateria') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderMonitorTab()}
        </div>
      )}
      {(sectionId === 'proj-redes-conexoes' || sectionId === 'proj-links-redundantes' || sectionId === 'proj-servidores-locais' || sectionId === 'proj-switches-roteadores') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderRedesTab()}
        </div>
      )}
      {(sectionId === 'proj-escalas-campo' || sectionId === 'proj-credenciamento-staff' || sectionId === 'proj-ponto-geolocalizado' || sectionId === 'proj-treinamento-operadores') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderEscalasTab()}
        </div>
      )}
      {(sectionId === 'proj-alvaras-prefeitura' || sectionId === 'proj-laudos-bombeiros' || sectionId === 'proj-seguranca-policia' || sectionId === 'proj-checklists-vistoria') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderAlvarasTab()}
        </div>
      )}
      {sectionId === 'proj-calendario-operacoes' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderCalendarioTab()}
        </div>
      )}
      {sectionId === 'proj-kpis' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderKpisOperacionais()}
        </div>
      )}
      {![
        'proj-central-eventos', 'proj-dimensionamento-catracas', 'proj-dimensionamento-pdvs', 'proj-mapas-layout',
        'proj-monitor-portarias', 'proj-incidentes-campo', 'proj-fluxo-publico', 'proj-telemetria-bateria',
        'proj-redes-conexoes', 'proj-links-redundantes', 'proj-servidores-locais', 'proj-switches-roteadores',
        'proj-escalas-campo', 'proj-credenciamento-staff', 'proj-ponto-geolocalizado', 'proj-treinamento-operadores',
        'proj-alvaras-prefeitura', 'proj-laudos-bombeiros', 'proj-seguranca-policia', 'proj-checklists-vistoria',
        'proj-calendario-operacoes', 'proj-kpis',
      ].includes(sectionId) && renderGenericProjSubmenu(currentSubmenu)}
    </div>
  )}

      {/* MODAL 1: NOVO PROJETO DE EVENTO */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Novo Projeto Operacional de Show</h2>
                <p className="text-xs text-slate-500">Planejamento técnico de bilheteria e portarias de acesso</p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Espetáculo / Evento</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  placeholder="Ex: Turnê Acústica — Show Extra"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Praça / Venue</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.venueName}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, venueName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Local</label>
                  <select
                    value={newProjectForm.venueType}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, venueType: e.target.value as VenueType })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="TEATRO">Teatro</option>
                    <option value="ARENA_ABERTA">Arena Aberta</option>
                    <option value="CASA_SHOWS">Casa de Shows</option>
                    <option value="ESTADIO">Estádio</option>
                    <option value="CENTRO_CONVENCOES">Centro de Convenções</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data do Evento</label>
                  <input
                    type="date"
                    value={newProjectForm.eventDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, eventDate: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horário de Portões</label>
                  <input
                    type="time"
                    value={newProjectForm.doorsOpenTime}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, doorsOpenTime: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Público Estimado</label>
                  <input
                    type="number"
                    value={newProjectForm.expectedAudience}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, expectedAudience: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catracas</label>
                  <input
                    type="number"
                    value={newProjectForm.turnstilesTotal}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, turnstilesTotal: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PDVs Físicos</label>
                  <input
                    type="number"
                    value={newProjectForm.pdvsTotal}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, pdvsTotal: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Criar Projeto Operacional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FICHA TÉCNICA DO PROJETO */}
      {isDetailsModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedProject.code}</h2>
                  <p className="text-xs text-slate-500">{selectedProject.title}</p>
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
                <span className="text-[10px] text-slate-500 uppercase font-bold">Praça</span>
                <div className="text-xs font-bold text-slate-900">{selectedProject.venueName}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Data</span>
                <div className="text-xs font-bold text-slate-900">{selectedProject.eventDate}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Público Estimado</span>
                <div className="text-xs font-bold text-emerald-700">
                  {selectedProject.expectedAudience.toLocaleString()} pessoas
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Catracas</span>
                <div className="text-xs font-bold text-blue-700">{selectedProject.turnstilesTotal} unidades</div>
              </div>
            </div>

            {/* Portões */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span>Portarias de Acesso & Vazão Planejada</span>
              </h4>
              <div className="space-y-2">
                {selectedProject.gates.map((g) => (
                  <div key={g.gateId} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900">{g.name}</span>
                      <span className="text-slate-500"> ({g.turnstilesCount} catracas)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{g.throughputPerHour} pessoas/hora</span>
                      <span className="text-[10px] text-emerald-700 ml-2 font-semibold">● {g.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
              >
                Fechar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
