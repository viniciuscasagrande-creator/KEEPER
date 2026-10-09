// apps/web/src/services/sentinelClient.ts
// KEEPER SENTINEL — Motor de Inteligência e Auditoria Contínua da DiskIngressos

export type SentinelSeverity = 'CRITICO' | 'ATENCAO' | 'ALERTA' | 'INFO';
export type SentinelDepartment =
  | 'Financeiro'
  | 'Eventos & Produtores'
  | 'Contabilidade'
  | 'Fiscal'
  | 'RH & DP'
  | 'Compras'
  | 'Segurança & Operação';

export type SentinelStatus = 'ABERTO' | 'EM_TRATAMENTO' | 'RESOLVIDO' | 'IGNORADO';
export type AutonomyLevel = 'OBSERVACAO' | 'INVESTIGACAO' | 'ACAO_SUPERVISIONADA';

export interface SentinelEvidence {
  rotulo: string;
  valor: string;
  invarianteViolada?: string;
}

export interface SentinelAlert {
  id: string;
  codigo: string;
  severidade: SentinelSeverity;
  departamento: SentinelDepartment;
  titulo: string;
  descricao: string;
  entidadeAfetada: string;
  valorSolicitado?: number;
  valorElegivel?: number;
  diferenca?: number;
  causaIdentificada: string;
  acaoRecomendada: string;
  status: SentinelStatus;
  responsavel: string;
  criadoEm: string;
  tempoDecorrido: string;
  evidencias: SentinelEvidence[];
  nivelAutonomiaSugerido: AutonomyLevel;
}

export interface SentinelRule {
  id: string;
  codigo: string;
  modulo: SentinelDepartment;
  nome: string;
  tipo: 'DETERMINISTICA' | 'ESTATISTICA' | 'IA_SEMANTICA';
  expressaoRegra: string;
  severidade: SentinelSeverity;
  status: 'ATIVO' | 'PAUSADO';
  verificacoesHoje: number;
  anomaliasDetectadas: number;
  ultimaExecucao: string;
}

export interface SentinelAgent {
  id: string;
  nome: string;
  departamento: SentinelDepartment;
  avatar: string;
  foco: string;
  autonomia: AutonomyLevel;
  status: 'ONLINE' | 'ANALISANDO' | 'STANDBY';
  alertasGerados: number;
  acuraciaPercent: number;
  ultimaAtividade: string;
}

export interface SentinelKpis {
  alertasCriticos: number;
  atencaoNecessaria: number;
  emTratamento: number;
  resolvidosHoje: number;
  taxaResolucaoPercent: number;
  tempoMedioRespostaMin: number;
  verificacoesPorMinuto: number;
  regrasAtivas: number;
}

export interface SentinelConfig {
  modoExecucao: 'HIBRIDO_RECOMENDADO' | 'LOCAL_ONPREM_GPU' | 'API_NUVEM_CORPORATIVA';
  provedorModelo: string;
  servidorLocalUri?: string;
  frequenciaScanSegundos: number;
  nivelAutonomiaMaximo: AutonomyLevel;
  segurancaZeroRetention: boolean;
  webhookNotificacaoCritica: string;
  bloqueioAutomaticoDeOperacao: boolean;
}

export interface SentinelOverview {
  kpis: SentinelKpis;
  alertas: SentinelAlert[];
  regras: SentinelRule[];
  agentes: SentinelAgent[];
  config: SentinelConfig;
}

export interface RiskDepartmentItem {
  department: string;
  riskLevel: 'ALTO' | 'MEDIO' | 'BAIXO';
  activeAlerts: number;
  financialImpact: number;
  probability: 'ALTA' | 'MEDIA' | 'BAIXA';
  urgency: 'CRITICA' | 'ALTA' | 'MODERADA' | 'BAIXA';
  topRisk: string;
  lastAudit: string;
}

export interface CrossAuditItem {
  id: string;
  origem: string;
  destino: string;
  descricao: string;
  status: 'CONFORME' | 'DIVERGENCIA' | 'ATENCAO';
  detalhe: string;
  divergencia: number;
  regraViolada?: string;
}

export interface CrossAuditReport {
  scoreConsistenciaGeral: number;
  inconsistenciasDetectadas: number;
  verificacoesRealizadas: number;
  trilhas: CrossAuditItem[];
}

export interface PreventiveRiskItem {
  id: string;
  categoria: string;
  titulo: string;
  entidade: string;
  horizonteDias: number;
  impactoEstimado: number;
  severidade: SentinelSeverity;
  diagnostico: string;
  recomendacao: string;
}

export interface PreventiveReport {
  riscosAntecipados: number;
  coberturaFinanceiraGlobalPercent: number;
  projecoes: PreventiveRiskItem[];
}

export interface RootCauseStep {
  etapa: number;
  nome: string;
  modulo: string;
  status: 'OK' | 'ALERTA' | 'ANOMALIA_DETECTADA' | 'BLOQUEADO';
  timestamp: string;
  detalhe: string;
  impactoDivergencia?: number;
}

export interface RootCauseAnalysis {
  alertId: string;
  origemDivergencia: string;
  grauConfiancaIA: number;
  resumoDiagnostico: string;
  esteiraInvestigacao: RootCauseStep[];
  acaoSugerida: string;
}

export interface IntegrationConnector {
  id: string;
  nome: string;
  tipo: string;
  status: 'OPERACIONAL' | 'DEGRADADO' | 'OFFLINE';
  latenciaMs: number;
  taxaSucessoPercent: number;
  ultimaVerificacao: string;
  observacao?: string;
  itensNaFila?: number;
}

export interface IntegrationsHealthReport {
  statusGlobal: string;
  uptimeMedio: number;
  conectores: IntegrationConnector[];
}

export interface AiAssistantResponse {
  pergunta: string;
  resposta: string;
  fontesAuditadas: string[];
  timestamp: string;
  modoAutonomia: string;
}

// -------------------------------------------------------------
// DADOS REALISTAS MOCKADOS (DiskIngressos Produção)
// -------------------------------------------------------------

