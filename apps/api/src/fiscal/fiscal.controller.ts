import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FiscalService, CreateInvoiceDto } from './fiscal.service';

@ApiTags('Fiscal')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  private getEffectiveCompanyId(headerCompanyId?: string): string {
    return headerCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  // ==========================================
  // 1. ENDPOINTS DO CONTRATO DO PATCH (PUBLIC)
  // ==========================================

  @Public()
  @Get('painel')
  @ApiOperation({ summary: 'Consultar estrutura de indicadores fiscais (Compatibilidade com Patch)' })
  async getPainel(
    @Headers('x-company-id') companyId?: string,
  ) {
    const data = await this.fiscalService.getDashboard(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
    );

    return {
      items: [
        {
          name: 'Notas emitidas',
          value: data.summary.invoicesIssuedCount,
          formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            data.summary.invoicesIssuedTotal,
          ),
          available: true,
        },
        {
          name: 'Tributos a pagar',
          value: data.summary.taxesPayableTotal,
          formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            data.summary.taxesPayableTotal,
          ),
          available: true,
        },
        {
          name: 'Obrigações pendentes',
          value: data.summary.pendingObligationsCount,
          formatted: `${data.summary.pendingObligationsCount} Pendências`,
          available: true,
        },
        {
          name: 'Inconsistências',
          value: data.summary.inconsistenciesCount,
          formatted: '0 Regular',
          available: true,
        },
      ],
      source: 'DISK_FISCAL_HOMOLOGADO_V1',
      generatedAt: new Date().toISOString(),
    };
  }

  @Public()
  @Get('capacidades')
  @ApiOperation({ summary: 'Identificar quais operações estão disponíveis no motor fiscal' })
  async getCapacidades() {
    return this.fiscalService.getCapabilities();
  }

  // ==========================================
  // 2. DASHBOARD FISCAL COMPLETO
  // ==========================================

  @Public()
  @Get('dashboard')
  @ApiOperation({ summary: 'Obter painel executivo fiscal consolidado da Disk' })
  async getDashboard(
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.fiscalService.getDashboard('default-tenant', this.getEffectiveCompanyId(companyId));
  }

  // ==========================================
  // 3. DOCUMENTOS FISCAIS & NFS-E
  // ==========================================

  @Public()
  @Get('documentos')
  @ApiOperation({ summary: 'Listar notas fiscais emitidas e recebidas' })
  async getInvoices(
    @Query('search') search?: string,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.fiscalService.getInvoices(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      search,
    );
  }

  @Public()
  @Post('documentos')
  @ApiOperation({ summary: 'Emitir nova Nota Fiscal de Serviço (NFS-e)' })
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.fiscalService.createInvoice(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      dto,
    );
  }

  @Public()
  @Post('documentos/:id/cancelar')
  @ApiOperation({ summary: 'Cancelar Nota Fiscal ou emitir carta de correção' })
  async cancelInvoice(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.fiscalService.cancelInvoice(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      id,
      reason || 'Cancelamento solicitado pelo gestor financeiro',
    );
  }

  // ==========================================
  // 4. APURAÇÃO DE TRIBUTOS
  // ==========================================

  @Public()
  @Post('apuracoes/calcular')
  @ApiOperation({ summary: 'Executar motor de apuração tributária para a competência' })
  async calculateTaxes(
    @Body('period') period: string,
    @Headers('x-company-id') companyId?: string,
  ) {
    return this.fiscalService.calculateTaxPeriod(
      'default-tenant',
      this.getEffectiveCompanyId(companyId),
      period || '10/2026',
    );
  }
}
