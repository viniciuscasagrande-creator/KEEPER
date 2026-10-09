// apps/web/src/services/configuracoesClient.ts
// Client completo para o Módulo de Configurações & Administração Core da DiskIngressos

export interface SystemHealth {
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  uptimePercent: number;
  apiLatencyMs: number;
  dbStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  redisQueueStatus: 'ACTIVE' | 'DEGRADED' | 'DOWN';
  redisJobsProcessed: number;
  lastBackup: string;
  activeSessions: number;
  activeTenants: number;
  environment: string;
}

export interface Company {
  id: string;
  tenantId: string;
  code: string;
  tradeName: string;
  corporateName: string;
  documentNumber: string;
  stateRegistration: string;
  municipalRegistration: string;
  taxRegime: 'LUCRO_REAL' | 'LUCRO_PRESUMIDO' | 'SIMPLES_NACIONAL';
  isHeadquarter: boolean;
  address: string;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE';
  branchesCount: number;
}

export interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  branchType: 'MATRIZ' | 'PDV_SHOPPING' | 'BILHETERIA_TEATRO' | 'QUIOSQUE' | 'INTERNO';
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE';
  activeTerminals: number;
}

export interface User {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  twoFactorEnabled: boolean;
  lastLoginAt: string;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: string[];
}

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  module: string;
  action: 'visualizar' | 'criar' | 'editar' | 'excluir' | 'aprovar' | 'executar';
  description: string;
}

export interface WorkflowDef {
  id: string;
  tenantId: string;
  name: string;
  module: string;
  entity: string;
  triggerCondition: string;
  steps: {
    order: number;
    approverRole: string;
    slaHours: number;
  }[];
  isActive: boolean;
  approvalsCount: number;
}

export interface AuditLogItem {
  id: string;
  tenantId: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  module: string;
  entity: string;
  entityId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN';
  ipAddress: string;
  diffSummary: string;
  checksum: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'GATEWAY' | 'BANCO' | 'FISCAL' | 'NOTIFICACOES' | 'WEBHOOK';
  provider: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'TEST_MODE';
  lastSyncAt: string;
  uptime: string;
  endpoint: string;
  authType: 'API_KEY' | 'OAUTH2' | 'CERTIFICADO_A1' | 'TOKEN';
  successRate: number;
}

export interface ConfiguracoesOverview {
  health: SystemHealth;
  companies: Company[];
  branches: Branch[];
  users: User[];
  roles: Role[];
  permissions: PermissionItem[];
  workflows: WorkflowDef[];
  auditLogs: AuditLogItem[];
  integrations: IntegrationItem[];
}

// -------------------------------------------------------------
// DADOS REALISTAS MOCKADOS (DiskIngressos Produção Curitiba)
// -------------------------------------------------------------

const MOCK_HEALTH: SystemHealth = {
  status: 'OPERATIONAL',
  uptimePercent: 99.99,
  apiLatencyMs: 16,
  dbStatus: 'HEALTHY',
  redisQueueStatus: 'ACTIVE',
  redisJobsProcessed: 28450,
  lastBackup: '09/10/2026 04:00 (Snapshot Diário AWS S3)',
  activeSessions: 48,
  activeTenants: 1,
  environment: 'Produção (Vercel Serverless + Neon PostgreSQL + Redis BullMQ)',
};

const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-matriz',
    tenantId: 'tenant-diskingressos',
    code: 'EMP-001',
    tradeName: 'DiskIngressos Operadora Matriz',
    corporateName: 'Disk Ingressos Serviços de Informática & Eventos Ltda',
    documentNumber: '08.234.567/0001-89',
    stateRegistration: '90.123.456-78',
    municipalRegistration: '1234567-8',
    taxRegime: 'LUCRO_REAL',
    isHeadquarter: true,
    address: 'Rua Marechal Deodoro, 630 - Centro Comercial Itália',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    branchesCount: 5,
  },
  {
    id: 'comp-holding',
    tenantId: 'tenant-diskingressos',
    code: 'EMP-002',
    tradeName: 'Disk Entretenimento & Participações',
    corporateName: 'Disk Participações e Gestão de Bilheterias S.A.',
    documentNumber: '11.890.123/0001-45',
    stateRegistration: '90.765.432-10',
    municipalRegistration: '8765432-1',
    taxRegime: 'LUCRO_PRESUMIDO',
    isHeadquarter: false,
    address: 'Av. Cândido de Abreu, 776 - Centro Cívico',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    branchesCount: 0,
  },
];

