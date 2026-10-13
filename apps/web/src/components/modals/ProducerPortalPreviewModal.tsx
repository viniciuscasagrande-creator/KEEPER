import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Building2,
  Calendar,
  Ticket,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Percent,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';

interface ProducerPortalPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  producerId?: string;
  producerName?: string;
}

export function ProducerPortalPreviewModal({
  isOpen,
  onClose,
  producerId = 'prod-01',
  producerName = 'ABC Produções & Eventos Ltda',
}: ProducerPortalPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payout' | 'advance' | 'statement'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('ev-101');
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form states for payout request
  const [payoutAmount, setPayoutAmount] = useState('25000.00');
  const [payoutPixKey, setPayoutPixKey] = useState('financeiro@abcproducoes.com.br');
  const [payoutNotes, setPayoutNotes] = useState('Solicitação de repasse parcial do 2º lote.');

  // Form states for advance request
  const [advanceAmount, setAdvanceAmount] = useState('50000.00');
  const [advanceRate, setAdvanceRate] = useState('2.5');
  const [advanceJustification, setAdvanceJustification] = useState('Sinal para locação de rider técnico e som.');

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const loadPortalData = async () => {
    setLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const [sum, evList, reqs] = await Promise.all([
        api.getProducerPortalSummary(producerId).catch(() => null),
        api.getProducerPortalEvents(producerId).catch(() => []),
        api.getProducerPayoutRequests(producerId).catch(() => []),
      ]);
      if (sum) setSummaryData(sum);
      if (evList && evList.length > 0) {
        setEvents(evList);
        setSelectedEventId(evList[0].id);
      }
      if (reqs && reqs.length > 0) setPayoutRequests(reqs);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPortalData();
    }
  }, [isOpen, producerId]);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || {
    id: 'ev-101',
    name: 'Festival de Primavera 2026 - Pedreira Paulo Leminski',
    date: '25/10/2026',
    venue: 'Pedreira Paulo Leminski, Curitiba - PR',
    ticketsTotal: 15000,
    ticketsSold: 11420,
    grossSales: 890000.0,
    balanceAvailableForRepayment: 153000.0,
  };

  // Submit Payout
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);
    const amountNum = parseFloat(payoutAmount);
    if (!amountNum || amountNum <= 0) {
      setActionError('Informe um valor de repasse válido.');
      return;
    }

    try {
      const res = await api.createProducerPayoutRequest({
        eventId: selectedEventId,
        producerId,
        amount: amountNum,
        paymentMethod: 'PIX',
        pixKey: payoutPixKey,
        notes: payoutNotes,
      });
      setActionSuccess(res.message || 'Solicitação de repasse enviada com sucesso!');
      if (res.request) {
        setPayoutRequests((prev) => [res.request, ...prev]);
      }
    } catch (err: any) {
      setActionError(err.message || 'Erro ao registrar solicitação de repasse.');
    }
  };

  // Submit Advance
  const handleRequestAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);
    const reqAmount = parseFloat(advanceAmount);
    const feeRateNum = parseFloat(advanceRate);

    if (!reqAmount || reqAmount <= 0) {
      setActionError('Informe um valor de antecipação válido.');
      return;
    }

    try {
      const res = await api.createProducerAdvanceRequest({
        eventId: selectedEventId,
        producerId,
        requestedAmount: reqAmount,
        advanceFeeRate: feeRateNum,
        justification: advanceJustification,
        warrantiesDescription: 'Recebíveis futuros da bilheteria DiskIngressos.',
      });
      setActionSuccess(res.message || 'Solicitação de antecipação gerada com sucesso!');
    } catch (err: any) {
      setActionError(err.message || 'Erro ao registrar solicitação de antecipação.');
    }
  };

  // Calculation for Advance Preview
  const advReq = parseFloat(advanceAmount) || 0;
  const advFee = parseFloat(advanceRate) || 2.5;
  const advCost = (advReq * advFee) / 100;
  const advNet = advReq - advCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-700/80 animate-in zoom-in-95 duration-150">
        {/* Top bar simulating the Producer Portal Experience */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  DISK INGRESSOS &bull; PORTAL DO PRODUTOR
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Visão Simulada B2B
                </span>
              </div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {producerName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPortalData}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dashboard & Saldos</span>
            </button>
            <button
              onClick={() => setActiveTab('payout')}
              className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'payout'
                  ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Solicitar Repasse (Payout)</span>
            </button>
            <button
              onClick={() => setActiveTab('advance')}
              className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'advance'
                  ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Antecipação Contratual (Advance)</span>
            </button>
            <button
              onClick={() => setActiveTab('statement')}
              className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'statement'
                  ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Extrato de Vendas & Taxas</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-2">
            <span className="text-[11px] text-slate-400">Evento:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {actionSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 text-xs">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold">Vendas Brutas (Bilheteria)</span>
                    <Ticket className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-black text-white">{fmt(currentEvent.grossSales || 890000.0)}</div>
                  <div className="text-[11px] text-slate-400">
                    {currentEvent.ticketsSold || 11420} de {currentEvent.ticketsTotal || 15000} ingressos vendidos
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold">Taxas de Intermediação</span>
                    <Percent className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-black text-slate-300">{fmt(89000.0)}</div>
                  <div className="text-[11px] text-indigo-300">10,0% Conveniência Disk + Spread Gateway</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold">Repasses Já Efetivados</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-emerald-400">{fmt(100000.0)}</div>
                  <div className="text-[11px] text-slate-400">Depositados via PIX na conta do produtor</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/40 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-blue-300">
                    <span className="font-bold">Saldo Disponível p/ Repasse</span>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-black text-white">
                    {fmt(currentEvent.balanceAvailableForRepayment || 153000.0)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Liberado conforme regras de marco
                  </div>
                </div>
              </div>

              {/* Marco Contratual de Liquidação Banner */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      Regra de Liquidação Contratual — Marco 1 de Liberação Parcial
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Liberação de até 20% das vendas brutas ao atingir 50% da meta de bilheteria estipulada em contrato.
                    </p>
                  </div>
                  <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold text-[11px] self-start sm:self-auto">
                    MARCO ATINGIDO (76,1%)
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Meta 50% de Ingressos</span>
                    <span className="font-bold text-white">76,1% Concluído</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '76.1%' }} />
                  </div>
                </div>
              </div>

              {/* Canais e Lotes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs">Vendas por Canal</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                      <span className="text-slate-300">Online (Site e App DiskIngressos)</span>
                      <span className="font-mono font-bold text-white">{fmt(730000.0)} (82%)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                      <span className="text-slate-300">Pontos de Venda Físicos (PDVs & Bilheteria)</span>
                      <span className="font-mono font-bold text-white">{fmt(160000.0)} (18%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs">Lotes de Ingressos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        <span className="text-slate-300">Lote Promocional</span>
                      </div>
                      <span className="text-emerald-400 font-bold">ESGOTADO (2.000 un)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        <span className="text-slate-300">1º Lote Geral</span>
                      </div>
                      <span className="text-emerald-400 font-bold">ESGOTADO (5.000 un)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-slate-300">2º Lote Geral</span>
                      </div>
                      <span className="text-blue-400 font-bold">EM VENDA (4.420 un)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOLICITAR REPASSE */}
          {activeTab === 'payout' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
              <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-4">
                <div className="border-b border-slate-700 pb-2">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-400" />
                    Nova Solicitação de Repasse
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    O valor solicitado passará por análise de retenções fiscais e alçada da DiskIngressos.
                  </p>
                </div>

                <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg flex items-center justify-between">
                  <span className="text-slate-300">Saldo Liberado p/ Repasse:</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {fmt(currentEvent.balanceAvailableForRepayment || 153000.0)}
                  </span>
                </div>

                <form onSubmit={handleRequestPayout} className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Valor a Solicitar (R$)</label>
                    <input
                      type="text"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Chave PIX de Destino</label>
                    <input
                      type="text"
                      value={payoutPixKey}
                      onChange={(e) => setPayoutPixKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Observações ou Justificativa</label>
                    <textarea
                      rows={2}
                      value={payoutNotes}
                      onChange={(e) => setPayoutNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitação ao Financeiro Disk</span>
                  </button>
                </form>
              </div>

              {/* Right column: Status Tracker of previous requests */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Acompanhamento de Repasses Solicitados
                </h3>

                {payoutRequests.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Nenhuma solicitação de repasse registrada para este produtor.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payoutRequests.map((req) => (
                      <div key={req.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-blue-400">{req.requestNumber}</span>
                            <span className="text-[11px] text-slate-400 ml-2">
                              {new Date(req.requestedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status === 'PAID' ? 'LIQUIDADO VIA PIX' : 'EM ANÁLISE DE RETENÇÃO'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Valor Solicitado:</span>
                          <span className="text-sm font-black text-white">{fmt(req.amount)}</span>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="pt-2 border-t border-slate-700/60">
                          <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                            <div className="text-emerald-400 font-bold flex flex-col items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mb-0.5" />
                              <span>1. Solicitado</span>
                            </div>
                            <div
                              className={`font-bold flex flex-col items-center ${
                                req.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5 mb-0.5" />
                              <span>2. Análise Disk</span>
                            </div>
                            <div
                              className={`font-bold flex flex-col items-center ${
                                req.status === 'PAID' ? 'text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5 mb-0.5" />
                              <span>3. Alçada</span>
                            </div>
                            <div
                              className={`font-bold flex flex-col items-center ${
                                req.status === 'PAID' ? 'text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              <DollarSign className="w-3.5 h-3.5 mb-0.5" />
                              <span>4. PIX Pago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SOLICITAR ADVANCE */}
          {activeTab === 'advance' && (
            <div className="max-w-2xl mx-auto bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4 text-xs">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Solicitação de Antecipação de Recebíveis (Advance)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Antecipe o fluxo financeiro de ingressos dos próximos lotes mediante taxa contratual de antecipação.
                </p>
              </div>

              <form onSubmit={handleRequestAdvance} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Valor Bruto do Advance (R$)</label>
                    <input
                      type="text"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Taxa de Antecipação Contratual (%)</label>
                    <input
                      type="text"
                      value={advanceRate}
                      onChange={(e) => setAdvanceRate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Calculation simulation box */}
                <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Custo do Advance ({advanceRate}%):</span>
                    <span className="text-rose-400 font-bold">- {fmt(advCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-100 text-sm font-bold border-t border-slate-800 pt-2">
                    <span>Valor Líquido Creditado ao Produtor:</span>
                    <span className="text-emerald-400 font-black">{fmt(advNet)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Justificativa Operacional do Adiantamento</label>
                  <textarea
                    rows={2}
                    value={advanceJustification}
                    onChange={(e) => setAdvanceJustification(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submeter Pedido de Advance para Aprovação da Disk</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: EXTRATO & AUDITORIA */}
          {activeTab === 'statement' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200">Extrato Analítico de Lançamentos</h3>
                <span className="text-[11px] text-slate-400">Conta Escrow DiskIngressos &bull; Itaú (341)</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3">Data / Hora</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 text-right">Valor</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400">12/10/2026 14:20</td>
                      <td className="p-3 font-semibold text-emerald-400">VENDA INGRESSOS</td>
                      <td className="p-3 text-slate-300">Lote 2 Geral (30 ingressos site oficial)</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">+ R$ 2.100,00</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">
                          CONCILIADO
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400">12/10/2026 14:20</td>
                      <td className="p-3 font-semibold text-rose-400">TAXA DISK</td>
                      <td className="p-3 text-slate-300">Taxa de Conveniência Disk (10%)</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-400">- R$ 210,00</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">
                          RETIDO
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400">10/10/2026 16:30</td>
                      <td className="p-3 font-semibold text-blue-400">REPASSE MARCO</td>
                      <td className="p-3 text-slate-300">Repasse Parcial PIX Lote Promocional (TxId: 9812401)</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-400">- R$ 100.000,00</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px]">
                          PAGO PIX
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
