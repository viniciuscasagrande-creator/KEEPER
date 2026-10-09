import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from './core/core.module';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { RbacGuard } from './core/permissions/guards/rbac.guard';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { ContabilModule } from './contabil/contabil.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { RhModule } from './rh/rh.module';
import { ComprasModule } from './compras/compras.module';
import { EstoqueModule } from './estoque/estoque.module';
import { VendasModule } from './vendas/vendas.module';
import { CrmModule } from './crm/crm.module';
import { ContratosModule } from './contratos/contratos.module';
import { ProjetosModule } from './projetos/projetos.module';
import { AtivosModule } from './ativos/ativos.module';
import { IntegracoesModule } from './integracoes/integracoes.module';
import { InteligenciaModule } from './inteligencia/inteligencia.module';
import { SentinelModule } from './inteligencia/sentinel/sentinel.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production-change-this-now!',
      signOptions: { expiresIn: '1h' },
    }),
    CoreModule,
    FinanceiroModule,
    ContabilModule,
    FiscalModule,
    RhModule,
    ComprasModule,
    EstoqueModule,
    VendasModule,
    CrmModule,
    ContratosModule,
    ProjetosModule,
    AtivosModule,
    IntegracoesModule,
    InteligenciaModule,
    SentinelModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
})
export class AppModule {}
