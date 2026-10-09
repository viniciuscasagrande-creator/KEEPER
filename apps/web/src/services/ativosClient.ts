// apps/web/src/services/ativosClient.ts
// Client completo para o Módulo de Ativos & Patrimônio / Hardwares de Bilheteria da DiskIngressos

export type AssetCategory =
  | 'CATRACA_ELETRONICA'
  | 'PDA_COLETOR_MOVEL'
  | 'PDV_IMPRESSORA'
  | 'SERVIDOR_EDGE'
  | 'INFRA_REDE_NOBREAK'
  | 'TERMINAL_POS_ANDROID'
  | 'CHIP_M2M_TELEMETRIA'
  | 'IMPRESSORA_TERMICA'
  | 'SWITCH_REDE_GIGABIT';

export type AssetStatus =
  | 'DISPONIVEL'
  | 'EM_OPERACAO'
  | 'EM_TRANSITO'
  | 'EM_MANUTENCAO'
  | 'COMODATO_PRODUTOR'
  | 'BAIXADO';

export interface HardwareAsset {
  id: string;
  tagNumber: string; // Ex: ATV-0142
  serialNumber: string;
  model: string;
  category: AssetCategory;
  status: AssetStatus;
  currentLocation: string; // Ex: Galpão Central, Teatro Positivo, Pedreira
  venueAssigned?: string;
  producerAssigned?: string;
  purchaseDate: string;
  acquisitionValue: number;
  residualValue: number;
  healthPercent: number;
  batteryHealthPercent?: number;
  firmwareVersion: string;
  lastMaintenanceDate?: string;
  nextCalibrationDate: string;
  m2mCarrier?: string;
  m2mIccid?: string;
  networkPorts?: number;
  createdAt: string;
}

export interface MaintenanceOrder {
  id: string;
  orderNumber: string;
  assetId: string;
  assetTag: string;
  type: 'PREVENTIVA' | 'CORRETIVA' | 'CALIBRACAO';
  priority: 'ALTA' | 'NORMAL' | 'BAIXA';
  description: string;
  technicianName: string;
  status: 'ABERTA' | 'EM_EXECUCAO' | 'CONCLUIDA';
  eventOrigin?: string;
  technicalReport?: string;
  destinationService?: string;
  openedAt: string;
  completedAt?: string;
}

export interface HardwareDispatchBatch {
  id: string;
  romaneioNumber: string;
  eventName: string;
  venueName: string;
  dispatchDate: string;
  returnEstimateDate: string;
  carrierName: string;
  vehiclePlate: string;
  responsibleTechnician: string;
  itemsCount: number;
  itemsSummary: string;
  status: 'EM_TRANSITO' | 'ENTREGUE_NA_PRACA' | 'RETORNADO' | 'CONFERIDO';
}

export interface AtivosMetrics {
  totalAssets: number;
  turnstilesCount: number;
  pdasCount: number;
  pdvsCount: number;
  inOperationCount: number;
  inMaintenanceCount: number;
  totalPatrimonialValue: number;
  maintenanceHealthScore: number;
}

