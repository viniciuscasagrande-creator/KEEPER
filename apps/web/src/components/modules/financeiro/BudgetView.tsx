import React, { useState } from 'react';
import {
  PieChart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  BarChart3,
} from 'lucide-react';

export function BudgetView() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-10');
  const [filterOverBudgetOnly, setFilterOverBudgetOnly] = useState(false);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const budgetItems = [
    {
      id: 'b-1',
      costCenter: 'CC-101 - Infraestrutura Cloud & TI',
      manager: 'Renato Silveira (CTO)',
      planned: 450000,
      actual: 384500,
      category: 'Serviços de Nuvem e Licenciamento',
    },
    {
      id: 'b-2',
      costCenter: 'CC-204 - Operações Prediais & Facilities',
      manager: 'Mariana Duarte (Facilities)',
      planned: 220000,
      actual: 228000, // Over budget
      category: 'Locação, Condomínio e Manutenção',
    },
    {
      id: 'b-3',
      costCenter: 'CC-302 - Controladoria & Auditoria Externa',
      manager: 'Carlos Eduardo (CFO)',
      planned: 180000,
      actual: 145000,
      category: 'Consultorias Contábeis & Auditoria',
    },
    {
      id: 'b-4',
      costCenter: 'CC-405 - Vendas & Marketing Digital',
      manager: 'Beatriz Fontes (CMO)',
      planned: 300000,
      actual: 242000,
      category: 'Google Ads, Eventos e Aquisição',
    },
    {
      id: 'b-5',
      costCenter: 'CC-501 - Recursos Humanos & Benefícios',
      manager: 'Fernanda Lima (CHRO)',
      planned: 1200000,
      actual: 1150000,
      category: 'Folha, VR/VT, Seguro Saúde',
    },
  ];

  const totalPlanned = budgetItems.reduce((acc, curr) => acc + curr.planned, 0);
  const totalActual = budgetItems.reduce((acc, curr) => acc + curr.actual, 0);
  const totalSavings = totalPlanned - totalActual;
  const executionRate = (totalActual / totalPlanned) * 100;
  const overBudgetCount = budgetItems.filter((b) => b.actual > b.planned).length;

  const filteredItems = filterOverBudgetOnly
    ? budgetItems.filter((b) => b.actual > b.planned)
    : budgetItems;

  return (
    <div className="space-y-4">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Controladoria & Orçamento</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            Orçamento Planejado vs Realizado por Centro de Custo
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Outubro / 2026</span>
          </div>

          <button
            onClick={() => alert('Exportando relatório comparativo de orçamento em PDF...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Relatório Orçamentário</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Orçado para o Período</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{fmt(totalPlanned)}</div>
          <div className="text-[10px] text-slate-400">Budget aprovado pelo Board</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-purple-600 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-purple-700 uppercase">Realizado / Comprometido</div>
          <div className="text-xl font-black text-purple-700 font-mono mt-0.5">{fmt(totalActual)}</div>
          <div className="text-[10px] text-slate-400">Taxa de Execução: {executionRate.toFixed(1)}%</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Economia Orçamentária</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{fmt(totalSavings)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">▲ 8,9% abaixo do teto global</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Centros em Alerta (Estouro)</div>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">{overBudgetCount} centro</div>
          <div className="text-[10px] text-rose-600 font-medium">Requer bloqueio de compras</div>
        </div>
      </div>

      {/* Filter / Toggle Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOverBudgetOnly(false)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              !filterOverBudgetOnly ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos os Centros ({budgetItems.length})
          </button>
          <button
            onClick={() => setFilterOverBudgetOnly(true)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              filterOverBudgetOnly ? 'bg-rose-600 text-white shadow-2xs' : 'bg-slate-100 text-rose-700 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Apenas com Estouro ({overBudgetCount})</span>
          </button>
        </div>

        <div className="text-slate-500">
          Governança orçamentária com alçadas automáticas de workflow
        </div>
      </div>

      {/* 3. Budget Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">Centro de Custo / Gestor</th>
                <th className="py-2.5 px-4">Categoria Orçada</th>
                <th className="py-2.5 px-4 text-right">Orçado (Budget)</th>
                <th className="py-2.5 px-4 text-right">Realizado (Actual)</th>
                <th className="py-2.5 px-4 text-right">Variação (Saldo)</th>
                <th className="py-2.5 px-4 text-center w-36">% Execução</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const diff = item.planned - item.actual;
                const percent = Math.round((item.actual / item.planned) * 100);
                const isOver = item.actual > item.planned;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.costCenter}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{item.manager}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">{item.category}</td>

                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                      {fmt(item.planned)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {fmt(item.actual)}
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        isOver ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {isOver ? `- ${fmt(Math.abs(diff))}` : `+ ${fmt(diff)}`}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOver ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] w-9 text-right text-slate-800">
                          {percent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Estouro
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> No Limite
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
