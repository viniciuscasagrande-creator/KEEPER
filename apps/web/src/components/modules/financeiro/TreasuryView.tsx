import React, { useState } from 'react';
import {
  Building2,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Landmark,
} from 'lucide-react';

interface BankAccount {
  id: string;
  name: string;
  bankCode: string;
  agency: string;
  accountNumber: string;
  type: string;
  currentBalance: number;
}

interface TreasuryViewProps {
  accounts: BankAccount[];
  onOpenTransfer: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function TreasuryView({
  accounts,
  onOpenTransfer,
  onRefresh,
  isLoading,
}: TreasuryViewProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [movementSearch, setMovementSearch] = useState('');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const totalBalance = accounts.reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0);
  const checkingBalance = accounts
    .filter((a) => a.type === 'CHECKING')
    .reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0);
  const investmentBalance = accounts
    .filter((a) => a.type !== 'CHECKING')
    .reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0);

  // Mock unified bank movements / statement
  const movements = [
    {
      id: 'mov-1',
      date: '2026-10-08',
      type: 'IN',
      description: 'Recebimento PIX - TechCorp Brasil Tecnologia S.A. (NF 45291)',
      bankName: 'Itaú Unibanco S.A.',
      category: 'Receita Operacional SaaS',
      amount: 145000.0,
      reconciled: true,
    },
    {
      id: 'mov-2',
      date: '2026-10-08',
      type: 'OUT',
      description: 'Pagamento PIX - Amazon Web Services Latam (NF AWS-98124)',
      bankName: 'Itaú Unibanco S.A.',
      category: 'Infraestrutura Cloud & TI',
      amount: 38450.75,
      reconciled: true,
    },
    {
      id: 'mov-3',
      date: '2026-10-07',
      type: 'TRANSFER',
      description: 'Transferência Interbancária: Itaú → Bradesco (Reposição de Caixa)',
      bankName: 'Itaú Unibanco / Bradesco',
      category: 'Transferência entre Contas',
      amount: 100000.0,
      reconciled: true,
    },
    {
      id: 'mov-4',
      date: '2026-10-07',
      type: 'IN',
      description: 'Rendimento de Aplicação CDB Liquidez Diária (100% CDI)',
      bankName: 'Banco Santander Brasil',
      category: 'Receita Financeira',
      amount: 2450.18,
      reconciled: true,
    },
    {
      id: 'mov-5',
      date: '2026-10-06',
      type: 'OUT',
      description: 'TED Remessa Folha - Banco Santander Adiantamento Quinzenal',
      bankName: 'Banco Bradesco S.A.',
      category: 'Salários e Encargos',
      amount: 184500.0,
      reconciled: true,
    },
  ];

  const filteredMovements = movements.filter((m) => {
    if (movementSearch && !m.description.toLowerCase().includes(movementSearch.toLowerCase())) {
      return false;
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
            <span className="font-semibold text-slate-800">Tesouraria & Contas Bancárias</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            Central de Tesouraria e Disponibilidades
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={onOpenTransfer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transferência Interbancária</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Disponibilidade Total</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{fmt(totalBalance)}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Conciliado com Extrato Bancário
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Contas Correntes (Giro)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{fmt(checkingBalance)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Disponibilidade Imediata para liquidações</div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Aplicações Financeiras</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{fmt(investmentBalance)}</div>
          <div className="text-[11px] text-slate-500 mt-1">CDB 100% CDI Liquidez Diária</div>
        </div>
      </div>

      {/* 3. Bank Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccountId(acc.id === selectedAccountId ? 'all' : acc.id)}
            className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow transition-all cursor-pointer ${
              selectedAccountId === acc.id ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{acc.name}</h4>
                  <p className="text-[10px] text-slate-400">Banco {acc.bankCode}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Online
              </span>
            </div>

            <div className="my-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Agência / Conta:</span>
                <span className="font-mono font-medium text-slate-800">
                  Ag. {acc.agency} / CC {acc.accountNumber}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Tipo de Conta:</span>
                <span className="font-semibold text-slate-700">
                  {acc.type === 'CHECKING' ? 'Conta Corrente Movimento' : 'Aplicação Financeira CDB'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Saldo Atual:</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {fmt(Number(acc.currentBalance))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Unified Statement & Bank Movements */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-800">Extrato Unificado de Tesouraria</span>
            <span className="text-[11px] text-slate-400">· Todas as Contas e Transações</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={movementSearch}
              onChange={(e) => setMovementSearch(e.target.value)}
              placeholder="Buscar lançamento no extrato..."
              className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-4">Data Efetiva</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Histórico / Descrição da Operação</th>
                <th className="py-2.5 px-4">Banco / Conta</th>
                <th className="py-2.5 px-4">Categoria</th>
                <th className="py-2.5 px-4 text-right">Valor Líquido</th>
                <th className="py-2.5 px-4 text-center">Conciliação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px]">
                    {new Date(m.date).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-2.5 px-4">
                    {m.type === 'IN' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Crédito
                      </span>
                    ) : m.type === 'OUT' ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Débito
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" /> Transf.
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 font-semibold text-slate-800">{m.description}</td>

                  <td className="py-2.5 px-4 text-slate-600 text-[11px]">{m.bankName}</td>

                  <td className="py-2.5 px-4 text-slate-500">{m.category}</td>

                  <td
                    className={`py-2.5 px-4 text-right font-mono font-bold text-xs ${
                      m.type === 'IN' ? 'text-emerald-700' : m.type === 'OUT' ? 'text-rose-600' : 'text-blue-700'
                    }`}
                  >
                    {m.type === 'OUT' ? `- ${fmt(m.amount)}` : fmt(m.amount)}
                  </td>

                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Conciliado 1:1
                    </span>
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
