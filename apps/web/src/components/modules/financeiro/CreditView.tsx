import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  TrendingUp,
  Download,
  Plus,
  Building2,
  Sliders,
  DollarSign,
} from 'lucide-react';

export function CreditView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'NORMAL' | 'ALERT' | 'BLOCKED'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const [customers, setCustomers] = useState([
    {
      id: 'c-1',
      name: 'TechCorp Brasil Tecnologia S.A.',
      cnpj: '12.345.678/0001-90',
      score: 'AAA',
      limitTotal: 1500000,
      limitUsed: 420000,
      daysOverdueAvg: 0,
      status: 'NORMAL', // NORMAL | ALERT | BLOCKED
    },
    {
      id: 'c-2',
      name: 'Varejo Global Comércio e Distribuição Ltda',
      cnpj: '98.765.432/0001-11',
      score: 'AA',
      limitTotal: 800000,
      limitUsed: 620000,
      daysOverdueAvg: 4,
      status: 'ALERT',
    },
    {
      id: 'c-3',
      name: 'Hospital das Clínicas Metropolitano S.A.',
      cnpj: '45.123.789/0001-55',
      score: 'A',
      limitTotal: 1200000,
      limitUsed: 350000,
      daysOverdueAvg: 0,
      status: 'NORMAL',
    },
    {
      id: 'c-4',
      name: 'Indústria Metalúrgica Progresso S.A.',
      cnpj: '77.888.999/0001-22',
      score: 'C',
      limitTotal: 300000,
      limitUsed: 298000,
      daysOverdueAvg: 38,
      status: 'BLOCKED',
    },
    {
      id: 'c-5',
      name: 'Distribuidora Aliança de Alimentos Ltda',
      cnpj: '33.444.555/0001-66',
      score: 'B',
      limitTotal: 500000,
      limitUsed: 380000,
      daysOverdueAvg: 12,
      status: 'ALERT',
    },
  ]);

  const totalLimit = customers.reduce((acc, curr) => acc + curr.limitTotal, 0);
  const totalUsed = customers.reduce((acc, curr) => acc + curr.limitUsed, 0);
  const totalAvailable = totalLimit - totalUsed;
  const blockedCount = customers.filter((c) => c.status === 'BLOCKED').length;

  const handleToggleBlock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'BLOCKED' ? 'NORMAL' : 'BLOCKED';
          setActionNotice(
            `Cliente ${c.name} ${nextStatus === 'BLOCKED' ? 'BLOQUEADO para novos pedidos' : 'DESBLOQUEADO com sucesso'}!`
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    setTimeout(() => setActionNotice(null), 3000);
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.cnpj.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Crédito & Risco</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Políticas de Limite de Crédito e Bloqueio Comercial
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActionNotice('Regras de score Serasa/Boa Vista sincronizadas com sucesso!');
              setTimeout(() => setActionNotice(null), 2500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Atualizar Bureau (Serasa)</span>
          </button>
          <button
            onClick={() => alert('Abrir modal de concessão de limite de crédito')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Limite de Crédito</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Limite Global Concedido</div>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">{fmt(totalLimit)}</div>
          <div className="text-[10px] text-slate-400">Total aprovado para carteira</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase">Limite Utilizado (Exposição)</div>
          <div className="text-xl font-black text-amber-700 font-mono mt-0.5">{fmt(totalUsed)}</div>
          <div className="text-[10px] text-slate-400">
            {((totalUsed / totalLimit) * 100).toFixed(1)}% do teto consumido
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Limite Livre para Vendas</div>
          <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{fmt(totalAvailable)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Crédito saudável</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Bloqueados para Faturamento</div>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">{blockedCount} clientes</div>
          <div className="text-[10px] text-rose-600 font-medium">Inadimplência ou estourado</div>
        </div>
      </div>

      {/* Notice feedback */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 3. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente ou CNPJ..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 w-64 text-slate-800 text-xs"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({customers.length})
            </button>
            <button
              onClick={() => setStatusFilter('NORMAL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'NORMAL' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Liberados
            </button>
            <button
              onClick={() => setStatusFilter('ALERT')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'ALERT' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Alerta
            </button>
            <button
              onClick={() => setStatusFilter('BLOCKED')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'BLOCKED' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bloqueados
            </button>
          </div>
        </div>

        <div className="text-slate-500">
          Bloqueio automático em pedidos de venda com títulos vencidos &gt; 15 dias
        </div>
      </div>

      {/* 4. Customers Credit Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">Cliente / CNPJ</th>
                <th className="py-2.5 px-4 text-center">Score</th>
                <th className="py-2.5 px-4 text-right">Limite Total</th>
                <th className="py-2.5 px-4 text-right">Limite Utilizado</th>
                <th className="py-2.5 px-4 text-right">Saldo Disponível</th>
                <th className="py-2.5 px-4 text-center w-32">% Consumo</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-center w-28">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => {
                const available = c.limitTotal - c.limitUsed;
                const percent = Math.round((c.limitUsed / c.limitTotal) * 100);

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.cnpj}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${
                          c.score === 'AAA' || c.score === 'AA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.score === 'A'
                            ? 'bg-blue-100 text-blue-800'
                            : c.score === 'B'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {c.score}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700">
                      {fmt(c.limitTotal)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {fmt(c.limitUsed)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {fmt(available)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent > 90 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-600 w-7">{percent}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {c.status === 'BLOCKED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Lock className="w-3 h-3" /> Bloqueado
                        </span>
                      ) : c.status === 'ALERT' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Alerta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Liberado
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleBlock(c.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors ${
                          c.status === 'BLOCKED'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {c.status === 'BLOCKED' ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Desbloquear</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Bloquear</span>
                          </>
                        )}
                      </button>
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
