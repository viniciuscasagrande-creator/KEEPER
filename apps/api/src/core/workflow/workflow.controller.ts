import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser, UserContext } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { WorkflowService } from './workflow.service';

@ApiTags('Core - Workflows')
@ApiBearerAuth()
@Controller('core/workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @RequirePermissions('core.workflows.criar')
  @ApiOperation({ summary: 'Register a new workflow definition' })
  async createWorkflow(
    @CurrentTenant() tenantId: string,
    @Body() body: { name: string; module: string; entity: string },
  ) {
    return this.workflowService.createWorkflow(tenantId, body);
  }

  @Post(':id/instances')
  @RequirePermissions('core.workflows.executar')
  @ApiOperation({ summary: 'Start a workflow instance for an entity' })
  async startInstance(
    @Param('id') workflowId: string,
    @Body() body: { entityId: string },
  ) {
    return this.workflowService.startInstance(workflowId, body.entityId);
  }

  @Post('instances/:instanceId/actions')
  @RequirePermissions('core.workflows.aprovar')
  @ApiOperation({ summary: 'Record approval or rejection action on a workflow instance' })
  async recordAction(
    @Param('instanceId') instanceId: string,
    @CurrentUser() user: UserContext,
    @Body() body: { stepId: string; action: string; comment?: string },
  ) {
    return this.workflowService.recordAction(
      instanceId,
      body.stepId,
      user.id,
      body.action,
      body.comment,
    );
  }

  @Get(':id/instances')
  @RequirePermissions('core.workflows.visualizar')
  @ApiOperation({ summary: 'List all running and completed instances of a workflow' })
  async listInstances(@Param('id') workflowId: string) {
    return this.workflowService.listInstances(workflowId);
  }
}
