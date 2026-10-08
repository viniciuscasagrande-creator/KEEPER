import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class LiquidateTitleDto {
  @ApiProperty({ description: 'ID da conta financeira (banco/caixa) de saída ou entrada dos recursos', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  financialAccountId: string;

  @ApiProperty({ example: '2026-10-08', description: 'Data da efetiva liquidação/baixa' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({ example: 19800.0, description: 'Valor principal liquidado' })
  @IsNumber()
  @IsPositive()
  amountPaid: number;

  @ApiPropertyOptional({ example: 0, description: 'Valor de juros pagos/recebidos por mora' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  interestAmount?: number;

  @ApiPropertyOptional({ example: 0, description: 'Valor de multa paga/recebida por atraso' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fineAmount?: number;

  @ApiPropertyOptional({ example: 0, description: 'Valor de desconto obtido ou concedido' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({ example: 'Liquidação via PIX Itaú comprovante #09124', description: 'Histórico da baixa' })
  @IsString()
  @IsOptional()
  description?: string;
}
