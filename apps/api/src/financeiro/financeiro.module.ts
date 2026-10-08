import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ContabilModule } from '../contabil/contabil.module';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';
import { SettlementController } from './settlement/settlement.controller';
import { SettlementService } from './settlement/settlement.service';
import { AppropriationModule } from './appropriation/appropriation.module';
import { AppropriationService } from './appropriation/appropriation.service';
import { AppropriationController } from './appropriation/appropriation.controller';

@Module({
  imports: [ContabilModule, AppropriationModule],
  controllers: [FinanceiroController, SettlementController, AppropriationController],
  providers: [PrismaService, FinanceiroService, SettlementService, AppropriationService],
  exports: [FinanceiroService, SettlementService, AppropriationService],
})
export class FinanceiroModule {}
