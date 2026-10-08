import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { AuditService } from './audit.service';

@ApiTags('Core - Audit Trail')
@ApiBearerAuth()
@Controller('core/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @RequirePermissions('core.auditoria.visualizar')
  @ApiOperation({ summary: 'Retrieve audit logs for the current tenant' })
  @ApiQuery({ name: 'module', required: false })
  @ApiQuery({ name: 'entity', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLogs(
    @CurrentTenant() tenantId: string,
    @Query('module') module?: string,
    @Query('entity') entity?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.list(tenantId, { module, entity, limit: limit ? Number(limit) : 50 });
  }
}