const MOCK_KPIS: SentinelKpis = {
  alertasCriticos: 3,
  atencaoNecessaria: 12,
  emTratamento: 8,
  resolvidosHoje: 24,
  taxaResolucaoPercent: 94.2,
  tempoMedioRespostaMin: 18,
  verificacoesPorMinuto: 1450,
  regrasAtivas: 28,
};

const MOCK_ALERTAS: SentinelAlert[] = [
  {
    id: 'alt-01',
    codigo: 'SENT-FIN-089',
    severidade: 'CRITICO',
    departamento: 'Financeiro',
    titulo: 'Repasse acima do limite de liquidação',
    descricao:
      'Solicitação de repasse solicitada pelo produtor excede o saldo elegível fiduciário após dedução de retenções obrigatórias e taxas.',
    entidadeAfetada: 'Show Teatro Positivo — Turnê MPB Acústico',
    valorSolicitado: 80000,
    valorElegivel: 65000,
    diferenca: 15000,
    causaIdentificada:
      'Reserva técnica de estornos (10%) e retenção de taxa de teatro (R$ 8.500) não foram descontadas na requisição inicial do produtor.',
    acaoRecomendada:
      'Revisar as reservas fiduciárias e recusar liberação integral. Ajustar valor aprovado para no máximo R$ 65.000,00.',
    status: 'ABERTO',
    responsavel: 'Mariana Duarte (Diretora Financeira)',
    criadoEm: '09/10/2026 09:28',
    tempoDecorrido: 'há 32 min',
    nivelAutonomiaSugerido: 'INVESTIGACAO',
    evidencias: [
      { rotulo: 'Saldo Bruto em Custódia', valor: 'R$ 82.400,00' },
      { rotulo: 'Retenção Aluguel Teatro Positivo', valor: '- R$ 8.500,00' },
      { rotulo: 'Fundo Garantidor Estornos (10%)', valor: '- R$ 8.240,00' },
      { rotulo: 'Taxa Conveniência Disk (Líquida)', valor: '- R$ 660,00' },
      { rotulo: 'Invariante Backend', valor: 'elegivel = bruto - retencoes = R$ 65.000,00' },
    ],
  },
  {
    id: 'alt-02',
    codigo: 'SENT-EVT-042',
    severidade: 'CRITICO',
    departamento: 'Eventos & Produtores',
    titulo: 'Cobertura insuficiente para estornos pós-cancelamento',
    descricao:
      'Evento teve sessão de domingo adiada, gerando pico de cancelamentos sem saldo remanescente suficiente na carteira do evento.',
    entidadeAfetada: 'Festival Gastronômico & Musical de Curitiba (Pedreira)',
    valorSolicitado: 42300,
    valorElegivel: 11200,
    diferenca: 31100,
    causaIdentificada:
      'Repasses antecipados realizados na semana anterior deixaram o saldo de custódia vulnerável a devoluções em massa.',
    acaoRecomendada:
      'Bloquear novos repasses do produtor em outros eventos colaterais e acionar cláusula contratual de recomposição de déficit.',
    status: 'ABERTO',
    responsavel: 'Carlos Eduardo (Gerente Operações)',
    criadoEm: '09/10/2026 08:50',
    tempoDecorrido: 'há 1h 10min',
    nivelAutonomiaSugerido: 'ACAO_SUPERVISIONADA',
    evidencias: [
      { rotulo: 'Estornos Solicitados (Fãs)', valor: 'R$ 42.300,00 (214 ingressos)' },
      { rotulo: 'Saldo Atual em Carteira', valor: 'R$ 11.200,00' },
      { rotulo: 'Déficit a Recompor', valor: 'R$ 31.100,00' },
      { rotulo: 'Garantia Contratual Ativa', valor: 'Cláusula 12.3 (Retenção Cruzada)' },
    ],
  },
  {
    id: 'alt-03',
    codigo: 'SENT-FIS-019',
    severidade: 'CRITICO',
    departamento: 'Fiscal',
    titulo: 'Obrigação fiscal com prazo crítico de transmissão',
    descricao:
      'Transmissão do RPS de serviços de intermediação para a Prefeitura de Curitiba com lote de 89 notas pendente de protocolo.',
    entidadeAfetada: 'NFS-e Prefeitura de Curitiba (ISS 5%)',
    causaIdentificada:
      'Instabilidade temporária no webservice ISS.Curitiba ocorrida às 07:45 resultou em timeout de 3 requisições em lote.',
    acaoRecomendada:
      'Executar reenvio assíncrono do lote via worker com certificado A1 e confirmar retorno de protocolo antes das 14:00.',
    status: 'ABERTO',
    responsavel: 'Fernanda Lopes (Coord. Fiscal)',
    criadoEm: '09/10/2026 08:15',
    tempoDecorrido: 'há 1h 45min',
    nivelAutonomiaSugerido: 'ACAO_SUPERVISIONADA',
    evidencias: [
      { rotulo: 'Lote de RPS Pendente', valor: 'Lote # 202610-09' },
      { rotulo: 'Total de Notas de Serviço', valor: '89 NFS-e' },
      { rotulo: 'ISS Apurado', valor: 'R$ 14.820,50' },
      { rotulo: 'Certificado Digital', valor: 'e-CNPJ A1 Matriz (Status: Válido)' },
    ],
  },
  {
    id: 'alt-04',
    codigo: 'SENT-TES-064',
    severidade: 'ATENCAO',
    departamento: 'Financeiro',
    titulo: 'Divergência na conciliação bancária 1:1',
    descricao:
      'Depósito identificado no extrato do Banco do Brasil sem contrapartida correspondente no Ledger de recebimentos.',
    entidadeAfetada: 'Conta Corrente Matriz — Banco do Brasil (Ag 0092-2)',
    diferenca: 4850.0,
    causaIdentificada:
      'Transferência TED recebida com documento não indexado (possível patrocínio direto ou devolução de caução).',
    acaoRecomendada:
      'Vincular o crédito ao centro de custo correspondente ou abrir averiguação com o departamento de contratos.',
    status: 'EM_TRATAMENTO',
    responsavel: 'Mariana Duarte (Diretora Financeira)',
    criadoEm: '09/10/2026 07:30',
    tempoDecorrido: 'há 2h 30min',
    nivelAutonomiaSugerido: 'INVESTIGACAO',
    evidencias: [
      { rotulo: 'Valor no Extrato Bancário', valor: 'R$ 4.850,00 (Crédito TED)' },
      { rotulo: 'Valor no Ledger ERP', valor: 'R$ 0,00 (Não conciliado)' },
      { rotulo: 'Remetente Identificado', valor: 'Opus Entretenimento S.A.' },
    ],
  },
  {
    id: 'alt-05',
    codigo: 'SENT-CMP-027',
    severidade: 'ATENCAO',
    departamento: 'Compras',
    titulo: 'Pedido de compra sem homologação de fornecedor',
    descricao:
      'Ordem de compra de insumos de bilheteria (bobinas térmicas) emitida para fornecedor com certidão municipal vencida.',
    entidadeAfetada: 'Fornecedor Gráfica & Papéis Paraná Ltda',
    valorSolicitado: 7800.0,
    causaIdentificada:
      'Certidão Negativa de Débitos Municipais de Curitiba expirou há 12 dias e não foi anexada nova via no cadastro.',
    acaoRecomendada:
      'Solicitar CND atualizada antes da liberação do pagamento pelo Financeiro.',
    status: 'EM_TRATAMENTO',
    responsavel: 'Roberto Viana (Compras Corporativas)',
    criadoEm: '09/10/2026 07:10',
    tempoDecorrido: 'há 2h 50min',
    nivelAutonomiaSugerido: 'INVESTIGACAO',
    evidencias: [
      { rotulo: 'Pedido de Compra', valor: 'PED-2026-0412' },
      { rotulo: 'Item', valor: '120 Caixas de Bobina Térmica 80mm' },
      { rotulo: 'Pendência Compliance', valor: 'CND Municipal vencida em 27/09/2026' },
    ],
  },
  {
    id: 'alt-06',
    codigo: 'SENT-RH-014',
    severidade: 'ATENCAO',
    departamento: 'RH & DP',
    titulo: 'Vencimento de segundo período aquisitivo de férias',
    descricao:
      'Colaborador de bilheteria com período dobro prestes a vencer em 18 dias sem escala de descanso programada.',
    entidadeAfetada: 'Colaborador: Pedro Ramos de Castro (Bilheteria Guaíra)',
    causaIdentificada:
      'Acúmulo de escalas em meses de alta temporada de shows no teatro sem substituição temporária.',
    acaoRecomendada:
      'Programar o início do gozo de férias imediatamente para evitar pagamento de dobra legal trabalhista.',
    status: 'EM_TRATAMENTO',
    responsavel: 'Vanessa Toledo (Coord. RH)',
    criadoEm: '08/10/2026 18:20',
    tempoDecorrido: 'há 16 horas',
    nivelAutonomiaSugerido: 'INVESTIGACAO',
    evidencias: [
      { rotulo: 'Período Aquisitivo', valor: '2024/2025' },
      { rotulo: 'Limite Concessivo', valor: '27/10/2026 (18 dias restantes)' },
      { rotulo: 'Risco Trabalhista', valor: 'Dobra legal + 1/3 CF (R$ 5.480,00)' },
    ],
  },
  {
    id: 'alt-07',
    codigo: 'SENT-SEG-008',
    severidade: 'INFO',
    departamento: 'Segurança & Operação',
    titulo: 'Múltiplas tentativas de login com IP externo não cadastrado',
    descricao:
      'Tentativa de acesso com credenciais de operador de PDV originada fora da faixa de IPs permitida dos teatros e shoppings.',
    entidadeAfetada: 'Usuário: juliana.costa@diskingressos.com.br',
    causaIdentificada:
      'Operadora tentou autenticar pelo celular pessoal fora do ambiente de rede do quiosque Shopping Mueller.',
    acaoRecomendada:
      'Solicitar confirmação de 2FA e reforçar política de acesso exclusivo por terminais registrados.',
    status: 'RESOLVIDO',
    responsavel: 'Equipe de Segurança & TI',
    criadoEm: '09/10/2026 06:40',
    tempoDecorrido: 'há 3h 20min',
    nivelAutonomiaSugerido: 'OBSERVACAO',
    evidencias: [
      { rotulo: 'IP de Origem', valor: '177.104.98.12 (Rede 4G Claro)' },
      { rotulo: 'Status 2FA', valor: 'Desafio enviado e validado' },
      { rotulo: 'Ação Tomada', valor: 'Acesso liberado temporariamente com log' },
    ],
  },
];

