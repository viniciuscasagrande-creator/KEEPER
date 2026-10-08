import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { ContabilService } from './contabil.service';
import { CreateAccountingAccountDto } from './dto/create-accounting-account.dto';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { OpenPeriodDto } from './dto/open-period.dto';
import { ReverseJournalEntryDto } from './dto/reverse-journal-entry.dto';

@ApiTags('Contábil')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('contabil')
export class ContabilController {
  constructor(private readonly contabilService: ContabilService) {}

  private getEffectiveCompanyId(headerCompanyId?: string, userCompanyId?: string): string {
    return headerCompanyId || userCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  // ==========================================
  // PLANO DE CONTAS
  // ==========================================

  @Get('plano-contas')
  @RequirePermissions('contabil.plano_contas.visualizar')
  @ApiOperation({ summary: 'Listar contas contábeis estruturadas da empresa' })
  async getPlanoContas(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getChartOfAccounts(tenantId, effectiveCompanyId);
  }

  @Post('plano-contas')
  @RequirePermissions('contabil.plano_contas.criar')
  @ApiOperation({ summary: 'Cadastrar nova conta no plano de contas' })
  async createAccount(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAccountingAccountDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.createAccount(tenantId, effectiveCompanyId, dto);
  }

  // ==========================================
  // PERÍODOS CONTÁBEIS
  // ==========================================

  @Get('periodos')
  @RequirePermissions('contabil.periodos.visualizar')
  @ApiOperation({ summary: 'Listar períodos fiscais e status de fechamento' })
  async getPeriodos(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getPeriods(tenantId, effectiveCompanyId);
  }

  @Post('periodos/abrir')
  @RequirePermissions('contabil.periodos.gerenciar')
  @ApiOperation({ summary: 'Abrir período contábil para lançamentos' })
  async openPeriod(
    @CurrentTenant() tenantId: string,
    @Body() dto: OpenPeriodDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.openPeriod(tenantId, effectiveCompanyId, dto);
  }

  @Patch('periodos/:id/fechar')
  @RequirePermissions('contabil.periodos.gerenciar')
  @ApiOperation({ summary: 'Encerrar e travar período contábil' })
  async closePeriod(
    @CurrentTenant() tenantId: string,
    @Param('id') periodId: string,
    @CurrentUser('sub') userId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.closePeriod(tenantId, effectiveCompanyId, periodId, userId);
  }

  // ==========================================
  // RAZÃO GERAL (PARTIDAS DOBRADAS)
  // ==========================================

  @Get('razao')
  @RequirePermissions('contabil.lancamentos.visualizar')
  @ApiOperation({ summary: 'Consultar lançamentos no Razão Geral' })
  async getRazao(
    @CurrentTenant() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getJournalEntries(tenantId, effectiveCompanyId, {
      startDate,
      endDate,
      limit: limit ? Number(limit) : 50,
    });
  }

  @Post('razao')
  @RequirePermissions('contabil.lancamentos.criar')
  @ApiOperation({ summary: 'Criar lançamento no Razão Geral (Partidas Dobradas estritas)' })
  async createJournalEntry(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateJournalEntryDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.createJournalEntry(tenantId, effectiveCompanyId, userId, dto);
  }

  @Post('razao/:id/estorno')
  @RequirePermissions('contabil.lancamentos.estornar')
  @ApiOperation({ summary: 'Estornar lançamento do Razão gerando contrapartida referenciada' })
  async reverseJournalEntry(
    @CurrentTenant() tenantId: string,
    @Param('id') entryId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: ReverseJournalEntryDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.reverseJournalEntry(
      tenantId,
      effectiveCompanyId,
      entryId,
      userId,
      dto,
    );
  }

  // ==========================================
  // RELATÓRIOS CONTÁBEIS (BALANCETE & DRE)
  // ==========================================

  @Get('balancete')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Gerar Balancete de Verificação de todas as contas' })
  async getBalancete(
    @CurrentTenant() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getTrialBalance(tenantId, effectiveCompanyId, startDate, endDate);
  }

  @Get('dre')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Gerar Demonstração do Resultado do Exercício (DRE) em tempo real' })
  async getDre(
    @CurrentTenant() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('context') context?: string,
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getDRE(tenantId, effectiveCompanyId, startDate, endDate, {
      context,
      producerId,
      eventId,
    });
  }

  // ==========================================
  // DASHBOARD CONTÁBIL
  // ==========================================

  @Get('dashboard')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Obter indicadores e visão geral do Dashboard Contábil' })
  async getDashboard(
    @CurrentTenant() tenantId: string,
    @Query('context') context?: string,
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getDashboard(tenantId, effectiveCompanyId, {
      context,
      producerId,
      eventId,
    });
  }

  // ==========================================
  // LIVRO DIÁRIO
  // ==========================================

  @Get('diario')
  @RequirePermissions('contabil.lancamentos.visualizar')
  @ApiOperation({ summary: 'Consultar Livro Diário cronológico' })
  async getDiario(
    @CurrentTenant() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getDiario(tenantId, effectiveCompanyId, {
      startDate,
      endDate,
      limit: limit ? Number(limit) : 100,
      page: page ? Number(page) : 1,
    });
  }

  // ==========================================
  // BALANÇO PATRIMONIAL
  // ==========================================

  @Get('balanco')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Gerar Balanço Patrimonial estruturado (Ativo vs Passivo + PL)' })
  async getBalanco(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getBalancoPatrimonial(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // DFC — DEMONSTRAÇÃO DO FLUXO DE CAIXA
  // ==========================================

  @Get('dfc')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Gerar Demonstração do Fluxo de Caixa (Método Direto)' })
  async getDFC(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getDFC(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // CENTROS DE CUSTO
  // ==========================================

  @Get('centros-custo')
  @RequirePermissions('contabil.plano_contas.visualizar')
  @ApiOperation({ summary: 'Listar centros de custo da empresa' })
  async getCostCenters(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getCostCenters(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // INTEGRAÇÃO FINANCEIRA
  // ==========================================

  @Get('integracao-financeira')
  @RequirePermissions('contabil.lancamentos.visualizar')
  @ApiOperation({ summary: 'Mapeamento de contabilização do motor financeiro (Disk x Produtores)' })
  async getFinancialIntegration(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getFinancialIntegration(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // FISCAL E TRIBUTÁRIO
  // ==========================================

  @Get('tributos')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Apuração e provisões tributárias das receitas próprias' })
  async getTaxOverview(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getTaxOverview(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // CONCILIAÇÃO CONTÁBIL
  // ==========================================

  @Get('conciliacao')
  @RequirePermissions('contabil.lancamentos.visualizar')
  @ApiOperation({ summary: 'Confronto entre Ledger Financeiro e Razão Contábil' })
  async getReconciliation(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getAccountingReconciliation(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // DOCUMENTOS CONTÁBEIS
  // ==========================================

  @Get('documentos')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Documentos fiscais, borderôs e contratos vinculados' })
  async getDocuments(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getAccountingDocuments(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // RELATÓRIOS CONTÁBEIS
  // ==========================================

  @Get('relatorios')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Catálogo de relatórios e demonstrativos contábeis para exportação' })
  async getReportsCatalog(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getReportsCatalog(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // AUDITORIA E HISTÓRICO
  // ==========================================

  @Get('auditoria')
  @RequirePermissions('contabil.lancamentos.visualizar')
  @ApiOperation({ summary: 'Trilha de auditoria e integridade contábil imutável' })
  async getAuditLog(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getAccountingAudit(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // CONFIGURAÇÕES CONTÁBEIS
  // ==========================================

  @Get('configuracoes')
  @RequirePermissions('contabil.periodos.gerenciar')
  @ApiOperation({ summary: 'Parâmetros contábeis, exercício fiscal e CRC do responsável' })
  async getSettings(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getAccountingSettings(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // FOLHA DE PAGAMENTO & ENCARGOS CORPORATIVOS
  // ==========================================

  @Get('folha-pagamento')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Consultar escrituração de folha de pagamento, colaboradores e encargos da Disk' })
  async getPayroll(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getPayroll(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // CONTABILIDADE AUXILIAR DE PRODUTORES E EVENTOS
  // ==========================================

  @Get('produtores-eventos')
  @RequirePermissions('contabil.relatorios.visualizar')
  @ApiOperation({ summary: 'Consultar escrituração contábil auxiliar segregada por produtor e evento' })
  async getProducersAux(
    @CurrentTenant() tenantId: string,
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getProducersAux(tenantId, effectiveCompanyId, {
      producerId,
      eventId,
    });
  }
}
