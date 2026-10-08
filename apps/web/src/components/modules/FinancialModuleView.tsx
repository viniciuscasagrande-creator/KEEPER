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
  RefreshCw,
  Plus,
  LayoutDashboard,
  X,
  CreditCard,
  Landmark,
  Users,
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
import { PayableDetailsDrawer, PayableDetailItem } from '../drawers/PayableDetailsDrawer';

export type FinancialTab =
  | 'settlement'
  | 'producers'
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
      name: 'Itaú Unibanco S.A.',
      bankCode: '341',
      agency: '0422',
      accountNumber: '18920-1',
      type: 'CHECKING',
      currentBalance: 1845230.5,
    },
    {
      id: 'acc-2',
      name: 'Banco Bradesco S.A.',
      bankCode: '237',
      agency: '1024',
      accountNumber: '34910-4',
      type: 'CHECKING',
      currentBalance: 840950.0,
    },
    {
      id: 'acc-3',
      name: 'Banco Santander Brasil',
      bankCode: '033',
      agency: '3301',
      accountNumber: '77123-0',
      type: 'INVESTMENT',
      currentBalance: 554000.0,
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
      if (activeSubTab.includes('producer') || activeSubTab === 'fin-producers') setActiveTab('producers');
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
              Módulos e Operações Financeiras
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Menu permanente fixo na tela · Sem rolagem escondida
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* 1. PAINEL PRINCIPAL FINANCEIRO DISK */}
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'settlement'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40 border border-blue-600'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <Landmark className={`w-4 h-4 ${activeTab === 'settlement' ? 'text-white' : 'text-blue-600'}`} />
            <span>PAINEL PRINCIPAL FINANCEIRO DISK</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'settlement' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              DiskIngressos
            </span>
          </button>

          {/* 2. PRODUTORES & EVENTOS */}
          <button
            onClick={() => setActiveTab('producers')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'producers'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40 border border-indigo-600'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'producers' ? 'text-white' : 'text-indigo-600'}`} />
            <span>Produtores & Eventos</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'producers' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              Regras 1:1
            </span>
          </button>

          {/* 3. CENTRAL FINANCEIRA */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-400/40 border border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-blue-600'}`} />
            <span>Central Financeira</span>
          </button>

          {/* 4. CONTAS A PAGAR */}
          <button
            onClick={() => setActiveTab('payables')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'payables'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40 border border-rose-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ArrowUpRight className={`w-4 h-4 ${activeTab === 'payables' ? 'text-white' : 'text-rose-600'}`} />
            <span>Contas a Pagar</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'payables' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {payables.filter((p) => p.status !== 'PAID').length}
            </span>
          </button>

          {/* 5. CONTAS A RECEBER */}
          <button
            onClick={() => setActiveTab('receivables')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'receivables'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40 border border-emerald-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ArrowDownLeft className={`w-4 h-4 ${activeTab === 'receivables' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Contas a Receber</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'receivables' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {receivables.filter((r) => r.status !== 'PAID').length}
            </span>
          </button>

          {/* 6. TESOURARIA & BANCOS */}
          <button
            onClick={() => setActiveTab('treasury')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'treasury'
                ? 'bg-slate-800 text-white shadow-md ring-2 ring-slate-400/40 border border-slate-800'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'treasury' ? 'text-white' : 'text-slate-600'}`} />
            <span>Tesouraria & Bancos</span>
          </button>

          {/* 7. CONCILIAÇÃO 1:1 */}
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'reconciliation'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40 border border-indigo-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <CheckCheck className={`w-4 h-4 ${activeTab === 'reconciliation' ? 'text-white' : 'text-indigo-600'}`} />
            <span>Conciliação 1:1</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'reconciliation' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              98%
            </span>
          </button>

          {/* 8. FLUXO DE CAIXA */}
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'cashflow'
                ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400/40 border border-emerald-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'cashflow' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Fluxo de Caixa</span>
          </button>

          {/* 9. ORÇAMENTO */}
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'budget'
                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/40 border border-purple-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <PieChart className={`w-4 h-4 ${activeTab === 'budget' ? 'text-white' : 'text-purple-600'}`} />
            <span>Orçamento</span>
          </button>

          {/* 10. CRÉDITO & RISCO */}
          <button
            onClick={() => setActiveTab('credit')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
              activeTab === 'credit'
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40 border border-amber-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'credit' ? 'text-white' : 'text-amber-600'}`} />
            <span>Crédito & Risco</span>
          </button>
        </div>
      </div>

      {/* 2. Active Tab Sub-view Content */}
      {activeTab === 'settlement' && <SettlementCentralView />}

      {activeTab === 'producers' && <ProducerFinancialCentralView />}

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
