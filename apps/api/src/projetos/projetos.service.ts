import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export type EventProjectStatus =
  | 'PLANEJAMENTO'
  | 'MONTAGEM'
  | 'EM_OPERACAO'
  | 'DESMOBILIZACAO'
  | 'CONCLUIDO';

export type VenueType =
  | 'TEATRO'
  | 'ARENA_ABERTA'
  | 'CASA_SHOWS'
  | 'ESTADIO'
  | 'CENTRO_CONVENCOES';

export interface GateAccessPoint {
  gateId: string;
  name: string;
  turnstilesCount: number;
  expectedAudience: number;
  currentCheckins: number;
  throughputPerHour: number;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
}

export interface TechnicalLink {
  provider: string;
  linkType: 'FIBRA_DEDICADA' | 'STARLINK_SATELITE' | 'BACKUP_5G';
  bandwidthMbps: number;
  latencyMs: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
}

export interface EventProject {
  id: string;
  code: string;
  title: string;
  venueName: string;
  venueType: VenueType;
  eventDate: string;
  doorsOpenTime: string;
  expectedAudience: number;
  actualCheckins: number;
  status: EventProjectStatus;
  leadCoordinator: string;
  staffAssignedCount: number;
  turnstilesTotal: number;
  pdvsTotal: number;
  firefightersClearance: boolean;
  cityHallPermit: boolean;
  contingencyServerReady: boolean;
  gates: GateAccessPoint[];
  links: TechnicalLink[];
  createdAt: string;
}

export interface ProjetosMetrics {
  totalProjects: number;
  liveEventsToday: number;
  turnstilesDeployed: number;
  staffInField: number;
  avgValidationSpeedSec: number;
  firefightersApprovedPercent: number;
  totalCheckinsToday: number;
}

