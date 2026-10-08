import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { RhService } from './rh.service';

@ApiTags('RH & DP')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('rh')
export class RhController {
  constructor(private readonly rhService: RhService) {}

  private getEffectiveCompanyId(headerCompanyId?: string, userCompanyId?: string): string {
    return headerCompanyId || userCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  // ==========================================
  // DASHBOARD RH & DP
  // ==========================================

  @Get('dashboard')
  @RequirePermissions('rh.dashboard.visualizar')
  @ApiOperation({ summary: 'Obter indicadores do Dashboard RH & DP' })
  async getDashboard(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getDashboard(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // COLABORADORES
  // ==========================================

  @Get('colaboradores')
  @RequirePermissions('rh.colaboradores.visualizar')
  @ApiOperation({ summary: 'Listar quadro de colaboradores da empresa' })
  async getEmployees(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('departmentId') departmentId?: string,
    @Query('search') search?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getEmployees(tenantId, effectiveCompanyId, { status, departmentId, search });
  }

  @Post('colaboradores')
  @RequirePermissions('rh.colaboradores.criar')
  @ApiOperation({ summary: 'Cadastrar/admitir novo colaborador' })
  async createEmployee(
    @CurrentTenant() tenantId: string,
    @Body() dto: any,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.createEmployee(tenantId, effectiveCompanyId, dto);
  }

  // ==========================================
  // FOLHA DE PAGAMENTO
  // ==========================================

  @Get('folha')
  @RequirePermissions('rh.folha.visualizar')
  @ApiOperation({ summary: 'Consultar espelho e apuração da folha de pagamento' })
  async getPayroll(
    @CurrentTenant() tenantId: string,
    @Query('period') period?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getPayroll(tenantId, effectiveCompanyId, period);
  }

  @Post('folha/calcular')
  @RequirePermissions('rh.folha.calcular')
  @ApiOperation({ summary: 'Processar motor de cálculo da folha de pagamento' })
  async calculatePayroll(
    @CurrentTenant() tenantId: string,
    @Body() body: { period?: string },
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.calculatePayroll(tenantId, effectiveCompanyId, body?.period);
  }

  // ==========================================
  // ESTRUTURA ORGANIZACIONAL
  // ==========================================

  @Get('departamentos')
  @RequirePermissions('rh.colaboradores.visualizar')
  @ApiOperation({ summary: 'Listar departamentos e organograma' })
  async getDepartments(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getDepartments(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // ENCARGOS & ESOCIAL
  // ==========================================

  @Get('encargos')
  @RequirePermissions('rh.folha.visualizar')
  @ApiOperation({ summary: 'Consultar apuração de encargos trabalhistas e previdenciários' })
  async getCharges(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getCharges(tenantId, effectiveCompanyId);
  }

  @Get('esocial')
  @RequirePermissions('rh.folha.visualizar')
  @ApiOperation({ summary: 'Central de mensageria e eventos do eSocial' })
  async getESocial(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getESocial(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // BENEFÍCIOS
  // ==========================================

  @Get('beneficios')
  @RequirePermissions('rh.folha.visualizar')
  @ApiOperation({ summary: 'Consultar planos de benefícios corporativos' })
  async getBenefits(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.rhService.getBenefits(tenantId, effectiveCompanyId);
  }
}
