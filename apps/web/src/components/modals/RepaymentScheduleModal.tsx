import React, { useState } from 'react';
import { X, Building2, CheckCircle2, DollarSign, Send, AlertTriangle, AlertCircle, Percent, Lock } from 'lucide-react';

interface RepaymentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any | null;
  onRepaymentCreated?: (schedule: any) => void;
}

export function RepaymentScheduleModal({
  isOpen,
  onClose,
  wallet,
  onRepaymentCreated,
}: RepaymentScheduleModalProps) {
  const [amount, setAmount] = useState('30000,00');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'TED'>('PIX');
  const [pixKey, setPixKey] = useState('financeiro@produtora.com.br');
  const [bank, setBank] = useState('Itaú Unibanco S.A. (Bco 341)');
  const [agencyAccount, setAgencyAccount] = useState('Ag. 0422 / CC 88120-1');
  const [repaymentType, setRepaymentType] = useState('NORMAL'); // NORMAL, EXCEPTIONAL
  const [notes, setNotes] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('Vinicius Casagrande (Diretoria)');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !wallet) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // Regra de Repasse (Marco 50% / Liberação 20%)
  const accumulatedSales = Number(wallet.vendasBrutas || wallet.grossSales || 200000.0);
  const targetSales = Number(wallet.salesTargetAmount || 200000.0);
  const minMilestonePct = Number(wallet.minSalesMilestonePct || 50.0);
  const maxReleasePct = Number(wallet.maxReleasePct || 20.0);

  const milestoneAmount = (targetSales * minMilestonePct) / 100;
  const isMilestoneReached = accumulatedSales >= milestoneAmount;
  const milestoneProgressPct = Math.min(100, Math.round((accumulatedSales / milestoneAmount) * 100));
  const shortfallAmount = Math.max(0, milestoneAmount - accumulatedSales);

  const grossRepaymentLimit = isMilestoneReached ? (accumulatedSales * maxReleasePct) / 100 : 0.0;
  const alreadyRepaid = Number((wallet.repaymentsPaidTotal || 0) + (wallet.repaymentsScheduledTotal || 0));
  const availableForRepayment = Math.max(0, grossRepaymentLimit - alreadyRepaid);
  const walletAvailable = Number(wallet.disponivel !== undefined ? wallet.disponivel : (wallet.balanceAvailable || 148000.0));
  
  // Saldo real disponível para este repasse considerando o menor entre a trava da regra e a carteira
  const maxAllowedRepayment = Math.min(walletAvailable, availableForRepayment);

  const numRequested = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
  const isOverLimit = numRequested > maxAllowedRepayment;

  const handleSubmit = (e: React.FormEvent, executeNow = false) => {
    e.preventDefault();
    if (!numRequested || numRequested <= 0) return;

    if (!isMilestoneReached && repaymentType !== 'EXCEPTIONAL') {
      alert(`⚠️ Repasse bloqueado: O evento ainda não atingiu o marco de ${minMilestonePct}% das vendas acumuladas. Faltam ${fmt(shortfallAmount)} em vendas.`);
      return;
    }

    if (isOverLimit && repaymentType !== 'EXCEPTIONAL') {
      alert(`⚠️ Saldo insuficiente para este repasse: O valor solicitado (${fmt(numRequested)}) excede o saldo liberado pela regra de 20% (${fmt(maxAllowedRepayment)}).`);
      return;
    }

    const newSchedule = {
      id: `sch-${Date.now()}`,
      walletId: wallet.id || wallet.eventId,
      eventName: wallet.name || wallet.eventName,
      producerName: wallet.producerName || 'Produtor',
      scheduleNumber: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      scheduledDate,
      amount: numRequested,
      status: executeNow ? 'PAID' : 'SCHEDULED',
      paymentMethod,
      repaymentType,
      destinationBank: bank,
      destinationAccount: agencyAccount,
      destinationPixKey: pixKey,
      notes,
      authorizedBy,
    };

    setFeedback(
      executeNow
        ? `Repasse de R$ ${numRequested.toFixed(2)} liquidado via PIX com débito na Conta de Liquidação!`
        : `Repasse de R$ ${numRequested.toFixed(2)} agendado com sucesso para ${scheduledDate}!`
    );

    if (onRepaymentCreated) onRepaymentCreated(newSchedule);

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-2xs">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">NOVO REPASSE</h3>
              <p className="text-[11px] text-slate-400">
                Produtor: <strong className="text-slate-700">{wallet.producerName || 'ABC Produções'}</strong> · Evento: <strong className="text-slate-700">{wallet.name || wallet.eventName}</strong>
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

        {/* Card da Regra de Liberação (Marco 50% / Limite 20%) */}
        <div className="my-3 p-3.5 bg-slate-900 text-white rounded-xl space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-blue-400" />
              Regra de Repasse: Marco {minMilestonePct}% / Limite {maxReleasePct}%
            </span>
            {isMilestoneReached ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3" /> MARCO ATINGIDO
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <AlertTriangle className="w-3 h-3" /> NÃO LIBERADO
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Vendas Acumuladas:</span>
              <div className="font-mono font-bold text-white text-xs">{fmt(accumulatedSales)}</div>
            </div>
            <div>
              <span className="text-slate-400">Marco Mínimo ({minMilestonePct}%):</span>
              <div className="font-mono font-bold text-amber-300 text-xs">{fmt(milestoneAmount)}</div>
            </div>
            <div>
              <span className="text-slate-400">Limite 20% das Vendas:</span>
              <div className="font-mono font-bold text-blue-300 text-xs">{fmt(grossRepaymentLimit)}</div>
            </div>
            <div>
              <span className="text-slate-400">Já Repassado:</span>
              <div className="font-mono font-bold text-rose-300 text-xs">{fmt(alreadyRepaid)}</div>
            </div>
          </div>

          {/* Barra de Progresso de Elegibilidade */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Progresso do Marco ({milestoneProgressPct}%)</span>
              <span>{isMilestoneReached ? '100% atingido' : `Faltam ${fmt(shortfallAmount)}`}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isMilestoneReached ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${milestoneProgressPct}%` }}
              ></div>
            </div>
          </div>

          <div className="p-2 bg-slate-800/80 rounded-lg flex items-center justify-between pt-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Saldo Disponível para este Repasse:</span>
              <div className="text-base font-black text-emerald-400 font-mono">
                {fmt(maxAllowedRepayment)}
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <div>Saldo Carteira: {fmt(walletAvailable)}</div>
              <div>Limite Restante: {fmt(availableForRepayment)}</div>
            </div>
          </div>
        </div>

        {/* Alerta de Validação da Regra */}
        {isOverLimit && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-bold text-xs flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              ⚠️ Saldo insuficiente para este repasse. Valor solicitado ({fmt(numRequested)}) excede o limite disponível para repasse ({fmt(maxAllowedRepayment)}).
            </span>
          </div>
        )}

        {!isMilestoneReached && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-bold text-xs flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              🔴 Repasse ainda não liberado: O evento atingiu apenas {milestoneProgressPct}% do marco mínimo de vendas. Faltam {fmt(shortfallAmount)} em vendas.
            </span>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valor do Repasse (R$) *</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-slate-800 font-mono font-bold ${
                  isOverLimit ? 'border-rose-400 text-rose-700 bg-rose-50/30' : 'border-slate-300'
                }`}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data Prevista *</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Repasse *</label>
              <select
                value={repaymentType}
                onChange={(e) => setRepaymentType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="NORMAL">Repasse normal (Regra 50%/20%)</option>
                <option value="EXCEPTIONAL">Repasse excepcional (Alçada Diretoria)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Conta Bancária de Destino *</label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === 'PIX'}
                  onChange={() => setPaymentMethod('PIX')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>PIX Instantâneo</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === 'TED'}
                  onChange={() => setPaymentMethod('TED')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>TED Bancária</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'PIX' ? (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chave PIX do Produtor *</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Agência / Conta Corrente *</label>
              <input
                type="text"
                value={agencyAccount}
                onChange={(e) => setAgencyAccount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Observações Operacionais</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Repasse parcial lote 1 autorizado conforme cronograma contratual..."
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isOverLimit && repaymentType !== 'EXCEPTIONAL'}
              className={`px-4 py-2 font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5 ${
                isOverLimit && repaymentType !== 'EXCEPTIONAL'
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>PROGRAMAR REPASSE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
