import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'ACME Matriz Brasil Ltda', description: 'Legal entity corporate name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  legalName!: string;

  @ApiPropertyOptional({ example: 'ACME Brasil', description: 'Trade name' })
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
