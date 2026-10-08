import React, { useState } from 'react';
import { X, Receipt, CheckCircle2, DollarSign, UserCheck } from 'lucide-react';

interface EventExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any | null;
  onExpenseAdded?: (expense: any) => void;
}

export function EventExpenseModal({
  isOpen,
  onClose,
  wallet,
  onExpenseAdded,
}: EventExpenseModalProps) {
  const [category, setCategory] = useState('SECURITY');
  const [description, setDescription] = useState('Segurança Armada e Controle de Acesso');
  const [supplierName, setSupplierName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [amount, setAmount] = useState('15000,00');
  const [authorizedBy, setAuthorizedBy] = useState('Carlos Eduardo (Gerente Financeiro)');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !wallet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!num || num <= 0) return;

    const newExpense = {
      id: `exp-${Date.now()}`,
      walletId: wallet.id,
      eventName: wallet.eventName,
      category,
      description,
      supplierName,
      documentNumber,
      amount: num,
      authorizedBy,
      dueDate,
      paymentStatus: 'PAID',
    };

    setFeedback(`Despesa de R$ ${num.toFixed(2)} autorizada e debitada do saldo do evento!`);
    if (onExpenseAdded) onExpenseAdded(newExpense);

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-600 text-white">
              <Receipt className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Lançar Despesa do Evento</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{wallet.eventName}</p>
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

        <form onSubmit={handleSubmit} className="my-4 space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Categoria da Despesa *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              <option value="SECURITY">Segurança & Brigada de Incêndio</option>
              <option value="VENUE_RENTAL">Locação de Espaço / Estádio / Teatro</option>
              <option value="ARTIST_CACHE">Cachê Artístico / Produção Musical</option>
              <option value="STAGE_STRUCTURE">Estrutura de Palco, Som e Luz</option>
              <option value="MARKETING">Marketing, Tráfego Pago e Mídia</option>
              <option value="STAFF">Equipe de Portaria, Limpeza e Apoio</option>
              <option value="TICKETING_EQUIPMENT">Equipamentos e Catracas de Bilheteria</option>
              <option value="OTHER">Outras Despesas Operacionais</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Descrição do Serviço *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Segurança portaria e camarins..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fornecedor Favorecido *</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Ex: GuardSeg Ltda"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NF / Documento</label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Ex: NF-4921"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valor (R$) *</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data Efetiva *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Autorizado Por (Alçada) *</label>
            <select
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              <option value="Vinicius Casagrande (Diretoria)">Vinicius Casagrande (Diretoria)</option>
              <option value="Carlos Eduardo (Gerente Financeiro)">Carlos Eduardo (Gerente Financeiro)</option>
              <option value="Fernanda Lima (Coord. Eventos)">Fernanda Lima (Coord. Eventos)</option>
              <option value="Beatriz Fontes (CMO)">Beatriz Fontes (CMO)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm"
            >
              Confirmar Desconto do Saldo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
