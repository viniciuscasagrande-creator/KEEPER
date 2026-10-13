import { Controller, Post, Get, Body, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { GatewayWebhookDto, TicketSalesWebhookDto, SignatureWebhookDto } from './dto/webhook-payload.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Integrações / Webhooks Inbound (Tempo Real & Eventos)')
@Controller('integracoes/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('gateways')
  @ApiOperation({
    summary: 'Webhook de Adquirência & Gateways (Cielo/Stone/Rede/Pix)',
    description: 'Recebe notificações assíncronas de pagamento aprovado, estorno, chargeback e liquidação Pix para conciliação automática com o Ledger.',
  })
  @ApiHeader({ name: 'x-webhook-signature', required: false, description: 'Assinatura HMAC SHA-256 do webhook' })
  @ApiHeader({ name: 'x-tenant-id', required: false, description: 'Identificador do Tenant (opcional, inferido dinamicamente se omitido)' })
  @ApiResponse({ status: 200, description: 'Webhook processado e reconciliado' })
  async handleGatewayWebhook(
    @Body() dto: GatewayWebhookDto,
    @Headers('x-webhook-signature') signature?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.webhooksService.processGatewayWebhook(dto, signature, tenantId);
  }

  @Public()
  @Post('bilheteria')
  @ApiOperation({
    summary: 'Webhook de Vendas de Ingressos (Online & PDVs)',
    description: 'Ingestão contínua de lotes de ingressos vendidos para atualização da carteira do evento e recálculo da margem de repasse.',
  })
  @ApiHeader({ name: 'x-webhook-signature', required: false, description: 'Assinatura HMAC SHA-256 do webhook' })
  @ApiHeader({ name: 'x-tenant-id', required: false, description: 'Identificador do Tenant' })
  @ApiResponse({ status: 200, description: 'Lote de vendas processado com sucesso' })
  async handleTicketSalesWebhook(
    @Body() dto: TicketSalesWebhookDto,
    @Headers('x-webhook-signature') signature?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.webhooksService.processTicketSalesWebhook(dto, signature, tenantId);
  }

  @Public()
  @Post('assinaturas')
  @ApiOperation({
    summary: 'Webhook de Assinatura Digital (DocuSign / Clicksign)',
    description: 'Atualização do status de formalização de contratos de exclusividade e termos aditivos de advance após assinatura dos representantes.',
  })
  @ApiHeader({ name: 'x-webhook-signature', required: false, description: 'Assinatura HMAC SHA-256 do webhook' })
  @ApiHeader({ name: 'x-tenant-id', required: false, description: 'Identificador do Tenant' })
  @ApiResponse({ status: 200, description: 'Status de contrato atualizado' })
  async handleSignatureWebhook(
    @Body() dto: SignatureWebhookDto,
    @Headers('x-webhook-signature') signature?: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    return this.webhooksService.processSignatureWebhook(dto, signature, tenantId);
  }

  // Não é mais @Public(): Requer autenticação JWT de auditoria/administrador
  @Get('logs')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logs de Auditoria de Webhooks (Acesso Restrito)',
    description: 'Consulta os últimos eventos recebidos pelas esteiras de webhook para monitoramento de saúde e telemetria.',
  })
  async getWebhookLogs() {
    return this.webhooksService.getWebhookLogs();
  }
}