const SEED_PROJECTS: EventProject[] = [
  {
    id: 'proj-01',
    code: 'PRJ-2026/088',
    title: 'Turnê MPB Clássicos 2026 — 2 Noites no Teatro Positivo',
    venueName: 'Teatro Positivo (Grande Auditório)',
    venueType: 'TEATRO',
    eventDate: '2026-11-20',
    doorsOpenTime: '19:00',
    expectedAudience: 2400,
    actualCheckins: 0,
    status: 'PLANEJAMENTO',
    leadCoordinator: 'Marcio Silva (Coord. Geral Operações)',
    staffAssignedCount: 14,
    turnstilesTotal: 6,
    pdvsTotal: 4,
    firefightersClearance: true,
    cityHallPermit: true,
    contingencyServerReady: true,
    gates: [
      { gateId: 'G1', name: 'Portão Principal Plateia', turnstilesCount: 4, expectedAudience: 1800, currentCheckins: 0, throughputPerHour: 620, status: 'ONLINE' },
      { gateId: 'G2', name: 'Portão Mezanino & Acessibilidade', turnstilesCount: 2, expectedAudience: 600, currentCheckins: 0, throughputPerHour: 340, status: 'ONLINE' },
    ],
    links: [
      { provider: 'Copel Telecom Fibra', linkType: 'FIBRA_DEDICADA', bandwidthMbps: 500, latencyMs: 4, status: 'OPERATIONAL' },
      { provider: 'Starlink Satélite Gen 3', linkType: 'STARLINK_SATELITE', bandwidthMbps: 220, latencyMs: 28, status: 'OPERATIONAL' },
    ],
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'proj-02',
    code: 'PRJ-2026/092',
    title: 'Festival Sertanejo Curitiba Prime — Mega Estrutura Pedreira',
    venueName: 'Pedreira Paulo Leminski',
    venueType: 'ARENA_ABERTA',
    eventDate: '2026-12-12',
    doorsOpenTime: '14:00',
    expectedAudience: 22500,
    actualCheckins: 0,
    status: 'MONTAGEM',
    leadCoordinator: 'Luciano Ferraz (Especialista Infra de Grandes Eventos)',
    staffAssignedCount: 68,
    turnstilesTotal: 28,
    pdvsTotal: 18,
    firefightersClearance: true,
    cityHallPermit: true,
    contingencyServerReady: true,
    gates: [
      { gateId: 'G-PISTA', name: 'Portão Geral Pista (Entrada Pedreira)', turnstilesCount: 14, expectedAudience: 14000, currentCheckins: 0, throughputPerHour: 780, status: 'ONLINE' },
      { gateId: 'G-PREMIUM', name: 'Portão Front Stage / Área VIP', turnstilesCount: 8, expectedAudience: 6500, currentCheckins: 0, throughputPerHour: 650, status: 'ONLINE' },
      { gateId: 'G-CAMAROTE', name: 'Portão Camarotes & Imprensa', turnstilesCount: 6, expectedAudience: 2000, currentCheckins: 0, throughputPerHour: 480, status: 'ONLINE' },
    ],
    links: [
      { provider: 'Claro Fibra Dedicada 1Gbps', linkType: 'FIBRA_DEDICADA', bandwidthMbps: 1000, latencyMs: 6, status: 'OPERATIONAL' },
      { provider: 'Starlink Satélite Redundante', linkType: 'STARLINK_SATELITE', bandwidthMbps: 250, latencyMs: 32, status: 'OPERATIONAL' },
      { provider: 'Vivo 5G Industrial Failover', linkType: 'BACKUP_5G', bandwidthMbps: 180, latencyMs: 18, status: 'OPERATIONAL' },
    ],
    createdAt: '2026-10-05T14:30:00.000Z',
  },
  {
    id: 'proj-03',
    code: 'PRJ-2026/079',
    title: 'Noite de Comédia Stand-Up & Gravação Especial',
    venueName: 'Teatro Fernanda Montenegro',
    venueType: 'TEATRO',
    eventDate: '2026-10-09',
    doorsOpenTime: '20:00',
    expectedAudience: 520,
    actualCheckins: 488,
    status: 'EM_OPERACAO',
    leadCoordinator: 'Renata Albuquerque (Supervisora Operacional)',
    staffAssignedCount: 6,
    turnstilesTotal: 3,
    pdvsTotal: 2,
    firefightersClearance: true,
    cityHallPermit: true,
    contingencyServerReady: true,
    gates: [
      { gateId: 'G-UNICO', name: 'Foyer Principal & Catracas', turnstilesCount: 3, expectedAudience: 520, currentCheckins: 488, throughputPerHour: 510, status: 'ONLINE' },
    ],
    links: [
      { provider: 'Fibra Local Shopping Novo Batel', linkType: 'FIBRA_DEDICADA', bandwidthMbps: 300, latencyMs: 5, status: 'OPERATIONAL' },
      { provider: 'Claro 5G Móvel Disk', linkType: 'BACKUP_5G', bandwidthMbps: 140, latencyMs: 22, status: 'OPERATIONAL' },
    ],
    createdAt: '2026-09-28T08:00:00.000Z',
  },
  {
    id: 'proj-04',
    code: 'PRJ-2026/065',
    title: 'Turnê Rock Sinfônico Internacional — Live Curitiba',
    venueName: 'Live Curitiba',
    venueType: 'CASA_SHOWS',
    eventDate: '2026-11-28',
    doorsOpenTime: '21:00',
    expectedAudience: 4200,
    actualCheckins: 0,
    status: 'PLANEJAMENTO',
    leadCoordinator: 'Marcio Silva (Coord. Geral Operações)',
    staffAssignedCount: 22,
    turnstilesTotal: 10,
    pdvsTotal: 6,
    firefightersClearance: true,
    cityHallPermit: true,
    contingencyServerReady: true,
    gates: [
      { gateId: 'G-PISTA', name: 'Entrada Principal Live', turnstilesCount: 6, expectedAudience: 3000, currentCheckins: 0, throughputPerHour: 710, status: 'ONLINE' },
      { gateId: 'G-MEZANINO', name: 'Mezanino & Mesas', turnstilesCount: 4, expectedAudience: 1200, currentCheckins: 0, throughputPerHour: 450, status: 'ONLINE' },
    ],
    links: [
      { provider: 'GVT/Vivo Fibra Corporativa', linkType: 'FIBRA_DEDICADA', bandwidthMbps: 600, latencyMs: 7, status: 'OPERATIONAL' },
      { provider: 'Starlink Satélite', linkType: 'STARLINK_SATELITE', bandwidthMbps: 200, latencyMs: 35, status: 'OPERATIONAL' },
    ],
    createdAt: '2026-10-02T16:00:00.000Z',
  },
];

