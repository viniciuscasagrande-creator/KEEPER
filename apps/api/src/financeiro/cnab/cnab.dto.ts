import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CnabPaymentItemDto {
  @ApiProperty({ description: 'ID do título ou repasse a pagar', example: 'rep-001' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Nome / Razão Social do Beneficiário', example: 'Opus Entretenimento Ltda' })
  @IsNotEmpty()
  @IsString()
  beneficiaryName: string;

  @ApiProperty({ description: 'CPF ou CNPJ do Beneficiário', example: '12.345.678/0001-90' })
  @IsNotEmpty()
  @IsString()
  beneficiaryDocument: string;

  @ApiPropertyOptional({ description: 'Código do Banco do favorecido (ex: 341, 237, 033)', example: '341' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiPropertyOptional({ description: 'Agência do favorecido', example: '0422' })
  @IsOptional()
  @IsString()
  agency?: string;

  @ApiPropertyOptional({ description: 'Conta corrente do favorecido', example: '88120' })
  @IsOptional()
  @IsString()
  account?: string;

  @ApiPropertyOptional({ description: 'Dígito verificador da conta', example: '1' })
  @IsOptional()
  @IsString()
  accountDigit?: string;

  @ApiPropertyOptional({ description: 'Chave PIX do favorecido (se aplicável)', example: 'financeiro@opus.com.br' })
  @IsOptional()
  @IsString()
  pixKey?: string;

  @ApiProperty({ description: 'Valor a transferir/pagar em R$', example: 25000.0 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Data prevista para pagamento (YYYY-MM-DD)', example: '2026-10-15' })
  @IsOptional()
  @IsString()
  paymentDate?: string;

  @ApiPropertyOptional({ description: 'Número do documento ou identificação interna', example: 'REP-2026-0089' })
  @IsOptional()
  @IsString()
  documentNumber?: string;
}

export class GenerateCnabRemessaDto {
  @ApiProperty({
    description: 'Código do banco emissor da remessa',
    example: '341',
    enum: ['341', '237', '033', '001'],
  })
  @IsNotEmpty()
  @IsString()
  bankCode: '341' | '237' | '033' | '001';

  @ApiProperty({
    description: 'Padrão do layout CNAB',
    example: 'CNAB240',
    enum: ['CNAB240', 'CNAB400'],
  })
  @IsNotEmpty()
  @IsEnum(['CNAB240', 'CNAB400'])
  layout: 'CNAB240' | 'CNAB400';

  @ApiProperty({
    description: 'Finalidade do lote',
    example: 'REPASSE_PRODUTOR',
    enum: ['PAGAMENTO_FORNECEDORES', 'REPASSE_PRODUTOR', 'COBRANCA_BOLETO'],
  })
  @IsNotEmpty()
  @IsEnum(['PAGAMENTO_FORNECEDORES', 'REPASSE_PRODUTOR', 'COBRANCA_BOLETO'])
  type: 'PAGAMENTO_FORNECEDORES' | 'REPASSE_PRODUTOR' | 'COBRANCA_BOLETO';

  @ApiPropertyOptional({ description: 'Número sequencial do arquivo de remessa no banco', example: 104 })
  @IsOptional()
  @IsNumber()
  sequenceNumber?: number;

  @ApiProperty({
    description: 'Itens de pagamento ou títulos para inclusão no lote',
    type: [CnabPaymentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CnabPaymentItemDto)
  items: CnabPaymentItemDto[];
}

export class ParseCnabRetornoDto {
  @ApiPropertyOptional({ description: 'Código do banco do retorno se conhecido', example: '341' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiProperty({
    description: 'Conteúdo bruto do arquivo de retorno retornado pelo banco (texto com linhas de 240 ou 400 chars)',
    example: '00100000         20812345678000190...',
  })
  @IsNotEmpty()
  @IsString()
  fileContent: string;
}
