import React, { useState } from 'react';
import {
  CheckCheck,
  Upload,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowRightLeft,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

interface ReconciliationViewProps {
  onRefresh?: () => void;
}

export function ReconciliationView({ onRefresh }: ReconciliationViewProps) {
  const [selectedBank, setSelectedBank] = useState('341');
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'divergent' | 'unmatched'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // Mock reconciliation pairs
  const [reconciliationPairs, setReconciliationPairs] = useState([
    {
      id: 'rec-1',
      bankTx: {
        date: '2026-10-08',
        description: 'PIX RECEBIDO TECHCORP BRASIL 45291',
        amount: 145000.0,
        type: 'CREDIT',
      },
      erpItem: {
        titleNumber: 'REC-2026-00892',
        partyName: 'TechCorp Brasil Tecnologia S.A.',
        docNumber: 'NF-45291',
        dueDate: '2026-10-10',
        amount: 145000.0,
      },
      matchScore: 100,
      status: 'MATCHED', // MATCHED | CONFIRMED | DIVERGENT | UNMATCHED
    },
    {
      id: 'rec-2',
      bankTx: {
        date: '2026-10-08',
        description: 'PGTO ELETRONICO AWS LATAM LTDA',
        amount: 38450.75,
        type: 'DEBIT',
      },
      erpItem: {
        titleNumber: 'PAG-2026-00431',
        partyName: 'Amazon Web Services Latam Ltda',
        docNumber: 'AWS-98124',
        dueDate: '2026-10-08',
        amount: 38450.75,
      },
      matchScore: 100,
      status: 'MATCHED',
    },
    {
      id: 'rec-3',
      bankTx: {
        date: '2026-10-07',
        description: 'TRANSF PIX HOSPITAL DAS CLINICAS',
        amount: 112000.0,
        type: 'CREDIT',
      },
      erpItem: {
        titleNumber: 'REC-2026-00890',
        partyName: 'Hospital das Clínicas Metropolitano',
        docNumber: 'NF-39012',
        dueDate: '2026-10-06',
        amount: 112000.0,
      },
      matchScore: 98,
      status: 'CONFIRMED',
    },
    {
      id: 'rec-4',
      bankTx: {
        date: '2026-10-07',
        description: 'TAR EXPEDICAO BOLETO ELETRONICO',
        amount: 18.5,
        type: 'DEBIT',
      },
      erpItem: null,
      matchScore: 0,
      status: 'UNMATCHED',
    },
    {
      id: 'rec-5',
      bankTx: {
        date: '2026-10-06',
        description: 'DEB AUT DELOITTE TOUCHE SERVICOS',
        amount: 65120.0,
        type: 'DEBIT',
      },
      erpItem: {
        titleNumber: 'PAG-2026-00429',
        partyName: 'Deloitte Touche Tohmatsu Auditores',
        docNumber: 'NF-10492',
        dueDate: '2026-10-12',
        amount: 65000.0,
      },
      matchScore: 92,
      status: 'DIVERGENT', // Difference in interest/fee
      divergenceNotes: 'Diferença de R$ 120,00 referente a encargos de antecipação bancária.',
    },
  ]);

  const handleConfirmMatch = (id: string) => {
    setReconciliationPairs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'CONFIRMED' } : item))
    );
    setActionFeedback('Lançamento conciliado e partida contábil confirmada no Razão!');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleConfirmAll = () => {
    setReconciliationPairs((prev) =>
      prev.map((item) =>
        item.status === 'MATCHED' ? { ...item, status: 'CONFIRMED' } : item
      )
    );
    setActionFeedback('Todos os matches automáticos foram confirmados com sucesso!');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const filteredPairs = reconciliationPairs.filter((p) => {
    if (filterStatus === 'matched' && p.status !== 'MATCHED' && p.status !== 'CONFIRMED') return false;
    if (filterStatus === 'divergent' && p.status !== 'DIVERGENT') return false;
    if (filterStatus === 'unmatched' && p.status !== 'UNMATCHED') return false;
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
            <span className="font-semibold text-slate-800">Conciliação Bancária</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-blue-600" />
            Conciliação Inteligente de Extratos (Match 1:1)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActionFeedback('Simulando upload de extrato OFX/CNAB...');
              setTimeout(() => setActionFeedback('Arquivo OFX importado com sucesso! 28 lançamentos processados.'), 1000);
              setTimeout(() => setActionFeedback(null), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Importar Extrato OFX / Retorno CNAB</span>
          </button>
          <button
            onClick={handleConfirmAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Conciliar Lotes Automáticos (98%)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Índice de Match Automático</div>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">98,2%</div>
            <div className="text-[10px] text-slate-400">Algoritmo de conciliação por CNPJ/Valor/Data</div>
          </div>
          <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Lançamentos Conciliados</div>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">142 itens</div>
            <div className="text-[10px] text-slate-400">Total: R$ 3.840.290,00</div>
          </div>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-700 uppercase">Divergências de Juros/Taxas</div>
            <div className="text-lg font-black text-amber-700 font-mono mt-0.5">1 item</div>
            <div className="text-[10px] text-slate-400">Requer rateio complementar</div>
          </div>
          <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Itens Não Mapeados</div>
            <div className="text-lg font-black text-rose-600 font-mono mt-0.5">1 item (Tarifa)</div>
            <div className="text-[10px] text-slate-400">Criar despesa bancária</div>
          </div>
          <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <Plus className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 3. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400 font-medium">Conta:</span>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none"
            >
              <option value="341">Itaú Unibanco (CC 18920-1)</option>
              <option value="237">Bradesco (CC 34910-4)</option>
              <option value="033">Santander (CC 77123-0)</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({reconciliationPairs.length})
            </button>
            <button
              onClick={() => setFilterStatus('matched')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterStatus === 'matched' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conciliados
            </button>
            <button
              onClick={() => setFilterStatus('divergent')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterStatus === 'divergent' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Com Divergência
            </button>
            <button
              onClick={() => setFilterStatus('unmatched')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                filterStatus === 'unmatched' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sem ERP
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Extrato bancário sincronizado via Open Finance BACEN</span>
        </div>
      </div>

      {/* 4. Match Grid / Side-by-Side Comparison */}
      <div className="space-y-3">
        {filteredPairs.map((pair) => (
          <div
            key={pair.id}
            className={`bg-white border rounded-xl p-4 shadow-2xs transition-all ${
              pair.status === 'CONFIRMED'
                ? 'border-emerald-200 bg-emerald-50/20'
                : pair.status === 'DIVERGENT'
                ? 'border-amber-300 bg-amber-50/20'
                : pair.status === 'UNMATCHED'
                ? 'border-rose-200 bg-rose-50/20'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left: Bank statement transaction */}
              <div className="lg:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>EXTRATO BANCÁRIO (OFX)</span>
                  <span>{new Date(pair.bankTx.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs">{pair.bankTx.description}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      pair.bankTx.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pair.bankTx.type === 'CREDIT' ? 'CRÉDITO' : 'DÉBITO'}
                  </span>
                  <span
                    className={`font-mono font-black text-sm ${
                      pair.bankTx.type === 'CREDIT' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {fmt(pair.bankTx.amount)}
                  </span>
                </div>
              </div>

              {/* Middle: Match indicator */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-1">
                {pair.status === 'CONFIRMED' ? (
                  <div className="flex flex-col items-center">
                    <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 mt-1">CONCILIADO</span>
                  </div>
                ) : pair.status === 'MATCHED' ? (
                  <div className="flex flex-col items-center">
                    <span className="p-1.5 bg-blue-100 text-blue-700 rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 mt-1">100% MATCH</span>
                  </div>
                ) : pair.status === 'DIVERGENT' ? (
                  <div className="flex flex-col items-center">
                    <span className="p-1.5 bg-amber-100 text-amber-700 rounded-full">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 mt-1">92% PARCIAL</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="p-1.5 bg-rose-100 text-rose-700 rounded-full">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 mt-1">NÃO ENCONTRADO</span>
                  </div>
                )}
              </div>

              {/* Right: ERP record */}
              <div className="lg:col-span-5">
                {pair.erpItem ? (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>TÍTULO KEEPER ERP</span>
                      <span>Venc: {new Date(pair.erpItem.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">
                      {pair.erpItem.titleNumber} - {pair.erpItem.partyName}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Doc: {pair.erpItem.docNumber}</span>
                      <span className="font-mono font-black text-sm text-slate-900">
                        {fmt(pair.erpItem.amount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-300 p-3 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-700">Lançamento ausente no ERP</div>
                      <div className="text-[11px] text-slate-500">Tarifa bancária direta sem provisão prévia</div>
                    </div>
                    <button
                      onClick={() => {
                        setActionFeedback('Despesa de tarifas bancárias gerada e contabilizada automaticamente!');
                        setTimeout(() => setActionFeedback(null), 2500);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition-colors shadow-2xs"
                    >
                      + Criar Despesa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: Divergence warning or Action confirm */}
            {pair.divergenceNotes && (
              <div className="mt-2 text-[11px] bg-amber-50 text-amber-800 p-2 rounded border border-amber-200 flex items-center justify-between">
                <span>{pair.divergenceNotes}</span>
                <button
                  onClick={() => handleConfirmMatch(pair.id)}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px]"
                >
                  Aceitar com Rateio de Juros
                </button>
              </div>
            )}

            {pair.status === 'MATCHED' && (
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleConfirmMatch(pair.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Confirmar Conciliação 1:1</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
