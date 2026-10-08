import React, { useState, useEffect, useMemo } from 'react';
import {
  Receipt,
  FileText,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  RefreshCw,
  Plus,
  Filter,
  Download,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Building2,
  FileCheck,
  FileMinus,
  Calculator,
  Sliders,
  CalendarClock,
  Landmark,
  Layers,
  Send,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Lock,
  Unlock,
  PanelRight,
  PanelLeft,
  Sun,
  Moon,
  Info,
} from 'lucide-react';
import { fiscalClient, FiscalDashboardResponse, FiscalInvoice } from '../../services/fiscalClient';

export interface FiscalSubmenuDef {
  id: string;
  label: string;
  group: 'Gestão Fiscal' | 'Tributos e Apurações' | 'Obrigações Acessórias' | 'Operações Disk e Eventos' | 'Controle e Auditoria';
  icon: React.ElementType;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const FISCAL_SUBMENUS: FiscalSubmenuDef[] = [
  // 1. Gestão Fiscal (5)
  { id: 'fisc-dashboard-fiscal', label: 'Dashboard Fiscal', group: 'Gestão Fiscal', icon: Receipt, purpose: 'Visão executiva consolidada de tributos, documentos fiscais e regularidade CND.', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'fisc-central-de-documentos-fiscais', label: 'Central de Documentos Fiscais', group: 'Gestão Fiscal', icon: FileText, purpose: 'Repositório de NFS-e, NF-e de insumos PDV, borderôs e documentos fiscais eletrônicos.' },
  { id: 'fisc-emissao-de-notas-fiscais', label: 'Emissão de Notas Fiscais', group: 'Gestão Fiscal', icon: Plus, purpose: 'Emissão oficial de NFS-e sobre comissões e taxas de intermediação de eventos Disk.', badge: 'NFS-e', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'fisc-notas-recebidas', label: 'Notas Recebidas', group: 'Gestão Fiscal', icon: Download, purpose: 'Notas fiscais de prestadores de serviços, infraestrutura cloud e fornecedores da Disk.' },
  { id: 'fisc-cancelamento-e-correcao-de-notas', label: 'Cancelamento e Correção de Notas', group: 'Gestão Fiscal', icon: FileMinus, purpose: 'Cancelamentos homologados e emissão de Cartas de Correção Eletrônica (CC-e).' },

  // 2. Tributos e Apurações (7)
  { id: 'fisc-apuracao-de-tributos', label: 'Apuração de Tributos', group: 'Tributos e Apurações', icon: Calculator, purpose: 'Apuração mensal de PIS, COFINS, IRPJ, CSLL e ISSQN sob regime de Lucro Real.', badge: 'Out/26', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'fisc-retencoes-tributarias', label: 'Retenções Tributárias', group: 'Tributos e Apurações', icon: Sliders, purpose: 'Retenções na fonte efetuadas (CSRF 4,65%, IRRF 1,5%) e sofridas de tomadores.' },
  { id: 'fisc-iss-e-servicos', label: 'ISS e Serviços', group: 'Tributos e Apurações', icon: Landmark, purpose: 'Controle de alíquota municipal de Curitiba (5,0%) sobre serviços de bilheteria.' },
  { id: 'fisc-tributos-federais', label: 'Tributos Federais', group: 'Tributos e Apurações', icon: DollarSign, purpose: 'Apurações da Receita Federal (PIS, COFINS, IRPJ e CSLL) e geração de DARFs.' },
  { id: 'fisc-regimes-tributarios', label: 'Regimes Tributários', group: 'Tributos e Apurações', icon: Building2, purpose: 'Parâmetros de enquadramento tributário: Lucro Real DiskIngressos vs Regimes Produtores.' },
  { id: 'fisc-creditos-e-compensacoes', label: 'Créditos e Compensações', group: 'Tributos e Apurações', icon: ArrowRightLeft, purpose: 'Controle de créditos não-cumulativos de PIS/COFINS sobre insumos e infraestrutura.' },
  { id: 'fisc-aliquotas-e-vigencias', label: 'Alíquotas e Vigências', group: 'Tributos e Apurações', icon: Sliders, purpose: 'Tabelas vigentes de alíquotas municipais, federais e códigos de serviço tributário.' },

  // 3. Obrigações Acessórias (5)
  { id: 'fisc-calendario-fiscal', label: 'Calendário Fiscal', group: 'Obrigações Acessórias', icon: CalendarClock, purpose: 'Cronograma oficial de vencimentos de declarações e guias tributárias mensais.' },
  { id: 'fisc-obrigacoes-acessorias', label: 'Obrigações Acessórias', group: 'Obrigações Acessórias', icon: FileCheck, purpose: 'DCTFWeb, DMS Curitiba, EFD-Reinf e acompanhamento de protocolos de envio.' },
  { id: 'fisc-sped-e-escrituracoes', label: 'SPED e Escriturações', group: 'Obrigações Acessórias', icon: Layers, purpose: 'Geração e validação de arquivos SPED Fiscal e EFD-Contribuições para a RFB.' },
  { id: 'fisc-integracao-com-prefeituras', label: 'Integração com Prefeituras', group: 'Obrigações Acessórias', icon: Landmark, purpose: 'Webservices de comunicação automática com a Prefeitura Municipal de Curitiba.' },
  { id: 'fisc-guias-e-recolhimentos', label: 'Guias e Recolhimentos', group: 'Obrigações Acessórias', icon: DollarSign, purpose: 'Emissão de guias DARF numeradas, DAM de ISS e remessa para o Contas a Pagar.' },

  // 4. Operações Disk e Eventos (5)
  { id: 'fisc-fiscal-disk-empresa', label: 'Fiscal Disk Empresa', group: 'Operações Disk e Eventos', icon: Building2, purpose: 'Tributação societária exclusiva sobre receitas próprias e despesas da DiskIngressos.', badge: 'Próprio', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'fisc-fiscal-de-eventos-e-produtores', label: 'Fiscal de Eventos e Produtores', group: 'Operações Disk e Eventos', icon: ShieldCheck, purpose: 'Segregação patrimonial: ingressos fiduciários não transitam como receita tributável Disk.', badge: 'Segregado', badgeColor: 'bg-amber-100 text-amber-800' },
  { id: 'fisc-receitas-de-taxas-disk', label: 'Receitas de Taxas Disk', group: 'Operações Disk e Eventos', icon: Sparkles, purpose: 'Base de cálculo tributável correspondente estritamente aos 10% de intermediação.' },
  { id: 'fisc-despesas-e-documentos-dos-eventos', label: 'Despesas e Documentos dos Eventos', group: 'Operações Disk e Eventos', icon: FileText, purpose: 'Controle fiscal auxiliar dos documentos de despesas incorridas por cada produtor.' },
  { id: 'fisc-conciliacao-fiscal-financeiro', label: 'Conciliação Fiscal × Financeiro', group: 'Operações Disk e Eventos', icon: ArrowRightLeft, purpose: 'Confronto 1:1 entre notas fiscais emitidas, retenções e liquidações do Ledger.' },

  // 5. Controle e Auditoria (4)
  { id: 'fisc-relatorios-fiscais', label: 'Relatórios Fiscais', group: 'Controle e Auditoria', icon: FileText, purpose: 'Livros de registro de serviços prestados e tomados, demonstrativos e memória de cálculo.' },
  { id: 'fisc-certidoes-e-regularidade', label: 'Certidões e Regularidade', group: 'Controle e Auditoria', icon: ShieldCheck, purpose: 'Monitoramento automático de CND Federal, CND Municipal Curitiba, Estadual PR e FGTS.', badge: 'Regular', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'fisc-auditoria-fiscal', label: 'Auditoria Fiscal', group: 'Controle e Auditoria', icon: AlertTriangle, purpose: 'Validações prévias de inconsistências em notas, alíquotas divergentes e cruzamentos.' },
  { id: 'fisc-configuracoes-e-integracoes', label: 'Configurações e Integrações', group: 'Controle e Auditoria', icon: Sliders, purpose: 'Gestão de Certificados Digitais e-CNPJ A1, parâmetros de RPS e webhooks fiscais.' },
];

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function FiscalModuleView({ activeSection = 'fisc-dashboard-fiscal', onSelectSection }: Props) {
  const [sectionId, setSectionId] = useState<string>(activeSection || 'fisc-dashboard-fiscal');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configuração da Barra Lateral (Proporcional à página, posicionada à direita por padrão, visual claro)
  const [sidebarSide, setSidebarSide] = useState<'right' | 'left'>('right');
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light');

  // Dados do backend
  const [dashboardData, setDashboardData] = useState<FiscalDashboardResponse | null>(null);
  const [invoices, setInvoices] = useState<FiscalInvoice[]>([]);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  // Modais interativos
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isCalculateTaxModalOpen, setIsCalculateTaxModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] = useState<FiscalInvoice | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Formulário de nova NFS-e
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerDocument, setNewCustomerDocument] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newServiceCode, setNewServiceCode] = useState('10.05 - Intermediação e agenciamento de bilhetes');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Carregar dados da API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dash, invs] = await Promise.all([
        fiscalClient.getDashboard(),
        fiscalClient.getInvoices(),
      ]);
      setDashboardData(dash);
      setInvoices(invs);
    } catch (e: any) {
      console.error('Erro ao carregar dados fiscais:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeSection) {
      const match = FISCAL_SUBMENUS.find((s) => s.id === activeSection);
      if (match) setSectionId(match.id);
    }
  }, [activeSection]);

  const handleSelect = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
  };

  const currentSection = useMemo(
    () => FISCAL_SUBMENUS.find((s) => s.id === sectionId) || FISCAL_SUBMENUS[0],
    [sectionId],
  );

  // Filtros da barra lateral
  const filteredSubmenus = useMemo(() => {
    if (!sidebarSearch.trim()) return FISCAL_SUBMENUS;
    const q = sidebarSearch.toLowerCase();
    return FISCAL_SUBMENUS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [sidebarSearch]);

  const groupedSubmenus = useMemo(() => {
    const groups: Record<string, FiscalSubmenuDef[]> = {};
    for (const s of filteredSubmenus) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    }
    return groups;
  }, [filteredSubmenus]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const collapseAll = () => {
    const allGroups = ['Gestão Fiscal', 'Tributos e Apurações', 'Obrigações Acessórias', 'Operações Disk e Eventos', 'Controle e Auditoria'];
    const nextState: Record<string, boolean> = {};
    allGroups.forEach((g) => { nextState[g] = true; });
    setCollapsedGroups(nextState);
  };

  const expandAll = () => {
    setCollapsedGroups({});
  };

  // Filtragem da lista de notas fiscais
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        !invoiceSearch.trim() ||
        inv.number.includes(invoiceSearch) ||
        inv.customerName.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.customerDocument.includes(invoiceSearch);

      const matchesStatus =
        invoiceStatusFilter === 'all' || inv.status.toLowerCase() === invoiceStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [invoices, invoiceSearch, invoiceStatusFilter]);

  // Ações de formulário
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount.replace(/\./g, '').replace(',', '.'));
    if (!val || val <= 0) {
      alert('Informe um valor de serviço válido maior que zero.');
      return;
    }
    if (!newCustomerName || !newCustomerDocument) {
      alert('Preencha os dados do tomador do serviço.');
      return;
    }

    try {
      const created = await fiscalClient.createInvoice({
        customerName: newCustomerName,
        customerDocument: newCustomerDocument,
        description: newDescription || 'Intermediação e processamento de bilheteria Disk',
        amount: val,
        serviceCode: newServiceCode,
        issRate: 5.0,
      });

      setInvoices((prev) => [created, ...prev]);
      setIsNewInvoiceModalOpen(false);
      setNotification(`NFS-e #${created.number} emitida e autorizada com sucesso! ISS e tributos calculados.`);
      setNewCustomerName('');
      setNewCustomerDocument('');
      setNewDescription('');
      setNewAmount('');
    } catch (err: any) {
      alert(`Erro ao emitir nota fiscal: ${err.message}`);
    }
  };

  const handleCancelInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForCancel) return;

    try {
      await fiscalClient.cancelInvoice(selectedInvoiceForCancel.id, cancelReason);
      setInvoices((prev) =>
        prev.map((i) => (i.id === selectedInvoiceForCancel.id ? { ...i, status: 'CANCELADA' } : i)),
      );
      setIsCancelModalOpen(false);
      setNotification(`NFS-e #${selectedInvoiceForCancel.number} cancelada com sucesso na Prefeitura!`);
      setSelectedInvoiceForCancel(null);
      setCancelReason('');
    } catch (err: any) {
      alert(`Erro ao cancelar nota: ${err.message}`);
    }
  };

  const handleCalculateTaxesSubmit = async () => {
    try {
      const res = await fiscalClient.calculateTaxPeriod('10/2026');
      setIsCalculateTaxModalOpen(false);
      setNotification(res.message || 'Apuração de tributos da competência 10/2026 processada e integrada ao Contas a Pagar!');
    } catch (err: any) {
      alert(`Erro ao apurar tributos: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. Header Corporativo do Módulo Fiscal */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Módulo Fiscal — Gestão Tributária e Documentos Fiscais
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Lucro Real Homologado
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  DiskIngressos S.A.
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Gestão tributária unificada, escrituração de NFS-e/NF-e, apurações de impostos municipais e federais com estrita segregação patrimonial.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Competência Fiscal: <strong>Outubro / 2026</strong></span>
            </div>

            <button
              onClick={() => setIsNewInvoiceModalOpen(true)}
              className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova NFS-e</span>
            </button>

            <button
              onClick={() => setIsCalculateTaxModalOpen(true)}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Apurar Tributos</span>
            </button>

            <button
              onClick={loadData}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Recarregar dados fiscais"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Banner de Segregação Tributária e Regra de Tributação da Disk */}
        <div className="p-3 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Garantia de Não-Bitributação e Segregação Fiscal:</strong> A DiskIngressos tributa exclusivamente a sua <strong>taxa própria de intermediação e serviço (10%)</strong>. O montante de 90% (R$ 34.560.000,00) pertence integralmente aos produtores e não constitui receita tributável Disk.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0 self-start sm:self-auto">
            Base Tributável Disk: R$ 3.840.000,00
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Grid de Conteúdo: Área Operacional Central + Estrutura Lateral Fiscal à Direita */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Conteúdo Central da Tela Selecionada */}
        <main
          className={`space-y-4 xl:col-span-9 ${
            sidebarSide === 'right' ? 'xl:order-1 order-2' : 'xl:order-2 order-2'
          }`}
        >
          {/* Header da Subseção Ativa */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>ERP Keeper</span>
                <span>/</span>
                <span>Módulo Fiscal</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{currentSection.group}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <currentSection.icon className="w-5 h-5 text-emerald-600" />
                {currentSection.label}
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {currentSection.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                Código: <code className="font-mono text-[11px] text-emerald-700">{currentSection.id}</code>
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 🌟 1. TELA: DASHBOARD FISCAL                               */}
          {/* ======================================================== */}
          {sectionId === 'fisc-dashboard-fiscal' && (
            <div className="space-y-4">
              {/* 4 Cards Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Notas Emitidas (NFS-e)</span>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {fmt(dashboardData?.summary.invoicesIssuedTotal || 375500.0)}
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {dashboardData?.summary.invoicesIssuedCount || 3} NFS-e Autorizadas
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Tributos a Pagar</span>
                    <DollarSign className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {fmt(dashboardData?.summary.taxesPayableTotal || 577760.0)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ISS (5%) + PIS/COFINS (9,25%)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Obrigações Pendentes</span>
                    <CalendarClock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-700 mt-1">
                    {dashboardData?.summary.pendingObligationsCount || 2} Pendentes
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium">
                    DCTFWeb e EFD-Contribuições
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Inconsistências Fiscais</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">0 Inconsistências</div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    100% Regularidade CND
                  </span>
                </div>
              </div>

              {/* Matriz de Tributos da Competência */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Apuração de Tributos da Competência (Outubro / 2026)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Alíquota Efetiva Ponderada: <strong>14,25%</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Tributo</th>
                        <th className="py-2.5 px-3">Esfera</th>
                        <th className="py-2.5 px-3 text-right">Base de Cálculo</th>
                        <th className="py-2.5 px-3 text-center">Alíquota</th>
                        <th className="py-2.5 px-3 text-right">Valor Apurado</th>
                        <th className="py-2.5 px-3 text-center">Vencimento</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardData?.taxesBreakdown.map((tax) => (
                        <tr key={tax.code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{tax.taxName}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {tax.jurisdiction}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">{fmt(tax.baseAmount)}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{tax.rate.toFixed(2)}%</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{fmt(tax.calculatedAmount)}</td>
                          <td className="py-2.5 px-3 text-center font-medium text-slate-600">{tax.dueDate}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                tax.status === 'APURADO'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {tax.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => alert(`Gerando Guia / DARF para ${tax.taxName} (Código ${tax.darfCode})`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              Gerar Guia
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Grid Inferior: Certidões de Regularidade CND + Obrigações Acessórias */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Certidões CND */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Certidões Negativas de Débito (CNDs)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Todas Válidas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dashboardData?.cndStatus.map((cnd, i) => (
                      <div key={i} className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-800">{cnd.agency}</div>
                          <div className="text-[11px] text-slate-500">{cnd.documentType}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Certificado: {cnd.certNumber}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {cnd.status}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">Validade: {cnd.validUntil}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Obrigações Acessórias */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Calendário de Obrigações Acessórias
                      </h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Transmissões Homologadas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dashboardData?.obligations.map((obl) => (
                      <div key={obl.id} className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{obl.code}</div>
                          <div className="text-[11px] text-slate-500">{obl.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              obl.status === 'TRANSMITIDO'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : obl.status === 'REGULAR'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {obl.status}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">Prazo: {obl.deadline}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 2. TELA: CENTRAL DE DOCUMENTOS FISCAIS                 */}
          {/* ======================================================== */}
          {(sectionId === 'fisc-central-de-documentos-fiscais' || sectionId === 'fisc-emissao-de-notas-fiscais') && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-80">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={invoiceSearch}
                        onChange={(e) => setInvoiceSearch(e.target.value)}
                        placeholder="Buscar por número, tomador, CNPJ..."
                        className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <select
                      value={invoiceStatusFilter}
                      onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                      className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="autorizada">Autorizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsNewInvoiceModalOpen(true)}
                    className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Emitir Nova NFS-e</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Número / Tipo</th>
                        <th className="py-2.5 px-3">Tomador / Cliente</th>
                        <th className="py-2.5 px-3">Serviço / Descrição</th>
                        <th className="py-2.5 px-3 text-right">Valor Bruto</th>
                        <th className="py-2.5 px-3 text-center">ISS (5%)</th>
                        <th className="py-2.5 px-3 text-right">Valor Líquido</th>
                        <th className="py-2.5 px-3 text-center">Data</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-bold text-slate-900">#{inv.number}</span>
                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {inv.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900">{inv.customerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{inv.customerDocument}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-[220px]">
                            <div className="truncate font-medium text-slate-700">{inv.description}</div>
                            <div className="text-[10px] text-slate-400 truncate">{inv.serviceCode}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {fmt(inv.grossAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                            {fmt(inv.issAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-800">
                            {fmt(inv.netAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{inv.issueDate}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === 'AUTORIZADA'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => alert(`Visualizando XML e DANFE da NFS-e #${inv.number} (Código de Verificação: ${inv.verificationCode})`)}
                                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                                title="Ver Danfe/XML"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {inv.status === 'AUTORIZADA' && (
                                <button
                                  onClick={() => {
                                    setSelectedInvoiceForCancel(inv);
                                    setIsCancelModalOpen(true);
                                  }}
                                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                                  title="Cancelar Nota Fiscal"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 3. TELA: APURAÇÃO DE TRIBUTOS E RETENÇÕES             */}
          {/* ======================================================== */}
          {(sectionId === 'fisc-apuracao-de-tributos' || sectionId === 'fisc-retencoes-tributarias' || sectionId === 'fisc-tributos-federais') && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Painel de Apuração Tributária — Lucro Real Não-Cumulativo
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Apuração mensal de tributos federais e municipais com conciliação automática para emissão de guias DARF.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCalculateTaxModalOpen(true)}
                    className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Executar Apuração Out/2026</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Base de Cálculo de Serviços (10% Disk)</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">{fmt(3840000.0)}</div>
                    <span className="text-[11px] text-slate-500">Taxas e comissões homologadas</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Total de Tributos a Recolher</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">{fmt(577760.0)}</div>
                    <span className="text-[11px] text-emerald-700 font-semibold">Integrado ao Contas a Pagar</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Retenções Efetuadas na Fonte</span>
                    <div className="text-xl font-bold text-indigo-700 mt-1">{fmt(42150.0)}</div>
                    <span className="text-[11px] text-indigo-600 font-medium">CSRF 4,65% e IRRF 1,5%</span>
                  </div>
                </div>

                {/* Tabela de Retenções */}
                <div className="pt-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                    Retenções Tributárias da Competência
                  </h4>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Tipo</th>
                        <th className="py-2.5 px-3">Fornecedor / Tomador</th>
                        <th className="py-2.5 px-3">Documento</th>
                        <th className="py-2.5 px-3 text-right">Valor Base</th>
                        <th className="py-2.5 px-3 text-center">Alíquota</th>
                        <th className="py-2.5 px-3 text-right">Valor Retido</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardData?.withholdings.map((ret) => (
                        <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{ret.type}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{ret.partyName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{ret.document}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-800">{fmt(ret.grossAmount)}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-700">{ret.rate.toFixed(2)}%</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">{fmt(ret.withheldAmount)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {ret.status}
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

          {/* ======================================================== */}
          {/* 🌟 4. TELA: OPERAÇÕES DISK E EVENTOS (SEGREGAÇÃO)         */}
          {/* ======================================================== */}
          {(sectionId === 'fisc-fiscal-disk-empresa' || sectionId === 'fisc-fiscal-de-eventos-e-produtores' || sectionId === 'fisc-receitas-de-taxas-disk') && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    Regra Estrutural de Segregação Fiscal: Disk Empresa vs Produtores & Eventos
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                    <span className="font-bold text-indigo-900 uppercase text-[11px] tracking-wider block">
                      1. Fiscal Disk Empresa (Receita Própria de Taxas — 10%)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      A DiskIngressos atua como intermediadora tecnológica e financeira. Suas receitas fiscais próprias são exclusivamente as taxas de conveniência, spread de parcelamento e comissões contratuais.
                    </p>
                    <div className="pt-2 text-indigo-950 font-semibold space-y-1">
                      <div>• Faturamento Próprio da Competência: <strong>R$ 3.840.000,00</strong></div>
                      <div>• NFS-e de Serviços Prestados: <strong>Emissão Automática</strong></div>
                      <div>• Regime de Tributação: <strong>Lucro Real (PIS 1,65% / COFINS 7,6% / ISS 5%)</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                    <span className="font-bold text-amber-900 uppercase text-[11px] tracking-wider block">
                      2. Fiscal de Eventos e Produtores (Custódia Fiduciária — 90%)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      O valor facial dos ingressos pertence integralmente a cada produtor do evento. Esse montante permanece em conta de custódia e <strong>não integra o faturamento nem o imposto da Disk</strong>.
                    </p>
                    <div className="pt-2 text-amber-950 font-semibold space-y-1">
                      <div>• Ingressos em Custódia Fiduciária: <strong>R$ 34.560.000,00</strong></div>
                      <div>• Responsabilidade Tributária: <strong>Do Produtor no seu CNPJ</strong></div>
                      <div>• Documentos: <strong>Borderôs e Comprovantes Fiscais 1:1</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 5. DEMAIS SUBMENUS ESTRUTURADOS COM TABELAS E AÇÕES    */}
          {/* ======================================================== */}
          {sectionId !== 'fisc-dashboard-fiscal' &&
            sectionId !== 'fisc-central-de-documentos-fiscais' &&
            sectionId !== 'fisc-emissao-de-notas-fiscais' &&
            sectionId !== 'fisc-apuracao-de-tributos' &&
            sectionId !== 'fisc-retencoes-tributarias' &&
            sectionId !== 'fisc-tributos-federais' &&
            sectionId !== 'fisc-fiscal-disk-empresa' &&
            sectionId !== 'fisc-fiscal-de-eventos-e-produtores' &&
            sectionId !== 'fisc-receitas-de-taxas-disk' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <currentSection.icon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{currentSection.label}</h3>
                      <p className="text-xs text-slate-500">{currentSection.purpose}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Ação operacional executada para ${currentSection.label}!`)}
                    className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Executar Operação</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Descrição da Operação Fiscal</th>
                        <th className="py-2.5 px-3">Responsável</th>
                        <th className="py-2.5 px-3 text-right">Referência / Valor</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { code: 'OP-FISC-01', desc: `Parâmetro de ${currentSection.label} — Regra Curitiba`, resp: 'Dr. Roberto Meirelles (CRC)', val: '100% Homologado', status: 'Ativo' },
                        { code: 'OP-FISC-02', desc: 'Validação de Cruzamento Fiscal x Razão Contábil', resp: 'Controladoria Disk', val: 'Partidas Dobradas', status: 'Concluído' },
                        { code: 'OP-FISC-03', desc: 'Certificado Digital e-CNPJ A1 em Nuvem', resp: 'Segurança & TI', val: 'Válido até 10/2027', status: 'Seguro' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{row.code}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{row.desc}</td>
                          <td className="py-2.5 px-3 text-slate-600">{row.resp}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">{row.val}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </main>

        {/* ========================================================================= */}
        {/* 🌟 ESTRUTURA LATERAL DO MÓDULO FISCAL (26 SUBMENUS — PROPORCIONAL À PÁGINA) 🌟 */}
        {/* ========================================================================= */}
        <aside
          className={`xl:col-span-3 space-y-3 sticky top-4 self-start ${
            sidebarSide === 'right' ? 'xl:order-2 order-1' : 'xl:order-1 order-1'
          }`}
        >
          <div
            className={`rounded-2xl p-4 shadow-sm border transition-colors space-y-3.5 ${
              sidebarTheme === 'light'
                ? 'bg-white text-slate-800 border-slate-200/90'
                : 'bg-slate-900 text-slate-100 border-slate-800'
            }`}
          >
            {/* Header da Barra Lateral */}
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                sidebarTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${
                    sidebarTheme === 'light'
                      ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-600'
                      : 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-400'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        sidebarTheme === 'light' ? 'text-slate-900' : 'text-slate-200'
                      }`}
                    >
                      Estrutura Fiscal
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        sidebarTheme === 'light'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                      }`}
                    >
                      26 Submenus
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-medium ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    5 Grupos Tributários Disk
                  </p>
                </div>
              </div>

              {/* Controles de Posição (Direita/Esquerda) e Tema (Claro/Escuro) */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSidebarSide((s) => (s === 'right' ? 'left' : 'right'))}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    sidebarTheme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-emerald-600 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                  }`}
                  title={`Mover estrutura lateral para a ${sidebarSide === 'right' ? 'Esquerda' : 'Direita'}`}
                >
                  {sidebarSide === 'right' ? (
                    <PanelRight className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <PanelLeft className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    sidebarTheme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-amber-600 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-yellow-400 border-slate-700'
                  }`}
                  title={`Alternar visual para ${sidebarTheme === 'light' ? 'Escuro' : 'Claro'}`}
                >
                  {sidebarTheme === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Ações de Expandir/Recolher Todos */}
            <div
              className={`flex items-center justify-between px-1 text-[11px] font-medium ${
                sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <button
                type="button"
                onClick={collapseAll}
                className="hover:text-emerald-600 cursor-pointer transition-colors"
              >
                Recolher todos
              </button>
              <span className="opacity-40">·</span>
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-emerald-600 cursor-pointer transition-colors"
              >
                Expandir todos
              </button>
              <span className="opacity-40">·</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  sidebarTheme === 'light'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sidebarSide === 'right' ? 'Painel à Direita' : 'Painel à Esquerda'}
              </span>
            </div>

            {/* Busca Rápida de Menus */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Filtrar 26 submenus fiscais..."
                className={`w-full h-8 pl-8 pr-7 rounded-xl text-xs transition-colors focus:outline-hidden focus:ring-1 focus:ring-emerald-500 ${
                  sidebarTheme === 'light'
                    ? 'bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 text-slate-800 placeholder-slate-400'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500'
                }`}
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Lista dos 5 Grupos Expansíveis — ALTURA PROPORCIONAL À PÁGINA */}
            <div className="space-y-3.5 max-h-[calc(100vh-140px)] min-h-[820px] overflow-y-auto pr-1 select-none no-scrollbar">
              {Object.entries(groupedSubmenus).map(([groupName, sections]) => {
                const isCollapsed = !!collapsedGroups[groupName];
                return (
                  <div key={groupName} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupName)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                        sidebarTheme === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border-slate-200/60'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{groupName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                            sidebarTheme === 'light'
                              ? 'bg-white border border-slate-200 text-slate-600 shadow-2xs'
                              : 'bg-slate-900 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {sections.length}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-0.5">
                        {sections.map((item) => {
                          const Icon = item.icon;
                          const isCurrent = sectionId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-xs shadow-emerald-600/25 ring-1 ring-emerald-500'
                                  : sidebarTheme === 'light'
                                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Icon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isCurrent
                                      ? 'text-white'
                                      : sidebarTheme === 'light'
                                      ? 'text-slate-400 group-hover:text-emerald-600'
                                      : 'text-slate-400'
                                  }`}
                                />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.badge ? (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    isCurrent
                                      ? 'bg-white/20 text-white border border-white/20'
                                      : item.badgeColor ||
                                        (sidebarTheme === 'light'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                          : 'bg-emerald-950 text-emerald-300')
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              ) : (
                                <ChevronRight
                                  className={`w-3 h-3 shrink-0 ${
                                    isCurrent
                                      ? 'text-white'
                                      : sidebarTheme === 'light'
                                      ? 'text-slate-300'
                                      : 'text-slate-500'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Card de Resumo de Governança Fiscal no Rodapé da Barra Lateral */}
              <div className="pt-2">
                <div
                  className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                    sidebarTheme === 'light'
                      ? 'bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/50 border-emerald-100/80'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold flex items-center gap-1.5 ${
                        sidebarTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Governança Fiscal Disk
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        sidebarTheme === 'light'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-900/80 text-emerald-300'
                      }`}
                    >
                      Lucro Real
                    </span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Tributação sobre 10% de intermediação. Ingressos de terceiros fiduciariamente protegidos e segregados.
                  </p>
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${
                      sidebarTheme === 'light'
                        ? 'text-slate-600 border-emerald-100/60'
                        : 'text-slate-400 border-slate-700/60'
                    }`}
                  >
                    <span>Posição: <strong>{sidebarSide === 'right' ? 'À Direita' : 'À Esquerda'}</strong></span>
                    <span>Visual: <strong>{sidebarTheme === 'light' ? 'Claro' : 'Escuro'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* 3. MODAIS OPERACIONAIS INTERATIVOS                        */}
      {/* ======================================================== */}

      {/* MODAL 1: EMITIR NOVA NFS-e */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoiceSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Emissão de Nota Fiscal de Serviços (NFS-e Disk)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tomador / Razão Social</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Ex: Opus Entretenimento Ltda"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">CNPJ do Tomador</label>
                <input
                  type="text"
                  required
                  value={newCustomerDocument}
                  onChange={(e) => setNewCustomerDocument(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código de Serviço Municipal (Curitiba)</label>
                <select
                  value={newServiceCode}
                  onChange={(e) => setNewServiceCode(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="10.05 - Intermediação e agenciamento de bilhetes">10.05 - Intermediação e agenciamento de bilhetes (ISS 5%)</option>
                  <option value="12.07 - Bilheterias, shows e espetáculos">12.07 - Bilheterias, shows e espetáculos (ISS 5%)</option>
                  <option value="1.03 - Processamento de dados e tecnologia">1.03 - Processamento de dados e tecnologia (ISS 2%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Discriminação dos Serviços</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Taxas de conveniência e comissão tecnológica sobre venda de ingressos..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Valor Total dos Serviços (R$)</label>
                <input
                  type="text"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="150000.00"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Transmitir e Emitir NFS-e
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: APURAÇÃO DE TRIBUTOS */}
      {isCalculateTaxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Apuração Fiscal — Competência 10/2026</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCalculateTaxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 text-blue-900">
              <span className="font-bold block">Motor de Apuração Lucro Real Não-Cumulativo:</span>
              <div>• Base Própria Disk: <strong>R$ 3.840.000,00</strong></div>
              <div>• ISS Curitiba (5%): <strong>R$ 192.000,00</strong></div>
              <div>• PIS (1,65%) + COFINS (7,6%): <strong>R$ 355.200,00</strong></div>
              <div>• Total a Recolher: <strong>R$ 547.200,00</strong></div>
            </div>

            <p className="text-slate-600">
              Ao confirmar, os lançamentos contábeis de provisão e as guias DARF correspondentes serão transmitidos automaticamente ao Contas a Pagar do Financeiro Disk.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCalculateTaxModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCalculateTaxesSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar e Integrar ao Financeiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CANCELAR NOTA FISCAL */}
      {isCancelModalOpen && selectedInvoiceForCancel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleCancelInvoiceSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Cancelar NFS-e #{selectedInvoiceForCancel.number}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
              <span className="font-bold block">Atenção ao Cancelamento Oficial:</span>
              <div>Tomador: <strong>{selectedInvoiceForCancel.customerName}</strong></div>
              <div>Valor: <strong>{fmt(selectedInvoiceForCancel.grossAmount)}</strong></div>
              <div>Código de Verificação: <span className="font-mono">{selectedInvoiceForCancel.verificationCode}</span></div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Justificativa do Cancelamento</label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo formal do cancelamento para a Prefeitura Municipal de Curitiba..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