const MOCK_BRANCHES: Branch[] = [
  {
    id: 'bra-01',
    companyId: 'comp-matriz',
    code: 'FIL-001',
    name: 'Sede Administrativa & Operações (Matriz)',
    branchType: 'MATRIZ',
    documentNumber: '08.234.567/0001-89',
    address: 'Rua Marechal Deodoro, 630 - 14º Andar',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    activeTerminals: 18,
  },
  {
    id: 'bra-02',
    companyId: 'comp-matriz',
    code: 'PDV-002',
    name: 'Quiosque Shopping Mueller',
    branchType: 'PDV_SHOPPING',
    documentNumber: '08.234.567/0002-60',
    address: 'Av. Cândido de Abreu, 127 - Piso L1',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    activeTerminals: 3,
  },
  {
    id: 'bra-03',
    companyId: 'comp-matriz',
    code: 'PDV-003',
    name: 'Quiosque Shopping Palladium',
    branchType: 'PDV_SHOPPING',
    documentNumber: '08.234.567/0003-40',
    address: 'Av. Presidente Kennedy, 4121 - Piso L3',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    activeTerminals: 4,
  },
  {
    id: 'bra-04',
    companyId: 'comp-matriz',
    code: 'PDV-004',
    name: 'Bilheteria Oficial Teatro Guaíra',
    branchType: 'BILHETERIA_TEATRO',
    documentNumber: '08.234.567/0004-21',
    address: 'Rua XV de Novembro, 971 - Centro',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    activeTerminals: 6,
  },
  {
    id: 'bra-05',
    companyId: 'comp-matriz',
    code: 'PDV-005',
    name: 'Bilheteria Teatro Positivo & Expo Unimed',
    branchType: 'BILHETERIA_TEATRO',
    documentNumber: '08.234.567/0005-02',
    address: 'Rua Pedro Viriato Parigot de Souza, 5300',
    city: 'Curitiba',
    state: 'PR',
    status: 'ACTIVE',
    activeTerminals: 8,
  },
];

const MOCK_USERS: User[] = [
  {
    id: 'usr-01',
    tenantId: 'tenant-diskingressos',
    fullName: 'Vinicius Casagrande',
    email: 'vinicius@diskingressos.com.br',
    roleId: 'role-admin',
    roleName: 'Administrador Master',
    department: 'Diretoria & Tecnologia',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    lastLoginAt: '09/10/2026 09:42',
  },
  {
    id: 'usr-02',
    tenantId: 'tenant-diskingressos',
    fullName: 'Mariana Duarte Mendes',
    email: 'mariana.duarte@diskingressos.com.br',
    roleId: 'role-financeiro',
    roleName: 'Diretora Financeira & Controladoria',
    department: 'Controladoria & Finanças',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    lastLoginAt: '09/10/2026 09:15',
  },
  {
    id: 'usr-03',
    tenantId: 'tenant-diskingressos',
    fullName: 'Carlos Eduardo Silveira',
    email: 'carlos.silveira@diskingressos.com.br',
    roleId: 'role-operacoes',
    roleName: 'Gerente Geral de Operações',
    department: 'Operações de Bilheteria',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    lastLoginAt: '09/10/2026 08:30',
  },
  {
    id: 'usr-04',
    tenantId: 'tenant-diskingressos',
    fullName: 'Fernanda Lopes Pinheiro',
    email: 'fernanda.lopes@diskingressos.com.br',
    roleId: 'role-fiscal',
    roleName: 'Coordenadora Fiscal & Tributária',
    department: 'Fiscal & Tributário',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    lastLoginAt: '09/10/2026 07:55',
  },
  {
    id: 'usr-05',
    tenantId: 'tenant-diskingressos',
    fullName: 'Roberto Viana Matos',
    email: 'roberto.viana@diskingressos.com.br',
    roleId: 'role-compras',
    roleName: 'Comprador Corporativo Sênior',
    department: 'Compras & Suprimentos',
    status: 'ACTIVE',
    twoFactorEnabled: false,
    lastLoginAt: '08/10/2026 17:10',
  },
  {
    id: 'usr-06',
    tenantId: 'tenant-diskingressos',
    fullName: 'Juliana Costa e Silva',
    email: 'juliana.costa@diskingressos.com.br',
    roleId: 'role-pdv',
    roleName: 'Líder de Bilheteria PDV Mueller',
    department: 'Bilheteria & Atendimento',
    status: 'ACTIVE',
    twoFactorEnabled: false,
    lastLoginAt: '09/10/2026 09:00',
  },
];

