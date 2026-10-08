import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateBranchDto } from './dto/create-branch.dto';

@ApiTags('Core - Companies & Branches')
@ApiBearerAuth()
@Controller('core/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @RequirePermissions('core.empresas.criar')
  @ApiOperation({ summary: 'Register a new enterprise company under tenant' })
  @ApiResponse({ status: 201, description: 'Company registered' })
  async createCompany(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companiesService.createCompany(tenantId, dto);
  }

  @Get()
  @RequirePermissions('core.empresas.visualizar')
  @ApiOperation({ summary: 'List all companies under tenant' })
  async listCompanies(@CurrentTenant() tenantId: string) {
    return this.companiesService.listCompanies(tenantId);
  }

  @Post(':companyId/branches')
  @RequirePermissions('core.filiais.criar')
  @ApiOperation({ summary: 'Create a new branch under company' })
  async createBranch(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.companiesService.createBranch(tenantId, companyId, dto);
  }

  @Get(':companyId/branches')
  @RequirePermissions('core.filiais.visualizar')
  @ApiOperation({ summary: 'List all branches under company' })
  async listBranches(
    @CurrentTenant() tenantId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.companiesService.listBranches(tenantId, companyId);
  }
}
