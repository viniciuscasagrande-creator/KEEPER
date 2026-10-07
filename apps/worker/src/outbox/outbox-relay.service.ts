import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@erp/database';

@Injectable()
export class OutboxRelayService {
  private readonly logger = new Logger(OutboxRelayService.name);
  private isProcessing = false;

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async dispatchPendingEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.domainEvent.findMany({
        where: { status: 'PENDING' },
        orderBy: { occurredAt: 'asc' },
        take: 50,
      });

      if (pendingEvents.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.log(`Processing ${pendingEvents.length} outbox event(s)...`);

      for (const event of pendingEvents) {
        try {
          // Forward event to message broker or consumers
          this.logger.log(
            `[Outbox] Dispatching event '${event.eventType}' for aggregate '${event.aggregateId}'`,
          );

          await this.prisma.domainEvent.update({
            where: { id: event.id },
            data: {
              status: 'PROCESSED',
              processedAt: new Date(),
            },
          });
        } catch (dispatchError: unknown) {
          const errMsg = dispatchError instanceof Error ? dispatchError.message : 'Unknown error';
          this.logger.error(`Failed to dispatch event ${event.id}: ${errMsg}`);

          await this.prisma.domainEvent.update({
            where: { id: event.id },
            data: {
              status: 'FAILED',
            },
          });
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Outbox relay cycle encountered an error: ${errMsg}`);
    } finally {
      this.isProcessing = false;
    }
  }
}
