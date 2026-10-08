import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ description: 'ID da conta bancária de origem (saída de fundos)', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  sourceAccountId: string;

  @ApiProperty({ description: 'ID da conta bancária de destino (entrada de fundos)', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  destinationAccountId: string;

  @ApiProperty({ example: 25000.0, description: 'Valor monetário transferido' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2026-10-08', description: 'Data da transferência' })
  @IsDateString()
  @IsNotEmpty()
  transferDate: string;

  @ApiPropertyOptional({ example: 'Transferência para cobertura de folha de pagamento na filial', description: 'Histórico da transferência' })
  @IsString()
  @IsOptional()
  description?: string;
}
