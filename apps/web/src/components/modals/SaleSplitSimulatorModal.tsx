import React, { useState } from 'react';
import { X, Sparkles, DollarSign, ArrowRight, CheckCircle2, Building2, User } from 'lucide-react';
import { api } from '../../services/api';

interface SaleSplitSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaleSplitSimulatorModal({ isOpen, onClose }: SaleSplitSimulatorModalProps) {
  const [ticketAmount, setTicketAmount] = useState('200.00');
  const [diskFeeRate, setDiskFeeRate] = useState('10.0');
  const [spreadRate, setSpreadRate] = useState('2.5');
  const [spreadPayer, setSpreadPayer] = useState<'CUSTOMER' | 'PRODUCER'>('CUSTOMER');
  const [advanceRate, setAdvanceRate] = useState('0.0');

  if (!isOpen) return null;

  const ticket = parseFloat(ticketAmount) || 200.0;
  const diskRate = parseFloat(diskFeeRate) || 10.0;
  const sRate = parseFloat(spreadRate) || 2.5;
  const advRate = parseFloat(advanceRate) || 0.0;

  const diskFee = (ticket * diskRate) / 100;
  const spreadFee = (ticket * sRate) / 100;
  const advanceFee = (ticket * advRate) / 100;

  let totalCustomerPaid = ticket + diskFee;
  let netProducer = ticket;

  if (spreadPayer === 'CUSTOMER') {
    totalCustomerPaid += spreadFee;
  } else {
    netProducer -= spreadFee;
  }

  if (advanceFee > 0) {
    netProducer -= advanceFee;
  }

  const diskRevenue = diskFee + spreadFee + advanceFee;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Simulador do Motor de Liquidação (Split da Venda)
              </h3>
              <p className="text-[11px] text-slate-400">
                Venda ≠ Financeiro ≠ Repasse — Teste das regras de destinação
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Valor do Ingresso (R$)</label>
            <input
              type="text"
              value={ticketAmount}
              onChange={(e) => setTicketAmount(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Taxa Disk (%)</label>
            <input
              type="text"
              value={diskFeeRate}
              onChange={(e) => setDiskFeeRate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Spread (%)</label>
            <input
              type="text"
              value={spreadRate}
              onChange={(e) => setSpreadRate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Advance (%)</label>
            <input
              type="text"
              value={advanceRate}
              onChange={(e) => setAdvanceRate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
            />
          </div>
        </div>

        {/* Spread Payer Switch */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-bold text-blue-900">Quem é o pagador do Spread?</div>
            <div className="text-[11px] text-blue-700">Altere para simular os 2 cenários de negócio</div>
          </div>
          <div className="flex bg-white p-0.5 rounded-lg border border-blue-300">
            <button
              onClick={() => setSpreadPayer('CUSTOMER')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                spreadPayer === 'CUSTOMER' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              Cliente Paga
            </button>
            <button
              onClick={() => setSpreadPayer('PRODUCER')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                spreadPayer === 'PRODUCER' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              Produtor Paga
            </button>
          </div>
        </div>

        {/* Visual Split Tree */}
        <div className="space-y-3">
          {/* Top: Customer Paid */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Pago Pelo Cliente</div>
                <div className="text-xs text-slate-300">Entra na Conta de Liquidação DiskIngressos</div>
              </div>
            </div>
            <div className="text-xl font-mono font-black text-emerald-400">
              {fmt(totalCustomerPaid)}
            </div>
          </div>

          {/* Breakdown Columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Produtor / Evento */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 mb-2">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  Saldo Produtor / Evento
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded">
                  Carteira
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Valor do Ingresso:</span>
                  <span className="font-mono font-medium">{fmt(ticket)}</span>
                </div>
                {spreadPayer === 'PRODUCER' && (
                  <div className="flex justify-between text-rose-600">
                    <span>(-) Spread Financeiro:</span>
                    <span className="font-mono font-medium">- {fmt(spreadFee)}</span>
                  </div>
                )}
                {advanceFee > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>(-) Taxa de Advance:</span>
                    <span className="font-mono font-medium">- {fmt(advanceFee)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-emerald-200 mt-2 flex justify-between items-center">
                <span className="font-bold text-emerald-900">Disponível Evento:</span>
                <span className="font-mono font-black text-base text-emerald-800">
                  {fmt(netProducer)}
                </span>
              </div>
            </div>

            {/* DiskIngressos Receita */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200 mb-2">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  Receita DiskIngressos
                </span>
                <span className="text-[10px] font-bold bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded">
                  Retido
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Taxa Disk ({diskRate}%):</span>
                  <span className="font-mono font-medium">{fmt(diskFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spread ({sRate}%):</span>
                  <span className="font-mono font-medium">{fmt(spreadFee)}</span>
                </div>
                {advanceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Advance ({advRate}%):</span>
                    <span className="font-mono font-medium">{fmt(advanceFee)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-blue-200 mt-2 flex justify-between items-center">
                <span className="font-bold text-blue-900">Receita Retida:</span>
                <span className="font-mono font-black text-base text-blue-800">
                  {fmt(diskRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit verification tag */}
        <div className="mt-3 p-2 bg-slate-100 rounded-lg text-[11px] text-slate-600 font-mono flex items-center gap-2 border border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Verificação Contábil: Total Cliente ({fmt(totalCustomerPaid)}) = Produtor ({fmt(netProducer)}) + DiskIngressos ({fmt(diskRevenue)})
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 mt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
          >
            Fechar Simulador
          </button>
        </div>
      </div>
    </div>
  );
}
