import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateJournalLineDto {
  @ApiProperty({ description: 'ID da conta contábil analítica (UUID)', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @ApiPropertyOptional({ example: 1500.0, description: 'Valor a débito (D)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  debitAmount?: number;

  @ApiPropertyOptional({ example: 0, description: 'Valor a crédito (C)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  creditAmount?: number;

  @ApiPropertyOptional({ description: 'ID do centro de custo associado (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  costCenterId?: string;

  @ApiPropertyOptional({ description: 'ID do projeto associado (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 'Pagamento ref. licença cloud', description: 'Histórico da linha contábil' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateJournalEntryDto {
  @ApiProperty({ example: '2026-10-08', description: 'Data do lançamento contábil (competência)' })
  @IsDateString()
  @IsNotEmpty()
  entryDate: string;

  @ApiProperty({ example: 'Provisão de despesa com servidores AWS ref. Outubro/2026', description: 'Histórico principal do lançamento' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'MANUAL', description: 'Origem do lançamento (MANUAL, FINANCIAL_PAYABLE, FINANCIAL_RECEIVABLE, etc.)' })
  @IsString()
  @IsOptional()
  sourceType?: string;

  @ApiPropertyOptional({ description: 'ID do documento ou título de origem', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  sourceId?: string;

  @ApiProperty({ type: [CreateJournalLineDto], description: 'Linhas do lançamento contábil (Partidas dobradas obrigatórias: soma D = soma C)' })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateJournalLineDto)
  lines: CreateJournalLineDto[];
}
