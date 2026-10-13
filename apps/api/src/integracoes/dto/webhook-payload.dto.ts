import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GatewayWebhookDto {
  @ApiProperty({ description: 'Provedor do Gateway', example: 'CIELO', enum: ['CIELO', 'REDE', 'STONE', 'MERCADO_PAGO', 'PAGAR_ME', 'ITAU_PIX'] })
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty({ description: 'ID da Transação no Gateway', example: 'pay_981240182' })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty({ description: 'ID do Evento na DiskIngressos', example: 'ev-101' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({ description: 'ID do Pedido de Venda', example: 'PED-2026-98124' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Valor Bruto da Transação (R$)', example: 350.0 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Tipo de Evento Notificado', example: 'PAYMENT_CONFIRMED', enum: ['PAYMENT_CONFIRMED', 'CHARGEBACK_OPENED', 'REFUND_PROCESSED', 'PIX_SETTLED'] })
  @IsNotEmpty()
  @IsString()
  eventType: 'PAYMENT_CONFIRMED' | 'CHARGEBACK_OPENED' | 'REFUND_PROCESSED' | 'PIX_SETTLED';

  @ApiPropertyOptional({ description: 'Taxa MDR retida pelo adquirente', example: 7.66 })
  @IsOptional()
  @IsNumber()
  feeAmount?: number;

  @ApiPropertyOptional({ description: 'Timestamp ISO do evento', example: '2026-10-13T12:00:00.000Z' })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiPropertyOptional({ description: 'Assinatura HMAC criptográfica de autenticidade', example: 'sha256=a1b2c3d4e5...' })
  @IsOptional()
  @IsString()
  signature?: string;
}

export class TicketSalesWebhookDto {
  @ApiProperty({ description: 'ID do Evento na DiskIngressos', example: 'ev-101' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiProperty({ description: 'Nome do Evento', example: 'Festival de Primavera 2026' })
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @ApiProperty({ description: 'Canal de Venda', example: 'ONLINE', enum: ['ONLINE', 'PDV_FISICO', 'PORTARIA_D0'] })
  @IsNotEmpty()
  @IsString()
  salesChannel: 'ONLINE' | 'PDV_FISICO' | 'PORTARIA_D0';

  @ApiProperty({ description: 'Quantidade de Ingressos do Lote/Transação', example: 4 })
  @IsNotEmpty()
  @IsNumber()
  ticketCount: number;

  @ApiProperty({ description: 'Valor Bruto Total da Venda de Ingressos (R$)', example: 600.0 })
  @IsNotEmpty()
  @IsNumber()
  grossAmount: number;

  @ApiPropertyOptional({ description: 'Taxa de Conveniência Disk Retida (R$)', example: 60.0 })
  @IsOptional()
  @IsNumber()
  diskFeeAmount?: number;

  @ApiPropertyOptional({ description: 'Identificador do Lote ou Setor', example: 'Lote 02 - Pista Premium' })
  @IsOptional()
  @IsString()
  batchOrSector?: string;
}

export class SignatureWebhookDto {
  @ApiProperty({ description: 'Provedor de Assinatura', example: 'DOCUSIGN', enum: ['DOCUSIGN', 'CLICKSIGN', 'GOV_BR', 'ICP_BRASIL'] })
  @IsNotEmpty()
  @IsString()
  platform: 'DOCUSIGN' | 'CLICKSIGN' | 'GOV_BR' | 'ICP_BRASIL';

  @ApiProperty({ description: 'Código do Contrato no Keeper ERP', example: 'CTR-2026-0042' })
  @IsNotEmpty()
  @IsString()
  contractCode: string;

  @ApiProperty({ description: 'Status da Assinatura', example: 'COMPLETED', enum: ['COMPLETED', 'DECLINED', 'EXPIRED'] })
  @IsNotEmpty()
  @IsString()
  status: 'COMPLETED' | 'DECLINED' | 'EXPIRED';

  @ApiPropertyOptional({ description: 'E-mail do signatário que finalizou', example: 'diretoria@opusentretenimento.com.br' })
  @IsOptional()
  @IsString()
  signatoryEmail?: string;

  @ApiPropertyOptional({ description: 'URL com o documento PDF/A assinado', example: 'https://storage.diskingressos.com.br/contratos/ctr-2026-0042-signed.pdf' })
  @IsOptional()
  @IsString()
  signedDocumentUrl?: string;

  @ApiPropertyOptional({ description: 'Hash SHA-256 do documento', example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' })
  @IsOptional()
  @IsString()
  documentHash?: string;
}
