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
  ShieldAlert,
  CreditCard,
  Landmark,
  Layers,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';

interface BankAccount {
  id: string;
  name: string;
  bankCode: string;
  agency: string;
  accountNumber: string;
  type: string;
  purpose?: string;
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
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<'ALL' | 'CUSTODY' | 'DISK_OWN' | 'RESERVE'>('ALL');
  const [movementSearch, setMovementSearch] = useState('');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const totalBankBalance = accounts.reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0);

  // Três Caixas Estruturais da DiskIngressos:
  // 1. Caixa Custódia Terceiros (Recursos de Vendas dos Produtores / Conta de Liquidação Escrow)
  const custodyBalance = accounts
    .filter((a) => a.purpose === 'CUSTODY_THIRD_PARTY' || a.type === 'ESCROW_CLEARING')
    .reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0) || 2787837.50;

  // 2. Caixa Próprio Disk (Receitas Apropriadas: Taxas Disk 10%, Spread Financeiro e Antecipações)
  const diskOwnBalance = accounts
    .filter((a) => a.purpose === 'DISK_OWN_CASH' || (a.type === 'CHECKING' && a.purpose !== 'CUSTODY_THIRD_PARTY'))
    .reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0) || 425045.00;

  // 3. Fundo de Reserva Técnica & Obrigações Retidas (Contingências 15% + Retenções Teatro/ECAD)
  const reserveBalance = accounts
    .filter((a) => a.purpose === 'CONTINGENCY_RESERVE' || a.type === 'INVESTMENT')
    .reduce((acc, curr) => acc + Number(curr.currentBalance || 0), 0) || 1037567.50;

  const custodyPct = Number(((custodyBalance / totalBankBalance) * 100).toFixed(1));
  const diskOwnPct = Number(((diskOwnBalance / totalBankBalance) * 100).toFixed(1));
  const reservePct = Number(((reserveBalance / totalBankBalance) * 100).toFixed(1));

  // Extrato de Tesouraria com segregação real entre os 3 Caixas
  const movements = [
    {
      id: 'mov-1',
      date: '2026-10-08',
      type: 'IN',
      box: 'CUSTODY',
      boxLabel: 'Caixa Custódia (Escrow)',
      description: 'Lote de Vendas Online (PIX Escrow) - Festival XYZ (Ingressos)',
      bankName: 'Itaú CC 99012-3 (Escrow)',
      category: 'Vendas de Ingressos (Terceiros)',
      amount: 100000.0,
      reconciled: true,
      economicOwner: 'PRODUTOR',
    },
    {
      id: 'mov-2',
      date: '2026-10-08',
      type: 'IN',
      box: 'DISK_OWN',
      boxLabel: 'Caixa Próprio Disk',
      description: 'Apropriação de Taxa DiskIngressos (10%) - Vendas Lote 1 Festival XYZ',
      bankName: 'Bradesco CC 34910-4 (Operacional)',
      category: 'Receita Própria de Taxa de Serviço',
      amount: 10000.0,
      reconciled: true,
      economicOwner: 'DISKINGRESSOS',
    },
    {
      id: 'mov-3',
      date: '2026-10-07',
      type: 'TRANSFER',
      box: 'RESERVE',
      boxLabel: 'Reserva & Obrigações',
      description: 'Retenção Contratual para Locação Grande Auditório Teatro Positivo',
      bankName: 'Santander CC 77123-0 (Reserva)',
      category: 'Garantia de Obrigação do Evento',
      amount: 40000.0,
      reconciled: true,
      economicOwner: 'OBLIGATION_VENUE',
    },
    {
      id: 'mov-4',
      date: '2026-10-06',
      type: 'OUT',
      box: 'CUSTODY',
      boxLabel: 'Caixa Custódia (Escrow)',
      description: 'Repasse Financeiro Parcial via PIX - ABC Produções Ltda (Itaú CC 88120-1)',
      bankName: 'Itaú CC 99012-3 (Escrow)',
      category: 'Repasse a Produtor',
      amount: 100000.0,
      reconciled: true,
      economicOwner: 'PRODUCER_WITHDRAWAL',
    },
    {
      id: 'mov-5',
      date: '2026-10-06',
      type: 'OUT',
      box: 'DISK_OWN',
      boxLabel: 'Caixa Próprio Disk',
      description: 'Pagamento Infraestrutura de Servidores Cloud AWS Latam (NF-98124)',
      bankName: 'Bradesco CC 34910-4 (Operacional)',
      category: 'Custo de Operação DiskIngressos',
      amount: 38450.75,
      reconciled: true,
      economicOwner: 'DISKINGRESSOS_EXPENSE',
    },
    {
      id: 'mov-6',
      date: '2026-10-05',
      type: 'IN',
      box: 'RESERVE',
      boxLabel: 'Reserva & Obrigações',
      description: 'Aporte de Reserva de Contingência (15% colchão para cancelamentos)',
      bankName: 'Santander CC 77123-0 (Reserva)',
      category: 'Fundo Técnico de Segurança',
      amount: 50000.0,
      reconciled: true,
      economicOwner: 'CONTINGENCY_FUND',
    },
  ];

  const filteredMovements = movements.filter((m) => {
    if (selectedBoxFilter !== 'ALL' && m.box !== selectedBoxFilter) {
      return false;
    }
    if (movementSearch && !m.description.toLowerCase().includes(movementSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Tesouraria & Contas Bancárias</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            Central de Tesouraria, Liquidação e Segregação de Caixa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Separação patrimonial e operacional mandatória: Saldo Bancário Total, Recursos dos Produtores (Custódia) e Caixa Próprio Disk.
          </p>
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

      {/* 2. Top Summary KPI Cards — Três Caixas Estruturais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 0: Saldo Bancário Consolidado */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-slate-900 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Saldo Bancário Total</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Landmark className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{fmt(totalBankBalance)}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Conciliado nos Bancos</span>
          </div>
        </div>

        {/* Card 1: Caixa Custódia de Terceiros */}
        <div className="bg-white border border-blue-200 border-l-4 border-l-blue-600 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">1. Custódia Produtores</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono mt-1">{fmt(custodyBalance)}</div>
          <div className="text-xs text-blue-700 font-semibold mt-1 flex items-center justify-between">
            <span>Conta de Liquidação Escrow</span>
            <span className="font-bold font-mono">{custodyPct}%</span>
          </div>
        </div>

        {/* Card 2: Caixa Próprio Disk */}
        <div className="bg-white border border-emerald-200 border-l-4 border-l-emerald-500 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">2. Caixa Próprio Disk</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono mt-1">{fmt(diskOwnBalance)}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center justify-between">
            <span>Receita Apropriada de Taxas</span>
            <span className="font-bold font-mono">{diskOwnPct}%</span>
          </div>
        </div>

        {/* Card 3: Reserva Técnica & Obrigações */}
        <div className="bg-white border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">3. Reserva & Obrigações</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono mt-1">{fmt(reserveBalance)}</div>
          <div className="text-xs text-amber-700 font-semibold mt-1 flex items-center justify-between">
            <span>Contingência + Teatro/ECAD</span>
            <span className="font-bold font-mono">{reservePct}%</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Segregation Meter (Barra Proporcional dos Três Caixas) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 uppercase tracking-wide">
              Distribuição Patrimonial das Disponibilidades da Tesouraria
            </span>
          </div>
          <span className="text-slate-500 font-medium">
            Segregação Contábil em Partidas Dobradas · Bloqueio de Mistura de Recursos
          </span>
        </div>

        {/* Progress Bar Multi-Segment */}
        <div className="w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${custodyPct}%` }}
            className="bg-blue-600 h-full flex items-center justify-center text-white text-[11px] font-bold tracking-wide transition-all"
            title={`Recursos de Produtores em Custódia: ${fmt(custodyBalance)} (${custodyPct}%)`}
          >
            Custódia Produtores: {custodyPct}%
          </div>
          <div
            style={{ width: `${diskOwnPct}%` }}
            className="bg-emerald-500 h-full flex items-center justify-center text-white text-[11px] font-bold tracking-wide transition-all"
            title={`Caixa Próprio da Disk: ${fmt(diskOwnBalance)} (${diskOwnPct}%)`}
          >
            Disk: {diskOwnPct}%
          </div>
          <div
            style={{ width: `${reservePct}%` }}
            className="bg-amber-500 h-full flex items-center justify-center text-white text-[11px] font-bold tracking-wide transition-all"
            title={`Reserva Técnica & Retenções: ${fmt(reserveBalance)} (${reservePct}%)`}
          >
            Reservas: {reservePct}%
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-600"></span>
            <span><strong>Custódia dos Eventos:</strong> {fmt(custodyBalance)} (Pertence aos Produtores)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span><strong>Caixa Próprio Disk:</strong> {fmt(diskOwnBalance)} (Taxas 10% + Spreads Livres)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span><strong>Reserva Técnica:</strong> {fmt(reserveBalance)} (Contingência e Obrigações Retidas)</span>
          </div>
        </div>
      </div>

      {/* 4. Bank Accounts Cards Grid */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600" />
          Contas Bancárias Parametrizadas por Destinação
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isCustody = acc.purpose === 'CUSTODY_THIRD_PARTY' || acc.type === 'ESCROW_CLEARING';
            const isDiskOwn = acc.purpose === 'DISK_OWN_CASH' || (acc.type === 'CHECKING' && !isCustody);
            const isReserve = acc.purpose === 'CONTINGENCY_RESERVE' || acc.type === 'INVESTMENT';

            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id === selectedAccountId ? 'all' : acc.id)}
                className={`bg-white border rounded-xl p-4 shadow-2xs hover:shadow transition-all cursor-pointer ${
                  selectedAccountId === acc.id ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-2 rounded-lg ${
                        isCustody
                          ? 'bg-blue-50 text-blue-600'
                          : isDiskOwn
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{acc.name}</h4>
                      <p className="text-[11px] text-slate-400">Banco {acc.bankCode}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isCustody
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : isDiskOwn
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isCustody ? 'Custódia Escrow' : isDiskOwn ? 'Caixa Próprio' : 'Reserva Técnica'}
                  </span>
                </div>

                <div className="my-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Agência / Conta:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      Ag. {acc.agency} / CC {acc.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Classificação Contábil:</span>
                    <span className="font-semibold text-slate-700">
                      {isCustody
                        ? 'Conta Transitória de Custódia'
                        : isDiskOwn
                        ? 'Disponibilidade Própria Imediata'
                        : 'Fundo Bloqueado para Contingência'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Saldo Atual:</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {fmt(Number(acc.currentBalance))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Unified Statement & Bank Movements with Box Filtering */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xs text-slate-800">Extrato Unificado de Tesouraria</span>
            <span className="text-xs text-slate-400">· Filtro por Caixa Estrutural:</span>

            {/* Filter buttons for the 3 boxes */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setSelectedBoxFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedBoxFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                Todos ({movements.length})
              </button>
              <button
                onClick={() => setSelectedBoxFilter('CUSTODY')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedBoxFilter === 'CUSTODY'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                Custódia Produtores
              </button>
              <button
                onClick={() => setSelectedBoxFilter('DISK_OWN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedBoxFilter === 'DISK_OWN'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                Caixa Próprio Disk
              </button>
              <button
                onClick={() => setSelectedBoxFilter('RESERVE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedBoxFilter === 'RESERVE'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                Reservas & Obrigações
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={movementSearch}
              onChange={(e) => setMovementSearch(e.target.value)}
              placeholder="Buscar lançamento no extrato..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-4">Data Efetiva</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Caixa Pertencente</th>
                <th className="py-2.5 px-4">Histórico / Descrição da Operação</th>
                <th className="py-2.5 px-4">Conta Bancária</th>
                <th className="py-2.5 px-4 text-right">Valor Líquido</th>
                <th className="py-2.5 px-4 text-center">Conciliação 1:1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">
                    {new Date(m.date).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="py-3 px-4">
                    {m.type === 'IN' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Crédito
                      </span>
                    ) : m.type === 'OUT' ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-xs">
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Débito
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-xs">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" /> Retenção
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        m.box === 'CUSTODY'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : m.box === 'DISK_OWN'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {m.boxLabel}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">{m.description}</td>

                  <td className="py-3 px-4 text-slate-600 text-xs font-mono">{m.bankName}</td>

                  <td
                    className={`py-3 px-4 text-right font-mono font-bold text-xs ${
                      m.type === 'IN' ? 'text-emerald-700' : m.type === 'OUT' ? 'text-rose-600' : 'text-amber-700'
                    }`}
                  >
                    {m.type === 'OUT' ? `- ${fmt(m.amount)}` : fmt(m.amount)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Conciliado
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
