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
import { CommercialRulesController } from './commercial-rules/commercial-rules.controller';
import { CommercialRulesService } from './commercial-rules/commercial-rules.service';

@Module({
  imports: [ContabilModule, AppropriationModule],
  controllers: [
    FinanceiroController,
    SettlementController,
    AppropriationController,
    CommercialRulesController,
  ],
  providers: [
    PrismaService,
    FinanceiroService,
    SettlementService,
    AppropriationService,
    CommercialRulesService,
  ],
  exports: [FinanceiroService, SettlementService, AppropriationService, CommercialRulesService],
})
export class FinanceiroModule {}
