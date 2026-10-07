import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';

@Module({
  controllers: [WorkflowController],
  providers: [PrismaService, WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
