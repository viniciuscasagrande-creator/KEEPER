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
          { id: 'fin-tax-rules', label: 'Taxas & Regras Comerciais', description: 'Matriz de MDR, spread bruto e simulador de tarifas', badge: 'Novo', badgeColor: 'bg-emerald-100 text-emerald-800' },
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
    id: 'contabil',
    label: 'Contábil',
    icon: 'BookOpen',
    groups: [
      {
        groupName: 'Escrituração & Razão',
        items: [
          { id: 'acc-dashboard', label: 'Dashboard Contábil', description: 'Visão executiva e competência ativa', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'acc-chart', label: 'Plano de Contas Estruturado', description: 'Ativo, passivo, receitas e despesas' },
          { id: 'acc-diario', label: 'Livro Diário Oficial', description: 'Registro cronológico das partidas' },
          { id: 'acc-razao', label: 'Livro Razão por Contas', description: 'Saldos progressivos e contrapartidas' },
          { id: 'acc-journal', label: 'Lançamentos Contábeis', description: 'Partidas dobradas, ajustes e estornos' },
        ],
      },
      {
        groupName: 'Demonstrações Oficiais',
        items: [
          { id: 'acc-balancete', label: 'Balancete de Verificação', description: 'Conferência de débitos e créditos' },
          { id: 'acc-balanco', label: 'Balanço Patrimonial', description: 'Ativos, passivos de custódia e PL' },
          { id: 'acc-dre', label: 'DRE — Demonstração do Resultado', description: 'Receitas próprias Disk e custos' },
          { id: 'acc-dfc', label: 'DFC — Fluxo de Caixa', description: 'Método direto: próprio vs custódia' },
        ],
      },
      {
        groupName: 'Controladoria & Integração',
        items: [
          { id: 'acc-integracao', label: 'Integração Financeira', description: 'Conexão Motor Financeiro x Razão', badge: 'Crítico', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'acc-cost-centers', label: 'Centros de Custo', description: 'Alocação por departamento e evento' },
          { id: 'acc-periods', label: 'Fechamento Contábil', description: 'Competências, travas e encerramento', badge: 'Out/26 Aberto', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'acc-fiscal', label: 'Fiscal e Tributário', description: 'Apuração e provisões sobre receitas' },
          { id: 'acc-conciliacao', label: 'Conciliação Contábil', description: 'Confronto Ledger vs Razão' },
        ],
      },
      {
        groupName: 'Governança & Arquivos',
        items: [
          { id: 'acc-documentos', label: 'Documentos Contábeis', description: 'NFS-e, borderôs e comprovantes' },
          { id: 'acc-relatorios', label: 'Relatórios & SPED', description: 'Exportações ECD, ECF e balancetes' },
          { id: 'acc-auditoria', label: 'Auditoria e Histórico', description: 'Trilha imutável e integridade' },
          { id: 'acc-config', label: 'Configurações Contábeis', description: 'Regime, parâmetros e CRC contador' },
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
        groupName: 'Gestão de Pessoas',
        items: [
          { id: 'rh-dashboard', label: 'Dashboard RH & DP', description: 'Visão geral, indicadores e movimentações', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'rh-colaboradores', label: 'Colaboradores', description: 'Quadro funcional e cadastros completos' },
          { id: 'rh-estrutura', label: 'Estrutura Organizacional', description: 'Organograma, diretorias e centros de custo' },
          { id: 'rh-recrutamento', label: 'Recrutamento e Seleção', description: 'Vagas abertas, pipeline e triagem' },
          { id: 'rh-admissao', label: 'Admissão e Onboarding', description: 'Checklist de integração e documentação' },
          { id: 'rh-contratos', label: 'Contratos de Trabalho', description: 'Contratos CLT, prazos e experiência' },
        ],
      },
      {
        groupName: 'Departamento Pessoal',
        items: [
          { id: 'rh-folha', label: 'Folha de Pagamento', description: 'Cálculo de competência, proventos e líquidos', badge: 'Out/26', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'rh-ponto', label: 'Ponto e Jornada', description: 'Espelho de ponto digital e marcações' },
          { id: 'rh-banco-horas', label: 'Banco de Horas', description: 'Compensações, saldos positivos e negativos' },
          { id: 'rh-ferias', label: 'Férias', description: 'Períodos aquisitivos, programação e abonos' },
          { id: 'rh-13-salario', label: '13º Salário', description: 'Adiantamento 1ª parcela e quitação anual' },
          { id: 'rh-beneficios', label: 'Benefícios', description: 'VR/VA Flash, Bradesco Saúde e Vale Transporte' },
          { id: 'rh-afastamentos', label: 'Afastamentos e Licenças', description: 'Atestados médicos, licenças e controle INSS' },
          { id: 'rh-rescisoes', label: 'Rescisões e Desligamentos', description: 'Cálculos rescisórios, aviso prévio e TRCT' },
          { id: 'rh-emprestimos', label: 'Empréstimos e Consignados', description: 'Adiantamentos salariais e vales' },
        ],
      },
      {
        groupName: 'Encargos e Obrigações',
        items: [
          { id: 'rh-encargos', label: 'Encargos Trabalhistas', description: 'INSS Patronal, FGTS, RAT e Sistema S' },
          { id: 'rh-esocial', label: 'eSocial', description: 'Central de mensageria de eventos periódicos', badge: 'Ativo', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'rh-fgts-dctf', label: 'FGTS Digital e DCTFWeb', description: 'Guias unificadas e conciliação' },
          { id: 'rh-seguranca-medicina', label: 'Segurança e Medicina do Trabalho', description: 'ASO, PCMSO, PGR e laudos ocupacionais' },
          { id: 'rh-obrigacoes-calendario', label: 'Obrigações e Calendário', description: 'Prazos legais trabalhistas e recolhimentos' },
          { id: 'rh-provisoes', label: 'Provisões Trabalhistas', description: 'Provisões mensais de férias e 13º com encargos' },
        ],
      },
      {
        groupName: 'Gestão e Desenvolvimento',
        items: [
          { id: 'rh-treinamentos', label: 'Treinamentos', description: 'Capacitações corporativas e trilhas de aprendizagem' },
          { id: 'rh-avaliacao-desempenho', label: 'Avaliação de Desempenho', description: 'Ciclos de feedback, metas e OKRs' },
          { id: 'rh-cargos-salarios', label: 'Cargos e Salários', description: 'Tabela de faixas e plano de carreira' },
          { id: 'rh-solicitacoes', label: 'Solicitações Internas', description: 'Helpdesk de RH e solicitações de funcionários' },
          { id: 'rh-portal-colaborador', label: 'Portal do Colaborador', description: 'Autosserviço, holerites e espelho de ponto' },
          { id: 'rh-clima', label: 'Clima e Pesquisa Organizacional', description: 'Termômetro de engajamento e eNPS' },
        ],
      },
      {
        groupName: 'Administração e Controle',
        items: [
          { id: 'rh-pagamentos', label: 'Pagamentos de Pessoal', description: 'Lotes bancários e integração com a Tesouraria' },
          { id: 'rh-integracao-contabil', label: 'Integração Contábil', description: 'Partidas dobradas no Razão Corporativo Disk' },
          { id: 'rh-relatorios', label: 'Relatórios RH & DP', description: 'Demonstrativos sintéticos e analíticos de pessoal' },
          { id: 'rh-documentos', label: 'Documentos e Assinaturas', description: 'Repositório digital com assinatura eletrônica' },
          { id: 'rh-auditoria', label: 'Auditoria e Histórico', description: 'Trilha de auditoria e conformidade LGPD' },
          { id: 'rh-configuracoes', label: 'Configurações RH & DP', description: 'Tabelas INSS/IRRF, convenções e parâmetros' },
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
