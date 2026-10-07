import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  UploadCloud,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface QuickEntryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickEntryDrawer({ isOpen, onClose }: QuickEntryDrawerProps) {
  const [type, setType] = useState<'payable' | 'receivable'>('payable');
  const [amount, setAmount] = useState<string>('0,00');
  const [dueDate, setDueDate] = useState<string>('');
  const [partner, setPartner] = useState<string>('');
  const [docNumber, setDocNumber] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [costCenter, setCostCenter] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Título lançado com sucesso! Gerou lançamento provisório no Razão.');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-600 text-white">
                <DollarSign className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-800">
                Lançamento Rápido de Título
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Entrada manual com geração automática de partida contábil
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de Operação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('payable')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                  type === 'payable'
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Contas a Pagar (Despesa)
              </button>
              <button
                type="button"
                onClick={() => setType('receivable')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                  type === 'receivable'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Contas a Receber (Receita)
              </button>
            </div>
          </div>

          {/* Amount and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Nominal (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  R$
                </span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Partner & Document */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {type === 'payable' ? 'Fornecedor / Favorecido *' : 'Cliente / Pagador *'}
            </label>
            <input
              type="text"
              required
              placeholder="Digite o nome ou CNPJ/CPF..."
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nº Documento / NF-e
              </label>
              <input
                type="text"
                placeholder="Ex: 004.912"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Centro de Custo
              </label>
              <select
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Selecione...</option>
                <option value="cc-01">01.01 - Matriz Administrativo</option>
                <option value="cc-02">02.01 - TI e Engenharia</option>
                <option value="cc-03">03.01 - Comercial e Vendas</option>
                <option value="cc-04">04.01 - Operações e Logística</option>
              </select>
            </div>
          </div>

          {/* Accounting Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plano de Contas / Categoria Contábil *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecione a conta analítica...</option>
              {type === 'payable' ? (
                <>
                  <option value="3.1.01 - Despesas com Pessoal">3.1.01 - Despesas com Pessoal e Encargos</option>
                  <option value="3.1.02 - Serviços de Terceiros PJ">3.1.02 - Serviços de Terceiros PJ / Cloud</option>
                  <option value="3.1.03 - Aluguéis e Ocupação">3.1.03 - Aluguéis, Energia e Ocupação</option>
                  <option value="3.2.01 - Tributos e Impostos">3.2.01 - Tributos e Contribuições Federais</option>
                </>
              ) : (
                <>
                  <option value="1.1.01 - Receita Bruta de Software">1.1.01 - Receita de Licenciamento SaaS</option>
                  <option value="1.1.02 - Receita de Serviços">1.1.02 - Serviços de Implantação e Customização</option>
                  <option value="1.2.01 - Receitas Financeiras">1.2.01 - Receitas de Aplicações Financeiras</option>
                </>
              )}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Histórico / Justificativa
            </label>
            <textarea
              rows={2}
              placeholder="Descreva o propósito da despesa ou receita..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Accounting Impact Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Impacto no Razão Geral (Partidas Dobradas):
            </div>
            <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
              <div>{type === 'payable' ? 'D - Despesa Operacional (DRE)' : 'D - Clientes a Receber (Ativo)'}</div>
              <div>{type === 'payable' ? 'C - Fornecedores a Pagar (Passivo)' : 'C - Receita Bruta de Vendas (DRE)'}</div>
            </div>
          </div>
        </form>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
          >
            {isSubmitting ? 'Gravando...' : 'Salvar Título'}
          </button>
        </div>
      </div>
    </div>
  );
}
