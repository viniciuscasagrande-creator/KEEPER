import React, { useState, useEffect } from 'react';
import { Gauge, ArrowUpRight, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

interface KpiMeterWidgetProps {
  refreshTrigger?: number;
  onSelectSubModule?: (subModuleId: string) => void;
}

export function KpiMeterWidget({ refreshTrigger, onSelectSubModule }: KpiMeterWidgetProps) {
  const [cashBalance, setCashBalance] = useState<number>(3240180);

  useEffect(() => {
    async function load() {
      try {
        const summary = await api.getFinancialSummary();
        if (summary && typeof summary.totalCashBalance === 'number') {
          setCashBalance(summary.totalCashBalance);
        }
      } catch {
        // Fallback
      }
    }
    load();
  }, [refreshTrigger]);

  const target = 4000000;
  const percentage = Math.min(100, Math.max(10, Math.round((cashBalance / target) * 100)));

  return (
    <div
      onClick={() => onSelectSubModule && onSelectSubModule('fin-treasury')}
      className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between transition-all ${
        onSelectSubModule ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md' : ''
      }`}
      title="Clique para abrir Tesouraria e Contas Bancárias"
    >
      <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-emerald-600" />
          Posição de Liquidez
        </h3>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
          {percentage >= 70 ? 'Ótima' : percentage >= 40 ? 'Estável' : 'Atenção'}
        </span>
      </div>

      <div className="py-2 text-center">
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
            cashBalance
          )}
        </div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
          Saldo Disponível Imediato em Contas
        </div>

        {/* Progress Bar / Meter */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
          <span>Mínimo: R$ 1,5M</span>
          <span className="text-emerald-700 font-bold">{percentage}% da Meta (R$ 4,0M)</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">Índice de Liquidez Corrente</span>
        <span className="font-bold text-slate-800 flex items-center text-emerald-600">
          {(cashBalance / 1340000).toFixed(2)} <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
