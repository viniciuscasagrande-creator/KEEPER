import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { PermissionsService } from './permissions.service';

@ApiTags('Core - RBAC & Permissions')
@ApiBearerAuth()
@Controller('core/rbac')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('permissions')
  @RequirePermissions('core.permissoes.visualizar')
  @ApiOperation({ summary: 'List all available platform permissions' })
  async listPermissions() {
    return this.permissionsService.listPermissions();
  }

  @Get('roles')
  @RequirePermissions('core.perfis.visualizar')
  @ApiOperation({ summary: 'List roles defined for the current tenant' })
  async listRoles(@CurrentTenant() tenantId: string) {
    return this.permissionsService.listRoles(tenantId);
  }

  @Post('roles')
  @RequirePermissions('core.perfis.criar')
  @ApiOperation({ summary: 'Create a new custom role' })
  async createRole(
    @CurrentTenant() tenantId: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.permissionsService.createRole(tenantId, body.name, body.description);
  }

  @Post('roles/:roleId/permissions')
  @RequirePermissions('core.perfis.editar')
  @ApiOperation({ summary: 'Assign a list of permission IDs to a role' })
  async assignPermissions(
    @Param('roleId') roleId: string,
    @Body() body: { permissionIds: string[] },
  ) {
    return this.permissionsService.assignPermissionsToRole(roleId, body.permissionIds);
  }
}
