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
  Users,
  Briefcase,
  Wallet,
  Ticket,
  Scale,
  Building,
  Filter,
  ChevronDown,
  PanelRight,
  PanelLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { ACCOUNTING_PATHS, AccountingRequest } from '../../services/contabilidadeClient';
import { api } from '../../services/api';

export type AccountingEnvironment =
  | 'DISK_EMPRESA'
  | 'PRODUTORES_EVENTOS'
  | 'INTEGRACAO_CONCILIACAO';

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
  badge?: string;
  badgeColor?: string;
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

// Dados de Produtores e Eventos (Homologação & Auditoria Segregada)
const PRODUCERS_MOCK = [
  {
    id: 'prod-01',
    name: 'Opus Entretenimento Ltda',
    cnpj: '01.234.567/0001-89',
    eventsCount: 2,
    grossTicketSales: 3850000.0,
    diskFeeDeduction: 385000.0,
    withholdings: 192500.0,
    repassesExecuted: 2400000.0,
    custodyBalance: 872500.0,
    reconciliationStatus: 'CONCILIADO',
    events: [
      { id: 'ev-01', name: 'Teatro Guaíra - Orquestra Filarmônica', date: '2026-10-18', gross: 1850000.0, diskFee: 185000.0, repassed: 1200000.0, custody: 465000.0 },
      { id: 'ev-02', name: 'Show Sinfônico Acústico', date: '2026-10-25', gross: 2000000.0, diskFee: 200000.0, repassed: 1200000.0, custody: 407500.0 },
    ],
  },
  {
    id: 'prod-02',
    name: 'Live Nation Brasil Produções Ltda',
    cnpj: '12.345.678/0001-90',
    eventsCount: 2,
    grossTicketSales: 12400000.0,
    diskFeeDeduction: 1240000.0,
    withholdings: 310000.0,
    repassesExecuted: 6800000.0,
    custodyBalance: 4050000.0,
    reconciliationStatus: 'CONCILIADO',
    events: [
      { id: 'ev-03', name: 'Mega Festival de Verão 2026', date: '2026-11-15', gross: 8400000.0, diskFee: 840000.0, repassed: 4500000.0, custody: 2850000.0 },
      { id: 'ev-04', name: 'Pop Stadium Tour Curitiba', date: '2026-12-05', gross: 4000000.0, diskFee: 400000.0, repassed: 2300000.0, custody: 1200000.0 },
    ],
  },
  {
    id: 'prod-03',
    name: 'T4F Entretenimento S.A.',
    cnpj: '23.456.789/0001-01',
    eventsCount: 2,
    grossTicketSales: 5950000.0,
    diskFeeDeduction: 595000.0,
    withholdings: 595000.0,
    repassesExecuted: 3450000.0,
    custodyBalance: 1310000.0,
    reconciliationStatus: 'CONCILIADO',
    events: [
      { id: 'ev-05', name: 'Arena Rock Festival', date: '2026-11-20', gross: 3950000.0, diskFee: 395000.0, repassed: 2450000.0, custody: 710000.0 },
      { id: 'ev-06', name: 'Festival Internacional de Jazz', date: '2026-12-12', gross: 2000000.0, diskFee: 200000.0, repassed: 1000000.0, custody: 600000.0 },
    ],
  },
  {
    id: 'prod-04',
    name: 'Move Concerts Entretenimento Ltda',
    cnpj: '34.567.890/0001-12',
    eventsCount: 1,
    grossTicketSales: 2300000.0,
    diskFeeDeduction: 230000.0,
    withholdings: 0.0,
    repassesExecuted: 2000000.0,
    custodyBalance: 70000.0,
    reconciliationStatus: 'CONCILIADO',
    events: [
      { id: 'ev-07', name: 'Electronic Sound Arena', date: '2026-10-30', gross: 2300000.0, diskFee: 230000.0, repassed: 2000000.0, custody: 70000.0 },
    ],
  },
];

