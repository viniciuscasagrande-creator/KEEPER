import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
} from 'lucide-react';
import { api } from '../../services/api';

interface KpiGridProps {
  refreshTrigger?: number;
  onSelectSubModule?: (subModuleId: string) => void;
}

export function KpiGrid({ refreshTrigger, onSelectSubModule }: KpiGridProps) {
  const [cashBalance, setCashBalance] = useState<number>(3240180);
  const [payablesOpen, setPayablesOpen] = useState<number>(1150350);
  const [receivablesOpen, setReceivablesOpen] = useState<number>(1745200);
  const [netOperatingExpenses, setNetOperatingExpenses] = useState<number>(928450);

  useEffect(() => {
    async function loadSummary() {
      try {
        const summary = await api.getFinancialSummary();
        if (summary) {
          if (typeof summary.totalCashBalance === 'number') {
            setCashBalance(summary.totalCashBalance);
          }
          if (typeof summary.totalPayablesOpen === 'number') {
            setPayablesOpen(summary.totalPayablesOpen);
          }
          if (typeof summary.totalReceivablesOpen === 'number') {
            setReceivablesOpen(summary.totalReceivablesOpen);
          }
        }
      } catch (err) {
        // Keeps graceful defaults
      }
    }
    loadSummary();
  }, [refreshTrigger]);

  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const kpis = [
    {
      label: 'Receita Operacional / Receber',
      value: fmt(receivablesOpen),
      period: 'Outubro / 2026',
      change: '+13,4%',
      isPositive: true,
      sub: 'Títulos em aberto e faturados',
      color: 'border-l-blue-600',
      target: 'fin-receivables',
    },
    {
      label: 'Despesas Operacionais',
      value: fmt(netOperatingExpenses),
      period: 'Outubro / 2026',
      change: '+8,6%',
      isPositive: false,
      sub: 'Dentro do teto orçamentário',
      color: 'border-l-amber-500',
      target: 'acc-dre',
    },
    {
      label: 'Contas a Pagar (Aberto)',
      value: fmt(payablesOpen),
      period: 'Próximos 30 dias',
      change: '-5,4%',
      isPositive: true,
      sub: 'Obrigações provisionadas',
      color: 'border-l-rose-500',
      target: 'fin-payables',
    },
    {
      label: 'Saldo Bancário Consolidado',
      value: fmt(cashBalance),
      period: 'Posição em Tempo Real',
      change: '+5,1%',
      isPositive: true,
      sub: 'Disponibilidade líquida em tesouraria',
      color: 'border-l-emerald-500',
      target: 'fin-treasury',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          onClick={() => onSelectSubModule?.(kpi.target)}
          className={`bg-white rounded-xl border border-slate-200 border-l-4 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${kpi.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
            <span
              className={`text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${
                kpi.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {kpi.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {kpi.change}
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpi.value}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">{kpi.sub}</div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{kpi.period}</span>
            <span className="font-semibold text-blue-600 hover:underline">
              Abrir Módulo ➔
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