@Injectable()
export class ProjetosService {
  private projects = [...SEED_PROJECTS];

  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(): Promise<ProjetosMetrics> {
    const liveEventsToday = this.projects.filter((p) => p.status === 'EM_OPERACAO').length;
    const turnstilesDeployed = this.projects.reduce((acc, p) => acc + p.turnstilesTotal, 0);
    const staffInField = this.projects.reduce((acc, p) => acc + p.staffAssignedCount, 0);
    const totalCheckinsToday = this.projects.reduce((acc, p) => acc + p.actualCheckins, 0);

    return {
      totalProjects: this.projects.length + 18,
      liveEventsToday,
      turnstilesDeployed,
      staffInField,
      avgValidationSpeedSec: 0.65,
      firefightersApprovedPercent: 100.0,
      totalCheckinsToday: totalCheckinsToday > 0 ? totalCheckinsToday : 488,
    };
  }

  async listProjects(): Promise<EventProject[]> {
    return this.projects;
  }

  async getProjectById(id: string): Promise<EventProject> {
    const found = this.projects.find((p) => p.id === id);
    if (!found) throw new Error(`Projeto ${id} não encontrado`);
    return found;
  }

  async createProject(payload: Partial<EventProject>): Promise<EventProject> {
    const count = this.projects.length + 95;
    const newPrj: EventProject = {
      id: `proj-${Date.now()}`,
      code: `PRJ-2026/${String(count).padStart(3, '0')}`,
      title: payload.title || 'Novo Projeto de Operação de Show',
      venueName: payload.venueName || 'Teatro Positivo',
      venueType: payload.venueType || 'TEATRO',
      eventDate: payload.eventDate || new Date().toISOString().split('T')[0],
      doorsOpenTime: payload.doorsOpenTime || '19:00',
      expectedAudience: payload.expectedAudience || 2000,
      actualCheckins: 0,
      status: payload.status || 'PLANEJAMENTO',
      leadCoordinator: payload.leadCoordinator || 'Marcio Silva (Coord. Geral Operações)',
      staffAssignedCount: payload.staffAssignedCount || 10,
      turnstilesTotal: payload.turnstilesTotal || 6,
      pdvsTotal: payload.pdvsTotal || 4,
      firefightersClearance: true,
      cityHallPermit: true,
      contingencyServerReady: true,
      gates: [
        {
          gateId: 'G1',
          name: 'Portão Principal',
          turnstilesCount: payload.turnstilesTotal || 6,
          expectedAudience: payload.expectedAudience || 2000,
          currentCheckins: 0,
          throughputPerHour: 600,
          status: 'ONLINE',
        },
      ],
      links: [
        { provider: 'Fibra Óptica Dedicada', linkType: 'FIBRA_DEDICADA', bandwidthMbps: 500, latencyMs: 5, status: 'OPERATIONAL' },
        { provider: 'Starlink Satélite', linkType: 'STARLINK_SATELITE', bandwidthMbps: 220, latencyMs: 28, status: 'OPERATIONAL' },
      ],
      createdAt: new Date().toISOString(),
    };
    this.projects.unshift(newPrj);
    return newPrj;
  }

  async updateStatus(id: string, status: EventProjectStatus): Promise<EventProject> {
    const prj = await this.getProjectById(id);
    prj.status = status;
    return prj;
  }
}
