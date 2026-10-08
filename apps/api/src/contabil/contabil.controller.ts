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
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.contabilService.getDRE(tenantId, effectiveCompanyId, startDate, endDate);
  }
}
