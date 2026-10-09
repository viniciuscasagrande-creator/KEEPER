import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Landmark,
  WalletCards,
  Percent,
  Layers,
  Wallet,
  FileText,
  Settings2,
  ShieldCheck,
  ShieldAlert,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Server,
  Key,
  Sliders,
  DollarSign,
  Clock,
  ArrowRightLeft,
  Store,
  Check,
  X,
  Zap,
  Activity,
  Shield,
  SlidersHorizontal,
  Flame,
  CheckCheck,
} from 'lucide-react';

export const gatewaySections = [
  {
    id: 'gw-gateways',
    label: 'Gateways',
    icon: Layers,
    description: 'Integrações, credenciais seguras, ambientes, webhooks e status técnico dos provedores.',
  },
  {
    id: 'gw-adquirentes',
    label: 'Adquirentes',
    icon: Landmark,
    description: 'Cadastro das adquirentes parceiras, contratos vigentes e contas de liquidação da Disk.',
  },
  {
    id: 'gw-bandeiras',
    label: 'Bandeiras',
    icon: CreditCard,
    description: 'Bandeiras de cartões aceitas, roteamento inteligente e modalidades de débito e crédito.',
  },
  {
    id: 'gw-mdr',
    label: 'MDR',
    icon: Percent,
    description: 'Taxas de custo de processamento cobradas pelas adquirentes por modalidade e parcelamento.',
  },
  {
    id: 'gw-parcelamento',
    label: 'Parcelamento',
    icon: WalletCards,
    description: 'Condições de parcelamento em até 12x, regras de juros do comprador vs produtor e limites.',
  },
  {
    id: 'gw-metodos',
    label: 'Métodos de Pagamento',
    icon: Wallet,
    description: 'PIX (D+0), Cartão de Crédito, Boleto (D+1) e PDVs físicos por canal de venda.',
  },
  {
    id: 'gw-regras',
    label: 'Regras Comerciais',
    icon: FileText,
    description: 'Parametrização 1:1 de taxas por evento, separando custo MDR da remuneração Disk.',
  },
  {
    id: 'gw-customizados',
    label: 'Pagamentos Customizados',
    icon: Settings2,
    description: 'Splits especiais, retenções sob medida para megaeventos e alçadas de aprovação da diretoria.',
  },
] as const;

export type GatewaySectionId = typeof gatewaySections[number]['id'];

export interface GatewayItem {
  id: string;
  name: string;
  providerType: 'ADQUIRENTE' | 'SUBADQUIRENTE' | 'BANCO_PIX';
  environment: 'PRODUCAO' | 'SANDBOX';
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  hmacSecret: string;
  timeoutMs: number;
  retryAttempts: number;
  status: 'ONLINE' | 'STANDBY' | 'HOMOLOGACAO';
  pingMs: number;
  initials: string;
  colorClass: string;
  code: string;
}

export interface MDRRuleItem {
  id: string;
  modality: string;
  liquidationPeriod: string;
  feePercentage: number;
  feeText: string;
  responsibleParty: 'Produtor' | 'Comprador' | 'DiskIngressos';
  cardBrand: string;
  acquirer: string;
  splitInterest: boolean;
}

export interface RoutingAntifraudConfig {
  antifraudEngine: string;
  autoApproveScore: number;
  manualReviewScore: number;
  autoRejectScore: number;
  primaryGateway: string;
  fallbackGateway: string;
  failoverTimeoutMs: number;
  chargebackEscrowPercent: number;
  escrowHoldDays: number;
  require3DSAbove: number;
  allowRetryDifferentBrand: boolean;
}

interface GatewaysModuleViewProps {
  activeSection?: string;
  onSelectSection?: (id: GatewaySectionId) => void;
}

