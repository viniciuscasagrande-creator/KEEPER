import { Controller, Get, Post, Logger } from '@nestjs/common';
import { OutboxRelayService } from './outbox/outbox-relay.service';

@Controller()
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name);

  constructor(private readonly outboxRelay: OutboxRelayService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'worker',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('jobs/outbox-relay')
  async triggerOutboxRelay() {
    this.logger.log('Internal trigger: executing outbox relay cycle via HTTP');
    await this.outboxRelay.dispatchPendingEvents();
    return {
      success: true,
      message: 'Outbox relay cycle executed successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
