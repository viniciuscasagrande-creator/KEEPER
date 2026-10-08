import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, DollarSign, Calculator, Lock } from 'lucide-react';
import { api } from '../../services/api';

interface EventCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  selectedEventId?: string;
}

export function EventCancellationModal({
  isOpen,
  onClose,
  onSuccess,
  selectedEventId = 'ev-01',
}: EventCancellationModalProps) {
  const [eventId, setEventId] = useState(selectedEventId);
  const [reason, setReason] = useState('Cancelamento por força maior (interdição judicial da estrutura do local)');
  const [refundPolicy, setRefundPolicy] = useState('INTEGRAL_WITH_FEES');
  const [recompositionNotes, setRecompositionNotes] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<any>({
    eventName: 'Festival Rock Retrô 2026',
    producerName: 'ABC Produções & Eventos Ltda',
    totalSales: 200000.0,
    totalRefundRequired: 200000.0,
    obligationsPaidTotal: 40000.0,
    repaymentsPaidTotal: 50000.0,
    committedTotal: 90000.0,
    fundsAvailableAtCancellation: 110000.0,
    shortfallAmount: 90000.0,
    coveragePct: 55.0,
    shortfallPct: 45.0,
    totalTickets: 1850,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setErrorMsg(null);
    try {
      const res = await api.simulateEventCancellation(eventId);
      if (res) {
        setSimulation(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao simular cancelamento.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleConfirmCancellation = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        eventId,
        reason,
        refundPolicy,
        recompositionNotes,
      };
      const res = await api.registerEventCancellation(payload);
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar cancelamento do evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ShieldAlert className="w-6 h-6 text-rose-300" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Dossiê de Cancelamento de Evento</h3>
                <p className="text-xs text-rose-200 font-medium">
                  Cálculo de Cobertura Financeira · Insuficiência de Caixa · Trava de Repasses
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

        <div className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Evento & Motivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Evento Afetado
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="ev-01">Festival Rock Retrô 2026 (ABC Produções)</option>
                <option value="ev-02">Stand Up Comedy VIP Especial (ABC Produções)</option>
                <option value="ev-03">Show Acústico MPB Curitiba (CWB Brasil)</option>
                <option value="ev-101">Festival de Primavera 2026 (Opus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Política de Devolução aos Compradores
              </label>
              <select
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="INTEGRAL_WITH_FEES">Restituição Integral (Ingresso + Taxas de Serviço)</option>
                <option value="TICKET_ONLY">Restituição do Ingresso (Sem devolução de taxas)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Motivo Formal do Cancelamento (Justificativa Pública / Contratual)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              placeholder="Descreva o motivo formal do cancelamento..."
            />
          </div>

          {/* SIMULAÇÃO DE COBERTURA FINANCEIRA (O CASO CRÍTICO) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Apuração de Cobertura Financeira (Conta de Liquidação Disk)
                </h4>
              </div>
              <button
                type="button"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                {isSimulating ? 'Recalculando...' : 'Recalcular Índices'}
              </button>
            </div>

            {/* 4 Cards da Simulação */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total a Devolver</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{fmt(simulation.totalRefundRequired)}</p>
                <span className="text-[10px] text-slate-500">{simulation.totalTickets} ingressos</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Recursos Disponíveis</span>
                <p className="text-base font-black text-emerald-600 mt-0.5">
                  {fmt(simulation.fundsAvailableAtCancellation)}
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold">Conta Custódia</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Valor já Comprometido</span>
                <p className="text-base font-black text-amber-600 mt-0.5">{fmt(simulation.committedTotal)}</p>
                <span className="text-[10px] text-amber-700">Teatro R$ 40k + Repasse R$ 50k</span>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-rose-300 bg-rose-50/50 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Insuficiência
                </span>
                <p className="text-base font-black text-rose-700 mt-0.5">{fmt(simulation.shortfallAmount)}</p>
                <span className="text-[10px] text-rose-600 font-bold">Déficit a Recompor</span>
              </div>
            </div>

            {/* BARRA DE COBERTURA FINANCEIRA (55% / 45%) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Cobertura Financeira Garantida: {simulation.coveragePct}% ({fmt(simulation.fundsAvailableAtCancellation)})
                </span>
                <span className="text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Insuficiência de Caixa: {simulation.shortfallPct}% ({fmt(simulation.shortfallAmount)})
                </span>
              </div>

              <div className="w-full h-4 bg-rose-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${simulation.coveragePct}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white"
                >
                  {simulation.coveragePct}%
                </div>
                <div
                  style={{ width: `${simulation.shortfallPct}%` }}
                  className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-black text-white"
                >
                  {simulation.shortfallPct}%
                </div>
              </div>
            </div>

            {/* CONTROLES E TRAVAS ATIVADAS AUTOMATICAMENTE */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                Travas de Governança Aplicadas Imediatamente:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2 font-bold">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Bloqueio de Repasses: ATIVO</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Conciliação por Venda: EXIGIDA</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Recomposição Produtor: R$ 90.000</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Plano de Recomposição de Déficit Acordado com o Produtor
            </label>
            <input
              type="text"
              value={recompositionNotes}
              onChange={(e) => setRecompositionNotes(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              placeholder="Ex: Produtor comprometeu-se a realizar aporte via Pix Escrow de R$ 90.000,00 até 20/10..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            A confirmação congelará a carteira do evento e gerará o dossiê formal de devoluções.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmCancellation}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Confirmar Cancelamento & Travar Repasses'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
