import React, { useState, useRef, useEffect, useMemo } from 'react';
import { navigationModules } from '../../data/navigationData';
import { ModuleNav } from '../../types/navigation';
import {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Receipt,
  Users,
  ShoppingCart,
  Package,
  Boxes,
  CreditCard,
  Sparkles,
  Settings,
  Briefcase,
  Handshake,
  Scale,
  FileText,
  HardHat,
  ChevronDown,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Receipt,
  Users,
  ShoppingCart,
  Package,
  Boxes,
  CreditCard,
  Sparkles,
  Settings,
  Briefcase,
  Handshake,
  Scale,
  FileText,
  HardHat,
};

interface HorizontalNavProps {
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
  onSelectSubModule?: (subModuleId: string) => void;
}

export function HorizontalNav({
  activeModuleId,
  onSelectModule,
  onSelectSubModule = () => {},
}: HorizontalNavProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Organização dos módulos por ordem de importância e prioridade operacional
  // Nível 1: Gestão Financeira, Controladoria & Negócios Core
  const tier1Modules = useMemo(() => {
    const ids = ['dashboard', 'financeiro', 'contabil', 'fiscal', 'crm', 'contratos'];
    return ids
      .map((id) => navigationModules.find((m) => m.id === id))
      .filter(Boolean) as ModuleNav[];
  }, []);

  // Nível 2: Operações, Logística de Hardwares, Suporte & Governança
  const tier2Modules = useMemo(() => {
    const ids = ['projetos', 'ativos', 'compras', 'rh', 'inteligencia', 'configuracoes'];
    return ids
      .map((id) => navigationModules.find((m) => m.id === id))
      .filter(Boolean) as ModuleNav[];
  }, []);

  const isTier1Open = tier1Modules.some((m) => m.id === openDropdownId);
  const isTier2Open = tier2Modules.some((m) => m.id === openDropdownId);

  const renderModuleButton = (mod: ModuleNav, colIndex: number) => {
    const Icon = iconMap[mod.icon] || LayoutDashboard;
    const isActive = activeModuleId === mod.id;
    const isOpen = openDropdownId === mod.id;
    // Align dropdown right on the rightmost columns to prevent viewport overflow
    const isRightAligned = colIndex >= 3;

    return (
      <div
        key={mod.id}
        className={`relative ${isOpen ? 'z-50' : 'z-10'}`}
        onMouseLeave={() => setOpenDropdownId(null)}
      >
        <button
          onClick={() => {
            onSelectModule(mod.id);
            setOpenDropdownId(isOpen ? null : mod.id);
          }}
          onMouseEnter={() => setOpenDropdownId(mod.id)}
          className={`w-full h-[40px] flex items-center justify-center px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold tracking-normal transition-all whitespace-nowrap select-none ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-800/50 border border-slate-700/60'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 min-w-0 truncate">
            <Icon className="w-4 h-4 opacity-95 shrink-0" />
            <span className="truncate text-center">{mod.label}</span>
            {mod.groups.length > 0 && (
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 shrink-0 ${
                  isOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            )}
          </div>
        </button>

        {/* Mega-Dropdown Menu */}
        {isOpen && mod.groups.length > 0 && (
          <div
            onMouseEnter={() => setOpenDropdownId(mod.id)}
            className={`absolute ${
              isRightAligned ? 'right-0' : 'left-0'
            } mt-2 w-80 sm:w-96 md:w-[500px] max-h-[calc(100vh-140px)] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
          >
            {mod.groups.map((group) => (
              <div key={group.groupName} className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 border-b border-slate-800">
                  {group.groupName}
                </div>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSubModule(item.id);
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-between group"
                    >
                      <div className="pr-2">
                        <div className="font-medium group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav ref={navRef} className="bg-slate-900 border-b border-slate-800 shadow-md relative z-30 select-none">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="space-y-2">
          {/* Nível 1: Gestão Financeira, Controladoria & Negócios Core (6 Menus) */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 relative ${isTier1Open ? 'z-40' : 'z-20'}`}>
            {tier1Modules.map((mod, idx) => renderModuleButton(mod, idx))}
          </div>

          {/* Nível 2: Operações, Logística de Hardwares, Suporte & Governança (6 Menus) */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80 relative ${isTier2Open ? 'z-40' : 'z-10'}`}>
            {tier2Modules.map((mod, idx) => renderModuleButton(mod, idx))}
          </div>
        </div>
      </div>
    </nav>
  );
}
