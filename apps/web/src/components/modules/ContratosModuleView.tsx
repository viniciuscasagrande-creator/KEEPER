import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  FileText,
  FileCheck2,
  FileSignature,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
  DollarSign,
  Download,
  Send,
  Users,
  Award,
  Layers,
  Sparkles,
  X,
  Check,
  Sliders,
  ExternalLink,
  Shield,
  HelpCircle,
  AlertCircle,
  Percent,
} from 'lucide-react';
import {
  contratosClient,
  LegalContract,
  ContratosMetrics,
  ContractStatus,
  ContractType,
  Signatory,
} from '../../services/contratosClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface JurSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const JUR_SUBMENUS: JurSubmenuDef[] = [
  // 1. Visão Geral & Gestão Contratual (4)
  {
    id: 'jur-dashboard',
    label: 'Dashboard Executivo de Contratos',
    group: 'Visão Geral & Gestão Contratual',
    icon: Scale,
    purpose: 'Status de vigências, assinaturas e GMV sob custódia protegida.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'jur-central-contratos',
    label: 'Central de Contratos Ativos',
    group: 'Visão Geral & Gestão Contratual',
    icon: FileText,
    purpose: 'Gestão de instrumentos contratuais vigentes e histórico.',
    badge: '38 Ativos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'jur-vigencia-alertas',
    label: 'Prazos, Vigências & Renovações',
    group: 'Visão Geral & Gestão Contratual',
    icon: Clock,
    purpose: 'Alertas preditivos de vencimentos em 30, 60 e 90 dias.',
    badge: '4 a Vencer',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'jur-metricas-juridicas',
    label: 'Métricas & Indicadores de Conformidade',
    group: 'Visão Geral & Gestão Contratual',
    icon: Award,
    purpose: 'Tempo médio de formalização e índice de renovações contratuais.',
  },

  // 2. Contratos de Bilheteria & Produtores (4)
  {
    id: 'jur-contratos-produtores',
    label: 'Contratos de Prestação de Bilheteria',
    group: 'Contratos de Bilheteria & Produtores',
    icon: FileCheck2,
    purpose: 'Instrumentos jurídicos com produtores de shows e espetáculos.',
  },
  {
    id: 'jur-exclusividade',
    label: 'Cláusulas & Acordos de Exclusividade',
    group: 'Contratos de Bilheteria & Produtores',
    icon: Lock,
    purpose: 'Fidelidade territorial de venda de ingressos e cominações de multa.',
    badge: 'Exclusividade',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'jur-minutas-padrao',
    label: 'Biblioteca de Minutas & Templates',
    group: 'Contratos de Bilheteria & Produtores',
    icon: Layers,
    purpose: 'Minutas padronizadas aprovadas pelo departamento jurídico.',
  },
  {
    id: 'jur-aditivos-alteracoes',
    label: 'Termos Aditivos & Prorrogações',
    group: 'Contratos de Bilheteria & Produtores',
    icon: Sliders,
    purpose: 'Aditamentos de datas, locais, taxas e capacidade de público.',
  },

  // 3. Assinatura Digital & Formalização (4)
  {
    id: 'jur-fluxo-assinaturas',
    label: 'Fila de Assinaturas Digitais',
    group: 'Assinatura Digital & Formalização',
    icon: FileSignature,
    purpose: 'Integração Clicksign, DocuSign e Gov.br com rastreio de signatários.',
    badge: '4 Pendentes',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'jur-signatarios',
    label: 'Gestão de Signatários & Representantes',
    group: 'Assinatura Digital & Formalização',
    icon: Users,
    purpose: 'Poderes de representação societária e procurações ativas.',
  },
  {
    id: 'jur-certificados-digitais',
    label: 'Validação ICP-Brasil & Carimbo do Tempo',
    group: 'Assinatura Digital & Formalização',
    icon: ShieldCheck,
    purpose: 'Integridade criptográfica de assinaturas digitais avançadas.',
  },
  {
    id: 'jur-historico-assinaturas',
    label: 'Trilha de Evidências de Assinatura',
    group: 'Assinatura Digital & Formalização',
    icon: Clock,
    purpose: 'Logs de IP, geolocalização e hashes SHA-256 de formalização.',
  },

  // 4. Garantias, Advance & Compliance (4)
  {
    id: 'jur-garantias-advance',
    label: 'Garantias de Advance & Cauções',
    group: 'Garantias, Advance & Compliance',
    icon: DollarSign,
    purpose: 'Controle de notas promissórias e caução de bilheteria retida.',
  },
  {
    id: 'jur-due-diligence',
    label: 'Due Diligence & Certidões Negativas',
    group: 'Garantias, Advance & Compliance',
    icon: Shield,
    purpose: 'Consulta automatizada CND Federal, Estadual, Municipal e Trabalhista.',
    badge: '96.8% OK',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'jur-retencoes-ecad',
    label: 'Bloqueios & Liberações Jurídicas',
    group: 'Garantias, Advance & Compliance',
    icon: AlertCircle,
    purpose: 'Travas preventivas para alvarás de funcionamento e quitação ECAD.',
  },
  {
    id: 'jur-analise-risco',
    label: 'Classificação de Risco Contratual',
    group: 'Garantias, Advance & Compliance',
    icon: AlertTriangle,
    purpose: 'Score de risco jurídico e histórico de litígios de produtores.',
  },

  // 5. Contencioso & Notificações (4)
  {
    id: 'jur-notificacoes',
    label: 'Notificações Extrajudiciais & Avisos',
    group: 'Contencioso & Notificações',
    icon: Send,
    purpose: 'Comunicações formais de inadimplemento e rescisões.',
  },
  {
    id: 'jur-contencioso',
    label: 'Gestão de Processos & Contencioso',
    group: 'Contencioso & Notificações',
    icon: Scale,
    purpose: 'Acompanhamento de ações cíveis, trabalhistas e Procon.',
  },
  {
    id: 'jur-acordos-judiciais',
    label: 'Termos de Acordo & Transações',
    group: 'Contencioso & Notificações',
    icon: CheckCircle2,
    purpose: 'Formalização de conciliações e parcelamentos judiciais.',
  },
  {
    id: 'jur-assessoria-externa',
    label: 'Escritórios Parceiros & Procurações',
    group: 'Contencioso & Notificações',
    icon: Building2,
    purpose: 'Controle de advogados credenciados e substabelecimentos.',
  },

  // 6. Governança Jurídica & Arquivos (4)
  {
    id: 'jur-repositorio-documental',
    label: 'Repositório Digital de Contratos',
    group: 'Governança Jurídica & Arquivos',
    icon: Layers,
    purpose: 'Armazenamento em PDF/A de longo prazo com OCR pesquisável.',
  },
  {
    id: 'jur-auditoria-juridica',
    label: 'Trilha de Auditoria e Logs de Alteração',
    group: 'Governança Jurídica & Arquivos',
    icon: ShieldCheck,
    purpose: 'Registro imutável de consultas, downloads e alterações.',
    badge: 'Imutável',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'jur-alcadas-juridicas',
    label: 'Alçadas de Assinatura & Pareceres',
    group: 'Governança Jurídica & Arquivos',
    icon: Lock,
    purpose: 'Matriz de competência para assinatura de contratos e aditivos.',
  },
  {
    id: 'jur-config',
    label: 'Configurações do Módulo Jurídico',
    group: 'Governança Jurídica & Arquivos',
    icon: Sliders,
    purpose: 'Parâmetros de notificações, prazos de tolerância e modelos.',
  },
];

