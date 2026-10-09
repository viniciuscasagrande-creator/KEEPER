import React, { useState, useRef, useEffect } from 'react';
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
  CreditCard,
  Sparkles,
  Settings,
  Briefcase,
  Handshake,
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
  CreditCard,
  Sparkles,
  Settings,
  Briefcase,
  Handshake,
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="bg-slate-900 border-b border-slate-800 shadow-sm relative z-30">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {navigationModules.map((mod) => {
            const Icon = iconMap[mod.icon] || LayoutDashboard;
            const isActive = activeModuleId === mod.id;
            const isOpen = openDropdownId === mod.id;

            return (
              <div key={mod.id} className="relative">
                <button
                  onClick={() => {
                    onSelectModule(mod.id);
                    setOpenDropdownId(isOpen ? null : mod.id);
                  }}
                  onMouseEnter={() => setOpenDropdownId(mod.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-90" />
                  <span>{mod.label}</span>
                  {mod.groups.length > 0 && (
                    <ChevronDown
                      className={`w-3 h-3 opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* Mega-Dropdown Menu */}
                {isOpen && mod.groups.length > 0 && (
                  <div
                    onMouseLeave={() => setOpenDropdownId(null)}
                    className="absolute left-0 mt-1 w-80 sm:w-96 md:w-[480px] bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
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
          })}
        </div>
      </div>
    </nav>
  );
}
