import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AccountType, AccountNature } from '@erp/database';

export class CreateAccountingAccountDto {
  @ApiProperty({ example: '1.1.01.001', description: 'Código estruturado da conta' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Banco Itaú S.A. - Conta Movimento', description: 'Nome descritivo da conta' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AccountType, example: AccountType.ASSET, description: 'Tipo contábil da conta' })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ enum: AccountNature, example: AccountNature.DEBIT, description: 'Natureza da conta (DEBIT ou CREDIT)' })
  @IsEnum(AccountNature)
  nature: AccountNature;

  @ApiPropertyOptional({ description: 'ID da conta sintética pai', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ example: true, description: 'Se true, aceita lançamentos contábeis diretos (analítica). Se false, é sintética (totalizadora).' })
  @IsBoolean()
  isAnalytical: boolean;

  @ApiPropertyOptional({ example: 4, description: 'Nível hierárquico na árvore do plano de contas' })
  @IsOptional()
  level?: number;
}