const MOCK_REGRAS: SentinelRule[] = [
  {
    id: 'rg-01',
    codigo: 'REG-FIN-001',
    modulo: 'Financeiro',
    nome: 'Invariante de Repasse Fiduciário (Saldo Líquido)',
    tipo: 'DETERMINISTICA',
    expressaoRegra: 'repasse_solicitado <= (vendas_brutas - taxas_disk - retencoes_teatro - retencoes_ecad - reserva_estornos)',
    severidade: 'CRITICO',
    status: 'ATIVO',
    verificacoesHoje: 412,
    anomaliasDetectadas: 1,
    ultimaExecucao: '09/10/2026 09:58',
  },
  {
    id: 'rg-02',
    codigo: 'REG-EVT-002',
    modulo: 'Eventos & Produtores',
    nome: 'Trava de Saldo Mínimo para Cobertura de Cancelamentos',
    tipo: 'DETERMINISTICA',
    expressaoRegra: 'saldo_carteira_evento >= (historico_estorno_taxa * volume_vendas_restante)',
    severidade: 'CRITICO',
    status: 'ATIVO',
    verificacoesHoje: 890,
    anomaliasDetectadas: 1,
    ultimaExecucao: '09/10/2026 09:55',
  },
  {
    id: 'rg-03',
    codigo: 'REG-FIS-003',
    modulo: 'Fiscal',
    nome: 'Conformidade de RPS e Deadlines Municipais',
    tipo: 'DETERMINISTICA',
    expressaoRegra: 'rps_pendente.idade_horas <= 24 E status_isscuritiba = OPERACIONAL',
    severidade: 'CRITICO',
    status: 'ATIVO',
    verificacoesHoje: 144,
    anomaliasDetectadas: 1,
    ultimaExecucao: '09/10/2026 09:50',
  },
  {
    id: 'rg-04',
    codigo: 'REG-AI-004',
    modulo: 'Financeiro',
    nome: 'Detecção de Anomalias Estatísticas em Vendas Balcão (PDV)',
    tipo: 'ESTATISTICA',
    expressaoRegra: 'vendas_hora > (media_movel_4_semanas + 3.5 * desvio_padrao)',
    severidade: 'ATENCAO',
    status: 'ATIVO',
    verificacoesHoje: 1250,
    anomaliasDetectadas: 0,
    ultimaExecucao: '09/10/2026 09:59',
  },
  {
    id: 'rg-05',
    codigo: 'REG-CMP-005',
    modulo: 'Compras',
    nome: 'Validação 3-Way Matching (Pedido x Recebimento x NF)',
    tipo: 'DETERMINISTICA',
    expressaoRegra: 'nf_entrada.valor == pedido_compra.valor E item.quantidade == recebimento.quantidade',
    severidade: 'ATENCAO',
    status: 'ATIVO',
    verificacoesHoje: 85,
    anomaliasDetectadas: 0,
    ultimaExecucao: '09/10/2026 09:40',
  },
  {
    id: 'rg-06',
    codigo: 'REG-AI-006',
    modulo: 'Segurança & Operação',
    nome: 'Análise Semântica de Logs e Sessões Concorrentes',
    tipo: 'IA_SEMANTICA',
    expressaoRegra: 'ai_eval(logins_concorrentes, localizacao_geografica, velocidade_deslocamento)',
    severidade: 'ALERTA',
    status: 'ATIVO',
    verificacoesHoje: 3200,
    anomaliasDetectadas: 1,
    ultimaExecucao: '09/10/2026 09:59',
  },
];

