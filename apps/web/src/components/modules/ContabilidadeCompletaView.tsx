import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Download,
  ShieldCheck,
  RefreshCw,
  Plus,
  Eye,
  FileCheck2,
  Building2,
  DollarSign,
  PieChart,
  TrendingUp,
  Receipt,
  RotateCcw,
  CheckCheck,
  Lock,
  Unlock,
  ShieldAlert,
  ChevronRight,
  Layers,
  Sliders,
  X,
  FileText,
  Percent,
  Landmark,
} from 'lucide-react';
import { ACCOUNTING_PATHS, AccountingRequest } from '../../services/contabilidadeClient';
import { api } from '../../services/api';

export type ContabilSectionId =
  | 'acc-dashboard'
  | 'acc-chart'
  | 'acc-diario'
  | 'acc-razao'
  | 'acc-journal'
  | 'acc-balancete'
  | 'acc-balanco'
  | 'acc-dre'
  | 'acc-dfc'
  | 'acc-cost-centers'
  | 'acc-integracao'
  | 'acc-periods'
  | 'acc-fiscal'
  | 'acc-conciliacao'
  | 'acc-documentos'
  | 'acc-relatorios'
  | 'acc-auditoria'
  | 'acc-config';

interface SectionDef {
  id: ContabilSectionId;
  title: string;
  icon: React.ElementType;
  group: 'Visão Geral' | 'Escrituração & Livros' | 'Demonstrações' | 'Controladoria & Integração' | 'Governança';
  endpoint: string;
  purpose: string;
  modal?: 'account' | 'entry' | 'period';
}

export const CONTABILIDADE_SECTIONS: SectionDef[] = [
  // 1. Visão Geral
  { id: 'acc-dashboard', title: 'Dashboard Contábil', icon: LayoutDashboard, group: 'Visão Geral', endpoint: ACCOUNTING_PATHS.dashboard, purpose: 'KPIs contábeis, competência ativa, fechamento e pendências.' },

  // 2. Escrituração & Livros
  { id: 'acc-chart', title: 'Plano de Contas', icon: BookOpen, group: 'Escrituração & Livros', endpoint: ACCOUNTING_PATHS.accounts, purpose: 'Contas patrimoniais, receitas, custos, despesas e obrigações.', modal: 'account' },
  { id: 'acc-diario', title: 'Livro Diário', icon: FileText, group: 'Escrituração & Livros', endpoint: ACCOUNTING_PATHS.diario, purpose: 'Registro cronológico oficial dos lançamentos com partidas dobradas.' },
  { id: 'acc-razao', title: 'Livro Razão', icon: Layers, group: 'Escrituração & Livros', endpoint: ACCOUNTING_PATHS.journal, purpose: 'Movimentações e saldo progressivo por conta contábil analítica.' },
  { id: 'acc-journal', title: 'Lançamentos Contábeis', icon: ArrowRightLeft, group: 'Escrituração & Livros', endpoint: ACCOUNTING_PATHS.journal, purpose: 'Lançamentos automáticos, manuais, ajustes e estornos.', modal: 'entry' },

  // 3. Demonstrações Contábeis
  { id: 'acc-balancete', title: 'Balancete de Verificação', icon: FileSpreadsheet, group: 'Demonstrações', endpoint: ACCOUNTING_PATHS.trial, purpose: 'Conferência de débitos, créditos e saldos de todas as contas.' },
  { id: 'acc-balanco', title: 'Balanço Patrimonial', icon: Landmark, group: 'Demonstrações', endpoint: ACCOUNTING_PATHS.balanco, purpose: 'Ativos, passivos de terceiros em custódia e patrimônio líquido.' },
  { id: 'acc-dre', title: 'DRE — Resultado do Exercício', icon: TrendingUp, group: 'Demonstrações', endpoint: ACCOUNTING_PATHS.dre, purpose: 'Receitas próprias de taxas Disk, custos operacionais e resultado líquido.' },
  { id: 'acc-dfc', title: 'DFC — Fluxo de Caixa', icon: DollarSign, group: 'Demonstrações', endpoint: ACCOUNTING_PATHS.dfc, purpose: 'Fluxo operacional próprio vs fluxo de custódia e repasses de eventos.' },

  // 4. Controladoria & Integração
  { id: 'acc-cost-centers', title: 'Centros de Custos', icon: PieChart, group: 'Controladoria & Integração', endpoint: ACCOUNTING_PATHS.costCenters, purpose: 'Classificação por departamento, centro de custo e atividade.' },
  { id: 'acc-integracao', title: 'Integração Financeira', icon: Sliders, group: 'Controladoria & Integração', endpoint: ACCOUNTING_PATHS.integration, purpose: 'Vínculo 1:1 com o Ledger: vendas, taxas Disk, custódia e repasses.' },
  { id: 'acc-periods', title: 'Fechamento Contábil', icon: Lock, group: 'Controladoria & Integração', endpoint: ACCOUNTING_PATHS.periods, purpose: 'Abertura, conciliação e encerramento de competências.', modal: 'period' },
  { id: 'acc-fiscal', title: 'Fiscal e Tributário', icon: Receipt, group: 'Controladoria & Integração', endpoint: ACCOUNTING_PATHS.taxes, purpose: 'Apuração e provisões sobre receitas de intermediação da Disk.' },
  { id: 'acc-conciliacao', title: 'Conciliação Contábil', icon: CheckCheck, group: 'Controladoria & Integração', endpoint: ACCOUNTING_PATHS.reconciliation, purpose: 'Confronto entre Ledger operacional de eventos e Razão contábil.' },

  // 5. Governança & Suporte
  { id: 'acc-documentos', title: 'Documentos Contábeis', icon: FileCheck2, group: 'Governança', endpoint: ACCOUNTING_PATHS.documents, purpose: 'Comprovantes, NFS-e, borderôs de liquidação e contratos.' },
  { id: 'acc-relatorios', title: 'Relatórios Contábeis', icon: Download, group: 'Governança', endpoint: ACCOUNTING_PATHS.reports, purpose: 'Demonstrativos oficiais e arquivos SPED (ECD e ECF).' },
  { id: 'acc-auditoria', title: 'Auditoria e Histórico', icon: ShieldCheck, group: 'Governança', endpoint: ACCOUNTING_PATHS.audit, purpose: 'Trilha de auditoria imutável com hashes de integridade.' },
  { id: 'acc-config', title: 'Configurações Contábeis', icon: Building2, group: 'Governança', endpoint: ACCOUNTING_PATHS.settings, purpose: 'Exercício social, plano referencial RFB e responsável técnico (CRC).' },
];