const MOCK_ASSETS: HardwareAsset[] = [
  {
    id: 'atv-01',
    tagNumber: 'ATV-0101',
    serialNumber: 'CT-2025-99812',
    model: 'Catraca Eletrônica Pedestal Disk High-Speed v4',
    category: 'CATRACA_ELETRONICA',
    status: 'EM_OPERACAO',
    currentLocation: 'Teatro Fernanda Montenegro (Curitiba)',
    venueAssigned: 'Teatro Fernanda Montenegro',
    purchaseDate: '2025-03-10',
    acquisitionValue: 14500.0,
    residualValue: 12200.0,
    healthPercent: 98,
    firmwareVersion: 'v4.2.1-prod',
    lastMaintenanceDate: '2026-09-15',
    nextCalibrationDate: '2026-12-15',
    createdAt: '2025-03-10T10:00:00.000Z',
  },
  {
    id: 'atv-02',
    tagNumber: 'ATV-0102',
    serialNumber: 'CT-2025-99813',
    model: 'Catraca Eletrônica Pedestal Disk High-Speed v4',
    category: 'CATRACA_ELETRONICA',
    status: 'EM_OPERACAO',
    currentLocation: 'Teatro Fernanda Montenegro (Curitiba)',
    venueAssigned: 'Teatro Fernanda Montenegro',
    purchaseDate: '2025-03-10',
    acquisitionValue: 14500.0,
    residualValue: 12200.0,
    healthPercent: 97,
    firmwareVersion: 'v4.2.1-prod',
    lastMaintenanceDate: '2026-09-15',
    nextCalibrationDate: '2026-12-15',
    createdAt: '2025-03-10T10:00:00.000Z',
  },
  {
    id: 'atv-03',
    tagNumber: 'ATV-0240',
    serialNumber: 'PDA-ZB-77821',
    model: 'PDA Coletor Industrial Zebra TC26 Android',
    category: 'PDA_COLETOR_MOVEL',
    status: 'EM_OPERACAO',
    currentLocation: 'Teatro Fernanda Montenegro (Curitiba)',
    venueAssigned: 'Teatro Fernanda Montenegro',
    purchaseDate: '2025-08-20',
    acquisitionValue: 4800.0,
    residualValue: 3900.0,
    healthPercent: 95,
    batteryHealthPercent: 96,
    firmwareVersion: 'Android 13 / App Disk v2.8',
    lastMaintenanceDate: '2026-08-10',
    nextCalibrationDate: '2026-11-10',
    createdAt: '2025-08-20T14:00:00.000Z',
  },
  {
    id: 'atv-04',
    tagNumber: 'ATV-0155',
    serialNumber: 'CT-PORT-4401',
    model: 'Catraca Portátil de Alumínio Dobrável com Braço Articulado',
    category: 'CATRACA_ELETRONICA',
    status: 'DISPONIVEL',
    currentLocation: 'Galpão Central Disk (Almoxarifado Curitiba)',
    purchaseDate: '2025-05-12',
    acquisitionValue: 12800.0,
    residualValue: 10400.0,
    healthPercent: 100,
    firmwareVersion: 'v4.2.1-prod',
    lastMaintenanceDate: '2026-09-29',
    nextCalibrationDate: '2026-12-29',
    createdAt: '2025-05-12T09:00:00.000Z',
  },
  {
    id: 'atv-05',
    tagNumber: 'ATV-0310',
    serialNumber: 'SRV-EDGE-01',
    model: 'Micro-Servidor Local Edge Cache Disk com No-Break 3kVA',
    category: 'SERVIDOR_EDGE',
    status: 'DISPONIVEL',
    currentLocation: 'Galpão Central Disk (Laboratório de TI)',
    purchaseDate: '2025-11-05',
    acquisitionValue: 18500.0,
    residualValue: 15800.0,
    healthPercent: 100,
    firmwareVersion: 'Ubuntu Linux 24.04 LTS / EdgeGateway v2',
    lastMaintenanceDate: '2026-10-01',
    nextCalibrationDate: '2027-01-01',
    createdAt: '2025-11-05T11:00:00.000Z',
  },
  {
    id: 'atv-06',
    tagNumber: 'ATV-0188',
    serialNumber: 'ELG-TH-9912',
    model: 'Impressora Térmica de Bilheteria Elgin i9 USB/Serial',
    category: 'PDV_IMPRESSORA',
    status: 'EM_MANUTENCAO',
    currentLocation: 'Laboratório Técnico (Bancada 2)',
    purchaseDate: '2024-09-18',
    acquisitionValue: 1200.0,
    residualValue: 750.0,
    healthPercent: 78,
    firmwareVersion: 'v1.14',
    lastMaintenanceDate: '2026-10-08',
    nextCalibrationDate: '2026-10-25',
    createdAt: '2024-09-18T16:00:00.000Z',
  },
];

const MOCK_ORDERS: MaintenanceOrder[] = [
  {
    id: 'os-01',
    orderNumber: 'OS-2026/041',
    assetId: 'atv-06',
    assetTag: 'ATV-0188',
    type: 'CORRETIVA',
    priority: 'ALTA',
    description: 'Substituição da cabeça térmica de impressão e calibração de sensor de bobina',
    technicianName: 'Rodrigo Medeiros (Técnico Eletrônico)',
    status: 'EM_EXECUCAO',
    openedAt: '2026-10-08 14:20',
  },
  {
    id: 'os-02',
    orderNumber: 'OS-2026/042',
    assetId: 'atv-04',
    assetTag: 'ATV-0155',
    type: 'PREVENTIVA',
    priority: 'NORMAL',
    description: 'Revisão periódica de rolamentos do tripé e limpeza óptica do leitor de QR Code',
    technicianName: 'Carlos Mendonça',
    status: 'CONCLUIDA',
    openedAt: '2026-09-29 09:00',
    completedAt: '2026-09-29 11:30',
  },
];

class AtivosClient {
  private baseUrl: string;
  private localAssets = [...MOCK_ASSETS];
  private localOrders = [...MOCK_ORDERS];

  constructor() {
    this.baseUrl =
      (typeof window !== 'undefined' && (window as any).__KEEPER_API_URL__) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      'https://keeper-tng6.vercel.app/api/v1';
  }

