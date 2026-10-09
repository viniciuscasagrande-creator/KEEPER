import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { CrmService, CreateProducerDto, CreateOpportunityDto } from './crm.service';

@ApiTags('CRM & Gestão Comercial de Produtores')
@ApiBearerAuth()
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('dashboard')
  @RequirePermissions('crm.visualizar')
  @ApiOperation({ summary: 'Obter indicadores comerciais e funil de produtores' })
  async getDashboard(@CurrentTenant() tenantId: string) {
    return this.crmService.getDashboard(tenantId);
  }

  @Get('producers')
  @RequirePermissions('crm.produtores.visualizar')
  @ApiOperation({ summary: 'Listar carteira completa de produtores cadastrados' })
  async listProducers(@CurrentTenant() tenantId: string) {
    return this.crmService.listProducers(tenantId);
  }

  @Get('producers/:id')
  @RequirePermissions('crm.produtores.visualizar')
  @ApiOperation({ summary: 'Obter detalhes 360º de um produtor específico' })
  async getProducerDetails(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.getProducerDetails(tenantId, id);
  }

  @Post('producers')
  @RequirePermissions('crm.produtores.criar')
  @ApiOperation({ summary: 'Cadastrar novo produtor ou contratante de espetáculo' })
  async createProducer(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProducerDto,
  ) {
    return this.crmService.createProducer(tenantId, dto);
  }

  @Get('opportunities')
  @RequirePermissions('crm.deals.visualizar')
  @ApiOperation({ summary: 'Listar oportunidades comerciais e deals no pipeline' })
  async listOpportunities() {
    return this.crmService.listOpportunities();
  }

  @Post('opportunities')
  @RequirePermissions('crm.deals.criar')
  @ApiOperation({ summary: 'Cadastrar nova oportunidade no funil de vendas' })
  async createOpportunity(@Body() dto: CreateOpportunityDto) {
    return this.crmService.createOpportunity(dto);
  }

  @Patch('opportunities/:id/stage')
  @RequirePermissions('crm.deals.editar')
  @ApiOperation({ summary: 'Avançar etapa no pipeline comercial Kanban' })
  async updateOpportunityStage(
    @Param('id') id: string,
    @Body() body: { stage: string },
  ) {
    return this.crmService.updateOpportunityStage(id, body.stage);
  }
}
