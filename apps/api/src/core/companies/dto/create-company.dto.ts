import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'DISK ERP KEEPER Ltda', description: 'Legal entity corporate name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  legalName!: string;

  @ApiPropertyOptional({ example: 'DISK ERP KEEPER', description: 'Trade name' })
  @IsOptional()
  @IsString()
  tradeName?: string;

  @ApiProperty({ example: '12345678000199', description: 'CNPJ / Tax ID' })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiPropertyOptional({ example: 'LUCRO_PRESUMIDO', description: 'Tax regime' })
  @IsOptional()
  @IsString()
  taxRegime?: string;
}
