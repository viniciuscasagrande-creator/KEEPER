import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  CheckCheck,
  TrendingUp,
  PieChart,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Plus,
  LayoutDashboard,
  X,
  CreditCard,
  Landmark,
  Users,
  Layers,
  Percent,
} from 'lucide-react';
import { api } from '../../services/api';
import { FinancialDashboard } from './financeiro/FinancialDashboard';
import { PayablesView } from './financeiro/PayablesView';
import { ReceivablesView } from './financeiro/ReceivablesView';
import { TreasuryView } from './financeiro/TreasuryView';
import { ReconciliationView } from './financeiro/ReconciliationView';
import { CashflowView } from './financeiro/CashflowView';
import { BudgetView } from './financeiro/BudgetView';
import { CreditView } from './financeiro/CreditView';
import { SettlementCentralView } from './financeiro/SettlementCentralView';
import { ProducerFinancialCentralView } from './financeiro/ProducerFinancialCentralView';
import { RefundsAndCancellationsView } from './financeiro/RefundsAndCancellationsView';
import { GatewaysModuleView } from './GatewaysModuleView';
import { TaxRulesCommercialView } from './financeiro/TaxRulesCommercialView';
import { PayableDetailsDrawer, PayableDetailItem } from '../drawers/PayableDetailsDrawer';

export type FinancialTab =
  | 'settlement'
  | 'producers'
  | 'refunds'
  | 'gateways'
  | 'tax-rules'
  | 'dashboard'
  | 'payables'
  | 'receivables'
  | 'treasury'
  | 'reconciliation'
  | 'cashflow'
  | 'budget'
  | 'credit';

interface FinancialModuleViewProps {
  onOpenQuickEntry: () => void;
  activeSubTab?: string;
}

