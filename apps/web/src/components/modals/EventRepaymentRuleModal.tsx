import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, Calendar, DollarSign, Percent } from 'lucide-react';

interface EventRepaymentRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
  onSaveRule?: (rule: any) => void;
}

export function EventRepaymentRuleModal({
  isOpen,
  onClose,
  event,
  onSaveRule,
}: EventRepaymentRuleModalProps) {
  const [isActive, setIsActive] = useState(true);
  const [minSalesMilestonePct, setMinSalesMilestonePct] = useState('50.00');
  const [maxReleasePct, setMaxReleasePct] = useState('20.00');
  const [calculationBasis, setCalculationBasis] = useState('ACCUMULATED_SALES');
  const [salesTargetAmount, setSalesTargetAmount] = useState('200000.00');
  const [allowPartial, setAllowPartial] = useState(true);
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [validFrom, setValidFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [validTo, setValidTo] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !event) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const numMilestone = parseFloat(minSalesMilestonePct) || 50;
  const numRelease = parseFloat(maxReleasePct) || 20;
  const numTarget = parseFloat(salesTargetAmount.replace(/\./g, '').replace(',', '.')) || 200000;

  const milestoneValuePreview = (numTarget * numMilestone) / 100;
  const maxReleaseValuePreview = (numTarget * numRelease) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rule = {
      id: `repay-rule-${Date.now()}`,
      eventId: event.id,
      eventName: event.name,
      isActive,
      minSalesMilestonePct: numMilestone,
      maxReleasePct: numRelease,
      salesTargetAmount: numTarget,
      calculationBasis,
      allowPartial,
      allowMultiple,
      requiresApproval,
      validFrom,
      validTo: validTo || null,
    };

    setFeedback(`Regra de Repasse (${numMilestone}% marco / ${numRelease}% liberação) salva com sucesso para o evento ${event.name}!`);

    if (onSaveRule) onSaveRule(rule);

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-2xs">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Parametrização da Regra de Repasse do Evento
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">{event.name}</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Checkbox Ativa */}
          <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
            <div>
              <span className="font-bold text-slate-800">Ativar Regra de Repasse por Marco</span>
              <p className="text-[11px] text-slate-500">
                Exige marco mínimo de vendas para liberar percentual de repasse
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Marco Mínimo e Percentual Liberável */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Marco Mínimo de Vendas (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={minSalesMilestonePct}
                  onChange={(e) => setMinSalesMilestonePct(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                  required
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400">Padrão da empresa: 50,00%</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Limite Liberável (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={maxReleasePct}
                  onChange={(e) => setMaxReleasePct(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                  required
                />
                <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400">Padrão da empresa: 20,00%</span>
            </div>
          </div>

          {/* Base e Meta de Vendas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Forma de Cálculo *</label>
              <select
                value={calculationBasis}
                onChange={(e) => setCalculationBasis(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="ACCUMULATED_SALES">Sobre Vendas Acumuladas</option>
                <option value="TARGET_SALES">Sobre Meta de Vendas</option>
                <option value="TICKETS_SOLD">Por Quantidade de Ingressos</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Meta de Vendas Prevista (R$)
              </label>
              <input
                type="text"
                value={salesTargetAmount}
                onChange={(e) => setSalesTargetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
              />
            </div>
          </div>

          {/* Live Simulation Card */}
          <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Simulação da Regra para Este Evento
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 text-[11px]">Marco de Ativação ({numMilestone}%):</span>
                <div className="font-mono font-black text-amber-300 text-sm">
                  {fmt(milestoneValuePreview)}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Limite Liberado ({numRelease}%):</span>
                <div className="font-mono font-black text-emerald-400 text-sm">
                  {fmt(maxReleaseValuePreview)}
                </div>
              </div>
            </div>
          </div>

          {/* Opções de Governança */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={allowPartial}
                onChange={(e) => setAllowPartial(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Permitir repasse parcial (valores inferiores ao limite liberado)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Permitir múltiplos repasses até esgotar o limite liberado</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Necessita aprovação da Diretoria / Alçada Financeira</span>
            </label>
          </div>

          {/* Vigência */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vigência Inicial *</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vigência Final (Opcional)</label>
              <input
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Salvar Regra de Repasse</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
