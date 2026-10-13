import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CnabService } from './cnab.service';
import { GenerateCnabRemessaDto, ParseCnabRetornoDto } from './cnab.dto';

@ApiTags('Financeiro - CNAB Bancário')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-company-id',
  required: false,
  description: 'ID da empresa ativa no contexto operacional (UUID)',
})
@Controller('financeiro/cnab')
export class CnabController {
  constructor(private readonly cnabService: CnabService) {}

  private getEffectiveCompanyId(headerCompanyId?: string, userCompanyId?: string): string {
    return headerCompanyId || userCompanyId || '00000000-0000-0000-0000-000000000001';
  }

  @Get('banks')
  @RequirePermissions('financeiro.relatorios.visualizar')
  @ApiOperation({ summary: 'Listar bancos homologados para remessa e retorno CNAB 240 / 400' })
  getSupportedBanks() {
    return [
      {
        code: '341',
        name: 'Banco Itaú S.A.',
        layouts: ['CNAB240', 'CNAB400'],
        pixPaymentSupported: true,
        tedPaymentSupported: true,
        boletoSupported: true,
        escrowHomologated: true,
      },
      {
        code: '237',
        name: 'Banco Bradesco S.A.',
        layouts: ['CNAB240', 'CNAB400'],
        pixPaymentSupported: true,
        tedPaymentSupported: true,
        boletoSupported: true,
        escrowHomologated: true,
      },
      {
        code: '033',
        name: 'Banco Santander (Brasil) S.A.',
        layouts: ['CNAB240'],
        pixPaymentSupported: true,
        tedPaymentSupported: true,
        boletoSupported: true,
        escrowHomologated: false,
      },
      {
        code: '001',
        name: 'Banco do Brasil S.A.',
        layouts: ['CNAB240'],
        pixPaymentSupported: true,
        tedPaymentSupported: true,
        boletoSupported: true,
        escrowHomologated: false,
      },
    ];
  }

  @Post('remessa')
  @RequirePermissions('financeiro.titulos.editar')
  @ApiOperation({ summary: 'Gerar arquivo de remessa CNAB 240 ou CNAB 400 para pagamento de fornecedores ou repasses a produtores' })
  async generateRemessa(
    @CurrentTenant() tenantId: string,
    @Body() dto: GenerateCnabRemessaDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.cnabService.generateRemessa(tenantId, effectiveCompanyId, dto);
  }

  @Post('retorno')
  @RequirePermissions('financeiro.titulos.liquidar')
  @ApiOperation({ summary: 'Processar arquivo de retorno CNAB 240 ou 400 para conciliação e liquidação automática de repasses/títulos' })
  async parseRetorno(
    @CurrentTenant() tenantId: string,
    @Body() dto: ParseCnabRetornoDto,
    @Headers('x-company-id') companyId?: string,
    @CurrentUser('companyId') userCompanyId?: string,
  ) {
    const effectiveCompanyId = this.getEffectiveCompanyId(companyId, userCompanyId);
    return this.cnabService.parseRetorno(tenantId, effectiveCompanyId, dto);
  }
}
