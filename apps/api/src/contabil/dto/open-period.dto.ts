import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class OpenPeriodDto {
  @ApiProperty({ example: 2026, description: 'Ano do exercício contábil' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 10, description: 'Mês do período contábil (1 a 12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;
}
