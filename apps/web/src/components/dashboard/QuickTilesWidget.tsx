import React from 'react';
import {
  FileText,
  PlusCircle,
  RefreshCw,
  PieChart,
  CalendarCheck,
  Users,
} from 'lucide-react';

interface QuickTilesWidgetProps {
  onOpenQuickEntry: () => void;
  onOpenApprovals?: () => void;
  onOpenCommandCenter?: () => void;
  onSelectSubModule?: (subModuleId: string) => void;
}

export function QuickTilesWidget({
  onOpenQuickEntry,
  onOpenApprovals,
  onOpenCommandCenter,
  onSelectSubModule,
}: QuickTilesWidgetProps) {
  const tiles = [
    {
      label: 'Novo Lançamento',
      sub: 'Contas a Pagar/Receber',
      icon: PlusCircle,
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 cursor-pointer',
      action: onOpenQuickEntry,
    },
    {
      label: 'Conciliação 1:1',
      sub: 'Extratos Bancários',
      icon: RefreshCw,
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 cursor-pointer',
      action: () => onSelectSubModule?.('fin-conciliacao'),
    },
    {
      label: 'Balanço Patrimonial',
      sub: 'Demonstrativo Oficial',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 cursor-pointer',
      action: () => onSelectSubModule?.('acc-balanco'),
    },
    {
      label: 'DRE do Exercício',
      sub: 'Margem & EBITDA',
      icon: PieChart,
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200 cursor-pointer',
      action: () => onSelectSubModule?.('acc-dre'),
    },
    {
      label: 'Fechamento Contábil',
      sub: 'Competência Out/26',
      icon: CalendarCheck,
      color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 cursor-pointer',
      action: () => onSelectSubModule?.('acc-periods'),
    },
    {
      label: 'Folha de Pagamento',
      sub: 'Cálculo & eSocial',
      icon: Users,
      color: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 cursor-pointer',
      action: () => onSelectSubModule?.('rh-folha'),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Tiles & Atalhos Corporativos
        </h3>
        <span
          onClick={onOpenCommandCenter}
          className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline"
          title="Abrir Central de Comandos (Ctrl+K)"
        >
          Personalizar (Ctrl+K)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
              onClick={tile.action}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between hover:shadow-sm ${tile.color}`}
            >
              <Icon className="w-4 h-4 mb-2 opacity-90" />
              <div>
                <div className="text-xs font-bold leading-tight">{tile.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{tile.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
