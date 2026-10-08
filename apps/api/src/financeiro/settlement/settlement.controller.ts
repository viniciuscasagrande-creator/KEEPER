import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettlementService, SimulateSplitInput } from './settlement.service';

@ApiTags('Financeiro / Central Financeira do Produtor & Câmara de Liquidação')
@Controller('financeiro/settlement')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get('producers')
  @ApiOperation({ summary: 'Lista produtores com saldos consolidados e busca' })
  async getProducers(@Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001') {
    return this.settlementService.getProducers(tenantId);
  }

  @Get('producers/:id/overview')
  @ApiOperation({ summary: 'Visão financeira detalhada do produtor com todos os seus eventos' })
  async getProducerFinancialOverview(
    @Param('id') producerId: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.getProducerFinancialOverview(tenantId, producerId);
  }

  @Get('events/:id/financial-detail')
  @ApiOperation({ summary: 'Decomposição financeira analítica de um evento específico' })
  async getEventFinancialDetail(
    @Param('id') eventId: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.getEventFinancialDetail(tenantId, eventId);
  }

  @Post('events/:id/fees')
  @ApiOperation({ summary: 'Salva ou altera regra de taxa configurável do evento com vigência' })
  async saveEventFeeRule(
    @Param('id') eventId: string,
    @Body() ruleData: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.saveEventFeeRule(tenantId, eventId, ruleData);
  }

  @Post('producers/:id/advances')
  @ApiOperation({ summary: 'Solicita operação de antecipação sobre saldo futuro elegível' })
  async requestAdvance(
    @Param('id') producerId: string,
    @Query('eventId') eventId: string,
    @Body() data: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.requestAdvance(tenantId, producerId, eventId, data);
  }

  @Post('producers/:id/repayments')
  @ApiOperation({ summary: 'Programa repasse com trava contra saldo disponível' })
  async scheduleRepayment(
    @Param('id') producerId: string,
    @Query('eventId') eventId: string,
    @Body() data: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.scheduleRepayment(tenantId, producerId, eventId, data);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Visão geral da Conta de Liquidação DiskIngressos' })
  async getClearingOverview(
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
    @Query('companyId') companyId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.getClearingOverview(tenantId, companyId);
  }

  @Get('wallets')
  @ApiOperation({ summary: 'Lista posições de carteiras de eventos' })
  async getEventWallets(
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
    @Query('companyId') companyId?: string,
  ) {
    return this.settlementService.getEventWallets(tenantId, companyId);
  }

  @Get('wallets/:id/statement')
  @ApiOperation({ summary: 'Extrato financeiro e auditoria completa do evento' })
  async getEventStatement(
    @Param('id') walletId: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.getEventStatement(tenantId, walletId);
  }

  @Get('fees')
  @ApiOperation({ summary: 'Catálogo de Taxas Padrão' })
  async getFeeDefinitions(@Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001') {
    return this.settlementService.getFeeDefinitions(tenantId);
  }

  @Post('simulate-split')
  @ApiOperation({ summary: 'Simula split financeiro da venda com congelamento' })
  simulateSplit(@Body() input: SimulateSplitInput) {
    return this.settlementService.simulateSplit(input);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Lista despesas operacionais descontadas dos eventos' })
  async getEventExpenses(
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
    @Query('walletId') walletId?: string,
  ) {
    return this.settlementService.getEventExpenses(tenantId, walletId);
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Programação de repasses aos produtores' })
  async getSettlementSchedules(@Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001') {
    return this.settlementService.getSettlementSchedules(tenantId);
  }

  @Post('schedules/:id/execute')
  @ApiOperation({ summary: 'Executa liquidação e repasse imediato via PIX/TED' })
  async executeRepayment(
    @Param('id') scheduleId: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.executeRepayment(tenantId, scheduleId);
  }

  @Post('events/:id/repayment-rule')
  @ApiOperation({ summary: 'Salva ou altera a regra de repasse do evento (Marco 50% / Liberação 20%) com vigência' })
  async saveEventRepaymentRule(
    @Param('id') eventId: string,
    @Body() ruleData: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.saveEventRepaymentRule(tenantId, eventId, ruleData);
  }

  @Get('ledger')
  @ApiOperation({ summary: 'Consulta o Livro Financeiro Imutável (FinancialLedger)' })
  async getFinancialLedger(
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Query('entryType') entryType?: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.getFinancialLedger(tenantId, { producerId, eventId, entryType });
  }

  @Post('webhook/sale-approved')
  @ApiOperation({ summary: 'Webhook de ingestão de venda aprovada da DiskIngressos com registro no ledger' })
  async processSaleWebhook(
    @Body() payload: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.processSaleWebhook(tenantId, payload);
  }

  @Post('webhook/sale-refunded')
  @ApiOperation({ summary: 'Webhook de estorno de venda com reversão no Livro Financeiro' })
  async processRefundWebhook(
    @Body() payload: any,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.settlementService.processRefundWebhook(tenantId, payload);
  }
}
