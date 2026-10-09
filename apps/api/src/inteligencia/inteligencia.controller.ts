import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import {
  InteligenciaService,
  ScenarioSimulationInput,
} from './inteligencia.service';

@ApiTags('Inteligencia')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('inteligencia')
export class InteligenciaController {
  constructor(private readonly inteligenciaService: InteligenciaService) {}

  @Public()
  @Get('dashboard')
  @ApiOperation({
    summary: 'Consultar painel de inteligência executiva com dados consolidados da DiskIngressos',
  })
  getDashboard() {
    return this.inteligenciaService.getExecutiveDashboard();
  }

  @Public()
  @Get('executivo')
  @ApiOperation({
    summary: 'Alias para consultar dashboard executivo e KPIs consolidados',
  })
  getExecutivo() {
    return this.inteligenciaService.getExecutiveDashboard();
  }

  @Public()
  @Get('eventos-performance')
  @ApiOperation({
    summary: 'Consultar performance de vendas, ocupação e demanda dos eventos ativos',
  })
  getEventPerformance() {
    return this.inteligenciaService.getEventPerformance();
  }

  @Public()
  @Post('simular')
  @ApiOperation({
    summary: 'Simular cenários preditivos com variação de GMV, taxas e despesas',
  })
  simulateScenario(@Body() input: ScenarioSimulationInput) {
    return this.inteligenciaService.simulateScenario(input);
  }

  @Public()
  @Post('copilot-query')
  @ApiOperation({
    summary: 'Processar perguntas em linguagem natural para o assistente inteligente Keeper',
  })
  processCopilotQuery(@Body('query') query: string) {
    return this.inteligenciaService.processCopilotQuery(query || '');
  }
}
