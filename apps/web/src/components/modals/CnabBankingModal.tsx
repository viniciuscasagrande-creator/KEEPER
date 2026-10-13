import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Copy,
  Check,
  RefreshCw,
  FileText,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../services/api';

interface CnabBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CnabBankingModal({ isOpen, onClose }: CnabBankingModalProps) {
  const [activeTab, setActiveTab] = useState<'remessa' | 'retorno'>('remessa');
  const [bankCode, setBankCode] = useState<'341' | '237' | '033' | '001'>('341');
  const [layout, setLayout] = useState<'CNAB240' | 'CNAB400'>('CNAB240');
  const [batchType, setBatchType] = useState<'REPASSE_PRODUTOR' | 'PAGAMENTO_FORNECEDORES'>('REPASSE_PRODUTOR');

  // Remessa result
  const [isGenerating, setIsGenerating] = useState(false);
  const [remessaResult, setRemessaResult] = useState<any | null>(null);
  const [copiedRemessa, setCopiedRemessa] = useState(false);

  // Retorno state
  const [isParsing, setIsParsing] = useState(false);
  const [retornoFileContent, setRetornoFileContent] = useState('');
  const [retornoResult, setRetornoResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-selected sample items for remessa
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'rep-01',
    'rep-02',
  ]);

  const sampleItems = [
    {
      id: 'rep-01',
      beneficiaryName: 'Opus Entretenimento & Shows Ltda',
      beneficiaryDocument: '12.345.678/0001-90',
      bankCode: '341',
      agency: '0422',
      account: '88120',
      accountDigit: '1',
      pixKey: 'financeiro@opus.com.br',
      amount: 25000.0,
      paymentDate: '2026-10-15',
      documentNumber: 'REP-2026-0089',
    },
    {
      id: 'rep-02',
      beneficiaryName: 'Live Nation Brasil Produções S.A.',
      beneficiaryDocument: '98.765.432/0001-11',
      bankCode: '237',
      agency: '1024',
      account: '44520',
      accountDigit: '9',
      pixKey: 'pix@livenation.com.br',
      amount: 150000.0,
      paymentDate: '2026-10-15',
      documentNumber: 'REP-2026-0090',
    },
    {
      id: 'rep-03',
      beneficiaryName: 'GuardSeg Segurança Privada Ltda',
      beneficiaryDocument: '04.112.334/0001-77',
      bankCode: '341',
      agency: '0422',
      account: '12345',
      accountDigit: '6',
      pixKey: '04112334000177',
      amount: 30000.0,
      paymentDate: '2026-10-16',
      documentNumber: 'NF-4921-SEG',
    },
  ];

  if (!isOpen) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleGenerateRemessa = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const itemsToInclude = sampleItems.filter((item) => selectedItems.includes(item.id));
      if (itemsToInclude.length === 0) {
        setErrorMsg('Selecione pelo menos um item para gerar a remessa.');
        setIsGenerating(false);
        return;
      }

      const res = await api.generateCnabRemessa({
        bankCode,
        layout,
        type: batchType,
        items: itemsToInclude,
      });
      setRemessaResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao gerar remessa bancária.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadRemessa = () => {
    if (!remessaResult?.fileContent) return;
    const blob = new Blob([remessaResult.fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = remessaResult.filename || 'REMESSA.REM';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyRemessa = () => {
    if (!remessaResult?.fileContent) return;
    navigator.clipboard.writeText(remessaResult.fileContent);
    setCopiedRemessa(true);
    setTimeout(() => setCopiedRemessa(false), 2000);
  };

  const handleParseRetorno = async () => {
    setIsParsing(true);
    setErrorMsg(null);
    try {
      if (!retornoFileContent.trim()) {
        setErrorMsg('Cole o conteúdo do arquivo de retorno bancário retornado pelo Itaú ou Bradesco.');
        setIsParsing(false);
        return;
      }

      const res = await api.parseCnabRetorno({
        fileContent: retornoFileContent,
        bankCode,
      });
      setRetornoResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao processar arquivo de retorno.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleLoadSampleRetorno = () => {
    // Generate a valid mock return file for demonstration
    const sampleRet = [
      '34100000         20812345678000190                    00422 000000099012 3 DISKINGRESSOS SERVICOS DE BI BANCO ITAU S.A.           21310202611200000010408400000                                                                     ',
      '34100011C2045042 20812345678000190KEEPER-CONV-01      00422 000000099012 3 DISKINGRESSOS SERVICOS DE BI REPASSE BILHETERIA DISK               RUA DR MURICY 750             80020040CURITIBA             PR                                      ',
      '3410001300001A00034100422 0000000881201 Opus Entretenimento & Shows Lt REP-2026-0089      15102026BRL00000000000000000000002500000                    13102026000000002500000rep-01                                  000             ',
      '3410001300002B   212345678000190financeiro@opus.com.br                                      000000000000000000000000000000000000000000000000000000000000                                                                                        ',
      '3410001300003A00023701024 0000000445209 Live Nation Brasil Produções S REP-2026-0090      15102026BRL00000000000000000000015000000                    13102026000000015000000rep-02                                  000             ',
      '3410001300004B   298765432000111pix@livenation.com.br                                       000000000000000000000000000000000000000000000000000000000000                                                                                        ',
      '34100015         000006000000000017500000000000000000000000000000                                                                                                                                                                             ',
      '34199999         000001000008000000                                                                                                                                                                                                           ',
    ].join('\r\n');
    setRetornoFileContent(sampleRet);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight">
                CNAB Bancário &bull; Remessa e Retorno Automatizado
              </h2>
              <p className="text-[11px] text-slate-500">
                Padrão FEBRABAN CNAB 240 e CNAB 400 — Homologado para Itaú (341) e Bradesco (237)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 border-b border-slate-200 bg-white flex gap-2">
          <button
            onClick={() => setActiveTab('remessa')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'remessa'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Gerar Remessa (.REM)</span>
          </button>
          <button
            onClick={() => setActiveTab('retorno')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'retorno'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Processar Retorno (.RET)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: REMESSA */}
          {activeTab === 'remessa' && (
            <div className="space-y-4">
              {/* Configuration bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Banco Conveniado</label>
                  <select
                    value={bankCode}
                    onChange={(e: any) => setBankCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="341">341 - Banco Itaú Unibanco S.A. (Escrow)</option>
                    <option value="237">237 - Banco Bradesco S.A.</option>
                    <option value="033">033 - Banco Santander (Brasil)</option>
                    <option value="001">001 - Banco do Brasil S.A.</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Padrão do Layout</label>
                  <select
                    value={layout}
                    onChange={(e: any) => setLayout(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="CNAB240">CNAB 240 (FEBRABAN - PIX/TED/Lotes)</option>
                    <option value="CNAB400">CNAB 400 (Convencional Bancário)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finalidade do Arquivo</label>
                  <select
                    value={batchType}
                    onChange={(e: any) => setBatchType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="REPASSE_PRODUTOR">Repasse aos Produtores de Eventos</option>
                    <option value="PAGAMENTO_FORNECEDORES">Pagamento a Fornecedores & Despesas</option>
                  </select>
                </div>
              </div>

              {/* Items selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">
                    Selecione os pagamentos para incluir neste lote ({selectedItems.length} selecionados):
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Total: {fmt(sampleItems.filter((i) => selectedItems.includes(i.id)).reduce((a, b) => a + b.amount, 0))}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {sampleItems.map((item) => (
                    <label
                      key={item.id}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{item.beneficiaryName}</div>
                          <div className="text-[11px] text-slate-500">
                            Doc: {item.documentNumber} &bull; Chave PIX: {item.pixKey} &bull; Banco:{' '}
                            {item.bankCode === '341' ? 'Itaú' : 'Bradesco'} Ag. {item.agency} CC {item.account}-{item.accountDigit}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-800 text-sm">{fmt(item.amount)}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateRemessa}
                disabled={isGenerating}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
                <span>{isGenerating ? 'Gerando Arquivo...' : 'Gerar Arquivo de Remessa Bancária'}</span>
              </button>

              {/* Remessa Generated Display */}
              {remessaResult && (
                <div className="p-4 bg-slate-900 rounded-xl text-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono font-bold text-emerald-300">{remessaResult.filename}</span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-800 rounded">
                        {remessaResult.totalRecords} linhas ({remessaResult.layout})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyRemessa}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1"
                      >
                        {copiedRemessa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRemessa ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                      <button
                        onClick={handleDownloadRemessa}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar .REM</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 bg-black/60 rounded-lg font-mono text-[10px] text-emerald-400/90 overflow-x-auto max-h-48 whitespace-pre leading-relaxed border border-slate-800">
                    {remessaResult.fileContent}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RETORNO */}
          {activeTab === 'retorno' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Conciliação Automática de Retorno Bancário</h3>
                  <p className="text-[11px] text-slate-500">
                    Cole o conteúdo do arquivo recebido do Internet Banking do Itaú ou Bradesco para liquidar os repasses.
                  </p>
                </div>
                <button
                  onClick={handleLoadSampleRetorno}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Carregar Exemplo de Retorno</span>
                </button>
              </div>

              <div>
                <textarea
                  rows={6}
                  value={retornoFileContent}
                  onChange={(e) => setRetornoFileContent(e.target.value)}
                  placeholder="Cole aqui o texto do arquivo .RET ou .TXT fornecido pelo banco..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                onClick={handleParseRetorno}
                disabled={isParsing}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Upload className={`w-4 h-4 ${isParsing ? 'animate-bounce' : ''}`} />
                <span>{isParsing ? 'Conciliando...' : 'Processar e Liquidar Títulos Automaticamente'}</span>
              </button>

              {/* Retorno summary report */}
              {retornoResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Resultado da Conciliação ({retornoResult.layout} &bull; Banco {retornoResult.bankCode})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Processado em {new Date(retornoResult.processedAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="text-[11px] font-semibold text-emerald-700">Liquidados com Sucesso</div>
                      <div className="text-lg font-black text-emerald-700">
                        {retornoResult.summary?.settledCount || 0}
                      </div>
                      <div className="text-[10px] text-emerald-600">
                        {fmt(retornoResult.summary?.settledAmount || 0)}
                      </div>
                    </div>

                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                      <div className="text-[11px] font-semibold text-rose-700">Rejeitados pelo Banco</div>
                      <div className="text-lg font-black text-rose-700">
                        {retornoResult.summary?.rejectedCount || 0}
                      </div>
                      <div className="text-[10px] text-rose-600">
                        {fmt(retornoResult.summary?.rejectedAmount || 0)}
                      </div>
                    </div>

                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-[11px] font-semibold text-blue-700">Total Conciliado</div>
                      <div className="text-lg font-black text-blue-700">
                        {retornoResult.summary?.totalEntries || 0}
                      </div>
                      <div className="text-[10px] text-blue-600">
                        {fmt(retornoResult.summary?.totalAmount || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Entries list */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {retornoResult.entries?.map((ent: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{ent.beneficiaryName}</span>
                          <span className="text-[10px] text-slate-500 ml-2">Doc: {ent.documentNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">{fmt(ent.amount)}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              ent.status === 'SETTLED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {ent.status === 'SETTLED' ? 'LIQUIDADO' : 'REJEITADO'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
