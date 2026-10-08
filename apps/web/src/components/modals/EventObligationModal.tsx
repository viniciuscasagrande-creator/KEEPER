import React, { useState } from 'react';
import { X, Building2, Calendar, FileText, CheckCircle2, DollarSign, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

interface EventObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  selectedEventId?: string;
}

export function EventObligationModal({
  isOpen,
  onClose,
  onSuccess,
  selectedEventId = 'ev-01',
}: EventObligationModalProps) {
  const [eventId, setEventId] = useState(selectedEventId);
  const [category, setCategory] = useState('VENUE_RENTAL');
  const [description, setDescription] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryDocument, setBeneficiaryDocument] = useState('');
  const [amountReserved, setAmountReserved] = useState('40.000,00');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [authorizedBy, setAuthorizedBy] = useState('Carlos Eduardo (Diretor Financeiro)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const numAmount = parseFloat(amountReserved.replace(/\./g, '').replace(',', '.'));
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Informe um valor de retenção válido.');
      }
      if (!description.trim()) {
        throw new Error('Informe a descrição da obrigação/retenção.');
      }
      if (!beneficiaryName.trim()) {
        throw new Error('Informe o nome do beneficiário (Teatro, ECAD, etc.).');
      }

      const payload = {
        eventId,
        category,
        description,
        beneficiaryName,
        beneficiaryDocument,
        amountReserved: numAmount,
        amountApproved: numAmount,
        dueDate,
        paymentMethod,
        authorizedBy,
        notes,
      };

      const res = await api.saveEventObligation(payload);
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar obrigação do evento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Building2 className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Nova Retenção & Obrigação do Evento</h3>
                <p className="text-xs text-blue-200 font-medium">
                  Bloqueio de Saldo para Teatro, ECAD, Cachês e Fornecedores
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Evento
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ev-01">Festival Rock Retrô 2026 (ABC Produções)</option>
                <option value="ev-02">Stand Up Comedy VIP Especial (ABC Produções)</option>
                <option value="ev-03">Show Acústico MPB Curitiba (CWB Brasil)</option>
                <option value="ev-101">Festival de Primavera 2026 (Opus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Categoria da Obrigação
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="VENUE_RENTAL">Aluguel do Teatro / Espaço</option>
                <option value="ECAD">Direitos Autorais (ECAD)</option>
                <option value="STAGE_STRUCTURE">Estrutura, Som & Iluminação</option>
                <option value="ARTIST">Cachê Artístico</option>
                <option value="TAX">Tributos, Alvarás e Taxas Públicas</option>
                <option value="SECURITY">Segurança & Brigadistas</option>
                <option value="OTHER">Outros Custos Operacionais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descrição Detalhada do Compromisso
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel Grande Auditório Teatro Positivo - Taxa de Uso e Limpeza"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome do Beneficiário / Fornecedor
              </label>
              <input
                type="text"
                required
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Ex: Grupo Positivo Teatros S.A."
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CNPJ ou CPF do Beneficiário
              </label>
              <input
                type="text"
                value={beneficiaryDocument}
                onChange={(e) => setBeneficiaryDocument(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Valor Retido / Reservado (R$)
              </label>
              <input
                type="text"
                required
                value={amountReserved}
                onChange={(e) => setAmountReserved(e.target.value)}
                className="w-full text-xs font-black bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-blue-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Data Prevista / Vencimento
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Meio de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="PIX">PIX Direto</option>
                <option value="TED">Transferência TED</option>
                <option value="BOLETO">Compensação de Boleto</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
            <span className="font-bold">Efeito no Saldo:</span> Este valor de R$ {amountReserved} será reservado
            automaticamente no saldo do evento, ficando indisponível para antecipações ou repasses ao produtor até
            a autorização de liquidação ou cancelamento da retenção.
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Retenção & Bloquear Saldo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
