import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ example: '0001', description: 'Branch internal code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Filial São Paulo', description: 'Branch display name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '12345678000270', description: 'Branch CNPJ' })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiPropertyOptional({ example: '110.123.456.789', description: 'State registration' })
  @IsOptional()
  @IsString()
  stateRegistration?: string;
}
