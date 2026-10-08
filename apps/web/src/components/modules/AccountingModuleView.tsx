import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Download,
  ShieldCheck,
  RefreshCw,
  Plus,
  Eye,
  FileCheck2,
} from 'lucide-react';
import { api } from '../../services/api';

export function AccountingModuleView() {
  const [activeTab, setActiveTab] = useState<'chart' | 'journal' | 'trial' | 'dre'>('chart');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reversalMessage, setReversalMessage] = useState<string | null>(null);

  // Mock Plano de Contas
  const chartOfAccounts = [
    { code: '1', name: 'ATIVO', type: 'ASSET', nature: 'DEBIT', isSynthetic: true, balance: 3240180.0 },
    { code: '1.1', name: 'ATIVO CIRCULANTE', type: 'ASSET', nature: 'DEBIT', isSynthetic: true, balance: 3240180.0 },
    { code: '1.1.01', name: 'Disponibilidades (Caixa e Bancos)', type: 'ASSET', nature: 'DEBIT', isSynthetic: true, balance: 3240180.0 },
    { code: '1.1.01.001', name: 'Banco Itaú S.A. - Ag. 0422', type: 'ASSET', nature: 'DEBIT', isSynthetic: false, balance: 1845230.5 },
    { code: '1.1.01.002', name: 'Banco Bradesco S.A. - Ag. 1024', type: 'ASSET', nature: 'DEBIT', isSynthetic: false, balance: 840950.0 },
    { code: '1.1.01.003', name: 'Banco Santander - Aplicação CDB', type: 'ASSET', nature: 'DEBIT', isSynthetic: false, balance: 554000.0 },
    { code: '1.1.02', name: 'Contas a Receber de Clientes', type: 'ASSET', nature: 'DEBIT', isSynthetic: true, balance: 232500.0 },
    { code: '1.1.02.001', name: 'Clientes Nacionais - Licenciamento ERP', type: 'ASSET', nature: 'DEBIT', isSynthetic: false, balance: 232500.0 },
    { code: '2', name: 'PASSIVO', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: true, balance: 302400.0 },
    { code: '2.1', name: 'PASSIVO CIRCULANTE', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: true, balance: 302400.0 },
    { code: '2.1.01', name: 'Fornecedores a Pagar', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: true, balance: 87800.0 },
    { code: '2.1.01.001', name: 'Fornecedores Nacionais - Infraestrutura', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: false, balance: 87800.0 },
    { code: '2.1.02', name: 'Obrigações Tributárias e Fiscais', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: true, balance: 214600.0 },
    { code: '2.1.02.001', name: 'IRPJ e CSLL a Recolher', type: 'LIABILITY', nature: 'CREDIT', isSynthetic: false, balance: 214600.0 },
    { code: '3', name: 'PATRIMÔNIO LÍQUIDO', type: 'EQUITY', nature: 'CREDIT', isSynthetic: true, balance: 2000000.0 },
    { code: '3.1.01', name: 'Capital Social Integralizado', type: 'EQUITY', nature: 'CREDIT', isSynthetic: false, balance: 2000000.0 },
    { code: '4', name: 'RECEITAS', type: 'REVENUE', nature: 'CREDIT', isSynthetic: true, balance: 1745200.0 },
    { code: '4.1.01', name: 'Receita Bruta com Licenciamento de Software', type: 'REVENUE', nature: 'CREDIT', isSynthetic: false, balance: 1450000.0 },
    { code: '4.1.02', name: 'Receita de Serviços de Implantação e Customização', type: 'REVENUE', nature: 'CREDIT', isSynthetic: false, balance: 295200.0 },
    { code: '5', name: 'CUSTOS E DESPESAS OPERACIONAIS', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: true, balance: 928450.0 },
    { code: '5.1.01', name: 'Despesas com Folha de Pagamento e Encargos', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: false, balance: 520000.0 },
    { code: '5.1.02', name: 'Serviços de Terceiros e Nuvem (AWS Latam)', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: false, balance: 103450.0 },
    { code: '5.1.03', name: 'Ocupação Predial e Locação', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: false, balance: 45000.0 },
    { code: '5.2.01', name: 'Auditoria Externa e Consultorias Contábeis', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: false, balance: 65000.0 },
    { code: '5.3.01', name: 'Despesas Tributárias e Impostos', type: 'EXPENSE', nature: 'DEBIT', isSynthetic: false, balance: 195000.0 },
  ];

  // Mock Journal Entries (Diário / Razão)
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 'je-001',
      entryNumber: 10041,
      entryDate: '2026-10-08',
      description: 'Baixa de título a pagar referente à fatura AWS Cloud Services Latam',
      totalAmount: 38450.75,
      isReversed: false,
      lines: [
        { accountCode: '2.1.01.001', accountName: 'Fornecedores Nacionais', type: 'DEBIT', amount: 38450.75 },
        { accountCode: '1.1.01.002', accountName: 'Banco Bradesco S.A.', type: 'CREDIT', amount: 38450.75 },
      ],
    },
    {
      id: 'je-002',
      entryNumber: 10040,
      entryDate: '2026-10-06',
      description: 'Recebimento de honorários de consultoria Hospital das Clínicas',
      totalAmount: 112000.0,
      isReversed: false,
      lines: [
        { accountCode: '1.1.01.001', accountName: 'Banco Itaú S.A.', type: 'DEBIT', amount: 112000.0 },
        { accountCode: '1.1.02.001', accountName: 'Clientes Nacionais - Licenciamento ERP', type: 'CREDIT', amount: 112000.0 },
      ],
    },
    {
      id: 'je-003',
      entryNumber: 10039,
      entryDate: '2026-10-01',
      description: 'Apropriação de despesa de locação comercial Office Tower Gestão Predial',
      totalAmount: 22800.0,
      isReversed: false,
      lines: [
        { accountCode: '5.1.03', accountName: 'Ocupação Predial e Locação', type: 'DEBIT', amount: 22800.0 },
        { accountCode: '2.1.01.001', accountName: 'Fornecedores Nacionais', type: 'CREDIT', amount: 22800.0 },
      ],
    },
    {
      id: 'je-004',
      entryNumber: 10038,
      entryDate: '2026-10-01',
      description: 'Faturamento mensal contrato TechCorp Brasil Tecnologia',
      totalAmount: 145000.0,
      isReversed: false,
      lines: [
        { accountCode: '1.1.02.001', accountName: 'Clientes Nacionais - Licenciamento ERP', type: 'DEBIT', amount: 145000.0 },
        { accountCode: '4.1.01', accountName: 'Receita Bruta com Licenciamento', type: 'CREDIT', amount: 145000.0 },
      ],
    },
  ]);

  const handleReverseEntry = (id: string, entryNumber: number) => {
    setJournalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isReversed: true } : e))
    );
    setReversalMessage(`Lançamento nº ${entryNumber} estornado com sucesso! Partida de contrapartida gerada no razão.`);
    setTimeout(() => setReversalMessage(null), 2500);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const filteredChart = chartOfAccounts.filter(
    (c) =>
      c.code.includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>ERP</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Controladoria & Contabilidade</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Módulo Contábil & Livro Razão Geral
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Período Out/2026: Aberto</span>
          </div>
          <button
            onClick={() => alert('Exportando SPED Contábil (ECD) em formato compatível com Validador RFB...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar ECD (SPED)</span>
          </button>
        </div>
      </div>

      {reversalMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{reversalMessage}</span>
        </div>
      )}

      {/* Compliance Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Débitos no Mês</div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            {fmt(317700.75)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Livro Diário Balanceado</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Créditos no Mês</div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">
            {fmt(317700.75)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Livro Diário Balanceado</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Diferença Débito vs Crédito</div>
          <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
            R$ 0,00
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Partidas dobradas 100% exatas</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Resultado Líquido (DRE)</div>
          <div className="text-xl font-black text-blue-700 mt-1 font-mono">
            {fmt(1745200 - 928450)}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">Lucro Operacional Líquido</div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/75 px-4 flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('chart')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'chart'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Plano de Contas Estruturado</span>
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'journal'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Livro Diário / Razão ({journalEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('trial')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'trial'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Balancete de Verificação</span>
            </button>
            <button
              onClick={() => setActiveTab('dre')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'dre'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>DRE - Resultado do Exercício</span>
            </button>
          </div>

          {activeTab === 'chart' && (
            <div className="relative py-2">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por código ou conta..."
                className="pl-7 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 w-52 text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Chart of Accounts */}
        {activeTab === 'chart' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-4 w-40">Código Estruturado</th>
                  <th className="py-2.5 px-4">Classificação da Conta</th>
                  <th className="py-2.5 px-4 w-32 text-center">Tipo</th>
                  <th className="py-2.5 px-4 w-28 text-center">Natureza</th>
                  <th className="py-2.5 px-4 text-right">Saldo Atual (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredChart.map((account) => {
                  const depth = (account.code.match(/\./g) || []).length;
                  return (
                    <tr
                      key={account.code}
                      className={`hover:bg-slate-50 transition-colors ${
                        account.isSynthetic ? 'bg-slate-50/50 font-bold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 px-4 text-slate-800">{account.code}</td>
                      <td className="py-2.5 px-4">
                        <span style={{ paddingLeft: `${depth * 14}px` }} className="font-sans">
                          {account.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            account.isSynthetic
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {account.isSynthetic ? 'Sintética' : 'Analítica'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-sans">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            account.nature === 'DEBIT'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {account.nature === 'DEBIT' ? 'Devedora' : 'Credora'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold">
                        {fmt(account.balance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Journal Entries */}
        {activeTab === 'journal' && (
          <div className="p-6 space-y-4">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className={`bg-white border rounded-xl p-4 shadow-2xs transition-all ${
                  entry.isReversed ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Lançamento #{entry.entryNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Data: {new Date(entry.entryDate).toLocaleDateString('pt-BR')}
                    </span>
                    {entry.isReversed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Estornado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      Total: {fmt(entry.totalAmount)}
                    </span>
                    {!entry.isReversed && (
                      <button
                        onClick={() => handleReverseEntry(entry.id, entry.entryNumber)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded transition-colors"
                      >
                        Estornar
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-600 italic">
                  <strong>Histórico:</strong> {entry.description}
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <th className="py-1.5 px-3 text-left">Conta Contábil</th>
                        <th className="py-1.5 px-3 text-center w-24">Partida</th>
                        <th className="py-1.5 px-3 text-right w-36">Débito</th>
                        <th className="py-1.5 px-3 text-right w-36">Crédito</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {entry.lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-1.5 px-3 font-sans text-slate-800">
                            <span className="font-mono text-slate-500 mr-2">{line.accountCode}</span>
                            {line.accountName}
                          </td>
                          <td className="py-1.5 px-3 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                line.type === 'DEBIT'
                                  ? 'bg-sky-50 text-sky-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {line.type === 'DEBIT' ? 'D' : 'C'}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-900 font-semibold">
                            {line.type === 'DEBIT' ? fmt(line.amount) : '-'}
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-900 font-semibold">
                            {line.type === 'CREDIT' ? fmt(line.amount) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Trial Balance (Balancete) */}
        {activeTab === 'trial' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Descrição da Conta</th>
                  <th className="py-2.5 px-4 text-right">Saldo Inicial</th>
                  <th className="py-2.5 px-4 text-right">Débitos</th>
                  <th className="py-2.5 px-4 text-right">Créditos</th>
                  <th className="py-2.5 px-4 text-right">Saldo Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-bold">1.1.01.001</td>
                  <td className="py-2 px-4 font-sans">Banco Itaú S.A.</td>
                  <td className="py-2 px-4 text-right">{fmt(1733230.5)}</td>
                  <td className="py-2 px-4 text-right text-sky-700">{fmt(112000.0)}</td>
                  <td className="py-2 px-4 text-right text-slate-400">-</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">{fmt(1845230.5)}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-bold">1.1.01.002</td>
                  <td className="py-2 px-4 font-sans">Banco Bradesco S.A.</td>
                  <td className="py-2 px-4 text-right">{fmt(879400.75)}</td>
                  <td className="py-2 px-4 text-right text-slate-400">-</td>
                  <td className="py-2 px-4 text-right text-emerald-700">{fmt(38450.75)}</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">{fmt(840950.0)}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-bold">1.1.02.001</td>
                  <td className="py-2 px-4 font-sans">Clientes Nacionais - Licenciamento ERP</td>
                  <td className="py-2 px-4 text-right">{fmt(199500.0)}</td>
                  <td className="py-2 px-4 text-right text-sky-700">{fmt(145000.0)}</td>
                  <td className="py-2 px-4 text-right text-emerald-700">{fmt(112000.0)}</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">{fmt(232500.0)}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-bold">2.1.01.001</td>
                  <td className="py-2 px-4 font-sans">Fornecedores Nacionais a Pagar</td>
                  <td className="py-2 px-4 text-right">{fmt(103450.0)}</td>
                  <td className="py-2 px-4 text-right text-sky-700">{fmt(38450.75)}</td>
                  <td className="py-2 px-4 text-right text-emerald-700">{fmt(22800.0)}</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">{fmt(87800.0)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/80 font-mono font-bold text-xs border-t-2 border-slate-300">
                  <td colSpan={3} className="py-3 px-4 uppercase text-slate-700 font-sans">
                    Totais Consolidados do Período
                  </td>
                  <td className="py-3 px-4 text-right text-sky-800">{fmt(295450.75)}</td>
                  <td className="py-3 px-4 text-right text-emerald-800">{fmt(295450.75)}</td>
                  <td className="py-3 px-4 text-right text-slate-900">{fmt(3006480.5)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Tab 4: DRE */}
        {activeTab === 'dre' && (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white text-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Demonstração do Resultado do Exercício (DRE)</h3>
                  <p className="text-slate-400 text-[11px]">Competência: Outubro / 2026</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-mono text-xs font-bold">
                  IFRS / CPC Padrão
                </span>
              </div>

              <div className="divide-y divide-slate-100 font-mono">
                <div className="p-3.5 flex justify-between bg-slate-50 font-bold text-slate-900 font-sans">
                  <span>RECEITA OPERACIONAL BRUTA</span>
                  <span>{fmt(1745200.0)}</span>
                </div>
                <div className="p-3 flex justify-between pl-6 text-slate-600">
                  <span>(-) Deduções e Impostos sobre Vendas</span>
                  <span>({fmt(162000.0)})</span>
                </div>
                <div className="p-3.5 flex justify-between bg-blue-50/40 font-bold text-blue-900 font-sans">
                  <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
                  <span>{fmt(1583200.0)}</span>
                </div>
                <div className="p-3 flex justify-between pl-6 text-slate-600">
                  <span>(-) Custo dos Serviços Prestados (Cloud & Infra)</span>
                  <span>({fmt(103450.0)})</span>
                </div>
                <div className="p-3.5 flex justify-between bg-slate-50 font-bold text-slate-900 font-sans">
                  <span>(=) LUCRO BRUTO OPERACIONAL</span>
                  <span>{fmt(1479750.0)}</span>
                </div>
                <div className="p-3 flex justify-between pl-6 text-slate-600">
                  <span>(-) Despesas com Pessoal & Encargos</span>
                  <span>({fmt(520000.0)})</span>
                </div>
                <div className="p-3 flex justify-between pl-6 text-slate-600">
                  <span>(-) Despesas Administrativas & Ocupação</span>
                  <span>({fmt(110000.0)})</span>
                </div>
                <div className="p-3.5 flex justify-between bg-emerald-50 font-bold text-emerald-900 text-sm font-sans">
                  <span>(=) RESULTADO LÍQUIDO DO PERÍODO (EBIT)</span>
                  <span className="font-mono">{fmt(849750.0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
