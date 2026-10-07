import React from 'react';
import { Gauge, ArrowUpRight, TrendingUp } from 'lucide-react';

export function KpiMeterWidget() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-emerald-600" />
          Posição de Liquidez
        </h3>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
          Ótima
        </span>
      </div>

      <div className="py-2 text-center">
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          R$ 3.240.180
        </div>
        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
          Saldo Disponível Imediato em Contas
        </div>

        {/* Progress Bar / Meter */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: '82%' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
          <span>Mínimo: R$ 1,5M</span>
          <span className="text-emerald-700 font-bold">82% da Meta (R$ 4,0M)</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">Índice de Liquidez Corrente</span>
        <span className="font-bold text-slate-800 flex items-center text-emerald-600">
          2.41 <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
