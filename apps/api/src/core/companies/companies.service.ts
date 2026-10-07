import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(tenantId: string, dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findFirst({
      where: { tenantId, document: dto.document },
    });

    if (existing) {
      throw new ConflictException(`Company with document ${dto.document} already exists in this tenant`);
    }

    return this.prisma.company.create({
      data: {
        tenantId,
        legalName: dto.legalName,
        tradeName: dto.tradeName,
        document: dto.document,
        taxRegime: dto.taxRegime || 'LUCRO_PRESUMIDO',
        status: 'ACTIVE',
      },
    });
  }

  async listCompanies(tenantId: string) {
    return this.prisma.company.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        branches: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createBranch(tenantId: string, companyId: string, dto: CreateBranchDto) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, tenantId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    const existingBranch = await this.prisma.branch.findFirst({
      where: { companyId, code: dto.code },
    });

    if (existingBranch) {
      throw new ConflictException(`Branch code ${dto.code} already exists in this company`);
    }

    return this.prisma.branch.create({
      data: {
        tenantId,
        companyId,
        code: dto.code,
        name: dto.name,
        document: dto.document,
        stateRegistration: dto.stateRegistration,
        status: 'ACTIVE',
      },
    });
  }

  async listBranches(tenantId: string, companyId: string) {
    return this.prisma.branch.findMany({
      where: { tenantId, companyId, deletedAt: null },
      orderBy: { code: 'asc' },
    });
  }
}
