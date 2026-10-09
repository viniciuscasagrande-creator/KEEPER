import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Boxes,
  Cpu,
  Wrench,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  BatteryCharging,
  QrCode,
  Sliders,
  DollarSign,
  ShieldCheck,
  Server,
  FileCheck,
  ChevronRight,
  HardDrive,
  Laptop,
  X,
  Check,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import {
  ativosClient,
  HardwareAsset,
  MaintenanceOrder,
  AtivosMetrics,
  AssetCategory,
  AssetStatus,
} from '../../services/ativosClient';

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export interface AtvSubmenuDef {
  id: string;
  label: string;
  group: string;
  icon: any;
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const ATV_SUBMENUS: AtvSubmenuDef[] = [
  // 1. Visão Geral & Gestão Patrimonial (4)
  {
    id: 'atv-dashboard',
    label: 'Dashboard Executivo do Imobilizado',
    group: 'Visão Geral & Gestão Patrimonial',
    icon: TrendingUp,
    purpose: 'Status global do parque tecnológico, disponibilidade e valor residual.',
    badge: 'Painel',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'atv-inventario-geral',
    label: 'Inventário Consolidado de Ativos',
    group: 'Visão Geral & Gestão Patrimonial',
    icon: Package,
    purpose: 'Base cadastral com plaquetação, tags RFID e número de série.',
    badge: '348 Ativos',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'atv-tombamento',
    label: 'Tombamento & Plaquetação',
    group: 'Visão Geral & Gestão Patrimonial',
    icon: QrCode,
    purpose: 'Entrada de novos equipamentos, emissão de etiquetas e código de barras.',
  },
  {
    id: 'atv-depreciacao',
    label: 'Depreciação Contábil & Vida Útil',
    group: 'Visão Geral & Gestão Patrimonial',
    icon: DollarSign,
    purpose: 'Cálculo de depreciação mensal conforme normas fiscais e contábeis.',
  },

  // 2. Hardwares de Bilheteria & Portaria (4)
  {
    id: 'atv-catracas',
    label: 'Catracas Eletrônicas & Pedestais',
    group: 'Hardwares de Bilheteria & Portaria',
    icon: Cpu,
    purpose: 'Catracas portáteis e fixas de alta vazão para grandes arenas.',
    badge: '47 Unid.',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'atv-pdas-coletores',
    label: 'PDAs Industriais & Coletores Móveis',
    group: 'Hardwares de Bilheteria & Portaria',
    icon: Laptop,
    purpose: 'Aparelhos móveis Android Zebra/Honeywell com leitor 2D de alta densidade.',
    badge: '82 Unid.',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'atv-pdvs-impressoras',
    label: 'PDVs de Bilheteria & Impressoras',
    group: 'Hardwares de Bilheteria & Portaria',
    icon: HardDrive,
    purpose: 'Terminais de venda física e impressoras térmicas Daruma/Elgin.',
  },
  {
    id: 'atv-servidores-edge',
    label: 'Servidores Edge & Infra de Conectividade',
    group: 'Hardwares de Bilheteria & Portaria',
    icon: Server,
    purpose: 'Micro-servidores locais de contingência e no-breaks senoidais.',
  },

  // 3. Localização, Custódia & Movimentações (4)
  {
    id: 'atv-movimentacoes',
    label: 'Controle de Saídas & Retornos (Romaneio)',
    group: 'Localização, Custódia & Movimentações',
    icon: MapPin,
    purpose: 'Romaneios de transporte com leitor de código de barras para eventos.',
  },
  {
    id: 'atv-localizacao-tempo-real',
    label: 'Rastreamento por Venue & Galpão',
    group: 'Localização, Custódia & Movimentações',
    icon: MapPin,
    purpose: 'Localização em tempo real: Galpão Central, Pedreira, Teatro Positivo.',
  },
  {
    id: 'atv-comodatos',
    label: 'Termos de Comodato para Produtoras',
    group: 'Localização, Custódia & Movimentações',
    icon: FileCheck,
    purpose: 'Cessão temporária de equipamentos com termo de responsabilidade.',
    badge: 'Comodatos',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'atv-seguros-apolices',
    label: 'Apólices de Seguro contra Danos & Furto',
    group: 'Localização, Custódia & Movimentações',
    icon: ShieldCheck,
    purpose: 'Gestão de seguros patrimoniais para eventos externos.',
  },

  // 4. Manutenção Técnica & Ordens de Serviço (4)
  {
    id: 'atv-ordens-servico',
    label: 'Central de Ordens de Serviço (OS)',
    group: 'Manutenção Técnica & Ordens de Serviço',
    icon: Wrench,
    purpose: 'Abertura e acompanhamento de reparos preventivos e corretivos.',
    badge: '2 Abertas',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'atv-preventiva',
    label: 'Plano de Manutenção Preventiva',
    group: 'Manutenção Técnica & Ordens de Serviço',
    icon: CheckCircle2,
    purpose: 'Cronograma periódico de lubrificação, alinhamento e calibração óptica.',
  },
  {
    id: 'atv-baterias-pecas',
    label: 'Baterias & Peças de Reposição',
    group: 'Manutenção Técnica & Ordens de Serviço',
    icon: BatteryCharging,
    purpose: 'Gestão de ciclos de bateria de PDAs e cabeças de impressão térmica.',
  },
  {
    id: 'atv-laboratorio',
    label: 'Laboratório Técnico & Bancada',
    group: 'Manutenção Técnica & Ordens de Serviço',
    icon: Cpu,
    purpose: 'Testes de bancada e diagnóstico eletrônico de placas controladoras.',
  },

  // 5. Insumos & Suprimentos de Bilheteria (4)
  {
    id: 'atv-bobinas-termicas',
    label: 'Bobinas Térmicas de Segurança',
    group: 'Insumos & Suprimentos de Bilheteria',
    icon: Boxes,
    purpose: 'Papel térmico especial com tarja holográfica anti-fraude.',
  },
  {
    id: 'atv-pulseiras-rfid',
    label: 'Pulseiras RFID & Ingressos Holográficos',
    group: 'Insumos & Suprimentos de Bilheteria',
    icon: QrCode,
    purpose: 'Controle de lote de pulseiras para camarotes e áreas VIP.',
  },
  {
    id: 'atv-crachas-cordoes',
    label: 'Crachás de Produção & Cordões Disk',
    group: 'Insumos & Suprimentos de Bilheteria',
    icon: Layers,
    purpose: 'Insumos térmicos para identificação de staff e imprensa.',
  },
  {
    id: 'atv-estoque-minimo',
    label: 'Alertas de Estoque Mínimo de Insumos',
    group: 'Insumos & Suprimentos de Bilheteria',
    icon: AlertTriangle,
    purpose: 'Gatilhos automáticos de compra para reposição de suprimentos.',
  },

  // 6. Governança Patrimonial & Auditoria (4)
  {
    id: 'atv-auditoria-inventario',
    label: 'Auditoria Física de Inventário (RFID)',
    group: 'Governança Patrimonial & Auditoria',
    icon: ShieldCheck,
    purpose: 'Leitura em massa por radiofrequência para conciliação física.',
    badge: 'Imutável',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'atv-baixas-sinistros',
    label: 'Termos de Baixa, Sucata & Sinistros',
    group: 'Governança Patrimonial & Auditoria',
    icon: AlertTriangle,
    purpose: 'Processo formal de descarte e baixa patrimonial com laudo técnico.',
  },
  {
    id: 'atv-relatorios-patrimoniais',
    label: 'Relatórios Fiscais do Imobilizado',
    group: 'Governança Patrimonial & Auditoria',
    icon: FileCheck,
    purpose: 'Demonstrativos para auditoria contábil e balanço patrimonial.',
  },
  {
    id: 'atv-config',
    label: 'Configurações de Ativos & Depreciação',
    group: 'Governança Patrimonial & Auditoria',
    icon: Sliders,
    purpose: 'Taxas anuais, prazos de garantia e categorias de equipamentos.',
  },
];

export const AtivosModuleView: React.FC<Props> = ({
  activeSection,
  onSelectSection,
}) => {
  const [metrics, setMetrics] = useState<AtivosMetrics | null>(null);
  const [assets, setAssets] = useState<HardwareAsset[]>([]);
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionId, setSectionId] = useState<string>(activeSection || 'atv-dashboard');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync activeSection with internal sectionId
  useEffect(() => {
    if (activeSection) {
      setSectionId(activeSection);
    }
  }, [activeSection]);

  const handleSelectSection = (id: string) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSubmenu = useMemo(() => {
    return ATV_SUBMENUS.find((s) => s.id === sectionId) || ATV_SUBMENUS[0];
  }, [sectionId]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'inventario' | 'catracas' | 'manutencao' | 'movimentacoes' | 'insumos' | 'tombamento' | 'depreciacao'
  >('inventario');

  // Search & Filter
  const [submenuSearch, setSubmenuSearch] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [assetSearch, setAssetSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  // Modals
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<HardwareAsset | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Forms
  const [newAssetForm, setNewAssetForm] = useState({
    model: '',
    serialNumber: '',
    category: 'CATRACA_ELETRONICA' as AssetCategory,
    currentLocation: 'Galpão Central Curitiba',
    acquisitionValue: 14500.0,
    firmwareVersion: 'v4.2.1-prod',
  });

  const [newOrderForm, setNewOrderForm] = useState({
    assetId: '',
    type: 'PREVENTIVA' as const,
    priority: 'NORMAL' as const,
    description: '',
    technicianName: 'Rodrigo Medeiros',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, a, o] = await Promise.all([
        ativosClient.getMetrics(),
        ativosClient.listAssets(),
        ativosClient.listOrders(),
      ]);
      setMetrics(m);
      setAssets(a);
      setOrders(o);
      if (a.length > 0 && !newOrderForm.assetId) {
        setNewOrderForm((prev) => ({ ...prev, assetId: a[0].id }));
      }
    } catch (err) {
      console.error('Erro ao carregar dados de ativos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync activeSection with tabs
  useEffect(() => {
    if (!activeSection) return;
    if (activeSection === 'atv-dashboard' || activeSection === 'atv-inventario-geral' || activeSection === 'atv-tombamento') setActiveTab('inventario');
    else if (activeSection === 'atv-catracas' || activeSection === 'atv-pdas-coletores' || activeSection === 'atv-servidores-edge') setActiveTab('catracas');
    else if (activeSection === 'atv-ordens-servico' || activeSection === 'atv-preventiva' || activeSection === 'atv-laboratorio') setActiveTab('manutencao');
    else if (activeSection === 'atv-movimentacoes' || activeSection === 'atv-localizacao-tempo-real' || activeSection === 'atv-comodatos') setActiveTab('movimentacoes');
    else if (activeSection === 'atv-bobinas-termicas' || activeSection === 'atv-pulseiras-rfid') setActiveTab('insumos');
  }, [activeSection]);

  const groups = useMemo(() => {
    const list = Array.from(new Set(ATV_SUBMENUS.map((s) => s.group)));
    return ['todos', ...list];
  }, []);

  const filteredSubmenus = useMemo(() => {
    return ATV_SUBMENUS.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.purpose.toLowerCase().includes(submenuSearch.toLowerCase()) ||
        item.group.toLowerCase().includes(submenuSearch.toLowerCase());
      const matchesGroup = selectedGroup === 'todos' || item.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [submenuSearch, selectedGroup]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesText =
        a.tagNumber.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.model.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase()) ||
        a.currentLocation.toLowerCase().includes(assetSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'TODAS' || a.category === categoryFilter;
      return matchesText && matchesCategory;
    });
  }, [assets, assetSearch, categoryFilter]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await ativosClient.createAsset(newAssetForm);
      setAssets((prev) => [created, ...prev]);
      setIsNewAssetModalOpen(false);
      setNewAssetForm({
        model: '',
        serialNumber: '',
        category: 'CATRACA_ELETRONICA',
        currentLocation: 'Galpão Central Curitiba',
        acquisitionValue: 14500.0,
        firmwareVersion: 'v4.2.1-prod',
      });
    } catch (err) {
      console.error('Erro ao cadastrar ativo:', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const asset = assets.find((a) => a.id === newOrderForm.assetId);
      const created = await ativosClient.createOrder({
        ...newOrderForm,
        assetTag: asset ? asset.tagNumber : 'ATV-0101',
      });
      setOrders((prev) => [created, ...prev]);
      setIsNewOrderModalOpen(false);
      setNewOrderForm({
        assetId: assets[0]?.id || '',
        type: 'PREVENTIVA',
        priority: 'NORMAL',
        description: '',
        technicianName: 'Rodrigo Medeiros',
      });
    } catch (err) {
      console.error('Erro ao abrir OS:', err);
    }
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const renderInventarioTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por plaqueta (ATV-), serial ou modelo..."
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="TODAS">Todas as Categorias</option>
            <option value="CATRACA_ELETRONICA">Catracas Eletrônicas</option>
            <option value="PDA_COLETOR_MOVEL">PDAs & Coletores</option>
            <option value="PDV_IMPRESSORA">PDVs & Impressoras</option>
            <option value="SERVIDOR_EDGE">Servidores Edge</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Exibindo <strong>{filteredAssets.length}</strong> de <strong>{assets.length}</strong> hardwares
          </span>
          <button
            onClick={() => setIsNewAssetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Tabela de Ativos */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Plaqueta / Serial</th>
              <th className="py-3 px-4">Modelo do Hardware</th>
              <th className="py-3 px-4">Localização Atual</th>
              <th className="py-3 px-4">Valor Residual</th>
              <th className="py-3 px-4">Saúde Técnica</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono font-bold text-blue-700">{a.tagNumber}</div>
                  <div className="text-[11px] text-slate-500">SN: {a.serialNumber}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{a.model}</div>
                  <span className="text-[10px] text-slate-500">{a.category.replace('_', ' ')}</span>
                </td>

                <td className="py-3 px-4">
                  <div className="text-slate-900 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{a.currentLocation}</span>
                  </div>
                </td>

                <td className="py-3 px-4 font-bold text-slate-900">
                  {formatBRL(a.residualValue)}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{a.healthPercent}%</span>
                    {a.batteryHealthPercent && (
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        (Bat: {a.batteryHealthPercent}%)
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      a.status === 'EM_OPERACAO'
                        ? 'bg-emerald-100 text-emerald-800'
                        : a.status === 'DISPONIVEL'
                        ? 'bg-blue-100 text-blue-800'
                        : a.status === 'EM_MANUTENCAO'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {a.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedAsset(a);
                      setIsDetailsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver ficha técnica"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCatracasTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Catracas Portáteis (Grandes Arenas)</span>
            <Cpu className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">32 Unidades</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Estrutura metálica com rodízios de borracha para rápida implantação na Pedreira Paulo Leminski e Live Curitiba.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Catracas Fixas (Teatros Parceiros)</span>
            <Lock className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">15 Unidades</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equipamentos fixados no solo com passagem subterrânea de dados e energia nos Teatros Positivo e Fernanda Montenegro.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Reserva Técnica Almoxarifado</span>
            <Boxes className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">5 Unidades</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Prontas para despacho imediato em van operacional em caso de contingência ou pico não previsto de público.
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Plaqueta</th>
              <th className="py-3 px-4">Modelo</th>
              <th className="py-3 px-4">Firmware</th>
              <th className="py-3 px-4">Local Atual</th>
              <th className="py-3 px-4">Saúde</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.filter((a) => a.category === 'CATRACA_ELETRONICA').map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">{a.tagNumber}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{a.model}</td>
                <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{a.firmwareVersion}</td>
                <td className="py-3 px-4 text-slate-800">{a.currentLocation}</td>
                <td className="py-3 px-4 font-bold text-emerald-700">{a.healthPercent}%</td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    a.status === 'EM_OPERACAO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManutencaoTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Central de Ordens de Serviço (OS) & Manutenção Técnica
          </h3>
          <p className="text-xs text-slate-500">
            Manutenções preventivas, calibração óptica e reparos eletrônicos de bancada
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova O.S.</span>
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Nº O.S. / Tipo</th>
              <th className="py-3 px-4">Plaqueta do Equipamento</th>
              <th className="py-3 px-4">Descrição do Serviço / Diagnóstico</th>
              <th className="py-3 px-4">Técnico Responsável</th>
              <th className="py-3 px-4">Data Abertura</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{o.orderNumber}</div>
                  <span className={`text-[10px] font-bold ${
                    o.type === 'CORRETIVA' ? 'text-rose-600' : 'text-blue-600'
                  }`}>
                    {o.type}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-blue-700">
                  {o.assetTag}
                </td>

                <td className="py-3 px-4 text-slate-700 max-w-md">
                  {o.description}
                </td>

                <td className="py-3 px-4 font-medium text-slate-900">
                  {o.technicianName}
                </td>

                <td className="py-3 px-4 text-slate-500">
                  {o.openedAt}
                </td>

                <td className="py-3 px-4 text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      o.status === 'CONCLUIDA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {o.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMovimentacoesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Rastreabilidade, Romaneios & Comodatos em Praças
          </h3>
          <p className="text-xs text-slate-500">
            Distribuição de hardwares em arenas e contratos de cessão de uso com casas de espetáculos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Pedreira Paulo Leminski</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              32 Catracas + 4 Servidores Edge
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>Romaneio de Carga: <strong>#ROM-2026-088</strong> (Despachado em 24/11/2026)</div>
            <div>Responsável no Local: <strong>Luciano Ferraz (Coord. Geral)</strong></div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Teatro Positivo (Grande Auditório)</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
              10 Catracas Fixas (Comodato)
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>Contrato de Cessão: <strong>#COM-TP-2024/09</strong></div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Vigente até Dez/2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsumosTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Estoque de Insumos Críticos de Bilheteria
          </h3>
          <p className="text-xs text-slate-500">
            Bobinas térmicas de segurança, pulseiras RFID e crachás de produção
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-bold text-slate-900">Bobinas Térmicas com Holograma</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1.450 rolos</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Estoque suficiente para 6 meses</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-bold text-slate-900">Pulseiras RFID / NFC à Prova d'Água</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">38.000 unid.</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">Lotes camarote e área VIP</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs font-bold text-slate-900">Crachás Térmicos de Produção</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">5.200 unid.</div>
          <div className="text-[11px] text-slate-600 font-semibold mt-1">Identificação staff e credenciamento</div>
        </div>
      </div>
    </div>
  );

  const renderTombamentoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Plaquetados este mês</span>
          <div className="text-2xl font-black text-slate-900 mt-2">18 Ativos</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Etiquetas QR Code resinadas</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aguardando Plaquetação</span>
          <div className="text-2xl font-black text-blue-700 mt-2">0 Pendências</div>
          <span className="text-xs text-slate-500 mt-1 block">100% dos equipamentos com tag</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Padrão da Plaqueta</span>
          <div className="text-2xl font-black text-purple-700 mt-2">QR Code + RFID</div>
          <span className="text-xs text-purple-700 font-semibold mt-1 block">Chip UHF 860-960 MHz</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Emissão de Plaquetas & Registro Patrimonial</h3>
            <p className="text-xs text-slate-500">Geração de etiquetas térmicas com código de barras, QR Code e número de tombamento</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification('Lote de 20 plaquetas enviado para impressora Zebra ZD420!')}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Imprimir Lote de Plaquetas
            </button>
            <button
              onClick={() => setIsNewAssetModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              + Tombar Ativo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {assets.slice(0, 4).map((a) => (
            <div key={a.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-white rounded-lg border border-slate-300 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="font-mono font-bold text-sm text-blue-700">{a.tagNumber}</div>
              <div className="text-xs font-semibold text-slate-900 truncate">{a.model}</div>
              <div className="text-[10px] text-slate-500 font-mono">SN: {a.serialNumber}</div>
              <button
                onClick={() => showNotification(`Etiqueta de ${a.tagNumber} enviada para impressão!`)}
                className="w-full py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                Reimprimir Plaqueta
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDepreciacaoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Valor Bruto Contábil</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{formatBRL(metrics?.totalPatrimonialValue ?? 2840000)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Custo histórico de aquisição</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Depreciação Acumulada</span>
          <div className="text-2xl font-black text-rose-700 mt-2">R$ 684.200,00</div>
          <span className="text-xs text-rose-600 font-semibold mt-1 block">Linear conforme CPC 27</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Valor Líquido Residual</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">R$ 2.155.800,00</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Patrimônio imobilizado ativo</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Depreciação Mensal</span>
          <div className="text-2xl font-black text-blue-700 mt-2">R$ 23.666,00</div>
          <span className="text-xs text-slate-500 mt-1 block">Lançamento contábil mensal</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Demonstrativo de Depreciação por Grupo de Equipamentos</h3>
            <p className="text-xs text-slate-500">Taxas anuais oficiais conforme normativas da Receita Federal do Brasil</p>
          </div>
          <button
            onClick={() => showNotification('Planilha de depreciação fiscal exportada com sucesso!')}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Exportar Relatório Fiscal
          </button>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Grupo de Ativos</th>
                <th className="py-3 px-4">Vida Útil Estimada</th>
                <th className="py-3 px-4">Taxa Anual</th>
                <th className="py-3 px-4">Valor Original</th>
                <th className="py-3 px-4">Depreciação Acumulada</th>
                <th className="py-3 px-4 text-right">Valor Contábil Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { group: 'Catracas Eletrônicas & Pedestais', vida: '10 anos', taxa: '10% a.a.', val: 1450000, dep: 290000, res: 1160000 },
                { group: 'PDAs Coletores Móveis & Scanners', vida: '5 anos', taxa: '20% a.a.', val: 680000, dep: 204000, res: 476000 },
                { group: 'Servidores Locais Edge Cache & Redes', vida: '5 anos', taxa: '20% a.a.', val: 420000, dep: 126000, res: 294000 },
                { group: 'Nobreaks & Geradores Portáteis', vida: '5 anos', taxa: '20% a.a.', val: 290000, dep: 64200, res: 225800 },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.group}</td>
                  <td className="py-3 px-4 text-slate-600">{row.vida}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{row.taxa}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{formatBRL(row.val)}</td>
                  <td className="py-3 px-4 text-rose-700 font-semibold">{formatBRL(row.dep)}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatBRL(row.res)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGenericAtvSubmenu = (item: AtvSubmenuDef) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Equipamentos em {item.label}</span>
          <div className="text-2xl font-black text-slate-900 mt-2">100% Homologado</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Patrimônio auditado DiskIngressos</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unidades Monitoradas</span>
          <div className="text-2xl font-black text-blue-700 mt-2">{assets.length} Itens</div>
          <span className="text-xs text-slate-500 mt-1 block">Rastreamento RFID / QR Code ativo</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Operacional</span>
          <div className="text-2xl font-black text-emerald-700 mt-2">Disponível</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Em conformidade com laudos</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">{item.label}</h3>
            <p className="text-xs text-slate-500">{item.purpose}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification(`Relatório patrimonial de ${item.label} gerado com sucesso!`)}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Exportar Relatório Patrimonial
            </button>
            <button
              onClick={() => setIsNewAssetModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              + Novo Equipamento
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Plaqueta / Serial</th>
                <th className="py-3 px-4">Modelo do Equipamento</th>
                <th className="py-3 px-4">Local Atual</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.slice(0, 4).map((a, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {a.tagNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{a.model}</div>
                    <div className="text-[11px] text-slate-500 font-mono">SN: {a.serialNumber}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{a.currentLocation}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedAsset(a);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-blue-700 hover:underline font-bold"
                    >
                      Ficha Técnica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const isDashboardHub = sectionId === 'atv-dashboard';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {isDashboardHub ? (
        <>
          {/* 1. Header do Módulo */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>Equipamentos & Hardwares de Bilheteria · DiskIngressos</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestão de Hardwares de Bilheteria, Catracas & Manutenção
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Controle físico e patrimonial de catracas eletrônicas de alta vazão, PDAs industriais Android,
              terminais de bilheteria física, romaneios de transporte, ordens de serviço (OS) e insumos holográficos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
              title="Atualizar ativos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300 shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Nova O.S. Técnica</span>
            </button>

            <button
              onClick={() => setIsNewAssetModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Equipamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Scorecards Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Parque Tecnológico</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.totalAssets : '348'} Ativos
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>R$ 1,84 mi em valor imobilizado</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Catracas Eletrônicas</span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.turnstilesCount : '47'} Unidades
            </div>
            <div className="text-xs text-indigo-700 font-semibold mt-1">
              42 em operação · 5 disponíveis
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">PDAs & Coletores</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Laptop className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.pdasCount : '82'} PDAs
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              Bateria e leitores 100% calibrados
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Em Manutenção</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? metrics.inMaintenanceCount : '2'} Em Reparo
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Bancada de laboratório ativo
            </div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Saúde do Parque (Health)</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {metrics ? `${metrics.maintenanceHealthScore}%` : '97.4%'}
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              Preventiva rigorosamente em dia
            </div>
          </div>
        </div>
      </div>

      {/* 3. Submenu Hub & Quick Navigation (24 Submenus) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-bold text-slate-900">
              Central de Acesso Rápido — 24 Submenus de Equipamentos
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              {filteredSubmenus.length} de 24
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar funcionalidade patrimonial..."
                value={submenuSearch}
                onChange={(e) => setSubmenuSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white w-64 text-slate-800"
              />
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {groups.map((grp) => (
                <option key={grp} value={grp}>
                  {grp === 'todos' ? 'Todos os Grupos' : grp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submenu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSubmenus.map((item) => {
            const Icon = item.icon;
            const isCurrent = sectionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-white border border-slate-200 text-blue-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.purpose}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-600">{item.group.split('(')[0]}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Abas Operacionais Principais */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'inventario'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Inventário Geral & Localização ({assets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catracas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'catracas'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Catracas & Portarias de Acesso</span>
          </button>

          <button
            onClick={() => setActiveTab('manutencao')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'manutencao'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>3. Ordens de Serviço & Laboratório ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movimentacoes')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'movimentacoes'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>4. Movimentações & Comodatos</span>
          </button>

          <button
            onClick={() => setActiveTab('insumos')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'insumos'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>5. Insumos & Bobinas Térmicas</span>
          </button>

          <button
            onClick={() => setActiveTab('tombamento')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tombamento'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>6. Tombamento & RFID</span>
          </button>

          <button
            onClick={() => setActiveTab('depreciacao')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'depreciacao'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>7. Depreciação & Vida Útil</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'inventario' && renderInventarioTab()}

          {activeTab === 'catracas' && renderCatracasTab()}

          {activeTab === 'manutencao' && renderManutencaoTab()}
          {activeTab === 'movimentacoes' && renderMovimentacoesTab()}
          {activeTab === 'insumos' && renderInsumosTab()}
          {activeTab === 'tombamento' && renderTombamentoTab()}
          {activeTab === 'depreciacao' && renderDepreciacaoTab()}
        </div>
      </div>
    </>
  ) : (
    /* DEDICATED SCREEN VIEW FOR SPECIFIC SUBMENU */
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectSection('atv-dashboard')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Hub de Equipamentos</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Equipamentos & Ativos · {currentSubmenu?.group || 'Módulo'}
                </span>
                {currentSubmenu?.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentSubmenu.badgeColor || 'bg-blue-100 text-blue-800'}`}>
                    {currentSubmenu.badge}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                {currentSubmenu?.icon && React.createElement(currentSubmenu.icon, { className: 'w-6 h-6 text-blue-700' })}
                <span>{currentSubmenu?.label || 'Visualização Dedicada'}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {currentSubmenu?.purpose || 'Gestão de hardwares de bilheteria e portaria de acesso.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors border border-amber-300 shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Nova O.S. Técnica</span>
            </button>
            <button
              onClick={() => setIsNewAssetModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Equipamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED SUBMENU CONTENT */}
      {sectionId === 'atv-inventario-geral' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderInventarioTab()}
        </div>
      )}
      {(sectionId === 'atv-catracas' || sectionId === 'atv-pdas-coletores' || sectionId === 'atv-servidores-edge' || sectionId === 'atv-leitores-qrcode') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderCatracasTab()}
        </div>
      )}
      {(sectionId === 'atv-ordens-servico' || sectionId === 'atv-preventiva' || sectionId === 'atv-laboratorio' || sectionId === 'atv-pecas-reposicao') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderManutencaoTab()}
        </div>
      )}
      {(sectionId === 'atv-movimentacoes' || sectionId === 'atv-localizacao-tempo-real' || sectionId === 'atv-comodatos' || sectionId === 'atv-romaneios') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderMovimentacoesTab()}
        </div>
      )}
      {(sectionId === 'atv-bobinas-termicas' || sectionId === 'atv-pulseiras-rfid' || sectionId === 'atv-crachas-staff') && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderInsumosTab()}
        </div>
      )}
      {sectionId === 'atv-tombamento' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderTombamentoTab()}
        </div>
      )}
      {sectionId === 'atv-depreciacao' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          {renderDepreciacaoTab()}
        </div>
      )}
      {![
        'atv-inventario-geral',
        'atv-catracas', 'atv-pdas-coletores', 'atv-servidores-edge', 'atv-leitores-qrcode',
        'atv-ordens-servico', 'atv-preventiva', 'atv-laboratorio', 'atv-pecas-reposicao',
        'atv-movimentacoes', 'atv-localizacao-tempo-real', 'atv-comodatos', 'atv-romaneios',
        'atv-bobinas-termicas', 'atv-pulseiras-rfid', 'atv-crachas-staff',
        'atv-tombamento',
        'atv-depreciacao',
      ].includes(sectionId) && renderGenericAtvSubmenu(currentSubmenu)}
    </div>
  )}

      {/* MODAL 1: NOVO ATIVO */}
      {isNewAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tombamento de Novo Equipamento</h2>
                <p className="text-xs text-slate-500">Cadastro patrimonial com plaqueta e número de série</p>
              </div>
              <button
                onClick={() => setIsNewAssetModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Modelo do Hardware</label>
                <input
                  type="text"
                  required
                  value={newAssetForm.model}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, model: e.target.value })}
                  placeholder="Ex: Catraca Eletrônica Pedestal Disk High-Speed v4"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Série (SN)</label>
                  <input
                    type="text"
                    required
                    value={newAssetForm.serialNumber}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, serialNumber: e.target.value })}
                    placeholder="SN-123456"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={newAssetForm.category}
                    onChange={(e) =>
                      setNewAssetForm({ ...newAssetForm, category: e.target.value as AssetCategory })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="CATRACA_ELETRONICA">Catraca Eletrônica</option>
                    <option value="PDA_COLETOR_MOVEL">PDA Coletor Móvel</option>
                    <option value="PDV_IMPRESSORA">PDV / Impressora Térmica</option>
                    <option value="SERVIDOR_EDGE">Servidor Edge</option>
                    <option value="INFRA_REDE_NOBREAK">Infra de Rede / Nobreak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Localização Inicial</label>
                  <input
                    type="text"
                    value={newAssetForm.currentLocation}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, currentLocation: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor de Aquisição (R$)</label>
                  <input
                    type="number"
                    value={newAssetForm.acquisitionValue}
                    onChange={(e) =>
                      setNewAssetForm({ ...newAssetForm, acquisitionValue: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                >
                  Gravar Tombamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVA ORDEM DE SERVIÇO */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Abertura de Ordem de Serviço (O.S.)</h2>
                <p className="text-xs text-slate-500">Direcionamento para laboratório ou manutenção em campo</p>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equipamento Alvo</label>
                <select
                  value={newOrderForm.assetId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, assetId: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.tagNumber} — {a.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Manutenção</label>
                  <select
                    value={newOrderForm.type}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, type: e.target.value as any })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="PREVENTIVA">Preventiva (Revisão periódica)</option>
                    <option value="CORRETIVA">Corretiva (Falha ou dano)</option>
                    <option value="CALIBRACAO">Calibração Óptica / Bateria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={newOrderForm.priority}
                    onChange={(e) =>
                      setNewOrderForm({ ...newOrderForm, priority: e.target.value as any })
                    }
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="ALTA">Alta (Urgência para show)</option>
                    <option value="NORMAL">Normal</option>
                    <option value="BAIXA">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição do Problema / Serviço</label>
                <textarea
                  rows={3}
                  required
                  value={newOrderForm.description}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, description: e.target.value })}
                  placeholder="Descreva o sintoma ou a revisão necessária..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
                >
                  Abrir Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FICHA DO ATIVO */}
      {isDetailsModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedAsset.tagNumber}</h2>
                  <p className="text-xs text-slate-500">{selectedAsset.model}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Serial Number</span>
                <div className="font-bold text-slate-900">{selectedAsset.serialNumber}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Localização</span>
                <div className="font-bold text-slate-900">{selectedAsset.currentLocation}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Valor Contábil</span>
                <div className="font-bold text-emerald-700">{formatBRL(selectedAsset.residualValue)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Próxima Calibração</span>
                <div className="font-bold text-slate-900">{selectedAsset.nextCalibrationDate}</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
