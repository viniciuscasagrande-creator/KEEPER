import { Module } from '@nestjs/common';
import { InteligenciaController } from './inteligencia.controller';
import { InteligenciaService } from './inteligencia.service';

@Module({
  controllers: [InteligenciaController],
  providers: [InteligenciaService],
  exports: [InteligenciaService],
})
export class InteligenciaModule {}
