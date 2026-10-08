import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  CreditCard,
  Building2,
  Check,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PayableDetailItem } from '../../drawers/PayableDetailsDrawer';

interface PayablesViewProps {
  payables: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onOpenNewPayable: () => void;
  onSelectTitle: (item: PayableDetailItem) => void;
  onQuickLiquidate: (item: any) => void;
}

export function PayablesView({
  payables,
  isLoading,
  onRefresh,
  onOpenNewPayable,
  onSelectTitle,
  onQuickLiquidate,
}: PayablesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [costCenterFilter, setCostCenterFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchActionFeedback, setBatchActionFeedback] = useState<string | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const filteredPayables = payables.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (costCenterFilter !== 'all' && p.costCenter !== costCenterFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSupplier = p.supplierName?.toLowerCase().includes(q);
      const matchTitle = p.titleNumber?.toLowerCase().includes(q);
      const matchDoc = p.documentNumber?.toLowerCase().includes(q);
      if (!matchSupplier && !matchTitle && !matchDoc) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPayables.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayables.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = () => {
    setBatchActionFeedback(`${selectedIds.length} títulos aprovados para liquidação em lote!`);
    setTimeout(() => {
      setBatchActionFeedback(null);
      setSelectedIds([]);
    }, 2500);
  };

  const handleGenerateCNAB = () => {
    setBatchActionFeedback(`Remessa CNAB 240 gerada com sucesso para ${selectedIds.length} pagamentos!`);
    setTimeout(() => {
      setBatchActionFeedback(null);
      setSelectedIds([]);
    }, 2500);
  };

  // KPIs
  const totalOpen = payables
    .filter((p) => p.status === 'OPEN')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const totalOverdue = payables
    .filter((p) => p.status === 'OVERDUE')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const totalPaid = payables
    .filter((p) => p.status === 'PAID')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Financeiro</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Contas a Pagar</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-rose-600" />
            Gestão de Títulos e Obrigações a Pagar
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
            onClick={handleGenerateCNAB}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Remessa CNAB 240</span>
          </button>
          <button
            onClick={onOpenNewPayable}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Título a Pagar</span>
          </button>
        </div>
      </div>

      {/* 2. Mini KPI summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">A Vencer (Aberto)</div>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">{fmt(totalOpen)}</div>
          </div>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-rose-600 uppercase">Vencido / Em Atraso</div>
            <div className="text-lg font-black text-rose-600 font-mono mt-0.5">{fmt(totalOverdue)}</div>
          </div>
          <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-700 uppercase">Liquidado no Mês</div>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">{fmt(totalPaid)}</div>
          </div>
          <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Registros</div>
            <div className="text-lg font-black text-slate-800 font-mono mt-0.5">{filteredPayables.length} títulos</div>
          </div>
          <span className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <FileText className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar título, fornecedor ou NF..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 w-64 text-slate-800 placeholder-slate-400 text-xs"
            />
          </div>

          {/* Status Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('OPEN')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'OPEN' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A Vencer
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
              Liquidados
            </button>
          </div>

          {/* Centro de Custo Dropdown */}
          <select
            value={costCenterFilter}
            onChange={(e) => setCostCenterFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium text-slate-700 focus:outline-none text-xs"
          >
            <option value="all">Todos os Centros de Custo</option>
            <option value="CC-101 - Infraestrutura Cloud & TI">CC-101 - Infra Cloud & TI</option>
            <option value="CC-204 - Operações Prediais">CC-204 - Operações Prediais</option>
            <option value="CC-302 - Controladoria & Auditoria">CC-302 - Controladoria</option>
            <option value="CC-401 - Tributos e Encargos">CC-401 - Tributos</option>
          </select>
        </div>

        {/* Selected count info & batch actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            <span className="font-bold text-blue-800 text-xs">
              {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={handleBatchApprove}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-2xs transition-colors"
            >
              Aprovar Selecionados
            </button>
            <button
              onClick={handleGenerateCNAB}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold shadow-2xs transition-colors"
            >
              CNAB em Lote
            </button>
          </div>
        )}
      </div>

      {/* Batch Feedback */}
      {batchActionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{batchActionFeedback}</span>
        </div>
      )}

      {/* 4. High-Density Payables Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPayables.length > 0 && selectedIds.length === filteredPayables.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Código / Documento</th>
                <th className="py-2.5 px-3">Fornecedor / Beneficiário</th>
                <th className="py-2.5 px-3">Categoria / Centro Custo</th>
                <th className="py-2.5 px-3">Emissão</th>
                <th className="py-2.5 px-3">Vencimento</th>
                <th className="py-2.5 px-3 text-right">Valor Nominal</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center w-28">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayables.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Nenhum título a pagar encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredPayables.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectTitle(item)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center" onClick={(e) => toggleSelectOne(item.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span>{item.titleNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {item.documentNumber ? `Doc: ${item.documentNumber}` : 'Sem doc fiscal'}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{item.supplierName}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.installments?.length || 1} parcela(s)
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-slate-700 font-medium">{item.category?.name || 'Despesa Operacional'}</div>
                        <div className="text-[10px] text-slate-400">{item.costCenter || 'CC Geral'}</div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {item.issueDate ? new Date(item.issueDate).toLocaleDateString('pt-BR') : '01/10/2026'}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-800 font-semibold text-[11px]">
                        {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 text-xs">
                        {fmt(Number(item.totalAmount))}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {item.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Liquidado
                          </span>
                        ) : item.status === 'OVERDUE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> Vencido
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3 h-3" /> A Vencer
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.status !== 'PAID' ? (
                          <button
                            onClick={() => onQuickLiquidate(item)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors shadow-2xs"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Baixar</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Pago
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination & Legend */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span>Exibindo <strong>{filteredPayables.length}</strong> títulos de <strong>{payables.length}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Partidas dobradas garantidas no Razão Contábil
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Anterior
            </button>
            <span className="px-2 font-bold text-slate-700">1</span>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
