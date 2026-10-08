import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { FinancialAccountType } from '@erp/database';

export class CreateFinancialAccountDto {
  @ApiProperty({ example: 'Itaú Unibanco - Conta Principal Operações', description: 'Nome descritivo da conta bancária ou caixa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: FinancialAccountType, example: FinancialAccountType.CHECKING, description: 'Tipo da conta (CHECKING, CASH, SAVINGS, etc.)' })
  @IsEnum(FinancialAccountType)
  type: FinancialAccountType;

  @ApiPropertyOptional({ example: '341', description: 'Código FEBRABAN do banco' })
  @IsString()
  @IsOptional()
  bankCode?: string;

  @ApiPropertyOptional({ example: '0422', description: 'Número da agência sem dígito' })
  @IsString()
  @IsOptional()
  agency?: string;

  @ApiPropertyOptional({ example: '18920-1', description: 'Número da conta corrente com dígito' })
  @IsString()
  @IsOptional()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 50000.0, description: 'Saldo inicial de abertura da conta' })
  @IsNumber()
  @IsOptional()
  initialBalance?: number;

  @ApiPropertyOptional({ description: 'ID da filial associada (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  branchId?: string;
}
