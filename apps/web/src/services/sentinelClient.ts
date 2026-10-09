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
}

export const sentinelClient = new SentinelClient();
