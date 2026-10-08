import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { FinanceiroService } from './financeiro.service';
import { CreateFinancialAccountDto } from './dto/create-financial-account.dto';
import { CreatePayableTitleDto } from './dto/create-payable-title.dto';
import { CreateReceivableTitleDto } from './dto/create-receivable-title.dto';
import { LiquidateTitleDto } from './dto/liquidate-title.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@ApiTags('Financeiro')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  private getEffectiveCompanyId(headerCompanyId?: string, userCompanyId?: string): string {
    return headerCompanyId || userCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  // ==========================================
  // SUMÁRIO DE TESOURARIA & KPIS
  // ==========================================

  @Get('sumario')
  @RequirePermissions('financeiro.relatorios.visualizar')
  @ApiOperation({ summary: 'KPIs consolidados de caixa, contas a pagar, a receber e liquidez' })
  async getSumario(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getFinancialSummary(tenantId, effectiveCompanyId);
  }

  // ==========================================
  // CONTAS BANCÁRIAS E CAIXA
  // ==========================================

  @Get('contas')
  @RequirePermissions('financeiro.contas.visualizar')
  @ApiOperation({ summary: 'Listar contas correntes e caixas com saldos atualizados' })
  async getAccounts(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getAccounts(tenantId, effectiveCompanyId);
  }

  @Post('contas')
  @RequirePermissions('financeiro.contas.criar')
  @ApiOperation({ summary: 'Cadastrar nova conta financeira' })
  async createAccount(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateFinancialAccountDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.createAccount(tenantId, effectiveCompanyId, dto);
  }

  // ==========================================
  // CONTAS A PAGAR
  // ==========================================

  @Get('titulos-pagar')
  @RequirePermissions('financeiro.titulos.visualizar')
  @ApiOperation({ summary: 'Listar contas a pagar com filtros de vencimento, status e busca' })
  async getPayables(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getPayables(tenantId, effectiveCompanyId, {
      status,
      startDate,
      endDate,
      search,
    });
  }

  @Get('titulos-pagar/:id')
  @RequirePermissions('financeiro.titulos.visualizar')
  @ApiOperation({ summary: 'Obter título a pagar detalhado com suas parcelas e histórico' })
  async getPayableById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getPayableById(tenantId, effectiveCompanyId, id);
  }

  @Get('aging')
  @RequirePermissions('financeiro.relatorios.visualizar')
  @ApiOperation({ summary: 'Distribuição de contas a pagar e receber por vencimento (Aging)' })
  async getAging(
    @CurrentTenant() tenantId: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getAgingSummary(tenantId, effectiveCompanyId);
  }

  @Post('titulos-pagar')
  @RequirePermissions('financeiro.titulos.criar')
  @ApiOperation({ summary: 'Lançar novo título a pagar com parcelamento automático e provisão contábil' })
  async createPayable(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreatePayableTitleDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.createPayableTitle(tenantId, effectiveCompanyId, userId, dto);
  }

  @Post('parcelas-pagar/:id/liquidar')
  @RequirePermissions('financeiro.titulos.baixar')
  @ApiOperation({ summary: 'Baixar e liquidar parcela a pagar debitando conta bancária' })
  async liquidatePayable(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('id') installmentId: string,
    @Body() dto: LiquidateTitleDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.liquidatePayableInstallment(
      tenantId,
      effectiveCompanyId,
      installmentId,
      userId,
      dto,
    );
  }

  // ==========================================
  // CONTAS A RECEBER
  // ==========================================

  @Get('titulos-receber')
  @RequirePermissions('financeiro.titulos.visualizar')
  @ApiOperation({ summary: 'Listar contas a receber com parcelas e status' })
  async getReceivables(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getReceivables(tenantId, effectiveCompanyId, {
      status,
      startDate,
      endDate,
      search,
    });
  }

  @Post('titulos-receber')
  @RequirePermissions('financeiro.titulos.criar')
  @ApiOperation({ summary: 'Lançar novo título a receber com parcelamento e provisão contábil' })
  async createReceivable(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateReceivableTitleDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.createReceivableTitle(tenantId, effectiveCompanyId, userId, dto);
  }

  @Post('parcelas-receber/:id/liquidar')
  @RequirePermissions('financeiro.titulos.baixar')
  @ApiOperation({ summary: 'Baixar e liquidar recebimento creditando conta bancária' })
  async liquidateReceivable(
    @CurrentTenant() tenantId: string,
    @CurrentUser('sub') userId: string,
    @Param('id') installmentId: string,
    @Body() dto: LiquidateTitleDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.liquidateReceivableInstallment(
      tenantId,
      effectiveCompanyId,
      installmentId,
      userId,
      dto,
    );
  }

  // ==========================================
  // TRANSFERÊNCIAS & MOVIMENTAÇÕES
  // ==========================================

  @Post('transferencias')
  @RequirePermissions('financeiro.transferencias.criar')
  @ApiOperation({ summary: 'Transferência de recursos entre contas bancárias da empresa' })
  async createTransfer(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateTransferDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.createTransfer(tenantId, effectiveCompanyId, dto);
  }

  @Get('movimentacoes')
  @RequirePermissions('financeiro.movimentacoes.visualizar')
  @ApiOperation({ summary: 'Extrato consolidado de fluxo financeiro' })
  async getMovements(
    @CurrentTenant() tenantId: string,
    @Query('accountId') accountId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.financeiroService.getMovements(tenantId, effectiveCompanyId, {
      accountId,
      startDate,
      endDate,
    });
  }
}
