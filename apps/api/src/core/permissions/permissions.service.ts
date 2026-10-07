import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { resource: 'asc' }, { action: 'asc' }],
    });
  }

  async listRoles(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createRole(tenantId: string, name: string, description?: string) {
    const existing = await this.prisma.role.findFirst({
      where: { tenantId, name },
    });

    if (existing) {
      throw new ConflictException(`Role with name '${name}' already exists in this tenant`);
    }

    return this.prisma.role.create({
      data: {
        tenantId,
        name,
        description,
        systemRole: false,
      },
    });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Delete existing and re-insert
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    const data = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({
      data,
    });

    return { success: true, assignedCount: permissionIds.length };
  }
}
