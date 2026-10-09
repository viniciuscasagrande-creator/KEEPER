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
  MousePointer,
  MousePointerClick,
  X,
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
  const [isPinned, setIsPinned] = useState(false);
  const [triggerMode, setTriggerMode] = useState<'click' | 'hover'>(() => {
    try {
      const saved = localStorage.getItem('keeper_nav_trigger_mode');
      return saved === 'hover' ? 'hover' : 'click';
    } catch {
      return 'click';
    }
  });

  const navRef = useRef<HTMLDivElement>(null);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleModeChange = (newMode: 'click' | 'hover') => {
    setTriggerMode(newMode);
    try {
      localStorage.setItem('keeper_nav_trigger_mode', newMode);
    } catch {
      // ignore
    }
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
        setIsPinned(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
        setIsPinned(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
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

  const handleButtonMouseEnter = (modId: string, hasSubmenus: boolean) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (triggerMode === 'hover' && hasSubmenus) {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = setTimeout(() => {
        setOpenDropdownId(modId);
        setIsPinned(false);
      }, 130);
    }
  };

  const handleDropdownMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    // Se estiver fixado (aberto deliberadamente via clique), não fecha pelo mouseleave!
    if (isPinned) return;

    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 280);
  };

  const handleButtonClick = (modId: string, hasSubmenus: boolean) => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);

    onSelectModule(modId);

    if (hasSubmenus) {
      if (openDropdownId === modId) {
        setOpenDropdownId(null);
        setIsPinned(false);
      } else {
        setOpenDropdownId(modId);
        setIsPinned(true);
      }
    } else {
      setOpenDropdownId(null);
      setIsPinned(false);
    }
  };

  const renderModuleButton = (mod: ModuleNav, colIndex: number) => {
    const Icon = iconMap[mod.icon] || LayoutDashboard;
    const isActive = activeModuleId === mod.id;
    const isOpen = openDropdownId === mod.id;
    const hasSubmenus = mod.groups.length > 0;
    // Align dropdown right on the rightmost columns to prevent viewport overflow
    const isRightAligned = colIndex >= 3;

    return (
      <div
        key={mod.id}
        className={`relative ${isOpen ? 'z-50' : 'z-10'}`}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => handleButtonClick(mod.id, hasSubmenus)}
          onMouseEnter={() => handleButtonMouseEnter(mod.id, hasSubmenus)}
          className={`w-full h-[40px] flex items-center justify-between px-3 py-2 rounded-lg text-xs lg:text-[13px] font-semibold tracking-normal transition-all whitespace-nowrap select-none group ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-800/50 border border-slate-700/60'
          }`}
          title={
            hasSubmenus
              ? `${mod.label} — Clique para abrir submenus`
              : mod.label
          }
        >
          <div className="flex items-center space-x-2 min-w-0 truncate">
            <Icon className="w-4 h-4 opacity-95 shrink-0" />
            <span className="truncate">{mod.label}</span>
          </div>

          {hasSubmenus && (
            <ChevronDown
              className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-transform duration-150 shrink-0 ml-1.5 ${
                isOpen ? 'rotate-180 text-white opacity-100' : ''
              }`}
            />
          )}
        </button>

        {/* Mega-Dropdown Menu com Ponte Invisível e Tolerância Anti-Flicker */}
        {isOpen && hasSubmenus && (
          <div
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`absolute ${
              isRightAligned ? 'right-0' : 'left-0'
            } top-full pt-1.5 w-80 sm:w-96 md:w-[520px] z-50`}
          >
            {/* O pseudo-elemento before:-top-3 preenche a fresta entre botão e menu, impedindo que o cursor caia em área morta */}
            <div className="relative bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-160px)] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4 before:bg-transparent">
              {/* Header do Mega-Menu */}
              <div className="col-span-1 md:col-span-2 flex items-center justify-between pb-2 mb-0.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {mod.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({mod.groups.reduce((acc, g) => acc + g.items.length, 0)} opções)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(null);
                    setIsPinned(false);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Fechar menu (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {mod.groups.map((group) => (
                <div key={group.groupName} className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1 border-b border-slate-800/80">
                    {group.groupName}
                  </div>
                  <div className="space-y-0.5 pt-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectSubModule(item.id);
                          setOpenDropdownId(null);
                          setIsPinned(false);
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
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
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
          </div>
        )}
      </div>
    );
  };

  return (
    <nav ref={navRef} className="bg-slate-900 border-b border-slate-800 shadow-md relative z-30 select-none">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Barra superior de controle do menu: Título + Alternador de modo (Ao Clicar / Ao Passar Mouse) */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Navegação Corporativa Keeper</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline">12 Módulos Integrados com Ledger Central</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] hidden md:inline">Abertura dos Submenus:</span>
            <div className="inline-flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80">
              <button
                type="button"
                onClick={() => handleModeChange('click')}
                title="Recomendado: os submenus só abrem ao clicar no botão. Não abrem acidentalmente ao passar o mouse."
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  triggerMode === 'click'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>Ao Clicar (Estável)</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('hover')}
                title="Os submenus abrem suavemente ao posicionar o mouse com tolerância de movimento anti-queda."
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  triggerMode === 'hover'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span>Ao Passar Mouse</span>
              </button>
            </div>
          </div>
        </div>

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
