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
        groupName: 'Gestão Fiscal',
        items: [
          { id: 'fisc-dashboard-fiscal', label: 'Dashboard Fiscal', description: 'Visão consolidada e controles tributários', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'fisc-central-de-documentos-fiscais', label: 'Central de Documentos Fiscais', description: 'Repositório de NFS-e, NF-e e XMLs' },
          { id: 'fisc-emissao-de-notas-fiscais', label: 'Emissão de Notas Fiscais', description: 'Emissão de NFS-e de serviços Disk' },
          { id: 'fisc-notas-recebidas', label: 'Notas Recebidas', description: 'Notas fiscais de fornecedores e eventos' },
          { id: 'fisc-cancelamento-e-correcao-de-notas', label: 'Cancelamento e Correção de Notas', description: 'Cancelamentos e cartas de correção CC-e' },
        ],
      },
      {
        groupName: 'Tributos e Apurações',
        items: [
          { id: 'fisc-apuracao-de-tributos', label: 'Apuração de Tributos', description: 'PIS, COFINS, IRPJ, CSLL e ISS', badge: 'Out/26', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'fisc-retencoes-tributarias', label: 'Retenções Tributárias', description: 'CSRF 4,65%, IRRF 1,5% e ISS retido' },
          { id: 'fisc-iss-e-servicos', label: 'ISS e Serviços', description: 'Alíquota de 5% Curitiba e regimes' },
          { id: 'fisc-tributos-federais', label: 'Tributos Federais', description: 'Apurações da Receita Federal e DARFs' },
          { id: 'fisc-regimes-tributarios', label: 'Regimes Tributários', description: 'Lucro Real Disk e enquadramentos' },
          { id: 'fisc-creditos-e-compensacoes', label: 'Créditos e Compensações', description: 'Créditos de PIS/COFINS e compensações' },
          { id: 'fisc-aliquotas-e-vigencias', label: 'Alíquotas e Vigências', description: 'Tabelas vigentes e regras tributárias' },
        ],
      },
      {
        groupName: 'Obrigações Acessórias',
        items: [
          { id: 'fisc-calendario-fiscal', label: 'Calendário Fiscal', description: 'Prazos legais e cronograma de entregas' },
          { id: 'fisc-obrigacoes-acessorias', label: 'Obrigações Acessórias', description: 'DCTFWeb, DMS Curitiba e EFD-Reinf' },
          { id: 'fisc-sped-e-escrituracoes', label: 'SPED e Escriturações', description: 'SPED Fiscal e EFD-Contribuições' },
          { id: 'fisc-integracao-com-prefeituras', label: 'Integração com Prefeituras', description: 'Webservices NFS-e Curitiba e outras' },
          { id: 'fisc-guias-e-recolhimentos', label: 'Guias e Recolhimentos', description: 'Geração de DARFs e guias municipais' },
        ],
      },
      {
        groupName: 'Operações Disk e Eventos',
        items: [
          { id: 'fisc-fiscal-disk-empresa', label: 'Fiscal Disk Empresa', description: 'Tributação de receitas próprias e despesas', badge: 'Próprio', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'fisc-fiscal-de-eventos-e-produtores', label: 'Fiscal de Eventos e Produtores', description: 'Segregação de ingressos e responsabilidade fiscal', badge: 'Segregado', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'fisc-receitas-de-taxas-disk', label: 'Receitas de Taxas Disk', description: 'Base tributável de taxas de conveniência' },
          { id: 'fisc-despesas-e-documentos-dos-eventos', label: 'Despesas e Documentos dos Eventos', description: 'Comprovantes fiscais e borderôs' },
          { id: 'fisc-conciliacao-fiscal-financeiro', label: 'Conciliação Fiscal × Financeiro', description: 'Confronto 1:1 de notas e liquidações' },
        ],
      },
      {
        groupName: 'Controle e Auditoria',
        items: [
          { id: 'fisc-relatorios-fiscais', label: 'Relatórios Fiscais', description: 'Livros fiscais e demonstrativos tributários' },
          { id: 'fisc-certidoes-e-regularidade', label: 'Certidões e Regularidade', description: 'CND Federal, Estadual, Municipal e FGTS', badge: 'Regular', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'fisc-auditoria-fiscal', label: 'Auditoria Fiscal', description: 'Validações automáticas de inconsistências' },
          { id: 'fisc-configuracoes-e-integracoes', label: 'Configurações e Integrações', description: 'Certificados digitais A1/A3 e parâmetros' },
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
    label: 'Compras & Estoque',
    icon: 'ShoppingCart',
    groups: [
      {
        groupName: 'Visão Geral',
        items: [
          { id: 'comp-dashboard', label: 'Dashboard de Compras', description: 'KPIs, cotações, pedidos em aberto e orçamento', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'comp-solicitacoes', label: 'Central de Solicitações', description: 'Requisições internas de compras e aprovação', badge: '12 Abertas', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'comp-planejamento', label: 'Planejamento de Compras', description: 'Previsão de demanda corporativa e compras sazonais' },
        ],
      },
      {
        groupName: 'Armazenagem & Almoxarifado',
        items: [
          { id: 'est-products', label: 'Catálogo de Produtos & SKUs', description: 'Bobinas, papel-moeda, pulseiras, toners e crachás', badge: '4.280 un', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'est-warehouses', label: 'Almoxarifados & Localizações', description: 'Sede Curitiba, Teatro Positivo, Guaíra e Quiosques' },
          { id: 'est-kardex', label: 'Movimentações Kardex', description: 'Rastreabilidade de entradas por compra e saídas', badge: 'Kardex', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'est-inventory', label: 'Inventário Físico & Ajustes', description: 'Contagens cíclicas, conciliação e perdas' },
          { id: 'est-requisicoes', label: 'Requisições de Consumo', description: 'Retiradas de insumos pelas equipes operacionais' },
          { id: 'est-ponto-pedido', label: 'Ponto de Pedido & Reposição', description: 'Itens em nível crítico para disparo automático de compras', badge: '1 Alerta', badgeColor: 'bg-rose-100 text-rose-800' },
        ],
      },
      {
        groupName: 'Fornecedores e Cotações',
        items: [
          { id: 'comp-fornecedores', label: 'Cadastro de Fornecedores', description: 'Parceiros homologados, dados fiscais e contatos' },
          { id: 'comp-homologacao', label: 'Homologação de Fornecedores', description: 'Compliance, certidões negativas e qualificação' },
          { id: 'comp-rfq', label: 'Solicitação de Cotação (RFQ)', description: 'Disparo de cotações e coleta de propostas' },
          { id: 'comp-mapa-comparativo', label: 'Mapa Comparativo', description: 'Comparativo de preços, prazos e condições' },
          { id: 'comp-negociacao', label: 'Negociação Comercial', description: 'Registro de contrapropostas e saving gerado' },
        ],
      },
      {
        groupName: 'Pedidos e Contratações',
        items: [
          { id: 'comp-pedidos', label: 'Pedidos de Compra', description: 'Emissão e acompanhamento de ordens de compra', badge: '18 Ativos', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'comp-contratos', label: 'Contratos de Fornecimento', description: 'SLA, vigência, renovação e cláusulas' },
          { id: 'comp-recorrentes', label: 'Compras Recorrentes', description: 'Suprimentos contínuos e assinaturas mensais' },
          { id: 'comp-servicos', label: 'Aquisição de Serviços', description: 'Contratação de terceirizados, consultorias e laudos' },
          { id: 'comp-aprovacoes', label: 'Aprovações de Compras', description: 'Alçadas de aprovação por centro de custo e diretoria' },
        ],
      },
      {
        groupName: 'Recebimento e Almoxarifado',
        items: [
          { id: 'comp-recebimento', label: 'Recebimento de Materiais', description: 'Conferência física, inspeção e aceite de entrega' },
          { id: 'comp-aceite-servicos', label: 'Aceite de Serviços', description: 'Medição de serviços prestados e validação técnica' },
          { id: 'comp-devolucoes', label: 'Devoluções e Trocas', description: 'RMA, devoluções parciais e notas de estorno' },
          { id: 'comp-documentos', label: 'Documentos de Compra', description: 'Armazenamento de propostas, minutas e recibos' },
        ],
      },
      {
        groupName: 'Gestão Financeira',
        items: [
          { id: 'comp-orcamento', label: 'Orçamento de Compras', description: 'Acompanhamento orçamentário CapEx e OpEx' },
          { id: 'comp-centros-custos', label: 'Centros de Custos', description: 'Apropriação e rateio por departamento Disk' },
          { id: 'comp-contas-pagar', label: 'Integração Contas a Pagar', description: 'Geração automática de títulos na Tesouraria' },
          { id: 'comp-impostos', label: 'Impostos nas Aquisições', description: 'DIFAL, ICMS-ST, retenções de IR, PIS/COFINS e ISS' },
        ],
      },
      {
        groupName: 'Patrimônio e Tecnologia',
        items: [
          { id: 'comp-ativos', label: 'Aquisição de Ativos', description: 'Equipamentos, hardware e incorporação ao imobilizado' },
          { id: 'comp-licencas', label: 'Licenças e Assinaturas', description: 'SaaS corporativos, software e gestão de assentos' },
          { id: 'comp-garantias', label: 'Garantias e Manutenção', description: 'Controle de garantia de fábrica e contratos de suporte' },
        ],
      },
      {
        groupName: 'Controle e Governança',
        items: [
          { id: 'comp-relatorios', label: 'Relatórios de Compras & Estoque', description: 'Saving acumulado, lead time e giro de estoque' },
          { id: 'comp-avaliacao', label: 'Avaliação de Fornecedores', description: 'Índice de pontualidade, qualidade e SLA (IQF)' },
          { id: 'comp-auditoria', label: 'Auditoria e Histórico', description: 'Rastreabilidade ponta a ponta de solicitações e pedidos' },
          { id: 'comp-configuracoes', label: 'Configurações de Compras & Estoque', description: 'Alçadas de valor, parâmetros e fluxos de workflow' },
        ],
      },
    ],
  },
  {
    id: 'crm',
    label: 'CRM & Produtores',
    icon: 'Briefcase',
    groups: [
      {
        groupName: 'Visão Geral & Funil Comercial (4)',
        items: [
          { id: 'crm-dashboard', label: 'Dashboard Comercial de Produtores', description: 'Indicadores de captação, novos shows e GMV projetado', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'crm-pipeline', label: 'Central de Deals & Pipeline', description: 'Kanban de negociações de espetáculos e turnês', badge: '19 Deals', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'crm-metas', label: 'Metas & Performance Comercial', description: 'Desempenho dos executivos de contas e SDRs' },
          { id: 'crm-alertas', label: 'Alertas Comerciais & Renovações', description: 'Contratos de exclusividade e prazos de concorrência', badge: '3 Alertas', badgeColor: 'bg-amber-100 text-amber-800' },
        ],
      },
      {
        groupName: 'Cadastro & Gestão 360º de Produtores (5)',
        items: [
          { id: 'crm-produtores', label: 'Carteira Geral de Produtores', description: 'Base consolidada de parceiros, CNPJ e classificação', badge: '42 Produtores', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'crm-homologacao', label: 'Homologação & Compliance', description: 'Qualificação jurídica, certidões negativas e due diligence' },
          { id: 'crm-contatos', label: 'Contatos & Representantes', description: 'Sócios, diretores artísticos e produtores executivos' },
          { id: 'crm-segmentacao', label: 'Segmentação & Categorias', description: 'Shows Nacionais, Teatros, Festivais e Stand-Up' },
          { id: 'crm-historico', label: 'Histórico de Relacionamento', description: 'Registro de reuniões, visitas comerciais e atas' },
        ],
      },
      {
        groupName: 'Negociação de Eventos & Propostas (5)',
        items: [
          { id: 'crm-funil-eventos', label: 'Funil de Vendas de Shows', description: 'Gestão de etapas de captação de novas produções' },
          { id: 'crm-propostas', label: 'Gerador de Propostas Comerciais', description: 'Simulação de taxas, advance e exclusividade' },
          { id: 'crm-versoes-propostas', label: 'Histórico de Versões & Propostas', description: 'Controle de revisões e contrapropostas de produtores' },
          { id: 'crm-pracas-casas', label: 'Praças & Casas Homologadas', description: 'Teatro Positivo, Guaíra, Pedreira e Live Curitiba' },
          { id: 'crm-leads', label: 'Captação de Novos Produtores (Leads)', description: 'Mapeamento de produtoras concorrentes e novos eventos' },
        ],
      },
      {
        groupName: 'Condições Comerciais, Taxas & Acordos (4)',
        items: [
          { id: 'crm-tabelas-taxas', label: 'Tabelas de Taxa por Produtor', description: 'Taxa de conveniência Disk, MDR e spread acordado', badge: 'Acordos', badgeColor: 'bg-purple-100 text-purple-800' },
          { id: 'crm-acordos-advance', label: 'Acordos de Antecipação & Advance', description: 'Condições para adiantamento com garantia de bilheteria' },
          { id: 'crm-exclusividade', label: 'Exclusividade & Bônus de Volume', description: 'Cláusulas de fidelidade e escalonamento de comissões' },
          { id: 'crm-locacao-equipamentos', label: 'Locação & Comodato de Hardwares', description: 'Catracas eletrônicas, PDVs e leitores PDA para eventos' },
        ],
      },
      {
        groupName: 'Atendimento & Suporte ao Produtor (4)',
        items: [
          { id: 'crm-chamados', label: 'Central de Chamados do Produtor', description: 'Solicitações operacionais, lotes e borderôs', badge: '0 Críticos', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'crm-portal-produtor', label: 'Portal do Produtor (Acesso & Permissões)', description: 'Gestão de logins para acompanhamento de vendas em tempo real' },
          { id: 'crm-csat', label: 'Pesquisas de Satisfação & NPS', description: 'Avaliação pós-evento da experiência de bilheteria e suporte', badge: '4.9 ⭐', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'crm-incidentes', label: 'Gestão de Ocorrências Comerciais', description: 'Tratativa de reclamações e divergências de bilheteria' },
        ],
      },
      {
        groupName: 'Governança Comercial & Relatórios (4)',
        items: [
          { id: 'crm-relatorios-conversao', label: 'Relatórios de Conversão Comercial', description: 'LTV de produtores, CAC e margem média por evento' },
          { id: 'crm-auditoria-comercial', label: 'Trilha de Auditoria Comercial', description: 'Histórico de concessão de taxas e comissões especiais' },
          { id: 'crm-alcadas', label: 'Matriz de Alçadas Comerciais', description: 'Limites de desconto na taxa Disk e limites de advance' },
          { id: 'crm-config', label: 'Configurações do CRM', description: 'Etapas do funil, categorias e canais de prospecção' },
        ],
      },
    ],
  },
  {
    id: 'contratos',
    label: 'Contratos & Jurídico',
    icon: 'Scale',
    groups: [
      {
        groupName: 'Visão Geral & Gestão Contratual (4)',
        items: [
          { id: 'jur-dashboard', label: 'Dashboard Executivo de Contratos', description: 'Status de vigências, assinaturas e GMV sob custódia protegida', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'jur-central-contratos', label: 'Central de Contratos Ativos', description: 'Gestão de instrumentos contratuais vigentes e histórico', badge: '38 Ativos', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'jur-vigencia-alertas', label: 'Prazos, Vigências & Renovações', description: 'Alertas preditivos de vencimentos em 30, 60 e 90 dias', badge: '4 a Vencer', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'jur-metricas-juridicas', label: 'Métricas & Indicadores de Conformidade', description: 'Tempo médio de formalização e índice de renovações' },
        ],
      },
      {
        groupName: 'Contratos de Bilheteria & Produtores (4)',
        items: [
          { id: 'jur-contratos-produtores', label: 'Contratos de Prestação de Bilheteria', description: 'Instrumentos jurídicos com produtores de shows e espetáculos' },
          { id: 'jur-exclusividade', label: 'Cláusulas & Acordos de Exclusividade', description: 'Fidelidade territorial de venda de ingressos e cominações', badge: 'Exclusividade', badgeColor: 'bg-purple-100 text-purple-800' },
          { id: 'jur-minutas-padrao', label: 'Biblioteca de Minutas & Templates', description: 'Minutas padronizadas aprovadas pelo departamento jurídico' },
          { id: 'jur-aditivos-alteracoes', label: 'Termos Aditivos & Prorrogações', description: 'Aditamentos de datas, locais, taxas e capacidade de público' },
        ],
      },
      {
        groupName: 'Assinatura Digital & Formalização (4)',
        items: [
          { id: 'jur-fluxo-assinaturas', label: 'Fila de Assinaturas Digitais', description: 'Integração Clicksign, DocuSign e Gov.br com rastreio de signatários', badge: '4 Pendentes', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'jur-signatarios', label: 'Gestão de Signatários & Representantes', description: 'Poderes de representação societária e procurações ativas' },
          { id: 'jur-certificados-digitais', label: 'Validação ICP-Brasil & Carimbo do Tempo', description: 'Integridade criptográfica de assinaturas digitais avançadas' },
          { id: 'jur-historico-assinaturas', label: 'Trilha de Evidências de Assinatura', description: 'Logs de IP, geolocalização e hashes SHA-256 de formalização' },
        ],
      },
      {
        groupName: 'Garantias, Advance & Compliance (4)',
        items: [
          { id: 'jur-garantias-advance', label: 'Garantias de Advance & Cauções', description: 'Controle de notas promissórias e caução de bilheteria retida' },
          { id: 'jur-due-diligence', label: 'Due Diligence & Certidões Negativas', description: 'Consulta automatizada CND Federal, Estadual, Municipal e Trabalhista', badge: '96.8% OK', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'jur-retencoes-ecad', label: 'Bloqueios & Liberações Jurídicas', description: 'Travas preventivas para alvarás de funcionamento e quitação ECAD' },
          { id: 'jur-analise-risco', label: 'Classificação de Risco Contratual', description: 'Score de risco jurídico e histórico de litígios de produtores' },
        ],
      },
      {
        groupName: 'Contencioso & Notificações (4)',
        items: [
          { id: 'jur-notificacoes', label: 'Notificações Extrajudiciais & Avisos', description: 'Comunicações formais de inadimplemento e rescisões' },
          { id: 'jur-contencioso', label: 'Gestão de Processos & Contencioso', description: 'Acompanhamento de ações cíveis, trabalhistas e Procon' },
          { id: 'jur-acordos-judiciais', label: 'Termos de Acordo & Transações', description: 'Formalização de conciliações e parcelamentos judiciais' },
          { id: 'jur-assessoria-externa', label: 'Escritórios Parceiros & Procurações', description: 'Controle de advogados credenciados e substabelecimentos' },
        ],
      },
      {
        groupName: 'Governança Jurídica & Arquivos (4)',
        items: [
          { id: 'jur-repositorio-documental', label: 'Repositório Digital de Contratos', description: 'Armazenamento em PDF/A de longo prazo com OCR pesquisável' },
          { id: 'jur-auditoria-juridica', label: 'Trilha de Auditoria e Logs de Alteração', description: 'Registro imutável de consultas, downloads e alterações', badge: 'Imutável', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'jur-alcadas-juridicas', label: 'Alçadas de Assinatura & Pareceres', description: 'Matriz de competência para assinatura de contratos e aditivos' },
          { id: 'jur-config', label: 'Configurações do Módulo Jurídico', description: 'Parâmetros de notificações, prazos de tolerância e modelos' },
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
        groupName: 'Visão Executiva (4)',
        items: [
          { id: 'intel-exec-dashboard', label: 'Dashboard Executivo', description: 'Visão consolidada de indicadores e KPIs corporativos', badge: 'Principal', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'intel-exec-kpis', label: 'Indicadores de Desempenho (KPIs)', description: 'Métricas de rentabilidade, ticket médio e volume' },
          { id: 'intel-exec-gerencial', label: 'Análise Gerencial', description: 'DRE gerencial, margens operacionais e waterfall' },
          { id: 'intel-exec-alertas', label: 'Central de Alertas Inteligentes', description: 'Riscos de liquidez, desvios e tendências detectadas', badge: '4 Alertas', badgeColor: 'bg-amber-100 text-amber-800' },
        ],
      },
      {
        groupName: 'Monitoramento Inteligente (10)',
        items: [
          { id: 'intel-sent-central', label: 'Central de Monitoramento', description: 'Visão geral das verificações e saúde dos módulos', badge: 'Sentinel', badgeColor: 'bg-rose-100 text-rose-800' },
          { id: 'intel-sent-alertas', label: 'Alertas em Tempo Real', description: 'Alertas e ocorrências abertas pendentes', badge: '3 Críticos', badgeColor: 'bg-rose-100 text-rose-700' },
          { id: 'intel-sent-auditoria', label: 'Auditoria Inteligente', description: 'Verificação contínua de inconsistências contábeis e fiscais' },
          { id: 'intel-sent-riscos', label: 'Riscos e Anomalias', description: 'Comportamentos suspeitos, fraudes e desvios estatísticos' },
          { id: 'intel-sent-regras', label: 'Regras de Monitoramento', description: 'Condições determinísticas, limites e prioridades' },
          { id: 'intel-sent-agentes', label: 'Agentes de IA', description: 'Agentes especializados por departamento (Finanças, Eventos, Fiscal, RH)' },
          { id: 'intel-sent-tratativas', label: 'Automações e Tratativas', description: 'Encaminhamento, planos de ação e acompanhamento' },
          { id: 'intel-sent-historico', label: 'Histórico de Ocorrências', description: 'Evidências imutáveis, pareceres e resoluções' },
          { id: 'intel-sent-relatorios', label: 'Relatórios de Inteligência', description: 'Tendências, SLA de resolução e efetividade de alertas' },
          { id: 'intel-sent-config', label: 'Configurações da IA', description: 'Modelos (Local vs API), permissões e integrações' },
        ],
      },
      {
        groupName: 'Inteligência Financeira (6)',
        items: [
          { id: 'intel-fin-receitas', label: 'Inteligência de Receitas', description: 'Desdobramento por conveniência, PDV e serviços' },
          { id: 'intel-fin-rentabilidade', label: 'Rentabilidade e Margens', description: 'Margens de contribuição por canal e produto' },
          { id: 'intel-fin-fluxo-preditivo', label: 'Fluxo de Caixa Preditivo', description: 'Projeção de saldos em 30, 60 e 90 dias', badge: 'Preditivo', badgeColor: 'bg-purple-100 text-purple-800' },
          { id: 'intel-fin-custos', label: 'Inteligência de Custos', description: 'Despesas corporativas Disk e eficiência operacional' },
          { id: 'intel-fin-inadimplencia', label: 'Análise de Inadimplência', description: 'Controle de chargebacks e contestações' },
          { id: 'intel-fin-repasses', label: 'Análise de Repasses', description: 'Picos de liquidação e custódia fiduciária de produtores' },
        ],
      },
      {
        groupName: 'Inteligência de Eventos (5)',
        items: [
          { id: 'intel-evt-performance', label: 'Performance de Eventos', description: 'Vendas acumuladas, lote e velocidade de conversão' },
          { id: 'intel-evt-previsao', label: 'Previsão de Vendas', description: 'Modelos de machine learning de esgotamento de lote' },
          { id: 'intel-evt-ocupacao', label: 'Ocupação e Demanda', description: 'Teatros, arenas, assentos marcados e mapa de calor' },
          { id: 'intel-evt-cancelamentos', label: 'Análise de Cancelamentos', description: 'Taxa de desistência, devoluções e impacto em taxa' },
          { id: 'intel-evt-comportamento', label: 'Comportamento de Compras', description: 'Canais preferidos, perfil do fã e antecipação' },
        ],
      },
      {
        groupName: 'Inteligência Empresarial (5)',
        items: [
          { id: 'intel-emp-compras', label: 'Análise de Compras', description: 'Gastos por centro de custo, fornecedor e SLA' },
          { id: 'intel-emp-rh', label: 'Inteligência de RH', description: 'Turnover, headcount, folha per-capita e absenteísmo' },
          { id: 'intel-emp-fiscal', label: 'Inteligência Fiscal', description: 'Carga tributária efetiva, retenções e créditos ISS' },
          { id: 'intel-emp-contabil', label: 'Inteligência Contábil', description: 'Demonstrações auditáveis e conciliação contábil' },
          { id: 'intel-emp-eficiencia', label: 'Eficiência Operacional', description: 'Índice de produtividade operacional e solvência' },
        ],
      },
      {
        groupName: 'Inteligência Artificial (6)',
        items: [
          { id: 'intel-ai-assistente', label: 'Assistente Inteligente Keeper', description: 'Copilot corporativo para consultas e insights em linguagem natural', badge: 'IA Copilot', badgeColor: 'bg-purple-100 text-purple-800' },
          { id: 'intel-ai-preditiva', label: 'Análise Preditiva', description: 'Previsões estatísticas baseadas em séries temporais' },
          { id: 'intel-ai-anomalias', label: 'Detecção de Anomalias', description: 'Identificação proativa de discrepâncias financeiras' },
          { id: 'intel-ai-recomendacoes', label: 'Recomendações Inteligentes', description: 'Otimizações de precificação, compras e fluxo' },
          { id: 'intel-ai-simulador', label: 'Simulador de Cenários', description: 'Simulações what-if com sensibilidade de margem', badge: 'Simulador', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'intel-ai-automacoes', label: 'Automações Inteligentes', description: 'Workflows supervisionados e gatilhos de auditoria' },
        ],
      },
      {
        groupName: 'Dados e Relatórios (5)',
        items: [
          { id: 'intel-rep-central', label: 'Central de Relatórios', description: 'Biblioteca executiva de relatórios analíticos' },
          { id: 'intel-rep-builder', label: 'Construtor de Relatórios', description: 'Montagem personalizada de relatórios drag & drop' },
          { id: 'intel-rep-custom-dash', label: 'Painéis Personalizados', description: 'Dashboards sob medida por diretoria' },
          { id: 'intel-rep-export', label: 'Exportações e Agendamentos', description: 'Envio programado de relatórios por email/webhook' },
          { id: 'intel-rep-qualidade', label: 'Qualidade dos Dados', description: 'Auditoria de integridade, latência de ETL e logs' },
        ],
      },
      {
        groupName: 'Governança e Controle (4)',
        items: [
          { id: 'intel-gov-auditoria', label: 'Auditoria Analítica', description: 'Trilha de acesso e consultas em conformidade LGPD' },
          { id: 'intel-gov-permissoes', label: 'Permissões de Inteligência', description: 'Matriz RBAC para relatórios restritos e sensíveis' },
          { id: 'intel-gov-modelos', label: 'Modelos e Indicadores', description: 'Dicionário de métricas e fórmulas homologadas' },
          { id: 'intel-gov-config', label: 'Configurações de Inteligência', description: 'Parâmetros de ETL, limites de alerta e conexões' },
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
        groupName: 'Visão Geral & Parâmetros (3)',
        items: [
          { id: 'conf-dashboard', label: 'Dashboard de Configurações', description: 'Métricas de saúde, latência, uptime e infraestrutura core', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'conf-gerais', label: 'Parâmetros Gerais do ERP', description: 'Fuso horário, moeda padrão, dados institucionais e logos' },
          { id: 'conf-seguranca', label: 'Políticas de Segurança', description: 'Tempo de expiração de sessão, complexidade de senha e MFA', badge: 'MFA Ativo', badgeColor: 'bg-emerald-100 text-emerald-800' },
        ],
      },
      {
        groupName: 'Estrutura Corporativa & Multiempresa (4)',
        items: [
          { id: 'conf-empresas', label: 'Empresas & Unidades', description: 'Cadastro de matriz, holdings e consolidação fiscal', badge: 'Matriz', badgeColor: 'bg-indigo-100 text-indigo-800' },
          { id: 'conf-filiais', label: 'Filiais & PDVs Físicos', description: 'Shoppings Mueller, Palladium, Teatros e quiosques' },
          { id: 'conf-centros-custo', label: 'Centros de Custo & Departamentos', description: 'Mapeamento contábil e orçamentário corporativo' },
          { id: 'conf-regimes', label: 'Inscrições & Regimes Tributários', description: 'Inscrições estaduais, municipais e enquadramento' },
        ],
      },
      {
        groupName: 'Gestão de Identidade & Acesso (4)',
        items: [
          { id: 'conf-usuarios', label: 'Usuários & Colaboradores', description: 'Gestão de contas, credenciais, emails e status ativo', badge: '48 Ativos', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'conf-roles', label: 'Perfis de Acesso & RBAC', description: 'Definição de papéis administrativos, operacionais e fiscais' },
          { id: 'conf-permissoes', label: 'Matriz Granular de Permissões', description: 'Controle ponta a ponta de ações por módulo e tela' },
          { id: 'conf-sessoes', label: 'Sessões Ativas & Dispositivos', description: 'Auditoria de logins simultâneos, IPs e revogação remota' },
        ],
      },
      {
        groupName: 'Automação, Workflows & Regras (4)',
        items: [
          { id: 'conf-workflows', label: 'Motor de Workflow & Alçadas', description: 'Hierarquia de aprovações por valor e centro de custo', badge: '6 Regras', badgeColor: 'bg-purple-100 text-purple-800' },
          { id: 'conf-regras', label: 'Motor de Regras (Rule Engine)', description: 'Condicionais e validações automáticas de negócio' },
          { id: 'conf-templates', label: 'Modelos de Documentos & E-mails', description: 'Templates para borderôs, e-mails e notificações' },
          { id: 'conf-notificacoes', label: 'Canais de Notificação', description: 'Integração de alertas por Slack, WhatsApp, SMS e E-mail' },
        ],
      },
      {
        groupName: 'Integrações & Conectores (5)',
        items: [
          { id: 'conf-hub', label: 'Hub Central de Integrações', description: 'Conectores com adquirentes, bancos e plataformas de terceiros', badge: '8 Conectores', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'conf-webhooks', label: 'Webhooks & Eventos de Venda', description: 'Assinatura e logs de disparos de eventos transacionais' },
          { id: 'conf-api-keys', label: 'Chaves de API & Tokens', description: 'Gerenciamento de API Keys, escopos e expiração' },
          { id: 'conf-fiscais', label: 'Conectores Fiscais & Prefeituras', description: 'Webservice NFS-e Curitiba, certificados A1 e RPS' },
          { id: 'conf-open-finance', label: 'Conexão Bancária & Open Finance', description: 'Extratos automáticos, conciliação e gateways de pagamento' },
        ],
      },
      {
        groupName: 'Governança, Trilha & Auditoria (4)',
        items: [
          { id: 'conf-auditoria', label: 'Trilha de Auditoria (CDC)', description: 'Rastreabilidade imutável de alterações de dados com diff', badge: 'Imutável', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'conf-backup', label: 'Backups & Disaster Recovery', description: 'Rotinas de snapshots, dumps PostgreSQL e redundância' },
          { id: 'conf-lgpd', label: 'Privacidade & LGPD', description: 'Gestão de consentimentos, anonimização e exportação de dados' },
          { id: 'conf-logs', label: 'Logs de Sistema & Monitoramento', description: 'Stack traces, logs de microsserviços e diagnósticos' },
        ],
      },
    ],
  },
];
