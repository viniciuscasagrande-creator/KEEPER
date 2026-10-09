import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProjetosController } from './projetos.controller';
import { ProjetosService } from './projetos.service';

@Module({
  controllers: [ProjetosController],
  providers: [PrismaService, ProjetosService],
  exports: [ProjetosService],
})
export class ProjetosModule {}
