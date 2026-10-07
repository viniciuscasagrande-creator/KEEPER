import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@ApiTags('Core - Tenants')
@Controller('core/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Provision a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant successfully provisioned' })
  async create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get('current')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated tenant profile' })
  async getCurrent(@CurrentTenant() tenantId: string) {
    return this.tenantsService.findById(tenantId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  async getById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }
}
