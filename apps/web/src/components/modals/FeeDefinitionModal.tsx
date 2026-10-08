import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, DollarSign, Percent, ShieldCheck } from 'lucide-react';

interface FeeDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (fee: any) => void;
}

export function FeeDefinitionModal({ isOpen, onClose, onSave }: FeeDefinitionModalProps) {
  const [name, setName] = useState('Spread Financeiro');
  const [calculationType, setCalculationType] = useState('PERCENTAGE');
  const [rate, setRate] = useState('2.50');
  const [fixedAmount, setFixedAmount] = useState('0.00');
  const [basisType, setBasisType] = useState('VALOR_BRUTO_VENDA');
  const [payer, setPayer] = useState<'CLIENTE' | 'PRODUTOR' | 'COMPARTILHADO' | 'DISKINGRESSOS'>('CLIENTE');
  const [destination, setDestination] = useState('RECEITA_DISKINGRESSOS');
  const [channel, setChannel] = useState<'ONLINE' | 'BILHETERIA' | 'AMBOS'>('AMBOS');
  const [chargeMoment, setChargeMoment] = useState('NA_VENDA');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFee = {
      name,
      calculationType,
      rate: parseFloat(rate),
      fixedAmount: parseFloat(fixedAmount),
      basisType,
      payer,
      destination,
      channel,
      chargeMoment,
      isActive: true,
    };

    setSuccessNotice(`Taxa '${name}' parametrizada com sucesso no motor de liquidação!`);
    if (onSave) onSave(newFee);

    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Cadastro de Taxas Financeiras</h3>
              <p className="text-[11px] text-slate-400">Parametrização flexível para o Motor de Liquidação</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successNotice && (
          <div className="my-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-4 space-y-3.5">
          {/* Nome da Taxa */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome da Taxa *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Spread, Advance, Ribeit, Taxa de Conveniência..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Como calcula? */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Como calcula? *</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="PERCENTAGE">Percentual (%)</option>
                <option value="FIXED_AMOUNT">Valor Fixo (R$)</option>
                <option value="HYBRID">Percentual + Valor Fixo</option>
                <option value="PER_TICKET">Por Ingresso</option>
                <option value="PER_ORDER">Por Pedido</option>
                <option value="PER_EVENT">Por Evento</option>
              </select>
            </div>

            {/* Valor / Alíquota */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {calculationType === 'PERCENTAGE' ? 'Alíquota (%) *' : 'Valor (R$) *'}
              </label>
              <input
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Sobre qual valor incide? */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Incide sobre qual valor? *</label>
            <select
              value={basisType}
              onChange={(e) => setBasisType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              <option value="VALOR_DO_INGRESSO">Valor Nominal do Ingresso</option>
              <option value="VALOR_BRUTO_VENDA">Valor Bruto da Venda (Total do Pedido)</option>
              <option value="VALOR_LIQUIDO">Valor Líquido</option>
              <option value="SUBTOTAL_PEDIDO">Subtotal do Pedido</option>
              <option value="VALOR_EVENTO">Valor Total do Evento</option>
            </select>
          </div>

          {/* Quem paga? */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Quem paga? *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['CLIENTE', 'PRODUTOR', 'COMPARTILHADO', 'DISKINGRESSOS'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPayer(p)}
                  className={`py-2 px-2 text-center rounded-lg border font-bold transition-all ${
                    payer === p
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p === 'CLIENTE' ? 'Cliente' : p === 'PRODUTOR' ? 'Produtor' : p === 'COMPARTILHADO' ? 'Compartilhado' : 'DiskIngressos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Destino dos Recursos */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Destino Financeiro *</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="RECEITA_DISKINGRESSOS">Receita DiskIngressos</option>
                <option value="FUNDO_RESERVA">Fundo de Reserva / Escrow</option>
                <option value="CUSTO_GATEWAY">Custo Gateway / Adquirente</option>
                <option value="REPASSE_PARCEIRO">Repasse a Parceiro Local</option>
              </select>
            </div>

            {/* Quando cobra? */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quando cobra? *</label>
              <select
                value={chargeMoment}
                onChange={(e) => setChargeMoment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                <option value="NA_VENDA">Na Venda (Direto no Checkout)</option>
                <option value="NA_LIQUIDACAO">Na Liquidação</option>
                <option value="NO_REPASSE">No Repasse ao Produtor</option>
                <option value="NO_FECHAMENTO">No Fechamento do Evento</option>
                <option value="NA_ANTECIPACAO">Na Antecipação de Recebíveis</option>
              </select>
            </div>
          </div>

          {/* Aplicação (Canal) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Aplicação de Canal *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="channel"
                  checked={channel === 'ONLINE'}
                  onChange={() => setChannel('ONLINE')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Online (Site / App)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="channel"
                  checked={channel === 'BILHETERIA'}
                  onChange={() => setChannel('BILHETERIA')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Bilheteria Física (PDV)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="channel"
                  checked={channel === 'AMBOS'}
                  onChange={() => setChannel('AMBOS')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Ambos</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Ativar e Salvar Regra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
