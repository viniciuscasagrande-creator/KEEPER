import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '@erp/database';
import { OutboxRelayService } from './outbox/outbox-relay.service';
import { WorkerController } from './worker.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WorkerController],
  providers: [PrismaService, OutboxRelayService],
})
export class WorkerModule {}

