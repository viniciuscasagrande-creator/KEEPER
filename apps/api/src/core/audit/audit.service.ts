import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface CreateAuditLogParams {
  tenantId: string;
  userId?: string;
  companyId?: string;
  module: string;
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'APPROVE' | 'REJECT' | 'REVERSE' | 'LOGIN' | 'LOGOUT';
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams) {
    try {
      await this.prisma.auditLog.create({
        data: {
          tenantId: params.tenantId,
          userId: params.userId,
          companyId: params.companyId,
          module: params.module,
          entity: params.entity,
          entityId: params.entityId,
          action: params.action,
          oldData: params.oldData ? (params.oldData as object) : undefined,
          newData: params.newData ? (params.newData as object) : undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          requestId: params.requestId,
        },
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to record audit log: ${errMsg}`);
    }
  }

  async list(tenantId: string, filter?: { module?: string; entity?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(filter?.module ? { module: filter.module } : {}),
        ...(filter?.entity ? { entity: filter.entity } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filter?.limit || 50,
    });
  }
}
