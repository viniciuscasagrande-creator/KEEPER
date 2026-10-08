/**
 * Cliente do módulo de RH & Departamento Pessoal.
 * Integração com a infraestrutura autenticada do Keeper ERP.
 */

export type RhRequest = (path: string, options?: RequestInit) => Promise<unknown>;

export const RH_PATHS = {
  dashboard: '/rh/dashboard',
  employees: '/rh/colaboradores',
  payroll: '/rh/folha',
  payrollCalculate: '/rh/folha/calcular',
  departments: '/rh/departamentos',
  charges: '/rh/encargos',
  esocial: '/rh/esocial',
  benefits: '/rh/beneficios',
} as const;
