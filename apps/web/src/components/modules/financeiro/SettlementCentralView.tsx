import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Sparkles,
  Sliders,
  Send,
  Plus,
  Receipt,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { api } from '../../../services/api';
import { EventWalletStatementDrawer } from '../../drawers/EventWalletStatementDrawer';
import { FeeDefinitionModal } from '../../modals/FeeDefinitionModal';
import { SaleSplitSimulatorModal } from '../../modals/SaleSplitSimulatorModal';
import { RepaymentScheduleModal } from '../../modals/RepaymentScheduleModal';
import { EventExpenseModal } from '../../modals/EventExpenseModal';

export function SettlementCentralView() {
  const [clearingOverview, setClearingOverview] = useState<any | null>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Drawer State
  const [selectedWalletForStatement, setSelectedWalletForStatement] = useState<any | null>(null);
  const [selectedWalletForRepayment, setSelectedWalletForRepayment] = useState<any | null>(null);
  const [selectedWalletForExpense, setSelectedWalletForExpense] = useState<any | null>(null);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, walletsRes] = await Promise.allSettled([
        api.getClearingOverview(),
        api.getEventWallets(),
      ]);

      if (overviewRes.status === 'fulfilled') {
        setClearingOverview(overviewRes.value);
      } else {
        setClearingOverview({
          clearingAccount: {
            name: 'Conta de Liquidação DiskIngressos (Escrow)',
            bank: 'Itaú Unibanco S.A. (Bco 341)',
            agency: '0422',
            account: '99012-3',
            type: 'ESCROW_CLEARING',
            currentBalance: 2280000.0,
          },
          metrics: {
            totalCollected: 4820000.0,
            totalDiskRevenue: 620000.0,
            totalProducersGross: 3640000.0,
            totalEventExpenses: 560000.0,
            netProducersPayable: 3080000.0,
          },
          repayments: {
            pending: { count: 12, amount: 480000.0 },
            scheduled: { count: 8, amount: 620000.0 },
            paid: { count: 25, amount: 2540000.0 },
          },
        });
      }

      if (walletsRes.status === 'fulfilled' && Array.isArray(walletsRes.value)) {
        setWallets(walletsRes.value);
      } else {
        setWallets([
          {
            id: 'wallet-001',
            eventId: 'ev-101',
            eventName: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
            producerId: 'prod-01',
            producerName: 'Opus Entretenimento & Shows Ltda',
            grossSales: 500000.0,
            diskFeeTotal: 50000.0,
            spreadFeeTotal: 12000.0,
            advanceFeeTotal: 5000.0,
            expensesTotal: 80000.0,
            repaymentsPaidTotal: 100000.0,
            repaymentsScheduledTotal: 100000.0,
            balanceAvailable: 153000.0,
            status: 'ACTIVE',
          },
          {
            id: 'wallet-002',
            eventId: 'ev-102',
            eventName: 'Turnê Coldplay & Amigos - Estádio Couto Pereira',
            producerId: 'prod-02',
            producerName: 'Live Nation Brasil Produções S.A.',
            grossSales: 2100000.0,
            diskFeeTotal: 275000.0,
            spreadFeeTotal: 45000.0,
            advanceFeeTotal: 7000.0,
            expensesTotal: 280000.0,
            repaymentsPaidTotal: 600000.0,
            repaymentsScheduledTotal: 400000.0,
            balanceAvailable: 493000.0,
            status: 'ACTIVE',
          },
          {
            id: 'wallet-003',
            eventId: 'ev-103',
            eventName: 'Standup Comedy Especial de Fim de Ano - Teatro Positivo',
            producerId: 'prod-03',
            producerName: 'CWB Brasil Eventos e Promoções',
            grossSales: 870000.0,
            diskFeeTotal: 105000.0,
            spreadFeeTotal: 18000.0,
            advanceFeeTotal: 4000.0,
            expensesTotal: 70000.0,
            repaymentsPaidTotal: 400000.0,
            repaymentsScheduledTotal: 150000.0,
            balanceAvailable: 123000.0,
            status: 'ACTIVE',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredWallets = wallets.filter((w) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!w.eventName.toLowerCase().includes(q) && !w.producerName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const metrics = clearingOverview?.metrics || {
    totalCollected: 4820000.0,
    totalDiskRevenue: 620000.0,
    totalProducersGross: 3640000.0,
    totalEventExpenses: 560000.0,
  };

  const repayments = clearingOverview?.repayments || {
    pending: { count: 12, amount: 480000 },
    scheduled: { count: 8, amount: 620000 },
    paid: { count: 25, amount: 2540000 },
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Painel Principal Financeiro Disk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            Painel Principal Financeiro DiskIngressos & Carteiras de Eventos
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={() => setIsSimulatorModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulador de Split</span>
          </button>
          <button
            onClick={() => setIsFeeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Parametrizar Taxas</span>
          </button>
          <button
            onClick={() => {
              if (wallets.length > 0) setSelectedWalletForRepayment(wallets[0]);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Programar Repasse</span>
          </button>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. Big Liquidation Master Box (Especificação Central) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CONTA DE LIQUIDAÇÃO DISKINGRESSOS (ESCROW / CUSTÓDIA)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1">
              {fmt(metrics.totalCollected)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Total bruto captado de ingressos online e bilheterias antes da distribuição
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl">
            <Building2 className="w-4 h-4 text-blue-400" />
            <div className="text-[11px]">
              <div className="text-slate-400">Banco Depositário:</div>
              <div className="font-bold text-slate-200">Itaú Unibanco Ag. 0422 / CC 99012-3</div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* 1. Receita DiskIngressos */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-blue-400 uppercase flex items-center justify-between">
              <span>Receita DiskIngressos</span>
              <span className="text-[10px] bg-blue-900/60 px-1.5 py-0.2 rounded font-mono">Retido</span>
            </div>
            <div className="text-xl font-mono font-black text-white mt-1.5">
              {fmt(metrics.totalDiskRevenue)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Taxa Conveniência + Spread + Advance
            </div>
          </div>

          {/* 2. Pertencente aos Produtores */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center justify-between">
              <span>Produtores (Bruto)</span>
              <span className="text-[10px] bg-emerald-900/60 px-1.5 py-0.2 rounded font-mono">Direito</span>
            </div>
            <div className="text-xl font-mono font-black text-emerald-400 mt-1.5">
              {fmt(metrics.totalProducersGross)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Valor de face dos ingressos vendidos
            </div>
          </div>

          {/* 3. Despesas Operacionais */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-rose-400 uppercase flex items-center justify-between">
              <span>Despesas dos Eventos</span>
              <span className="text-[10px] bg-rose-900/60 px-1.5 py-0.2 rounded font-mono">Descontado</span>
            </div>
            <div className="text-xl font-mono font-black text-rose-400 mt-1.5">
              - {fmt(metrics.totalEventExpenses)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Segurança, estrutura, locação, cachê
            </div>
          </div>

          {/* 4. Disponível para Repasse */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-amber-400 uppercase flex items-center justify-between">
              <span>Saldo Livre Repasse</span>
              <span className="text-[10px] bg-amber-900/60 px-1.5 py-0.2 rounded font-mono">Líquido</span>
            </div>
            <div className="text-xl font-mono font-black text-amber-300 mt-1.5">
              {fmt(metrics.totalProducersGross - metrics.totalEventExpenses)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Posição líquida a repassar aos produtores
            </div>
          </div>
        </div>
      </div>

      {/* 3. Repayments Schedule Pipeline Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            Posição dos Repasses aos Produtores:
          </span>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold font-mono">
              {repayments.pending.count} Pendentes ({fmt(repayments.pending.amount)})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold font-mono">
              {repayments.scheduled.count} Agendados ({fmt(repayments.scheduled.amount)})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono">
              {repayments.paid.count} Pagos ({fmt(repayments.paid.amount)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Partidas contábeis automáticas: D Conta Liquidação / C Produtor</span>
        </div>
      </div>

      {/* 4. Event Wallets Table (Carteiras dos Eventos) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-blue-600" />
              Carteiras dos Eventos (Posições Financeiras Individuais)
            </span>
            <span className="text-[11px] text-slate-400">· {filteredWallets.length} eventos ativos</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evento ou produtor..."
              className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 w-64 text-xs"
            />
          </div>
        </div>

        {/* High Density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">Evento / Produtor</th>
                <th className="py-2.5 px-4 text-right">Vendas Brutas</th>
                <th className="py-2.5 px-4 text-right">Taxa Disk</th>
                <th className="py-2.5 px-4 text-right">Spreads & Taxas</th>
                <th className="py-2.5 px-4 text-right">Despesas Evento</th>
                <th className="py-2.5 px-4 text-right font-black text-amber-700">Saldo Disponível</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-center w-52">Ações Financeiras</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWallets.map((w) => (
                <tr key={w.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 leading-snug">{w.eventName}</div>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{w.producerName}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {fmt(w.grossSales)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-blue-700">
                    - {fmt(w.diskFeeTotal)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-purple-700">
                    - {fmt((w.spreadFeeTotal || 0) + (w.advanceFeeTotal || 0))}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-medium text-rose-600">
                    - {fmt(w.expensesTotal)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-black text-amber-700 text-sm bg-amber-50/40">
                    {fmt(w.balanceAvailable)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Em Operação
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedWalletForStatement(w)}
                        title="Ver Extrato 1:1 e Trilha de Auditoria"
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Extrato</span>
                      </button>

                      <button
                        onClick={() => setSelectedWalletForExpense(w)}
                        title="Lançar Despesa com Desconto do Saldo"
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Despesa</span>
                      </button>

                      <button
                        onClick={() => setSelectedWalletForRepayment(w)}
                        title="Programar Repasse ao Produtor"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Repassar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      <EventWalletStatementDrawer
        isOpen={!!selectedWalletForStatement}
        onClose={() => setSelectedWalletForStatement(null)}
        wallet={selectedWalletForStatement}
      />

      <FeeDefinitionModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onSave={(fee) => {
          setActionNotice(`Nova regra da taxa '${fee.name}' salva com sucesso no motor de liquidação!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <SaleSplitSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
      />

      <RepaymentScheduleModal
        isOpen={!!selectedWalletForRepayment}
        onClose={() => setSelectedWalletForRepayment(null)}
        wallet={selectedWalletForRepayment}
        onRepaymentCreated={(sch) => {
          setActionNotice(`Repasse ${sch.scheduleNumber} programado com sucesso via ${sch.paymentMethod}!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <EventExpenseModal
        isOpen={!!selectedWalletForExpense}
        onClose={() => setSelectedWalletForExpense(null)}
        wallet={selectedWalletForExpense}
        onExpenseAdded={(exp) => {
          setActionNotice(`Despesa de R$ ${exp.amount.toFixed(2)} lançada na carteira do evento!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />
    </div>
  );
}