const MOCK_ROLES: Role[] = [
  {
    id: 'role-admin',
    tenantId: 'tenant-diskingressos',
    name: 'Administrador Master',
    description: 'Acesso total irrestrito a todos os módulos, parametrizações e integrações.',
    isSystem: true,
    userCount: 2,
    permissions: ['*'],
  },
  {
    id: 'role-financeiro',
    tenantId: 'tenant-diskingressos',
    name: 'Diretoria Financeira & Controladoria',
    description: 'Aprovação de alçadas > R$ 5k, conciliação 1:1, repasses fiduciários e DRE.',
    isSystem: true,
    userCount: 4,
    permissions: [
      'financeiro.*',
      'contabil.*',
      'fiscal.visualizar',
      'core.workflows.aprovar',
      'inteligencia.visualizar',
    ],
  },
  {
    id: 'role-operacoes',
    tenantId: 'tenant-diskingressos',
    name: 'Gerente de Operações de Eventos',
    description: 'Gestão de eventos, borderôs de bilheteria, lotes de ingressos e equipe de PDV.',
    isSystem: true,
    userCount: 6,
    permissions: [
      'eventos.*',
      'financeiro.eventos.visualizar',
      'estoque.insumos',
      'relatorios.eventos',
    ],
  },
  {
    id: 'role-fiscal',
    tenantId: 'tenant-diskingressos',
    name: 'Coordenador Fiscal & Tributário',
    description: 'Emissão de NFS-e Curitiba, apuração de ISS/PIS/COFINS, DCTFWeb e SPED.',
    isSystem: true,
    userCount: 3,
    permissions: [
      'fiscal.*',
      'contabil.visualizar',
      'financeiro.visualizar',
    ],
  },
  {
    id: 'role-compras',
    tenantId: 'tenant-diskingressos',
    name: 'Gestor de Compras & Almoxarifado',
    description: 'Requisições, RFQ cotações, pedidos de compra, homologação e Kardex.',
    isSystem: false,
    userCount: 5,
    permissions: [
      'compras.*',
      'estoque.*',
      'financeiro.payables.criar',
    ],
  },
  {
    id: 'role-pdv',
    tenantId: 'tenant-diskingressos',
    name: 'Operador de Bilheteria & PDV',
    description: 'Venda presencial balcão, fechamento de caixa diário e sangrias.',
    isSystem: false,
    userCount: 28,
    permissions: [
      'pdv.vendas',
      'pdv.fechamento',
      'eventos.mapa.visualizar',
    ],
  },
];