export const ContratosModuleView: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const [metrics, setMetrics] = useState<ContratosMetrics | null>(null);
  const [contracts, setContracts] = useState<LegalContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'contratos' | 'assinaturas' | 'garantias' | 'compliance' | 'minutas'
  >('contratos');

  // Search & Filter States
  const [submenuSearch, setSubmenuSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [contractSearch, setContractSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  // Modals
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<LegalContract | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form State
  const [newContractForm, setNewContractForm] = useState({
    title: '',
    producerName: 'Opus Entretenimento Curitiba Ltda',
    producerDocument: '12.345.678/0001-90',
    type: 'BILHETERIA_EXCLUSIVA' as ContractType,
    validFrom: '2026-11-01',
    validUntil: '2027-10-31',
    diskFeeRate: 12.0,
    estimatedGmv: 1500000.0,
    advanceGrantedValue: 100000.0,
    warrantyValue: 150000.0,
    hasExclusivity: true,
    venuesCovered: 'Teatro Positivo (Grande Auditório)',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, c] = await Promise.all([
        contratosClient.getMetrics(),
        contratosClient.listContracts(),
      ]);
      setMetrics(m);
      setContracts(c);
    } catch (err) {
      console.error('Erro ao carregar dados de contratos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync activeSection with tabs
  useEffect(() => {
    if (!activeSection) return;
    if (activeSection === 'jur-dashboard' || activeSection === 'jur-central-contratos' || activeSection === 'jur-vigencia-alertas') setActiveTab('contratos');
    else if (activeSection === 'jur-fluxo-assinaturas' || activeSection === 'jur-signatarios') setActiveTab('assinaturas');
    else if (activeSection === 'jur-garantias-advance') setActiveTab('garantias');
    else if (activeSection === 'jur-due-diligence' || activeSection === 'jur-retencoes-ecad') setActiveTab('compliance');
    else if (activeSection === 'jur-minutas-padrao' || activeSection === 'jur-aditivos-alteracoes') setActiveTab('minutas');
  }, [activeSection]);

  const groups = useMemo(() => {
    const list = Array.from(new Set(JUR_SUBMENUS.map((s) => s.group)));
    return ['todos', ...list];
  }, []);

  const filteredSubmenus = useMemo(() => {
    return JUR_SUBMENUS.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.purpose.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.group.toLowerCase().includes(submenuSearch.toLowerCase());
      const matchesGroup = selectedGroup === 'todos' || item.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [submenuSearch, selectedGroup]);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesText =
        c.title.toLowerCase().includes(contractSearch.toLowerCase()) ||
        c.producerName.toLowerCase().includes(contractSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(contractSearch.toLowerCase()) ||
        c.producerDocument.includes(contractSearch);
      const matchesStatus = statusFilter === 'TODOS' || c.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [contracts, contractSearch, statusFilter]);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await contratosClient.createContract({
        ...newContractForm,
        venuesCovered: newContractForm.venuesCovered.split(',').map((v) => v.trim()),
      });
      setContracts((prev) => [created, ...prev]);
      setIsContractModalOpen(false);
      setNewContractForm({
        title: '',
        producerName: 'Opus Entretenimento Curitiba Ltda',
        producerDocument: '12.345.678/0001-90',
        type: 'BILHETERIA_EXCLUSIVA',
        validFrom: '2026-11-01',
        validUntil: '2027-10-31',
        diskFeeRate: 12.0,
        estimatedGmv: 1500000.0,
        advanceGrantedValue: 100000.0,
        warrantyValue: 150000.0,
        hasExclusivity: true,
        venuesCovered: 'Teatro Positivo (Grande Auditório)',
      });
    } catch (err) {
      console.error('Erro ao criar contrato:', err);
    }
  };

  const handleSignSimulated = async (contractId: string, signatoryEmail: string) => {
    const updated = contracts.map((c) => {
      if (c.id === contractId) {
        const sigs = c.signatures.map((s) =>
          s.email === signatoryEmail ? { ...s, signed: true, signedAt: 'Hoje às 10:30' } : s
        );
        const allSigned = sigs.every((s) => s.signed);
        return {
          ...c,
          signatures: sigs,
          status: allSigned ? ('ACTIVE' as ContractStatus) : c.status,
        };
      }
      return c;
    });
    setContracts(updated);
    if (selectedContract && selectedContract.id === contractId) {
      const cur = updated.find((c) => c.id === contractId);
      if (cur) setSelectedContract(cur);
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
              <Scale className="w-4 h-4" />
              <span>Contratos & Jurídico · DiskIngressos</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestão de Contratos de Bilheteria, Exclusividade & Assinaturas Digitais
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Formalização jurídica de espetáculos e turnês, gestão de cláusulas de exclusividade territorial,
              garantias reais de adiantamento (advance), due diligence de certidões e esteira de assinaturas eletrônicas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
              title="Atualizar contratos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => setActiveTab('minutas')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Modelos de Minuta</span>
            </button>

            <button
              onClick={() => setIsContractModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Contrato</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Scorecards Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Contratos na Carteira</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.activeContracts : '38'} Ativos
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics ? metrics.totalContracts : '42'} instrumentos formalizados</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">GMV Sob Proteção</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? formatBRL(metrics.totalProtectedGmv) : 'R$ 16,3 mi'}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Coberto por instrumentos jurídicos
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Garantias de Advance</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? formatBRL(metrics.totalAdvanceWarranty) : 'R$ 2,45 mi'}
            </div>
            <div className="text-xs text-indigo-700 font-semibold mt-1">
              Cauções e retenções vinculadas
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Assinaturas Pendentes</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <FileSignature className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.pendingSignatures : '4'} Minutas
            </div>
            <div className="text-xs text-amber-700 font-semibold mt-1">
              Clicksign & DocuSign em curso
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Conformidade CND</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.cndCompliancePercent}%` : '96.8%'}
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              Produtores 100% regulares
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
              Central de Acesso Rápido — 24 Submenus de Contratos & Jurídico
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
                placeholder="Buscar funcionalidade jurídica..."
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
                  if (item.id === 'jur-dashboard' || item.id === 'jur-central-contratos' || item.id === 'jur-vigencia-alertas') setActiveTab('contratos');
                  else if (item.id === 'jur-fluxo-assinaturas' || item.id === 'jur-signatarios') setActiveTab('assinaturas');
                  else if (item.id === 'jur-garantias-advance') setActiveTab('garantias');
                  else if (item.id === 'jur-due-diligence' || item.id === 'jur-retencoes-ecad') setActiveTab('compliance');
                  else if (item.id === 'jur-minutas-padrao' || item.id === 'jur-aditivos-alteracoes') setActiveTab('minutas');
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
            onClick={() => setActiveTab('contratos')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contratos'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Central de Contratos Ativos ({contracts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assinaturas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'assinaturas'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>2. Fila de Assinaturas Digitais (Clicksign)</span>
          </button>

          <button
            onClick={() => setActiveTab('garantias')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'garantias'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Garantias & Advance (Cauções)</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Due Diligence & Certidões (CND)</span>
          </button>

          <button
            onClick={() => setActiveTab('minutas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'minutas'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5. Biblioteca de Minutas & Templates</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* TAB 1: CENTRAL DE CONTRATOS */}
          {activeTab === 'contratos' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por código, título, produtor ou CNPJ..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="TODOS">Todos os Status</option>
                    <option value="ACTIVE">Ativo / Vigente</option>
                    <option value="PENDING_SIGNATURE">Pendente de Assinatura</option>
                    <option value="ANALYSIS">Em Análise Jurídica</option>
                    <option value="DRAFT">Minuta / Rascunho</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Exibindo <strong>{filteredContracts.length}</strong> contratos
                  </span>
                  <button
                    onClick={() => setIsContractModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Instrumento</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Contratos */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Código / Instrumento</th>
                      <th className="py-3 px-4">Produtora Parceira</th>
                      <th className="py-3 px-4">Tipo & Exclusividade</th>
                      <th className="py-3 px-4">Vigência</th>
                      <th className="py-3 px-4">Taxa Disk / GMV</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContracts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{c.code}</span>
                            {c.hasExclusivity && (
                              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                                Exclusivo
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 max-w-sm">
                            {c.title}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{c.producerName}</div>
                          <div className="text-[11px] text-slate-500">CNPJ: {c.producerDocument}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {c.type.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-900 font-medium">
                            {c.validFrom} até {c.validUntil}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {c.venuesCovered.join(', ')}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.diskFeeRate}%</div>
                          <div className="text-[11px] text-slate-500">{formatBRL(c.estimatedGmv)}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              c.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'PENDING_SIGNATURE'
                                ? 'bg-indigo-100 text-indigo-800'
                                : c.status === 'ANALYSIS'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.status === 'ACTIVE'
                              ? 'Ativo'
                              : c.status === 'PENDING_SIGNATURE'
                              ? 'Pendente Assinatura'
                              : c.status === 'ANALYSIS'
                              ? 'Em Análise'
                              : 'Rascunho'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setIsDetailsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver ficha jurídica do contrato"
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

          {/* TAB 2: FILA DE ASSINATURAS DIGITAIS */}
          {activeTab === 'assinaturas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Esteira de Assinaturas Eletrônicas (Clicksign / DocuSign / Gov.br)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acompanhamento em tempo real de signatários, evidências de autenticação e validação ICP-Brasil
                  </p>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded-full">
                  Webhook Clicksign Ativo
                </span>
              </div>

              <div className="space-y-3">
                {contracts.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.code}</span>
                          <span className="text-xs text-slate-600 font-medium">— {c.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Produtor: <strong>{c.producerName}</strong> · Praça: {c.venuesCovered.join(', ')}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status === 'ACTIVE' ? '100% Assinado' : 'Aguardando Assinaturas'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {c.signatures.map((sig, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex items-center justify-between ${
                            sig.signed
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-500">{sig.role}</div>
                            <div className="text-xs font-bold">{sig.name}</div>
                            <div className="text-[10px] text-slate-500">{sig.email}</div>
                          </div>

                          <div>
                            {sig.signed ? (
                              <div className="text-right">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                                  <Check className="w-3 h-3" /> Assinado
                                </span>
                                {sig.signedAt && (
                                  <div className="text-[9px] text-emerald-600 mt-0.5">{sig.signedAt}</div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSignSimulated(c.id, sig.email)}
                                className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded transition-colors"
                              >
                                Assinar Agora
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GARANTIAS & ADVANCE */}
          {activeTab === 'garantias' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Garantias Reais & Caução de Bilheteria para Advance
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instrumentos de garantia com retenção na conta de custódia da DiskIngressos
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Segregação Ativa
                  </span>
                </div>

                <div className="border border-slate-200 bg-white rounded-lg overflow-hidden mt-3">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Contrato</th>
                        <th className="py-3 px-4">Produtora</th>
                        <th className="py-3 px-4">Adiantamento Concedido</th>
                        <th className="py-3 px-4">Garantia / Caução</th>
                        <th className="py-3 px-4">Cobertura de Garantia</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contracts.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 px-4 font-bold text-slate-900">{c.code}</td>
                          <td className="py-3 px-4 text-slate-700">{c.producerName}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {formatBRL(c.advanceGrantedValue)}
                          </td>
                          <td className="py-3 px-4 font-bold text-indigo-700">
                            {formatBRL(c.warrantyValue)}
                          </td>
                          <td className="py-3 px-4">
                            {c.advanceGrantedValue > 0 ? (
                              <span className="text-emerald-700 font-bold">
                                {((c.warrantyValue / c.advanceGrantedValue) * 100).toFixed(0)}% Coberto
                              </span>
                            ) : (
                              <span className="text-slate-400">Sem Advance</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Garantia Homologada
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

          {/* TAB 4: DUE DILIGENCE & CNDs */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Due Diligence & Monitoramento de Certidões Negativas (CNDs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conferência automática periódica junto à Receita Federal, Caixa (FGTS), TST (CNDT) e Prefeitura de Curitiba
                  </p>
                </div>
                <button
                  onClick={() => alert('Executando consulta automatizada de certidões via API da Receita e Caixa...')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  Consultar Todas as CNDs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.producerName}</div>
                        <div className="text-[11px] text-slate-500">CNPJ: {c.producerDocument}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.cndStatus === 'REGULAR'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.cndStatus === 'REGULAR' ? 'CND Regular' : 'Pendente de Atualização'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-600">CND Federal / RFB:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Válida
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-600">CRF FGTS:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Válida
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-600">CNDT Trabalhista:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Negativa
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <span className="text-slate-600">ISS Curitiba:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Regular
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BIBLIOTECA DE MINUTAS & TEMPLATES */}
          {activeTab === 'minutas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Modelos Padrão & Templates Jurídicos Homologados
                  </h3>
                  <p className="text-xs text-slate-500">
                    Minutas prontas com cláusulas blindadas de exclusividade, controle de assentos e comodato de catracas
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Contrato de Bilheteria com Exclusividade (V.2026)
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                        Padrão
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Instrumento completo para grandes produtoras e festivais com exclusividade de vendas em todos os canais físicos e online.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Download da minuta DOCX padrão de exclusividade iniciado.')}
                    className="mt-3 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-700" />
                    <span>Baixar Minuta DOCX</span>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Termo Aditivo de Prorrogação ou Data Extra
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                        Aditivo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Modelo rápido para acréscimo de sessão de show, mudança de local de evento ou prorrogação de prazo de vendas.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Download do modelo de Termo Aditivo iniciado.')}
                    className="mt-3 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Baixar Minuta DOCX</span>
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Termo de Comodato de Hardwares & Catracas
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                        Hardwares
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Cessão temporária com seguro contra extravio, danos técnicos e garantia de devolução pós-evento.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Download do modelo de Comodato iniciado.')}
                    className="mt-3 w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-700" />
                    <span>Baixar Minuta DOCX</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: NOVO CONTRATO */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Formalizar Novo Contrato de Bilheteria</h2>
                <p className="text-xs text-slate-500">Criação de instrumento jurídico integrado ao pipeline comercial</p>
              </div>
              <button
                onClick={() => setIsContractModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Instrumento</label>
                <input
                  type="text"
                  required
                  value={newContractForm.title}
                  onChange={(e) => setNewContractForm({ ...newContractForm, title: e.target.value })}
                  placeholder="Ex: Prestação de Serviços de Bilheteria — Turnê Acústica 2026"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Produtora Parceira</label>
                  <input
                    type="text"
                    required
                    value={newContractForm.producerName}
                    onChange={(e) => setNewContractForm({ ...newContractForm, producerName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    required
                    value={newContractForm.producerDocument}
                    onChange={(e) => setNewContractForm({ ...newContractForm, producerDocument: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Contrato</label>
                  <select
                    value={newContractForm.type}
                    onChange={(e) =>
                      setNewContractForm({ ...newContractForm, type: e.target.value as ContractType })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="BILHETERIA_EXCLUSIVA">Bilheteria Exclusiva</option>
                    <option value="BILHETERIA_NAO_EXCLUSIVA">Bilheteria Não Exclusiva</option>
                    <option value="LOCACAO_EQUIPAMENTOS">Locação de Equipamentos / PDVs</option>
                    <option value="PRESTACAO_SERVICOS">Prestação de Serviços Especiais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxa Disk Convencionada (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newContractForm.diskFeeRate}
                    onChange={(e) =>
                      setNewContractForm({ ...newContractForm, diskFeeRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={newContractForm.validFrom}
                    onChange={(e) => setNewContractForm({ ...newContractForm, validFrom: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data Término</label>
                  <input
                    type="date"
                    value={newContractForm.validUntil}
                    onChange={(e) => setNewContractForm({ ...newContractForm, validUntil: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venues / Praças Abrangidas</label>
                <input
                  type="text"
                  value={newContractForm.venuesCovered}
                  onChange={(e) => setNewContractForm({ ...newContractForm, venuesCovered: e.target.value })}
                  placeholder="Ex: Teatro Positivo, Live Curitiba"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsContractModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Gerar Minuta & Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FICHA JURÍDICA DO CONTRATO */}
      {isDetailsModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedContract.code}</h2>
                  <p className="text-xs text-slate-500">{selectedContract.title}</p>
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
                <span className="text-[10px] text-slate-500 uppercase font-bold">Vigência</span>
                <div className="text-xs font-bold text-slate-900">{selectedContract.validUntil}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Taxa Disk</span>
                <div className="text-xs font-bold text-slate-900">{selectedContract.diskFeeRate}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">GMV Estimado</span>
                <div className="text-xs font-bold text-emerald-700">{formatBRL(selectedContract.estimatedGmv)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Garantia Caução</span>
                <div className="text-xs font-bold text-indigo-700">{formatBRL(selectedContract.warrantyValue)}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-blue-700" />
                <span>Signatários Eletrônicos Registrados</span>
              </h4>

              <div className="space-y-2">
                {selectedContract.signatures.map((sig, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800">{sig.name}</span>
                      <span className="text-slate-500"> ({sig.role})</span>
                    </div>
                    {sig.signed ? (
                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Assinado em {sig.signedAt || 'Registro ICP'}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[10px]">Pendente</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => alert(`Baixando cópia oficial autenticada do contrato ${selectedContract.code}...`)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar PDF/A</span>
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
