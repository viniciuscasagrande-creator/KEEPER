import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProducerService } from './producer.service';
import { CreatePayoutRequestDto, CreateAdvanceRequestDto } from './dto/producer-requests.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Portal do Produtor (API Central Oficial DiskIngressos)')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-producer-id',
  required: false,
  description: 'ID do produtor autenticado (ex: prod-01 para Opus Entretenimento)',
})
@ApiHeader({
  name: 'x-tenant-id',
  required: false,
  description: 'Identificador do Tenant (Multi-Tenant Disk)',
})
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  private getEffectiveProducerId(headerProducerId?: string, queryProducerId?: string): string {
    return headerProducerId || queryProducerId || 'prod-01';
  }

  private getEffectiveTenantId(headerTenantId?: string, queryTenantId?: string): string {
    return headerTenantId || queryTenantId || '00000000-0000-0000-0000-000000000001';
  }

  /**
   * 1. GET /api/v1/producer/events
   * Consultar eventos vinculados ao produtor logado
   */
  @Public()
  @Get('events')
  @ApiOperation({
    summary: 'Consultar eventos do produtor',
    description: 'Retorna a lista de eventos com métricas de ingressos vendidos, capacidade, status de bilheteria e saldo elegível para repasse.',
  })
  @ApiResponse({ status: 200, description: 'Lista de eventos retornada com sucesso' })
  async getEvents(
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('producerId') queryProdId?: string,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId, queryTenantId);
    return this.producerService.getProducerEvents(tenantId, producerId);
  }

  /**
   * 2. GET /api/v1/producer/events/:id/dashboard
   * Dashboard executivo do evento específico
   */
  @Public()
  @Get('events/:id/dashboard')
  @ApiOperation({
    summary: 'Dashboard executivo do evento',
    description: 'Retorna indicadores em tempo real de vendas brutas, taxas Disk retidas, spread de gateway, despesas do evento e saldo disponível para liberação.',
  })
  @ApiResponse({ status: 200, description: 'Métricas do evento retornadas' })
  async getEventDashboard(
    @Param('id') eventId: string,
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('producerId') queryProdId?: string,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId, queryTenantId);
    return this.producerService.getEventDashboard(tenantId, producerId, eventId);
  }

  /**
   * 3. GET /api/v1/producer/finance/summary
   * Posição financeira consolidada do produtor
   */
  @Public()
  @Get('finance/summary')
  @ApiOperation({
    summary: 'Posição financeira consolidada',
    description: 'Retorna o sumário financeiro global de todos os eventos ativos do produtor, separando saldos liberados, reservas fiduciárias e antecipações.',
  })
  @ApiResponse({ status: 200, description: 'Sumário consolidado retornado' })
  async getFinanceSummary(
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('producerId') queryProdId?: string,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId, queryTenantId);
    return this.producerService.getFinancialSummary(tenantId, producerId);
  }

  /**
   * 4. GET /api/v1/producer/finance/events/:id
   * Carteira e saldos do evento analítico
   */
  @Public()
  @Get('finance/events/:id')
  @ApiOperation({
    summary: 'Carteira e saldos do evento',
    description: 'Decomposição detalhada dos saldos da carteira do evento, histórico de despesas e regras de taxas.',
  })
  @ApiResponse({ status: 200, description: 'Dados da carteira do evento retornados' })
  async getFinanceEventWallet(
    @Param('id') eventId: string,
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('producerId') queryProdId?: string,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId, queryTenantId);
    return this.producerService.getEventWallet(tenantId, producerId, eventId);
  }

  /**
   * 5. GET /api/v1/producer/finance/events/:id/statement
   * Extrato financeiro oficial do evento
   */
  @Public()
  @Get('finance/events/:id/statement')
  @ApiOperation({
    summary: 'Extrato financeiro do evento',
    description: 'Lançamentos cronológicos do Ledger oficial da DiskIngressos: créditos de vendas de ingressos, deduções de taxas, retenções e repasses.',
  })
  @ApiResponse({ status: 200, description: 'Extrato completo retornado' })
  async getFinanceEventStatement(
    @Param('id') eventId: string,
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('producerId') queryProdId?: string,
    @Query('tenantId') queryTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId, queryTenantId);
    return this.producerService.getEventStatement(tenantId, producerId, eventId);
  }

  /**
   * 6. POST /api/v1/producer/finance/payout-requests
   * Solicitar repasse oficial
   */
  @Public()
  @Post('finance/payout-requests')
  @ApiOperation({
    summary: 'Solicitar repasse oficial',
    description: 'O produtor solicita um repasse do saldo elegível. A API autentica, valida contra o saldo liberado e registra a solicitação para análise da equipe financeira Disk.',
  })
  @ApiResponse({ status: 201, description: 'Solicitação de repasse registrada com sucesso' })
  async createPayoutRequest(
    @Body() dto: CreatePayoutRequestDto,
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, dto.producerId);
    const tenantId = this.getEffectiveTenantId(headerTenantId);
    return this.producerService.createPayoutRequest(tenantId, producerId, dto);
  }

  /**
   * 7. GET /api/v1/producer/finance/payout-requests
   * Acompanhar solicitações de repasse
   */
  @Public()
  @Get('finance/payout-requests')
  @ApiOperation({
    summary: 'Acompanhar solicitações de repasse',
    description: 'Lista as solicitações de repasse com linha do tempo de aprovação (Solicitado → Em Análise → Aprovado → Liquidado via PIX/Banco).',
  })
  @ApiResponse({ status: 200, description: 'Fila de solicitações retornada' })
  async getPayoutRequests(
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Query('eventId') eventId?: string,
    @Query('producerId') queryProdId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, queryProdId);
    const tenantId = this.getEffectiveTenantId(headerTenantId);
    return this.producerService.getPayoutRequests(tenantId, producerId, eventId);
  }

  /**
   * 8. POST /api/v1/producer/finance/advance-requests
   * Solicitar antecipação / advance
   */
  @Public()
  @Post('finance/advance-requests')
  @ApiOperation({
    summary: 'Solicitar antecipação / advance',
    description: 'Inicia uma solicitação de advance calculando a taxa de antecipação contratual e registrando as garantias fiduciárias para deliberação da diretoria Disk.',
  })
  @ApiResponse({ status: 201, description: 'Solicitação de advance registrada com sucesso' })
  async createAdvanceRequest(
    @Body() dto: CreateAdvanceRequestDto,
    @Headers('x-producer-id') headerProdId?: string,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const producerId = this.getEffectiveProducerId(headerProdId, dto.producerId);
    const tenantId = this.getEffectiveTenantId(headerTenantId);
    return this.producerService.createAdvanceRequest(tenantId, producerId, dto);
  }
}
