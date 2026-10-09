import { Controller, Get, Param, Patch, Query, Body } from '@nestjs/common';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { SentinelService } from './sentinel.service';

@Controller('inteligencia/sentinel')
export class SentinelController {
  constructor(private readonly sentinel: SentinelService) {}
  @Get('alerts')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  list(@CurrentTenant() tenantId: string, @Query('status') status?: string) { return this.sentinel.list(tenantId, status); }
  @Get('alerts/:id')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  details(@CurrentTenant() tenantId: string, @Param('id') id: string) { return this.sentinel.details(tenantId, id); }
  @Patch('alerts/:id/action')
  @RequirePermissions('inteligencia.sentinel.tratar')
  action(@CurrentTenant() tenantId: string, @Param('id') id: string,
    @CurrentUser('id') userId: string, @Body() body: { action: string; notes?: string }) {
    return this.sentinel.transition(tenantId, id, body.action, userId, body.notes);
  }
}
