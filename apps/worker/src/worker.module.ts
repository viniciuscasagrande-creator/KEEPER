import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '@erp/database';
import { OutboxRelayService } from './outbox/outbox-relay.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaService, OutboxRelayService],
})
export class WorkerModule {}
