import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreatePayoutRequestDto {
  @ApiProperty({ description: 'ID do Evento ou da Carteira do Evento', example: 'ev-101' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiPropertyOptional({ description: 'ID do Produtor Solicitante', example: 'prod-01' })
  @IsOptional()
  @IsString()
  producerId?: string;

  @ApiProperty({ description: 'Valor solicitado para repasse oficial (R$)', example: 20000.0 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Tipo de transferência bancária', example: 'PIX', enum: ['PIX', 'TED'] })
  @IsOptional()
  @IsString()
  paymentMethod?: 'PIX' | 'TED';

  @ApiPropertyOptional({ description: 'Chave PIX de destino cadastrada', example: 'financeiro@produtora.com.br' })
  @IsOptional()
  @IsString()
  pixKey?: string;

  @ApiPropertyOptional({ description: 'Banco de destino', example: '341 - Itaú Unibanco' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Agência', example: '0422' })
  @IsOptional()
  @IsString()
  agency?: string;

  @ApiPropertyOptional({ description: 'Conta Corrente', example: '99012-3' })
  @IsOptional()
  @IsString()
  account?: string;

  @ApiPropertyOptional({ description: 'Observações ou justificativa do produtor', example: 'Repasse parcial referente ao marco de 50% de vendas atingido.' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateAdvanceRequestDto {
  @ApiProperty({ description: 'ID do Evento ou da Carteira do Evento', example: 'ev-101' })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @ApiPropertyOptional({ description: 'ID do Produtor Solicitante', example: 'prod-01' })
  @IsOptional()
  @IsString()
  producerId?: string;

  @ApiProperty({ description: 'Valor bruto pretendido de antecipação (R$)', example: 50000.0 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  requestedAmount: number;

  @ApiPropertyOptional({ description: 'Taxa de antecipação acordada em contrato (%)', example: 2.5 })
  @IsOptional()
  @IsNumber()
  advanceFeeRate?: number;

  @ApiPropertyOptional({ description: 'Garantias vinculadas à operação', example: 'Travas sobre recebíveis de bilheteria dos próximos 3 lotes.' })
  @IsOptional()
  @IsString()
  warrantiesDescription?: string;

  @ApiPropertyOptional({ description: 'Justificativa do adiantamento', example: 'Pagamento adiantado de cachê do artista principal.' })
  @IsOptional()
  @IsString()
  justification?: string;
}