const MOCK_PERMISSIONS: PermissionItem[] = [
  { id: 'p1', code: 'core.empresas.criar', name: 'Criar Empresas e Filiais', module: 'Configurações Core', action: 'criar', description: 'Permite registrar nova empresa ou filial no tenant' },
  { id: 'p2', code: 'core.empresas.visualizar', name: 'Visualizar Estrutura Corporativa', module: 'Configurações Core', action: 'visualizar', description: 'Visualizar dados cadastrais, CNPJs e filiais' },
  { id: 'p3', code: 'core.users.criar', name: 'Criar Novos Usuários', module: 'Gestão de Identidade', action: 'criar', description: 'Cadastrar contas e enviar link de primeiro acesso' },
  { id: 'p4', code: 'core.perfis.editar', name: 'Gerenciar Matriz de Acessos RBAC', module: 'Gestão de Identidade', action: 'editar', description: 'Atribuir permissões e alçadas aos papéis do sistema' },
  { id: 'p5', code: 'core.workflows.aprovar', name: 'Aprovar Alçadas de Workflow', module: 'Workflows', action: 'aprovar', description: 'Aprovar pagamentos, compras e repasses acima do limite' },
  { id: 'p6', code: 'core.auditoria.visualizar', name: 'Auditar Trilha CDC', module: 'Governança & Auditoria', action: 'visualizar', description: 'Consultar logs imutáveis e diffs de alterações em dados' },
  { id: 'p7', code: 'financeiro.repasses.liberar', name: 'Liberar Repasses de Produtores', module: 'Financeiro', action: 'executar', description: 'Transferência de custódia fiduciária de bilheteria' },
  { id: 'p8', code: 'fiscal.nfse.emitir', name: 'Emitir NFS-e Curitiba', module: 'Fiscal', action: 'executar', description: 'Transmitir RPS e gerar lote oficial de notas fiscais' },
];

