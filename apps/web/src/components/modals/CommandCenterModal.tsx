import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  ArrowRight,
  PlusCircle,
  FileText,
  DollarSign,
  Users,
  Settings,
  X,
  CreditCard,
  Building2,
  FolderOpen,
} from 'lucide-react';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickEntry?: () => void;
  onOpenApprovals?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Ações Rápidas' | 'Navegação' | 'Consultas' | 'Relatórios';
  title: string;
  subtitle: string;
  icon: any;
  action: () => void;
  shortcut?: string;
}

export function CommandCenterModal({
  isOpen,
  onClose,
  onOpenQuickEntry,
  onOpenApprovals,
}: CommandCenterModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    {
      id: 'cmd-new-payment',
      category: 'Ações Rápidas',
      title: 'Novo Título a Pagar / Receber',
      subtitle: 'Entrada rápida de contas no Financeiro',
      icon: PlusCircle,
      shortcut: 'N',
      action: () => {
        onClose();
        if (onOpenQuickEntry) onOpenQuickEntry();
      },
    },
    {
      id: 'cmd-approvals',
      category: 'Ações Rápidas',
      title: 'Fila de Aprovações Pendentes',
      subtitle: '7 solicitações de compras e pagamentos',
      icon: CreditCard,
      shortcut: 'A',
      action: () => {
        onClose();
        if (onOpenApprovals) onOpenApprovals();
      },
    },
    {
      id: 'cmd-nav-dre',
      category: 'Relatórios',
      title: 'DRE Consolidada (Demonstração do Resultado)',
      subtitle: 'Contabilidade gerencial em tempo real por regime de competência',
      icon: FileText,
      action: () => {
        alert('Navegando para DRE Consolidada...');
        onClose();
      },
    },
    {
      id: 'cmd-nav-cashflow',
      category: 'Navegação',
      title: 'Fluxo de Caixa Diário Projetado',
      subtitle: 'Financeiro > Tesouraria > Visão 30/60/90 dias',
      icon: DollarSign,
      action: () => {
        alert('Navegando para Fluxo de Caixa...');
        onClose();
      },
    },
    {
      id: 'cmd-nav-payroll',
      category: 'Navegação',
      title: 'Folha de Pagamento & eSocial',
      subtitle: 'RH > Competência Outubro/2026',
      icon: Users,
      action: () => {
        alert('Navegando para Folha de Pagamento...');
        onClose();
      },
    },
    {
      id: 'cmd-query-partner',
      category: 'Consultas',
      title: 'Consultar CNPJ / Parceiro Comercial',
      subtitle: 'Base unificada de fornecedores, clientes e prestadores',
      icon: Building2,
      action: () => {
        alert('Abrindo consulta de parceiros...');
        onClose();
      },
    },
    {
      id: 'cmd-settings-chart-accounts',
      category: 'Navegação',
      title: 'Plano de Contas Referencial',
      subtitle: 'Contabilidade > Estrutura de contas e centros de custo',
      icon: FolderOpen,
      action: () => {
        alert('Abrindo Plano de Contas...');
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in duration-150">
        {/* Header Search */}
        <div className="relative border-b border-slate-200 px-4 py-3.5 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Digite o que deseja fazer ou buscar (ex: DRE, pagar, cliente)..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results list */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Nenhum comando ou registro encontrado para "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-blue-600 opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↓</kbd>
              para navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↵</kbd>
              para selecionar
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">Enterprise ERP v1.0</span>
        </div>
      </div>
    </div>
  );
}
