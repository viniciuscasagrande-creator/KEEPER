import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { FinanceiroController } from './financeiro.controller';

@Module({
  controllers: [FinanceiroController],
  providers: [PrismaService],
  exports: [],
})
export class FinanceiroModule {}
