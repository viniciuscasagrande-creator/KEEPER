import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Building,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface ApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApprovalItem {
  id: string;
  module: 'Compras' | 'Financeiro' | 'RH';
  title: string;
  requester: string;
  date: string;
  amount: number;
  costCenter: string;
  justification: string;
  urgency: 'high' | 'medium' | 'low';
}

const mockApprovals: ApprovalItem[] = [
  {
    id: 'app-001',
    module: 'Compras',
    title: 'PO-2026-081: Aquisição de 10 Licenças JetBrains All Products',
    requester: 'Felipe Santana (Tech Lead)',
    date: 'Hoje, às 14:15',
    amount: 19800.0,
    costCenter: '02.01 - TI e Engenharia',
    justification: 'Renovação anual do ferramental das equipes de desenvolvimento backend.',
    urgency: 'high',
  },
  {
    id: 'app-002',
    module: 'Financeiro',
    title: 'PAG-2026-00429: Honorários de Auditoria Externa Q3',
    requester: 'Mariana Duarte (Controladoria)',
    date: 'Ontem, às 17:30',
    amount: 65000.0,
    costCenter: '01.01 - Matriz Administrativo',
    justification: 'Segunda parcela contratual da auditoria das demonstrações contábeis.',
    urgency: 'medium',
  },
  {
    id: 'app-003',
    module: 'RH',
    title: 'SOL-2026-014: Reembolso de Despesas de Viagem e Aluguel de Carro',
    requester: 'Rodrigo Medeiros (Comercial)',
    date: '06/10/2026',
    amount: 4320.5,
    costCenter: '03.01 - Comercial e Vendas',
    justification: 'Visita técnica a clientes corporativos no polo de Campinas/SP.',
    urgency: 'low',
  },
];

export function ApprovalsDrawer({ isOpen, onClose }: ApprovalsDrawerProps) {
  const [items, setItems] = useState<ApprovalItem[]>(mockApprovals);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(mockApprovals[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApprove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setToastMessage(`Solicitação ${id} aprovada com sucesso! Alçada registrada.`);
    setSelectedItem(items.find((item) => item.id !== id) || null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Informe a justificativa da recusa / cancelamento:');
    if (reason) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setToastMessage(`Solicitação ${id} recusada. Notificação enviada ao solicitante.`);
      setSelectedItem(items.find((item) => item.id !== id) || null);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-500 text-white">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-800">
                Central de Aprovações de Workflow
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Solicitações pendentes aguardando sua assinatura de alçada
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {toastMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body: Split layout between list and details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left List */}
          <div className="w-72 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
            {items.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Nenhuma aprovação pendente no momento. Sua fila está zerada!
              </div>
            ) : (
              items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-l-blue-600 text-blue-900'
                        : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {item.module}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.amount)}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold line-clamp-2 leading-tight text-slate-800">
                      {item.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                      <span className="truncate max-w-[120px]">{item.requester.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Details Pane */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Alçada Nível 2 Requerida
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {selectedItem.module}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedItem.title}
                  </h3>
                </div>

                {/* Amount Highlight */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Valor Total da Operação
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(selectedItem.amount)}
                    </span>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>Condição: À vista / Boleto</div>
                    <div>Vencimento: 10/10/2026</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Solicitante:</span>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {selectedItem.requester}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Centro de Custo:</span>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {selectedItem.costCenter}
                    </div>
                  </div>
                </div>

                {/* Justification Box */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Justificativa Comercial / Operacional
                  </h5>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
                    {selectedItem.justification}
                  </div>
                </div>

                {/* Rule engine validation badge */}
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Validação do Motor de Regras: Limite orçamentário verificado com <strong>94% de saldo livre</strong> neste centro de custo.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Selecione um item ao lado para analisar
              </div>
            )}

            {/* Bottom Actions */}
            {selectedItem && (
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handleReject(selectedItem.id)}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Recusar Solicitação
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedItem.id)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aprovar Agora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
