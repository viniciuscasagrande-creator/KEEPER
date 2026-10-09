import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ProjetosService, EventProject, EventProjectStatus, ProjetosMetrics } from './projetos.service';

@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Get('metrics')
  async getMetrics(): Promise<ProjetosMetrics> {
    return this.projetosService.getMetrics();
  }

  @Get()
  async listProjects(): Promise<EventProject[]> {
    return this.projetosService.listProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<EventProject> {
    return this.projetosService.getProjectById(id);
  }

  @Post()
  async createProject(@Body() payload: Partial<EventProject>): Promise<EventProject> {
    return this.projetosService.createProject(payload);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: EventProjectStatus,
  ): Promise<EventProject> {
    return this.projetosService.updateStatus(id, status);
  }
}
