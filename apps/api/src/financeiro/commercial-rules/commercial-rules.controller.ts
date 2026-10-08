import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommercialRulesService, CommercialRuleDto } from './commercial-rules.service';

@ApiTags('Financeiro / Taxas & Regras Comerciais')
@Controller('financeiro/commercial-rules')
export class CommercialRulesController {
  constructor(private readonly service: CommercialRulesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as regras comerciais com filtros por escopo, produtor, evento e situação' })
  async getRules(
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
    @Query('scope') scope?: string,
    @Query('producerId') producerId?: string,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
    @Query('acquirer') acquirer?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(tenantId, { scope, producerId, eventId, status, acquirer, search });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Retorna os indicadores e KPIs da tela de Taxas & Regras Comerciais' })
  async getSummary(@Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001') {
    return this.service.getSummary(tenantId);
  }

  @Get('effective')
  @ApiOperation({ summary: 'Resolução hierárquica estrita: Evento -> Produtor -> Geral Disk' })
  async getEffectiveRule(
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
    @Query('eventId') eventId?: string,
    @Query('producerId') producerId?: string,
    @Query('paymentMethod') paymentMethod = 'CREDIT_INSTALLMENT_2_6',
  ) {
    return this.service.findEffectiveRule(tenantId, eventId, producerId, paymentMethod);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de uma regra comercial específica' })
  async getRuleById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Consulta o histórico de versões e auditoria imutável da regra' })
  async getRuleHistory(@Param('id') id: string) {
    return this.service.getHistory(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra nova taxa / regra comercial' })
  async createRule(
    @Body() dto: CommercialRuleDto,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.service.create(dto, tenantId);
  }

  @Post(':id/version')
  @ApiOperation({ summary: 'Cria nova versão da regra (v2, v3...), preservando a anterior imutável' })
  async createVersion(@Param('id') id: string, @Body() dto: CommercialRuleDto) {
    return this.service.createVersion(id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publica e homologa a regra comercial' })
  async publishRule(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy = 'Diretoria Financeira',
  ) {
    return this.service.publish(id, approvedBy);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alterna status da regra (Ativa / Inativa) sem exclusão física' })
  async toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplica regra comercial existente como rascunho' })
  async duplicateRule(@Param('id') id: string) {
    return this.service.duplicate(id);
  }

  @Post('simulate')
  @ApiOperation({ summary: 'Simula split e margem transacional pura (sem movimentar caixa)' })
  async simulateFee(@Body() input: any) {
    return this.service.simulate(input);
  }
}