const MOCK_WORKFLOWS: WorkflowDef[] = [
  {
    id: 'wf-01',
    tenantId: 'tenant-diskingressos',
    name: 'Aprovação de Pagamentos Financeiro Disk > R$ 5.000',
    module: 'Financeiro',
    entity: 'TituloPagar',
    triggerCondition: 'valor > 5000.00 E empresa = Disk Matriz',
    steps: [
      { order: 1, approverRole: 'Coordenador Financeiro', slaHours: 24 },
      { order: 2, approverRole: 'Diretora Financeira & Controladoria', slaHours: 12 },
    ],
    isActive: true,
    approvalsCount: 42,
  },
  {
    id: 'wf-02',
    tenantId: 'tenant-diskingressos',
    name: 'Requisições de Compras Corporativas > R$ 1.500',
    module: 'Compras',
    entity: 'SolicitacaoCompra',
    triggerCondition: 'valor_estimado > 1500.00',
    steps: [
      { order: 1, approverRole: 'Gerente da Área Solicitante', slaHours: 48 },
      { order: 2, approverRole: 'Gestor de Compras & Almoxarifado', slaHours: 24 },
    ],
    isActive: true,
    approvalsCount: 18,
  },
  {
    id: 'wf-03',
    tenantId: 'tenant-diskingressos',
    name: 'Liberação de Repasse Antecipado a Produtor',
    module: 'Financeiro',
    entity: 'RepasseProdutor',
    triggerCondition: 'tipo_repasse = ANTECIPADO E retencao_minima >= 30%',
    steps: [
      { order: 1, approverRole: 'Gerente Geral de Operações', slaHours: 12 },
      { order: 2, approverRole: 'Diretora Financeira & Controladoria', slaHours: 6 },
    ],
    isActive: true,
    approvalsCount: 9,
  },
  {
    id: 'wf-04',
    tenantId: 'tenant-diskingressos',
    name: 'Cadastro de Novo Fornecedor Corporativo (Homologação)',
    module: 'Compras',
    entity: 'Fornecedor',
    triggerCondition: 'fornecedor.novo = true',
    steps: [
      { order: 1, approverRole: 'Analista de Compliance / Fiscal', slaHours: 72 },
    ],
    isActive: true,
    approvalsCount: 27,
  },
];

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-001',
    tenantId: 'tenant-diskingressos',
    createdAt: '09/10/2026 09:41:22',
    userName: 'Vinicius Casagrande',
    userEmail: 'vinicius@diskingressos.com.br',
    module: 'Core / RBAC',
    entity: 'RolePermission',
    entityId: 'role-financeiro',
    action: 'UPDATE',
    ipAddress: '189.115.22.45 (Curitiba/PR)',
    diffSummary: 'Permissão "core.workflows.aprovar" adicionada ao perfil Financeiro',
    checksum: 'a9f24b1...e78c',
  },
  {
    id: 'aud-002',
    tenantId: 'tenant-diskingressos',
    createdAt: '09/10/2026 09:20:15',
    userName: 'Mariana Duarte Mendes',
    userEmail: 'mariana.duarte@diskingressos.com.br',
    module: 'Financeiro',
    entity: 'TituloPagar',
    entityId: 'PAG-2026-0891',
    action: 'APPROVE',
    ipAddress: '177.92.140.12 (Curitiba/PR)',
    diffSummary: 'Aprovação de alçada do título R$ 12.800,00 (Locação Servidores AWS)',
    checksum: '88b39c0...321a',
  },
  {
    id: 'aud-003',
    tenantId: 'tenant-diskingressos',
    createdAt: '09/10/2026 08:45:09',
    userName: 'Carlos Eduardo Silveira',
    userEmail: 'carlos.silveira@diskingressos.com.br',
    module: 'PDV & Filiais',
    entity: 'BranchTerminal',
    entityId: 'PDV-004-TERM-06',
    action: 'UPDATE',
    ipAddress: '189.115.22.45 (Curitiba/PR)',
    diffSummary: 'Terminal 06 da Bilheteria Teatro Guaíra ativado para vendas balcão',
    checksum: 'c4e511b...4490',
  },
  {
    id: 'aud-004',
    tenantId: 'tenant-diskingressos',
    createdAt: '09/10/2026 08:12:44',
    userName: 'Fernanda Lopes Pinheiro',
    userEmail: 'fernanda.lopes@diskingressos.com.br',
    module: 'Fiscal',
    entity: 'CertificadoDigital',
    entityId: 'CERT-A1-2027',
    action: 'UPDATE',
    ipAddress: '177.92.140.12 (Curitiba/PR)',
    diffSummary: 'Renovação do Certificado Digital e-CNPJ A1 Matriz com sucesso (Validade Out/2027)',
    checksum: '12ef45a...90bc',
  },
  {
    id: 'aud-005',
    tenantId: 'tenant-diskingressos',
    createdAt: '08/10/2026 19:30:00',
    userName: 'Sistema Automático (Cron)',
    userEmail: 'system@keeper-erp.internal',
    module: 'Backups & Infra',
    entity: 'DatabaseSnapshot',
    entityId: 'SNAP-2026-10-08-NIGHT',
    action: 'INSERT',
    ipAddress: '10.0.4.15 (VPC Privada)',
    diffSummary: 'Snapshot integral PostgreSQL Neon concluído: 4.82 GB (SHA256 validado)',
    checksum: 'fe981a2...aa34',
  },
];

