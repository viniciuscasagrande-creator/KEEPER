import React, { useState } from 'react';
import { X, Handshake, AlertTriangle, Calendar, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

interface RecompositionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  cancellationId: string;
  shortfallAmount?: number;
  producerName?: string;
}

export function RecompositionPlanModal({
  isOpen,
  onClose,
  onSuccess,
  cancellationId,
  shortfallAmount = 90000.0,
  producerName = 'ABC Produções & Eventos Ltda',
}: RecompositionPlanModalProps) {
  const [expectedAmount, setExpectedAmount] = useState(
    shortfallAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  );
  const [depositDueDate, setDepositDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [terms, setTerms] = useState(
    'Aporte integral de R$ 90.000,00 via PIX Escrow na Conta de Liquidação DiskIngressos para custear devoluções aos clientes.'
  );
  const [guaranteeType, setGuaranteeType] = useState('PROMISSORY_NOTE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const num = parseFloat(expectedAmount.replace(/\./g, '').replace(',', '.'));
      const payload = {
        terms,
        expectedAmount: isNaN(num) ? shortfallAmount : num,
        depositDueDate,
        guaranteeType,
        notes: `Acordo formal de recomposição assinado com ${producerName}.`,
      };
      const res = await api.saveRecompositionPlan(cancellationId, payload);
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao registrar plano de recomposição.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Handshake className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Plano de Recomposição de Déficit</h3>
                <p className="text-xs text-amber-200 font-medium">
                  {producerName} · Cobertura da Insuficiência de Devolução
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Déficit Contratual Apurado: R$ {shortfallAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-amber-800">
              O evento foi cancelado e a conta de custódia possui saldo insuficiente para devolver 100% dos ingressos
              devido a despesas e repasses antecipados já liberados. O produtor deve recompor o valor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Valor do Aporte Acordado (R$)
              </label>
              <input
                type="text"
                required
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
                className="w-full text-xs font-black bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Data Limite de Depósito
              </label>
              <input
                type="date"
                required
                value={depositDueDate}
                onChange={(e) => setDepositDueDate(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Garantia / Instrumento Jurídico
            </label>
            <select
              value={guaranteeType}
              onChange={(e) => setGuaranteeType(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="PROMISSORY_NOTE">Nota Promissória com Avalistas Pessoais</option>
              <option value="BANK_DEPOSIT">Depósito em Conta Escrow da Disk</option>
              <option value="FUTURE_EVENTS_RETENTION">Retenção de 100% de Próximos Eventos do Produtor</option>
              <option value="BANK_GUARANTEE">Fiança Bancária ou Seguro Garantia</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Termos e Cláusulas do Acordo
            </label>
            <textarea
              rows={3}
              required
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Pactuando...' : 'Pactuar Recomposição com Produtor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
