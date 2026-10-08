/**
 * Cliente isolado do módulo de Contabilidade.
 * Utiliza a infraestrutura de requisições autenticadas do Keeper com injeção automática de JWT, tenant e company.
 */

export type AccountingRequest = (path: string, options?: RequestInit) => Promise<unknown>;

export const ACCOUNTING_PATHS = {
  dashboard: '/contabil/dashboard',
  accounts: '/contabil/plano-contas',
  diario: '/contabil/diario',
  journal: '/contabil/razao',
  trial: '/contabil/balancete',
  balanco: '/contabil/balanco',
  dre: '/contabil/dre',
  dfc: '/contabil/dfc',
  costCenters: '/contabil/centros-custo',
  integration: '/contabil/integracao-financeira',
  periods: '/contabil/periodos',
  taxes: '/contabil/tributos',
  reconciliation: '/contabil/conciliacao',
  documents: '/contabil/documentos',
  reports: '/contabil/relatorios',
  audit: '/contabil/auditoria',
  settings: '/contabil/configuracoes',
  payroll: '/contabil/folha-pagamento',
  producersAux: '/contabil/produtores-eventos',
} as const;

export type AccountingEntity = Record<string, unknown>;

export function normalizeRows(value: unknown): AccountingEntity[] {
  if (Array.isArray(value)) return value.filter((x) => x && typeof x === 'object') as AccountingEntity[];
  if (value && typeof value === 'object') {
    const r = value as Record<string, unknown>;
    for (const key of ['data', 'items', 'accounts', 'entries', 'periods', 'lines', 'rows', 'balances', 'taxes', 'rules', 'producers', 'employeesSummary', 'departmentCostCenters']) {
      if (Array.isArray(r[key])) return normalizeRows(r[key]);
    }
  }
  return [];
}