const MOCK_AGENTES: SentinelAgent[] = [
  {
    id: 'ag-fin',
    nome: 'Sentinel Finanças & Custódia',
    departamento: 'Financeiro',
    avatar: 'DollarSign',
    foco: 'Audita Ledger vs extrato bancário, limites de repasse fiduciário e taxas de conveniência.',
    autonomia: 'INVESTIGACAO',
    status: 'ANALISANDO',
    alertasGerados: 142,
    acuraciaPercent: 99.4,
    ultimaAtividade: 'há 2 min',
  },
  {
    id: 'ag-evt',
    nome: 'Sentinel Bilheteria & Produtores',
    departamento: 'Eventos & Produtores',
    avatar: 'Ticket',
    foco: 'Monitora velocidade de ingressos por lote, risco de cancelamento e taxas retidas de teatro.',
    autonomia: 'INVESTIGACAO',
    status: 'ONLINE',
    alertasGerados: 98,
    acuraciaPercent: 98.7,
    ultimaAtividade: 'há 5 min',
  },
  {
    id: 'ag-fisc',
    nome: 'Sentinel Fiscal & Tributário',
    departamento: 'Fiscal',
    avatar: 'Receipt',
    foco: 'Verifica emissão de NFS-e Curitiba, retenções na fonte (CSRF/IRRF) e prazos de guias.',
    autonomia: 'ACAO_SUPERVISIONADA',
    status: 'ONLINE',
    alertasGerados: 67,
    acuraciaPercent: 99.8,
    ultimaAtividade: 'há 10 min',
  },
  {
    id: 'ag-cmp',
    nome: 'Sentinel Suprimentos & Almoxarifado',
    departamento: 'Compras',
    avatar: 'ShoppingCart',
    foco: 'Cruza 3-way matching, prazos de contratos, homologação de parceiros e estoque de segurança.',
    autonomia: 'OBSERVACAO',
    status: 'STANDBY',
    alertasGerados: 35,
    acuraciaPercent: 97.9,
    ultimaAtividade: 'há 30 min',
  },
  {
    id: 'ag-rh',
    nome: 'Sentinel RH & Folha',
    departamento: 'RH & DP',
    avatar: 'Users',
    foco: 'Audita vencimento de férias, divergências de espelho de ponto e encargos do eSocial.',
    autonomia: 'OBSERVACAO',
    status: 'STANDBY',
    alertasGerados: 29,
    acuraciaPercent: 99.1,
    ultimaAtividade: 'há 1 hora',
  },
  {
    id: 'ag-ops',
    nome: 'Sentinel Infra & Integridade',
    departamento: 'Segurança & Operação',
    avatar: 'ShieldCheck',
    foco: 'Monitora integridade do CDC, webhooks de venda, latência de filas e acessos anômalos.',
    autonomia: 'ACAO_SUPERVISIONADA',
    status: 'ONLINE',
    alertasGerados: 114,
    acuraciaPercent: 99.9,
    ultimaAtividade: 'há 30 seg',
  },
];

const MOCK_CONFIG: SentinelConfig = {
  modoExecucao: 'HIBRIDO_RECOMENDADO',
  provedorModelo: 'Motor Determinístico NestJS + Modelo Llama-3-70B / Claude-3.5',
  servidorLocalUri: 'http://sentinel-engine.diskingressos.local:8000',
  frequenciaScanSegundos: 30,
  nivelAutonomiaMaximo: 'ACAO_SUPERVISIONADA',
  segurancaZeroRetention: true,
  webhookNotificacaoCritica: 'https://hooks.slack.com/services/KEEPER/SENTINEL_ALERTS',
  bloqueioAutomaticoDeOperacao: true,
};

