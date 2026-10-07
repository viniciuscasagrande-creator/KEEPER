import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export function FinancialChartWidget() {
  const [period, setPeriod] = useState<'MES' | 'TRIMESTRE'>('MES');

  const months = [
    { name: 'Mai', receita: 1420, despesa: 890 },
    { name: 'Jun', receita: 1510, despesa: 940 },
    { name: 'Jul', receita: 1480, despesa: 910 },
    { name: 'Ago', receita: 1620, despesa: 980 },
    { name: 'Set', receita: 1530, despesa: 890 },
    { name: 'Out', receita: 1745, despesa: 928 },
  ];

  const maxVal = 2000;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            Fluxo Financeiro: Receitas x Despesas
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Comparativo de entradas realizadas e saídas operacionais (R$ mil)
          </p>
        </div>

        {/* Legend & Period Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" /> Receita
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Despesa
            </span>
          </div>

          <div className="bg-slate-100 p-0.5 rounded-lg flex text-[10px] font-bold">
            <button
              onClick={() => setPeriod('MES')}
              className={`px-2 py-0.5 rounded ${
                period === 'MES' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setPeriod('TRIMESTRE')}
              className={`px-2 py-0.5 rounded ${
                period === 'TRIMESTRE' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'
              }`}
            >
              Trimestre
            </button>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-44 flex items-end justify-between pt-6 px-2 gap-3">
        {months.map((m) => {
          const recHeight = (m.receita / maxVal) * 100;
          const despHeight = (m.despesa / maxVal) * 100;

          return (
            <div key={m.name} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1.5 h-36">
                {/* Receita Bar */}
                <div
                  className="w-1/2 max-w-6 bg-blue-600 rounded-t hover:bg-blue-500 transition-all relative cursor-pointer"
                  style={{ height: `${recHeight}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-bold transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    R$ {m.receita}k
                  </div>
                </div>

                {/* Despesa Bar */}
                <div
                  className="w-1/2 max-w-6 bg-amber-500 rounded-t hover:bg-amber-400 transition-all relative cursor-pointer"
                  style={{ height: `${despHeight}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-bold transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    R$ {m.despesa}k
                  </div>
                </div>
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-bold text-slate-600 mt-2">{m.name}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Resultado Líquido Acumulado no Período</span>
        <span className="font-bold text-emerald-600">+ R$ 816.750,00 (+46,8% margem operacional)</span>
      </div>
    </div>
  );
}