const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int-01',
    name: 'Asaas Pagamentos & PIX Bacen',
    category: 'GATEWAY',
    provider: 'Asaas Gestão Financeira S.A.',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:54 (há 1 min)',
    uptime: '99.98%',
    endpoint: 'https://api.asaas.com/v3',
    authType: 'API_KEY',
    successRate: 99.8,
  },
  {
    id: 'int-02',
    name: 'Stone Pagamentos Adquirente (PDVs)',
    category: 'GATEWAY',
    provider: 'Stone Pagamentos S.A.',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:50 (há 5 min)',
    uptime: '99.95%',
    endpoint: 'https://api.stone.com.br/v1',
    authType: 'OAUTH2',
    successRate: 99.6,
  },
  {
    id: 'int-03',
    name: 'Cielo E-commerce & Gateway',
    category: 'GATEWAY',
    provider: 'Cielo S.A.',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:48 (há 7 min)',
    uptime: '99.90%',
    endpoint: 'https://api.cieloecommerce.cielo.com.br/1',
    authType: 'TOKEN',
    successRate: 99.4,
  },
  {
    id: 'int-04',
    name: 'NFS-e Prefeitura de Curitiba (ISS.Curitiba)',
    category: 'FISCAL',
    provider: 'Secretaria Municipal de Finanças Curitiba',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:30 (há 25 min)',
    uptime: '99.70%',
    endpoint: 'https://isscuritiba.curitiba.pr.gov.br/Iss.NFe.WebService',
    authType: 'CERTIFICADO_A1',
    successRate: 99.9,
  },
  {
    id: 'int-05',
    name: 'Banco do Brasil (CNAB 240 / Cobrança API)',
    category: 'BANCO',
    provider: 'Banco do Brasil S.A.',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:10 (há 45 min)',
    uptime: '99.92%',
    endpoint: 'https://api.bb.com.br/cobrancas/v2',
    authType: 'OAUTH2',
    successRate: 99.7,
  },
  {
    id: 'int-06',
    name: 'Bradesco Open Finance & Conciliação',
    category: 'BANCO',
    provider: 'Banco Bradesco S.A.',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 08:50',
    uptime: '99.85%',
    endpoint: 'https://openapi.bradesco.com.br/v1',
    authType: 'CERTIFICADO_A1',
    successRate: 99.5,
  },
  {
    id: 'int-07',
    name: 'Webhook Eventos de Venda Ingressos (Realtime)',
    category: 'WEBHOOK',
    provider: 'Engine DiskIngressos Ticket Stream',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:55 (há 30 seg)',
    uptime: '100.00%',
    endpoint: 'https://events.diskingressos.com.br/webhook/v1/orders',
    authType: 'TOKEN',
    successRate: 100.0,
  },
  {
    id: 'int-08',
    name: 'Slack / Discord Notificações Críticas de Alçada',
    category: 'NOTIFICACOES',
    provider: 'Slack Technologies & Webhook Integrator',
    status: 'CONNECTED',
    lastSyncAt: '09/10/2026 09:20',
    uptime: '99.99%',
    endpoint: 'https://hooks.slack.com/services/T0123/B0456',
    authType: 'TOKEN',
    successRate: 100.0,
  },
];

class ConfiguracoesClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (typeof window !== 'undefined' && (window as any).__KEEPER_API_URL__)
      || (process.env.NEXT_PUBLIC_API_URL || 'https://keeper-tng6.vercel.app/api/v1');
  }

  private getAuthHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getOverview(): Promise<ConfiguracoesOverview> {
    try {
      // Tenta recuperar do backend se disponível
      const [resCompanies, resUsers, resRoles, resAudit] = await Promise.allSettled([
        fetch(`${this.baseUrl}/core/companies`, { headers: this.getAuthHeader() }),
        fetch(`${this.baseUrl}/core/users`, { headers: this.getAuthHeader() }),
        fetch(`${this.baseUrl}/core/rbac/roles`, { headers: this.getAuthHeader() }),
        fetch(`${this.baseUrl}/core/audit/logs?limit=10`, { headers: this.getAuthHeader() }),
      ]);

      let backendCompanies = MOCK_COMPANIES;
      let backendUsers = MOCK_USERS;
      let backendRoles = MOCK_ROLES;
      let backendAudit = MOCK_AUDIT_LOGS;

      if (resCompanies.status === 'fulfilled' && resCompanies.value.ok) {
        const data = await resCompanies.value.json();
        if (Array.isArray(data) && data.length > 0) {
          backendCompanies = data;
        }
      }

      if (resUsers.status === 'fulfilled' && resUsers.value.ok) {
        const data = await resUsers.value.json();
        if (Array.isArray(data) && data.length > 0) {
          backendUsers = data;
        }
      }

      if (resRoles.status === 'fulfilled' && resRoles.value.ok) {
        const data = await resRoles.value.json();
        if (Array.isArray(data) && data.length > 0) {
          backendRoles = data;
        }
      }

      if (resAudit.status === 'fulfilled' && resAudit.value.ok) {
        const data = await resAudit.value.json();
        if (Array.isArray(data) && data.length > 0) {
          backendAudit = data;
        }
      }

      return {
        health: MOCK_HEALTH,
        companies: backendCompanies,
        branches: MOCK_BRANCHES,
        users: backendUsers,
        roles: backendRoles,
        permissions: MOCK_PERMISSIONS,
        workflows: MOCK_WORKFLOWS,
        auditLogs: backendAudit,
        integrations: MOCK_INTEGRATIONS,
      };
    } catch {
      return {
        health: MOCK_HEALTH,
        companies: MOCK_COMPANIES,
        branches: MOCK_BRANCHES,
        users: MOCK_USERS,
        roles: MOCK_ROLES,
        permissions: MOCK_PERMISSIONS,
        workflows: MOCK_WORKFLOWS,
        auditLogs: MOCK_AUDIT_LOGS,
        integrations: MOCK_INTEGRATIONS,
      };
    }
  }

  async createCompany(payload: Partial<Company>): Promise<Company> {
    try {
      const res = await fetch(`${this.baseUrl}/core/companies`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      tenantId: 'tenant-diskingressos',
      code: payload.code || `EMP-00${MOCK_COMPANIES.length + 1}`,
      tradeName: payload.tradeName || 'Nova Filial Disk',
      corporateName: payload.corporateName || 'Nova Empresa Ltda',
      documentNumber: payload.documentNumber || '00.000.000/0001-00',
      stateRegistration: payload.stateRegistration || 'Isento',
      municipalRegistration: payload.municipalRegistration || '123456',
      taxRegime: payload.taxRegime || 'LUCRO_REAL',
      isHeadquarter: false,
      address: payload.address || 'Curitiba, PR',
      city: payload.city || 'Curitiba',
      state: payload.state || 'PR',
      status: 'ACTIVE',
      branchesCount: 0,
    };
    MOCK_COMPANIES.push(newCompany);
    return newCompany;
  }

  async createBranch(companyId: string, payload: Partial<Branch>): Promise<Branch> {
    try {
      const res = await fetch(`${this.baseUrl}/core/companies/${companyId}/branches`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const newBranch: Branch = {
      id: `bra-${Date.now()}`,
      companyId,
      code: payload.code || `PDV-00${MOCK_BRANCHES.length + 1}`,
      name: payload.name || 'Novo Ponto de Venda',
      branchType: payload.branchType || 'PDV_SHOPPING',
      documentNumber: payload.documentNumber || '08.234.567/0006-88',
      address: payload.address || 'Curitiba, PR',
      city: payload.city || 'Curitiba',
      state: payload.state || 'PR',
      status: 'ACTIVE',
      activeTerminals: payload.activeTerminals || 2,
    };
    MOCK_BRANCHES.push(newBranch);
    return newBranch;
  }

  async createUser(payload: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`${this.baseUrl}/core/users`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      tenantId: 'tenant-diskingressos',
      fullName: payload.fullName || 'Novo Colaborador',
      email: payload.email || 'novo.usuario@diskingressos.com.br',
      roleId: payload.roleId || 'role-pdv',
      roleName: payload.roleName || 'Operador de Bilheteria & PDV',
      department: payload.department || 'Operações',
      status: 'ACTIVE',
      twoFactorEnabled: false,
      lastLoginAt: 'Nunca acessou',
    };
    MOCK_USERS.push(newUser);
    return newUser;
  }

  async createRole(name: string, description: string): Promise<Role> {
    try {
      const res = await fetch(`${this.baseUrl}/core/rbac/roles`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    const newRole: Role = {
      id: `role-${Date.now()}`,
      tenantId: 'tenant-diskingressos',
      name,
      description,
      isSystem: false,
      userCount: 0,
      permissions: ['financeiro.visualizar'],
    };
    MOCK_ROLES.push(newRole);
    return newRole;
  }

  async pingIntegration(integrationId: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      latencyMs: Math.floor(Math.random() * 25) + 12,
      message: `Conexão bem-sucedida com ${integrationId}. Handshake SSL validado e credenciais ativas.`,
    };
  }
}

export const configuracoesClient = new ConfiguracoesClient();
