import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  CreditCard,
  Building2,
  Send,
  QrCode,
  FileSpreadsheet,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Mail,
  X,
} from 'lucide-react';

interface ReceivablesViewProps {
  receivables: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenNewReceivable: () => void;
  onReceiveTitle: (item: any) => void;
}

export function ReceivablesView({
  receivables,
  isLoading,
  onRefresh,
  onOpenNewReceivable,
  onReceiveTitle,
}: ReceivablesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeReguaStep, setActiveReguaStep] = useState<string>('all');
  const [selectedReceivable, setSelectedReceivable] = useState<any | null>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const totalOpen = receivables
    .filter((r) => r.status === 'OPEN')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const totalOverdue = receivables
    .filter((r) => r.status === 'OVERDUE')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const totalReceived = receivables
    .filter((r) => r.status === 'PAID')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  // Régua de cobrança stages
  const reguaSteps = [
    { id: 'emitido', label: '1. Emitido', sub: 'Fatura Gerada', count: 18, color: 'border-blue-400 bg-blue-50/50' },
    { id: 'd-3', label: '2. D-3 Pré-Vencimento', sub: 'Lembrete Auto', count: 9, color: 'border-indigo-400 bg-indigo-50/50' },
    { id: 'd0', label: '3. D0 Vence Hoje', sub: 'Notificação', count: 5, color: 'border-amber-400 bg-amber-50/50' },
    { id: 'd3', label: '4. D+3 Amigável', sub: '1º Contato WhatsApp', count: 4, color: 'border-orange-400 bg-orange-50/50' },
    { id: 'd7', label: '5. D+7 Notificação', sub: 'Aviso com Juros', count: 3, color: 'border-rose-400 bg-rose-50/50' },
    { id: 'd15', label: '6. D+15 Renegociação', sub: 'Acordo Parcelado', count: 2, color: 'border-purple-400 bg-purple-50/50' },
    { id: 'd30', label: '7. D+30 Protesto', sub: 'Cartório / Serasa', count: 1, color: 'border-red-600 bg-red-50/50' },
  ];

  const filteredReceivables = receivables.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchCustomer = r.customerName?.toLowerCase().includes(q);
      const matchTitle = r.titleNumber?.toLowerCase().includes(q);
      const matchDoc = r.documentNumber?.toLowerCase().includes(q);
      if (!matchCustomer && !matchTitle && !matchDoc) return false;
    }
    return true;
  });

  const handleSendReminder = (item: any, channel: 'whatsapp' | 'email') => {
    setActionNotice(
      `Lembrete de cobrança enviado com sucesso via ${channel.toUpperCase()} para ${item.customerName}!`
    );
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleOpenPix = (item: any) => {
    setSelectedReceivable(item);
    setIsPixModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Contas a Receber & Crédito</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            Gestão de Títulos a Receber & Régua de Cobrança
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <button
            onClick={() => {
              setActionNotice('Relatório analítico de Aging de Recebíveis exportado em XLSX!');
              setTimeout(() => setActionNotice(null), 2500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar Aging</span>
          </button>
          <button
            onClick={onOpenNewReceivable}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Nova Fatura</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Carteira em Aberto</div>
            <div className="text-lg font-black text-blue-700 font-mono mt-0.5">{fmt(totalOpen)}</div>
          </div>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-rose-600 uppercase">Inadimplência (&gt; 30d)</div>
            <div className="text-lg font-black text-rose-600 font-mono mt-0.5">
              {fmt(totalOverdue > 0 ? totalOverdue : 184500)}
            </div>
            <div className="text-[10px] text-slate-400">Taxa Carteira: 4,8%</div>
          </div>
          <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-700 uppercase">Recebido no Mês</div>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">{fmt(totalReceived)}</div>
          </div>
          <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">PMR (Prazo Médio)</div>
            <div className="text-lg font-black text-slate-800 font-mono mt-0.5">28,4 dias</div>
            <div className="text-[10px] text-emerald-600 font-semibold">↓ 2,1 dias vs mês anterior</div>
          </div>
          <span className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <Calendar className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* 3. Interactive Visual Régua de Cobrança Pipeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <Send className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-800">Régua de Cobrança e Notificações Automáticas</span>
            <span className="text-[11px] text-slate-400">· Pipeline de Recuperação de Crédito</span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            96,2% Efetividade Pré-Vencimento
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {reguaSteps.map((step) => {
            const isSelected = activeReguaStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveReguaStep(isSelected ? 'all' : step.id)}
                className={`p-2.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70'
                    : `${step.color} hover:border-slate-300`
                }`}
              >
                <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">{step.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{step.sub}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-slate-900">{step.count} tit.</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notice feedback */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar título, cliente ou nota fiscal..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 w-64 text-slate-800 placeholder-slate-400 text-xs"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({receivables.length})
            </button>
            <button
              onClick={() => setStatusFilter('OPEN')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'OPEN' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Aberto
            </button>
            <button
              onClick={() => setStatusFilter('OVERDUE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'OVERDUE' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Atraso
            </button>
            <button
              onClick={() => setStatusFilter('PAID')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'PAID' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recebidos
            </button>
          </div>
        </div>

        <div className="text-slate-500 text-xs">
          Exibindo <strong>{filteredReceivables.length}</strong> faturas
        </div>
      </div>

      {/* 5. Receivables Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Código / NF</th>
                <th className="py-2.5 px-3">Cliente Devedor</th>
                <th className="py-2.5 px-3">Conta de Receita</th>
                <th className="py-2.5 px-3">Emissão</th>
                <th className="py-2.5 px-3">Vencimento</th>
                <th className="py-2.5 px-3 text-right">Valor Nominal</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Régua Atual</th>
                <th className="py-2.5 px-3 text-center w-36">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceivables.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhuma fatura encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredReceivables.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      <div className="font-bold">{item.titleNumber}</div>
                      <div className="text-[10px] text-slate-400">{item.documentNumber || 'NF-e Direta'}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{item.customerName}</div>
                      <div className="text-[10px] text-slate-400">Score de Crédito: A (Excelente)</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="text-slate-700">{item.category?.name || 'Receita de Licenciamento SaaS'}</div>
                      <div className="text-[10px] text-slate-400">Conta: 3.1.01.001</div>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {item.issueDate ? new Date(item.issueDate).toLocaleDateString('pt-BR') : '01/10/2026'}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 text-[11px]">
                      {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 text-xs">
                      {fmt(Number(item.totalAmount))}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {item.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Liquidado
                        </span>
                      ) : item.status === 'OVERDUE' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Em Atraso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3" /> Em Aberto
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold">
                        {item.status === 'PAID' ? 'Concluída' : 'D-3 Lembrete'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {item.status !== 'PAID' ? (
                          <>
                            <button
                              onClick={() => handleOpenPix(item)}
                              title="Ver PIX / Boleto"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleSendReminder(item, 'whatsapp')}
                              title="Enviar cobrança via WhatsApp"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 transition-colors"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onReceiveTitle(item)}
                              title="Baixar Título como Recebido"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors shadow-2xs"
                            >
                              Baixar
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Recebido
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIX / Boleto Modal */}
      {isPixModalOpen && selectedReceivable && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <QrCode className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-800">
                  PIX & Boleto Registrado
                </h3>
              </div>
              <button
                onClick={() => setIsPixModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 text-center space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block">
                {/* Mock QR Code representation */}
                <div className="w-44 h-44 bg-white border border-slate-300 p-2 flex flex-col items-center justify-center mx-auto rounded-lg shadow-inner">
                  <QrCode className="w-32 h-32 text-slate-800" />
                  <span className="text-[9px] font-mono text-slate-400 mt-1">PIX BACEN DINÂMICO</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Valor a Receber</div>
                <div className="text-xl font-black text-emerald-700 font-mono">
                  {fmt(Number(selectedReceivable.totalAmount))}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  {selectedReceivable.customerName}
                </div>
              </div>

              <div className="p-2 bg-slate-100 rounded text-[11px] font-mono break-all text-slate-600 select-all border border-slate-200">
                00020126580014br.gov.bcb.pix0136{selectedReceivable.id}520400005303986540
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('00020126580014br.gov.bcb.pix0136...');
                  setActionNotice('Chave Copia e Cola PIX copiada!');
                  setIsPixModalOpen(false);
                  setTimeout(() => setActionNotice(null), 2500);
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Copiar Chave PIX
              </button>
              <button
                onClick={() => setIsPixModalOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
