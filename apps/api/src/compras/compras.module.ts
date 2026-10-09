import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';

@Module({
  controllers: [ComprasController],
  providers: [PrismaService, ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}
