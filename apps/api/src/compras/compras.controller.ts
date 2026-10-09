import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import {
  ComprasService,
  CreatePurchaseRequestDto,
  CreatePurchaseOrderDto,
} from './compras.service';

@ApiTags('Compras')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  private getEffectiveCompanyId(headerCompanyId?: string): string {
    return headerCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  // ==========================================
  // 1. ENDPOINTS DE PAINEL & INDICADORES (PUBLIC)
  // ==========================================

  @Public()
  @Get('painel')
  @ApiOperation({ summary: 'Consultar estrutura de indicadores de compras' })
  async getPainel(@Headers('x-company-id') companyId?: string) {
    const data = await this.comprasService.getDashboard(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
    );

    return {
      items: [
        {
          name: 'Solicitações em aberto',
          value: data.kpis.openRequestsCount,
          formatted: `${data.kpis.openRequestsCount} Abertas`,
          available: true,
        },
        {
          name: 'Aguardando aprovação',
          value: data.kpis.pendingApprovalsCount,
          formatted: `${data.kpis.pendingApprovalsCount} Pendentes`,
          available: true,
        },
        {
          name: 'Pedidos em andamento',
          value: data.kpis.activeOrdersCount,
          formatted: `${data.kpis.activeOrdersCount} Ativos`,
          available: true,
        },
        {
          name: 'Fornecedores homologados',
          value: data.kpis.activeSuppliersCount,
          formatted: `${data.kpis.activeSuppliersCount} Ativos`,
          available: true,
        },
        {
          name: 'Economia em cotações',
          value: data.kpis.monthlySavings,
          formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            data.kpis.monthlySavings,
          ),
          available: true,
        },
      ],
      source: 'DISK_COMPRAS_CORPORATIVO_V1',
      generatedAt: new Date().toISOString(),
    };
  }

  // ==========================================
  // 2. DASHBOARD DE COMPRAS CONSOLIDADO
  // ==========================================

  @Public()
  @Get('dashboard')
  @ApiOperation({ summary: 'Obter painel executivo de compras da Disk' })
  async getDashboard(@Headers('x-company-id') companyId?: string) {
    return this.comprasService.getDashboard('default-tenant', this.getEffectiveCompanyId(companyId));
  }

  // ==========================================
  // 3. SOLICITAÇÕES DE COMPRA (RFQ)
  // ==========================================

  @Public()
  @Get('solicitacoes')
  @ApiOperation({ summary: 'Listar solicitações de compras corporativas' })
  async getRequests(@Headers('x-company-id') companyId?: string) {
    return this.comprasService.getRequests('default-tenant', this.getEffectiveCompanyId(companyId));
  }

  @Public()
  @Post('solicitacoes')
  @ApiOperation({ summary: 'Criar nova solicitação de compra corporativa' })
  async createRequest(
    @Body() dto: CreatePurchaseRequestDto,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.comprasService.createRequest(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      dto,
    );
  }

  @Public()
  @Post('solicitacoes/:id/aprovar')
  @ApiOperation({ summary: 'Aprovar ou rejeitar solicitação de compra' })
  async approveRequest(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.comprasService.approveRequest(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      id,
      approved !== false,
    );
  }

  // ==========================================
  // 4. PEDIDOS DE COMPRA
  // ==========================================

  @Public()
  @Get('pedidos')
  @ApiOperation({ summary: 'Listar pedidos de compra emitidos' })
  async getOrders(@Headers('x-company-id') companyId?: string) {
    return this.comprasService.getOrders('default-tenant', this.getEffectiveCompanyId(companyId));
  }

  @Public()
  @Post('pedidos')
  @ApiOperation({ summary: 'Emitir novo pedido de compra' })
  async createOrder(
    @Body() dto: CreatePurchaseOrderDto,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.comprasService.createOrder(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      dto,
    );
  }

  // ==========================================
  // 5. FORNECEDORES
  // ==========================================

  @Public()
  @Get('fornecedores')
  @ApiOperation({ summary: 'Listar fornecedores corporativos homologados' })
  async getSuppliers(@Headers('x-company-id') companyId?: string) {
    return this.comprasService.getSuppliers('default-tenant', this.getEffectiveCompanyId(companyId));
  }
}
