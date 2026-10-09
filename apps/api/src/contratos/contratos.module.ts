import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContratosController } from './contratos.controller';
import { ContratosService } from './contratos.service';

@Module({
  controllers: [ContratosController],
  providers: [PrismaService, ContratosService],
  exports: [ContratosService],
})
export class ContratosModule {}
