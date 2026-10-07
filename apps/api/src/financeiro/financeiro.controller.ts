import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

@ApiTags('Financeiro')
@ApiBearerAuth()
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('resumo')
  @RequirePermissions('financeiro.titulos.visualizar')
  @ApiOperation({ summary: 'Resumo das contas a pagar e receber do tenant' })
  async getResumo(@CurrentTenant() tenantId: string) {
    const [payablesCount, receivablesCount, accounts] = await Promise.all([
      this.prisma.payableTitle.count({ where: { tenantId } }),
      this.prisma.receivableTitle.count({ where: { tenantId } }),
      this.prisma.financialAccount.findMany({ where: { tenantId } }),
    ]);

    return {
      totalPayables: payablesCount,
      totalReceivables: receivablesCount,
      accounts,
      status: 'Módulo Financeiro Ativo (Fase 02)',
    };
  }
}
