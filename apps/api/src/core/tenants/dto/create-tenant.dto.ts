import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Grupo ACME', description: 'Display name of tenant' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: 'ACME Participações S.A.', description: 'Corporate legal name' })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ example: '12345678000199', description: 'Root corporate document / tax ID' })
  @IsOptional()
  @IsString()
  document?: string;
}
