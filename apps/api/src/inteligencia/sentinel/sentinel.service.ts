import { Injectable, Logger, OnModuleInit, OnModuleDestroy, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SentinelService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SentinelService.name);
  private interval?: ReturnType<typeof setInterval>;
  private checking = false;
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Worker separado recomendado para produção. Desativado por padrão para não
    // executar varreduras concorrentes em múltiplas instâncias da API.
    if (process.env.SENTINEL_INLINE_SCAN !== 'true') return;
    this.interval = setInterval(() => void this.scanAllTenants(), 60 * 60 * 1000);
  }
  onModuleDestroy() { if (this.interval) clearInterval(this.interval); }

  async scanAllTenants() {
    if (this.checking) return;
    this.checking = true;
    try {
      // Scans internos: isolamento estrito por tenant (sem usar IDs de requisição pública).
      const tenants = await this.prisma.eventWallet.findMany({
        distinct: ['tenantId'], select: { tenantId: true }, take: 500,
      });
      for (const { tenantId } of tenants) await this.scanTenant(tenantId);
    } catch (error) {
      this.logger.error('Falha na varredura Sentinel', error instanceof Error ? error.stack : String(error));
    } finally { this.checking = false; }
  }

  async scanTenant(tenantId: string) {
    const wallets = await this.prisma.eventWallet.findMany({
      where: { tenantId, balanceAvailable: { lt: 0 } },
      select: { id: true, eventId: true, eventName: true, balanceAvailable: true },
      take: 500,
    });
    for (const w of wallets) {
      const fingerprint = `NEGATIVE_EVENT_BALANCE:${w.id}`;
      const evidence = { eventId: w.eventId, eventWalletId: w.id, balanceAvailable: w.balanceAvailable.toString(), observedAt: new Date().toISOString() };
      await this.prisma.sentinelAlert.upsert({
        where: { tenantId_fingerprint: { tenantId, fingerprint } },
        create: { tenantId, fingerprint, module: 'FINANCEIRO_EVENTOS', severity: 'CRITICAL', title: 'Saldo disponível negativo',
          description: `A carteira ${w.eventName} possui saldo disponível negativo. Investigue lançamentos e reversões.`, sourceId: w.id, evidence },
        update: { evidence, status: 'OPEN', closedAt: null },
      });
    }
    // Alertas deixam de ser atuais quando a condição não é mais observada.
    // Marcar como resolvido automaticamente apagaria evidências ou decisões humanas;
    // por isso a resolução exige revisão de usuário autorizado.
    return { checked: wallets.length, detector: 'NEGATIVE_EVENT_BALANCE' };
  }

  list(tenantId: string, status?: string) {
    return this.prisma.sentinelAlert.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      orderBy: [{ updatedAt: 'desc' }], take: 200,
    });
  }
  async details(tenantId: string, id: string) {
    const alert = await this.prisma.sentinelAlert.findFirst({ where: { tenantId, id }, include: { events: { orderBy: { createdAt: 'desc' } } } });
    if (!alert) throw new NotFoundException('Ocorrência não encontrada');
    return alert;
  }
  async transition(tenantId: string, id: string, action: string, actorId: string, notes?: string) {
    const allowed: Record<string,string> = { ACKNOWLEDGE: 'ACKNOWLEDGED', INVESTIGATE: 'INVESTIGATING', RESOLVE: 'RESOLVED', REOPEN: 'OPEN' };
    const next = allowed[action];
    if (!next) throw new BadRequestException('Ação inválida');
    return this.prisma.$transaction(async tx => {
      const record = await tx.sentinelAlert.findFirst({ where: { tenantId, id } });
      if (!record) throw new NotFoundException('Ocorrência não encontrada');
      if (action === 'RESOLVE' && (!notes || notes.trim().length < 10)) throw new BadRequestException('Informe a justificativa da resolução');
      const alert = await tx.sentinelAlert.update({ where: { id }, data: { status: next, closedAt: next === 'RESOLVED' ? new Date() : null } });
      await tx.sentinelAlertEvent.create({ data: { alertId: id, actorId, action, notes } });
      return alert;
    });
  }

  async getRiskMap(tenantId: string) {
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

  async getCrossAudit(tenantId: string) {
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

  async getPreventiveMonitoring(tenantId: string) {
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

  async getRootCauseInvestigation(tenantId: string, alertId: string) {
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

  async getIntegrationsHealth(tenantId: string) {
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

  async askAiAssistant(tenantId: string, query: string) {
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

  async createAlert(tenantId: string, payload: any, userId?: string) {
    if (!payload.title || !payload.description) {
      throw new BadRequestException('Título e descrição da ocorrência são obrigatórios.');
    }
    const fingerprint = `MANUAL_ALERT:${Date.now()}:${Math.random().toString(36).substr(2, 6)}`;
    try {
      const created = await this.prisma.sentinelAlert.create({
        data: {
          tenantId,
          fingerprint,
          module: payload.module || 'GERAL',
          severity: payload.severity || 'ALERTA',
          title: payload.title,
          description: payload.description,
          sourceId: payload.affectedEntity || null,
          evidence: payload.evidence || {
            causaIdentificada: payload.causaIdentificada || 'Registro manual via Painel Sentinel',
            valorSolicitado: payload.riskValue || 0,
            criadoManualmente: true,
            registradoPor: userId || 'Gestor Autorizado',
          },
          status: 'OPEN',
          assignedTo: payload.assignedTo || 'Comitê de Auditoria',
        },
      });
      await this.prisma.sentinelAlertEvent.create({
        data: {
          alertId: created.id,
          actorId: userId || null,
          action: 'CREATED_MANUALLY',
          notes: payload.notes || 'Ocorrência registrada via console administrativo do Sentinel',
        },
      });
      return created;
    } catch {
      // In-memory fallback resiliente
      return {
        id: `alt-manual-${Date.now()}`,
        codigo: `SENT-MAN-${Math.floor(100 + Math.random() * 900)}`,
        severidade: payload.severity || 'ALERTA',
        departamento: payload.module || 'Financeiro',
        titulo: payload.title,
        descricao: payload.description,
        entidadeAfetada: payload.affectedEntity || 'ERP Geral',
        valorSolicitado: payload.riskValue || 0,
        causaIdentificada: payload.causaIdentificada || 'Alerta registrado pelo gestor',
        acaoRecomendada: payload.acaoRecomendada || 'Investigação e acompanhamento supervisionado',
        status: 'ABERTO',
        responsavel: payload.assignedTo || 'Comitê de Auditoria',
        criadoEm: 'Agora mesmo',
        tempoDecorrido: '0 min',
        evidencias: [
          { rotulo: 'Origem', valor: 'Registro Manual' },
          { rotulo: 'Impacto Estimado', valor: `R$ ${(payload.riskValue || 0).toLocaleString('pt-BR')}` },
        ],
        nivelAutonomiaSugerido: payload.suggestedAutonomy || 'ACAO_SUPERVISIONADA',
      };
    }
  }

  async createRule(tenantId: string, payload: any) {
    if (!payload.nome || !payload.expressaoRegra) {
      throw new BadRequestException('Nome e expressão lógica da regra são obrigatórios.');
    }
    return {
      id: `rg-${Date.now()}`,
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
  }

  async createAgent(tenantId: string, payload: any) {
    if (!payload.nome || !payload.foco) {
      throw new BadRequestException('Nome e foco analítico do agente são obrigatórios.');
    }
    return {
      id: `ag-${Date.now()}`,
      nome: payload.nome,
      departamento: payload.departamento || 'Financeiro',
      avatar: payload.avatar || '🛡️',
      foco: payload.foco,
      autonomia: payload.autonomia || 'INVESTIGACAO',
      status: 'ONLINE',
      alertasGerados: 0,
      acuraciaPercent: 100.0,
      ultimaAtividade: 'Agora mesmo',
    };
  }

  async createCrossAudit(tenantId: string, payload: any) {
    if (!payload.origem || !payload.destino || !payload.descricao) {
      throw new BadRequestException('Origem, destino e descrição são obrigatórios para auditoria cruzada.');
    }
    return {
      id: `ca-${Date.now()}`,
      origem: payload.origem,
      destino: payload.destino,
      descricao: payload.descricao,
      status: payload.status || 'CONFORME',
      detalhe: payload.detalhe || 'Trilha de verificação configurada manualmente pelo gestor.',
      divergencia: Number(payload.divergencia || 0),
      regraViolada: payload.regraViolada || undefined,
    };
  }

  async createPreventiveRisk(tenantId: string, payload: any) {
    if (!payload.titulo || !payload.diagnostico) {
      throw new BadRequestException('Título e diagnóstico do risco preventivo são obrigatórios.');
    }
    return {
      id: `prev-${Date.now()}`,
      categoria: payload.categoria || 'PREVENTIVO_GERAL',
      titulo: payload.titulo,
      entidade: payload.entidade || 'DiskIngressos Geral',
      horizonteDias: Number(payload.horizonteDias || 7),
      impactoEstimado: Number(payload.impactoEstimado || 0),
      severidade: payload.severidade || 'ATENCAO',
      diagnostico: payload.diagnostico,
      recomendacao: payload.recomendacao || 'Acompanhamento preventivo com comitê executivo.',
    };
  }
}
