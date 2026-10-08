import { Module } from '@nestjs/common';
import { WorkerClientService } from './worker-client.service';
import { WorkerClientController } from './worker-client.controller';

@Module({
  controllers: [WorkerClientController],
  providers: [WorkerClientService],
  exports: [WorkerClientService],
})
export class WorkerClientModule {}
