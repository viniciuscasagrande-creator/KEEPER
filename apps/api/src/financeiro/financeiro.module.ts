import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilModule } from '../contabil/contabil.module';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';
import { SettlementController } from './settlement/settlement.controller';
import { SettlementService } from './settlement/settlement.service';

@Module({
  imports: [ContabilModule],
  controllers: [FinanceiroController, SettlementController],
  providers: [PrismaService, FinanceiroService, SettlementService],
  exports: [FinanceiroService, SettlementService],
})
export class FinanceiroModule {}
