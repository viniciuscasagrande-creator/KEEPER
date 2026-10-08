import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Download,
  Filter,
  BarChart3,
  Layers,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ChevronRight,
  PieChart,
} from 'lucide-react';

export function CashflowView() {
  const [selectedHorizon, setSelectedHorizon] = useState<'30d' | '60d' | '90d'>('30d');
  const [scenario, setScenario] = useState<'realist' | 'optimist' | 'stress'>('realist');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  // Cashflow timeline periods
  const periods = [
    { period: 'Hoje (08/10)', inAmount: 145000, outAmount: 61250, netAmount: 83750, balance: 3420000 },
    { period: '09/10 a 15/10 (+7d)', inAmount: 480000, outAmount: 320000, netAmount: 160000, balance: 3580000 },
    { period: '16/10 a 22/10 (+15d)', inAmount: 620000, outAmount: 410000, netAmount: 210000, balance: 3790000 },
    { period: '23/10 a 31/10 (+30d)', inAmount: 890000, outAmount: 680000, netAmount: 210000, balance: 4000000 },
    { period: 'Novembro / 2026 (+60d)', inAmount: 1850000, outAmount: 1540000, netAmount: 310000, balance: 4310000 },
    { period: 'Dezembro / 2026 (+90d)', inAmount: 2200000, outAmount: 1980000, netAmount: 220000, balance: 4530000 },
  ];

  const initialBalance = 3420000;
  const multiplier = scenario === 'optimist' ? 1.08 : scenario === 'stress' ? 0.85 : 1.0;
  const outMultiplier = scenario === 'stress' ? 1.05 : 1.0;

  const totalIn = periods.reduce((acc, curr) => acc + curr.inAmount * multiplier, 0);
  const totalOut = periods.reduce((acc, curr) => acc + curr.outAmount * outMultiplier, 0);
  const projectedFinalBalance = initialBalance + (totalIn - totalOut);

  return (
    <div className="space-y-4">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Fluxo de Caixa</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Fluxo de Caixa Realizado & Projetado (DRE Financeira)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Scenario Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setScenario('realist')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                scenario === 'realist' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cenário Realista
            </button>
            <button
              onClick={() => setScenario('optimist')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                scenario === 'optimist' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Otimista (+8%)
            </button>
            <button
              onClick={() => setScenario('stress')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                scenario === 'stress' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stress Test (-15%)
            </button>
          </div>

          <button
            onClick={() => alert('Exportando Fluxo de Caixa Diário em XLSX...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Planilha</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Saldo Atual Disponível</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{fmt(initialBalance)}</div>
          <div className="text-[10px] text-slate-400 mt-1">Disponibilidade Imediata</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Total Entradas Projetadas</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{fmt(totalIn)}</div>
          <div className="text-[10px] text-emerald-600 mt-1">Recebimentos contratuais</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Total Saídas Previstas</div>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">{fmt(totalOut)}</div>
          <div className="text-[10px] text-rose-600 mt-1">Fornecedores, folha e tributos</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-600 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-purple-700 uppercase">Saldo Final Projetado</div>
          <div className="text-xl font-black text-purple-700 font-mono mt-0.5">{fmt(projectedFinalBalance)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">
            ▲ Superávit operacional mantido
          </div>
        </div>
      </div>

      {/* 3. Visual Cash Flow Horizon Bars */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-50 text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-slate-800">
              Curva de Entradas vs Saídas por Período
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-600 text-[11px]">Entradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span className="text-slate-600 text-[11px]">Saídas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600"></span>
              <span className="text-slate-600 text-[11px]">Saldo Acumulado</span>
            </div>
          </div>
        </div>

        {/* Visual Comparative Bars */}
        <div className="space-y-3">
          {periods.map((p, idx) => {
            const inVal = p.inAmount * multiplier;
            const outVal = p.outAmount * outMultiplier;
            const maxVal = 2500000;
            const inPercent = Math.min(100, Math.round((inVal / maxVal) * 100));
            const outPercent = Math.min(100, Math.round((outVal / maxVal) * 100));

            return (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="font-bold text-slate-800">{p.period}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">+{fmt(inVal)}</span>
                    <span className="text-rose-600 font-bold">-{fmt(outVal)}</span>
                    <span className="text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      Saldo: {fmt(p.balance)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Inflow bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${inPercent}%` }}
                    />
                  </div>
                  {/* Outflow bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${outPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Detailed Projection Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-800">
          Demonstrativo Analítico de Fluxo de Caixa (DFP)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2 px-3">Horizonte Temporal</th>
                <th className="py-2 px-3 text-right">Saldo Inicial</th>
                <th className="py-2 px-3 text-right text-emerald-700">(+) Recebimentos</th>
                <th className="py-2 px-3 text-right text-rose-600">(-) Fornecedores & Custos</th>
                <th className="py-2 px-3 text-right text-blue-700">(=) Resultado Líquido</th>
                <th className="py-2 px-3 text-right font-black">Saldo Final Projetado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {periods.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{p.period}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{fmt(p.balance - p.netAmount)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">
                    +{fmt(p.inAmount * multiplier)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-rose-600 font-semibold">
                    -{fmt(p.outAmount * outMultiplier)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-blue-700 font-bold">
                    {fmt(p.inAmount * multiplier - p.outAmount * outMultiplier)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900 bg-slate-50/50">
                    {fmt(p.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