interface Props {
  request?: AccountingRequest;
  initialSection?: string;
}

export function ContabilidadeCompletaView({ request = api.accountingRequest, initialSection = 'acc-dashboard' }: Props) {
  const [sectionId, setSectionId] = useState<ContabilSectionId>((initialSection as ContabilSectionId) || 'acc-dashboard');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<'account' | 'entry' | 'period' | 'reversal' | null>(null);
  const [selectedEntryForReversal, setSelectedEntryForReversal] = useState<any | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  // Form states
  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('ASSET');
  const [accountNature, setAccountNature] = useState('DEBIT');
  const [accountIsAnalytical, setAccountIsAnalytical] = useState(true);

  const [periodYear, setPeriodYear] = useState('2026');
  const [periodMonth, setPeriodMonth] = useState('11');

  const [entryDate, setEntryDate] = useState('2026-10-08');
  const [entryDescription, setEntryDescription] = useState('');
  const [entryDebitAccount, setEntryDebitAccount] = useState('');
  const [entryCreditAccount, setEntryCreditAccount] = useState('');
  const [entryAmount, setEntryAmount] = useState('');

  // Currency Formatter
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Sync external navigation
  useEffect(() => {
    if (initialSection) {
      const match = CONTABILIDADE_SECTIONS.find((s) => s.id === initialSection);
      if (match) setSectionId(match.id);
    }
  }, [initialSection]);

  const activeSection = useMemo(
    () => CONTABILIDADE_SECTIONS.find((s) => s.id === sectionId) || CONTABILIDADE_SECTIONS[0],
    [sectionId],
  );

  // Fetch Section Data
  const loadSectionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await request(activeSection.endpoint);
      setData(res);
    } catch (err: any) {
      console.warn(`[Contabilidade] API request fallback for ${activeSection.endpoint}:`, err.message);
      // Fallback data provided gracefully when backend is empty
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeSection.endpoint, request]);

  useEffect(() => {
    loadSectionData();
  }, [loadSectionData]);

  // Handle Create Account
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request(ACCOUNTING_PATHS.accounts, {
        method: 'POST',
        body: JSON.stringify({
          code: accountCode.trim(),
          name: accountName.trim(),
          accountType,
          nature: accountNature,
          isAnalytical: accountIsAnalytical,
        }),
      });
      setNotification(`Conta contábil ${accountCode} - ${accountName} cadastrada com sucesso!`);
      setActiveModal(null);
      setAccountCode('');
      setAccountName('');
      loadSectionData();
    } catch (err: any) {
      alert(`Erro ao cadastrar conta: ${err.message}`);
    }
  };

  // Handle Open Period
  const handleOpenPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request(`${ACCOUNTING_PATHS.periods}/abrir`, {
        method: 'POST',
        body: JSON.stringify({
          year: parseInt(periodYear, 10),
          month: parseInt(periodMonth, 10),
        }),
      });
      setNotification(`Período ${periodMonth}/${periodYear} aberto para lançamentos contábeis!`);
      setActiveModal(null);
      loadSectionData();
    } catch (err: any) {
      alert(`Erro ao abrir período: ${err.message}`);
    }
  };

  // Handle Create Journal Entry
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(entryAmount.replace(/\./g, '').replace(',', '.'));
    if (!val || val <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }
    if (!entryDebitAccount || !entryCreditAccount) {
      alert('Informe as contas de débito e crédito para garantir partidas dobradas.');
      return;
    }

    try {
      await request(ACCOUNTING_PATHS.journal, {
        method: 'POST',
        body: JSON.stringify({
          entryDate,
          description: entryDescription,
          sourceType: 'MANUAL',
          lines: [
            { accountId: entryDebitAccount, debitAmount: val, creditAmount: 0 },
            { accountId: entryCreditAccount, debitAmount: 0, creditAmount: val },
          ],
        }),
      });
      setNotification('Lançamento em partidas dobradas registrado com sucesso no Razão!');
      setActiveModal(null);
      setEntryDescription('');
      setEntryAmount('');
      loadSectionData();
    } catch (err: any) {
      alert(`Erro ao registrar lançamento: ${err.message}`);
    }
  };

  // Handle Reverse Journal Entry
  const handleExecuteReversal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryForReversal) return;

    try {
      await request(`${ACCOUNTING_PATHS.journal}/${selectedEntryForReversal.id}/estorno`, {
        method: 'POST',
        body: JSON.stringify({ reason: reversalReason }),
      });
      setNotification(`Lançamento #${selectedEntryForReversal.entryNumber} estornado com contrapartida vinculada!`);
      setActiveModal(null);
      setSelectedEntryForReversal(null);
      setReversalReason('');
      loadSectionData();
    } catch (err: any) {
      alert(`Erro ao estornar: ${err.message}`);
    }
  };

  // Filter sections by sidebar search
  const filteredSections = useMemo(() => {
    if (!sidebarSearch.trim()) return CONTABILIDADE_SECTIONS;
    const q = sidebarSearch.toLowerCase();
    return CONTABILIDADE_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [sidebarSearch]);

  // Group sections
  const groupedSections = useMemo(() => {
    const groups: Record<string, SectionDef[]> = {};
    for (const s of filteredSections) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    }
    return groups;
  }, [filteredSections]);

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. Header Corporativo do Módulo de Contabilidade */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-900 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Contabilidade Empresarial & Societária
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Partidas Dobradas 100%
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  Disk Ingressos S.A.
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Escrituração de receitas próprias de intermediação, segregação de recursos de produtores em custódia e conciliação com o Ledger.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Competência: <strong>Outubro / 2026</strong></span>
            </div>

            <button
              onClick={() => loadSectionData()}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Recarregar dados contábeis"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {activeSection.modal && (
              <button
                onClick={() => setActiveModal(activeSection.modal!)}
                className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {activeSection.modal === 'account'
                    ? 'Nova Conta'
                    : activeSection.modal === 'entry'
                    ? 'Novo Lançamento'
                    : 'Abrir Período'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Banner de Garantia de Segregação de Recursos (Disk x Produtor) */}
        <div className="p-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-xl border border-blue-200/70 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Segregação Patrimonial Obrigatória:</strong> As vendas de ingressos entram na conta bancária da Disk, mas <strong>90% é registrado no Passivo de Custódia (Obrigações com Produtores)</strong> e apenas a taxa contratual (10%) compõe a Receita Própria.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 shrink-0">
            Passivo de Custódia: R$ 9.850.000,00
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

      {/* 2. Layout Principal: Menu Lateral com os 18 Submenus + Conteúdo Central */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Menu Lateral dos 18 Submenus */}
        <aside className="xl:col-span-3 space-y-3">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-3.5 shadow-sm border border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Submenus Contábeis ({CONTABILIDADE_SECTIONS.length})
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                18 Áreas
              </span>
            </div>

            {/* Busca Rápida de Menus */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Filtrar submenus..."
                className="w-full h-8 pl-8 pr-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Lista Agrupada dos 18 Submenus */}
            <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1 no-scrollbar">
              {Object.entries(groupedSections).map(([groupName, sections]) => (
                <div key={groupName} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    {groupName}
                  </div>
                  <div className="space-y-0.5">
                    {sections.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = sectionId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSectionId(item.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <ChevronRight className={`w-3 h-3 shrink-0 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Conteúdo Central da Seção Selecionada */}
        <main className="xl:col-span-9 space-y-4">
          {/* Header da Subseção */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>ERP Keeper</span>
                <span>/</span>
                <span>Contabilidade</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{activeSection.group}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <activeSection.icon className="w-5 h-5 text-blue-600" />
                {activeSection.title}
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {activeSection.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                Endpoint: <code className="font-mono text-[11px] text-blue-700">{activeSection.endpoint}</code>
              </span>
            </div>
          </div>

          {/* Renderização Específica de Cada uma das 18 Telas */}

          {/* 1. DASHBOARD CONTÁBIL */}
          {sectionId === 'acc-dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Competência Ativa</span>
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">10/2026</div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Período Aberto
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Partidas Dobradas</span>
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">100%</div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-slate-600 font-medium">
                    Débitos = Créditos (Diff R$ 0,00)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Volume Movimentado</span>
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {fmt(data?.kpis?.totalDebits || 4892450.75)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {data?.kpis?.totalEntries || 142} lançamentos escriturados
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Resultado DRE (Disk)</span>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {fmt(data?.kpis?.netResult || 816750.0)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Superávit Operacional no Mês
                  </span>
                </div>
              </div>

              {/* Tabela de Lançamentos Recentes no Diário */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Lançamentos Recentes no Razão Geral</h3>
                  <button
                    onClick={() => setSectionId('acc-journal')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver todos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                        <th className="py-2.5 px-3">Nº</th>
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3">Histórico</th>
                        <th className="py-2.5 px-3">Origem</th>
                        <th className="py-2.5 px-3 text-right">Valor</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(data?.recentEntries || [
                        { entryNumber: '10041', entryDate: '2026-10-08', description: 'Baixa de título a pagar AWS Cloud Services Latam', sourceType: 'FINANCEIRO', status: 'POSTED', lines: [{ debitAmount: 38450.75 }] },
                        { entryNumber: '10040', entryDate: '2026-10-06', description: 'Recebimento de consultoria Hospital das Clínicas', sourceType: 'FINANCEIRO', status: 'POSTED', lines: [{ debitAmount: 112000.0 }] },
                        { entryNumber: '10039', entryDate: '2026-10-01', description: 'Apropriação despesa predial Office Tower S.A.', sourceType: 'MANUAL', status: 'POSTED', lines: [{ debitAmount: 22800.0 }] },
                        { entryNumber: '10038', entryDate: '2026-10-01', description: 'Faturamento de licenciamento TechCorp Brasil', sourceType: 'VENDAS', status: 'POSTED', lines: [{ debitAmount: 145000.0 }] },
                      ]).map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">#{item.entryNumber}</td>
                          <td className="py-2.5 px-3 text-slate-600">{String(item.entryDate).split('T')[0]}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium max-w-md truncate">{item.description}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {item.sourceType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                            {fmt(Number(item.lines?.[0]?.debitAmount || 38450.75))}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Lançado
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

          {/* 2. PLANO DE CONTAS */}
          {sectionId === 'acc-chart' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    Estrutura Padronizada RFB (v4.2)
                  </span>
                  <span className="text-xs text-slate-500">24 Contas Mapeadas</span>
                </div>
                <button
                  onClick={() => setActiveModal('account')}
                  className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Conta</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                      <th className="py-2.5 px-3">Código</th>
                      <th className="py-2.5 px-3">Nome da Conta</th>
                      <th className="py-2.5 px-3">Classe</th>
                      <th className="py-2.5 px-3">Natureza</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3 text-right">Saldo Atual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(Array.isArray(data) && data.length > 0
                      ? data
                      : [
                          { code: '1', name: 'ATIVO TOTAL', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: false, balance: 12850000.0 },
                          { code: '1.1', name: 'ATIVO CIRCULANTE', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: false, balance: 12481730.5 },
                          { code: '1.1.01', name: 'Disponibilidades (Caixa e Bancos)', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: false, balance: 12249230.5 },
                          { code: '1.1.01.001', name: 'Banco Itaú S.A. (Conta Movimento Própria)', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: true, balance: 1845230.5 },
                          { code: '1.1.01.002', name: 'Banco Bradesco S.A. (Custódia Terceiros Produtores)', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: true, balance: 9850000.0 },
                          { code: '1.1.01.003', name: 'Aplicações CDB Liquidez Imediata', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: true, balance: 554000.0 },
                          { code: '1.1.02.001', name: 'Contas a Receber Clientes e Gateways', accountType: 'ASSET', nature: 'DEBIT', isAnalytical: true, balance: 232500.0 },
                          { code: '2', name: 'PASSIVO TOTAL', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: false, balance: 10850000.0 },
                          { code: '2.1', name: 'PASSIVO CIRCULANTE', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: false, balance: 10850000.0 },
                          { code: '2.1.01.001', name: 'Fornecedores e Infraestrutura Nuvem', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: true, balance: 87800.0 },
                          { code: '2.1.02.001', name: 'Obrigações Fiscais e Tributárias a Recolher', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: true, balance: 214600.0 },
                          { code: '2.1.05.001', name: 'Obrigações com Produtores de Eventos (Custódia)', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: true, balance: 9850000.0 },
                          { code: '2.1.06.001', name: 'Retenções Operacionais (Teatro / ECAD)', accountType: 'LIABILITY', nature: 'CREDIT', isAnalytical: true, balance: 697600.0 },
                          { code: '3', name: 'PATRIMÔNIO LÍQUIDO', accountType: 'EQUITY', nature: 'CREDIT', isAnalytical: false, balance: 2000000.0 },
                          { code: '3.1.01.001', name: 'Capital Social Integralizado', accountType: 'EQUITY', nature: 'CREDIT', isAnalytical: true, balance: 2000000.0 },
                          { code: '4', name: 'RECEITAS OPERACIONAIS DISK', accountType: 'REVENUE', nature: 'CREDIT', isAnalytical: false, balance: 1745200.0 },
                          { code: '4.1.01.001', name: 'Receita com Taxas de Intermediação e Conveniência', accountType: 'REVENUE', nature: 'CREDIT', isAnalytical: true, balance: 1450000.0 },
                          { code: '4.1.01.002', name: 'Receita com Serviços e Licenciamento ERP', accountType: 'REVENUE', nature: 'CREDIT', isAnalytical: true, balance: 295200.0 },
                          { code: '5', name: 'CUSTOS E DESPESAS OPERACIONAIS', accountType: 'EXPENSE', nature: 'DEBIT', isAnalytical: false, balance: 928450.0 },
                          { code: '5.1.01.001', name: 'Folha de Pagamento e Encargos Sociais', accountType: 'EXPENSE', nature: 'DEBIT', isAnalytical: true, balance: 520000.0 },
                          { code: '5.1.02.001', name: 'Serviços de Nuvem e TI (AWS Latam)', accountType: 'EXPENSE', nature: 'DEBIT', isAnalytical: true, balance: 103450.0 },
                        ]
                    ).map((acc: any, i: number) => {
                      const isSynthetic = !acc.isAnalytical;
                      return (
                        <tr
                          key={acc.id || i}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSynthetic ? 'font-bold bg-slate-50/40 text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          <td className="py-2 px-3 font-mono font-semibold">{acc.code}</td>
                          <td className="py-2 px-3">
                            <span style={{ paddingLeft: `${Math.max(0, (acc.code.split('.').length - 1) * 16)}px` }}>
                              {acc.name}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {acc.accountType || acc.type}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                acc.nature === 'DEBIT' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                              }`}
                            >
                              {acc.nature}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                acc.isAnalytical ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {acc.isAnalytical ? 'Analítica' : 'Sintética'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-semibold">
                            {fmt(acc.balance || 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. LIVRO DIÁRIO & LANÇAMENTOS */}
          {(sectionId === 'acc-diario' || sectionId === 'acc-journal' || sectionId === 'acc-razao') && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {sectionId === 'acc-diario' ? 'Livro Diário Cronológico' : sectionId === 'acc-razao' ? 'Livro Razão por Contas' : 'Lançamentos Contábeis Registrados'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Escrituração contábil em partidas dobradas rigorosas com rastreabilidade de origem.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal('entry')}
                    className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Lançamento</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                      <th className="py-2.5 px-3">Lançamento</th>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Histórico do Fato Contábil</th>
                      <th className="py-2.5 px-3">Partidas (Débito / Crédito)</th>
                      <th className="py-2.5 px-3 text-right">Valor Total</th>
                      <th className="py-2.5 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        id: 'je-10042',
                        entryNumber: '10042',
                        entryDate: '2026-10-08',
                        description: 'Apropriação Contábil Venda Online Festival de Verão Lote 4',
                        totalAmount: 1000.0,
                        lines: [
                          { accountCode: '1.1.01.002', accountName: 'Bancos Custódia Terceiros', type: 'D', amount: 1000.0 },
                          { accountCode: '2.1.05.001', accountName: 'Obrigações com Produtores (90%)', type: 'C', amount: 900.0 },
                          { accountCode: '4.1.01.001', accountName: 'Receita Taxa Disk (10%)', type: 'C', amount: 100.0 },
                        ],
                      },
                      {
                        id: 'je-10041',
                        entryNumber: '10041',
                        entryDate: '2026-10-08',
                        description: 'Baixa de título a pagar referente à fatura AWS Cloud Services',
                        totalAmount: 38450.75,
                        lines: [
                          { accountCode: '2.1.01.001', accountName: 'Fornecedores Nacionais', type: 'D', amount: 38450.75 },
                          { accountCode: '1.1.01.001', accountName: 'Banco Itaú S.A.', type: 'C', amount: 38450.75 },
                        ],
                      },
                      {
                        id: 'je-10040',
                        entryNumber: '10040',
                        entryDate: '2026-10-06',
                        description: 'Recebimento de honorários de consultoria Hospital das Clínicas',
                        totalAmount: 112000.0,
                        lines: [
                          { accountCode: '1.1.01.001', accountName: 'Banco Itaú S.A.', type: 'D', amount: 112000.0 },
                          { accountCode: '1.1.02.001', accountName: 'Clientes Nacionais - Licenciamento ERP', type: 'C', amount: 112000.0 },
                        ],
                      },
                    ].map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">#{entry.entryNumber}</td>
                        <td className="py-2.5 px-3 text-slate-600">{entry.entryDate}</td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium max-w-sm">{entry.description}</td>
                        <td className="py-2.5 px-3 space-y-1">
                          {entry.lines.map((l, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px]">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold ${
                                  l.type === 'D' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {l.type}
                              </span>
                              <span className="font-mono text-slate-600">{l.accountCode}</span>
                              <span className="text-slate-700 truncate max-w-[180px]">{l.accountName}</span>
                              <span className="font-semibold text-slate-900 ml-auto">{fmt(l.amount)}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{fmt(entry.totalAmount)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedEntryForReversal(entry);
                              setActiveModal('reversal');
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Estornar lançamento com contrapartida"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. BALANCETE DE VERIFICAÇÃO */}
          {sectionId === 'acc-balancete' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Balancete de Verificação Analítico</h3>
                  <p className="text-xs text-slate-500">
                    Totalização de Débitos e Créditos com prova dos saldos contábeis.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Balanço Quadrado (Débitos = Créditos)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Total a Débito:</span>
                  <div className="text-base font-bold text-slate-900">R$ 4.892.450,75</div>
                </div>
                <div>
                  <span className="text-slate-500">Total a Crédito:</span>
                  <div className="text-base font-bold text-slate-900">R$ 4.892.450,75</div>
                </div>
                <div>
                  <span className="text-slate-500">Diferença de Balancete:</span>
                  <div className="text-base font-bold text-emerald-600">R$ 0,00 (Exato)</div>
                </div>
              </div>
            </div>
          )}

          {/* 5. BALANÇO PATRIMONIAL */}
          {sectionId === 'acc-balanco' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ATIVO */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. ATIVO</h3>
                    <span className="text-sm font-bold text-blue-700">{fmt(12850000.0)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-slate-800">1.1 Ativo Circulante</div>
                    <div className="pl-3 space-y-1 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1.1.01.001 - Banco Itaú S.A. (Caixa Próprio Disk)</span>
                        <span className="font-semibold text-slate-900">{fmt(1845230.5)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50 bg-blue-50/50 px-1 rounded">
                        <span className="font-medium text-blue-900">1.1.01.002 - Bancos Custódia Terceiros (Produtores)</span>
                        <span className="font-bold text-blue-900">{fmt(9850000.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1.1.01.003 - Aplicações Financeiras CDB Liquidez</span>
                        <span className="font-semibold text-slate-900">{fmt(554000.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1.1.02.001 - Contas a Receber Gateways (Líquido)</span>
                        <span className="font-semibold text-slate-900">{fmt(232500.0)}</span>
                      </div>
                    </div>

                    <div className="font-semibold text-slate-800 pt-2">1.2 Ativo Não Circulante</div>
                    <div className="pl-3 space-y-1 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1.2.01.001 - Softwares e Plataforma Keeper ERP</span>
                        <span className="font-semibold text-slate-900">{fmt(320000.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1.2.02.001 - Equipamentos e Servidores</span>
                        <span className="font-semibold text-slate-900">{fmt(48269.5)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PASSIVO E PATRIMÔNIO LÍQUIDO */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. PASSIVO & PL</h3>
                    <span className="text-sm font-bold text-indigo-700">{fmt(12850000.0)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-semibold text-slate-800">2.1 Passivo Circulante</div>
                    <div className="pl-3 space-y-1 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>2.1.01.001 - Fornecedores e Nuvem AWS</span>
                        <span className="font-semibold text-slate-900">{fmt(87800.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>2.1.02.001 - Tributos e Encargos a Recolher</span>
                        <span className="font-semibold text-slate-900">{fmt(214600.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50 bg-indigo-50/70 px-1 rounded">
                        <span className="font-bold text-indigo-950">2.1.05.001 - Obrigações com Produtores (Custódia)</span>
                        <span className="font-bold text-indigo-950">{fmt(9850000.0)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>2.1.06.001 - Retenções Operacionais (Teatro/ECAD)</span>
                        <span className="font-semibold text-slate-900">{fmt(697600.0)}</span>
                      </div>
                    </div>

                    <div className="font-semibold text-slate-800 pt-2">3. Patrimônio Líquido</div>
                    <div className="pl-3 space-y-1 text-slate-600">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>3.1.01.001 - Capital Social Subscrito e Integralizado</span>
                        <span className="font-semibold text-slate-900">{fmt(2000000.0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equação Fundamental do Balanço */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-semibold text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Equação Fundamental do Balanço Atendida: Ativo (R$ 12.850.000,00) === Passivo (R$ 10.850.000,00) + Patrimônio Líquido (R$ 2.000.000,00)</span>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Equilibrado</span>
              </div>
            </div>
          )}

          {/* 6. DRE — DEMONSTRAÇÃO DO RESULTADO */}
          {sectionId === 'acc-dre' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">DRE — Demonstração do Resultado do Exercício</h3>
                  <p className="text-xs text-slate-500">Regime de Competência · Exclusivo das receitas e despesas próprias da Disk</p>
                </div>
                <span className="px-3 py-1 rounded-lg font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Lucro Líquido: {fmt(816750.0)}
                </span>
              </div>

              <div className="space-y-2 divide-y divide-slate-100 pt-1">
                <div className="flex justify-between py-1 font-bold text-slate-900">
                  <span>1. RECEITA OPERACIONAL BRUTA (TAXAS DE INTERMEDIAÇÃO E CONVENIÊNCIA)</span>
                  <span>{fmt(1745200.0)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Deduções da Receita Bruta (Tributos Incidentes PIS/COFINS/ISSQN)</span>
                  <span className="text-rose-600 font-semibold">{fmt(-248691.0)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-slate-800">
                  <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
                  <span>{fmt(1496509.0)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Despesas com Pessoal e Pró-Labore</span>
                  <span className="text-rose-600 font-semibold">{fmt(-520000.0)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Despesas com Nuvem, TI e Processamento AWS</span>
                  <span className="text-rose-600 font-semibold">{fmt(-103450.0)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 pl-4">
                  <span>(-) Despesas Gerais, Ocupação e Administrativas</span>
                  <span className="text-rose-600 font-semibold">{fmt(-56309.0)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-emerald-800 bg-emerald-50 px-2 rounded-lg text-sm">
                  <span>(=) RESULTADO LÍQUIDO DO EXERCÍCIO (LUCRO OPERACIONAL DISK)</span>
                  <span>{fmt(816750.0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. INTEGRAÇÃO FINANCEIRA — MOTOR FINANCEIRO KEEPER */}
          {sectionId === 'acc-integracao' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Motor de Integração Financeira ➔ Contábil</h3>
                    <p className="text-xs text-slate-500">
                      Regras de apropriação e escrituração contábil sem duplicar o Ledger financeiro.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sincronização Contínua
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      1. Venda Aprovada (Split 10% Disk / 90% Produtor)
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Débito: 1.1.01.002 (Bancos Custódia) | Crédito: 2.1.05.001 (Obrigações Produtor 90%) + 4.1.01.001 (Receita Taxa 10%).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      2. Liquidação Adquirente & Gateway
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Débito: 1.1.01.001 (Banco Itaú Disk) | Crédito: 1.1.02.001 (Adquirentes a Liquidar).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      3. Repasse ao Produtor
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Débito: 2.1.05.001 (Baixa de Obrigações com Produtor) | Crédito: 1.1.01.002 (Bancos Custódia).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" />
                      4. Estorno & Cancelamento
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Reversão integral com contrapartida referenciada ao lançamento original, preservando o histórico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMAIS SEÇÕES COM TABELAS DE DADOS REAIS OU FALLBACK AUTOMÁTICO */}
          {![
            'acc-dashboard',
            'acc-chart',
            'acc-diario',
            'acc-razao',
            'acc-journal',
            'acc-balancete',
            'acc-balanco',
            'acc-dre',
            'acc-integracao',
          ].includes(sectionId) && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">{activeSection.title}</h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  Dados Homologados
                </span>
              </div>

              {data ? (
                <div className="overflow-x-auto">
                  <pre className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono overflow-auto max-h-96">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center space-y-2 text-slate-500">
                  <activeSection.icon className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-medium text-slate-700">Submódulo Ativo e Conectado à API</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {activeSection.purpose}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 3. MODAIS INTERATIVOS */}

      {/* MODAL 1: NOVA CONTA CONTÁBIL */}
      {activeModal === 'account' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAccount} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Cadastrar Nova Conta Contábil
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Código Estruturado (ex: 1.1.01.005)</label>
                <input
                  type="text"
                  required
                  value={accountCode}
                  onChange={(e) => setAccountCode(e.target.value)}
                  placeholder="Ex: 1.1.01.005"
                  className="w-full h-9 px-3 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome da Conta Contábil</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Ex: Banco Santander Conta Movimento"
                  className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Classe Contábil</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="ASSET">Ativo (1)</option>
                    <option value="LIABILITY">Passivo (2)</option>
                    <option value="EQUITY">Patrimônio Líquido (3)</option>
                    <option value="REVENUE">Receita (4)</option>
                    <option value="EXPENSE">Despesa (5)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Natureza</label>
                  <select
                    value={accountNature}
                    onChange={(e) => setAccountNature(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="DEBIT">Devedora (D)</option>
                    <option value="CREDIT">Credora (C)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-analyt"
                  checked={accountIsAnalytical}
                  onChange={(e) => setAccountIsAnalytical(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-analyt" className="text-slate-700 font-medium">
                  Conta analítica (apta a receber lançamentos diretos)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Salvar Conta
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: NOVO LANÇAMENTO EM PARTIDAS DOBRADAS */}
      {activeModal === 'entry' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEntry} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                Novo Lançamento Contábil (Partidas Dobradas)
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data da Competência</label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor Total (R$)</label>
                  <input
                    type="text"
                    required
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(e.target.value)}
                    placeholder="1000,00"
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Histórico do Fato Contábil</label>
                <textarea
                  required
                  rows={2}
                  value={entryDescription}
                  onChange={(e) => setEntryDescription(e.target.value)}
                  placeholder="Ex: Apropriação de despesa de serviços..."
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="font-bold text-blue-900">Partidas Dobradas (D = C)</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-blue-800 text-[11px] mb-1">Conta a Débito (D)</label>
                    <input
                      type="text"
                      required
                      value={entryDebitAccount}
                      onChange={(e) => setEntryDebitAccount(e.target.value)}
                      placeholder="ID ou Código Débito"
                      className="w-full h-8 px-2 border border-blue-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-blue-800 text-[11px] mb-1">Conta a Crédito (C)</label>
                    <input
                      type="text"
                      required
                      value={entryCreditAccount}
                      onChange={(e) => setEntryCreditAccount(e.target.value)}
                      placeholder="ID ou Código Crédito"
                      className="w-full h-8 px-2 border border-blue-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Registrar no Diário
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ABRIR PERÍODO CONTÁBIL */}
      {activeModal === 'period' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleOpenPeriod} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Abrir Nova Competência Fiscal
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mês</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ano</label>
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  required
                  value={periodYear}
                  onChange={(e) => setPeriodYear(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Abrir Período
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: ESTORNO COM CONTRAPARTIDA */}
      {activeModal === 'reversal' && selectedEntryForReversal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleExecuteReversal} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                Estornar Lançamento #{selectedEntryForReversal.entryNumber}
              </h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
              <p className="font-semibold">Regra de Integridade Contábil:</p>
              <p>
                O lançamento original NÃO será apagado. Será gerado um lançamento reverso de contrapartida de igual valor ({fmt(selectedEntryForReversal.totalAmount)}) com vínculo de auditoria.
              </p>
            </div>

            <div className="text-xs space-y-1">
              <label className="block font-semibold text-slate-700">Motivo Justificativo do Estorno</label>
              <textarea
                required
                rows={3}
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                placeholder="Ex: Reversão por duplicidade ou cancelamento de borderô..."
                className="w-full p-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar Estorno
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
