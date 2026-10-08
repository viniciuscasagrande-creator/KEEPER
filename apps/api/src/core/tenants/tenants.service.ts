import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    if (dto.document) {
      const existing = await this.prisma.tenant.findFirst({
        where: { document: dto.document },
      });
      if (existing) {
        throw new ConflictException(`Tenant with document ${dto.document} already exists`);
      }
    }

    return this.prisma.tenant.create({
      data: {
        name: dto.name,
        legalName: dto.legalName,
        document: dto.document,
        status: 'ACTIVE',
        plan: 'ENTERPRISE',
        currency: 'BRL',
      },
    });
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        companies: true,
      },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async listAll() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