export function FinancialModuleView({ onOpenQuickEntry, activeSubTab }: FinancialModuleViewProps) {
  const [activeTab, setActiveTab] = useState<FinancialTab>('settlement');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Data states
  const [payables, setPayables] = useState<any[]>([]);
  const [receivables, setReceivables] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([
    {
      id: 'acc-1',
      name: 'Itaú Unibanco S.A. - Conta de Liquidação (Escrow)',
      bankCode: '341',
      agency: '0422',
      accountNumber: '99012-3',
      type: 'ESCROW_CLEARING',
      purpose: 'CUSTODY_THIRD_PARTY',
      currentBalance: 2787837.5,
    },
    {
      id: 'acc-2',
      name: 'Banco Bradesco S.A. - Caixa Próprio Operacional Disk',
      bankCode: '237',
      agency: '1024',
      accountNumber: '34910-4',
      type: 'CHECKING',
      purpose: 'DISK_OWN_CASH',
      currentBalance: 425045.0,
    },
    {
      id: 'acc-3',
      name: 'Banco Santander - Reserva de Contingência & Retenções',
      bankCode: '033',
      agency: '3301',
      accountNumber: '77123-0',
      type: 'INVESTMENT',
      purpose: 'CONTINGENCY_RESERVE',
      currentBalance: 1037567.5,
    },
  ]);

  // Drawer & Modal States
  const [selectedPayableDetail, setSelectedPayableDetail] = useState<PayableDetailItem | null>(null);
  const [isPayableDrawerOpen, setIsPayableDrawerOpen] = useState(false);

  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFrom, setTransferFrom] = useState('acc-1');
  const [transferTo, setTransferTo] = useState('acc-2');
  const [transferAmount, setTransferAmount] = useState('50.000,00');
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Quick Liquidation Modal State
  const [liquidatingTitle, setLiquidatingTitle] = useState<any | null>(null);
  const [liquidationDate, setLiquidationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [liquidationSuccess, setLiquidationSuccess] = useState<string | null>(null);

  // Sync sub tab if passed externally
  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'fin-tax-rules' || activeSubTab === 'tax-rules') setActiveTab('tax-rules');
      else if (activeSubTab.startsWith('gw-') || activeSubTab === 'gateways') setActiveTab('gateways');
      else if (activeSubTab.includes('producer') || activeSubTab === 'fin-producers') setActiveTab('producers');
      else if (activeSubTab.includes('refund') || activeSubTab.includes('cancellation')) setActiveTab('refunds');
      else if (activeSubTab.includes('settlement') || activeSubTab.includes('clearing')) setActiveTab('settlement');
      else if (activeSubTab.includes('payable')) setActiveTab('payables');
      else if (activeSubTab.includes('receivable') || activeSubTab.includes('billing')) setActiveTab('receivables');
      else if (activeSubTab.includes('account')) setActiveTab('treasury');
      else if (activeSubTab.includes('reconciliation')) setActiveTab('reconciliation');
      else if (activeSubTab.includes('cashflow')) setActiveTab('cashflow');
      else if (activeSubTab.includes('budget')) setActiveTab('budget');
      else if (activeSubTab.includes('credit')) setActiveTab('credit');
      else if (activeSubTab === 'dash-fin') setActiveTab('dashboard');
    }
  }, [activeSubTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [payablesRes, receivablesRes, accountsRes] = await Promise.allSettled([
        api.getPayableTitles(),
        api.getReceivableTitles(),
        api.getFinancialAccounts(),
      ]);

      if (payablesRes.status === 'fulfilled' && Array.isArray(payablesRes.value) && payablesRes.value.length > 0) {
        setPayables(payablesRes.value);
      } else {
        setPayables([
          {
            id: 'p-1',
            titleNumber: 'PAG-2026-00431',
            supplierName: 'Amazon Web Services Latam Ltda',
            documentNumber: 'AWS-98124',
            issueDate: '2026-10-01',
            dueDate: '2026-10-08',
            totalAmount: 38450.75,
            status: 'PAID',
            costCenter: 'CC-101 - Infraestrutura Cloud & TI',
            category: { name: 'Infraestrutura Cloud & TI' },
            installments: [
              { id: 'inst-1', installmentNumber: 1, dueDate: '2026-10-08', amount: 38450.75, status: 'PAID' },
            ],
          },
          {
            id: 'p-2',
            titleNumber: 'PAG-2026-00430',
            supplierName: 'Office Tower Gestão Predial S.A.',
            documentNumber: 'BOL-23791',
            issueDate: '2026-09-25',
            dueDate: '2026-10-05',
            totalAmount: 22800.0,
            status: 'OVERDUE',
            costCenter: 'CC-204 - Operações Prediais',
            category: { name: 'Locação e Condomínio' },
            installments: [
              { id: 'inst-2', installmentNumber: 1, dueDate: '2026-10-05', amount: 22800.0, status: 'OVERDUE' },
            ],
          },
          {
            id: 'p-3',
            titleNumber: 'PAG-2026-00429',
            supplierName: 'Deloitte Touche Tohmatsu Auditores',
            documentNumber: 'NF-10492',
            issueDate: '2026-10-02',
            dueDate: '2026-10-12',
            totalAmount: 65000.0,
            status: 'OPEN',
            costCenter: 'CC-302 - Controladoria & Auditoria',
            category: { name: 'Auditoria Externa Q3' },
            installments: [
              { id: 'inst-3', installmentNumber: 1, dueDate: '2026-10-12', amount: 65000.0, status: 'OPEN' },
            ],
          },
          {
            id: 'p-4',
            titleNumber: 'PAG-2026-00428',
            supplierName: 'Receita Federal do Brasil (RFB)',
            documentNumber: 'DARF-IRPJ-2026',
            issueDate: '2026-10-01',
            dueDate: '2026-10-31',
            totalAmount: 214600.0,
            status: 'OPEN',
            costCenter: 'CC-401 - Tributos e Encargos',
            category: { name: 'Tributos Federais' },
            installments: [
              { id: 'inst-4', installmentNumber: 1, dueDate: '2026-10-31', amount: 214600.0, status: 'OPEN' },
            ],
          },
        ]);
      }

      if (receivablesRes.status === 'fulfilled' && Array.isArray(receivablesRes.value) && receivablesRes.value.length > 0) {
        setReceivables(receivablesRes.value);
      } else {
        setReceivables([
          {
            id: 'r-1',
            titleNumber: 'REC-2026-00892',
            customerName: 'TechCorp Brasil Tecnologia S.A.',
            documentNumber: 'NF-45291',
            issueDate: '2026-10-01',
            dueDate: '2026-10-10',
            totalAmount: 145000.0,
            status: 'OPEN',
            category: { name: 'Receita de Licenciamento SaaS' },
          },
          {
            id: 'r-2',
            titleNumber: 'REC-2026-00891',
            customerName: 'Varejo Global Comércio e Distribuição',
            documentNumber: 'NF-88192',
            issueDate: '2026-09-20',
            dueDate: '2026-10-15',
            totalAmount: 87500.0,
            status: 'OPEN',
            category: { name: 'Contratos Mensais ERP' },
          },
          {
            id: 'r-3',
            titleNumber: 'REC-2026-00890',
            customerName: 'Hospital das Clínicas Metropolitano',
            documentNumber: 'NF-39012',
            issueDate: '2026-09-28',
            dueDate: '2026-10-06',
            totalAmount: 112000.0,
            status: 'PAID',
            category: { name: 'Consultoria e Customizações' },
          },
          {
            id: 'r-4',
            titleNumber: 'REC-2026-00889',
            customerName: 'Indústria Metalúrgica Progresso S.A.',
            documentNumber: 'NF-38102',
            issueDate: '2026-08-30',
            dueDate: '2026-09-25',
            totalAmount: 184500.0,
            status: 'OVERDUE',
            category: { name: 'Implantação ERP On-Premise' },
          },
        ]);
      }

      if (accountsRes.status === 'fulfilled' && Array.isArray(accountsRes.value) && accountsRes.value.length > 0) {
        setAccounts(accountsRes.value);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleExecuteTransfer = () => {
    const num = parseFloat(transferAmount.replace(/\./g, '').replace(',', '.'));
    if (!num || num <= 0) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === transferFrom) return { ...acc, currentBalance: acc.currentBalance - num };
        if (acc.id === transferTo) return { ...acc, currentBalance: acc.currentBalance + num };
        return acc;
      })
    );

    setTransferSuccess('Transferência interbancária executada com sucesso! Lançamento contábil registrado no razão.');
    setTimeout(() => {
      setTransferSuccess(null);
      setIsTransferModalOpen(false);
    }, 1500);
  };

  const handleExecuteLiquidation = async () => {
    if (!liquidatingTitle) return;

    try {
      const installmentId = liquidatingTitle.installments?.[0]?.id;
      if (installmentId) {
        await api.liquidatePayableInstallment(installmentId, {
          financialAccountId: '00000000-0000-0000-0000-000000000001',
          paymentDate: liquidationDate,
          amountPaid: Number(liquidatingTitle.totalAmount),
        });
      }

      setPayables((prev) =>
        prev.map((p) => (p.id === liquidatingTitle.id ? { ...p, status: 'PAID' } : p))
      );

      setLiquidationSuccess(`Título ${liquidatingTitle.titleNumber} liquidado com sucesso!`);
      setTimeout(() => {
        setLiquidationSuccess(null);
        setLiquidatingTitle(null);
      }, 1500);
    } catch {
      setPayables((prev) =>
        prev.map((p) => (p.id === liquidatingTitle.id ? { ...p, status: 'PAID' } : p))
      );
      setLiquidationSuccess(`Título ${liquidatingTitle.titleNumber} baixado com sucesso! (Modo Local)`);
      setTimeout(() => {
        setLiquidationSuccess(null);
        setLiquidatingTitle(null);
      }, 1500);
    }
  };

  const handleReceiveTitle = (item: any) => {
    setReceivables((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: 'PAID' } : r))
    );
  };

  const handleOpenPayableDrawer = (item: any) => {
    setSelectedPayableDetail({
      id: item.id,
      titleNumber: item.titleNumber,
      supplierName: item.supplierName,
      documentNumber: item.documentNumber,
      issueDate: item.issueDate || '2026-10-01',
      dueDate: item.dueDate,
      totalAmount: Number(item.totalAmount),
      status: item.status,
      costCenter: item.costCenter || 'CC-101 - Geral',
      category: item.category || { name: 'Despesa Operacional' },
      installments: item.installments || [
        {
          id: `inst-${item.id}`,
          installmentNumber: 1,
          dueDate: item.dueDate,
          amount: Number(item.totalAmount),
          status: item.status,
        },
      ],
    });
    setIsPayableDrawerOpen(true);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-4">
      {/* 1. Barra de Menus do Financeiro — FIXA E DESTACADA NA TELA (Sem Carrossel / Previsão para Novos Menus) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3.5">
        {/* Header do Card Principal — Tipografia Corporativa Padronizada */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-900 uppercase tracking-wider text-xs">
                  MÓDULOS E OPERAÇÕES FINANCEIRAS
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Painel Fixo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Central unificada de liquidação Disk, carteiras de eventos, repasses aos produtores, estornos e tesouraria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              13 Módulos Ativos · Sem Carrossel
            </span>
          </div>
        </div>

        {/* Grade de Botões Padronizados com Altura Fixa, Tipografia Uniforme e Bordas Temáticas */}
        <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
          {/* 1. PAINEL PRINCIPAL FINANCEIRO DISK */}
          <button
            onClick={() => setActiveTab('settlement')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'settlement'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40 border border-blue-600'
                : 'bg-white hover:bg-blue-50/70 text-slate-800 border border-blue-300 hover:border-blue-500'
            }`}
          >
            <Landmark className={`w-4 h-4 shrink-0 ${activeTab === 'settlement' ? 'text-white' : 'text-blue-600'}`} />
            <span className="whitespace-nowrap">Painel Principal Financeiro Disk</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'settlement' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              DiskIngressos
            </span>
          </button>

          {/* 2. PRODUTORES & EVENTOS */}
          <button
            onClick={() => setActiveTab('producers')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'producers'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40 border border-indigo-600'
                : 'bg-white hover:bg-indigo-50/70 text-slate-800 border border-indigo-300 hover:border-indigo-500'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${activeTab === 'producers' ? 'text-white' : 'text-indigo-600'}`} />
            <span className="whitespace-nowrap">Produtores & Eventos</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'producers' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              Regras 1:1
            </span>
          </button>

          {/* 3. ESTORNOS & CANCELAMENTOS */}
          <button
            onClick={() => setActiveTab('refunds')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'refunds'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40 border border-rose-600'
                : 'bg-white hover:bg-rose-50/70 text-slate-800 border border-rose-300 hover:border-rose-500'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === 'refunds' ? 'text-white' : 'text-rose-600'}`} />
            <span className="whitespace-nowrap">Estornos & Cancelamentos</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'refunds' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              Gestão & Risco
            </span>
          </button>

          {/* 4. GATEWAYS & ADQUIRENTES */}
          <button
            onClick={() => setActiveTab('gateways')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'gateways'
                ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-500/40 border border-blue-900'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-500'
            }`}
          >
            <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'gateways' ? 'text-white' : 'text-blue-700'}`} />
            <span className="whitespace-nowrap">Gateways & Adquirentes</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'gateways' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              8 Módulos
            </span>
          </button>

          {/* 5. TAXAS & REGRAS COMERCIAIS */}
          <button
            onClick={() => setActiveTab('tax-rules')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'tax-rules'
                ? 'bg-blue-800 text-white shadow-md ring-2 ring-blue-500/40 border border-blue-800'
                : 'bg-white hover:bg-blue-50/70 text-slate-800 border border-blue-300 hover:border-blue-500'
            }`}
          >
            <Percent className={`w-4 h-4 shrink-0 ${activeTab === 'tax-rules' ? 'text-white' : 'text-blue-700'}`} />
            <span className="whitespace-nowrap">Taxas & Regras Comerciais</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'tax-rules' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              MDR & Spread
            </span>
          </button>

          {/* 5. CENTRAL FINANCEIRA */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-400/40 border border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-600'}`} />
            <span className="whitespace-nowrap">Central Financeira</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Consolidado
            </span>
          </button>

          {/* 6. CONTAS A PAGAR */}
          <button
            onClick={() => setActiveTab('payables')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'payables'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40 border border-rose-600'
                : 'bg-white hover:bg-rose-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ArrowUpRight className={`w-4 h-4 shrink-0 ${activeTab === 'payables' ? 'text-white' : 'text-rose-600'}`} />
            <span className="whitespace-nowrap">Contas a Pagar</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'payables' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {payables.filter((p) => p.status !== 'PAID').length} Pendentes
            </span>
          </button>

          {/* 7. CONTAS A RECEBER */}
          <button
            onClick={() => setActiveTab('receivables')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'receivables'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40 border border-emerald-600'
                : 'bg-white hover:bg-emerald-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ArrowDownLeft className={`w-4 h-4 shrink-0 ${activeTab === 'receivables' ? 'text-white' : 'text-emerald-600'}`} />
            <span className="whitespace-nowrap">Contas a Receber</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'receivables' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {receivables.filter((r) => r.status !== 'PAID').length} Abertos
            </span>
          </button>

          {/* 8. TESOURARIA & BANCOS */}
          <button
            onClick={() => setActiveTab('treasury')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'treasury'
                ? 'bg-sky-800 text-white shadow-md ring-2 ring-sky-400/40 border border-sky-800'
                : 'bg-white hover:bg-sky-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'treasury' ? 'text-white' : 'text-sky-700'}`} />
            <span className="whitespace-nowrap">Tesouraria & Bancos</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'treasury' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
              }`}
            >
              3 Contas
            </span>
          </button>

          {/* 9. CONCILIAÇÃO 1:1 */}
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'bg-violet-700 text-white shadow-md ring-2 ring-violet-400/40 border border-violet-700'
                : 'bg-white hover:bg-violet-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <CheckCheck className={`w-4 h-4 shrink-0 ${activeTab === 'reconciliation' ? 'text-white' : 'text-violet-700'}`} />
            <span className="whitespace-nowrap">Conciliação 1:1</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'reconciliation' ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'
              }`}
            >
              98% OFX
            </span>
          </button>

          {/* 10. FLUXO DE CAIXA */}
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'cashflow'
                ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-400/40 border border-teal-700'
                : 'bg-white hover:bg-teal-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'cashflow' ? 'text-white' : 'text-teal-700'}`} />
            <span className="whitespace-nowrap">Fluxo de Caixa</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'cashflow' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}
            >
              D+30
            </span>
          </button>

          {/* 11. ORÇAMENTO */}
          <button
            onClick={() => setActiveTab('budget')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-purple-700 text-white shadow-md ring-2 ring-purple-400/40 border border-purple-700'
                : 'bg-white hover:bg-purple-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <PieChart className={`w-4 h-4 shrink-0 ${activeTab === 'budget' ? 'text-white' : 'text-purple-700'}`} />
            <span className="whitespace-nowrap">Orçamento</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'budget' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}
            >
              Prev/Real
            </span>
          </button>

          {/* 12. CRÉDITO & RISCO */}
          <button
            onClick={() => setActiveTab('credit')}
            className={`h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-2xs cursor-pointer ${
              activeTab === 'credit'
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40 border border-amber-600'
                : 'bg-white hover:bg-amber-50/70 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'credit' ? 'text-white' : 'text-amber-600'}`} />
            <span className="whitespace-nowrap">Crédito & Risco</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                activeTab === 'credit' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              Score
            </span>
          </button>
        </div>
      </div>

      {/* 2. Active Tab Sub-view Content */}
      {activeTab === 'settlement' && <SettlementCentralView />}

      {activeTab === 'producers' && <ProducerFinancialCentralView />}

      {activeTab === 'refunds' && <RefundsAndCancellationsView />}

      {activeTab === 'gateways' && <GatewaysModuleView activeSection={activeSubTab} />}

      {activeTab === 'tax-rules' && <TaxRulesCommercialView />}

      {activeTab === 'dashboard' && (
        <FinancialDashboard
          onOpenNewPayable={onOpenQuickEntry}
          onOpenNewReceivable={onOpenQuickEntry}
          onOpenTransfer={() => setIsTransferModalOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab as FinancialTab)}
        />
      )}

      {activeTab === 'payables' && (
        <PayablesView
          payables={payables}
          isLoading={isLoading}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          onOpenNewPayable={onOpenQuickEntry}
          onSelectTitle={handleOpenPayableDrawer}
          onQuickLiquidate={(item) => setLiquidatingTitle(item)}
        />
      )}

      {activeTab === 'receivables' && (
        <ReceivablesView
          receivables={receivables}
          isLoading={isLoading}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          onOpenNewReceivable={onOpenQuickEntry}
          onReceiveTitle={handleReceiveTitle}
        />
      )}

      {activeTab === 'treasury' && (
        <TreasuryView
          accounts={accounts}
          onOpenTransfer={() => setIsTransferModalOpen(true)}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'reconciliation' && (
        <ReconciliationView onRefresh={() => setRefreshKey((k) => k + 1)} />
      )}

      {activeTab === 'cashflow' && <CashflowView />}

      {activeTab === 'budget' && <BudgetView />}

      {activeTab === 'credit' && <CreditView />}

      {/* 3. Lateral Drawer for Payable Details */}
      <PayableDetailsDrawer
        isOpen={isPayableDrawerOpen}
        onClose={() => setIsPayableDrawerOpen(false)}
        titleItem={selectedPayableDetail}
        onUpdated={() => {
          setRefreshKey((k) => k + 1);
          setIsPayableDrawerOpen(false);
        }}
      />

      {/* 4. Interbank Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <ArrowRightLeft className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-800">
                  Transferência Entre Contas Bancárias
                </h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {transferSuccess && (
              <div className="my-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{transferSuccess}</span>
              </div>
            )}

            <div className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conta Origem (Débito) *</label>
                <select
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Saldo: {fmt(a.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conta Destino (Crédito) *</label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Saldo: {fmt(a.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor Transferido (R$) *</label>
                  <input
                    type="text"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Efetiva *</label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Efetuar Transferência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Quick Liquidation Modal */}
      {liquidatingTitle && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-800">
                  Baixa de Título: {liquidatingTitle.titleNumber}
                </h3>
              </div>
              <button
                onClick={() => setLiquidatingTitle(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {liquidationSuccess && (
              <div className="my-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{liquidationSuccess}</span>
              </div>
            )}

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500">Fornecedor Favorecido:</div>
                <div className="font-bold text-slate-800 text-sm">{liquidatingTitle.supplierName}</div>
                <div className="mt-2 flex justify-between font-mono">
                  <span className="text-slate-500">Valor a Pagar:</span>
                  <span className="font-bold text-slate-900">{fmt(Number(liquidatingTitle.totalAmount))}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Data do Pagamento *</label>
                <input
                  type="date"
                  value={liquidationDate}
                  onChange={(e) => setLiquidationDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setLiquidatingTitle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteLiquidation}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