// Dados da Folha de Pagamento Disk Corporativa
const PAYROLL_MOCK = {
  period: 'Outubro / 2026',
  companyName: 'Disk Ingressos Entretenimento S.A.',
  overview: {
    totalEmployees: 42,
    grossSalary: 348500.0,
    inssEmployer: 69700.0, // 20% INSS Patronal
    fgts: 27880.0, // 8% FGTS
    ratFap: 6970.0, // 2% RAT/FAP
    terceirosSistemaS: 20213.0, // 5.8% Terceiros
    provision13th: 29041.67,
    provisionVacation: 38722.22,
    provisionCharges: 18702.83,
    benefits: 64700.0, // VR/VA + VT + Saúde
    inssEmployeeWithheld: 38335.0,
    irrfWithheld: 27880.0,
    netSalaryPayable: 282285.0,
    totalPersonnelExpense: 594530.22, // DRE 5.1.02
  },
  costCenters: [
    { code: 'CC-101', name: 'Infraestrutura Cloud & TI', department: 'Tecnologia', headcount: 14, grossAmount: 145000.0, totalCost: 242000.0 },
    { code: 'CC-201', name: 'Operações e Bilheteria PDV', department: 'Operações', headcount: 12, grossAmount: 72000.0, totalCost: 118000.0 },
    { code: 'CC-301', name: 'Gestão Comercial & Produtores', department: 'Comercial', headcount: 7, grossAmount: 58000.0, totalCost: 98000.0 },
    { code: 'CC-302', name: 'Controladoria & Auditoria Contábil', department: 'Financeiro', headcount: 5, grossAmount: 48500.0, totalCost: 82530.22 },
    { code: 'CC-401', name: 'Tributos, Fiscal & Tax Compliance', department: 'Fiscal', headcount: 4, grossAmount: 25000.0, totalCost: 54000.0 },
  ],
  journalEntries: [
    {
      id: 'JE-FOLHA-01',
      description: 'Apropriação da Folha Salarial Mensal — Competência 10/2026',
      debitAccount: '5.1.02.001 - Despesas com Salários e Ordenados Disk',
      creditAccount: '2.1.03.001 - Salários a Pagar (Líquido)',
      amount: 282285.0,
    },
    {
      id: 'JE-FOLHA-02',
      description: 'Encargos Patronais sobre Folha (INSS Patronal + FGTS + RAT)',
      debitAccount: '5.1.02.002 - Encargos Sociais e Previdenciários Patronais',
      creditAccount: '2.1.02.004 - Obrigações Previdenciárias e FGTS a Recolher',
      amount: 124763.0,
    },
    {
      id: 'JE-FOLHA-03',
      description: 'Provisões Trabalhistas Constitucionais (13º Salário e Férias)',
      debitAccount: '5.1.02.003 - Despesas com Provisão de Férias e 13º Salário',
      creditAccount: '2.1.03.005 - Provisões Trabalhistas Passivas a Pagar',
      amount: 94482.22,
    },
    {
      id: 'JE-FOLHA-04',
      description: 'Benefícios aos Colaboradores (Vale Refeição, Transporte e Saúde)',
      debitAccount: '5.1.02.004 - Benefícios e Assistência Médica Corporativa',
      creditAccount: '2.1.01.008 - Fornecedores de Benefícios a Liquidar',
      amount: 64700.0,
    },
  ],
  employees: [
    { id: 'emp-01', name: 'Lucas Santana', role: 'Tech Lead / Arquiteto Sênior', department: 'CC-101 TI', grossSalary: 18500.0, regime: 'CLT' },
    { id: 'emp-02', name: 'Camila Fernandes', role: 'Engenheira de Banco de Dados', department: 'CC-101 TI', grossSalary: 14000.0, regime: 'CLT' },
    { id: 'emp-03', name: 'Dr. Roberto Meirelles', role: 'Contador Chefe Responsável (CRC)', department: 'CC-302 Controladoria', grossSalary: 15500.0, regime: 'CLT' },
    { id: 'emp-04', name: 'Juliana Prado', role: 'Gerente Comercial de Produtores', department: 'CC-301 Comercial', grossSalary: 12000.0, regime: 'CLT' },
    { id: 'emp-05', name: 'Marcos Vinicius', role: 'Supervisor de Operações de Bilheteria', department: 'CC-201 Operações', grossSalary: 7500.0, regime: 'CLT' },
    { id: 'emp-06', name: 'Aline Souza', role: 'Analista de Tax & Compliance Fiscal', department: 'CC-401 Fiscal', grossSalary: 8200.0, regime: 'CLT' },
  ],
};

interface Props {
  request?: AccountingRequest;
  initialSection?: string;
}

