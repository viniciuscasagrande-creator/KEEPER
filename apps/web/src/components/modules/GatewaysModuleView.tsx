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
        {/* 1. SIDEBAR IDÊNTICA À REFERÊNCIA VISUAL (Menu de Gateways e Adquirentes) */}
        {/* ========================================================================= */}
        <aside className="bg-[#0b1329] text-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-800 self-start">
          {/* Header da Barra Lateral */}
          <div className="relative flex items-center justify-between p-3.5 bg-[#0f1b3b] border-b border-slate-800/80">
            {/* Barra azul no canto esquerdo da referência */}
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

          {/* Submenus com Timeline Tree Connectors idênticos à imagem */}
          {isSidebarExpanded && (
            <nav className="p-3 relative">
              {/* Linha vertical da Timeline */}
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
                      {/* Ponto / Nó da Timeline */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full border shrink-0 transition-all ${
                          isActive
                            ? 'bg-white border-blue-300 ring-2 ring-blue-400/50'
                            : 'bg-slate-900 border-slate-600 group-hover:border-slate-400'
                        }`}
                      ></span>

                      {/* Ícone de seta '>' */}
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                          isActive ? 'text-white opacity-100' : 'text-slate-500 opacity-60 group-hover:opacity-100'
                        }`}
                      />

                      {/* Ícone do Submenu */}
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                        }`}
                      />

                      {/* Rótulo do Submenu */}
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
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
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
                  <div className="text-2xl font-black text-slate-900 mt-0.5">3 Provedores</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Pagar.me, Mercado Pago, Zoop
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Ambiente de Operação</span>
                  <div className="text-2xl font-black text-blue-600 mt-0.5">Produção</div>
                  <span className="text-[11px] text-slate-500 mt-1">Alta disponibilidade ativa</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Latência de Webhook</span>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">42 ms</div>
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
                  <h3 className="text-sm font-bold text-slate-800">Provedores de Checkout e API</h3>
                  <button
                    onClick={() => notify('Modal de cadastro de novo Gateway acionado!')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Gateway</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gateway 1: Pagar.me */}
                  <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs space-y-3 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-xs">
                          PM
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Pagar.me v5 (StoneCo)</h4>
                          <span className="text-[11px] text-slate-400 font-mono">ID: gw_pagarme_prod</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Online · Produção
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chave de API Pública:</span>
                        <span className="font-mono text-slate-700 font-medium">pk_live_8912389128391</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chave Secreta:</span>
                        <div className="flex items-center gap-1 font-mono text-slate-700">
                          <span>{showApiKey['pm'] ? 'sk_live_9918237198273918' : '••••••••••••••••••••'}</span>
                          <button
                            onClick={() => setShowApiKey((p) => ({ ...p, pm: !p['pm'] }))}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            {showApiKey['pm'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Webhook URL:</span>
                        <span className="font-mono text-slate-700 truncate max-w-[200px]">
                          /api/v1/financeiro/webhook/sale-approved
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => notify('Ping enviado ao Pagar.me: Conexão OK (32ms)!')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Testar Ping
                      </button>
                      <button
                        onClick={() => notify('URL do Webhook copiada para a área de transferência!')}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded"
                        title="Copiar Webhook"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Gateway 2: Mercado Pago */}
                  <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs space-y-3 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center font-black text-sky-700 text-xs">
                          MP
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Mercado Pago Checkout Pro</h4>
                          <span className="text-[11px] text-slate-400 font-mono">ID: gw_mercadopago_prod</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Online · Produção
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Chave de API Pública:</span>
                        <span className="font-mono text-slate-700 font-medium">APP_USR-78192019-a1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Access Token:</span>
                        <div className="flex items-center gap-1 font-mono text-slate-700">
                          <span>{showApiKey['mp'] ? 'APP_USR-99120938102938-sec' : '••••••••••••••••••••'}</span>
                          <button
                            onClick={() => setShowApiKey((p) => ({ ...p, mp: !p['mp'] }))}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            {showApiKey['mp'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Webhook URL:</span>
                        <span className="font-mono text-slate-700 truncate max-w-[200px]">
                          /api/v1/financeiro/webhook/sale-approved
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => notify('Ping enviado ao Mercado Pago: Conexão OK (48ms)!')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Testar Ping
                      </button>
                      <button
                        onClick={() => notify('URL do Webhook copiada!')}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded"
                        title="Copiar Webhook"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
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
                  onClick={() => notify('Cadastro de nova Adquirente em elaboração.')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Nova Adquirente
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
              </div>

              {/* Tabela de Taxas MDR */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Modalidade de Pagamento</th>
                      <th className="py-2.5 px-4">Prazo de Liquidação</th>
                      <th className="py-2.5 px-4 text-right">Taxa MDR Contratual</th>
                      <th className="py-2.5 px-4 text-center">Responsável pelo Custo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">Cartão de Débito Nacional</td>
                      <td className="py-3 px-4 text-slate-600">D+1 Útil</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">1,19%</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">Produtor</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">Crédito à Vista (1x)</td>
                      <td className="py-3 px-4 text-slate-600">D+30 Corridos</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">2,49%</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">Produtor</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">Crédito Parcelado (2x a 6x)</td>
                      <td className="py-3 px-4 text-slate-600">D+30 Parcelado</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">3,19%</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold">Comprador</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">Crédito Parcelado (7x a 12x)</td>
                      <td className="py-3 px-4 text-slate-600">D+30 Parcelado</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">3,89%</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold">Comprador</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">PIX Cobrança Instantâneo</td>
                      <td className="py-3 px-4 text-slate-600">D+0 Instantâneo</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">0,79% (teto R$ 5,00)</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">DiskIngressos</span>
                      </td>
                    </tr>
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
                        onClick={() => notify(`Configuração de ${m.name} atualizada.`)}
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
                    <p>• Caução retida para contingência de chargebacks: <strong>5% congelados por 90 dias</strong></p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Autorizado por Carlos Eduardo (Diretoria) em 01/10/2026.
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
    </div>
  );
}
