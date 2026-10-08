import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePayableTitleDto {
  @ApiProperty({ example: 'Licenças JetBrains e Ferramental de Desenvolvimento', description: 'Descrição ou histórico do título' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'NF-e 045.291', description: 'Número do documento fiscal ou boleto' })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @ApiPropertyOptional({ description: 'ID do fornecedor (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ example: 'TechCorp Brasil Tecnologia S.A.', description: 'Nome do favorecido/fornecedor se avulso' })
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiProperty({ example: '2026-10-08', description: 'Data de emissão do título' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiProperty({ example: '2026-10-25', description: 'Data de primeiro vencimento' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ example: 19800.0, description: 'Valor total do título a pagar' })
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiPropertyOptional({ description: 'ID da categoria financeira (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'ID do centro de custo (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  costCenterId?: string;

  @ApiPropertyOptional({ description: 'ID do projeto associado (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 1, description: 'Número total de parcelas (gera automaticamente datas e valores)', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  installmentsCount?: number;

  @ApiPropertyOptional({ example: 30, description: 'Intervalo de dias entre as parcelas', default: 30 })
  @IsInt()
  @Min(1)
  @IsOptional()
  intervalDays?: number;

  @ApiPropertyOptional({ description: 'Conta contábil de despesa para geração automática de provisão no Razão', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  expenseAccountId?: string;
}
