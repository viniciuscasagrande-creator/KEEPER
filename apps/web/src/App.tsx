import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { HorizontalNav } from './components/layout/HorizontalNav';
import { KpiGrid } from './components/dashboard/KpiGrid';
import { RemindersWidget } from './components/dashboard/RemindersWidget';
import { QuickTilesWidget } from './components/dashboard/QuickTilesWidget';
import { KpiMeterWidget } from './components/dashboard/KpiMeterWidget';
import { FinancialChartWidget } from './components/dashboard/FinancialChartWidget';
import { AlertsCenterWidget } from './components/dashboard/AlertsCenterWidget';
import { RecentMovementsTable } from './components/dashboard/RecentMovementsTable';
import { CommandCenterModal } from './components/modals/CommandCenterModal';
import { QuickEntryDrawer } from './components/drawers/QuickEntryDrawer';
import { ApprovalsDrawer } from './components/drawers/ApprovalsDrawer';
import { FinancialModuleView } from './components/modules/FinancialModuleView';
import { AccountingModuleView } from './components/modules/AccountingModuleView';
import { ContabilidadeCompletaView } from './components/modules/ContabilidadeCompletaView';
import { GatewaysModuleView } from './components/modules/GatewaysModuleView';
import { RhDpModuloView } from './components/modules/RhDpModuloView';
import { FiscalModuleView } from './components/modules/FiscalModuleView';
import { ComprasModuleView } from './components/modules/ComprasModuleView';
import { api } from './services/api';
import { Calendar, Download, RefreshCw } from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSubModule, setActiveSubModule] = useState<string | undefined>();
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshCounter((c) => c + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSelectSubModule = (subModuleId: string) => {
    setActiveSubModule(subModuleId);
    if (subModuleId.startsWith('fin-') || subModuleId === 'dash-fin' || subModuleId.startsWith('gw-')) {
      setActiveModule('financeiro');
    } else if (subModuleId.startsWith('acc-')) {
      setActiveModule('contabil');
    } else if (subModuleId === 'quick-entry') {
      setIsQuickEntryOpen(true);
    } else if (subModuleId === 'approvals') {
      setIsApprovalsOpen(true);
    } else {
      setActiveModule('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* 1. Global Corporate Top Header */}
      <Header
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
        onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
        onOpenApprovals={() => setIsApprovalsOpen(true)}
      />

      {/* 2. Horizontal Navigation with Mega Dropdowns */}
      <HorizontalNav
        activeModuleId={activeModule}
        onSelectModule={(id) => {
          setActiveModule(id);
          setActiveSubModule(undefined);
        }}
        onSelectSubModule={handleSelectSubModule}
      />

      {/* 3. Main Operational Content */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeModule === 'financeiro' ? (
          <FinancialModuleView
            onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
            activeSubTab={activeSubModule}
          />
        ) : activeModule === 'gateways' ? (
          <GatewaysModuleView
            activeSection={activeSubModule}
            onSelectSection={(sec) => setActiveSubModule(sec)}
          />
        ) : activeModule === 'contabil' ? (
          <ContabilidadeCompletaView
            request={api.accountingRequest}
            initialSection={activeSubModule}
          />
        ) : activeModule === 'rh' ? (
          <RhDpModuloView
            activeSection={activeSubModule}
            onSelectSection={(sec) => setActiveSubModule(sec)}
          />
        ) : activeModule === 'fiscal' ? (
          <FiscalModuleView
            activeSection={activeSubModule}
            onSelectSection={(sec) => setActiveSubModule(sec)}
          />
        ) : activeModule === 'compras' || activeModule === 'estoque' ? (
          <ComprasModuleView
            activeSection={activeSubModule}
            onSelectSection={(sec) => setActiveSubModule(sec)}
          />
        ) : (
          <>
            {/* Context bar / Breadcrumb & Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Home</span>
                  <span>/</span>
                  <span>Controladoria & Finanças</span>
                  <span>/</span>
                  <span className="font-semibold text-slate-800">Painel Executivo</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                  Visão Geral Consolidada Multiempresa
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-medium shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Competência: <strong>Outubro / 2026</strong></span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                  title="Atualizar dados do Razão e Tesouraria"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                </button>
                <button
                  onClick={() => alert('Exportando relatório consolidado DRE/Balanço em PDF...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Relatório Executivo</span>
                </button>
              </div>
            </div>

            {/* Top Quick Widgets: Reminders, Tiles, KPI Meter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-4">
                <RemindersWidget onOpenApprovals={() => setIsApprovalsOpen(true)} />
              </div>
              <div className="md:col-span-5">
                <QuickTilesWidget
                  onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
                  onOpenApprovals={() => setIsApprovalsOpen(true)}
                />
              </div>
              <div className="md:col-span-3">
                <KpiMeterWidget refreshTrigger={refreshCounter} />
              </div>
            </div>

            {/* Main KPI Numbers Grid */}
            <KpiGrid refreshTrigger={refreshCounter} />

            {/* Charts & Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <FinancialChartWidget />
              </div>
              <div className="lg:col-span-4">
                <AlertsCenterWidget />
              </div>
            </div>

            {/* High-Density Operational Movements Table */}
            <RecentMovementsTable
              refreshTrigger={refreshCounter}
              onMovementUpdated={() => setRefreshCounter((c) => c + 1)}
            />
          </>
        )}
      </main>

      {/* 8. Modals & Drawers */}
      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onOpenQuickEntry={() => setIsQuickEntryOpen(true)}
        onOpenApprovals={() => setIsApprovalsOpen(true)}
      />

      <QuickEntryDrawer
        isOpen={isQuickEntryOpen}
        onClose={() => setIsQuickEntryOpen(false)}
        onCreated={() => setRefreshCounter((c) => c + 1)}
      />

      <ApprovalsDrawer
        isOpen={isApprovalsOpen}
        onClose={() => setIsApprovalsOpen(false)}
      />
    </div>
  );
}
export default App;
