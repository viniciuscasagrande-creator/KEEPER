import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
} from 'lucide-react';

export function KpiGrid() {
  const kpis = [
    {
      label: 'Receita Operacional',
      value: 'R$ 1.745.200',
      period: 'Outubro / 2026',
      change: '+13,4%',
      isPositive: true,
      sub: 'vs. mês anterior (R$ 1,53M)',
      color: 'border-l-blue-600',
    },
    {
      label: 'Despesas Operacionais',
      value: 'R$ 928.450',
      period: 'Outubro / 2026',
      change: '+8,6%',
      isPositive: false,
      sub: 'Dentro do teto orçamentário',
      color: 'border-l-amber-500',
    },
    {
      label: 'Contas a Pagar (30d)',
      value: 'R$ 1.150.350',
      period: 'Próximos 30 dias',
      change: '-5,4%',
      isPositive: true,
      sub: '26 títulos pendentes de liquidação',
      color: 'border-l-rose-500',
    },
    {
      label: 'Saldo Bancário Consolidado',
      value: 'R$ 3.240.180',
      period: 'Posição em Tempo Real',
      change: '+5,1%',
      isPositive: true,
      sub: 'Conciliação bancária 100% em dia',
      color: 'border-l-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`bg-white rounded-xl border border-slate-200 border-l-4 p-4 shadow-sm hover:shadow transition-shadow flex flex-col justify-between ${kpi.color}`}
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
            <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
              Drill-down
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
