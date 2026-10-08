import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../permissions/guards/rbac.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { WorkerClientService } from './worker-client.service';

@ApiTags('Core - Worker Trigger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('core/jobs')
export class WorkerClientController {
  constructor(private readonly workerClient: WorkerClientService) {}

  @Post('trigger-relay')
  @RequirePermissions('core.jobs.trigger')
  @ApiOperation({ summary: 'Trigger internal worker outbox relay cycle via service binding' })
  async triggerRelay() {
    return this.workerClient.triggerOutboxRelay();
  }
}