export function GatewaysModuleView({ activeSection, onSelectSection }: GatewaysModuleViewProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState<GatewaySectionId>('gw-gateways');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // MDR Calculator state
  const [simAmount, setSimAmount] = useState<string>('1.000,00');
  const [simModality, setSimModality] = useState<string>('CREDITO_VISTA');

  // Modal 1: Configuração de Nova Credenciadora / Gateway
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [gatewayForm, setGatewayForm] = useState<Partial<GatewayItem>>({
    name: 'Stone Pagamentos v2',
    providerType: 'ADQUIRENTE',
    environment: 'PRODUCAO',
    publicKey: 'pk_live_stone_89128391273',
    secretKey: 'sk_live_stone_sec_9918237198273',
    webhookUrl: '/api/v1/financeiro/webhook/sale-approved',
    hmacSecret: 'sha256_sec_e8b91c28f3a9e01d',
    timeoutMs: 800,
    retryAttempts: 3,
    status: 'ONLINE',
    initials: 'ST',
    colorClass: 'emerald',
    code: 'gw_stone_prod',
  });

  // Dynamic Gateways List
  const [gatewaysList, setGatewaysList] = useState<GatewayItem[]>([
    {
      id: 'gw-pagarme',
      name: 'Pagar.me v5 (StoneCo)',
      providerType: 'SUBADQUIRENTE',
      environment: 'PRODUCAO',
      publicKey: 'pk_live_8912389128391',
      secretKey: 'sk_live_9918237198273918',
      webhookUrl: '/api/v1/financeiro/webhook/sale-approved',
      hmacSecret: 'sha256_sec_9918f0a1c238b',
      timeoutMs: 650,
      retryAttempts: 3,
      status: 'ONLINE',
      pingMs: 32,
      initials: 'PM',
      colorClass: 'blue',
      code: 'gw_pagarme_prod',
    },
    {
      id: 'gw-mercadopago',
      name: 'Mercado Pago Checkout Pro',
      providerType: 'SUBADQUIRENTE',
      environment: 'PRODUCAO',
      publicKey: 'APP_USR-78192019-a1',
      secretKey: 'APP_USR-99120938102938-sec',
      webhookUrl: '/api/v1/financeiro/webhook/sale-approved',
      hmacSecret: 'sha256_sec_mp_0912ab56e',
      timeoutMs: 750,
      retryAttempts: 2,
      status: 'ONLINE',
      pingMs: 48,
      initials: 'MP',
      colorClass: 'sky',
      code: 'gw_mercadopago_prod',
    },
    {
      id: 'gw-cielo',
      name: 'Cielo 3.0 Ecommerce API',
      providerType: 'ADQUIRENTE',
      environment: 'PRODUCAO',
      publicKey: 'cielo_merchant_id_99012a',
      secretKey: 'cielo_merchant_key_sec_88192',
      webhookUrl: '/api/v1/financeiro/webhook/cielo-notify',
      hmacSecret: 'sha256_sec_cielo_449102c',
      timeoutMs: 600,
      retryAttempts: 3,
      status: 'ONLINE',
      pingMs: 28,
      initials: 'CI',
      colorClass: 'cyan',
      code: 'gw_cielo_prod',
    },
    {
      id: 'gw-rede',
      name: 'e-Rede (Itaú Unibanco)',
      providerType: 'ADQUIRENTE',
      environment: 'PRODUCAO',
      publicKey: 'pv_rede_8910293',
      secretKey: 'token_rede_sec_771920381',
      webhookUrl: '/api/v1/financeiro/webhook/rede-callback',
      hmacSecret: 'sha256_sec_rede_11892aa',
      timeoutMs: 700,
      retryAttempts: 2,
      status: 'ONLINE',
      pingMs: 35,
      initials: 'RD',
      colorClass: 'amber',
      code: 'gw_rede_prod',
    },
  ]);

  // Modal 2: Matriz de MDR por Bandeira
  const [isMDRModalOpen, setIsMDRModalOpen] = useState(false);
  const [mdrForm, setMdrForm] = useState<Partial<MDRRuleItem>>({
    modality: 'Crédito à Vista (1x)',
    liquidationPeriod: 'D+30 Corridos',
    feePercentage: 2.49,
    feeText: '2,49%',
    responsibleParty: 'Produtor',
    cardBrand: 'Visa & Mastercard',
    acquirer: 'Cielo S.A.',
    splitInterest: false,
  });

  const [mdrRules, setMdrRules] = useState<MDRRuleItem[]>([
    {
      id: 'mdr-debito',
      modality: 'Cartão de Débito Nacional',
      liquidationPeriod: 'D+1 Útil',
      feePercentage: 1.19,
      feeText: '1,19%',
      responsibleParty: 'Produtor',
      cardBrand: 'Visa, Master, Elo',
      acquirer: 'Cielo / Stone',
      splitInterest: false,
    },
    {
      id: 'mdr-credito-vista',
      modality: 'Crédito à Vista (1x)',
      liquidationPeriod: 'D+30 Corridos',
      feePercentage: 2.49,
      feeText: '2,49%',
      responsibleParty: 'Produtor',
      cardBrand: 'Visa, Master, Elo, Amex',
      acquirer: 'Cielo / Rede',
      splitInterest: false,
    },
    {
      id: 'mdr-parc-2-6',
      modality: 'Crédito Parcelado (2x a 6x)',
      liquidationPeriod: 'D+30 Parcelado',
      feePercentage: 3.19,
      feeText: '3,19%',
      responsibleParty: 'Comprador',
      cardBrand: 'Visa, Master, Elo, Hipercard',
      acquirer: 'Stone / Pagar.me',
      splitInterest: true,
    },
    {
      id: 'mdr-parc-7-12',
      modality: 'Crédito Parcelado (7x a 12x)',
      liquidationPeriod: 'D+30 Parcelado',
      feePercentage: 3.89,
      feeText: '3,89%',
      responsibleParty: 'Comprador',
      cardBrand: 'Visa, Master, Elo',
      acquirer: 'Stone / Pagar.me',
      splitInterest: true,
    },
    {
      id: 'mdr-pix',
      modality: 'PIX Cobrança Instantâneo',
      liquidationPeriod: 'D+0 Instantâneo',
      feePercentage: 0.79,
      feeText: '0,79% (teto R$ 5,00)',
      responsibleParty: 'DiskIngressos',
      cardBrand: 'Banco Central PIX',
      acquirer: 'Itaú Unibanco',
      splitInterest: false,
    },
  ]);

  // Modal 3: Regras de Roteamento Inteligente & Antifraude
  const [isRoutingModalOpen, setIsRoutingModalOpen] = useState(false);
  const [routingConfig, setRoutingConfig] = useState<RoutingAntifraudConfig>({
    antifraudEngine: 'ClearSale Total (Garantia de Chargeback)',
    autoApproveScore: 82,
    manualReviewScore: 50,
    autoRejectScore: 49,
    primaryGateway: 'Pagar.me v5 (StoneCo)',
    fallbackGateway: 'Cielo 3.0 Ecommerce API',
    failoverTimeoutMs: 800,
    chargebackEscrowPercent: 5.0,
    escrowHoldDays: 90,
    require3DSAbove: 200,
    allowRetryDifferentBrand: true,
  });

  const activeId: GatewaySectionId =
    (gatewaySections.find((s) => s.id === activeSection)?.id as GatewaySectionId) ?? selectedSection;
  const currentSection = gatewaySections.find((s) => s.id === activeId)!;

  const handleSelect = (id: GatewaySectionId) => {
    setSelectedSection(id);
    onSelectSection?.(id);
  };

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // Test Ping in Modal
  const handleTestPingInModal = () => {
    setTestingPing(true);
    setPingResult(null);
    setTimeout(() => {
      setTestingPing(false);
      const simulatedMs = Math.floor(Math.random() * 25) + 22;
      setPingResult(`Ping homologado com sucesso! Resposta em ${simulatedMs}ms via TLS 1.3.`);
    }, 600);
  };

  // Generate secure HMAC
  const handleGenerateHMAC = () => {
    const chars = 'abcdef0123456789';
    let rand = '';
    for (let i = 0; i < 24; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    const newHmac = `sha256_sec_${rand}`;
    setGatewayForm((prev) => ({ ...prev, hmacSecret: newHmac }));
    notify('Nova chave secreta HMAC gerada com sucesso.');
  };

  // Submit Gateway Form
  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatewayForm.name) return;

    const newGw: GatewayItem = {
      id: `gw-${Date.now()}`,
      name: gatewayForm.name,
      providerType: gatewayForm.providerType || 'ADQUIRENTE',
      environment: gatewayForm.environment || 'PRODUCAO',
      publicKey: gatewayForm.publicKey || 'pk_live_default',
      secretKey: gatewayForm.secretKey || 'sk_live_default',
      webhookUrl: gatewayForm.webhookUrl || '/api/v1/financeiro/webhook/sale-approved',
      hmacSecret: gatewayForm.hmacSecret || 'sha256_sec_custom',
      timeoutMs: Number(gatewayForm.timeoutMs) || 800,
      retryAttempts: Number(gatewayForm.retryAttempts) || 3,
      status: gatewayForm.status || 'ONLINE',
      pingMs: Math.floor(Math.random() * 20) + 25,
      initials: (gatewayForm.name.slice(0, 2)).toUpperCase(),
      colorClass: gatewayForm.providerType === 'ADQUIRENTE' ? 'cyan' : 'blue',
      code: gatewayForm.code || `gw_${gatewayForm.name.toLowerCase().replace(/\s+/g, '_')}`,
    };

    setGatewaysList((prev) => [newGw, ...prev]);
    setIsGatewayModalOpen(false);
    notify(`Gateway "${newGw.name}" cadastrado e ativado na esteira de pagamentos!`);
  };

  // Submit MDR Form
  const handleSaveMDR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mdrForm.modality) return;

    const feeNum = Number(mdrForm.feePercentage) || 0;
    const newRule: MDRRuleItem = {
      id: `mdr-${Date.now()}`,
      modality: mdrForm.modality,
      liquidationPeriod: mdrForm.liquidationPeriod || 'D+30 Corridos',
      feePercentage: feeNum,
      feeText: `${feeNum.toFixed(2).replace('.', ',')}%`,
      responsibleParty: mdrForm.responsibleParty || 'Produtor',
      cardBrand: mdrForm.cardBrand || 'Visa & Master',
      acquirer: mdrForm.acquirer || 'Cielo S.A.',
      splitInterest: !!mdrForm.splitInterest,
    };

    setMdrRules((prev) => [newRule, ...prev]);
    setIsMDRModalOpen(false);
    notify(`Regra MDR "${newRule.modality}" parametrizada com taxa de ${newRule.feeText}!`);
  };

  // Submit Routing Config
  const handleSaveRouting = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRoutingModalOpen(false);
    notify(
      `Diretrizes de Antifraude (${routingConfig.antifraudEngine}) e Fallback (${routingConfig.primaryGateway} → ${routingConfig.fallbackGateway}) aplicadas com sucesso!`
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {actionSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Main Container Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5 items-start">
        {/* ========================================================================= */}
        {/* 1. SIDEBAR COM IDENTIDADE VISUAL KEEPER */}
        {/* ========================================================================= */}
        <aside className="bg-[#0b1329] text-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-800 self-start">
          {/* Header da Barra Lateral */}
          <div className="relative flex items-center justify-between p-3.5 bg-[#0f1b3b] border-b border-slate-800/80">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-r"></div>

            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
                <Settings2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Gateways e Adquirentes
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Configurações & Meios de Pagamento</p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarExpanded((prev) => !prev)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isSidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isSidebarExpanded ? '' : '-rotate-90'}`}
              />
            </button>
          </div>

          {/* Submenus com Timeline Tree Connectors */}
          {isSidebarExpanded && (
            <nav className="p-3 relative">
              <div className="absolute left-[26px] top-6 bottom-6 w-[1.5px] bg-slate-700/60 z-0"></div>

              <div className="space-y-1.5 relative z-10">
                {gatewaySections.map(({ id, label, icon: Icon }) => {
                  const isActive = activeId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelect(id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full border shrink-0 transition-all ${
                          isActive
                            ? 'bg-white border-blue-300 ring-2 ring-blue-400/50'
                            : 'bg-slate-900 border-slate-600 group-hover:border-slate-400'
                        }`}
                      ></span>

                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                          isActive ? 'text-white opacity-100' : 'text-slate-500 opacity-60 group-hover:opacity-100'
                        }`}
                      />

                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                        }`}
                      />

                      <span className="flex-1 tracking-tight truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Rodapé da Barra Lateral com Alerta de Governança */}
          <div className="p-3 bg-[#080d1c] border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <LockKeyhole className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Perfil: Financeiro Disk & Diretoria</span>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 2. ÁREA DE CONTEÚDO OPERACIONAL DAS 8 TELAS */}
        {/* ========================================================================= */}
        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7 min-h-[580px] space-y-6">
          {/* Breadcrumb e Cabeçalho do Submenu Ativo */}
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Financeiro</span>
                <span>/</span>
                <span>Gateways e Adquirentes</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{currentSection.label}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <currentSection.icon className="w-6 h-6 text-blue-600" />
                {currentSection.label}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{currentSection.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRoutingModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Roteamento Inteligente & Motor Antifraude"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Antifraude & Roteamento</span>
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Modelo Escrow Ativo</span>
              </span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* TELA 1: GATEWAYS (Integrações e Webhooks) */}
          {/* ===================================================================== */}
          {activeId === 'gw-gateways' && (
            <div className="space-y-5">
              {/* KPIs de Gateway */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Gateways Integrados</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{gatewaysList.length} Provedores</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 truncate">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">Todos em Produção / Escrow</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Ambiente de Operação</span>
                  <div className="text-2xl font-black text-blue-600 mt-0.5">Produção</div>
                  <span className="text-[11px] text-slate-500 mt-1">Multi-redundância ativa</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Latência Média de Webhook</span>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">34 ms</div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1">Uptime 99,99%</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Assinatura HMAC</span>
                  <div className="text-2xl font-black text-indigo-600 mt-0.5">SHA-256</div>
                  <span className="text-[11px] text-indigo-700 font-semibold mt-1">Anti-replay ativo</span>
                </div>
              </div>

              {/* Lista de Gateways Configurados */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Provedores de Checkout e API</h3>
                    <p className="text-xs text-slate-500">Credenciais criptografadas e webhooks de liquidação em tempo real.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsGatewayModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Gateway / Adquirente</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gatewaysList.map((gw) => (
                    <div
                      key={gw.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${
                              gw.colorClass === 'blue'
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : gw.colorClass === 'sky'
                                ? 'bg-sky-50 border-sky-200 text-sky-700'
                                : gw.colorClass === 'cyan'
                                ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                                : gw.colorClass === 'amber'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}
                          >
                            {gw.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{gw.name}</h4>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {gw.code}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {gw.status} · {gw.environment === 'PRODUCAO' ? 'Produção' : 'Sandbox'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Chave de API Pública:</span>
                          <span className="font-mono text-slate-700 font-medium truncate max-w-[200px]">
                            {gw.publicKey}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Chave Secreta:</span>
                          <div className="flex items-center gap-1 font-mono text-slate-700">
                            <span>
                              {showApiKey[gw.id] ? gw.secretKey : '••••••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => setShowApiKey((p) => ({ ...p, [gw.id]: !p[gw.id] }))}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title={showApiKey[gw.id] ? 'Ocultar' : 'Exibir chave secreta'}
                            >
                              {showApiKey[gw.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Webhook URL:</span>
                          <span className="font-mono text-slate-700 truncate max-w-[200px]" title={gw.webhookUrl}>
                            {gw.webhookUrl}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-50">
                          <span>HMAC SHA-256: <code className="font-mono text-slate-600">{gw.hmacSecret.slice(0, 16)}...</code></span>
                          <span className="text-slate-600 font-mono">Timeout: {gw.timeoutMs}ms</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => notify(`Ping enviado a ${gw.name}: Conexão OK (${gw.pingMs}ms)!`)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Testar Ping ({gw.pingMs}ms)
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText?.(gw.webhookUrl);
                              notify(`URL do Webhook (${gw.webhookUrl}) copiada!`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                            title="Copiar Webhook"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 2: ADQUIRENTES (Cadastro e Contratos) */}
          {/* ===================================================================== */}
          {activeId === 'gw-adquirentes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Contratos de Adquirentes Homologados</h3>
                  <p className="text-xs text-slate-500">
                    Conta de liquidação vinculada obrigatoriamente à Tesouraria da DiskIngressos.
                  </p>
                </div>
                <button
                  onClick={() => setIsGatewayModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Nova Adquirente / Gateway
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Adquirente</th>
                      <th className="py-2.5 px-4">CNPJ / Razão Social</th>
                      <th className="py-2.5 px-4">Nº Contrato</th>
                      <th className="py-2.5 px-4">Conta de Liquidação Disk</th>
                      <th className="py-2.5 px-4">Vigência</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cielo S.A.
                      </td>
                      <td className="py-3 px-4 text-slate-600">01.027.058/0001-91</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">CTR-2025-CIELO-01</td>
                      <td className="py-3 px-4 text-blue-700 font-mono font-semibold">Itaú Ag 0422 / CC 99012-3 (Escrow)</td>
                      <td className="py-3 px-4 text-slate-500">Até 31/12/2027</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          Ativo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Rede (Itaú Unibanco)
                      </td>
                      <td className="py-3 px-4 text-slate-600">01.425.787/0001-04</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">CTR-2025-REDE-09</td>
                      <td className="py-3 px-4 text-blue-700 font-mono font-semibold">Itaú Ag 0422 / CC 99012-3 (Escrow)</td>
                      <td className="py-3 px-4 text-slate-500">Até 30/06/2028</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          Ativo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stone Pagamentos
                      </td>
                      <td className="py-3 px-4 text-slate-600">16.501.555/0001-57</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">CTR-2026-STONE-44</td>
                      <td className="py-3 px-4 text-blue-700 font-mono font-semibold">Itaú Ag 0422 / CC 99012-3 (Escrow)</td>
                      <td className="py-3 px-4 text-slate-500">Até 31/10/2027</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          Ativo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> PagBank (PagSeguro)
                      </td>
                      <td className="py-3 px-4 text-slate-600">08.561.701/0001-01</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">CTR-2026-PAGB-12</td>
                      <td className="py-3 px-4 text-blue-700 font-mono font-semibold">Itaú Ag 0422 / CC 99012-3 (Escrow)</td>
                      <td className="py-3 px-4 text-slate-500">Até 31/12/2027</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          Ativo
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 3: BANDEIRAS (Bandeiras e Roteamento) */}
          {/* ===================================================================== */}
          {activeId === 'gw-bandeiras' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Bandeiras Homologadas & Roteamento Inteligente</h3>
                  <p className="text-xs text-slate-500">
                    Definição de adquirente primária e secundária para alta conversão em picos de vendas.
                  </p>
                </div>
                <button
                  onClick={() => setIsRoutingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Configurar Roteamento & Fallback</span>
                </button>
              </div>

              {/* Status do Antifraude Banner */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Motor Ativo: <strong>{routingConfig.antifraudEngine}</strong> | Primária:{' '}
                    <strong>{routingConfig.primaryGateway}</strong> | Fallback:{' '}
                    <strong>{routingConfig.fallbackGateway}</strong> ({routingConfig.failoverTimeoutMs}ms)
                  </span>
                </div>
                <span className="font-semibold text-[11px] bg-white px-2 py-0.5 rounded border border-indigo-200">
                  Corte: Score {routingConfig.autoApproveScore}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  { name: 'Visa', primary: 'Cielo S.A.', fallback: 'Rede', fee: '2,39%', status: 'Ativo' },
                  { name: 'Mastercard', primary: 'Rede', fallback: 'Stone', fee: '2,39%', status: 'Ativo' },
                  { name: 'Elo Nacional', primary: 'Cielo S.A.', fallback: 'Stone', fee: '2,69%', status: 'Ativo' },
                  { name: 'American Express', primary: 'Cielo S.A.', fallback: 'Rede', fee: '3,10%', status: 'Ativo' },
                  { name: 'Hipercard', primary: 'Rede', fallback: 'Cielo S.A.', fee: '2,90%', status: 'Ativo' },
                  { name: 'PIX (Banco Central)', primary: 'Itaú Unibanco', fallback: 'Stone', fee: '0,79%', status: 'Ativo' },
                ].map((b) => (
                  <div key={b.name} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        {b.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        {b.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Adquirente Primária:</span>
                        <span className="font-semibold text-slate-800">{b.primary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fallback Automático:</span>
                        <span className="font-semibold text-slate-700">{b.fallback}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-400">MDR Médio:</span>
                        <span className="font-bold text-blue-700 font-mono">{b.fee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 4: MDR (Taxas das Adquirentes) */}
          {/* ===================================================================== */}
          {activeId === 'gw-mdr' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tabela Contratual de Custos MDR</h3>
                  <p className="text-xs text-slate-500">
                    O MDR é custo de processamento da adquirente e não se confunde com a taxa comercial da DiskIngressos.
                  </p>
                </div>
                <button
                  onClick={() => setIsMDRModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Parametrizar Nova Regra MDR</span>
                </button>
              </div>

              {/* Tabela de Taxas MDR Dinâmica */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Modalidade de Pagamento</th>
                      <th className="py-2.5 px-4">Bandeira / Adquirente</th>
                      <th className="py-2.5 px-4">Prazo de Liquidação</th>
                      <th className="py-2.5 px-4 text-right">Taxa MDR Contratual</th>
                      <th className="py-2.5 px-4 text-center">Responsável pelo Custo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {mdrRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-sans font-bold text-slate-900">{rule.modality}</td>
                        <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">
                          {rule.cardBrand} <span className="text-slate-400">({rule.acquirer})</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{rule.liquidationPeriod}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800">{rule.feeText}</td>
                        <td className="py-3 px-4 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rule.responsibleParty === 'Produtor'
                                ? 'bg-blue-50 text-blue-800'
                                : rule.responsibleParty === 'Comprador'
                                ? 'bg-purple-50 text-purple-800'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {rule.responsibleParty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Simulador Rápido de MDR */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Simulador de Custo MDR por Transação
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Valor da Venda (R$)</label>
                    <input
                      type="text"
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Modalidade</label>
                    <select
                      value={simModality}
                      onChange={(e) => setSimModality(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                    >
                      <option value="PIX">PIX (0,79%)</option>
                      <option value="DEBITO">Débito (1,19%)</option>
                      <option value="CREDITO_VISTA">Crédito à Vista (2,49%)</option>
                      <option value="PARC_6">Parcelado 2x a 6x (3,19%)</option>
                      <option value="PARC_12">Parcelado 7x a 12x (3,89%)</option>
                    </select>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col justify-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Custo MDR Estimado:</span>
                    <span className="text-sm font-black text-rose-600 font-mono">
                      {(() => {
                        const raw = parseFloat(simAmount.replace(/\./g, '').replace(',', '.')) || 0;
                        const rate =
                          simModality === 'PIX'
                            ? 0.0079
                            : simModality === 'DEBITO'
                            ? 0.0119
                            : simModality === 'CREDITO_VISTA'
                            ? 0.0249
                            : simModality === 'PARC_6'
                            ? 0.0319
                            : 0.0389;
                        return fmt(raw * rate);
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 5: PARCELAMENTO */}
          {/* ===================================================================== */}
          {activeId === 'gw-parcelamento' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Políticas de Parcelamento por Evento</h3>
                  <p className="text-xs text-slate-500">
                    Definição de número máximo de parcelas, juros e valor mínimo de prestação.
                  </p>
                </div>
                <button
                  onClick={() => notify('Configurações globais de parcelamento atualizadas com sucesso!')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Atualizar Parâmetros</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">Limite de Parcelamento</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">Até 12x</div>
                  <p className="text-xs text-slate-500">Válido para vendas online no site e app mobile.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">Valor Mínimo da Parcela</span>
                  <div className="text-2xl font-black text-blue-600 font-mono">R$ 30,00</div>
                  <p className="text-xs text-slate-500">Impede parcelamento de tickets de baixo valor.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase">Juros ao Comprador</span>
                  <div className="text-2xl font-black text-purple-600 font-mono">1,99% a.m.</div>
                  <p className="text-xs text-slate-500">Taxa repassada ao comprador nas compras a prazo.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Tabela de Coeficientes de Parcelamento</h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
                  {[
                    { p: '1x', j: '0,00%' },
                    { p: '2x', j: '3,98%' },
                    { p: '3x', j: '5,97%' },
                    { p: '4x', j: '7,96%' },
                    { p: '5x', j: '9,95%' },
                    { p: '6x', j: '11,94%' },
                    { p: '7x', j: '13,93%' },
                    { p: '8x', j: '15,92%' },
                    { p: '9x', j: '17,91%' },
                    { p: '10x', j: '19,90%' },
                    { p: '11x', j: '21,89%' },
                    { p: '12x', j: '23,88%' },
                  ].map((x) => (
                    <div key={x.p} className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                      <span className="font-bold text-slate-800 block">{x.p}</span>
                      <span className="text-slate-500 text-[11px]">{x.j}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 6: MÉTODOS DE PAGAMENTO */}
          {/* ===================================================================== */}
          {activeId === 'gw-metodos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Canais e Modalidades de Pagamento</h3>
                  <p className="text-xs text-slate-500">Ativação de formas de pagamento no checkout e PDVs físicos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'PIX Instantâneo (D+0)',
                    desc: 'QR Code dinâmico com expiração de 15 minutos e conciliação bancária imediata.',
                    channels: 'Site, App, PDV',
                    active: true,
                  },
                  {
                    name: 'Cartão de Crédito com 3DS 2.0',
                    desc: 'Autenticação forte antifraude para cartões Visa, Master, Elo e Amex.',
                    channels: 'Site, App',
                    active: true,
                  },
                  {
                    name: 'Boleto Bancário Registrado (D+1)',
                    desc: 'Compensação no dia útil seguinte via CIP / Febraban.',
                    channels: 'Site (até 5 dias antes)',
                    active: true,
                  },
                  {
                    name: 'Cartão de Débito (PDV Físico)',
                    desc: 'Transações presenciais nas bilheterias e pontos autorizados DiskIngressos.',
                    channels: 'Apenas Bilheteria / PDV',
                    active: true,
                  },
                ].map((m) => (
                  <div key={m.name} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Ativo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{m.desc}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Canais: <strong>{m.channels}</strong></span>
                      <button
                        onClick={() => notify(`Parâmetros de ${m.name} sincronizados com o motor de checkout!`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        Configurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 7: REGRAS COMERCIAIS */}
          {/* ===================================================================== */}
          {activeId === 'gw-regras' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Regras Comerciais Negociadas por Evento</h3>
                  <p className="text-xs text-slate-500">
                    O produtor possui condições personalizadas por evento. O MDR nunca se mistura com a taxa Disk.
                  </p>
                </div>
                <button
                  onClick={() => setIsRoutingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Políticas de Antifraude & Split</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Evento / Produtor</th>
                      <th className="py-2.5 px-4">Taxa Disk</th>
                      <th className="py-2.5 px-4">Spread Cartão</th>
                      <th className="py-2.5 px-4">Advance</th>
                      <th className="py-2.5 px-4">Ribeit</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans">
                        <strong className="text-slate-900 block">Festival XYZ</strong>
                        <span className="text-slate-500 text-[11px]">ABC Produções & Eventos</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700">10,0%</td>
                      <td className="py-3 px-4 text-slate-700">2,50%</td>
                      <td className="py-3 px-4 text-slate-700">1,50%</td>
                      <td className="py-3 px-4 text-slate-700">R$ 1,00/ingr.</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          Vigente
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans">
                        <strong className="text-slate-900 block">Show ABC</strong>
                        <span className="text-slate-500 text-[11px]">ABC Produções & Eventos</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700">8,0%</td>
                      <td className="py-3 px-4 text-slate-700">R$ 3,00 fixo</td>
                      <td className="py-3 px-4 text-slate-400">Não possui</td>
                      <td className="py-3 px-4 text-slate-400">Não possui</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          Vigente
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans">
                        <strong className="text-slate-900 block">Teatro 2026</strong>
                        <span className="text-slate-500 text-[11px]">ABC Produções & Eventos</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700">R$ 5,00 fixo</td>
                      <td className="py-3 px-4 text-slate-700">2,00%</td>
                      <td className="py-3 px-4 text-slate-400">Não possui</td>
                      <td className="py-3 px-4 text-slate-700">R$ 0,50/ingr.</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          Vigente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TELA 8: PAGAMENTOS CUSTOMIZADOS */}
          {/* ===================================================================== */}
          {activeId === 'gw-customizados' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Políticas e Splits Customizados</h3>
                  <p className="text-xs text-slate-500">
                    Configurações excepcionais de retenções e múltiplos favorecidos sujeitas a aprovação da diretoria.
                  </p>
                </div>
                <button
                  onClick={() => setIsRoutingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Parâmetros de Caução & Risco</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Alçada de Governança Financeira Obrigatória
                </div>
                <p className="text-xs text-amber-800">
                  Toda alteração de split customizado requer autorização com dupla assinatura (CFO / Diretor de Operações)
                  e gera registro imutável na trilha de auditoria contábil.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Split Multiprodutores — Festival Rock Retrô</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      Aprovado
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>• Favorecido 1 (ABC Produções): <strong>70% do saldo líquido</strong></p>
                    <p>• Favorecido 2 (Coprodutora Sul): <strong>30% do saldo líquido</strong></p>
                    <p>• Caução retida para contingência de chargebacks: <strong>{routingConfig.chargebackEscrowPercent}% congelados por {routingConfig.escrowHoldDays} dias</strong></p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Autorizado por Carlos Eduardo (Diretoria) em 01/10/2026 com trava de domicílio bancário ativa.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rodapé Padrão com Aviso de Conformidade e Governança */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Regra Financeira Preservada:</strong> Toda venda é recebida pela DiskIngressos na Conta Escrow; o MDR é custo adquirente e a taxa Disk é receita contratual.
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">KEEPER ERP v1.0</span>
          </div>
        </article>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: CONFIGURAÇÃO DE NOVA CREDENCIADORA / GATEWAY */}
      {/* ========================================================================= */}
      {isGatewayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Configurar Credenciadora / Gateway</h3>
                  <p className="text-xs text-slate-500">Integração técnica com APIs, chaves seguras e webhook HMAC</p>
                </div>
              </div>
              <button
                onClick={() => setIsGatewayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGateway} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Credenciadora / Gateway</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cielo 3.0, Rede, Stone, PagBank, Pagar.me"
                    value={gatewayForm.name}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Provedor</label>
                  <select
                    value={gatewayForm.providerType}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        providerType: e.target.value as GatewayItem['providerType'],
                      })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="ADQUIRENTE">Adquirente Direta (Cielo, Rede, Stone)</option>
                    <option value="SUBADQUIRENTE">Subadquirente / Gateway (Pagar.me, MP, Zoop)</option>
                    <option value="BANCO_PIX">Provedor de Liquidação PIX (Itaú, Banco Central)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ambiente de Operação</label>
                  <select
                    value={gatewayForm.environment}
                    onChange={(e) =>
                      setGatewayForm({
                        ...gatewayForm,
                        environment: e.target.value as 'PRODUCAO' | 'SANDBOX',
                      })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="PRODUCAO">Produção (Live)</option>
                    <option value="SANDBOX">Sandbox / Homologação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timeout Máximo (ms)</label>
                  <input
                    type="number"
                    min="300"
                    max="5000"
                    value={gatewayForm.timeoutMs}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, timeoutMs: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Retentativas Automáticas</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={gatewayForm.retryAttempts}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, retryAttempts: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Credenciais de Autenticação Segura
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chave Pública / Client ID</label>
                    <input
                      type="text"
                      required
                      value={gatewayForm.publicKey}
                      onChange={(e) => setGatewayForm({ ...gatewayForm, publicKey: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chave Secreta / API Secret</label>
                    <input
                      type="password"
                      required
                      value={gatewayForm.secretKey}
                      onChange={(e) => setGatewayForm({ ...gatewayForm, secretKey: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Webhook Endpoint URL</label>
                  <input
                    type="text"
                    required
                    value={gatewayForm.webhookUrl}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, webhookUrl: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Assinatura HMAC SHA-256 (Anti-replay & Validação)
                    </label>
                    <input
                      type="text"
                      required
                      value={gatewayForm.hmacSecret}
                      onChange={(e) => setGatewayForm({ ...gatewayForm, hmacSecret: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateHMAC}
                    className="mt-5 px-3 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors whitespace-nowrap"
                  >
                    Gerar Segredo
                  </button>
                </div>
              </div>

              {/* Ping Test Box */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Diagnóstico de Latência:</span>
                  <p className="text-[11px] text-blue-800">
                    {pingResult || 'Teste a comunicação bidirecional antes de salvar o provedor.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestPingInModal}
                  disabled={testingPing}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                  <span>{testingPing ? 'Testando...' : 'Testar Conexão'}</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGatewayModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar e Ativar Gateway</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MATRIZ DE MDR POR BANDEIRA & MODALIDADE */}
      {/* ========================================================================= */}
      {isMDRModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Parametrizar Regra de Custo MDR</h3>
                  <p className="text-xs text-slate-500">Definição contratual de taxas cobradas pelas adquirentes</p>
                </div>
              </div>
              <button
                onClick={() => setIsMDRModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMDR} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Modalidade de Pagamento</label>
                  <select
                    value={mdrForm.modality}
                    onChange={(e) => setMdrForm({ ...mdrForm, modality: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  >
                    <option value="Crédito à Vista (1x)">Crédito à Vista (1x)</option>
                    <option value="Crédito Parcelado (2x a 6x)">Crédito Parcelado (2x a 6x)</option>
                    <option value="Crédito Parcelado (7x a 12x)">Crédito Parcelado (7x a 12x)</option>
                    <option value="Cartão de Débito Nacional">Cartão de Débito Nacional</option>
                    <option value="PIX Cobrança Instantâneo">PIX Cobrança Instantâneo</option>
                    <option value="Boleto Registrado D+1">Boleto Registrado D+1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bandeira / Método</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Visa, Master, Elo, Amex"
                    value={mdrForm.cardBrand}
                    onChange={(e) => setMdrForm({ ...mdrForm, cardBrand: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adquirente Responsável</label>
                  <select
                    value={mdrForm.acquirer}
                    onChange={(e) => setMdrForm({ ...mdrForm, acquirer: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="Cielo S.A.">Cielo S.A.</option>
                    <option value="Rede (Itaú Unibanco)">Rede (Itaú Unibanco)</option>
                    <option value="Stone Pagamentos">Stone Pagamentos</option>
                    <option value="Pagar.me v5">Pagar.me v5</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="Itaú Unibanco">Itaú Unibanco (PIX)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prazo de Liquidação</label>
                  <select
                    value={mdrForm.liquidationPeriod}
                    onChange={(e) => setMdrForm({ ...mdrForm, liquidationPeriod: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="D+0 Instantâneo">D+0 Instantâneo</option>
                    <option value="D+1 Útil">D+1 Útil</option>
                    <option value="D+14 Corridos">D+14 Corridos</option>
                    <option value="D+30 Corridos">D+30 Corridos</option>
                    <option value="D+30 Parcelado">D+30 Parcelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxa MDR Contratual (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="15"
                    required
                    value={mdrForm.feePercentage}
                    onChange={(e) => setMdrForm({ ...mdrForm, feePercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsável pelo Custo</label>
                  <select
                    value={mdrForm.responsibleParty}
                    onChange={(e) =>
                      setMdrForm({
                        ...mdrForm,
                        responsibleParty: e.target.value as MDRRuleItem['responsibleParty'],
                      })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="Produtor">Produtor (Descontado no Repasse)</option>
                    <option value="Comprador">Comprador (Taxa de Parcelamento)</option>
                    <option value="DiskIngressos">DiskIngressos (Custo Operacional)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-900 block text-xs">Split Automático de Juros:</span>
                  <p className="text-[11px] text-purple-800">
                    Repassa encargos de parcelamento integralmente para o comprador final
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={mdrForm.splitInterest}
                  onChange={(e) => setMdrForm({ ...mdrForm, splitInterest: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMDRModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Regra MDR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REGRAS DE ROTEAMENTO INTELIGENTE & ANTIFRAUDE */}
      {/* ========================================================================= */}
      {isRoutingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Roteamento Inteligente & Motor Antifraude</h3>
                  <p className="text-xs text-slate-500">
                    Regras de aprovação por score, 3DS 2.0 e fallback de contingência em picos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoutingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRouting} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Motor Antifraude Homologado</label>
                <select
                  value={routingConfig.antifraudEngine}
                  onChange={(e) => setRoutingConfig({ ...routingConfig, antifraudEngine: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  <option value="ClearSale Total (Garantia de Chargeback)">ClearSale Total (Garantia 100% de Chargeback)</option>
                  <option value="Konduto RiskScore (Inteligência Comportamental)">Konduto RiskScore (Inteligência Comportamental)</option>
                  <option value="CyberSource Decision Manager (Visa Solution)">CyberSource Decision Manager (Visa Enterprise)</option>
                  <option value="Legiti Enterprise Fraud Prevention">Legiti Enterprise Real-time</option>
                </select>
              </div>

              {/* Régua de Scores */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Régua de Corte de Score de Risco (0 a 100)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-[11px] font-bold text-emerald-800 block">Aprovação Direta:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-mono font-bold text-emerald-900">Score &gt;=</span>
                      <input
                        type="number"
                        min="50"
                        max="99"
                        value={routingConfig.autoApproveScore}
                        onChange={(e) => setRoutingConfig({ ...routingConfig, autoApproveScore: Number(e.target.value) })}
                        className="w-14 text-xs p-1 font-mono font-bold bg-white border border-emerald-300 rounded text-center"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-700 mt-1 block">Aprovado sem atrito</span>
                  </div>

                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-[11px] font-bold text-amber-800 block">Desafio 3DS / Manual:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-mono font-bold text-amber-900">Score</span>
                      <span className="text-xs font-mono font-bold text-amber-900">{routingConfig.manualReviewScore} a {routingConfig.autoApproveScore - 1}</span>
                    </div>
                    <span className="text-[10px] text-amber-700 mt-1 block">Exige 3D Secure 2.0</span>
                  </div>

                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                    <span className="text-[11px] font-bold text-rose-800 block">Recusa Automática:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-mono font-bold text-rose-900">Score &lt;</span>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={routingConfig.manualReviewScore}
                        onChange={(e) => setRoutingConfig({ ...routingConfig, manualReviewScore: Number(e.target.value) })}
                        className="w-14 text-xs p-1 font-mono font-bold bg-white border border-rose-300 rounded text-center"
                      />
                    </div>
                    <span className="text-[10px] text-rose-700 mt-1 block">Bloqueia chargeback</span>
                  </div>
                </div>
              </div>

              {/* Roteamento e Fallback em Cascata */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  Roteamento em Cascata (Fallback Instantâneo)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gateway Primário</label>
                    <select
                      value={routingConfig.primaryGateway}
                      onChange={(e) => setRoutingConfig({ ...routingConfig, primaryGateway: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-medium"
                    >
                      {gatewaysList.map((gw) => (
                        <option key={gw.id} value={gw.name}>
                          {gw.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gateway de Contingência (Fallback)</label>
                    <select
                      value={routingConfig.fallbackGateway}
                      onChange={(e) => setRoutingConfig({ ...routingConfig, fallbackGateway: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-medium"
                    >
                      {gatewaysList.map((gw) => (
                        <option key={gw.id} value={gw.name}>
                          {gw.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tempo de Tolerância para Failover (ms)
                    </label>
                    <input
                      type="number"
                      min="300"
                      max="3000"
                      value={routingConfig.failoverTimeoutMs}
                      onChange={(e) => setRoutingConfig({ ...routingConfig, failoverTimeoutMs: Number(e.target.value) })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Exigir 3DS em Vendas Acima de (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={routingConfig.require3DSAbove}
                      onChange={(e) => setRoutingConfig({ ...routingConfig, require3DSAbove: Number(e.target.value) })}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Caução Fiduciária de Risco */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900 block text-xs">Caução Fiduciária de Chargeback:</span>
                    <p className="text-[11px] text-amber-800">
                      Retenção percentual temporária em eventos com alto índice de cancelamento
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      value={routingConfig.chargebackEscrowPercent}
                      onChange={(e) =>
                        setRoutingConfig({ ...routingConfig, chargebackEscrowPercent: parseFloat(e.target.value) || 0 })
                      }
                      className="w-16 text-xs p-1 font-mono font-bold bg-white border border-amber-300 rounded text-center"
                    />
                    <span className="text-xs font-bold text-amber-900">%</span>
                  </div>
                </div>
                <div className="text-[11px] text-amber-800 flex items-center justify-between pt-1 border-t border-amber-200/60">
                  <span>Período de retenção em Escrow:</span>
                  <span className="font-mono font-bold">{routingConfig.escrowHoldDays} dias pós-evento</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoutingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Salvar Regras de Roteamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
