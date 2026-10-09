import { Injectable, Logger, OnModuleInit, OnModuleDestroy, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SentinelService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SentinelService.name);
  private interval?: ReturnType<typeof setInterval>;
  private checking = false;
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Worker separado recomendado para produção. Desativado por padrão para não
    // executar varreduras concorrentes em múltiplas instâncias da API.
    if (process.env.SENTINEL_INLINE_SCAN !== 'true') return;
    this.interval = setInterval(() => void this.scanAllTenants(), 60 * 60 * 1000);
  }
  onModuleDestroy() { if (this.interval) clearInterval(this.interval); }

  async scanAllTenants() {
    if (this.checking) return;
    this.checking = true;
    try {
      // Scans internos: isolamento estrito por tenant (sem usar IDs de requisição pública).
      const tenants = await this.prisma.eventWallet.findMany({
        distinct: ['tenantId'], select: { tenantId: true }, take: 500,
      });
      for (const { tenantId } of tenants) await this.scanTenant(tenantId);
    } catch (error) {
      this.logger.error('Falha na varredura Sentinel', error instanceof Error ? error.stack : String(error));
    } finally { this.checking = false; }
  }

  async scanTenant(tenantId: string) {
    const wallets = await this.prisma.eventWallet.findMany({
      where: { tenantId, balanceAvailable: { lt: 0 } },
      select: { id: true, eventId: true, eventName: true, balanceAvailable: true },
      take: 500,
    });
    for (const w of wallets) {
      const fingerprint = `NEGATIVE_EVENT_BALANCE:${w.id}`;
      const evidence = { eventId: w.eventId, eventWalletId: w.id, balanceAvailable: w.balanceAvailable.toString(), observedAt: new Date().toISOString() };
      await this.prisma.sentinelAlert.upsert({
        where: { tenantId_fingerprint: { tenantId, fingerprint } },
        create: { tenantId, fingerprint, module: 'FINANCEIRO_EVENTOS', severity: 'CRITICAL', title: 'Saldo disponível negativo',
          description: `A carteira ${w.eventName} possui saldo disponível negativo. Investigue lançamentos e reversões.`, sourceId: w.id, evidence },
        update: { evidence, status: 'OPEN', closedAt: null },
      });
    }
    // Alertas deixam de ser atuais quando a condição não é mais observada.
    // Marcar como resolvido automaticamente apagaria evidências ou decisões humanas;
    // por isso a resolução exige revisão de usuário autorizado.
    return { checked: wallets.length, detector: 'NEGATIVE_EVENT_BALANCE' };
  }

  list(tenantId: string, status?: string) {
    return this.prisma.sentinelAlert.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      orderBy: [{ updatedAt: 'desc' }], take: 200,
    });
  }
  async details(tenantId: string, id: string) {
    const alert = await this.prisma.sentinelAlert.findFirst({ where: { tenantId, id }, include: { events: { orderBy: { createdAt: 'desc' } } } });
    if (!alert) throw new NotFoundException('Ocorrência não encontrada');
    return alert;
  }
  async transition(tenantId: string, id: string, action: string, actorId: string, notes?: string) {
    const allowed: Record<string,string> = { ACKNOWLEDGE: 'ACKNOWLEDGED', INVESTIGATE: 'INVESTIGATING', RESOLVE: 'RESOLVED', REOPEN: 'OPEN' };
    const next = allowed[action];
    if (!next) throw new BadRequestException('Ação inválida');
    return this.prisma.$transaction(async tx => {
      const record = await tx.sentinelAlert.findFirst({ where: { tenantId, id } });
      if (!record) throw new NotFoundException('Ocorrência não encontrada');
      if (action === 'RESOLVE' && (!notes || notes.trim().length < 10)) throw new BadRequestException('Informe a justificativa da resolução');
      const alert = await tx.sentinelAlert.update({ where: { id }, data: { status: next, closedAt: next === 'RESOLVED' ? new Date() : null } });
      await tx.sentinelAlertEvent.create({ data: { alertId: id, actorId, action, notes } });
      return alert;
    });
  }
}
