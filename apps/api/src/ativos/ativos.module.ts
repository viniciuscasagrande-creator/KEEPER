import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AtivosController } from './ativos.controller';
import { AtivosService } from './ativos.service';

@Module({
  controllers: [AtivosController],
  providers: [PrismaService, AtivosService],
  exports: [AtivosService],
})
export class AtivosModule {}
