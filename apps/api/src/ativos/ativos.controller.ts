import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { AtivosService, HardwareAsset, MaintenanceOrder, AssetStatus, AtivosMetrics } from './ativos.service';

@Controller('ativos')
export class AtivosController {
  constructor(private readonly ativosService: AtivosService) {}

  @Get('metrics')
  async getMetrics(): Promise<AtivosMetrics> {
    return this.ativosService.getMetrics();
  }

  @Get()
  async listAssets(): Promise<HardwareAsset[]> {
    return this.ativosService.listAssets();
  }

  @Get('orders')
  async listMaintenanceOrders(): Promise<MaintenanceOrder[]> {
    return this.ativosService.listMaintenanceOrders();
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string): Promise<HardwareAsset> {
    return this.ativosService.getAssetById(id);
  }

  @Post()
  async createAsset(@Body() payload: Partial<HardwareAsset>): Promise<HardwareAsset> {
    return this.ativosService.createAsset(payload);
  }

  @Post('orders')
  async createOrder(@Body() payload: Partial<MaintenanceOrder>): Promise<MaintenanceOrder> {
    return this.ativosService.createOrder(payload);
  }

  @Patch(':id/status')
  async updateAssetStatus(
    @Param('id') id: string,
    @Body('status') status: AssetStatus,
    @Body('location') location?: string,
  ): Promise<HardwareAsset> {
    return this.ativosService.updateAssetStatus(id, status, location);
  }
}
