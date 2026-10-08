import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReverseJournalEntryDto {
  @ApiProperty({ example: 'Cancelamento de nota fiscal por emissão indevida', description: 'Justificativa do estorno contábil' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
