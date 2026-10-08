import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  Plus,
  ArrowRightLeft,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  CreditCard,
  Layers,
  PieChart,
  BarChart3,
} from 'lucide-react';

interface FinancialDashboardProps {
  onOpenNewPayable: () => void;
  onOpenNewReceivable: () => void;
  onOpenTransfer: () => void;
  onNavigateTab: (tabId: string) => void;
}

export function FinancialDashboard({
  onOpenNewPayable,
  onOpenNewReceivable,
  onOpenTransfer,
  onNavigateTab,
}: FinancialDashboardProps) {
  const [cashflowScenario, setCashflowScenario] = useState<'realized' | 'projected' | 'scenario'>('realized');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      {/* 1. Context Filter Header (NetSuite style) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="p-1 rounded bg-blue-600 text-white">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
            <span>Central Financeira</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Período: <strong>Outubro / 2026</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 font-medium">Empresa:</span>
            <select className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="all">Todas as Empresas (Consolidado)</option>
              <option value="matriz">01 - Keeper Matriz Holding S.A.</option>
              <option value="filial1">02 - Keeper Tecnologia Ltda</option>
              <option value="filial2">03 - Keeper Serviços Digitais</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 font-medium">Filial:</span>
            <select className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="all">Todas as Filiais ▼</option>
              <option value="sp">Curitiba / PR (Matriz)</option>
              <option value="rj">São Paulo / SP</option>
              <option value="mg">Belo Horizonte / MG</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* A Pagar */}
        <div
          onClick={() => onNavigateTab('payables')}
          className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-rose-500 p-4 shadow-2xs hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wide">A Pagar</span>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 5,4%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-rose-600 transition-colors">
              R$ 1,25 M
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              34 títulos a liquidar este mês
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>vs. mês ant. (R$ 1,32M)</span>
            <span className="font-semibold text-rose-600 flex items-center gap-0.5">
              Ver contas <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* A Receber */}
        <div
          onClick={() => onNavigateTab('receivables')}
          className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-600 p-4 shadow-2xs hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wide">A Receber</span>
            <span className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 12,8%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors">
              R$ 2,84 M
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              62 faturas faturadas / recorrentes
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>vs. mês ant. (R$ 2,51M)</span>
            <span className="font-semibold text-blue-600 flex items-center gap-0.5">
              Ver contas <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Saldo Consolidado */}
        <div
          onClick={() => onNavigateTab('treasury')}
          className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 p-4 shadow-2xs hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wide">Saldo Bancário</span>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 8,1%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-emerald-600 transition-colors">
              R$ 3,42 M
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Disponibilidade em 4 contas ativas
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Conciliação 100% em dia</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
              Ver bancos <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Inadimplência */}
        <div
          onClick={() => onNavigateTab('credit')}
          className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-500 p-4 shadow-2xs hover:shadow transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wide">Inadimplência</span>
            <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 3,2%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-amber-600 transition-colors">
              R$ 184 K
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              6,4% do faturamento da carteira
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>7 clientes sob régua ativa</span>
            <span className="font-semibold text-amber-700 flex items-center gap-0.5">
              Ver crédito <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Operational Shortcuts & Financial Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Shortcuts */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Atalhos Operacionais
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">1-Clique Ações</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={onOpenNewPayable}
              className="p-3 rounded-lg bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/80 text-rose-800 text-left transition-all group flex flex-col justify-between"
            >
              <Plus className="w-4 h-4 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Novo Título a Pagar</div>
              <div className="text-[10px] text-rose-600/80 mt-0.5">Despesa & Provisão</div>
            </button>

            <button
              onClick={onOpenNewReceivable}
              className="p-3 rounded-lg bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/80 text-blue-800 text-left transition-all group flex flex-col justify-between"
            >
              <Plus className="w-4 h-4 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Novo Título a Receber</div>
              <div className="text-[10px] text-blue-600/80 mt-0.5">Faturamento & Cliente</div>
            </button>

            <button
              onClick={() => onNavigateTab('payables')}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-left transition-all group flex flex-col justify-between"
            >
              <CreditCard className="w-4 h-4 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Novo Pagamento</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Baixa bancária</div>
            </button>

            <button
              onClick={() => onNavigateTab('receivables')}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-left transition-all group flex flex-col justify-between"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Novo Recebimento</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Compensação PIX/TED</div>
            </button>

            <button
              onClick={onOpenTransfer}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-left transition-all group flex flex-col justify-between"
            >
              <ArrowRightLeft className="w-4 h-4 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Transferência</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Entre contas bancárias</div>
            </button>

            <button
              onClick={() => onNavigateTab('reconciliation')}
              className="p-3 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 text-left transition-all group flex flex-col justify-between"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold leading-tight">Conciliação</div>
              <div className="text-[10px] text-emerald-600/80 mt-0.5">Extrato OFX/API</div>
            </button>
          </div>
        </div>

        {/* Financial Alerts */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertas Financeiros do Dia
              </h3>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                4 Críticos
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div
                onClick={() => onNavigateTab('payables')}
                className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-semibold text-rose-900">12 títulos vencidos</span>
                </div>
                <span className="font-mono font-bold text-rose-700">R$ 218.400,00</span>
              </div>

              <div
                onClick={() => onNavigateTab('payables')}
                className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-900">8 pagamentos vencem hoje</span>
                </div>
                <span className="font-mono font-bold text-amber-800">R$ 142.300,00</span>
              </div>

              <div
                onClick={() => onNavigateTab('payables')}
                className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-900">4 pagamentos aguardam aprovação</span>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">Alçada Diretoria</span>
              </div>

              <div
                onClick={() => onNavigateTab('reconciliation')}
                className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-blue-900">2 conciliações bancárias pendentes</span>
                </div>
                <span className="text-[11px] text-blue-700 font-medium">Itaú / Bradesco</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('payables')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Central de Alertas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Cashflow (Realized vs Projected) & Balance By Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cashflow Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Fluxo de Caixa: Realizado × Projetado
                </h3>
                <p className="text-[11px] text-slate-400">Previsão e liquidez para os próximos 90 dias</p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                <button
                  onClick={() => setCashflowScenario('realized')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    cashflowScenario === 'realized'
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Realizado
                </button>
                <button
                  onClick={() => setCashflowScenario('projected')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    cashflowScenario === 'projected'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Projetado
                </button>
                <button
                  onClick={() => setCashflowScenario('scenario')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    cashflowScenario === 'scenario'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cenários
                </button>
              </div>
            </div>

            {/* Quick figures table */}
            <div className="grid grid-cols-4 gap-2.5 mb-4 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Saldo Inicial</span>
                <span className="font-mono text-xs font-black text-slate-800 mt-0.5 block">R$ 3,42M</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">(+) Entradas</span>
                <span className="font-mono text-xs font-black text-emerald-700 mt-0.5 block">
                  {cashflowScenario === 'projected' ? 'R$ 2,20M' : 'R$ 1,84M'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200">
                <span className="text-[10px] text-rose-600 uppercase font-bold block">(-) Saídas</span>
                <span className="font-mono text-xs font-black text-rose-700 mt-0.5 block">
                  {cashflowScenario === 'projected' ? 'R$ 1,67M' : 'R$ 1,21M'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] text-blue-600 uppercase font-bold block">(=) Saldo Final</span>
                <span className="font-mono text-xs font-black text-blue-700 mt-0.5 block">
                  {cashflowScenario === 'projected' ? 'R$ 3,95M' : 'R$ 4,05M'}
                </span>
              </div>
            </div>

            {/* Visual horizon bars */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Projeção por Horizontes de Liquidez:
              </div>
              <div className="grid grid-cols-6 gap-2 text-center font-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">Hoje</span>
                  <span className="font-bold text-slate-800 text-[11px]">+ R$ 60K</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">+7 dias</span>
                  <span className="font-bold text-slate-800 text-[11px]">+ R$ 150K</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">+15 dias</span>
                  <span className="font-bold text-slate-800 text-[11px]">+ R$ 280K</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">+30 dias</span>
                  <span className="font-bold text-emerald-700 text-[11px]">+ R$ 310K</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">+60 dias</span>
                  <span className="font-bold text-slate-800 text-[11px]">+ R$ 230K</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-sans block">+90 dias</span>
                  <span className="font-bold text-slate-800 text-[11px]">+ R$ 195K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Horizonte de cobertura de caixa: <strong>4.8 meses</strong></span>
            <button
              onClick={() => onNavigateTab('cashflow')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              Abrir Fluxo Completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bank Balances */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Saldo Por Instituição Bancária
              </h3>
              <span className="font-mono text-xs font-bold text-slate-900">Total: R$ 3,42M</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Itaú */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Itaú Unibanco S.A.</span>
                  <span className="font-mono font-bold text-slate-900">R$ 1.420.000,00</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '41.5%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>Ag. 0422 / CC 18920-1</span>
                  <span>41.5% do total</span>
                </div>
              </div>

              {/* Bradesco */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Banco Bradesco S.A.</span>
                  <span className="font-mono font-bold text-slate-900">R$ 920.000,00</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-600 h-2 rounded-full" style={{ width: '26.9%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>Ag. 1024 / CC 34910-4</span>
                  <span>26.9% do total</span>
                </div>
              </div>

              {/* Santander */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Banco Santander Brasil</span>
                  <span className="font-mono font-bold text-slate-900">R$ 680.000,00</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '19.8%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>Ag. 3301 / CC 77123-0 (CDB)</span>
                  <span>19.8% do total</span>
                </div>
              </div>

              {/* Caixa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Caixa Econômica Federal</span>
                  <span className="font-mono font-bold text-slate-900">R$ 420.000,00</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-sky-600 h-2 rounded-full" style={{ width: '12.2%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>Ag. 0001 / CC 55210-9</span>
                  <span>12.2% do total</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Atualizado há 3 minutos via Open Finance</span>
            <button
              onClick={() => onNavigateTab('treasury')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5"
            >
              Extrato & Saldos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Aging Tables (Contas a Pagar vs Contas a Receber) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contas a Pagar por Vencimento */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Contas a Pagar Por Vencimento (Aging)
            </h3>
            <span className="font-mono text-xs font-bold text-rose-600">Total: R$ 1,77M</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => onNavigateTab('payables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-700">Hoje</span>
              </div>
              <span className="font-mono font-bold text-slate-900">R$ 120.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('payables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-semibold text-slate-700">Próximos 7 dias</span>
              </div>
              <span className="font-mono font-bold text-slate-900">R$ 340.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('payables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-700">Próximos 30 dias</span>
              </div>
              <span className="font-mono font-bold text-slate-900">R$ 890.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('payables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="font-semibold text-slate-700">60+ dias</span>
              </div>
              <span className="font-mono font-bold text-slate-900">R$ 420.000,00</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('payables')}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>Gerenciar Contas a Pagar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contas a Receber por Vencimento */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              Contas a Receber Por Vencimento (Aging)
            </h3>
            <span className="font-mono text-xs font-bold text-blue-700">Total: R$ 2,52M</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div
              onClick={() => onNavigateTab('receivables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">Hoje</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">R$ 180.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('receivables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-semibold text-slate-700">Próximos 7 dias</span>
              </div>
              <span className="font-mono font-bold text-blue-700">R$ 490.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('receivables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-semibold text-slate-700">Próximos 30 dias</span>
              </div>
              <span className="font-mono font-bold text-blue-700">R$ 1.200.000,00</span>
            </div>

            <div
              onClick={() => onNavigateTab('receivables')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="font-semibold text-slate-700">60+ dias</span>
              </div>
              <span className="font-mono font-bold text-blue-700">R$ 650.000,00</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onNavigateTab('receivables')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Gerenciar Contas a Receber</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
