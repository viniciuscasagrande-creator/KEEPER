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

export class CreateReceivableTitleDto {
  @ApiProperty({ example: 'Mensalidade de Licenciamento SaaS ERP - Outubro/2026', description: 'Descrição do recebível' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'NFS-e 2026/8921', description: 'Número do documento ou nota fiscal de serviço' })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @ApiPropertyOptional({ description: 'ID do cliente cadastrado (UUID)', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ example: 'Varejo Global Comércio e Distribuição Ltda', description: 'Nome do cliente pagador se avulso' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({ example: '2026-10-08', description: 'Data de emissão do título' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiProperty({ example: '2026-10-15', description: 'Data de vencimento' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ example: 87500.0, description: 'Valor total a receber' })
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

  @ApiPropertyOptional({ example: 1, description: 'Número total de parcelas', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  installmentsCount?: number;

  @ApiPropertyOptional({ example: 30, description: 'Intervalo de dias entre as parcelas', default: 30 })
  @IsInt()
  @Min(1)
  @IsOptional()
  intervalDays?: number;

  @ApiPropertyOptional({ description: 'Conta contábil de receita para geração automática de provisão no Razão', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  revenueAccountId?: string;
}
