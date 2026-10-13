import { Injectable, Logger, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { GatewayWebhookDto, TicketSalesWebhookDto, SignatureWebhookDto } from './dto/webhook-payload.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  // Registro de logs de webhooks em memória para telemetria em tempo real
  private webhookLogs: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Converte deterministicamente uma string qualquer em formato UUID v4 válido
   */
  private toValidUuid(id: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;
    const hash = crypto.createHash('md5').update(id || 'default').digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  }

  /**
   * Validação criptográfica de assinatura HMAC SHA-256 com segredos por provedor
   */
  private verifyHmacSignature(payload: any, signatureHeader?: string, provider?: string): boolean {
    const signature = signatureHeader || payload?.signature;
    const isProduction = process.env.NODE_ENV === 'production';
    const requireSignature = isProduction || process.env.REQUIRE_WEBHOOK_SIGNATURE === 'true';

    if (!signature) {
      if (requireSignature) {
        throw new UnauthorizedException(
          `Assinatura HMAC ausente para o webhook do provedor ${provider || 'gateway'} (obrigatória em produção)`,
        );
      }
      this.logger.warn(`Webhook recebido sem assinatura HMAC em ambiente de desenvolvimento (Provedor: ${provider})`);
      return true;
    }

    const secretKey =
      process.env[`WEBHOOK_SECRET_${provider?.toUpperCase()}`] ||
      process.env.WEBHOOK_SECRET;

    if (!secretKey) {
      if (isProduction) {
        this.logger.error(`Segredo de webhook não configurado para o provedor ${provider || 'padrão'}`);
        throw new InternalServerErrorException(
          `Chave secreta de autenticação do provedor ${provider || 'gateway'} não está configurada no servidor.`,
        );
      }
      // Em modo de testes/dev local sem env configurada
      return true;
    }

    const normalizedSignature = signature.replace(/^sha256=/, '').trim();
    const rawPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expectedHash = crypto.createHmac('sha256', secretKey).update(rawPayload).digest('hex');

    try {
      const sigBuf = Buffer.from(normalizedSignature, 'hex');
      const expBuf = Buffer.from(expectedHash, 'hex');

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        this.logger.warn(`Assinatura HMAC inválida para provedor ${provider}`);
        throw new UnauthorizedException(`Assinatura HMAC inválida para o webhook`);
      }
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Falha ao validar assinatura criptográfica do webhook');
    }

    return true;
  }

  /**
   * Resolução dinâmica do TenantId real a partir do banco de dados (rejeita fallback inválido)
   */
  private async resolveTenantId(providedTenantId?: string): Promise<string> {
    if (providedTenantId) {
      try {
        const tenant = await this.prisma.tenant.findUnique({
          where: { id: providedTenantId },
        });
        if (tenant) return tenant.id;
      } catch {
        // Prossegue para busca dinâmica se id falhar
      }
    }

    try {
      const activeTenant = await this.prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' },
      });
      if (activeTenant) return activeTenant.id;

      const anyTenant = await this.prisma.tenant.findFirst();
      if (anyTenant) return anyTenant.id;
    } catch (err: any) {
      this.logger.error(`Falha ao consultar tenant dinâmico no banco: ${err?.message}`);
      throw new InternalServerErrorException('Falha de infraestrutura ao resolver tenant da organização.');
    }

    // Se nenhum tenant existir no banco de dados, rejeita processamento financeiro
    throw new BadRequestException('Tenant inválido ou não identificado para o processamento deste webhook.');
  }

  /**
   * Processa Webhooks de Gateways de Pagamento (Cielo, Rede, Stone, Itaú Pix)
   */
  async processGatewayWebhook(dto: GatewayWebhookDto, signatureHeader?: string, tenantIdHeader?: string) {
    // 1. Validação de Assinatura Criptográfica
    const isSignatureValid = this.verifyHmacSignature(dto, signatureHeader, dto.provider);

    // 2. Resolução Dinâmica de Tenant
    const tenantId = await this.resolveTenantId(tenantIdHeader);
    const aggregateUuid = this.toValidUuid(dto.transactionId);

    // 3. Validação de Vínculo: Se evento informado, confere se pertence ao mesmo tenant
    const eventUuid = this.toValidUuid(dto.eventId);
    const existingWallet = await this.prisma.eventWallet.findFirst({
      where: {
        OR: [{ id: eventUuid }, { eventId: dto.eventId }],
      },
    });

    if (existingWallet && existingWallet.tenantId !== tenantId) {
      throw new BadRequestException('Violação de isolamento multi-tenant: O evento informado não pertence à sua organização.');
    }

    this.logger.log(
      `[Webhook Inbound] Gateway '${dto.provider}' noticou '${dto.eventType}' para transação '${dto.transactionId}' (Evento: ${dto.eventId}, R$ ${dto.amount})`,
    );

    // 4. Verificação de Idempotência
    const existingEvent = await this.prisma.domainEvent.findFirst({
      where: {
        tenantId,
        aggregateType: 'PAYMENT_TRANSACTION',
        aggregateId: aggregateUuid,
        eventType: `GATEWAY_${dto.eventType}`,
      },
    });

    if (existingEvent) {
      this.logger.log(`[Idempotência] Webhook repetido ignorado para transação ${dto.transactionId}`);
      return {
        received: true,
        idempotent: true,
        transactionId: dto.transactionId,
        status: 'ALREADY_PROCESSED',
        message: `Webhook do gateway ${dto.provider} já reconciliado anteriormente.`,
      };
    }

    // 5. Registro no log de telemetria
    const logEntry = {
      id: `wh-${Date.now()}`,
      category: 'GATEWAY',
      provider: dto.provider,
      eventType: dto.eventType,
      transactionId: dto.transactionId,
      eventId: dto.eventId,
      amount: dto.amount,
      receivedAt: new Date().toISOString(),
      status: 'PROCESSED',
      signatureValid: isSignatureValid,
      tenantId,
    };

    this.webhookLogs.unshift(logEntry);
    if (this.webhookLogs.length > 100) this.webhookLogs.pop();

    // 6. Persistência transacional com rollback e tratamento de erro estrito
    try {
      await this.prisma.$transaction(async (tx) => {
        // Grava no outbox de eventos de domínio
        await tx.domainEvent.create({
          data: {
            tenantId,
            eventType: `GATEWAY_${dto.eventType}`,
            aggregateType: 'PAYMENT_TRANSACTION',
            aggregateId: aggregateUuid,
            payload: {
              ...dto,
              receivedAt: logEntry.receivedAt,
              signatureValidated: isSignatureValid,
            },
            status: 'PROCESSED',
            processedAt: new Date(),
          },
        });

        // Se houver carteira de evento cadastrada, reconcilia saldo
        if (existingWallet) {
          if (dto.eventType === 'CHARGEBACK_OPENED') {
            await tx.eventWallet.update({
              where: { id: existingWallet.id },
              data: {
                blockedBalance: { increment: dto.amount },
                balanceAvailable: { decrement: dto.amount },
              },
            });
          } else if (dto.eventType === 'PAYMENT_CONFIRMED' || dto.eventType === 'PIX_SETTLED') {
            await tx.eventWallet.update({
              where: { id: existingWallet.id },
              data: {
                grossTicketSales: { increment: dto.amount },
                balanceAvailable: { increment: dto.amount - (dto.feeAmount || 0) },
              },
            });
          }
        }
      });
    } catch (err: any) {
      logEntry.status = 'PERSISTENCE_FAILED';
      this.logger.error(`Erro ao persistir evento de webhook: ${err?.message}`, err?.stack);
      // Não mascara o erro: notifica o gateway para efetuar retentativa
      throw new InternalServerErrorException(`Falha ao persistir conciliação da transação ${dto.transactionId}: ${err?.message}`);
    }

    return {
      received: true,
      transactionId: dto.transactionId,
      status: 'PROCESSED',
      tenantId,
      ledgerImpact: dto.eventType === 'CHARGEBACK_OPENED' ? 'REVERSE_RESERVE_APPLIED' : 'LEDGER_SETTLED',
      message: `Webhook do gateway ${dto.provider} validado e processado com sucesso. Evento ${dto.eventType} reconciliado.`,
    };
  }

  /**
   * Processa Webhooks de Vendas da Bilheteria Disk (Online & PDVs)
   */
  async processTicketSalesWebhook(dto: TicketSalesWebhookDto, signatureHeader?: string, tenantIdHeader?: string) {
    this.verifyHmacSignature(dto, signatureHeader, 'BILHETERIA_DISK');
    const tenantId = await this.resolveTenantId(tenantIdHeader);
    const eventUuid = this.toValidUuid(dto.eventId);

    // Validação de Vínculo Tenant / Evento
    const wallet = await this.prisma.eventWallet.findFirst({
      where: {
        OR: [{ id: eventUuid }, { eventId: dto.eventId }],
      },
    });

    if (wallet && wallet.tenantId !== tenantId) {
      throw new BadRequestException('Inconsistência de tenant: O evento de ingressos pertence a outra organização.');
    }

    // Idempotência baseada no lote / transação de venda
    const batchKey = `${dto.eventId}-${dto.salesChannel}-${dto.batchOrSector || 'GENERAL'}-${dto.ticketCount}-${dto.grossAmount}`;
    const batchUuid = this.toValidUuid(batchKey);

    const existingBatch = await this.prisma.domainEvent.findFirst({
      where: {
        tenantId,
        aggregateType: 'EVENT_TICKETS',
        aggregateId: batchUuid,
        eventType: 'TICKET_SALES_BATCH_RECEIVED',
      },
    });

    if (existingBatch) {
      this.logger.log(`[Idempotência] Lote de vendas repetido já processado: ${batchKey}`);
      return {
        received: true,
        idempotent: true,
        eventId: dto.eventId,
        status: 'ALREADY_PROCESSED',
        message: `Lote de vendas de ingressos já reconciliado anteriormente.`,
      };
    }

    this.logger.log(
      `[Webhook Inbound] Bilheteria noticou venda de ${dto.ticketCount} ingressos no evento '${dto.eventName}' (Canal: ${dto.salesChannel}, Bruto: R$ ${dto.grossAmount})`,
    );

    const logEntry = {
      id: `wh-tkt-${Date.now()}`,
      category: 'TICKET_SALES',
      eventId: dto.eventId,
      eventName: dto.eventName,
      salesChannel: dto.salesChannel,
      ticketCount: dto.ticketCount,
      grossAmount: dto.grossAmount,
      receivedAt: new Date().toISOString(),
      status: 'PROCESSED',
      tenantId,
    };

    this.webhookLogs.unshift(logEntry);
    if (this.webhookLogs.length > 100) this.webhookLogs.pop();

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.domainEvent.create({
          data: {
            tenantId,
            eventType: 'TICKET_SALES_BATCH_RECEIVED',
            aggregateType: 'EVENT_TICKETS',
            aggregateId: batchUuid,
            payload: {
              ...dto,
              batchKey,
              processedAt: new Date().toISOString(),
            },
            status: 'PROCESSED',
            processedAt: new Date(),
          },
        });

        if (wallet) {
          const diskFee = dto.diskFeeAmount || 0;
          await tx.eventWallet.update({
            where: { id: wallet.id },
            data: {
              grossTicketSales: { increment: dto.grossAmount },
              diskFeeTotal: { increment: diskFee },
              balanceAvailable: { increment: dto.grossAmount - diskFee },
            },
          });
        }
      });
    } catch (err: any) {
      logEntry.status = 'PERSISTENCE_FAILED';
      this.logger.error(`Falha ao persistir lote de vendas de ingressos: ${err?.message}`, err?.stack);
      throw new InternalServerErrorException(`Falha ao persistir lote de ingressos: ${err?.message}`);
    }

    return {
      received: true,
      eventId: dto.eventId,
      ticketsAdded: dto.ticketCount,
      grossAdded: dto.grossAmount,
      tenantId,
      message: `Carteira do evento ${dto.eventName} atualizada com +${dto.ticketCount} ingressos emitidos.`,
    };
  }

  /**
   * Processa Webhooks de Assinaturas Digitais (DocuSign / Clicksign)
   */
  async processSignatureWebhook(dto: SignatureWebhookDto, signatureHeader?: string, tenantIdHeader?: string) {
    this.verifyHmacSignature(dto, signatureHeader, dto.platform);
    const tenantId = await this.resolveTenantId(tenantIdHeader);
    const contractUuid = this.toValidUuid(dto.contractCode);

    this.logger.log(
      `[Webhook Inbound] Assinatura digital da plataforma '${dto.platform}' para contrato '${dto.contractCode}': Status '${dto.status}'`,
    );

    const logEntry = {
      id: `wh-sig-${Date.now()}`,
      category: 'DIGITAL_SIGNATURE',
      platform: dto.platform,
      contractCode: dto.contractCode,
      status: dto.status as string,
      signatoryEmail: dto.signatoryEmail,
      receivedAt: new Date().toISOString(),
      tenantId,
    };

    this.webhookLogs.unshift(logEntry);
    if (this.webhookLogs.length > 100) this.webhookLogs.pop();

    try {
      await this.prisma.domainEvent.create({
        data: {
          tenantId,
          eventType: 'DIGITAL_SIGNATURE_UPDATED',
          aggregateType: 'CONTRACT',
          aggregateId: contractUuid,
          payload: {
            ...dto,
            processedAt: new Date().toISOString(),
          },
          status: 'PROCESSED',
          processedAt: new Date(),
        },
      });
    } catch (err: any) {
      logEntry.status = 'PERSISTENCE_FAILED';
      this.logger.error(`Falha ao persistir status de assinatura digital: ${err?.message}`);
      throw new InternalServerErrorException(`Falha ao persistir assinatura do contrato: ${err?.message}`);
    }

    return {
      received: true,
      contractCode: dto.contractCode,
      currentStatus: dto.status === 'COMPLETED' ? 'VIGENTE_ASSINADO' : 'RECUSADO_OU_PENDENTE',
      tenantId,
      message: `Contrato ${dto.contractCode} atualizado com evidência criptográfica de assinatura de ${dto.signatoryEmail || 'signatário'}.`,
    };
  }

  /**
   * Retorna os últimos logs de webhooks para auditoria (acesso restrito)
   */
  async getWebhookLogs() {
    return {
      total: this.webhookLogs.length,
      logs: this.webhookLogs,
    };
  }
}
