import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RemindersWidgetProps {
  onOpenApprovals: () => void;
}

export function RemindersWidget({ onOpenApprovals }: RemindersWidgetProps) {
  const reminders = [
    {
      title: 'Aprovações Pendentes',
      count: 3,
      desc: 'Pagamentos acima de R$ 50.000 aguardando alçada',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeColor: 'bg-rose-600 text-white',
      icon: ShieldAlert,
      onClick: onOpenApprovals,
    },
    {
      title: 'Pagamentos Hoje',
      count: 8,
      desc: 'R$ 142.800,00 previstos para liquidação bancária',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'bg-amber-600 text-white',
      icon: Clock,
      onClick: () => {},
    },
    {
      title: 'Obrigações Fiscais',
      count: 2,
      desc: 'Transmissão de DCTFWeb e EFD Contribuições',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'bg-blue-600 text-white',
      icon: AlertCircle,
      onClick: () => {},
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Lembretes & Pendências
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Hoje</span>
      </div>

      <div className="space-y-2.5">
        {reminders.map((rem) => {
          const Icon = rem.icon;
          return (
            <button
              key={rem.title}
              onClick={rem.onClick}
              className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between group hover:shadow-sm ${rem.color}`}
            >
              <div className="flex items-start space-x-2.5">
                <Icon className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {rem.title}
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                    {rem.desc}
                  </div>
                </div>
              </div>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${rem.badgeColor}`}>
                {rem.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
