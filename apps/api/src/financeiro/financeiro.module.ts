import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilModule } from '../contabil/contabil.module';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';

@Module({
  imports: [ContabilModule],
  controllers: [FinanceiroController],
  providers: [PrismaService, FinanceiroService],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
