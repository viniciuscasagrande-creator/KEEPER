import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  AppropriationService,
  ApprovedSale,
  RevertAppropriationInput,
} from './appropriation.service';

@ApiTags('Financeiro / Motor de Apropriação Financeira Real')
@Controller('financeiro/appropriation')
export class AppropriationController {
  constructor(private readonly appropriationService: AppropriationService) {}

  @Post('process')
  @ApiOperation({
    summary: 'Processa venda aprovada com bloqueio concorrente e partidas dobradas',
  })
  async processApprovedSale(@Body() sale: ApprovedSale) {
    return this.appropriationService.processApprovedSale(sale);
  }

  @Post('revert')
  @ApiOperation({
    summary: 'Reverte apropriação por estorno ou cancelamento de evento preservando histórico',
  })
  async revertAppropriation(@Body() input: RevertAppropriationInput) {
    return this.appropriationService.revertAppropriation(input);
  }

  @Get(':saleId')
  @ApiOperation({
    summary: 'Consulta apropriação e documento contábil por ID de venda',
  })
  async getAppropriation(
    @Param('saleId') saleId: string,
    @Query('tenantId') tenantId = '00000000-0000-0000-0000-000000000001',
  ) {
    return this.appropriationService.getAppropriationBySaleId(tenantId, saleId);
  }

  @Post('simulate')
  @ApiOperation({
    summary: 'Cálculo determinístico de split ROUND_HALF_UP',
  })
  calculateSplit(
    @Body() payload: { grossAmount: string | number; feeRatePct: string | number },
  ) {
    const split = this.appropriationService.calculateSplit(
      payload.grossAmount,
      payload.feeRatePct,
    );
    return {
      grossAmount: split.grossAmount.toString(),
      diskAmount: split.diskAmount.toString(),
      producerAmount: split.producerAmount.toString(),
      rate: split.rate.toString(),
    };
  }
}
