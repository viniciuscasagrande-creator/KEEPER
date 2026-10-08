import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Sliders,
  Plus,
  Receipt,
  FileText,
  Lock,
  ChevronRight,
  ShieldCheck,
  Calendar,
  RefreshCw,
  ArrowRight,
  Filter,
  Check,
  UserCheck,
  CreditCard,
  Percent,
} from 'lucide-react';
import { api } from '../../../services/api';
import { EventFeeRulesModal } from '../../modals/EventFeeRulesModal';
import { EventRepaymentRuleModal } from '../../modals/EventRepaymentRuleModal';
import { ProducerAdvanceModal } from '../../modals/ProducerAdvanceModal';
import { EventExpenseModal } from '../../modals/EventExpenseModal';
import { RepaymentScheduleModal } from '../../modals/RepaymentScheduleModal';
import { SaleSplitSimulatorModal } from '../../modals/SaleSplitSimulatorModal';
import { EventWalletStatementDrawer } from '../../drawers/EventWalletStatementDrawer';

export type ProducerCentralTab =
  | 'dados'
  | 'financeiro'
  | 'eventos'
  | 'taxas'
  | 'repasses'
  | 'antecipacoes'
  | 'despesas'
  | 'extrato';

export function ProducerFinancialCentralView() {
  const [producers, setProducers] = useState<any[]>([]);
  const [selectedProducerId, setSelectedProducerId] = useState<string>('prod-01');
  const [producerData, setProducerData] = useState<any | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [eventDetail, setEventDetail] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-10');
  const [activeProducerTab, setActiveProducerTab] = useState<ProducerCentralTab>('financeiro');
  const [isLoading, setIsLoading] = useState(false);

  // Extrato filter state
  const [extratoFilterType, setExtratoFilterType] = useState<string>('ALL');

  // Modals state
  const [isFeeRulesModalOpen, setIsFeeRulesModalOpen] = useState(false);
  const [isRepaymentRuleModalOpen, setIsRepaymentRuleModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isStatementDrawerOpen, setIsStatementDrawerOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const loadProducerData = async (prodId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getProducerFinancialOverview(prodId);
      setProducerData(res);
      if (res.events && res.events.length > 0) {
        const ev = res.events[0];
        const detail = await api.getEventFinancialDetail(ev.id);
        setEventDetail(detail);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api
      .getProducers()
      .then((prods) => {
        setProducers(prods);
        if (prods.length > 0) {
          setSelectedProducerId(prods[0].id);
          loadProducerData(prods[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectProducer = (prodId: string) => {
    setSelectedProducerId(prodId);
    setSelectedEventId('all');
    loadProducerData(prodId);
  };

  const handleSelectEvent = async (evId: string) => {
    setSelectedEventId(evId);
    if (evId !== 'all') {
      try {
        const detail = await api.getEventFinancialDetail(evId);
        setEventDetail(detail);
      } catch {
        // Fallback
      }
    }
  };

  const currentProducer = producerData?.producer || producers.find((p) => p.id === selectedProducerId) || {
    name: 'ABC Produções & Eventos Ltda',
    tradeName: 'ABC Produções',
    cnpj: '12.345.678/0001-90',
    code: 'PROD-001',
    email: 'financeiro@abcproducoes.com.br',
    phone: '(41) 3322-8800',
    bankName: 'Itaú Unibanco S.A. (Bco 341)',
    agency: '0422',
    account: '88120-1',
    pixKey: 'financeiro@abcproducoes.com.br',
  };

  const events = producerData?.events || [];
  const selectedEventObj = events.find((e: any) => e.id === selectedEventId) || null;

  // REGRAS DOS CARDS:
  // Se 'all' selecionado -> representam o consolidado do produtor
  // Se evento selecionado -> TODOS OS CARDS PASSAM A REPRESENTAR SOMENTE AQUELE EVENTO!
  const cardsKpis = selectedEventId === 'all'
    ? (producerData?.consolidatedKpis || {
        saldoTotal: 820450.0,
        disponivel: 570450.0,
        bloqueado: 100000.0,
        emRepasse: 150000.0,
        emAntecipacao: 100000.0,
        despesas: 80000.0,
        projetado: 1240000.0,
      })
    : {
        saldoTotal: selectedEventObj?.saldoEconomico || eventDetail?.saldoEconomico || 358000.0,
        disponivel: selectedEventObj?.disponivel || eventDetail?.saldoDisponivel || 178000.0,
        bloqueado: selectedEventObj?.bloqueado || 0.0,
        emRepasse: selectedEventObj?.repassesAgendados || 30000.0,
        emAntecipacao: selectedEventObj?.antecipacaoRealizada || 50000.0,
        despesas: selectedEventObj?.despesas || eventDetail?.despesas?.totalDespesas || 80000.0,
        projetado: selectedEventObj?.projetado || 680000.0,
      };

  // CÁLCULO DA REGRA DE REPASSE (Marco 50% / Liberação 20%)
  const activeEventSales = selectedEventObj?.vendasBrutas || eventDetail?.vendasBrutas || 200000.0;
  const activeEventTarget = selectedEventObj?.metaVendas || 200000.0;
  const milestonePct = 50.0;
  const releaseLimitPct = 20.0;
  const milestoneTargetAmount = (activeEventTarget * milestonePct) / 100;
  const isMilestoneReached = activeEventSales >= milestoneTargetAmount;
  const milestoneProgressPct = Math.min(100, Math.round((activeEventSales / milestoneTargetAmount) * 100));
  const shortfallAmount = Math.max(0, milestoneTargetAmount - activeEventSales);
  const grossRepaymentLimit = isMilestoneReached ? (activeEventSales * releaseLimitPct) / 100 : 0.0;
  const alreadyRepaid = (selectedEventObj?.repassesRealizados || 10000.0);
  const availableForRepayment = Math.max(0, grossRepaymentLimit - alreadyRepaid);

  // Extrato imutável com modelo financeiro
  const mockExtratoEntries = [
    { id: 'ext-1', date: '08/10/2026 10:15', type: 'VENDA', desc: 'Venda de Ingressos Pedido #92831', direction: '+', amount: 110.0, balance: 110.0, doc: '#92831', status: 'SETTLED' },
    { id: 'ext-2', date: '08/10/2026 10:15', type: 'TAXA_DISK', desc: 'Taxa de Conveniência DiskIngressos (10%)', direction: '-', amount: 10.0, balance: 100.0, doc: '#92831', status: 'SETTLED' },
    { id: 'ext-3', date: '08/10/2026 10:15', type: 'TAXA_SPREAD', desc: 'Spread Financeiro de Cartão', direction: '-', amount: 5.0, balance: 95.0, doc: '#92831', status: 'SETTLED' },
    { id: 'ext-4', date: '08/10/2026 11:20', type: 'VENDA', desc: 'Venda de Ingressos Pedido #92832', direction: '+', amount: 220.0, balance: 315.0, doc: '#92832', status: 'SETTLED' },
    { id: 'ext-5', date: '09/10/2026 14:00', type: 'DESPESA', desc: 'Despesa Segurança Pedreira Paulo Leminski (NF-4921)', direction: '-', amount: 2000.0, balance: 328000.0, doc: 'NF-4921', status: 'PAID' },
    { id: 'ext-6', date: '10/10/2026 16:30', type: 'ANTECIPACAO', desc: 'Operação de Antecipação Aprovada #ANT-1092', direction: '-', amount: 50000.0, balance: 278000.0, doc: 'ANT-1092', status: 'PAID' },
    { id: 'ext-7', date: '15/10/2026 09:00', type: 'REPASSE', desc: 'Repasse Parcial via PIX - Conta Itaú CC 88120-1', direction: '-', amount: 100000.0, balance: 178000.0, doc: 'REP-4091', status: 'PAID' },
  ];

  const filteredExtrato = mockExtratoEntries.filter((item) => {
    if (extratoFilterType === 'ALL') return true;
    return item.type === extratoFilterType;
  });

  return (
    <div className="space-y-4">
      {/* 1. Cabeçalho Principal (NetSuite Enterprise Style) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>FINANCEIRO</span>
              <span>/</span>
              <span className="font-bold text-slate-800">CENTRAL DE PRODUTORES</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Central Financeira do Produtor & Eventos
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
              <span className="text-slate-500">Empresa:</span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Todas ▼</option>
                <option value="DISK">DiskIngressos Serviços de Ingressos S.A.</option>
                <option value="HUB">Hub Entretenimento Ltda</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Período:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="2026-10">Outubro/2026 ▼</option>
                <option value="2026-09">Setembro/2026</option>
                <option value="2026-11">Novembro/2026</option>
              </select>
            </div>

            <button
              onClick={() => setIsSimulatorModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulador de Split</span>
            </button>
          </div>
        </div>

        {/* 🔎 Barra de Busca por Produtor */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔎 Buscar produtor por nome, CNPJ ou código (Ex: ABC Produções, 12.345...)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Produtores:</span>
            <div className="flex gap-1 overflow-x-auto">
              {producers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProducer(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedProducerId === p.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.tradeName || p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. Cabeçalho do Produtor Selecionado + Abas */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-slate-900 text-white shadow-2xs">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Produtor Selecionado
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {currentProducer.tradeName || currentProducer.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>CNPJ: <strong className="text-slate-800">{currentProducer.cnpj}</strong></span>
                <span>·</span>
                <span>Cód: <strong className="text-slate-800">{currentProducer.code || 'PROD-001'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdvanceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition-colors shadow-2xs"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Solicitar Antecipação</span>
            </button>
            <button
              onClick={() => setIsRepaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Programar Repasse</span>
            </button>
          </div>
        </div>

        {/* 8 Abas do Produtor (NetSuite Sub-navigation) */}
        <div className="flex items-center border-b border-slate-200 bg-white px-3 overflow-x-auto">
          {(
            [
              { id: 'dados', label: 'Dados' },
              { id: 'financeiro', label: 'Financeiro' },
              { id: 'eventos', label: 'Eventos' },
              { id: 'taxas', label: 'Taxas' },
              { id: 'repasses', label: 'Repasses' },
              { id: 'antecipacoes', label: 'Antecipações' },
              { id: 'despesas', label: 'Despesas' },
              { id: 'extrato', label: 'Extrato' },
            ] as { id: ProducerCentralTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveProducerTab(tab.id)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeProducerTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              [ {tab.label} ]
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filtro de Eventos */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-blue-600" />
            EVENTO:
          </span>

          <select
            value={selectedEventId}
            onChange={(e) => handleSelectEvent(e.target.value)}
            className="bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer text-xs"
          >
            <option value="all">Todos os eventos ▼ (Consolidado)</option>
            {events.map((ev: any) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} ({fmt(ev.disponivel)} disponível)
              </option>
            ))}
          </select>

          {selectedEventId !== 'all' ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Cards representam somente este evento
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              Cards representam o consolidado do produtor
            </span>
          )}
        </div>

        {selectedEventId !== 'all' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRepaymentRuleModalOpen(true)}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg font-bold text-[11px] hover:bg-amber-100 transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Regra de Repasse (Marco 50% / Liberação 20%)</span>
            </button>
            <button
              onClick={() => setIsFeeRulesModalOpen(true)}
              className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold text-[11px] hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Taxas do Evento</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. CARDS FINANCEIROS PADRONIZADOS COM BORDAS EM CORES DE DESTAQUE */}
      <div className="space-y-4">
        {/* Linha Superior: 3 Cards Mestres de Alta Relevância */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: SALDO TOTAL */}
          <div className="bg-white border border-blue-200 border-l-[6px] border-l-blue-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                SALDO TOTAL
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <DollarSign className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-tight">
                {fmt(cardsKpis.saldoTotal)}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedEventId === 'all' ? 'Todos os Eventos' : 'Posição Deste Evento'}
                </span>
                <span className="text-[11px] text-slate-400">Total gerado em vendas</span>
              </div>
            </div>
          </div>

          {/* Card 2: DISPONÍVEL (O mais crítico para repasse imediato) */}
          <div className="bg-white border border-emerald-300 border-l-[6px] border-l-emerald-500 bg-emerald-50/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                DISPONÍVEL
              </span>
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-700 tracking-tight">
                {fmt(cardsKpis.disponivel)}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Livre para Repasse
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">Pronto para liquidação</span>
              </div>
            </div>
          </div>

          {/* Card 3: BLOQUEADO (Reserva técnica / Garantia) */}
          <div className="bg-white border border-amber-300 border-l-[6px] border-l-amber-500 bg-amber-50/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[148px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                BLOQUEADO
              </span>
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Lock className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-800 tracking-tight">
                {fmt(cardsKpis.bloqueado)}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Não Disponível
                </span>
                <span className="text-[11px] text-amber-700 font-medium">Reserva ou garantia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior: 4 Cards Operacionais Padronizados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 4: A REPASSAR */}
          <div className="bg-white border border-sky-200 border-l-[6px] border-l-sky-500 bg-sky-50/20 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                A REPASSAR
              </span>
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                <Send className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-black text-sky-800 tracking-tight">
                {fmt(cardsKpis.emRepasse)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                  Agendado
                </span>
                <span className="text-[10px] text-slate-500">Cronograma ativo</span>
              </div>
            </div>
          </div>

          {/* Card 5: ANTECIPAÇÕES */}
          <div className="bg-white border border-purple-200 border-l-[6px] border-l-purple-500 bg-purple-50/20 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                ANTECIPAÇÕES
              </span>
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-black text-purple-800 tracking-tight">
                {fmt(cardsKpis.emAntecipacao)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                  Operações
                </span>
                <span className="text-[10px] text-slate-500">Adiantamentos pagos</span>
              </div>
            </div>
          </div>

          {/* Card 6: DESPESAS */}
          <div className="bg-white border border-rose-200 border-l-[6px] border-l-rose-500 bg-rose-50/20 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                DESPESAS
              </span>
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-black text-rose-700 tracking-tight">
                {fmt(cardsKpis.despesas)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  Custos
                </span>
                <span className="text-[10px] text-slate-500">Descontadas do saldo</span>
              </div>
            </div>
          </div>

          {/* Card 7: SALDO PROJETADO */}
          <div className="bg-slate-900 border border-slate-800 border-l-[6px] border-l-indigo-400 text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col justify-between min-h-[136px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                SALDO PROJETADO
              </span>
              <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-300">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-black text-indigo-300 tracking-tight">
                {fmt(cardsKpis.projetado)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  Projeção
                </span>
                <span className="text-[10px] text-slate-400">Vendas futuras</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CONTEÚDO DA ABA ATIVA */}

      {/* ABA: FINANCEIRO */}
      {activeProducerTab === 'financeiro' && (
        <div className="space-y-4">
          {/* REGRA DE REPASSE (Marco 50% / Limite 20%) — Card e Barra de Progresso */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  REGRA DE REPASSE DO EVENTO (MARCO 50% / LIMITE 20%)
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedEventObj?.name || 'Festival XYZ'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRepaymentRuleModalOpen(true)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configurar Regra</span>
                </button>
                <button
                  onClick={() => setIsRepaymentModalOpen(true)}
                  className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SOLICITAR REPASSE</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs border-b border-slate-800">
              <div>
                <span className="text-slate-400 text-[11px]">VENDAS ACUMULADAS:</span>
                <div className="font-mono font-bold text-white text-base mt-0.5">
                  {fmt(activeEventSales)}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">MARCO PARA REPASSE (50%):</span>
                <div className="font-mono font-bold text-amber-300 text-base mt-0.5">
                  {fmt(milestoneTargetAmount)}
                </div>
                <div className="text-[10px] mt-0.5">
                  {isMilestoneReached ? (
                    <span className="text-emerald-400 font-bold">🟢 ATINGIDO</span>
                  ) : (
                    <span className="text-rose-400 font-bold">🔴 NÃO LIBERADO</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">LIMITE DE REPASSE (20%):</span>
                <div className="font-mono font-bold text-blue-300 text-base mt-0.5">
                  {fmt(grossRepaymentLimit)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">20% das vendas acumuladas</div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">JÁ REPASSADO:</span>
                <div className="font-mono font-bold text-rose-300 text-base mt-0.5">
                  {fmt(alreadyRepaid)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Realizado + Agendado</div>
              </div>
            </div>

            {/* Barra de Progresso Visual de Liberação */}
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">LIBERAÇÃO PARA REPASSE:</span>
                <span className="font-mono font-bold text-slate-300">
                  {isMilestoneReached
                    ? '100% — 🟢 Marco atingido'
                    : `${milestoneProgressPct}% do marco — 🔴 Repasse ainda não liberado (Faltam ${fmt(shortfallAmount)})`}
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isMilestoneReached ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${milestoneProgressPct}%` }}
                ></div>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-xl flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    DISPONÍVEL PARA REPASSE:
                  </span>
                  <div className="text-lg font-mono font-black text-emerald-400">
                    {fmt(availableForRepayment)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  Limite Bruto ({fmt(grossRepaymentLimit)}) − Já Repassado ({fmt(alreadyRepaid)})
                </div>
              </div>
            </div>
          </div>

          {/* FINANCEIRO DO EVENTO — DECOMPOSIÇÃO ANALÍTICA */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  DETALHAMENTO FINANCEIRO DO EVENTO
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedEventObj?.name || 'Festival XYZ'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRepaymentModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>[ REPASSE ]</span>
                </button>
                <button
                  onClick={() => setIsAdvanceModalOpen(true)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>[ ANTECIPAÇÃO ]</span>
                </button>
              </div>
            </div>

            {/* Linhas de decomposição financeira conforme especificação */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Vendas brutas</span>
                <span className="font-mono font-bold text-slate-900">{fmt(500000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-blue-700">Taxas DiskIngressos</span>
                <span className="font-mono font-bold text-blue-700">- {fmt(50000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-purple-700">Taxas adicionais (Spread, Advance, Ribeit)</span>
                <span className="font-mono font-bold text-purple-700">- {fmt(12000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-rose-700">Despesas</span>
                <span className="font-mono font-bold text-rose-700">- {fmt(80000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 px-3 bg-slate-100 rounded-lg border-t-2 border-slate-300 font-bold">
                <span className="text-slate-900">Saldo econômico</span>
                <span className="font-mono text-slate-900">{fmt(358000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-600">Repasse realizado</span>
                <span className="font-mono text-slate-700">- {fmt(100000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-purple-700">Antecipação realizada</span>
                <span className="font-mono text-purple-700">- {fmt(50000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-blue-700">Repasse agendado</span>
                <span className="font-mono text-blue-700">- {fmt(30000.0)}</span>
              </div>

              <div className="flex justify-between items-center py-3 px-3 bg-emerald-50 rounded-xl border border-emerald-300 text-sm font-black">
                <span className="text-emerald-900 uppercase">DISPONÍVEL</span>
                <span className="font-mono text-emerald-800 text-base">{fmt(178000.0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: EVENTOS (Resumo por Evento) */}
      {(activeProducerTab === 'eventos' || selectedEventId === 'all') && activeProducerTab !== 'extrato' && activeProducerTab !== 'taxas' && activeProducerTab !== 'repasses' && activeProducerTab !== 'antecipacoes' && activeProducerTab !== 'despesas' && activeProducerTab !== 'dados' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-black text-slate-800 uppercase tracking-wide">
              EVENTOS DO PRODUTOR
            </span>
            <span className="text-slate-400">Total: {events.length} eventos cadastrados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Evento</th>
                  <th className="py-2.5 px-4 text-right">Vendas</th>
                  <th className="py-2.5 px-4 text-right">Saldo</th>
                  <th className="py-2.5 px-4 text-right">Disponível</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center w-32">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev: any) => (
                  <tr
                    key={ev.id}
                    onClick={() => handleSelectEvent(ev.id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      selectedEventId === ev.id ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ev.name}</div>
                      <div className="text-[11px] text-slate-400">{ev.venue}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {fmt(ev.vendasBrutas)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {fmt(ev.saldoEconomico)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 bg-emerald-50/30">
                      {fmt(ev.disponivel)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {ev.id === 'ev-103' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          🟡 Aberto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🟢 Ativo
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEvent(ev.id);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 rounded font-bold text-[11px] flex items-center gap-1 mx-auto"
                      >
                        <span>Abrir</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Linha TOTAL */}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="py-3 px-4 uppercase">TOTAL</td>
                  <td className="py-3 px-4 text-right font-mono font-black">
                    {fmt(events.reduce((a: number, b: any) => a + b.vendasBrutas, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black">
                    {fmt(events.reduce((a: number, b: any) => a + b.saldoEconomico, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-emerald-800 bg-emerald-100/50">
                    {fmt(events.reduce((a: number, b: any) => a + b.disponivel, 0))}
                  </td>
                  <td className="py-3 px-4 text-center"></td>
                  <td className="py-3 px-4 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: TAXAS */}
      {activeProducerTab === 'taxas' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                PARAMETRIZAÇÃO FINANCEIRA
              </span>
              <h3 className="text-base font-bold text-slate-900">
                CONFIGURAÇÃO FINANCEIRA DO EVENTO — {selectedEventObj?.name || 'Festival XYZ'}
              </h3>
            </div>

            <button
              onClick={() => setIsFeeRulesModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>[ + NOVA TAXA ]</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Taxa</th>
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-4 text-right">Valor</th>
                  <th className="py-2.5 px-4">Pagador</th>
                  <th className="py-2.5 px-4">Base de Cálculo</th>
                  <th className="py-2.5 px-4">Vigência</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Taxa DiskIngressos</td>
                  <td className="py-3 px-4 text-slate-600">Percentual</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">10%</td>
                  <td className="py-3 px-4 text-slate-700">Cliente</td>
                  <td className="py-3 px-4 text-slate-600">Valor do Ingresso</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">01/08/2026 → Indeterminado</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🟢 Ativa
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Spread Financeiro</td>
                  <td className="py-3 px-4 text-slate-600">Fixo</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">R$ 2,00</td>
                  <td className="py-3 px-4 text-slate-700">Produtor</td>
                  <td className="py-3 px-4 text-slate-600">Por Ingresso</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">01/10/2026 → 31/10/2026</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🟢 Ativa
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Advance (Antecipação)</td>
                  <td className="py-3 px-4 text-slate-600">Percentual</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">1,50%</td>
                  <td className="py-3 px-4 text-slate-700">Produtor</td>
                  <td className="py-3 px-4 text-slate-600">Valor Antecipado</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">01/09/2026 → Indeterminado</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🟢 Ativa
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Ribeit (Rebate Comercial)</td>
                  <td className="py-3 px-4 text-slate-600">Fixo</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">R$ 1,00</td>
                  <td className="py-3 px-4 text-slate-700">Cliente</td>
                  <td className="py-3 px-4 text-slate-600">Por Pedido</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">01/09/2026 → Indeterminado</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🟢 Ativa
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: EXTRATO (Fonte de Verdade Operacional Imutável) */}
      {activeProducerTab === 'extrato' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                LIVRO FINANCEIRO OPERACIONAL IMUTÁVEL
              </span>
              <h3 className="text-base font-bold text-slate-900">
                EXTRATO — {selectedEventObj?.name || 'FESTIVAL XYZ'}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">Filtros:</span>
              <div className="flex gap-1 overflow-x-auto">
                {['ALL', 'VENDA', 'TAXA_DISK', 'TAXA_SPREAD', 'DESPESA', 'REPASSE', 'ANTECIPACAO'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setExtratoFilterType(f)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      extratoFilterType === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    [ {f === 'ALL' ? 'Todos' : f} ]
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2 px-3">Data</th>
                  <th className="py-2 px-3">Tipo</th>
                  <th className="py-2 px-3">Descrição da Movimentação</th>
                  <th className="py-2 px-3 text-right">Valor</th>
                  <th className="py-2 px-3 text-right">Saldo Acumulado</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredExtrato.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{e.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-slate-100 text-slate-800">
                        {e.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{e.desc}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold ${
                        e.direction === '+' ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {e.direction} {fmt(e.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-slate-50/50">
                      {fmt(e.balance)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3" /> Auditado
                      </span>
                    </td>
                  </tr>
                ))}

                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td colSpan={4} className="py-3 px-3 uppercase font-sans">
                    SALDO FINAL DA CARTEIRA
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-800 text-sm">
                    {fmt(178000.0)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: DADOS CADASTRAIS */}
      {activeProducerTab === 'dados' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                CADASTRO CORPORATIVO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Dados Cadastrais & Bancários do Produtor
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              Produtor Verificado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800">Identificação & Contato:</span>
              <div className="space-y-1 text-slate-600">
                <div>Razão Social: <strong>{currentProducer.name}</strong></div>
                <div>Nome Fantasia: <strong>{currentProducer.tradeName}</strong></div>
                <div>CNPJ: <strong className="font-mono">{currentProducer.cnpj}</strong></div>
                <div>Código Interno: <strong className="font-mono">{currentProducer.code}</strong></div>
                <div>E-mail: <strong>{currentProducer.email}</strong></div>
                <div>Telefone: <strong>{currentProducer.phone}</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-800">Dados Bancários para Repasse:</span>
              <div className="space-y-1 text-slate-600">
                <div>Banco: <strong>{currentProducer.bankName}</strong></div>
                <div>Agência: <strong className="font-mono">{currentProducer.agency}</strong></div>
                <div>Conta Corrente: <strong className="font-mono">{currentProducer.account}</strong></div>
                <div>Chave PIX: <strong className="font-mono text-blue-700">{currentProducer.pixKey}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: REPASSES */}
      {activeProducerTab === 'repasses' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                HISTÓRICO & PROGRAMAÇÃO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Repasses Programados e Realizados
              </h3>
            </div>
            <button
              onClick={() => setIsRepaymentModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Programar Novo Repasse</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2 px-3">Código</th>
                  <th className="py-2 px-3">Data Prevista/Paga</th>
                  <th className="py-2 px-3">Destino</th>
                  <th className="py-2 px-3 text-right">Valor</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">REP-2026-001</td>
                  <td className="py-2.5 px-3 text-slate-600">05/10/2026</td>
                  <td className="py-2.5 px-3 text-slate-700">Itaú Ag. 0422 / CC 88120-1 (PIX)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{fmt(100000.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PAGO
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">REP-2026-002</td>
                  <td className="py-2.5 px-3 text-slate-600">20/10/2026</td>
                  <td className="py-2.5 px-3 text-slate-700">Itaú Ag. 0422 / CC 88120-1 (PIX)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{fmt(30000.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      AGENDADO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: ANTECIPAÇÕES */}
      {activeProducerTab === 'antecipacoes' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                CRÉDITO & ANTECIPAÇÃO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Operações de Antecipação de Recebíveis
              </h3>
            </div>
            <button
              onClick={() => setIsAdvanceModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Solicitar Antecipação</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2 px-3">Código</th>
                  <th className="py-2 px-3 text-right">Valor Bruto</th>
                  <th className="py-2 px-3 text-right">Taxa (%)</th>
                  <th className="py-2 px-3 text-right">Custo</th>
                  <th className="py-2 px-3 text-right">Valor Líquido</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-700">ANT-1092</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">{fmt(50000.0)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">2,50%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600">- {fmt(1250.0)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700">{fmt(48750.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PAGA
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: DESPESAS */}
      {activeProducerTab === 'despesas' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                CUSTOS OPERACIONAIS DO EVENTO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Despesas Diretas Descontadas da Carteira
              </h3>
            </div>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lançar Nova Despesa</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-2 px-3">Categoria</th>
                  <th className="py-2 px-3">Fornecedor</th>
                  <th className="py-2 px-3">Documento</th>
                  <th className="py-2 px-3 text-right">Valor</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-800">Segurança & Portaria</td>
                  <td className="py-2.5 px-3 text-slate-700">GuardSeg Proteção Patrimonial Ltda</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">NF-4921</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">- {fmt(30000.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PAGO
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-800">Estrutura & Palco</td>
                  <td className="py-2.5 px-3 text-slate-700">Stark Iluminação e Cenografia S.A.</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">NF-1802</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">- {fmt(20000.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PAGO
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-800">Cachê Artístico</td>
                  <td className="py-2.5 px-3 text-slate-700">Música & Arte Produções Artísticas</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">CONTRATO-89</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">- {fmt(50000.0)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      PAGO
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <EventRepaymentRuleModal
        isOpen={isRepaymentRuleModalOpen}
        onClose={() => setIsRepaymentRuleModalOpen(false)}
        event={selectedEventObj || { name: 'Festival XYZ', id: 'ev-101' }}
        onSaveRule={(rule) => {
          setActionNotice(`Regra de Repasse (${rule.minSalesMilestonePct}% marco / ${rule.maxReleasePct}% liberação) atualizada no evento!`);
          setTimeout(() => setActionNotice(null), 3500);
        }}
      />

      <EventFeeRulesModal
        isOpen={isFeeRulesModalOpen}
        onClose={() => setIsFeeRulesModalOpen(false)}
        event={selectedEventObj}
        onSaveRule={(newRule) => {
          setActionNotice(`Taxa '${newRule.feeName}' adicionada ao evento! Vendas anteriores permanecem congeladas.`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <ProducerAdvanceModal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        producer={currentProducer}
        event={selectedEventObj}
        onAdvanceSubmitted={(adv) => {
          setActionNotice(`Solicitação de antecipação de R$ ${adv.requestedAmount.toFixed(2)} criada com sucesso!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <RepaymentScheduleModal
        isOpen={isRepaymentModalOpen}
        onClose={() => setIsRepaymentModalOpen(false)}
        wallet={selectedEventObj || {
          name: 'Festival XYZ',
          vendasBrutas: activeEventSales,
          repaymentsPaidTotal: alreadyRepaid,
          disponivel: availableForRepayment,
        }}
        onRepaymentCreated={(sch) => {
          setActionNotice(`Repasse de R$ ${sch.amount.toFixed(2)} agendado com sucesso!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <EventExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        wallet={selectedEventObj}
        onExpenseAdded={(exp) => {
          setActionNotice(`Despesa de R$ ${exp.amount.toFixed(2)} autorizada no evento!`);
          setTimeout(() => setActionNotice(null), 3000);
        }}
      />

      <SaleSplitSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
      />

      <EventWalletStatementDrawer
        isOpen={isStatementDrawerOpen}
        onClose={() => setIsStatementDrawerOpen(false)}
        wallet={selectedEventObj}
      />
    </div>
  );
}
