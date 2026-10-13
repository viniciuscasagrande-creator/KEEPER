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
import { HealthModule } from './health/health.module';

import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (process.env.NODE_ENV === 'production' && (!secret || secret.includes('replace-in-production') || secret.length < 32)) {
          throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable with at least 32 characters is mandatory in production!');
        }
        return {
          secret: secret || 'super-secret-jwt-key-development-only-change-in-production',
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
    CoreModule,
    HealthModule,
    FinanceiroModule,
    ProducerModule,
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
