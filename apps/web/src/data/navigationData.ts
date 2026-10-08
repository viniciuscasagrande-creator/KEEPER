import { ModuleNav } from '../types/navigation';

export const navigationModules: ModuleNav[] = [
  {
    id: 'dashboard',
    label: 'Início',
    icon: 'LayoutDashboard',
    groups: [
      {
        groupName: 'Visão Geral',
        items: [
          { id: 'dash-exec', label: 'Dashboard Executivo', description: 'Visão consolidada de indicadores e KPIs' },
          { id: 'dash-fin', label: 'Dashboard Financeiro', description: 'Fluxo diário, disponibilidades e liquidez' },
          { id: 'notifications', label: 'Central de Notificações', badge: '12', badgeColor: 'bg-blue-100 text-blue-700' },
          { id: 'approvals', label: 'Central de Aprovações', badge: '3 Pendentes', badgeColor: 'bg-amber-100 text-amber-800' },
        ],
      },
      {
        groupName: 'Produtividade',
        items: [
          { id: 'quick-entry', label: 'Novo Lançamento Rápido', description: 'Criar contas a pagar/receber em 1 clique' },
          { id: 'tasks', label: 'Minhas Tarefas & Pendências' },
          { id: 'calendar', label: 'Agenda Fiscal & Vencimentos' },
        ],
      },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'DollarSign',
    groups: [
      {
        groupName: 'Painel Principal Financeiro Disk',
        items: [
          { id: 'fin-settlement', label: 'Painel Principal Financeiro Disk', description: 'Conta de liquidação, repasses e carteiras', badge: 'Principal', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'fin-producers', label: 'Central de Produtores & Eventos', description: 'Busca por produtor, carteira de eventos e regras de taxas', badge: 'Destaque', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'fin-refunds', label: 'Estornos & Cancelamentos', description: 'Câmara de devoluções, cobertura de déficit e recomposição', badge: 'Crítico', badgeColor: 'bg-rose-100 text-rose-800' },
          { id: 'fin-obligations', label: 'Retenções do Evento (Teatro/ECAD)', description: 'Gestão e bloqueio de passivos dos produtores' },
          { id: 'fin-event-wallets', label: 'Carteiras dos Eventos', description: 'Posição financeira de cada evento' },
          { id: 'fin-fees', label: 'Parametrização de Taxas', description: 'Spread, Advance, Ribeit e Conveniência' },
          { id: 'fin-split-simulator', label: 'Simulador de Split de Venda' },
        ],
      },
      {
        groupName: 'Contas a Pagar',
        items: [
          { id: 'fin-payables', label: 'Títulos a Pagar', badge: '26', badgeColor: 'bg-rose-100 text-rose-700' },
          { id: 'fin-payables-approval', label: 'Aprovações de Pagamento', badge: '3', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'fin-payments-batch', label: 'Lotes de Pagamento (CNAB/PIX)' },
          { id: 'fin-suppliers', label: 'Cadastro de Fornecedores' },
        ],
      },
      {
        groupName: 'Contas a Receber',
        items: [
          { id: 'fin-receivables', label: 'Títulos a Receber' },
          { id: 'fin-billing', label: 'Régua de Cobrança Automática' },
          { id: 'fin-inadimplence', label: 'Relatório de Inadimplência', badge: '4,8%', badgeColor: 'bg-slate-100 text-slate-700' },
          { id: 'fin-credit-limits', label: 'Gestão de Limite de Crédito' },
        ],
      },
      {
        groupName: 'Tesouraria & Bancos',
        items: [
          { id: 'fin-accounts', label: 'Contas Bancárias & Saldos' },
          { id: 'fin-reconciliation', label: 'Conciliação Bancária 1:1', badge: 'OFX/API' },
          { id: 'fin-transfers', label: 'Transferências Interbancárias' },
          { id: 'fin-cashflow', label: 'Fluxo de Caixa Realizado & Projetado' },
          { id: 'fin-budget', label: 'Orçamento Planejado vs Realizado' },
        ],
      },
      {
        groupName: 'Gateways & Adquirentes',
        items: [
          { id: 'gw-gateways', label: 'Gateways', description: 'Hub de provedores e webhooks', badge: 'Hub', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'gw-adquirentes', label: 'Adquirentes', description: 'Credenciadoras e contratos' },
          { id: 'gw-bandeiras', label: 'Bandeiras', description: 'Roteamento inteligente e antifraude' },
          { id: 'gw-mdr', label: 'MDR', description: 'Taxas de intermediação e calculadora' },
          { id: 'gw-parcelamento', label: 'Parcelamento', description: 'Regras de parcelas e juros' },
          { id: 'gw-metodos', label: 'Métodos de Pagamento', description: 'PIX, Cartão e canais' },
          { id: 'gw-regras', label: 'Regras Comerciais', description: 'MDR e condições por evento' },
          { id: 'gw-custom', label: 'Pagamentos Customizados', description: 'Splits, garantias e retenções' },
        ],
      },
    ],
  },
  {
    id: 'gateways',
    label: 'Gateways & Adquirentes',
    icon: 'CreditCard',
    groups: [
      {
        groupName: 'Processamento & Pagamentos',
        items: [
          { id: 'gw-gateways', label: 'Gateways', description: 'Integrações, chaves e webhooks' },
          { id: 'gw-adquirentes', label: 'Adquirentes', description: 'Cadastro e contratos' },
          { id: 'gw-bandeiras', label: 'Bandeiras', description: 'Bandeiras e roteamento' },
          { id: 'gw-mdr', label: 'MDR', description: 'Taxas das adquirentes' },
          { id: 'gw-parcelamento', label: 'Parcelamento', description: 'Condições por parcela' },
          { id: 'gw-metodos', label: 'Métodos de Pagamento', description: 'PIX, cartões e PDV' },
          { id: 'gw-regras', label: 'Regras Comerciais', description: 'Taxas negociadas por evento' },
          { id: 'gw-custom', label: 'Pagamentos Customizados', description: 'Splits e configurações especiais' },
        ],
      },
    ],
  },
  {
    id: 'contabil',
    label: 'Contábil',
    icon: 'BookOpen',
    groups: [
      {
        groupName: 'Livro Razão & Diário',
        items: [
          { id: 'acc-chart', label: 'Plano de Contas Estruturado' },
          { id: 'acc-journal', label: 'Lançamentos Contábeis (Diário)', description: 'Livro imutável com partidas dobradas' },
          { id: 'acc-reversals', label: 'Lançamentos de Estorno' },
          { id: 'acc-periods', label: 'Períodos Contábeis & Fechamento', badge: 'Out/26 Aberto', badgeColor: 'bg-emerald-100 text-emerald-800' },
        ],
      },
      {
        groupName: 'Demonstrativos Contábeis',
        items: [
          { id: 'acc-balancete', label: 'Balancete de Verificação (Analítico)' },
          { id: 'acc-dre', label: 'DRE - Demonstração do Resultado' },
          { id: 'acc-balanco', label: 'Balanço Patrimonial' },
          { id: 'acc-dfc', label: 'DFC - Demonstração de Fluxo de Caixa' },
          { id: 'acc-dmpl', label: 'DMPL - Mutações do Patrimônio Líquido' },
        ],
      },
      {
        groupName: 'Controladoria & SPED',
        items: [
          { id: 'acc-cost-centers', label: 'Centros de Custo & Dimensões' },
          { id: 'acc-reference', label: 'Plano de Contas Referencial (RFB)' },
          { id: 'acc-ecd', label: 'SPED Contábil (ECD)' },
          { id: 'acc-ecf', label: 'SPED ECF' },
        ],
      },
    ],
  },
  {
    id: 'fiscal',
    label: 'Fiscal',
    icon: 'Receipt',
    groups: [
      {
        groupName: 'Documentos Fiscais',
        items: [
          { id: 'fisc-nfe', label: 'Notas Fiscais Eletrônicas (NF-e)' },
          { id: 'fisc-nfse', label: 'Notas Fiscais de Serviço (NFS-e)' },
          { id: 'fisc-nfce', label: 'Consumidor Eletrônico (NFC-e)' },
          { id: 'fisc-cte', label: 'Conhecimento de Transporte (CT-e)' },
        ],
      },
      {
        groupName: 'Apurações & Obrigações',
        items: [
          { id: 'fisc-icms', label: 'Apuração de ICMS e IPI' },
          { id: 'fisc-pis-cofins', label: 'Apuração PIS / COFINS' },
          { id: 'fisc-iss', label: 'Apuração de ISS Municipal' },
          { id: 'fisc-sped-fiscal', label: 'SPED Fiscal (EFD ICMS/IPI)' },
          { id: 'fisc-sped-contribuicoes', label: 'EFD Contribuições' },
        ],
      },
    ],
  },
  {
    id: 'rh',
    label: 'RH & DP',
    icon: 'Users',
    groups: [
      {
        groupName: 'Gestão de Colaboradores',
        items: [
          { id: 'rh-employees', label: 'Cadastro de Colaboradores' },
          { id: 'rh-admissions', label: 'Admissões e Contratos' },
          { id: 'rh-departments', label: 'Departamentos e Organograma' },
          { id: 'rh-positions', label: 'Cargos, Salários e Níveis' },
        ],
      },
      {
        groupName: 'Ponto & Folha',
        items: [
          { id: 'rh-time-records', label: 'Espelho de Ponto Eletrônico' },
          { id: 'rh-vacations', label: 'Gestão de Férias & Afastamentos' },
          { id: 'rh-payroll', label: 'Motor de Folha de Pagamento', badge: 'Competência Out/26' },
          { id: 'rh-benefits', label: 'Gestão de Benefícios (VT/VR/Saúde)' },
          { id: 'rh-esocial', label: 'Mensageria eSocial (S-1200 / S-1210)' },
        ],
      },
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: 'ShoppingCart',
    groups: [
      {
        groupName: 'Processo de Aquisição',
        items: [
          { id: 'comp-requests', label: 'Requisições de Compra' },
          { id: 'comp-quotations', label: 'Cotações & Coleta de Preços' },
          { id: 'comp-orders', label: 'Pedidos de Compra Aprovados' },
          { id: 'comp-receipts', label: 'Recebimento Físico & Espelho NF' },
        ],
      },
    ],
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: 'Package',
    groups: [
      {
        groupName: 'Armazenagem & Kardex',
        items: [
          { id: 'est-products', label: 'Catálogo de Produtos & SKUs' },
          { id: 'est-warehouses', label: 'Almoxarifados & Localizações' },
          { id: 'est-kardex', label: 'Movimentações de Estoque (Kardex)' },
          { id: 'est-inventory', label: 'Inventário Físico & Ajustes' },
        ],
      },
    ],
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: 'ShoppingCart',
    groups: [
      {
        groupName: 'Comercial & Faturamento',
        items: [
          { id: 'vend-orders', label: 'Pedidos de Venda' },
          { id: 'vend-proposals', label: 'Propostas Comerciais' },
          { id: 'vend-price-lists', label: 'Tabelas de Preço & Descontos' },
          { id: 'vend-customers', label: 'Carteira de Clientes' },
        ],
      },
    ],
  },
  {
    id: 'inteligencia',
    label: 'Inteligência',
    icon: 'Sparkles',
    groups: [
      {
        groupName: 'BI Executivo',
        items: [
          { id: 'intel-dashboards', label: 'Dashboards Analíticos' },
          { id: 'intel-kpis', label: 'Cubo de Indicadores Gerenciais' },
          { id: 'intel-anomalies', label: 'Detecção de Anomalias Financeiras', badge: 'IA Ativa', badgeColor: 'bg-indigo-100 text-indigo-700' },
        ],
      },
      {
        groupName: 'Previsões & Alertas',
        items: [
          { id: 'intel-cash-forecast', label: 'Previsão Preditiva de Fluxo de Caixa' },
          { id: 'intel-churn', label: 'Predição de Inadimplência' },
          { id: 'intel-assistant', label: 'Assistente Corporativo ERP Copilot', badge: 'Novo' },
        ],
      },
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: 'Settings',
    groups: [
      {
        groupName: 'Administração Core',
        items: [
          { id: 'conf-companies', label: 'Empresas & Filiais (Multiempresa)' },
          { id: 'conf-users', label: 'Usuários & Colaboradores' },
          { id: 'conf-roles', label: 'Perfis de Acesso & RBAC' },
          { id: 'conf-audit', label: 'Trilha de Auditoria (CDC)' },
          { id: 'conf-workflows', label: 'Motor de Workflow & Alçadas' },
          { id: 'conf-rules', label: 'Motor de Regras (Rule Engine)' },
          { id: 'conf-integrations', label: 'Integration Hub & Webhooks' },
        ],
      },
    ],
  },
];
