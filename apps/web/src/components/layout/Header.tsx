import React, { useState } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  Building2,
  ChevronDown,
  Plus,
  HelpCircle,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandCenter: () => void;
  onOpenQuickEntry: () => void;
  onOpenApprovals: () => void;
}

export function Header({
  onOpenCommandCenter,
  onOpenQuickEntry,
  onOpenApprovals,
}: HeaderProps) {
  const [activeCompany, setActiveCompany] = useState('ACME Matriz Brasil (0001)');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const companies = [
    'ACME Matriz Brasil (0001)',
    'ACME Filial São Paulo (0002)',
    'ACME Filial Rio de Janeiro (0003)',
    'ACME Logística Sul (0004)',
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo & Multi-Company Selector */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm">
              K
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                KEEPER <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-400/20">ERP v1</span>
              </div>
            </div>
          </div>

          {/* Company / Branch Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="flex items-center space-x-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-md border border-slate-700/60 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeCompany}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                  Unidades do Grupo
                </div>
                {companies.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => {
                      setActiveCompany(comp);
                      setIsCompanyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700/60 transition-colors flex items-center justify-between ${
                      comp === activeCompany ? 'text-blue-400 font-semibold bg-slate-700/30' : 'text-slate-300'
                    }`}
                  >
                    <span>{comp}</span>
                    {comp === activeCompany && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Command Center Search Input */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={onOpenCommandCenter}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner group"
          >
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>O que você procura? (ex: NF, Título, Fornecedor...)</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-700/60 text-slate-300 rounded border border-slate-600/50">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Actions & User Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Entry Action */}
          <button
            onClick={onOpenQuickEntry}
            className="hidden sm:flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Lançamento</span>
          </button>

          {/* Approvals Shield Button */}
          <button
            onClick={onOpenApprovals}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Central de Aprovações"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>

          {/* Notifications Bell */}
          <button
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Notificações & Alertas"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 px-1 min-w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              12
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Admin Master</div>
              <div className="text-[10px] text-slate-400">Diretoria Executiva</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