export function ContabilidadeCompletaView({ request = api.accountingRequest, initialSection = 'acc-dashboard' }: Props) {
  // 1. Estados dos Três Ambientes Contábeis
  const [environment, setEnvironment] = useState<AccountingEnvironment>('DISK_EMPRESA');
  const [diskCorporateTab, setDiskCorporateTab] = useState<'ESCRITURACAO' | 'FOLHA_PAGAMENTO'>('ESCRITURACAO');

  // Filtros de Produtor e Evento
  const [selectedProducerId, setSelectedProducerId] = useState<string>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  // Navegação dos 18 submenus
  const [sectionId, setSectionId] = useState<ContabilSectionId>((initialSection as ContabilSectionId) || 'acc-dashboard');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarSide, setSidebarSide] = useState<'right' | 'left'>('left');
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Modais interativos
  const [activeModal, setActiveModal] = useState<'account' | 'entry' | 'period' | 'reversal' | null>(null);
  const [selectedEntryForReversal, setSelectedEntryForReversal] = useState<any | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  // Formulários
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

  // Formatador Monetário
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Sincronização externa de navegação
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

  // Busca de Dados Contábeis com suporte a Ambiente & Filtros
  const loadSectionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        context: environment,
        ...(selectedProducerId !== 'all' ? { producerId: selectedProducerId } : {}),
        ...(selectedEventId !== 'all' ? { eventId: selectedEventId } : {}),
      });

      const fullPath = `${activeSection.endpoint}?${queryParams.toString()}`;
      const res = await request(fullPath);
      setData(res);
    } catch (err: any) {
      console.warn(`[Contabilidade] API request fallback for ${activeSection.endpoint}:`, err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeSection.endpoint, environment, selectedProducerId, selectedEventId, request]);

  useEffect(() => {
    loadSectionData();
  }, [loadSectionData]);

  // Handle Criar Conta
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

  // Handle Abrir Período
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

  // Handle Criar Lançamento
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

  // Handle Estorno
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

  // Filtro de submenus
  const filteredSections = useMemo(() => {
    if (!sidebarSearch.trim()) return CONTABILIDADE_SECTIONS;
    const q = sidebarSearch.toLowerCase();
    return CONTABILIDADE_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [sidebarSearch]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, SectionDef[]> = {};
    for (const s of filteredSections) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    }
    return groups;
  }, [filteredSections]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const collapseAll = () => {
    const allGroups = ['Escrituração & Razão', 'Demonstrações Oficiais', 'Controladoria & Integração', 'Governança & Arquivos'];
    const nextState: Record<string, boolean> = {};
    allGroups.forEach((g) => { nextState[g] = true; });
    setCollapsedGroups(nextState);
  };

  const expandAll = () => {
    setCollapsedGroups({});
  };

  // Lista de produtores filtrados
  const activeProducer = useMemo(() => {
    if (selectedProducerId === 'all') return null;
    return PRODUCERS_MOCK.find((p) => p.id === selectedProducerId) || null;
  }, [selectedProducerId]);

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. Header Corporativo com os 3 Ambientes Contábeis */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-800 via-blue-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Módulo de Contabilidade Integrada
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Partidas Dobradas 100%
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  Keeper ERP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Gestão contábil e fiscal unificada: escrituração societária Disk, controle auxiliar de eventos dos produtores e conciliação financeira.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Exercício: <strong>Outubro / 2026</strong></span>
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

        {/* 🌟 SELETOR DOS 3 AMBIENTES CONTÁBEIS CLARAMENTE DEFINIDOS 🌟 */}
        <div className="bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Ambiente 1: Contabilidade Empresarial Disk */}
          <button
            type="button"
            onClick={() => setEnvironment('DISK_EMPRESA')}
            className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              environment === 'DISK_EMPRESA'
                ? 'bg-white border border-blue-600/30 shadow-sm text-slate-900 ring-2 ring-blue-500/10'
                : 'hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${environment === 'DISK_EMPRESA' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight">Contabilidade Empresarial Disk</span>
                {environment === 'DISK_EMPRESA' && (
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Escrituração societária própria, receitas de taxas, colaboradores, folha de pagamento, tributos e DRE da Disk.
              </p>
            </div>
          </button>

          {/* Ambiente 2: Contabilidade de Eventos e Produtores */}
          <button
            type="button"
            onClick={() => setEnvironment('PRODUTORES_EVENTOS')}
            className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              environment === 'PRODUTORES_EVENTOS'
                ? 'bg-white border border-indigo-600/30 shadow-sm text-slate-900 ring-2 ring-indigo-500/10'
                : 'hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${environment === 'PRODUTORES_EVENTOS' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight">Contabilidade de Eventos & Produtores</span>
                {environment === 'PRODUTORES_EVENTOS' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Controle auxiliar segregado por produtor e evento: ingressos em custódia fiduciária, retenções e repasses.
              </p>
            </div>
          </button>

          {/* Ambiente 3: Integração e Conciliação Contábil */}
          <button
            type="button"
            onClick={() => setEnvironment('INTEGRACAO_CONCILIACAO')}
            className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              environment === 'INTEGRACAO_CONCILIACAO'
                ? 'bg-white border border-emerald-600/30 shadow-sm text-slate-900 ring-2 ring-emerald-500/10'
                : 'hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${environment === 'INTEGRACAO_CONCILIACAO' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight">Integração & Conciliação Contábil</span>
                {environment === 'INTEGRACAO_CONCILIACAO' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                Ligação operacional com o Ledger financeiro: split 90/10, confronto 1:1, travas de fechamento e trilha auditável.
              </p>
            </div>
          </button>
        </div>

        {/* Banners e Filtros Contextuais por Ambiente */}
        {environment === 'DISK_EMPRESA' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 rounded-xl border border-blue-200/70 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Contexto Corporativo:</strong> Disk Ingressos Entretenimento S.A. (CNPJ 08.123.456/0001-90) · Regime de Lucro Real com escrituração completa.
              </span>
            </div>

            {/* Alternador de Visão Corporativa (Escrituração Geral vs Folha de Pagamento) */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-200 shadow-2xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setDiskCorporateTab('ESCRITURACAO')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  diskCorporateTab === 'ESCRITURACAO'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Escrituração Geral
              </button>
              <button
                type="button"
                onClick={() => setDiskCorporateTab('FOLHA_PAGAMENTO')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  diskCorporateTab === 'FOLHA_PAGAMENTO'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Folha & Colaboradores (42)</span>
              </button>
            </div>
          </div>
        )}

        {environment === 'PRODUTORES_EVENTOS' && (
          <div className="space-y-3 p-3.5 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-blue-50/50 rounded-xl border border-indigo-200 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-indigo-900">
                <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Garantia de Segregação Patrimonial:</strong> O montante de ingressos sob custódia (R$ 9.850.000,00) pertence estritamente aos produtores e é escriturado no Passivo de Terceiros (2.1.05.001), <strong>não transitando na receita própria da Disk</strong>.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 shrink-0 self-start sm:self-auto">
                Patrimônio de Afetação Fiduciária
              </span>
            </div>

            {/* Filtros Ativos de Produtor e Evento */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-indigo-100/80">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold text-slate-700">Filtrar Produtor:</span>
                <select
                  value={selectedProducerId}
                  onChange={(e) => {
                    setSelectedProducerId(e.target.value);
                    setSelectedEventId('all');
                  }}
                  className="h-8 px-2.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Todos os Produtores ({PRODUCERS_MOCK.length})</option>
                  {PRODUCERS_MOCK.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeProducer && (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Evento:</span>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="h-8 px-2.5 text-xs bg-white border border-indigo-200 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Todos os Eventos ({activeProducer.events.length})</option>
                    {activeProducer.events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {environment === 'INTEGRACAO_CONCILIACAO' && (
          <div className="p-3 bg-gradient-to-r from-emerald-50/80 to-slate-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Regra de Split Automático do Motor Financeiro:</strong> Toda venda é imediatamente decomposta em <strong>10% Receita Própria Disk</strong> (Conta 4.1.01) e <strong>90% Obrigação com o Produtor</strong> (Conta 2.1.05.001) com auditoria 1:1.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0">
              1.542 Vendas Sincronizadas
            </span>
          </div>
        )}
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

      {/* 2. Layout Principal: Menu Lateral dos 18 Submenus Contábeis + Conteúdo Central */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Menu Lateral com os 18 Submenus Padronizados — PROPORCIONAL À PÁGINA */}
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
                      ? 'bg-blue-50 border border-blue-200/80 text-blue-600'
                      : 'bg-blue-900/40 border border-blue-700/50 text-blue-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        sidebarTheme === 'light' ? 'text-slate-900' : 'text-slate-200'
                      }`}
                    >
                      Submenus Contábeis
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        sidebarTheme === 'light'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                      }`}
                    >
                      18 Áreas
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-medium ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    4 Grupos de Escrituração
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
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                  }`}
                  title={`Mover menu contábil para a ${sidebarSide === 'right' ? 'Esquerda' : 'Direita'}`}
                >
                  {sidebarSide === 'right' ? (
                    <PanelRight className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <PanelLeft className="w-3.5 h-3.5 text-blue-600" />
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
                    <Moon className="w-3.5 h-3.5 text-blue-300" />
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
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                Recolher todos
              </button>
              <span className="opacity-40">·</span>
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-blue-600 cursor-pointer transition-colors"
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
                placeholder="Filtrar submenus contábeis..."
                className={`w-full h-8 pl-8 pr-7 rounded-xl text-xs transition-colors focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
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

            {/* Lista Agrupada dos 18 Submenus — ALTURA PROPORCIONAL À PÁGINA */}
            <div className="space-y-3.5 max-h-[calc(100vh-140px)] min-h-[820px] overflow-y-auto pr-1 select-none no-scrollbar">
              {Object.entries(groupedSections).map(([groupName, sections]) => {
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
                              onClick={() => {
                                setSectionId(item.id);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs shadow-blue-600/25 ring-1 ring-blue-500'
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
                                      ? 'text-slate-400 group-hover:text-blue-600'
                                      : 'text-slate-400'
                                  }`}
                                />
                                <span className="truncate">{item.title}</span>
                              </div>
                              {item.badge ? (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    isCurrent
                                      ? 'bg-white/20 text-white border border-white/20'
                                      : item.badgeColor ||
                                        (sidebarTheme === 'light'
                                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                                          : 'bg-blue-950 text-blue-300')
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

              {/* Card de Resumo de Governança Contábil no Rodapé da Barra Lateral */}
              <div className="pt-2">
                <div
                  className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                    sidebarTheme === 'light'
                      ? 'bg-gradient-to-br from-blue-50/60 via-slate-50 to-indigo-50/50 border-blue-100/80'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold flex items-center gap-1.5 ${
                        sidebarTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Governança Contábil Disk
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        sidebarTheme === 'light'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-blue-900/80 text-blue-300'
                      }`}
                    >
                      CRC Ativo
                    </span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    100% Partidas Dobradas. Controle auxiliar segregado por produtor e evento.
                  </p>
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${
                      sidebarTheme === 'light'
                        ? 'text-slate-600 border-blue-100/60'
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

        {/* Conteúdo Central da Seção Selecionada */}
        <main
          className={`space-y-4 xl:col-span-9 ${
            sidebarSide === 'right' ? 'xl:order-1 order-2' : 'xl:order-2 order-2'
          }`}
        >
          {/* Header da Subseção com Indicação do Ambiente Ativo */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>ERP Keeper</span>
                <span>/</span>
                <span>Contabilidade</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">
                  {environment === 'DISK_EMPRESA'
                    ? 'Empresarial Disk'
                    : environment === 'PRODUTORES_EVENTOS'
                    ? 'Eventos & Produtores'
                    : 'Integração & Conciliação'}
                </span>
                <span>/</span>
                <span className="text-slate-600">{activeSection.group}</span>
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

          {/* ======================================================== */}
          {/* VISÃO DEDICADA: FOLHA DE PAGAMENTO & COLABORADORES DISK  */}
          {/* ======================================================== */}
          {environment === 'DISK_EMPRESA' && diskCorporateTab === 'FOLHA_PAGAMENTO' ? (
            <div className="space-y-4">
              {/* KPIs Consolidados de Pessoal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Quadro de Colaboradores</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">42 Ativos</div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    100% CLT / Estagiários Registrados
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Folha Bruta (Salários)</span>
                    <DollarSign className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {fmt(PAYROLL_MOCK.overview.grossSalary)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Líquido a Pagar: {fmt(PAYROLL_MOCK.overview.netSalaryPayable)}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Encargos Patronais (INSS+FGTS)</span>
                    <Receipt className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-rose-700 mt-1">
                    {fmt(PAYROLL_MOCK.overview.inssEmployer + PAYROLL_MOCK.overview.fgts + PAYROLL_MOCK.overview.ratFap + PAYROLL_MOCK.overview.terceirosSistemaS)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    INSS 20% · FGTS 8% · RAT/FAP 2% · S 5.8%
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Custo Total Folha (DRE)</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 mt-1">
                    {fmt(PAYROLL_MOCK.overview.totalPersonnelExpense)}
                  </div>
                  <span className="text-[11px] text-indigo-700 font-semibold">
                    Conta DRE 5.1.02 (Salários + Encargos + Provisões)
                  </span>
                </div>
              </div>

              {/* Tabela de Centros de Custo da Folha */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Alocação da Folha por Centro de Custo</h3>
                    <p className="text-xs text-slate-500">Rateio departmental dos salários, encargos e benefícios da Disk</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    5 Departamentos Ativos
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Centro de Custo</th>
                        <th className="py-2.5 px-3">Departamento</th>
                        <th className="py-2.5 px-3 text-center">Colaboradores</th>
                        <th className="py-2.5 px-3 text-right">Salários Brutos</th>
                        <th className="py-2.5 px-3 text-right">Custo Total Departamental</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PAYROLL_MOCK.costCenters.map((cc) => (
                        <tr key={cc.code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{cc.code}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{cc.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{cc.department}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{cc.headcount}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">{fmt(cc.grossAmount)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{fmt(cc.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lançamentos Contábeis Automáticos da Folha de Pagamento */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Escrituração Contábil da Folha (Razão Geral)</h3>
                    <p className="text-xs text-slate-500">Partidas dobradas automáticas geradas pela competência 10/2026</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Lançamentos Imutáveis
                  </span>
                </div>

                <div className="space-y-2">
                  {PAYROLL_MOCK.journalEntries.map((je) => (
                    <div key={je.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-800">{je.id}</span>
                          <span className="font-semibold text-slate-900">{je.description}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                          <span><strong>Débito (D):</strong> {je.debitAccount}</span>
                          <span><strong>Crédito (C):</strong> {je.creditAccount}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-500">Valor Escriturado:</span>
                        <div className="text-sm font-bold text-slate-900 font-mono">{fmt(je.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* ======================================================== */}
          {/* VISÃO DEDICADA: CONTABILIDADE DE EVENTOS E PRODUTORES    */}
          {/* ======================================================== */}
          {environment === 'PRODUTORES_EVENTOS' && (
            <div className="space-y-4">
              {/* KPIs de Custódia e Obrigações com Produtores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Venda Bruta Ingressos</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{fmt(24500000.0)}</div>
                  <span className="text-[11px] text-slate-500">Entrada total sob custódia</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Taxa Disk (10%)</span>
                  <div className="text-xl font-bold text-blue-700 mt-1">{fmt(2450000.0)}</div>
                  <span className="text-[11px] text-blue-600 font-medium">Comissão contratual retida</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Retenções (ECAD/ISS)</span>
                  <div className="text-xl font-bold text-amber-700 mt-1">{fmt(1097500.0)}</div>
                  <span className="text-[11px] text-amber-600 font-medium">Reservas técnicas retidas</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Repasses Efetuados</span>
                  <div className="text-xl font-bold text-slate-700 mt-1">{fmt(14650000.0)}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Liquidados via PIX/TED</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-indigo-300 shadow-xs ring-2 ring-indigo-500/10">
                  <span className="text-xs text-indigo-700 font-semibold">Saldo em Custódia</span>
                  <div className="text-xl font-bold text-indigo-900 mt-1">{fmt(9850000.0)}</div>
                  <span className="text-[11px] text-indigo-700 font-bold">Passivo Conta 2.1.05.001</span>
                </div>
              </div>

              {/* Tabela de Produtores e Carteiras Segregadas */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Razão Auxiliar Segregado por Produtor</h3>
                    <p className="text-xs text-slate-500">Posição fiduciária individualizada e conciliação com as carteiras</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Segregação Ativa
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                        <th className="py-2.5 px-3">Produtor / Razão Social</th>
                        <th className="py-2.5 px-3">CNPJ</th>
                        <th className="py-2.5 px-3 text-center">Eventos</th>
                        <th className="py-2.5 px-3 text-right">Vendas Brutas</th>
                        <th className="py-2.5 px-3 text-right">Taxa Disk (10%)</th>
                        <th className="py-2.5 px-3 text-right">Repasses Pagos</th>
                        <th className="py-2.5 px-3 text-right">Saldo em Custódia</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PRODUCERS_MOCK.filter(
                        (p) => selectedProducerId === 'all' || p.id === selectedProducerId,
                      ).map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{prod.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{prod.cnpj}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{prod.eventsCount}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">{fmt(prod.grossTicketSales)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-blue-700 font-medium">{fmt(prod.diskFeeDeduction)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">{fmt(prod.repassesExecuted)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700 bg-indigo-50/40">{fmt(prod.custodyBalance)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {prod.reconciliationStatus}
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
          {/* RENDERIZAÇÃO DOS 18 SUBMENUS (QUANDO EM ESCRITURAÇÃO)   */}
          {/* ======================================================== */}
          {(environment !== 'DISK_EMPRESA' || diskCorporateTab === 'ESCRITURACAO') && (
            <div className="space-y-4">
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
                        <span>
                          {environment === 'PRODUTORES_EVENTOS' ? 'Saldo Custódia Produtores' : 'Volume Movimentado'}
                        </span>
                        <DollarSign className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">
                        {fmt(environment === 'PRODUTORES_EVENTOS' ? 9850000.0 : (data?.kpis?.totalDebits || 4892450.75))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {environment === 'PRODUTORES_EVENTOS' ? 'Conta Passivo 2.1.05.001' : `${data?.kpis?.totalEntries || 142} lançamentos escriturados`}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>
                          {environment === 'PRODUTORES_EVENTOS' ? 'Taxa Disk Retida (10%)' : 'Resultado DRE (Disk)'}
                        </span>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700 mt-1">
                        {fmt(environment === 'PRODUTORES_EVENTOS' ? 2450000.0 : (data?.kpis?.netResult || 816750.0))}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {environment === 'PRODUTORES_EVENTOS' ? 'Receita Contratual da Disk' : 'Superávit Operacional no Mês'}
                      </span>
                    </div>
                  </div>

                  {/* Lançamentos Recentes no Razão Geral */}
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
                      <span className="text-xs text-slate-500">Contas Mapeadas</span>
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
                      <span>Equação Fundamental Atendida: Ativo (R$ 12.850.000,00) === Passivo (R$ 10.850.000,00) + PL (R$ 2.000.000,00)</span>
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
                      <h3 className="text-sm font-bold text-slate-900">
                        {environment === 'PRODUTORES_EVENTOS'
                          ? 'Demonstrativo Auxiliar de Eventos e Produtores'
                          : 'DRE — Demonstração do Resultado do Exercício (Disk Ingressos S.A.)'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {environment === 'PRODUTORES_EVENTOS'
                          ? 'Prestação de contas segregada: bilheteria de eventos e repasses devidos'
                          : 'Regime de Competência · Exclusivo das receitas de intermediação e custos da Disk'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {environment === 'PRODUTORES_EVENTOS'
                        ? `Saldo em Custódia: ${fmt(9850000.0)}`
                        : `Lucro Líquido Disk: ${fmt(816750.0)}`}
                    </span>
                  </div>

                  <div className="space-y-2 divide-y divide-slate-100 pt-1">
                    {environment === 'PRODUTORES_EVENTOS' ? (
                      <>
                        <div className="flex justify-between py-1 font-bold text-slate-900">
                          <span>1. RECEITA BRUTA DE BILHETERIA DOS EVENTOS (CUSTÓDIA FIDUCIÁRIA)</span>
                          <span>{fmt(24500000.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Taxa Contratual de Intermediação e Conveniência Disk (10%)</span>
                          <span className="text-blue-700 font-semibold">{fmt(-2450000.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Retenções e Reservas Operacionais (ECAD / ISSQN Municipal)</span>
                          <span className="text-amber-700 font-semibold">{fmt(-1097500.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Repasses Financeiros Já Liquidados aos Produtores</span>
                          <span className="text-slate-800 font-semibold">{fmt(-14650000.0)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-indigo-900 bg-indigo-50 px-2 rounded-lg text-sm">
                          <span>(=) SALDO LÍQUIDO REMANESCENTE EM CUSTÓDIA A REPASSAR</span>
                          <span>{fmt(9850000.0)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-1 font-bold text-slate-900">
                          <span>1. RECEITA OPERACIONAL BRUTA (TAXAS DE CONVENIÊNCIA E INTERMEDIAÇÃO)</span>
                          <span>{fmt(1745200.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Deduções da Receita Bruta (PIS, COFINS e ISSQN Incidentes)</span>
                          <span className="text-rose-600 font-semibold">{fmt(-248691.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-slate-800">
                          <span>(=) RECEITA OPERACIONAL LÍQUIDA DA DISK</span>
                          <span>{fmt(1496509.0)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Despesas com Pessoal, Salários e Encargos (Conta 5.1.02)</span>
                          <span className="text-rose-600 font-semibold">{fmt(-594530.22)}</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600 pl-4">
                          <span>(-) Despesas com Nuvem, TI AWS e Servidores</span>
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
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 7. DFC — DEMONSTRAÇÃO DO FLUXO DE CAIXA */}
              {sectionId === 'acc-dfc' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">DFC — Demonstração do Fluxo de Caixa (Método Direto)</h3>
                      <p className="text-xs text-slate-500">Segregação nítida entre o caixa próprio da Disk e os fluxos de custódia</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Saldo Final em Caixa: {fmt(12249230.5)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Fluxo de Caixa Operacional Próprio (Disk)</span>
                        <span className="text-blue-700 font-mono font-bold">{fmt(621750.0)}</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>(+) Recebimento de taxas Disk e serviços ERP</span>
                          <span className="font-semibold text-slate-800">{fmt(1745200.0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(-) Pagamento de folha de pagamento e encargos</span>
                          <span className="text-rose-600">{fmt(-520000.0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(-) Custos de infraestrutura cloud e fornecedores</span>
                          <span className="text-rose-600">{fmt(-408450.0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(-) Tributos próprios pagos</span>
                          <span className="text-rose-600">{fmt(-195000.0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2">
                      <div className="font-bold text-indigo-950 flex items-center justify-between">
                        <span>Fluxo de Custódia e Repasses a Terceiros</span>
                        <span className="text-indigo-900 font-mono font-bold">{fmt(9765000.0)}</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>(+) Entradas brutas de vendas de ingressos</span>
                          <span className="font-semibold text-slate-800">{fmt(24500000.0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(-) Repasses liquidados aos produtores</span>
                          <span className="text-rose-600">{fmt(-14650000.0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>(-) Estornos e cancelamentos a compradores</span>
                          <span className="text-rose-600">{fmt(-85000.0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. CENTROS DE CUSTO */}
              {sectionId === 'acc-cost-centers' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Estrutura de Centros de Custo</h3>
                      <p className="text-xs text-slate-500">Alocação de orçamento, colaboradores e despesas por departamento</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      5 Centros Ativos
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                          <th className="py-2.5 px-3">Código</th>
                          <th className="py-2.5 px-3">Nome do Centro de Custo</th>
                          <th className="py-2.5 px-3">Departamento</th>
                          <th className="py-2.5 px-3 text-right">Orçamento Mensal</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { code: 'CC-101', name: 'Infraestrutura Cloud & TI', department: 'Tecnologia', budget: 150000.0, active: true },
                          { code: 'CC-201', name: 'Operações e Bilheteria PDV', department: 'Operações', budget: 85000.0, active: true },
                          { code: 'CC-301', name: 'Gestão de Produtores e Eventos', department: 'Comercial', budget: 110000.0, active: true },
                          { code: 'CC-302', name: 'Controladoria & Auditoria Contábil', department: 'Financeiro', budget: 95000.0, active: true },
                          { code: 'CC-401', name: 'Tributos, Fiscal & Tax Compliance', department: 'Fiscal', budget: 60000.0, active: true },
                        ].map((c) => (
                          <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{c.code}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{c.name}</td>
                            <td className="py-2.5 px-3 text-slate-600">{c.department}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">{fmt(c.budget)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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

              {/* 9. INTEGRAÇÃO FINANCEIRA — MOTOR KEEPER */}
              {sectionId === 'acc-integracao' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Motor de Integração Financeira ➔ Contábil</h3>
                        <p className="text-xs text-slate-500">
                          Mapeamento das 4 operações financeiras com segregação entre Disk e Produtores
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Sincronização 1:1 Contínua
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          1. Venda Aprovada (Split 10% Disk / 90% Produtor)
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Débito:</strong> 1.1.01.002 (Bancos Custódia Terceiros R$ 1.000,00)<br />
                          <strong>Crédito 1:</strong> 2.1.05.001 (Obrigações Produtor R$ 900,00 - 90%)<br />
                          <strong>Crédito 2:</strong> 4.1.01.001 (Receita Taxa Disk R$ 100,00 - 10%)
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          2. Liquidação Adquirente & Gateway
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Débito:</strong> 1.1.01.001 (Banco Itaú Disk Movimento)<br />
                          <strong>Crédito:</strong> 1.1.02.001 (Adquirentes a Liquidar Líquido de MDR)
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          3. Repasse ao Produtor
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Débito:</strong> 2.1.05.001 (Baixa de Obrigações com Produtor)<br />
                          <strong>Crédito:</strong> 1.1.01.002 (Bancos Conta Custódia Terceiros)
                        </p>
                      </div>

                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-rose-600" />
                          4. Estorno & Devolução ao Comprador
                        </span>
                        <p className="text-slate-600 text-[11px]">
                          Reversão contábil referenciada com débito no Passivo de Custódia e na Taxa, com contrapartida no banco.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. FECHAMENTO CONTÁBIL */}
              {sectionId === 'acc-periods' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Períodos Fiscais & Travas de Fechamento</h3>
                      <p className="text-xs text-slate-500">Controle de encerramento mensal de competências contábeis</p>
                    </div>
                    <button
                      onClick={() => setActiveModal('period')}
                      className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Abrir Competência</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { year: 2026, month: 10, status: 'OPEN', label: '10/2026', desc: 'Competência corrente aberta para lançamentos e conciliação' },
                      { year: 2026, month: 9, status: 'CLOSED', label: '09/2026', desc: 'Competência encerrada e travada para alterações' },
                      { year: 2026, month: 8, status: 'CLOSED', label: '08/2026', desc: 'Competência encerrada com balancete definitivo homologado' },
                    ].map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${p.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                            {p.status === 'OPEN' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900">{p.label}</span>
                            <p className="text-slate-500 text-[11px]">{p.desc}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-800'
                        }`}>
                          {p.status === 'OPEN' ? 'Período Aberto' : 'Travado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 11. FISCAL E TRIBUTÁRIO */}
              {sectionId === 'acc-fiscal' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Apuração Tributária e Fiscal da Disk</h3>
                      <p className="text-xs text-slate-500">Regime Lucro Real · Tributos incidentes exclusivamente sobre as receitas próprias de intermediação</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      Total Provisionado: {fmt(444711.0)}
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-950 font-medium">
                    ⚠️ <strong>Segurança Jurídica:</strong> Os R$ 22.050.000,00 recebidos de ingressos pertencem aos produtores e não integram a base de cálculo de PIS/COFINS/ISSQN da Disk (Jurisprudência STJ - intermediação comercial).
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                          <th className="py-2.5 px-3">Tributo</th>
                          <th className="py-2.5 px-3">Alíquota</th>
                          <th className="py-2.5 px-3 text-right">Base de Cálculo (Disk)</th>
                          <th className="py-2.5 px-3 text-right">Valor Provisionado</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { code: 'PIS', rate: '1,65%', base: 1745200.0, amount: 28795.8, status: 'PROVISIONADO' },
                          { code: 'COFINS', rate: '7,60%', base: 1745200.0, amount: 132635.2, status: 'PROVISIONADO' },
                          { code: 'ISSQN', rate: '5,00%', base: 1745200.0, amount: 87260.0, status: 'PROVISIONADO' },
                          { code: 'IRPJ', rate: '15,00%', base: 816750.0, amount: 122512.5, status: 'PROVISIONADO' },
                          { code: 'CSLL', rate: '9,00%', base: 816750.0, amount: 73507.5, status: 'PROVISIONADO' },
                        ].map((t) => (
                          <tr key={t.code} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{t.code}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-700">{t.rate}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-800">{fmt(t.base)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{fmt(t.amount)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 12. CONCILIAÇÃO CONTÁBIL */}
              {sectionId === 'acc-conciliacao' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Confronto: Ledger Operacional x Razão Contábil</h3>
                      <p className="text-xs text-slate-500">Auditoria automatizada 1:1 entre transações financeiras e partidas contábeis</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      100% Conciliado (0 Discrepâncias)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { module: 'Extrato Bancário vs Razão Contábil', account: '1.1.01 (Disponibilidades)', opBalance: 12249230.5, accBalance: 12249230.5, diff: 0.0, status: 'CONCILIADO' },
                      { module: 'Carteiras de Produtores vs Passivo Custódia', account: '2.1.05.001 (Obrigações)', opBalance: 9850000.0, accBalance: 9850000.0, diff: 0.0, status: 'CONCILIADO' },
                      { module: 'Gateways e MDR vs Contas a Receber', account: '1.1.02.001 (Adquirentes)', opBalance: 232500.0, accBalance: 232500.0, diff: 0.0, status: 'CONCILIADO' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-sm text-slate-900">{item.module}</span>
                          <p className="text-slate-500 text-[11px] font-mono mt-0.5">Conta Contábil Vinculada: {item.account}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500">Saldo Ledger:</span>
                            <div className="font-mono font-semibold text-slate-900">{fmt(item.opBalance)}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500">Saldo Razão:</span>
                            <div className="font-mono font-semibold text-blue-700">{fmt(item.accBalance)}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500">Divergência:</span>
                            <div className="font-mono font-bold text-emerald-700">{fmt(item.diff)}</div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 13. DOCUMENTOS CONTÁBEIS */}
              {sectionId === 'acc-documentos' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Documentos Fiscais & Borderôs Homologados</h3>
                      <p className="text-xs text-slate-500">Comprovantes fiscais, NFS-e e borderôs vinculados a lançamentos contábeis</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      Rastreabilidade Ativa
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                          <th className="py-2.5 px-3">Documento</th>
                          <th className="py-2.5 px-3">Tipo</th>
                          <th className="py-2.5 px-3">Data</th>
                          <th className="py-2.5 px-3 text-right">Valor</th>
                          <th className="py-2.5 px-3">Lançamento Ref.</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { title: 'NFS-e 45291 - Taxas Festival de Verão 2026', type: 'NFSE', date: '2026-10-01', amount: 145000.0, ref: 'JE-10038', status: 'CONCILIADO' },
                          { title: 'Borderô BORD-2026-081 - Repasse Opus Entretenimento Lote 12', type: 'BORDERO', date: '2026-10-05', amount: 1850000.0, ref: 'JE-10041', status: 'CONCILIADO' },
                          { title: 'Fatura AWS-98124 - Serviços Nuvem Amazon Web Services Latam', type: 'FATURA', date: '2026-10-08', amount: 38450.75, ref: 'JE-10042', status: 'PAGO' },
                          { title: 'Contrato CONTR-2026-004 - Parceria e Intermediação Live Nation', type: 'CONTRATO', date: '2026-01-15', amount: 0.0, ref: '—', status: 'ATIVO' },
                        ].map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-slate-900">{d.title}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {d.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{d.date}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">{d.amount > 0 ? fmt(d.amount) : '—'}</td>
                            <td className="py-2.5 px-3 font-mono text-blue-700">{d.ref}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 14. RELATÓRIOS CONTÁBEIS & SPED */}
              {sectionId === 'acc-relatorios' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Catálogo de Demonstrativos Oficiais & SPED</h3>
                    <p className="text-xs text-slate-500">Exportação em PDF, planilhas e formato SPED Contábil (ECD/ECF)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { code: 'BALANCETE', name: 'Balancete de Verificação Analítico', format: 'PDF / XLS', periodicity: 'Mensal / Diário' },
                      { code: 'DIARIO_GERAL', name: 'Livro Diário Oficial c/ Termos de Abertura', format: 'PDF Assinado', periodicity: 'Anual / Mensal' },
                      { code: 'RAZAO_ANALITICO', name: 'Livro Razão por Conta Contábil', format: 'PDF / XLS', periodicity: 'Mensal' },
                      { code: 'DRE_GERENCIAL', name: 'DRE por Centro de Custo', format: 'XLS / PDF', periodicity: 'Mensal' },
                      { code: 'DFC_FLUXO', name: 'DFC - Fluxo de Caixa (Método Direto)', format: 'PDF', periodicity: 'Trimestral' },
                      { code: 'SPED_ECD', name: 'SPED Contábil Digital (ECD / ECF)', format: 'TXT / SPED', periodicity: 'Anual' },
                    ].map((rep) => (
                      <div key={rep.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {rep.code}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 mt-1">{rep.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Formato: {rep.format} · {rep.periodicity}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotification(`Exportação do relatório ${rep.name} iniciada!`)}
                          className="h-8 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Gerar Exportação</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 15. AUDITORIA E HISTÓRICO */}
              {sectionId === 'acc-auditoria' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Trilha de Auditoria Criptográfica</h3>
                      <p className="text-xs text-slate-500">Histórico de ações contábeis com hashes de integridade imutáveis</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      SHA-256 Verificado
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { user: 'vinicius.murray@diskingressos.com.br', action: 'LANCAMENTO_CRIADO', details: 'Lançamento nº 10042 registrado no Razão (Valor R$ 38.450,75)', hash: 'sha256-e8f0a2d98124b...' },
                      { user: 'auditoria.contabil@diskingressos.com.br', action: 'CONCILIACAO_EXECUTADA', details: 'Conciliação automática 1:1 de 1.542 transações com o Ledger', hash: 'sha256-4c91b8a59102c...' },
                      { user: 'controladoria@diskingressos.com.br', action: 'PERIODO_ABERTO', details: 'Abertura da competência fiscal 10/2026', hash: 'sha256-78b12fa12984e...' },
                    ].map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{log.action}</span>
                          <span className="font-mono text-[10px] text-slate-400">{log.hash}</span>
                        </div>
                        <p className="text-slate-700">{log.details}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Operador: {log.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 16. CONFIGURAÇÕES CONTÁBEIS */}
              {sectionId === 'acc-config' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900">Parâmetros Contábeis Corporativos</h3>
                    <p className="text-xs text-slate-500">Dados cadastrais, responsável técnico (CRC) e plano referencial RFB</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Razão Social:</span>
                      <div className="font-bold text-sm text-slate-900">Disk Ingressos Entretenimento S.A.</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">CNPJ Matriz:</span>
                      <div className="font-bold text-sm font-mono text-slate-900">08.123.456/0001-90</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Contador Chefe Responsável:</span>
                      <div className="font-bold text-slate-900">Dr. Roberto Meirelles</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Registro Profissional (CRC):</span>
                      <div className="font-bold font-mono text-blue-700">CRC/PR-048192/O-5</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Regime Tributário:</span>
                      <div className="font-semibold text-slate-900">Lucro Real Trimestral / Estimativa Mensal</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium">Conta Segregada de Custódia:</span>
                      <div className="font-semibold text-indigo-900">2.1.05.001 (Obrigações com Produtores)</div>
                    </div>
                  </div>
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
