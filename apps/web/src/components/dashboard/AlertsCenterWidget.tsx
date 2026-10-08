import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function AlertsCenterWidget() {
  const alerts = [
    {
      level: 'CRITICAL',
      title: '3 Pagamentos Vencidos',
      desc: 'Títulos de fornecedores totalizando R$ 85.000,00 com vencimento expirado.',
      actionLabel: 'Pagar Agora',
      color: 'bg-rose-50 border-rose-200 text-rose-800',
      dotColor: 'bg-rose-500',
    },
    {
      level: 'WARNING',
      title: 'Fechamento Contábil Pendente',
      desc: 'Competência Setembro/2026 possui 2 lançamentos em auditoria antes da trava.',
      actionLabel: 'Auditar',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      dotColor: 'bg-amber-500',
    },
    {
      level: 'WARNING',
      title: 'Obrigação Fiscal DCTFWeb',
      desc: 'Prazo limite de transmissão da declaração vence em 4 dias úteis.',
      actionLabel: 'Ver Guia',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      dotColor: 'bg-amber-500',
    },
    {
      level: 'SUCCESS',
      title: 'Conciliação Bancária Concluída',
      desc: 'Extratos de Banco do Brasil e Itaú 100% conciliados até ontem.',
      actionLabel: 'Ver Extrato',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dotColor: 'bg-emerald-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Centro de Alertas & Inteligência
        </h3>
        <span className="text-[11px] text-slate-500">4 Alertas Ativos</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className={`p-2.5 rounded-lg border text-xs flex items-start justify-between ${alert.color}`}
          >
            <div className="flex items-start space-x-2.5 pr-2">
              <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${alert.dotColor}`} />
              <div>
                <div className="font-bold text-slate-900">{alert.title}</div>
                <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                  {alert.desc}
                </div>
              </div>
            </div>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 shrink-0 flex items-center mt-0.5">
              <span>{alert.actionLabel}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
