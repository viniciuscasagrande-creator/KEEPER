import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  CheckSquare,
  Square,
  RefreshCw,
} from 'lucide-react';

interface Movement {
  id: string;
  code: string;
  type: 'receivable' | 'payable';
  entity: string;
  document: string;
  category: string;
  competence: string;
  dueDate: string;
  amount: number;
  status: 'liquidated' | 'pending' | 'overdue' | 'in_approval';
  account: string;
}

const mockMovements: Movement[] = [
  {
    id: 'mov-001',
    code: 'REC-2026-00892',
    type: 'receivable',
    entity: 'TechCorp Brasil Tecnologia S.A.',
    document: 'NF-e 45.291',
    category: 'Receita de Licenciamento',
    competence: '10/2026',
    dueDate: '10/10/2026',
    amount: 145000.0,
    status: 'pending',
    account: 'Itaú - Ag. 0422 / CC 18920-1',
  },
  {
    id: 'mov-002',
    code: 'PAG-2026-00431',
    type: 'payable',
    entity: 'Amazon Web Services Latam Ltda',
    document: 'Invoice AWS-98124',
    category: 'Infraestrutura Cloud & TI',
    competence: '09/2026',
    dueDate: '08/10/2026',
    amount: 38450.75,
    status: 'liquidated',
    account: 'Bradesco - Ag. 1024 / CC 34910-4',
  },
  {
    id: 'mov-003',
    code: 'PAG-2026-00430',
    type: 'payable',
    entity: 'Office Tower Gestão Predial S.A.',
    document: 'Boleto 23791.02931',
    category: 'Locação e Condomínio',
    competence: '10/2026',
    dueDate: '05/10/2026',
    amount: 22800.0,
    status: 'overdue',
    account: 'Itaú - Ag. 0422 / CC 18920-1',
  },
  {
    id: 'mov-004',
    code: 'REC-2026-00891',
    type: 'receivable',
    entity: 'Varejo Global Comércio e Distribuição',
    document: 'NF-e 88.192',
    category: 'Contratos Mensais ERP',
    competence: '10/2026',
    dueDate: '15/10/2026',
    amount: 87500.0,
    status: 'pending',
    account: 'Itaú - Ag. 0422 / CC 18920-1',
  },
  {
    id: 'mov-005',
    code: 'PAG-2026-00429',
    type: 'payable',
    entity: 'Deloitte Touche Tohmatsu Auditores',
    document: 'NF-e 10.492',
    category: 'Auditoria Externa Q3',
    competence: '09/2026',
    dueDate: '12/10/2026',
    amount: 65000.0,
    status: 'in_approval',
    account: 'Santander - Ag. 3301 / CC 77123-0',
  },
  {
    id: 'mov-006',
    code: 'REC-2026-00890',
    type: 'receivable',
    entity: 'Hospital das Clínicas Metropolitano',
    document: 'NF-e 39.012',
    category: 'Consultoria e Integrações',
    competence: '10/2026',
    dueDate: '06/10/2026',
    amount: 112000.0,
    status: 'liquidated',
    account: 'Itaú - Ag. 0422 / CC 18920-1',
  },
  {
    id: 'mov-007',
    code: 'PAG-2026-00428',
    type: 'payable',
    entity: 'Receita Federal do Brasil (RFB)',
    document: 'DARF IRPJ/CSLL',
    category: 'Tributos Federais',
    competence: '09/2026',
    dueDate: '31/10/2026',
    amount: 214600.0,
    status: 'pending',
    account: 'Banco do Brasil - Ag. 0001 / CC 55210-9',
  },
];

export function RecentMovementsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'payable' | 'receivable'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'liquidated' | 'pending' | 'overdue' | 'in_approval'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovements = mockMovements.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (
      searchTerm &&
      !m.entity.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !m.document.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMovements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMovements.map((m) => m.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: Movement['status']) => {
    switch (status) {
      case 'liquidated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Liquidado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            A Vencer
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            Em Atraso
          </span>
        );
      case 'in_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
            Em Aprovação
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Movimentações Financeiras Recentes
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredMovements.length} títulos
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Lançamentos consolidados de contas a pagar e receber de todas as filiais
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar título, parceiro, NF..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white w-52 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('receivable')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                typeFilter === 'receivable'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Receber
            </button>
            <button
              onClick={() => setTypeFilter('payable')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                typeFilter === 'payable'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pagar
            </button>
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">Todos os Status</option>
            <option value="liquidated">Liquidados</option>
            <option value="pending">A Vencer</option>
            <option value="overdue">Em Atraso</option>
            <option value="in_approval">Em Aprovação</option>
          </select>

          {/* Export Action */}
          <button
            title="Exportar para Excel/CSV"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.length}</span> títulos selecionados
            <span className="text-blue-400">|</span>
            <span>
              Total:{' '}
              <strong className="font-mono">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  mockMovements
                    .filter((m) => selectedIds.includes(m.id))
                    .reduce((acc, curr) => acc + curr.amount, 0)
                )}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 bg-white border border-blue-300 rounded font-medium text-blue-700 hover:bg-blue-100">
              Aprovar em Lote
            </button>
            <button className="px-2.5 py-1 bg-blue-700 text-white rounded font-medium hover:bg-blue-800">
              Emitir Arquivo CNAB
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-500 hover:text-slate-700 underline text-xs"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-2.5 px-3 w-8 text-center">
                <button
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {selectedIds.length === filteredMovements.length && filteredMovements.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-2.5 px-3">Código / Documento</th>
              <th className="py-2.5 px-3">Parceiro Comercial</th>
              <th className="py-2.5 px-3">Categoria & Centro</th>
              <th className="py-2.5 px-3">Vencimento</th>
              <th className="py-2.5 px-3 text-right">Valor Líquido</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center w-12">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMovements.map((movement) => {
              const isSelected = selectedIds.includes(movement.id);
              const isReceivable = movement.type === 'receivable';

              return (
                <tr
                  key={movement.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => toggleSelect(movement.id)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Code & Doc */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      {isReceivable ? (
                        <span className="p-1 rounded bg-emerald-50 text-emerald-600">
                          <ArrowDownLeft className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-1 rounded bg-rose-50 text-rose-600">
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      )}
                      <span className="font-mono text-xs">{movement.code}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-6 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      {movement.document}
                    </div>
                  </td>

                  {/* Entity */}
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800 block truncate max-w-[220px]">
                      {movement.entity}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[220px] block">
                      {movement.account}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-3">
                    <span className="text-slate-700 block truncate max-w-[160px]">
                      {movement.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Comp: {movement.competence}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-slate-700 font-medium">
                      {movement.dueDate}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-mono font-bold ${
                        isReceivable ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(movement.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 text-center">
                    {getStatusBadge(movement.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        title="Visualizar Detalhes"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Opções"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-50/75 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Exibindo 1 a {filteredMovements.length} de {filteredMovements.length} registros</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled
            className="p-1 rounded border border-slate-200 bg-white text-slate-300 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-xs">
            1
          </span>
          <button
            disabled
            className="p-1 rounded border border-slate-200 bg-white text-slate-300 cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
