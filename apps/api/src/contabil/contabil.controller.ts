import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

@ApiTags('Contábil')
@ApiBearerAuth()
@Controller('contabil')
export class ContabilController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('plano-contas')
  @RequirePermissions('contabil.plano_contas.visualizar')
  @ApiOperation({ summary: 'Listar contas contábeis do tenant' })
  async getPlanoContas(@CurrentTenant() tenantId: string) {
    return this.prisma.accountingAccount.findMany({
      where: { tenantId },
      orderBy: { code: 'asc' },
    });
  }
}
