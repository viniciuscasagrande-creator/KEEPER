import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, Plus, Calendar, ShieldCheck, Trash2 } from 'lucide-react';

interface EventFeeRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
  onSaveRule?: (rule: any) => void;
}

export function EventFeeRulesModal({
  isOpen,
  onClose,
  event,
  onSaveRule,
}: EventFeeRulesModalProps) {
  const [feeName, setFeeName] = useState('Spread Financeiro');
  const [calculationType, setCalculationType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [rate, setRate] = useState('2.50');
  const [fixedAmount, setFixedAmount] = useState('2.00');
  const [payer, setPayer] = useState<'CLIENTE' | 'PRODUTOR' | 'COMPARTILHADO' | 'DISKINGRESSOS'>('PRODUTOR');
  const [basisType, setBasisType] = useState('VALOR_BRUTO_VENDA');
  const [validFrom, setValidFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [validTo, setValidTo] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const currentRules = event.eventFeeRules || [
    {
      id: 'rule-01',
      feeName: 'Taxa DiskIngressos',
      calculationType: 'PERCENTAGE',
      rate: 10.0,
      fixedAmount: 0.0,
      payer: 'CLIENTE',
      basisType: 'VALOR_DO_INGRESSO',
      validFrom: '2026-08-01',
      validTo: null,
      isActive: true,
    },
    {
      id: 'rule-02',
      feeName: 'Spread',
      calculationType: 'FIXED_AMOUNT',
      rate: 0.0,
      fixedAmount: 2.0,
      payer: 'PRODUTOR',
      basisType: 'POR_INGRESSO',
      validFrom: '2026-10-01',
      validTo: '2026-10-31',
      isActive: true,
    },
    {
      id: 'rule-03',
      feeName: 'Advance',
      calculationType: 'PERCENTAGE',
      rate: 1.5,
      fixedAmount: 0.0,
      payer: 'PRODUTOR',
      basisType: 'VALOR_ANTECIPADO',
      validFrom: '2026-09-01',
      validTo: null,
      isActive: true,
    },
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `rule-${Date.now()}`,
      feeName,
      calculationType,
      rate: calculationType === 'PERCENTAGE' ? parseFloat(rate) : 0,
      fixedAmount: calculationType === 'FIXED_AMOUNT' ? parseFloat(fixedAmount) : 0,
      payer,
      basisType,
      validFrom,
      validTo: validTo || null,
      isActive: true,
    };

    setFeedback(`Regra '${feeName}' adicionada para o evento ${event.name}! Vendas anteriores congeladas.`);
    if (onSaveRule) onSaveRule(newRule);

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Regras de Liquidação do Evento: {event.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                Configuração financeira exclusiva deste evento com vigência temporal
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="my-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Existing Event Rules Cards */}
        <div className="my-4 space-y-2.5">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>Taxas Atualmente em Vigor para este Evento:</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Snapshot congelado nas vendas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentRules.map((r: any) => (
              <div
                key={r.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{r.feeName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Ativa" />
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-semibold text-slate-800">
                      {r.calculationType === 'PERCENTAGE' ? 'Percentual' : 'Valor Fixo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {r.calculationType === 'PERCENTAGE' ? `${r.rate}%` : `R$ ${Number(r.fixedAmount).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagador:</span>
                    <span className="font-semibold text-slate-800">{r.payer}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Vigência: {r.validFrom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Fee Rule Form */}
        <form onSubmit={handleAddRule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Adicionar / Ajustar Taxa com Vigência de Datas</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome da Taxa *</label>
              <input
                type="text"
                value={feeName}
                onChange={(e) => setFeeName(e.target.value)}
                placeholder="Ex: Spread, Advance, Ribeit..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Cálculo *</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="PERCENTAGE">Percentual (%)</option>
                <option value="FIXED_AMOUNT">Valor Fixo (R$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {calculationType === 'PERCENTAGE' ? 'Alíquota (%) *' : 'Valor Fixo (R$) *'}
              </label>
              <input
                type="text"
                value={calculationType === 'PERCENTAGE' ? rate : fixedAmount}
                onChange={(e) =>
                  calculationType === 'PERCENTAGE' ? setRate(e.target.value) : setFixedAmount(e.target.value)
                }
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quem Paga? *</label>
              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="CLIENTE">Cliente</option>
                <option value="PRODUTOR">Produtor</option>
                <option value="COMPARTILHADO">Compartilhado</option>
                <option value="DISKINGRESSOS">DiskIngressos</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Base de Cálculo *</label>
              <select
                value={basisType}
                onChange={(e) => setBasisType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="VALOR_DO_INGRESSO">Por Ingresso</option>
                <option value="VALOR_BRUTO_VENDA">Por Pedido / Total Bruto</option>
                <option value="QUANTIDADE_INGRESSOS">Por Quantidade de Ingressos</option>
                <option value="POR_LOTE">Por Lote Promocional</option>
                <option value="POR_SETOR">Por Setor (VIP/Pista)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vigência Início *</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vigência Término</label>
              <input
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Imutabilidade garantida: vendas passadas não sofrem recálculo
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition-colors"
            >
              Gravar Regra no Evento
            </button>
          </div>
        </form>

        <div className="flex justify-end pt-3 border-t border-slate-200 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
