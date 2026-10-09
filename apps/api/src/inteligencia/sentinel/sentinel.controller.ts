import { Controller, Get, Post, Param, Patch, Query, Body } from '@nestjs/common';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { SentinelService } from './sentinel.service';

@Controller('inteligencia/sentinel')
export class SentinelController {
  constructor(private readonly sentinel: SentinelService) {}

  @Get('alerts')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  list(@CurrentTenant() tenantId: string, @Query('status') status?: string) {
    return this.sentinel.list(tenantId, status);
  }

  @Get('alerts/:id')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  details(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.sentinel.details(tenantId, id);
  }

  @Patch('alerts/:id/action')
  @RequirePermissions('inteligencia.sentinel.tratar')
  action(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { action: string; notes?: string }
  ) {
    return this.sentinel.transition(tenantId, id, body.action, userId, body.notes);
  }

  @Get('risk-map')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  getRiskMap(@CurrentTenant() tenantId: string) {
    return this.sentinel.getRiskMap(tenantId);
  }

  @Get('cross-audit')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  getCrossAudit(@CurrentTenant() tenantId: string) {
    return this.sentinel.getCrossAudit(tenantId);
  }

  @Get('preventive')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  getPreventive(@CurrentTenant() tenantId: string) {
    return this.sentinel.getPreventiveMonitoring(tenantId);
  }

  @Get('root-cause/:alertId')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  getRootCause(@CurrentTenant() tenantId: string, @Param('alertId') alertId: string) {
    return this.sentinel.getRootCauseInvestigation(tenantId, alertId);
  }

  @Get('integrations-health')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  getIntegrationsHealth(@CurrentTenant() tenantId: string) {
    return this.sentinel.getIntegrationsHealth(tenantId);
  }

  @Post('ai-assistant')
  @RequirePermissions('inteligencia.sentinel.visualizar')
  askAiAssistant(
    @CurrentTenant() tenantId: string,
    @Body() body: { query: string }
  ) {
    return this.sentinel.askAiAssistant(tenantId, body.query);
  }

  @Post('alerts')
  @RequirePermissions('inteligencia.sentinel.tratar')
  createAlert(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() body: any
  ) {
    return this.sentinel.createAlert(tenantId, body, userId);
  }

  @Post('rules')
  @RequirePermissions('inteligencia.sentinel.tratar')
  createRule(
    @CurrentTenant() tenantId: string,
    @Body() body: any
  ) {
    return this.sentinel.createRule(tenantId, body);
  }

  @Post('agents')
  @RequirePermissions('inteligencia.sentinel.tratar')
  createAgent(
    @CurrentTenant() tenantId: string,
    @Body() body: any
  ) {
    return this.sentinel.createAgent(tenantId, body);
  }

  @Post('cross-audit')
  @RequirePermissions('inteligencia.sentinel.tratar')
  createCrossAudit(
    @CurrentTenant() tenantId: string,
    @Body() body: any
  ) {
    return this.sentinel.createCrossAudit(tenantId, body);
  }

  @Post('preventive')
  @RequirePermissions('inteligencia.sentinel.tratar')
  createPreventiveRisk(
    @CurrentTenant() tenantId: string,
    @Body() body: any
  ) {
    return this.sentinel.createPreventiveRisk(tenantId, body);
  }
}
