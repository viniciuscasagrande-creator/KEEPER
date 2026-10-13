import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: 'Webhook processado e reconciliado' })
  async handleGatewayWebhook(
    @Body() dto: GatewayWebhookDto,
    @Headers('x-webhook-signature') signature?: string,
  ) {
    return this.webhooksService.processGatewayWebhook(dto, signature);
  }

  @Public()
  @Post('bilheteria')
  @ApiOperation({
    summary: 'Webhook de Vendas de Ingressos (Online & PDVs)',
    description: 'Ingestão contínua de lotes de ingressos vendidos para atualização da carteira do evento e recálculo da margem de repasse.',
  })
  @ApiResponse({ status: 200, description: 'Lote de vendas processado com sucesso' })
  async handleTicketSalesWebhook(@Body() dto: TicketSalesWebhookDto) {
    return this.webhooksService.processTicketSalesWebhook(dto);
  }

  @Public()
  @Post('assinaturas')
  @ApiOperation({
    summary: 'Webhook de Assinatura Digital (DocuSign / Clicksign)',
    description: 'Atualização do status de formalização de contratos de exclusividade e termos aditivos de advance após assinatura dos representantes.',
  })
  @ApiResponse({ status: 200, description: 'Status de contrato atualizado' })
  async handleSignatureWebhook(@Body() dto: SignatureWebhookDto) {
    return this.webhooksService.processSignatureWebhook(dto);
  }

  @Public()
  @Get('logs')
  @ApiOperation({
    summary: 'Logs de Auditoria de Webhooks',
    description: 'Consulta os últimos eventos recebidos pelas esteiras de webhook para monitoramento de saúde e telemetria.',
  })
  async getWebhookLogs() {
    return this.webhooksService.getWebhookLogs();
  }
}