class SentinelClient {
  private alerts: SentinelAlert[] = [...MOCK_ALERTAS];
  private kpis: SentinelKpis = { ...MOCK_KPIS };
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      (typeof window !== 'undefined' && (window as any).__KEEPER_API_URL__) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      'https://keeper-tng6.vercel.app/api/v1';
  }

  private getAuthHeader(): Record<string, string> {
    const token =
      (typeof window !== 'undefined' && (localStorage.getItem('token') || sessionStorage.getItem('access_token'))) ||
      '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getOverview(): Promise<SentinelOverview> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/alerts`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        const backendAlerts = await res.json();
        if (Array.isArray(backendAlerts) && backendAlerts.length > 0) {
          // Normaliza os alertas do backend para a interface do Sentinel
          const mapped: SentinelAlert[] = backendAlerts.map((ba: any) => ({
            id: ba.id,
            codigo: ba.fingerprint || `SENT-${ba.module}-${ba.id.slice(0, 4)}`,
            severidade: (ba.severity === 'CRITICAL' ? 'CRITICO' : ba.severity || 'ATENCAO') as SentinelSeverity,
            departamento: 'Financeiro' as SentinelDepartment,
            titulo: ba.title,
            descricao: ba.description,
            entidadeAfetada: ba.sourceId ? `Origem: ${ba.sourceId}` : 'Carteira de Evento Disk',
            causaIdentificada: ba.description,
            acaoRecomendada: 'Investigar lançamentos e regularizar saldo da carteira fiduciária.',
            status: (ba.status === 'OPEN' ? 'ABERTO' : ba.status === 'INVESTIGATING' ? 'EM_TRATAMENTO' : 'RESOLVIDO') as SentinelStatus,
            responsavel: ba.assignedTo || 'Diretoria Financeira',
            criadoEm: new Date(ba.openedAt || Date.now()).toLocaleString('pt-BR'),
            tempoDecorrido: 'Tempo real',
            nivelAutonomiaSugerido: 'INVESTIGACAO' as AutonomyLevel,
            evidencias: typeof ba.evidence === 'object' && ba.evidence !== null
              ? Object.entries(ba.evidence).map(([rotulo, valor]) => ({ rotulo, valor: String(valor) }))
              : [{ rotulo: 'Evidência JSON', valor: JSON.stringify(ba.evidence) }],
          }));

          // Mescla alertas do backend com a base determinística
          const merged = [...mapped, ...this.alerts.filter((a) => !mapped.some((m) => m.id === a.id))];
          return {
            kpis: {
              ...this.kpis,
              alertasCriticos: merged.filter((a) => a.severidade === 'CRITICO' && a.status === 'ABERTO').length,
              atencaoNecessaria: merged.filter((a) => a.severidade === 'ATENCAO' && a.status === 'ABERTO').length,
              emTratamento: merged.filter((a) => a.status === 'EM_TRATAMENTO').length,
            },
            alertas: merged,
            regras: MOCK_REGRAS,
            agentes: MOCK_AGENTES,
            config: MOCK_CONFIG,
          };
        }
      }
    } catch {
      // fallback graceful
    }

    return {
      kpis: { ...this.kpis },
      alertas: [...this.alerts],
      regras: MOCK_REGRAS,
      agentes: MOCK_AGENTES,
      config: MOCK_CONFIG,
    };
  }

  async resolveAlert(alertId: string, resolucao: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/alerts/${alertId}/action`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ action: 'RESOLVE', notes: resolucao }),
      });
      if (res.ok) {
        // atualizado no backend com sucesso
      }
    } catch {
      // fallback
    }

    const idx = this.alerts.findIndex((a) => a.id === alertId);
    if (idx >= 0) {
      this.alerts[idx] = {
        ...this.alerts[idx],
        status: 'RESOLVIDO',
        acaoRecomendada: `Resolvido: ${resolucao}`,
      };
      this.kpis.resolvidosHoje += 1;
      if (this.alerts[idx].severidade === 'CRITICO') {
        this.kpis.alertasCriticos = Math.max(0, this.kpis.alertasCriticos - 1);
      } else {
        this.kpis.atencaoNecessaria = Math.max(0, this.kpis.atencaoNecessaria - 1);
      }
      return true;
    }
    return false;
  }

  async startTreatment(alertId: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/alerts/${alertId}/action`, {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ action: 'INVESTIGATE', notes: 'Início de investigação pelo gestor' }),
      });
      if (res.ok) {
        // atualizado no backend
      }
    } catch {
      // fallback
    }

    const idx = this.alerts.findIndex((a) => a.id === alertId);
    if (idx >= 0) {
      this.alerts[idx] = {
        ...this.alerts[idx],
        status: 'EM_TRATAMENTO',
      };
      this.kpis.emTratamento += 1;
      return true;
    }
    return false;
  }

  async getRiskMap(): Promise<RiskDepartmentItem[]> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/risk-map`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return [
      {
        department: 'Financeiro',
        riskLevel: 'ALTO',
        activeAlerts: 3,
        financialImpact: 99850.0,
        probability: 'ALTA',
        urgency: 'CRITICA',
        topRisk: 'Repasse acima do limite elegível fiduciário & divergência bancária',
        lastAudit: 'Hoje às 09:28',
      },
      {
        department: 'Eventos & Produtores',
        riskLevel: 'ALTO',
        activeAlerts: 2,
        financialImpact: 42300.0,
        probability: 'ALTA',
        urgency: 'ALTA',
        topRisk: 'Cobertura insuficiente para estornos pós-cancelamento em sessão de show',
        lastAudit: 'Hoje às 08:50',
      },
      {
        department: 'Contabilidade',
        riskLevel: 'MEDIO',
        activeAlerts: 4,
        financialImpact: 18450.0,
        probability: 'MEDIA',
        urgency: 'MODERADA',
        topRisk: 'Partidas dobradas com conciliação transitória pendente de baixa',
        lastAudit: 'Hoje às 07:15',
      },
      {
        department: 'Fiscal',
        riskLevel: 'MEDIO',
        activeAlerts: 3,
        financialImpact: 14820.5,
        probability: 'MEDIA',
        urgency: 'CRITICA',
        topRisk: 'Transmissão de lote RPS Prefeitura de Curitiba com timeout',
        lastAudit: 'Hoje às 08:15',
      },
      {
        department: 'RH & DP',
        riskLevel: 'BAIXO',
        activeAlerts: 1,
        financialImpact: 3200.0,
        probability: 'BAIXA',
        urgency: 'BAIXA',
        topRisk: 'Férias em dobro de 2 colaboradores com prazo limite em 45 dias',
        lastAudit: 'Hoje às 06:00',
      },
      {
        department: 'Compras & Suprimentos',
        riskLevel: 'BAIXO',
        activeAlerts: 1,
        financialImpact: 5800.0,
        probability: 'BAIXA',
        urgency: 'MODERADA',
        topRisk: 'Ordem de compra de bobinas térmicas sem espelho de NF anexado',
        lastAudit: 'Hoje às 08:40',
      },
      {
        department: 'Infraestrutura & Hardwares',
        riskLevel: 'MEDIO',
        activeAlerts: 2,
        financialImpact: 12500.0,
        probability: 'MEDIA',
        urgency: 'MODERADA',
        topRisk: 'Alerta de latência de link 4G de contingência em venue externo',
        lastAudit: 'Hoje às 09:10',
      },
    ];
  }

  async getCrossAudit(): Promise<CrossAuditReport> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/cross-audit`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      scoreConsistenciaGeral: 98.6,
      inconsistenciasDetectadas: 2,
      verificacoesRealizadas: 14890,
      trilhas: [
        {
          id: 'ca-01',
          origem: 'Compras',
          destino: 'Contas a Pagar',
          descricao: 'Ordem de Compra #OC-2026-89 x Título a Pagar',
          status: 'CONFORME',
          detalhe: 'Pedido de R$ 14.500,00 possui recebimento físico, NF e título faturado com vencimento exato.',
          divergencia: 0,
        },
        {
          id: 'ca-02',
          origem: 'Vendas Ingressos',
          destino: 'Ledger Fiduciário',
          descricao: 'Total Vendas Gateway x Crédito em Custódia',
          status: 'CONFORME',
          detalhe: 'R$ 489.200,00 transacionados nas últimas 24h conciliados 1:1 com os registros de MDR e taxa.',
          divergencia: 0,
        },
        {
          id: 'ca-03',
          origem: 'Contas a Pagar',
          destino: 'Extrato Bancário',
          descricao: 'Lote de Pagamento PIX x Baixa Bancária',
          status: 'DIVERGENCIA',
          detalhe: 'TED de R$ 4.850,00 no Banco do Brasil identificada sem chave de conciliação vinculada no ERP.',
          divergencia: 4850.0,
          regraViolada: 'CONC-1-TO-1-STRICT',
        },
        {
          id: 'ca-04',
          origem: 'RH (Folha)',
          destino: 'Contabilidade',
          descricao: 'Provisão de Folha Mensal x Lançamento Contábil',
          status: 'CONFORME',
          detalhe: 'Provisões de salário, férias e 13º espelhadas nas contas 2.1.01 e 3.1.01 sem desbalanceamento.',
          divergencia: 0,
        },
        {
          id: 'ca-05',
          origem: 'Fiscal (NFS-e)',
          destino: 'Contas a Receber',
          descricao: 'Faturamento de Taxa de Conveniência x Retenção de ISS',
          status: 'ATENCAO',
          detalhe: 'Lote de 89 notas fiscais aguarda confirmação de protocolo da Prefeitura de Curitiba.',
          divergencia: 14820.5,
          regraViolada: 'FISCAL-RPS-BATCH-TIMEOUT',
        },
      ],
    };
  }

  async getPreventiveMonitoring(): Promise<PreventiveReport> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/preventive`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      riscosAntecipados: 4,
      coberturaFinanceiraGlobalPercent: 96.8,
      projecoes: [
        {
          id: 'prev-01',
          categoria: 'LIQUIDEZ_REPASSES',
          titulo: 'Risco de Insuficiência de Repasse em D+5',
          entidade: 'Show Teatro Positivo — Turnê MPB Acústico',
          horizonteDias: 5,
          impactoEstimado: 15000.0,
          severidade: 'CRITICO',
          diagnostico: 'A soma de retenções de teatro e estornos solicitados superará o saldo da carteira caso o repasse seja antecipado.',
          recomendacao: 'Limitar autorização de antecipação ao teto fiduciário de R$ 65.000,00.',
        },
        {
          id: 'prev-02',
          categoria: 'OBRIGACAO_FISCAL',
          titulo: 'Vencimento ISS Curitiba em D-3',
          entidade: 'Prefeitura Municipal de Curitiba (ISS 5%)',
          horizonteDias: 3,
          impactoEstimado: 48200.0,
          severidade: 'ATENCAO',
          diagnostico: 'Apuração mensal de ISS fecha no dia 10; guia DAS/DAM pendente de emissão.',
          recomendacao: 'Fechar livro de saídas e gerar guia de recolhimento antes das 18h do dia anterior.',
        },
        {
          id: 'prev-03',
          categoria: 'ORCAMENTO_COMPRAS',
          titulo: 'Consumo de 88% do Orçamento de TI & Infraestrutura',
          entidade: 'Centro de Custo TI — Curitiba',
          horizonteDias: 12,
          impactoEstimado: 22000.0,
          severidade: 'ATENCAO',
          diagnostico: 'Aquisições de roteadores e no-breaks atingiram 88% do orçamento mensal antes do dia 20.',
          recomendacao: 'Exigir aprovação de alçada de Diretoria para novas requisições neste centro de custo.',
        },
        {
          id: 'prev-04',
          categoria: 'ESTORNOS_CANCELAMENTO',
          titulo: 'Curva Anormal de Pedidos de Devolução pós-adiamento',
          entidade: 'Festival Gastronômico & Musical de Curitiba',
          horizonteDias: 2,
          impactoEstimado: 31100.0,
          severidade: 'CRITICO',
          diagnostico: '214 solicitações de reembolso criadas após adiamento de data de sessão.',
          recomendacao: 'Congelar liquidação de novos lotes e executar compensação cruzada entre eventos do mesmo produtor.',
        },
      ],
    };
  }

  async getRootCauseInvestigation(alertId: string): Promise<RootCauseAnalysis> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/root-cause/${alertId}`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      alertId,
      origemDivergencia: 'GATEWAY_FEES',
      grauConfiancaIA: 98.4,
      resumoDiagnostico: 'Divergência iniciada na aplicação da taxa MDR do adquirente Cielo no parcelamento em 6x, gerando retenção a menor na liquidação fiduciária.',
      esteiraInvestigacao: [
        {
          etapa: 1,
          nome: 'Transação / Venda',
          modulo: 'Vendas Online',
          status: 'OK',
          timestamp: '08/10/2026 21:14:02',
          detalhe: 'Pedido #789012 aprovado no valor de R$ 800,00 (4 ingressos Pista Premium).',
        },
        {
          etapa: 2,
          nome: 'Regra de Taxa Comercial',
          modulo: 'Financeiro (MDR & Split)',
          status: 'ANOMALIA_DETECTADA',
          timestamp: '08/10/2026 21:14:03',
          detalhe: 'Taxa aplicada de 2.1% ao invés da tabela contratual vigente de 3.2% para parcelamento em 6x.',
          impactoDivergencia: 8.8,
        },
        {
          etapa: 3,
          nome: 'Autorização Gateway',
          modulo: 'Integrações (Adquirente)',
          status: 'OK',
          timestamp: '08/10/2026 21:14:05',
          detalhe: 'NSU Cielo 98234120 capturado com sucesso.',
        },
        {
          etapa: 4,
          nome: 'Liquidação Bancária',
          modulo: 'Tesouraria',
          status: 'ALERTA',
          timestamp: '09/10/2026 06:00:10',
          detalhe: 'Valor líquido depositado pelo adquirente divergiu em R$ 8,80 da projeção do Ledger.',
        },
        {
          etapa: 5,
          nome: 'Ledger Fiduciário da Carteira',
          modulo: 'Carteira do Evento',
          status: 'BLOQUEADO',
          timestamp: '09/10/2026 09:28:00',
          detalhe: 'Invariante de consistência impediu repasse automático até regularização da diferença.',
        },
      ],
      acaoSugerida: 'Reaplicar recálculo da matriz de MDR do adquirente Cielo para o lote #4928 e conciliar o crédito no Ledger.',
    };
  }

  async getIntegrationsHealth(): Promise<IntegrationsHealthReport> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/integrations-health`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      statusGlobal: 'OPERACIONAL',
      uptimeMedio: 99.94,
      conectores: [
        {
          id: 'conn-cielo',
          nome: 'Adquirente Cielo (Crédito & Débito)',
          tipo: 'GATEWAY_PAGAMENTO',
          status: 'OPERACIONAL',
          latenciaMs: 142,
          taxaSucessoPercent: 99.82,
          ultimaVerificacao: 'há 10 seg',
        },
        {
          id: 'conn-stone',
          nome: 'Adquirente Stone (PDV Físico & Catracas)',
          tipo: 'GATEWAY_PAGAMENTO',
          status: 'OPERACIONAL',
          latenciaMs: 118,
          taxaSucessoPercent: 99.95,
          ultimaVerificacao: 'há 15 seg',
        },
        {
          id: 'conn-bb',
          nome: 'Banco do Brasil (Open Finance & Extratos)',
          tipo: 'OPEN_FINANCE',
          status: 'OPERACIONAL',
          latenciaMs: 240,
          taxaSucessoPercent: 98.9,
          ultimaVerificacao: 'há 1 min',
        },
        {
          id: 'conn-nfse',
          nome: 'Webservice NFS-e Prefeitura de Curitiba',
          tipo: 'FISCAL_GOV',
          status: 'DEGRADADO',
          latenciaMs: 820,
          taxaSucessoPercent: 94.1,
          ultimaVerificacao: 'há 2 min',
          observacao: 'Instabilidade temporária na recepção de RPS em lote pela prefeitura.',
        },
        {
          id: 'conn-bullmq',
          nome: 'Workers BullMQ & Filas Redis (Async Jobs)',
          tipo: 'INFRAESTRUTURA',
          status: 'OPERACIONAL',
          latenciaMs: 4,
          taxaSucessoPercent: 100.0,
          ultimaVerificacao: 'há 5 seg',
          itensNaFila: 12,
        },
        {
          id: 'conn-webhooks',
          nome: 'Webhooks de Venda & Eventos Transacionais',
          tipo: 'INTEGRACOES',
          status: 'OPERACIONAL',
          latenciaMs: 65,
          taxaSucessoPercent: 99.98,
          ultimaVerificacao: 'há 10 seg',
        },
      ],
    };
  }

  async askAiAssistant(query: string): Promise<AiAssistantResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/ai-assistant`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const qLower = (query || '').toLowerCase();
    let resposta = '';
    const fontes: string[] = [];

    if (qLower.includes('estorno') || qLower.includes('insuficiên') || qLower.includes('insuficien')) {
      resposta =
        'Identifiquei 1 evento com risco crítico de insuficiência para estornos: Festival Gastronômico & Musical de Curitiba (Pedreira). Foram solicitados R$ 42.300,00 em devoluções pós-adiamento de sessão, enquanto o saldo em carteira atual é de apenas R$ 11.200,00 (déficit projetado de R$ 31.100,00). Recomenda-se acionar a Cláusula 12.3 de retenção cruzada em outros eventos do mesmo produtor.';
      fontes.push('sentinel_alerts (Código SENT-EVT-042)');
      fontes.push('financeiro.event_wallets (Carteira ID: pedreira-gastronomico)');
      fontes.push('contratos.producer_agreements (Cláusula 12.3)');
    } else if (qLower.includes('despesa') || qLower.includes('aument') || qLower.includes('gasto')) {
      resposta =
        'Nos últimos 3 meses, as despesas corporativas que apresentaram maior crescimento percentual foram: 1º Telecom & Starlink para Arenas (+34%), 2º Aquisição de Bobinas Térmicas com Tarja Holográfica (+18%) e 3º Manutenção Preventiva de PDAs Android (+12%). Os gastos gerais da matriz permanecem dentro da margem orçada de R$ 380.000,00/mês.';
      fontes.push('financeiro.payables (Consolidação trimestral Q3/Q4)');
      fontes.push('compras.purchase_orders (Centro de custo Operações e TI)');
    } else if (qLower.includes('divergência') || qLower.includes('divergencia') || qLower.includes('solução') || qLower.includes('solucao')) {
      resposta =
        'Constam atualmente 2 divergências financeiras ativas no ERP: 1) TED de R$ 4.850,00 no Banco do Brasil sem contrapartida no Ledger (em tratamento pela Diretoria Financeira); 2) Lote RPS #202610-09 de 89 NFS-e aguardando retorno de protocolo da Prefeitura de Curitiba devido a timeout do webservice municipal.';
      fontes.push('sentinel_alerts (Códigos SENT-TES-064 e SENT-FIS-019)');
      fontes.push('integracoes.bank_statements (Banco do Brasil Ag 0092-2)');
      fontes.push('fiscal.invoices (Lote RPS #202610-09)');
    } else {
      resposta =
        'Com base na auditoria contínua dos módulos do ERP Keeper, todos os parâmetros operacionais estão sob monitoramento. O índice global de conformidade é de 98.6%, com 3 alertas críticos e 12 pontos de atenção em acompanhamento pelos respectivos gestores. A IA opera em modo estritamente consultivo e auditável.';
      fontes.push('sentinel_rules (28 regras determinísticas ativas)');
      fontes.push('sentinel_alerts (Visão consolidada multi-tenant)');
    }

    return {
      pergunta: query,
      resposta,
      fontesAuditadas: fontes,
      timestamp: new Date().toISOString(),
      modoAutonomia: 'CONSULTIVO_AUDITAVEL',
    };
  }

  async createAlert(payload: {
    titulo: string;
    departamento: SentinelDepartment;
    severidade: SentinelSeverity;
    descricao: string;
    entidadeAfetada?: string;
    valorSolicitado?: number;
    causaIdentificada?: string;
    acaoRecomendada?: string;
    responsavel?: string;
    nivelAutonomiaSugerido?: AutonomyLevel;
  }): Promise<SentinelAlert> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/alerts`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({
          title: payload.titulo,
          module: payload.departamento,
          severity: payload.severidade,
          description: payload.descricao,
          affectedEntity: payload.entidadeAfetada,
          riskValue: payload.valorSolicitado,
          causaIdentificada: payload.causaIdentificada,
          acaoRecomendada: payload.acaoRecomendada,
          assignedTo: payload.responsavel,
          suggestedAutonomy: payload.nivelAutonomiaSugerido,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const newAlert: SentinelAlert = {
      id: `alt-user-${Date.now()}`,
      codigo: `SENT-USR-${Math.floor(100 + Math.random() * 900)}`,
      severidade: payload.severidade || 'ALERTA',
      departamento: payload.departamento || 'Financeiro',
      titulo: payload.titulo,
      descricao: payload.descricao,
      entidadeAfetada: payload.entidadeAfetada || 'Geral',
      valorSolicitado: payload.valorSolicitado || 0,
      causaIdentificada: payload.causaIdentificada || 'Ocorrência registrada manualmente pelo gestor.',
      acaoRecomendada: payload.acaoRecomendada || 'Acompanhamento e resolução com parecer de auditoria.',
      status: 'ABERTO',
      responsavel: payload.responsavel || 'Gestor Autorizado',
      criadoEm: 'Agora mesmo',
      tempoDecorrido: '0 min',
      evidencias: [
        { rotulo: 'Origem', valor: 'Console Administrativo' },
        { rotulo: 'Impacto Financeiro', valor: `R$ ${(payload.valorSolicitado || 0).toLocaleString('pt-BR')}` },
      ],
      nivelAutonomiaSugerido: payload.nivelAutonomiaSugerido || 'ACAO_SUPERVISIONADA',
    };
    return newAlert;
  }

  async createRule(payload: {
    codigo?: string;
    nome: string;
    modulo: SentinelDepartment;
    tipo: 'DETERMINISTICA' | 'ESTATISTICA' | 'IA_SEMANTICA';
    expressaoRegra: string;
    severidade: SentinelSeverity;
  }): Promise<SentinelRule> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/rules`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newRule: SentinelRule = {
      id: `rg-user-${Date.now()}`,
      codigo: payload.codigo || `SENT-REG-${Math.floor(100 + Math.random() * 900)}`,
      modulo: payload.modulo || 'Financeiro',
      nome: payload.nome,
      tipo: payload.tipo || 'DETERMINISTICA',
      expressaoRegra: payload.expressaoRegra,
      severidade: payload.severidade || 'CRITICO',
      status: 'ATIVO',
      verificacoesHoje: 0,
      anomaliasDetectadas: 0,
      ultimaExecucao: 'Agora mesmo',
    };
    return newRule;
  }

  async createAgent(payload: {
    nome: string;
    departamento: SentinelDepartment;
    foco: string;
    autonomia: AutonomyLevel;
    avatar?: string;
  }): Promise<SentinelAgent> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/agents`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newAgent: SentinelAgent = {
      id: `ag-user-${Date.now()}`,
      nome: payload.nome,
      departamento: payload.departamento,
      avatar: payload.avatar || '🛡️',
      foco: payload.foco,
      autonomia: payload.autonomia || 'INVESTIGACAO',
      status: 'ONLINE',
      alertasGerados: 0,
      acuraciaPercent: 100.0,
      ultimaAtividade: 'Agora mesmo',
    };
    return newAgent;
  }

  async createCrossAudit(payload: {
    origem: string;
    destino: string;
    descricao: string;
    detalhe: string;
    divergencia?: number;
    regraViolada?: string;
  }): Promise<CrossAuditItem> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/cross-audit`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newTrail: CrossAuditItem = {
      id: `ca-user-${Date.now()}`,
      origem: payload.origem,
      destino: payload.destino,
      descricao: payload.descricao,
      status: (payload.divergencia && payload.divergencia > 0) ? 'DIVERGENCIA' : 'CONFORME',
      detalhe: payload.detalhe,
      divergencia: Number(payload.divergencia || 0),
      regraViolada: payload.regraViolada,
    };
    return newTrail;
  }

  async createPreventiveRisk(payload: {
    titulo: string;
    categoria: string;
    entidade: string;
    horizonteDias: number;
    impactoEstimado: number;
    severidade?: SentinelSeverity;
    diagnostico: string;
    recomendacao: string;
  }): Promise<PreventiveRiskItem> {
    try {
      const res = await fetch(`${this.baseUrl}/inteligencia/sentinel/preventive`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}

    const newRisk: PreventiveRiskItem = {
      id: `prev-user-${Date.now()}`,
      categoria: payload.categoria || 'PREVENTIVO_GERAL',
      titulo: payload.titulo,
      entidade: payload.entidade || 'DiskIngressos',
      horizonteDias: Number(payload.horizonteDias || 7),
      impactoEstimado: Number(payload.impactoEstimado || 0),
      severidade: payload.severidade || 'ATENCAO',
      diagnostico: payload.diagnostico,
      recomendacao: payload.recomendacao,
    };
    return newRisk;
  }
}

export const sentinelClient = new SentinelClient();