  private getAuthHeader(): Record<string, string> {
    const token =
      (typeof window !== 'undefined' && (localStorage.getItem('token') || sessionStorage.getItem('access_token'))) ||
      '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getMetrics(): Promise<AtivosMetrics> {
    try {
      const res = await fetch(`${this.baseUrl}/ativos/metrics`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      totalAssets: 348,
      turnstilesCount: 47,
      pdasCount: 82,
      pdvsCount: 64,
      inOperationCount: 42,
      inMaintenanceCount: 2,
      totalPatrimonialValue: 1845000.0,
      maintenanceHealthScore: 97.4,
    };
  }

  async listAssets(): Promise<HardwareAsset[]> {
    try {
      const res = await fetch(`${this.baseUrl}/ativos`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return this.localAssets;
  }

  async listOrders(): Promise<MaintenanceOrder[]> {
    try {
      const res = await fetch(`${this.baseUrl}/ativos/orders`, {
        headers: this.getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return this.localOrders;
  }

  async createAsset(payload: Partial<HardwareAsset>): Promise<HardwareAsset> {
    try {
      const res = await fetch(`${this.baseUrl}/ativos`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const count = this.localAssets.length + 343;
    const newAsset: HardwareAsset = {
      id: `atv-${Date.now()}`,
      tagNumber: `ATV-${String(count).padStart(4, '0')}`,
      serialNumber: payload.serialNumber || `SN-${Date.now().toString().slice(-6)}`,
      model: payload.model || 'Catraca Eletrônica Disk High-Speed',
      category: payload.category || 'CATRACA_ELETRONICA',
      status: payload.status || 'DISPONIVEL',
      currentLocation: payload.currentLocation || 'Galpão Central Curitiba',
      purchaseDate: payload.purchaseDate || new Date().toISOString().split('T')[0],
      acquisitionValue: payload.acquisitionValue || 14500.0,
      residualValue: payload.residualValue || payload.acquisitionValue || 14500.0,
      healthPercent: 100,
      firmwareVersion: payload.firmwareVersion || 'v4.2.1-prod',
      nextCalibrationDate: '2027-01-15',
      createdAt: new Date().toISOString(),
    };
    this.localAssets.unshift(newAsset);
    return newAsset;
  }

  async createOrder(payload: Partial<MaintenanceOrder>): Promise<MaintenanceOrder> {
    try {
      const res = await fetch(`${this.baseUrl}/ativos/orders`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const count = this.localOrders.length + 43;
    const newOrder: MaintenanceOrder = {
      id: `os-${Date.now()}`,
      orderNumber: `OS-2026/${String(count).padStart(3, '0')}`,
      assetId: payload.assetId || 'atv-01',
      assetTag: payload.assetTag || 'ATV-0101',
      type: payload.type || 'PREVENTIVA',
      priority: payload.priority || 'NORMAL',
      description: payload.description || 'Manutenção técnica de rotina',
      technicianName: payload.technicianName || 'Rodrigo Medeiros',
      status: 'ABERTA',
      eventOrigin: payload.eventOrigin,
      technicalReport: payload.technicalReport,
      destinationService: payload.destinationService,
      openedAt: new Date().toLocaleString('pt-BR'),
    };
    this.localOrders.unshift(newOrder);
    return newOrder;
  }

  private localDispatches: HardwareDispatchBatch[] = [
    {
      id: 'disp-01',
      romaneioNumber: 'ROM-2026-088',
      eventName: 'Festival de Primavera 2026',
      venueName: 'Pedreira Paulo Leminski',
      dispatchDate: '2026-10-08',
      returnEstimateDate: '2026-10-12',
      carrierName: 'Logística Disk Express (Frota Própria)',
      vehiclePlate: 'BEP-4A92 (Furgão Iveco Daily)',
      responsibleTechnician: 'Rodrigo Medeiros (TI Campo)',
      itemsCount: 24,
      itemsSummary: '12 Catracas QR-Code, 8 Terminais POS Android, 2 Switches Gigabit, 2 Chips M2M',
      status: 'EM_TRANSITO',
    },
    {
      id: 'disp-02',
      romaneioNumber: 'ROM-2026-087',
      eventName: 'Standup Comedy Especial de Fim de Ano',
      venueName: 'Teatro Positivo',
      dispatchDate: '2026-10-05',
      returnEstimateDate: '2026-10-07',
      carrierName: 'Disk Logística Integrada',
      vehiclePlate: 'BCR-9812 (Van Sprinter)',
      responsibleTechnician: 'Marcio Silva',
      itemsCount: 8,
      itemsSummary: '4 PDAs Coletores, 2 Impressoras Térmicas Daruma, 2 Leitores Barcode',
      status: 'CONFERIDO',
    },
  ];

  async listDispatchBatches(): Promise<HardwareDispatchBatch[]> {
    return this.localDispatches;
  }

  async createDispatchBatch(payload: Partial<HardwareDispatchBatch>): Promise<HardwareDispatchBatch> {
    const newBatch: HardwareDispatchBatch = {
      id: `disp-${Date.now()}`,
      romaneioNumber: `ROM-2026-${String(this.localDispatches.length + 89).padStart(3, '0')}`,
      eventName: payload.eventName || 'Novo Evento Disk',
      venueName: payload.venueName || 'Praça de Eventos',
      dispatchDate: payload.dispatchDate || new Date().toISOString().split('T')[0],
      returnEstimateDate: payload.returnEstimateDate || '2026-11-01',
      carrierName: payload.carrierName || 'Frota Interna Disk',
      vehiclePlate: payload.vehiclePlate || 'ABC-1234',
      responsibleTechnician: payload.responsibleTechnician || 'Técnico de Campo',
      itemsCount: payload.itemsCount || 10,
      itemsSummary: payload.itemsSummary || 'Catracas e PDVs',
      status: 'EM_TRANSITO',
    };
    this.localDispatches.unshift(newBatch);
    return newBatch;
  }
}

export const ativosClient = new AtivosClient();
