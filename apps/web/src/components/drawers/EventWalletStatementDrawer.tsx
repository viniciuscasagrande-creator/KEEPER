import React, { useState, useEffect } from 'react';
import {
  X,
  Ticket,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Filter,
  FileText,
  Search,
} from 'lucide-react';
import { api } from '../../services/api';

interface EventWalletStatementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: any | null;
}

export function EventWalletStatementDrawer({
  isOpen,
  onClose,
  wallet,
}: EventWalletStatementDrawerProps) {
  const [statementData, setStatementData] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  useEffect(() => {
    if (isOpen && wallet) {
      setIsLoading(true);
      api
        .getEventStatement(wallet.id)
        .then((res) => setStatementData(res))
        .catch(() => {
          // Fallback mock
          setStatementData({
            walletId: wallet.id,
            eventName: wallet.eventName,
            producerName: wallet.producerName,
            clearingAccount: 'Itaú CC 99012-3 (Escrow)',
            currentBalance: wallet.balanceAvailable || 150000.0,
            entries: [
              {
                id: 'stmt-001',
                date: '2026-10-08T09:15:00Z',
                type: 'TICKET_SALE',
                description: 'Venda de Ingressos Lote 1 - Pedido #102938 (Cliente: Mariana Lima)',
                referenceNumber: '#102938',
                amount: 200.0,
                runningBalance: 200.0,
                economicOwner: 'PRODUCER',
                channel: 'ONLINE',
                authorizedBy: 'GATEWAY_API',
              },
              {
                id: 'stmt-002',
                date: '2026-10-08T09:15:00Z',
                type: 'DISK_FEE',
                description: 'Taxa de Conveniência DiskIngressos (10%) - Pedido #102938',
                referenceNumber: '#102938',
                amount: 20.0,
                runningBalance: 200.0,
                economicOwner: 'DISKINGRESSOS',
                channel: 'ONLINE',
                authorizedBy: 'SETTLEMENT_ENGINE',
              },
              {
                id: 'stmt-003',
                date: '2026-10-08T09:15:00Z',
                type: 'SPREAD_FEE',
                description: 'Spread Financeiro (2,5%) - Pedido #102938 (Pago pelo Cliente)',
                referenceNumber: '#102938',
                amount: 5.0,
                runningBalance: 200.0,
                economicOwner: 'DISKINGRESSOS',
                channel: 'ONLINE',
                authorizedBy: 'SETTLEMENT_ENGINE',
              },
              {
                id: 'stmt-004',
                date: '2026-10-07T14:30:00Z',
                type: 'EXPENSE',
                description: 'Despesa Segurança Armada & Brigada - GuardSeg Ltda (NF 4921)',
                referenceNumber: 'EXP-9021',
                amount: -30000.0,
                runningBalance: 320000.0,
                economicOwner: 'SUPPLIER_PAYMENT',
                channel: 'MANUAL_ENTRY',
                authorizedBy: 'Carlos Eduardo (Gerente Financeiro)',
              },
              {
                id: 'stmt-005',
                date: '2026-10-07T11:00:00Z',
                type: 'EXPENSE',
                description: 'Locação de Geradores & Som - Stark Iluminação (NF 1802)',
                referenceNumber: 'EXP-9020',
                amount: -20000.0,
                runningBalance: 350000.0,
                economicOwner: 'SUPPLIER_PAYMENT',
                channel: 'MANUAL_ENTRY',
                authorizedBy: 'Fernanda Lima (Coord. Eventos)',
              },
              {
                id: 'stmt-006',
                date: '2026-10-06T16:00:00Z',
                type: 'PRODUCER_REPAYMENT',
                description: 'Repasse Parcial #001 via PIX - Conta Itaú CC 88120-1',
                referenceNumber: 'REP-001',
                amount: -100000.0,
                runningBalance: 370000.0,
                economicOwner: 'PRODUCER_WITHDRAWAL',
                channel: 'PIX_BACEN',
                authorizedBy: 'Vinicius Casagrande (Diretoria)',
              },
            ],
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, wallet]);

  if (!isOpen || !wallet) return null;

  const entries = statementData?.entries || [];
  const filteredEntries = entries.filter((e: any) => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* 1. Header Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs">
              <Ticket className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Extrato Financeiro do Evento
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {wallet.eventName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Event Wallet Summary Box */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Produtor: <strong>{wallet.producerName}</strong></span>
            <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
              CONTA DE LIQUIDAÇÃO: ITAÚ ESCROW
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Vendas Brutas</div>
              <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                {fmt(wallet.grossSales || 500000)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Despesas / Retenções</div>
              <div className="text-base font-mono font-bold text-rose-400 mt-0.5">
                - {fmt((wallet.diskFeeTotal || 50000) + (wallet.expensesTotal || 80000))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Saldo Livre para Repasse</div>
              <div className="text-lg font-mono font-black text-amber-300 mt-0.5">
                {fmt(wallet.balanceAvailable || 150000)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Filter Bar */}
        <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({entries.length})
            </button>
            <button
              onClick={() => setFilterType('TICKET_SALE')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterType === 'TICKET_SALE' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendas
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterType === 'EXPENSE' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Despesas
            </button>
            <button
              onClick={() => setFilterType('PRODUCER_REPAYMENT')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterType === 'PRODUCER_REPAYMENT' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Repasses
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rastreabilidade por Centavo</span>
          </div>
        </div>

        {/* 4. Statement Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Carregando extrato analítico...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Nenhum lançamento encontrado.</div>
          ) : (
            filteredEntries.map((e: any) => {
              const isPositive = e.amount > 0;
              const isRepayment = e.type === 'PRODUCER_REPAYMENT';
              const isFee = e.type === 'DISK_FEE' || e.type === 'SPREAD_FEE';

              return (
                <div
                  key={e.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                          isRepayment
                            ? 'bg-blue-100 text-blue-700'
                            : isFee
                            ? 'bg-purple-100 text-purple-700'
                            : isPositive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isRepayment ? (
                          <Building2 className="w-4 h-4" />
                        ) : isFee ? (
                          <DollarSign className="w-4 h-4" />
                        ) : isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </span>

                      <div>
                        <div className="font-bold text-slate-900 leading-snug">{e.description}</div>
                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-slate-400">
                            {new Date(e.date).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(e.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>·</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                            Ref: {e.referenceNumber}
                          </span>
                          <span>·</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Auth: {e.authorizedBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`font-mono font-black text-sm ${
                          isRepayment
                            ? 'text-blue-700'
                            : isFee
                            ? 'text-purple-700'
                            : isPositive
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? `+ ${fmt(e.amount)}` : fmt(e.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Saldo: {fmt(e.runningBalance)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => alert('Exportando extrato completo em PDF/Excel para prestação de contas com o produtor...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar Prestação de Contas (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-colors"
          >
            Fechar Extrato
          </button>
        </div>
      </div>
    </div>
  );
}
