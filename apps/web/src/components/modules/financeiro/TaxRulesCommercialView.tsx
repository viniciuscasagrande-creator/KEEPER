import React, { useState, useEffect } from 'react';
import {
  Percent,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Copy,
  Edit3,
  History,
  Calculator,
  ChevronRight,
  X,
  FileText,
  UserCheck,
  CreditCard,
  Landmark,
  Eye,
  Check,
  CheckCheck,
} from 'lucide-react';
import { api } from '../../../services/api';
import { simulateFee } from '../../../utils/fee-calculator';

export type TaxRulesTab = 'indicadores' | 'governanca' | 'matriz' | 'simulador' | 'politicas';

export function TaxRulesCommercialView() {
  const [activeTab, setActiveTab] = useState<TaxRulesTab>('matriz');
  const [rules, setRules] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filtros da barra superior
  const [selectedProducerFilter, setSelectedProducerFilter] = useState('all');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('current-month');

  // Filtros locais da matriz
  const [scopeFilter, setScopeFilter] = useState('all');
  const [acquirerFilter, setAcquirerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modais
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [isApprovalsModalOpen, setIsApprovalsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryRule, setSelectedHistoryRule] = useState<any | null>(null);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estado do formulário de cadastro/edição versionada (17 campos)
  const [formName, setFormName] = useState('');
  const [formAcquirer, setFormAcquirer] = useState('Cielo');
  const [formGateway, setFormGateway] = useState('Pagar.me v5');
  const [formPaymentMethod, setFormPaymentMethod] = useState('CREDIT_INSTALLMENT_2_6');
  const [formBrand, setFormBrand] = useState('Visa / Master / Elo');
  const [formInstallments, setFormInstallments] = useState('2x a 6x');
  const [formMdrRate, setFormMdrRate] = useState('2.80');
  const [formChargedRate, setFormChargedRate] = useState('8.00');
  const [formAcquirerFixedFee, setFormAcquirerFixedFee] = useState('0.00');
  const [formAdditionalCost, setFormAdditionalCost] = useState('0.00');
  const [formFixedCommercialRevenue, setFormFixedCommercialRevenue] = useState('0.00');
  const [formRuleType, setFormRuleType] = useState('HYBRID');
  const [formFeePayer, setFormFeePayer] = useState('BUYER_CONVENIENCE');
  const [formSettlementTerm, setFormSettlementTerm] = useState('D+30');
  const [formScope, setFormScope] = useState('GLOBAL_DISK');
  const [formProducerId, setFormProducerId] = useState('prod-01');
  const [formEventId, setFormEventId] = useState('ev-101');
  const [formValidFrom, setFormValidFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [formValidTo, setFormValidTo] = useState('');
  const [formChangeReason, setFormChangeReason] = useState('');

  // Estado do Simulador embutido na tela
  const [simSaleAmount, setSimSaleAmount] = useState('1000.00');
  const [simChargedRate, setSimChargedRate] = useState('8.00');
  const [simMdrRate, setSimMdrRate] = useState('2.80');
  const [simFixedFee, setSimFixedFee] = useState('0.00');

  // Estado do Simulador em Modal (com resolução hierárquica)
  const [simModalSaleAmount, setSimModalSaleAmount] = useState('500.00');
  const [simModalProducer, setSimModalProducer] = useState('all');
  const [simModalEvent, setSimModalEvent] = useState('all');
  const [simModalPaymentMethod, setSimModalPaymentMethod] = useState('CREDIT_INSTALLMENT_2_6');

  // Lista de produtores e eventos cadastrados para vínculo
  const producerOptions = [
    { id: 'prod-01', name: 'ABC Produções & Eventos Ltda' },
    { id: 'prod-02', name: 'Opus Entretenimento e Shows' },
    { id: 'prod-03', name: 'Live Nation Brasil Produções' },
    { id: 'prod-04', name: 'Teatro Positivo & Eventos Culturais' },
  ];

  const eventOptions = [
    { id: 'ev-101', name: 'Festival de Verão 2026', producerId: 'prod-01' },
    { id: 'ev-102', name: 'Turnê Acústico MPB', producerId: 'prod-01' },
    { id: 'ev-201', name: 'Orquestra Sinfônica Gala', producerId: 'prod-02' },
    { id: 'ev-301', name: 'Show Internacional Stadium', producerId: 'prod-03' },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rulesRes, summaryRes] = await Promise.allSettled([
        api.getCommercialRules({
          scope: scopeFilter !== 'all' ? scopeFilter : undefined,
          acquirer: acquirerFilter !== 'all' ? acquirerFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
        }),
        api.getCommercialRulesSummary(),
      ]);

      if (rulesRes.status === 'fulfilled' && Array.isArray(rulesRes.value)) {
        setRules(rulesRes.value);
      } else {
        // Fallback default demonstration rules matching the 63s video
        setRules([
          {
            id: 'cr-001',
            name: 'Cartão de Crédito Parcelado (2 a 6x)',
            scope: 'GLOBAL_DISK',
            acquirer: 'Cielo',
            gateway: 'Pagar.me v5',
            paymentMethod: 'CREDIT_INSTALLMENT_2_6',
            brand: 'Visa / Master / Elo',
            installments: '2x a 6x',
            chargedRate: 8.0,
            mdrRate: 2.8,
            grossSpread: 5.2,
            feePayer: 'BUYER_CONVENIENCE',
            settlementTerm: 'D+30',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-002',
            name: 'Cartão de Crédito à Vista (1x)',
            scope: 'GLOBAL_DISK',
            acquirer: 'Rede',
            gateway: 'Pagar.me v5',
            paymentMethod: 'CREDIT_CASH',
            brand: 'Visa / Mastercard',
            installments: '1x (À Vista)',
            chargedRate: 4.8,
            mdrRate: 2.0,
            grossSpread: 2.8,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+14',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-003',
            name: 'Cartão de Crédito Parcelado (7 a 12x Premium)',
            scope: 'GLOBAL_DISK',
            acquirer: 'Stone',
            gateway: 'Pagar.me v5',
            paymentMethod: 'CREDIT_INSTALLMENT_7_12',
            brand: 'Todas as Bandeiras',
            installments: '7x a 12x',
            chargedRate: 9.9,
            mdrRate: 3.4,
            grossSpread: 6.5,
            feePayer: 'BUYER_CONVENIENCE',
            settlementTerm: 'D+30',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-004',
            name: 'PIX Instantâneo EFI / Safra',
            scope: 'GLOBAL_DISK',
            acquirer: 'EfiPix',
            gateway: 'API Direta Banco Central',
            paymentMethod: 'PIX',
            brand: 'BACEN / Pix',
            installments: 'À Vista',
            chargedRate: 1.5,
            mdrRate: 0.4,
            grossSpread: 1.1,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+0',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-005',
            name: 'Cartão de Débito Balcão PDV & Online',
            scope: 'GLOBAL_DISK',
            acquirer: 'PagBank',
            gateway: 'POS Stone / Cielo PDV',
            paymentMethod: 'DEBIT',
            brand: 'Visa Débito / Maestro / Elo',
            installments: 'À Vista',
            chargedRate: 3.9,
            mdrRate: 1.1,
            grossSpread: 2.8,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+1',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-006',
            name: 'Boleto Bancário Registrado',
            scope: 'GLOBAL_DISK',
            acquirer: 'Rede',
            gateway: 'Banco Itaú CNAB / API',
            paymentMethod: 'BOLETO',
            brand: 'Boleto Registrado',
            installments: 'À Vista',
            chargedRate: 4.3,
            mdrRate: 1.2,
            grossSpread: 3.1,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+2',
            version: 1,
            validFrom: '2026-01-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-007',
            name: 'Condição Especial VIP - Produtora ABC',
            scope: 'PRODUCER',
            producerId: 'prod-01',
            producerName: 'ABC Produções & Eventos Ltda',
            acquirer: 'Cielo',
            gateway: 'Pagar.me v5',
            paymentMethod: 'CREDIT_INSTALLMENT_2_6',
            brand: 'Visa / Master',
            installments: '2x a 6x',
            chargedRate: 6.9,
            mdrRate: 2.8,
            grossSpread: 4.1,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+14',
            version: 1,
            validFrom: '2026-02-01',
            status: 'ACTIVE',
          },
          {
            id: 'cr-008',
            name: 'Taxa Promocional - Festival de Verão Curitiba',
            scope: 'EVENT',
            eventId: 'ev-101',
            eventName: 'Festival de Verão 2026',
            producerId: 'prod-01',
            producerName: 'ABC Produções & Eventos Ltda',
            acquirer: 'Rede',
            gateway: 'Pagar.me v5',
            paymentMethod: 'CREDIT_CASH',
            brand: 'Todas as Bandeiras',
            installments: '1x (À Vista)',
            chargedRate: 3.9,
            mdrRate: 2.0,
            grossSpread: 1.9,
            feePayer: 'PRODUCER_RETENTION',
            settlementTerm: 'D+7',
            version: 2,
            validFrom: '2026-03-01',
            status: 'ACTIVE',
          },
        ]);
      }

      if (summaryRes.status === 'fulfilled' && summaryRes.value) {
        setSummary(summaryRes.value);
      } else {
        setSummary({
          totalRules: 8,
          avgGrossSpread: 3.44,
          avgMdr: 1.96,
          customRulesCount: 2,
          pendingApprovalsCount: 7,
          contextLevel: 'NÍVEL 1 • DISK (Todos os Produtores)',
          commercialSpreadDisk: '1,22%',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey, scopeFilter, acquirerFilter, statusFilter, searchQuery]);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const fmtPct = (v: number) =>
    `${v >= 0 ? '+' : ''}${v.toFixed(2).replace('.', ',')}%`;

  // Abrir Modal para Nova Taxa
  const handleOpenNewRuleModal = () => {
    setEditingRule(null);
    setFormName('');
    setFormAcquirer('Cielo');
    setFormGateway('Pagar.me v5');
    setFormPaymentMethod('CREDIT_INSTALLMENT_2_6');
    setFormBrand('Visa / Master / Elo');
    setFormInstallments('2x a 6x');
    setFormMdrRate('2.80');
    setFormChargedRate('8.00');
    setFormAcquirerFixedFee('0.00');
    setFormAdditionalCost('0.00');
    setFormFixedCommercialRevenue('0.00');
    setFormRuleType('HYBRID');
    setFormFeePayer('BUYER_CONVENIENCE');
    setFormSettlementTerm('D+30');
    setFormScope('GLOBAL_DISK');
    setFormProducerId('prod-01');
    setFormEventId('ev-101');
    setFormValidFrom(new Date().toISOString().split('T')[0]);
    setFormValidTo('');
    setFormChangeReason('Criação inicial da regra comercial');
    setIsRuleModalOpen(true);
  };

  // Abrir Modal para Edição Versionada (v2, v3)
  const handleOpenEditRuleModal = (rule: any) => {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormAcquirer(rule.acquirer);
    setFormGateway(rule.gateway || 'Pagar.me v5');
    setFormPaymentMethod(rule.paymentMethod || 'CREDIT_INSTALLMENT_2_6');
    setFormBrand(rule.brand || 'Todas as Bandeiras');
    setFormInstallments(rule.installments || '1x');
    setFormMdrRate(String(rule.mdrRate));
    setFormChargedRate(String(rule.chargedRate));
    setFormAcquirerFixedFee(String(rule.acquirerFixedFee || 0));
    setFormAdditionalCost(String(rule.additionalCost || 0));
    setFormFixedCommercialRevenue(String(rule.fixedCommercialRevenue || 0));
    setFormRuleType(rule.ruleType || 'HYBRID');
    setFormFeePayer(rule.feePayer || 'PRODUCER_RETENTION');
    setFormSettlementTerm(rule.settlementTerm || 'D+30');
    setFormScope(rule.scope || 'GLOBAL_DISK');
    setFormProducerId(rule.producerId || 'prod-01');
    setFormEventId(rule.eventId || 'ev-101');
    setFormValidFrom(new Date().toISOString().split('T')[0]);
    setFormValidTo('');
    setFormChangeReason(`Atualização de taxa para v${(rule.version || 1) + 1}`);
    setIsRuleModalOpen(true);
  };

  // Salvar e Publicar Regra (com Versionamento Imutável)
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const charged = parseFloat(formChargedRate.replace(',', '.')) || 0;
    const mdr = parseFloat(formMdrRate.replace(',', '.')) || 0;
    const fixedFee = parseFloat(formAcquirerFixedFee.replace(',', '.')) || 0;
    const addCost = parseFloat(formAdditionalCost.replace(',', '.')) || 0;
    const fixRev = parseFloat(formFixedCommercialRevenue.replace(',', '.')) || 0;

    const selectedProducer = producerOptions.find((p) => p.id === formProducerId);
    const selectedEvent = eventOptions.find((ev) => ev.id === formEventId);

    const payload = {
      name: formName.trim() || 'Nova Regra Comercial',
      scope: formScope,
      producerId: formScope === 'PRODUCER' || formScope === 'EVENT' ? formProducerId : undefined,
      producerName: formScope === 'PRODUCER' || formScope === 'EVENT' ? selectedProducer?.name : undefined,
      eventId: formScope === 'EVENT' ? formEventId : undefined,
      eventName: formScope === 'EVENT' ? selectedEvent?.name : undefined,
      acquirer: formAcquirer,
      gateway: formGateway,
      paymentMethod: formPaymentMethod,
      brand: formBrand,
      installments: formInstallments,
      chargedRate: charged,
      mdrRate: mdr,
      acquirerFixedFee: fixedFee,
      additionalCost: addCost,
      fixedCommercialRevenue: fixRev,
      ruleType: formRuleType,
      feePayer: formFeePayer,
      settlementTerm: formSettlementTerm,
      validFrom: formValidFrom,
      validTo: formValidTo || undefined,
      changeReason: formChangeReason,
      status: 'ACTIVE',
    };

    try {
      if (editingRule) {
        await api.createCommercialRuleVersion(editingRule.id, payload);
        setNotification(`Regra comercial versionada com sucesso para v${(editingRule.version || 1) + 1}. Histórico de vendas preservado.`);
      } else {
        await api.createCommercialRule(payload);
        setNotification('Nova regra comercial criada e publicada com sucesso no motor financeiro.');
      }
      setIsRuleModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(`Erro ao salvar regra: ${err.message}`);
    }
  };

  // Alternar Status (Ativar / Inativar)
  const handleToggleStatus = async (rule: any) => {
    const action = rule.status === 'ACTIVE' ? 'inativar' : 'reativar';
    if (!window.confirm(`Deseja realmente ${action} a regra "${rule.name}"? O histórico permanecerá intacto.`)) {
      return;
    }
    try {
      await api.toggleCommercialRuleStatus(rule.id);
      setNotification(`Regra "${rule.name}" atualizada para ${rule.status === 'ACTIVE' ? 'Inativa' : 'Ativa'}.`);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(`Erro ao alterar status: ${err.message}`);
    }
  };

  // Duplicar Regra
  const handleDuplicateRule = async (rule: any) => {
    try {
      await api.duplicateCommercialRule(rule.id);
      setNotification(`Regra duplicada como rascunho: "[CÓPIA] ${rule.name}".`);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(`Erro ao duplicar regra: ${err.message}`);
    }
  };

  // Consultar Histórico
  const handleViewHistory = async (rule: any) => {
    try {
      const historyData = await api.getCommercialRuleHistory(rule.id);
      setSelectedHistoryRule(historyData || rule);
      setIsHistoryModalOpen(true);
    } catch (e) {
      setSelectedHistoryRule(rule);
      setIsHistoryModalOpen(true);
    }
  };

  // Cálculo ao vivo no formulário
  const previewCharged = parseFloat(formChargedRate.replace(',', '.')) || 0;
  const previewMdr = parseFloat(formMdrRate.replace(',', '.')) || 0;
  const previewSpread = Number((previewCharged - previewMdr).toFixed(2));

  // Cálculo do simulador puro embutido
  const simSale = parseFloat(simSaleAmount.replace(',', '.')) || 1000;
  const simCharged = parseFloat(simChargedRate.replace(',', '.')) || 8;
  const simMdr = parseFloat(simMdrRate.replace(',', '.')) || 2.8;
  const simFixed = parseFloat(simFixedFee.replace(',', '.')) || 0;

  let simResult: any = {
    chargedFeeCents: 8000,
    mdrCostCents: 2800,
    grossSpreadCents: 5200,
    netMarginCents: 5200,
    grossSpreadBps: 520,
  };
  try {
    simResult = simulateFee({
      saleCents: Math.round(simSale * 100),
      chargedBps: Math.round(simCharged * 100),
      acquiringMdrBps: Math.round(simMdr * 100),
      acquiringFixedCents: Math.round(simFixed * 100),
    });
  } catch (e) {}

  // Resolução hierárquica do Simulador Modal
  const resolveModalSimulation = () => {
    const saleVal = parseFloat(simModalSaleAmount.replace(',', '.')) || 500;

    let appliedRule: any = null;
    let resolvedScope = 'GLOBAL_DISK';
    let resolutionReason = 'Aplicada Regra Geral Disk (Global padrão)';

    if (simModalEvent !== 'all') {
      const evRule = rules.find((r) => r.scope === 'EVENT' && r.eventId === simModalEvent && r.status === 'ACTIVE');
      if (evRule) {
        appliedRule = evRule;
        resolvedScope = 'EVENT';
        resolutionReason = `Aplicada condição prioritária do Evento (${evRule.eventName || simModalEvent})`;
      }
    }

    if (!appliedRule && simModalProducer !== 'all') {
      const prodRule = rules.find((r) => r.scope === 'PRODUCER' && r.producerId === simModalProducer && r.status === 'ACTIVE');
      if (prodRule) {
        appliedRule = prodRule;
        resolvedScope = 'PRODUCER';
        resolutionReason = `Aplicada condição negociada do Produtor (${prodRule.producerName || simModalProducer})`;
      }
    }

    if (!appliedRule) {
      appliedRule = rules.find((r) => r.scope === 'GLOBAL_DISK' && r.status === 'ACTIVE') || rules[0];
    }

    const chargedPct = appliedRule?.chargedRate || 8.0;
    const mdrPct = appliedRule?.mdrRate || 2.8;
    const fixedFee = appliedRule?.acquirerFixedFee || 0;

    const sim = simulateFee({
      saleCents: Math.round(saleVal * 100),
      chargedBps: Math.round(chargedPct * 100),
      acquiringMdrBps: Math.round(mdrPct * 100),
      acquiringFixedCents: Math.round(fixedFee * 100),
    });

    return {
      saleVal,
      appliedRule,
      resolvedScope,
      resolutionReason,
      chargedPct,
      mdrPct,
      chargedFeeAmount: sim.chargedFeeCents / 100,
      mdrCostAmount: sim.mdrCostCents / 100,
      grossSpreadAmount: sim.grossSpreadCents / 100,
      netMarginAmount: sim.netMarginCents / 100,
      spreadPct: sim.grossSpreadBps / 100,
    };
  };

  const modalSim = resolveModalSimulation();

  return (
    <div className="space-y-5">
      {/* Notificação Toast */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Principal da Tela com Contexto Corporativo (Conforme Vídeo) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-900 text-white shadow-2xs">
                FINANCEIRO DISK
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                NÍVEL 1 • DISK (Todos os Produtores)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                Spread Comercial Disk: 1,22%
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 pt-1">
              <Sliders className="w-6 h-6 text-blue-600" />
              Taxas & Regras Comerciais
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Configuração de MDR, spread comercial Disk (1,22%), parcelamento e vigências contratuais.
            </p>
          </div>

          {/* Filtros Superiores: Produtor, Evento, Período, Atualizar, Central de Aprovações */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Seletor de Produtor */}
            <div className="relative">
              <select
                value={selectedProducerFilter}
                onChange={(e) => setSelectedProducerFilter(e.target.value)}
                className="h-10 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <option value="all">Buscar produtor... (Todos)</option>
                {producerOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Evento */}
            <div className="relative">
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="h-10 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <option value="all">Todos os eventos</option>
                {eventOptions.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Período */}
            <div className="relative">
              <select
                value={selectedPeriodFilter}
                onChange={(e) => setSelectedPeriodFilter(e.target.value)}
                className="h-10 pl-3 pr-8 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <option value="current-month">Período: Mês Atual</option>
                <option value="q3-2026">3º Trimestre 2026</option>
                <option value="year-2026">Ano 2026 (Consolidado)</option>
              </select>
            </div>

            {/* Botão Atualizar */}
            <button
              onClick={() => {
                setRefreshKey((k) => k + 1);
              }}
              title="Atualizar dados de taxas e adquirentes"
              className="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            {/* Botão Central de Aprovações (com indicador 7 no registro) */}
            <button
              onClick={() => setIsApprovalsModalOpen(true)}
              className="h-10 px-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl shadow-2xs transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Central de Aprovações</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                {summary?.pendingApprovalsCount || 7}
              </span>
            </button>
          </div>
        </div>

        {/* 2. Barra de Abas Internas da Tela (Conforme Vídeo) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('indicadores')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'indicadores'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Indicadores & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('governanca')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'governanca'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Governança & Hierarquia</span>
          </button>

          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matriz'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Matriz de Tarifas & MDR</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'matriz' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {rules.length || 8}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulador'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Spread</span>
          </button>

          <button
            onClick={() => setActiveTab('politicas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'politicas'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Políticas & Prazos</span>
          </button>
        </div>
      </div>

      {/* 3. Indicadores & KPIs do Vídeo (Visíveis no Topo ou Aba Indicadores) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total de regras 8 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total de Regras Ativas
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {rules.filter((r) => r.status === 'ACTIVE').length} Regras
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              3 Geral Disk · 2 Produtor · 3 Eventos
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Spread bruto médio +3,44% */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Spread Bruto Médio
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {summary ? fmtPct(summary.avgGrossSpread) : '+3,44%'}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Remuneração Comercial Disk
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: MDR médio adquirentes 1,96% */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MDR Médio Adquirentes
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {summary ? `${summary.avgMdr.toFixed(2).replace('.', ',')}%` : '1,96%'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Cielo 2,8% · Rede 2,0% · Stone 3,4%
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Regras customizadas 2 */}
        <div className="bg-white rounded-2xl border border-purple-200/80 shadow-2xs p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Regras Customizadas
            </span>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {summary?.customRulesCount || 2} Específicas
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">
              VIP ABC e Fest. Verão Curitiba
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Banner de Governança & Hierarquia de Aplicação (Visível sempre ou na aba Governança) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl text-white p-4 sm:p-5 shadow-md border border-blue-900/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/40 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Governança & Hierarquia de Aplicação de Taxas
            </h3>
          </div>
          <span className="text-[11px] text-blue-300 font-medium">
            Prioridade Estrita: Evento → Produtor → Geral Disk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Nível 1: Evento */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                PRIORIDADE 1 • MÁXIMA
              </span>
              <span className="text-xs font-bold text-rose-300">Sobrepõe Todas</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">Regra do Evento</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Condição comercial específica contratada para um evento determinado. Anula a regra do produtor e a regra geral.
            </p>
          </div>

          {/* Nível 2: Produtor */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white">
                PRIORIDADE 2 • INTERMEDIÁRIA
              </span>
              <span className="text-xs font-bold text-indigo-300">Por Produtor</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">Regra do Produtor</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Acordo contratual firmado com o organizador. Aplicada automaticamente quando o evento não possuir regra própria.
            </p>
          </div>

          {/* Nível 3: Geral Disk */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/15 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                PRIORIDADE 3 • PADRÃO
              </span>
              <span className="text-xs font-bold text-blue-300">Global Fallback</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">Regra Geral Disk</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Matriz padrão corporativa DiskIngressos. Vigora como fallback quando nenhuma regra específica for informada.
            </p>
          </div>
        </div>

        <div className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-700/50 text-[11px] text-blue-200 flex items-center justify-between">
          <span>
            <strong>🔒 Política de Acesso & Segurança:</strong> O produtor visualiza unicamente suas taxas comerciais aplicadas e não tem permissão para consultar ou editar o custo MDR interno da Disk.
          </span>
          <button
            onClick={() => setIsSimulationModalOpen(true)}
            className="px-2.5 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold shrink-0 ml-2 transition-colors cursor-pointer"
          >
            Testar Hierarquia
          </button>
        </div>
      </div>

      {/* 5. ABA: Matriz Vigente de Tarifas, MDR e Spreads Comerciais */}
      {(activeTab === 'matriz' || activeTab === 'indicadores') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          {/* Barra de Ações & Filtros da Matriz */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                Matriz Vigente de Tarifas, MDR e Spreads Comerciais
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Controle granular de taxas cobradas, custo da adquirente e spread comercial apurado
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSimulationModalOpen(true)}
                className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Simulador de Spread</span>
              </button>
              <button
                onClick={handleOpenNewRuleModal}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nova Taxa / Regra</span>
              </button>
            </div>
          </div>

          {/* Filtros da Matriz: Abrangência, Adquirente, Situação, Busca */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Abrangência / Escopo
              </label>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Todas as Abrangências</option>
                <option value="GLOBAL_DISK">Geral Disk (Global)</option>
                <option value="PRODUCER">Por Produtor</option>
                <option value="EVENT">Por Evento</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Adquirente / Credenciadora
              </label>
              <select
                value={acquirerFilter}
                onChange={(e) => setAcquirerFilter(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Todas as Adquirentes</option>
                <option value="Cielo">Cielo</option>
                <option value="Rede">Rede</option>
                <option value="Stone">Stone</option>
                <option value="EfiPix">EfiPix (Pix)</option>
                <option value="PagBank">PagBank</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Situação / Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Todas as Situações</option>
                <option value="ACTIVE">Ativas</option>
                <option value="INACTIVE">Inativas</option>
                <option value="DRAFT">Rascunhos</option>
                <option value="PENDING_APPROVAL">Aguardando Aprovação</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Busca Textual
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por nome, adquirente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>
          </div>

          {/* Tabela da Matriz — 11 Colunas Observadas no Vídeo */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3.5">REGRA / MEIO DE PAGAMENTO</th>
                  <th className="py-3 px-3">ADQUIRENTE</th>
                  <th className="py-3 px-3">ABRANGÊNCIA / ESCOPO</th>
                  <th className="py-3 px-3 text-right">TAXA COBRADA</th>
                  <th className="py-3 px-3 text-right">CUSTO MDR DISK</th>
                  <th className="py-3 px-3 text-right">SPREAD LÍQUIDO</th>
                  <th className="py-3 px-3">QUEM PAGA</th>
                  <th className="py-3 px-3">PRAZO</th>
                  <th className="py-3 px-3">VIGÊNCIA</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-center">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((rule) => {
                  const grossSpread = Number(rule.grossSpread ?? (rule.chargedRate - rule.mdrRate));
                  const isGlobal = rule.scope === 'GLOBAL_DISK';
                  const isProducer = rule.scope === 'PRODUCER';
                  const isEvent = rule.scope === 'EVENT';

                  return (
                    <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. REGRA / MEIO DE PAGAMENTO */}
                      <td className="py-3 px-3.5">
                        <div className="font-extrabold text-slate-900">{rule.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {rule.brand || 'Todas as Bandeiras'} · {rule.installments || '1x'}
                        </div>
                      </td>

                      {/* 2. ADQUIRENTE */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{rule.acquirer}</span>
                        <div className="text-[10px] text-slate-400 font-medium">{rule.gateway || 'Gateway'}</div>
                      </td>

                      {/* 3. ABRANGÊNCIA / ESCOPO */}
                      <td className="py-3 px-3">
                        {isEvent ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Evento: {rule.eventName || 'Festival 2026'}
                          </span>
                        ) : isProducer ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            Produtor: {rule.producerName || 'Produtor VIP'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Geral Disk (Nível 1)
                          </span>
                        )}
                      </td>

                      {/* 4. TAXA COBRADA */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-slate-900 text-sm">
                          {Number(rule.chargedRate).toFixed(2).replace('.', ',')}%
                        </span>
                      </td>

                      {/* 5. CUSTO MDR DISK */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-slate-600">
                          {Number(rule.mdrRate).toFixed(2).replace('.', ',')}%
                        </span>
                      </td>

                      {/* 6. SPREAD LÍQUIDO */}
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {fmtPct(grossSpread)}
                        </span>
                      </td>

                      {/* 7. QUEM PAGA */}
                      <td className="py-3 px-3">
                        {rule.feePayer === 'BUYER_CONVENIENCE' ? (
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            Comprador (Conveniência)
                          </span>
                        ) : rule.feePayer === 'MIXED' ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Misto (Split)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            Produtor (Retenção)
                          </span>
                        )}
                      </td>

                      {/* 8. PRAZO */}
                      <td className="py-3 px-3 font-extrabold text-slate-700">
                        {rule.settlementTerm || 'D+30'}
                      </td>

                      {/* 9. VIGÊNCIA */}
                      <td className="py-3 px-3 text-[11px] text-slate-500 font-medium">
                        Desde {typeof rule.validFrom === 'string' ? rule.validFrom.split('T')[0] : '01/01/2026'}
                        {rule.version > 1 && (
                          <span className="ml-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded">
                            v{rule.version}
                          </span>
                        )}
                      </td>

                      {/* 10. STATUS */}
                      <td className="py-3 px-3">
                        {rule.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Ativa
                          </span>
                        ) : rule.status === 'PENDING_APPROVAL' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Aprovação
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Inativa
                          </span>
                        )}
                      </td>

                      {/* 11. AÇÕES */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditRuleModal(rule)}
                            title="Editar com versionamento imutável (v2)"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateRule(rule)}
                            title="Duplicar regra como rascunho"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleViewHistory(rule)}
                            title="Consultar histórico de versões e auditoria"
                            className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(rule)}
                            title={rule.status === 'ACTIVE' ? 'Inativar regra' : 'Reativar regra'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              rule.status === 'ACTIVE'
                                ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ABA: Simulador de Spread Líquido & Margem Transacional (Embutido na Tela) */}
      {(activeTab === 'simulador' || activeTab === 'indicadores') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Simulador de Spread Líquido & Margem Transacional
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cálculo financeiro puro baseado em basis points e centavos inteiros (sem risco de arredondamento em float)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              Simulador em Tempo Real
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Parâmetros do Simulador */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ticket Médio Simulado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simSaleAmount}
                  onChange={(e) => setSimSaleAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Taxa Comercial Cobrada (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simChargedRate}
                  onChange={(e) => setSimChargedRate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custo Adquirente Médio MDR (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simMdrRate}
                  onChange={(e) => setSimMdrRate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tarifa Fixa Adquirente (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={simFixedFee}
                  onChange={(e) => setSimFixedFee(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Resultado do Simulador em Cartão Verde */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-md border border-emerald-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Resultado Financeiro Apurado
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                  Spread Bruto: +{((simResult.grossSpreadBps || 520) / 100).toFixed(2)}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-300">Margem Líquida Disk por Ingresso:</div>
                <div className="text-3xl font-bold text-emerald-300">
                  {fmt((simResult.netMarginCents || 5200) / 100)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60 text-xs">
                <div>
                  <span className="text-slate-400">Receita da Taxa:</span>
                  <div className="font-bold text-white">{fmt((simResult.chargedFeeCents || 8000) / 100)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Custo MDR Adquirente:</span>
                  <div className="font-bold text-rose-300">{fmt((simResult.mdrCostCents || 2800) / 100)}</div>
                </div>
              </div>

              <p className="text-[10px] text-emerald-200/80 leading-relaxed pt-1">
                * Simulação matemática isolada. Não efetua movimentações bancárias nem altera o Ledger contábil.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. ABA: Políticas & Prazos */}
      {activeTab === 'politicas' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Políticas de Parcelamento, Split & Prazos de Liquidação
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Diretrizes de absorção de taxas, travas de segurança antifraude e prazos de conciliação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bloco 1: Parcelamento sem Juros */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                1
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">Parcelamento sem Juros</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opção onde os juros de parcelamento não são repassados ao comprador final. A taxa de parcelamento adicional pode ser absorvida pelo produtor ou pela taxa de conveniência Disk conforme contrato.
              </p>
            </div>

            {/* Bloco 2: Prazo Padrão de Recebimento */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                2
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">Prazo Padrão de Recebimento</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                As vendas em cartão de crédito são liquidadas pelas adquirentes em D+30 (ou antecipadas conforme contrato). Os repasses ao produtor respeitam rigorosamente o saldo disponível e obrigações retidas.
              </p>
            </div>

            {/* Bloco 3: Trava de Segurança Antifraude */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-bold">
                3
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">Trava Antifraude & Chargeback</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retenção preventiva de 5% sobre a carteira até o encerramento completo do evento. Garante cobertura de estornos, cancelamentos de compras e contestações sem expor o caixa próprio da Disk.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Princípio Financeiro Inviolável do Keeper ERP:
            </div>
            <p className="leading-relaxed">
              100% do dinheiro das vendas é recebido na conta de custódia (Escrow) da DiskIngressos. O conceito de split é tratado como <strong>desdobramento contábil interno no Ledger</strong>, garantindo que o dinheiro jamais seja liberado a terceiros sem prévia apropriação e conferência.
            </p>
          </div>
        </div>
      )}

      {/* 8. MODAL: + Nova Taxa / Regra Comercial & Edição Versionada (v2) — 17 CAMPOS DO VÍDEO */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-6">
            {/* Header do Modal */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-400" />
                  {editingRule ? `Editar Taxa - Versão v${(editingRule.version || 1) + 1}` : '+ Nova Taxa / Regra Comercial'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {editingRule
                    ? 'Ao salvar, uma nova versão imutável será criada preservando o histórico das vendas anteriores'
                    : 'Cadastro de parâmetros de MDR, taxas cobradas e vigência contratual'}
                </p>
              </div>
              <button
                onClick={() => setIsRuleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner de Auditoria e Versionamento (do vídeo) */}
            <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200/80 text-xs text-blue-900 flex items-center gap-2 font-medium">
              <History className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Auditoria e Versionamento Ativos:</strong> Qualquer alteração gera um novo registro versionado. Vendas já consolidadas continuarão vinculadas ao snapshot da regra vigente no momento da compra.
              </span>
            </div>

            {/* Formulário com os 17 campos */}
            <form onSubmit={handleSaveRule} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                {/* 1. Nome da Regra Comercial */}
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    1. Nome da Regra Comercial <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cartão de Crédito Parcelado (2 a 6x)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 14. Abrangência da Regra */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Abrangência / Escopo <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formScope}
                    onChange={(e) => setFormScope(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GLOBAL_DISK">Geral Disk (Nível 1)</option>
                    <option value="PRODUCER">Por Produtor (Nível 2)</option>
                    <option value="EVENT">Por Evento (Nível 3)</option>
                  </select>
                </div>

                {/* 15. Produtor / Evento Vinculado (se escopo for Produtor ou Evento) */}
                {formScope === 'PRODUCER' && (
                  <div className="sm:col-span-12">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Produtor Vinculado <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={formProducerId}
                      onChange={(e) => setFormProducerId(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {producerOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formScope === 'EVENT' && (
                  <>
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Produtor Vinculado
                      </label>
                      <select
                        value={formProducerId}
                        onChange={(e) => setFormProducerId(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        {producerOptions.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Evento Específico <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={formEventId}
                        onChange={(e) => setFormEventId(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        {eventOptions.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* 2. Adquirente / Gateway */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    2. Adquirente / Credenciadora <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formAcquirer}
                    onChange={(e) => setFormAcquirer(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Cielo">Cielo</option>
                    <option value="Rede">Rede (Itaú)</option>
                    <option value="Stone">Stone Pagamentos</option>
                    <option value="EfiPix">EfiPix (Pix Oficial)</option>
                    <option value="PagBank">PagBank</option>
                    <option value="Getnet">Getnet (Santander)</option>
                  </select>
                </div>

                {/* 3. Meio de Pagamento */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    3. Meio de Pagamento <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="CREDIT_INSTALLMENT_2_6">Cartão de Crédito Parcelado (2 a 6x)</option>
                    <option value="CREDIT_INSTALLMENT_7_12">Cartão de Crédito Parcelado (7 a 12x)</option>
                    <option value="CREDIT_CASH">Cartão de Crédito à Vista (1x)</option>
                    <option value="PIX">PIX Instantâneo</option>
                    <option value="DEBIT">Cartão de Débito (PDV / Web)</option>
                    <option value="BOLETO">Boleto Bancário</option>
                  </select>
                </div>

                {/* 4. Bandeira e 5. Parcelamento */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    4. Bandeira Aceita
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Visa, Mastercard, Elo, Todas..."
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    5. Faixa de Parcelamento
                  </label>
                  <input
                    type="text"
                    value={formInstallments}
                    onChange={(e) => setFormInstallments(e.target.value)}
                    placeholder="1x, 2x a 6x, 7x a 12x..."
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* 6. Custo MDR e 7. Taxa Cobrada */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    6. Custo MDR Disk (%) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formMdrRate}
                    onChange={(e) => setFormMdrRate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Custo descontado pela adquirente</span>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    7. Taxa Cobrada (%) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formChargedRate}
                    onChange={(e) => setFormChargedRate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-700"
                  />
                  <span className="text-[10px] text-slate-400">Taxa comercial acordada/praticada</span>
                </div>

                {/* BLOCO VERDE: Spread Bruto / Margem Líquida em Tempo Real */}
                <div className="sm:col-span-12 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      SPREAD BRUTO / MARGEM LÍQUIDA APURADA
                    </span>
                    <span className="text-sm font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      {fmtPct(previewSpread)}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    Fórmula observada no vídeo: <strong>Spread Bruto (%) = Taxa Cobrada ({previewCharged}%) - Custo MDR Disk ({previewMdr}%)</strong>.
                    Com tarifas fixas ou receitas adicionais, a margem líquida final é recomposta no fechamento de cada ingresso.
                  </p>
                </div>

                {/* 8. Tarifa Fixa, 9. Custos Adicionais, 10. Receita Fixa */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    8. Tarifa Fixa Adquirente (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formAcquirerFixedFee}
                    onChange={(e) => setFormAcquirerFixedFee(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    9. Custos Adicionais (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formAdditionalCost}
                    onChange={(e) => setFormAdditionalCost(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    10. Receita Fixa Comercial (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formFixedCommercialRevenue}
                    onChange={(e) => setFormFixedCommercialRevenue(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* 11. Tipo de Regra, 12. Quem Absorve a Taxa, 13. Prazo */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    11. Tipo de Regra
                  </label>
                  <select
                    value={formRuleType}
                    onChange={(e) => setFormRuleType(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="HYBRID">Híbrida (% + Fixa)</option>
                    <option value="PERCENTAGE">Percentual Puro</option>
                    <option value="FIXED">Valor Fixo</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    12. Quem Absorve a Taxa
                  </label>
                  <select
                    value={formFeePayer}
                    onChange={(e) => setFormFeePayer(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="BUYER_CONVENIENCE">Comprador (Conveniência)</option>
                    <option value="PRODUCER_RETENTION">Produtor (Retenção)</option>
                    <option value="MIXED">Misto (Split)</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    13. Prazo de Liquidação
                  </label>
                  <select
                    value={formSettlementTerm}
                    onChange={(e) => setFormSettlementTerm(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="D+0">D+0 (Instantâneo)</option>
                    <option value="D+1">D+1 (Próximo dia útil)</option>
                    <option value="D+2">D+2 (Boleto)</option>
                    <option value="D+7">D+7 (Semanal)</option>
                    <option value="D+14">D+14 (Quinzenal)</option>
                    <option value="D+30">D+30 (Padrão Crédito)</option>
                  </select>
                </div>

                {/* 16. Início e 17. Fim de Vigência */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    16. Início de Vigência <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formValidFrom}
                    onChange={(e) => setFormValidFrom(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    17. Fim de Vigência (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formValidTo}
                    onChange={(e) => setFormValidTo(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* Motivo da alteração / auditoria */}
                <div className="sm:col-span-12">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Motivo da Alteração / Justificativa para Auditoria
                  </label>
                  <input
                    type="text"
                    value={formChangeReason}
                    onChange={(e) => setFormChangeReason(e.target.value)}
                    placeholder="Ex: Repactuação contratual para temporada 2026..."
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Botões do Rodapé do Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar e Publicar Regra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: Simulador Financeiro de Spread & Rentabilidade com Resolução Hierárquica */}
      {isSimulationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Simulador Financeiro de Spread & Rentabilidade
                </h3>
                <p className="text-xs text-slate-400">
                  Resolução automática da hierarquia: Evento → Produtor → Geral Disk
                </p>
              </div>
              <button
                onClick={() => setIsSimulationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Valor de Venda Simulada (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={simModalSaleAmount}
                    onChange={(e) => setSimModalSaleAmount(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Meio de Pagamento
                  </label>
                  <select
                    value={simModalPaymentMethod}
                    onChange={(e) => setSimModalPaymentMethod(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="CREDIT_INSTALLMENT_2_6">Crédito Parcelado (2 a 6x)</option>
                    <option value="CREDIT_CASH">Crédito à Vista (1x)</option>
                    <option value="PIX">PIX Instantâneo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Produtor Contratante
                  </label>
                  <select
                    value={simModalProducer}
                    onChange={(e) => setSimModalProducer(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="all">Nenhum (Aplicar Geral Disk)</option>
                    {producerOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Evento Específico
                  </label>
                  <select
                    value={simModalEvent}
                    onChange={(e) => setSimModalEvent(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="all">Nenhum (Usar Produtor / Geral)</option>
                    {eventOptions.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Box de Resolução Hierárquica */}
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-700">Regra Aplicada por Hierarquia:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      modalSim.resolvedScope === 'EVENT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : modalSim.resolvedScope === 'PRODUCER'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    {modalSim.resolvedScope === 'EVENT'
                      ? 'Nível 1 • Evento'
                      : modalSim.resolvedScope === 'PRODUCER'
                      ? 'Nível 2 • Produtor'
                      : 'Nível 3 • Geral Disk'}
                  </span>
                </div>
                <div className="font-bold text-slate-900">{modalSim.appliedRule?.name}</div>
                <p className="text-[11px] text-slate-500">{modalSim.resolutionReason}</p>
              </div>

              {/* Card de Decomposição Financeira */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-xl border border-blue-900 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Venda</span>
                    <span className="text-sm font-bold text-white">{fmt(modalSim.saleVal)}</span>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Taxa ({modalSim.chargedPct}%)</span>
                    <span className="text-sm font-bold text-blue-300">{fmt(modalSim.chargedFeeAmount)}</span>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">MDR ({modalSim.mdrPct}%)</span>
                    <span className="text-sm font-bold text-rose-300">{fmt(modalSim.mdrCostAmount)}</span>
                  </div>
                  <div className="p-2 bg-emerald-900/60 rounded-lg border border-emerald-500/50">
                    <span className="text-[10px] text-emerald-300 font-bold block uppercase">Spread (+{modalSim.spreadPct}%)</span>
                    <span className="text-sm font-bold text-emerald-300">{fmt(modalSim.netMarginAmount)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed border-t border-white/10 pt-2">
                  <strong>Classificação:</strong> Quem absorve a taxa neste meio é{' '}
                  <span className="text-emerald-300 font-bold">
                    {modalSim.appliedRule?.feePayer === 'BUYER_CONVENIENCE'
                      ? 'o Comprador (adicionado ao total)'
                      : 'o Produtor (descontado do split repassado)'}
                  </span>
                  . O valor líquido creditado na conta DiskIngressos é de{' '}
                  <strong>{fmt(modalSim.saleVal - modalSim.mdrCostAmount)}</strong>.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulationModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Fechar Simulador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: Central de Aprovações (7 Regras Pendentes do Vídeo) */}
      {isApprovalsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Central de Aprovações de Regras Comerciais
                </h3>
                <p className="text-xs text-indigo-200">
                  7 solicitações de alteração de taxas aguardando homologação da Diretoria Financeira
                </p>
              </div>
              <button
                onClick={() => setIsApprovalsModalOpen(false)}
                className="text-indigo-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { id: 'app-1', rule: 'Redução de MDR para Pix Safra', author: 'Carlos Eduardo', date: 'Hoje às 10:15', scope: 'GLOBAL_DISK', change: 'MDR 0,40% -> 0,35%' },
                { id: 'app-2', rule: 'Taxa VIP Festival Rock Nacional', author: 'Gerência de Contratos', date: 'Hoje às 09:30', scope: 'EVENT', change: 'Taxa Disk 7,50% (D+7)' },
                { id: 'app-3', rule: 'Desconto de Volume Opus Entretenimento', author: 'Diretoria Comercial', date: 'Ontem às 17:40', scope: 'PRODUCER', change: 'Spread Comercial 2,80%' },
                { id: 'app-4', rule: 'Campanha Black Friday Curitiba 2026', author: 'Marketing / Comercial', date: '06/10/2026', scope: 'EVENT', change: 'Parcelado 12x com absorção mista' },
                { id: 'app-5', rule: 'Ajuste de Tarifa Fixa de Boleto Bradesco', author: 'Controladoria Disk', date: '05/10/2026', scope: 'GLOBAL_DISK', change: 'Tarifa R$ 2,50 -> R$ 2,30' },
                { id: 'app-6', rule: 'Isenção de Taxa de Conveniência Show Beneficente', author: 'Responsabilidade Social', date: '04/10/2026', scope: 'EVENT', change: 'Taxa 0% (Apenas MDR repassado)' },
                { id: 'app-7', rule: 'Renovação Acordo Anual Teatro Guaíra', author: 'Gerência de Contratos', date: '02/10/2026', scope: 'PRODUCER', change: 'Taxa Fixa 8% em todas as vendas' },
              ].map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{item.rule}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.scope}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Solicitante: <strong>{item.author}</strong> · {item.date} · Proposta: <span className="font-bold text-slate-700">{item.change}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        alert(`Aprovação registrada para "${item.rule}". Regra homologada no motor de apropriação.`);
                        setIsApprovalsModalOpen(false);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => {
                        alert(`Solicitação "${item.rule}" devolvida para revisão.`);
                        setIsApprovalsModalOpen(false);
                      }}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsApprovalsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Fechar Central
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: Histórico de Versões & Auditoria Imutável */}
      {isHistoryModalOpen && selectedHistoryRule && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-6">
            <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-300" />
                  Histórico de Versões e Auditoria
                </h3>
                <p className="text-xs text-purple-200">
                  {selectedHistoryRule.name || 'Regra Comercial'} (Versão Atual: v{selectedHistoryRule.version || 1})
                </p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-purple-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed bg-purple-50 p-3 rounded-xl border border-purple-200">
                🔒 <strong>Imutabilidade Garantida:</strong> As versões passadas não são recalculadas retroativamente. Vendas de ingressos efetuadas sob a vigência da v1 permanecerão permanentemente escrituradas sob as alíquotas originais.
              </div>

              {/* Linha do Tempo */}
              <div className="space-y-3 relative pl-6 border-l-2 border-purple-200 ml-2">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></span>
                  <div className="text-xs font-bold text-slate-900">
                    Versão Atual (v{selectedHistoryRule.version || 2}) • Em Vigor
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Publicada em 01/03/2026 por <strong>{selectedHistoryRule.authorName || 'Diretoria Financeira'}</strong>
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">
                    Taxa: {selectedHistoryRule.chargedRate}% · MDR: {selectedHistoryRule.mdrRate}% · Spread: +{selectedHistoryRule.grossSpread}%
                  </div>
                </div>

                <div className="relative pt-3">
                  <span className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-100"></span>
                  <div className="text-xs font-bold text-slate-700">
                    Versão Anterior (v1) • Arquivada para Auditoria
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Vigência: 15/02/2026 a 28/02/2026 · Autor: Carlos Eduardo
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-1">
                    Taxa: 4,20% · MDR: 2,00% · Spread: +2,20%
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Fechar Histórico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
