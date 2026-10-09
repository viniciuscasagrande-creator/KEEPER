import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ContratosService, LegalContract, ContractStatus, ContratosMetrics } from './contratos.service';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Get('metrics')
  async getMetrics(): Promise<ContratosMetrics> {
    return this.contratosService.getMetrics();
  }

  @Get()
  async listContracts(): Promise<LegalContract[]> {
    return this.contratosService.listContracts();
  }

  @Get(':id')
  async getContractById(@Param('id') id: string): Promise<LegalContract> {
    return this.contratosService.getContractById(id);
  }

  @Post()
  async createContract(@Body() payload: Partial<LegalContract>): Promise<LegalContract> {
    return this.contratosService.createContract(payload);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ContractStatus,
  ): Promise<LegalContract> {
    return this.contratosService.updateStatus(id, status);
  }
}
