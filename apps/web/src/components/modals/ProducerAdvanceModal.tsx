import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

interface ProducerAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  producer: any | null;
  event: any | null;
  onAdvanceSubmitted?: (advance: any) => void;
}

export function ProducerAdvanceModal({
  isOpen,
  onClose,
  producer,
  event,
  onAdvanceSubmitted,
}: ProducerAdvanceModalProps) {
  const [requestedAmount, setRequestedAmount] = useState('100000,00');
  const [advanceFeeRate, setAdvanceFeeRate] = useState('2.50');
  const [safetyMarginPct, setSafetyMarginPct] = useState('25.0');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pixKey, setPixKey] = useState(producer?.pixKey || 'financeiro@abcproducoes.com.br');
  const [bankAccount, setBankAccount] = useState(
    producer?.bankName ? `${producer.bankName} Ag. ${producer.agency} / CC ${producer.account}` : 'Itaú Ag. 0422 / CC 88120-1'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !producer) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const eligibleFutureBalance = event ? (event.vendasBrutas ? event.vendasBrutas * 0.5 : 250000.0) : 350000.0;
  const numRequested = parseFloat(requestedAmount.replace(/\./g, '').replace(',', '.')) || 0;
  const rate = parseFloat(advanceFeeRate) || 2.5;
  const safetyRate = parseFloat(safetyMarginPct) || 25.0;

  const safetyReserve = (numRequested * safetyRate) / 100;
  const feeCost = (numRequested * rate) / 100;
  const netAmount = Math.max(0, numRequested - feeCost - safetyReserve);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numRequested <= 0) return;

    if (numRequested > eligibleFutureBalance) {
      alert(`Valor solicitado excede o saldo futuro elegível (${fmt(eligibleFutureBalance)}).`);
      return;
    }

    const advance = {
      id: `adv-${Date.now()}`,
      producerId: producer.id,
      producerName: producer.name,
      eventId: event?.id || 'ev-101',
      eventName: event?.name || 'Festival XYZ',
      advanceNumber: `ANT-${Math.floor(10000 + Math.random() * 90000)}`,
      requestedAmount: numRequested,
      advanceFeeRate: rate,
      advanceFeeCost: feeCost,
      netAmount,
      status: 'UNDER_ANALYSIS',
      requestedDate: new Date().toISOString().split('T')[0],
      targetDate,
      pixKey,
    };

    setFeedback(
      `Operação de antecipação criada com sucesso! Valor Líquido: ${fmt(netAmount)}. Enviada para aprovação da diretoria.`
    );
    if (onAdvanceSubmitted) onAdvanceSubmitted(advance);

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-600 text-white">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Operação de Antecipação de Recebíveis
              </h3>
              <p className="text-[11px] text-slate-400">
                Adiantamento sobre saldo futuro elegível do evento
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

        {/* Producer & Event Context Strip */}
        <div className="my-3 p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
          <div className="flex justify-between items-center text-purple-950 font-bold">
            <span>Produtor: {producer.tradeName || producer.name}</span>
            <span className="text-[10px] bg-purple-200/80 px-2 py-0.5 rounded font-mono">
              {producer.code || 'PROD-001'}
            </span>
          </div>
          <div className="text-[11px] text-purple-800 mt-1">
            Evento: <strong>{event?.name || 'Festival XYZ'}</strong>
          </div>
          <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-purple-200/60 font-medium">
            <span className="text-purple-700">Saldo Futuro Elegível:</span>
            <span className="font-mono font-black text-purple-950 text-sm">
              {fmt(eligibleFutureBalance)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valor Solicitado (R$) *</label>
              <input
                type="text"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Taxa Antecipação (%) *</label>
              <input
                type="text"
                value={advanceFeeRate}
                onChange={(e) => setAdvanceFeeRate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Margem Segurança (%) *</label>
              <input
                type="text"
                value={safetyMarginPct}
                onChange={(e) => setSafetyMarginPct(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold text-purple-700"
                title="Margem retida para cobertura de eventuais estornos ou cancelamentos"
                required
              />
            </div>
          </div>

          {/* Real-time Calculation Box */}
          <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 font-mono">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Valor Bruto Solicitado:</span>
              <span className="text-slate-200">{fmt(numRequested)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-rose-400">
              <span>(-) Taxa de Antecipação ({rate}%):</span>
              <span>- {fmt(feeCost)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-purple-400">
              <span>(-) Margem Fiduciária de Segurança ({safetyRate}%):</span>
              <span>- {fmt(safetyReserve)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-slate-800">
              <span className="text-amber-400 font-sans">Valor Líquido a Liberar no PIX:</span>
              <span className="text-emerald-400 text-base">{fmt(netAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data Prevista *</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chave PIX Produtor *</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Conta Bancária de Destino</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
            />
          </div>

          {/* Workflow approval preview */}
          <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800">Esteira de Alçadas:</span> Solicitada → Em Análise → Aprovada → Agendada → Paga via PIX.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Solicitar Antecipação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
