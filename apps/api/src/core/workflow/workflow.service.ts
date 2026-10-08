import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkflow(tenantId: string, data: { name: string; module: string; entity: string }) {
    return this.prisma.workflow.create({
      data: {
        tenantId,
        name: data.name,
        module: data.module,
        entity: data.entity,
        status: 'ACTIVE',
      },
    });
  }

  async startInstance(workflowId: string, entityId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${workflowId} not found`);
    }

    return this.prisma.workflowInstance.create({
      data: {
        workflowId,
        entityId,
        status: 'PENDING',
        currentStep: 1,
      },
    });
  }

  async recordAction(
    workflowInstanceId: string,
    workflowStepId: string,
    userId: string,
    action: string,
    comment?: string,
  ) {
    return this.prisma.workflowAction.create({
      data: {
        workflowInstanceId,
        workflowStepId,
        userId,
        action,
        comment,
      },
    });
  }

  async listInstances(workflowId: string) {
    return this.prisma.workflowInstance.findMany({
      where: { workflowId },
      include: {
        actions: true,
      },
      orderBy: { startedAt: 'desc' },
    });
  }
}
