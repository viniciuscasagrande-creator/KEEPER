import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  LayoutDashboard,
  Building2,
  UserPlus,
  FileCheck,
  FileText,
  DollarSign,
  Clock,
  Calendar,
  Gift,
  AlertTriangle,
  UserMinus,
  Coins,
  ShieldCheck,
  Send,
  Building,
  HeartPulse,
  CalendarClock,
  PieChart,
  GraduationCap,
  Award,
  TrendingUp,
  HelpCircle,
  Smartphone,
  Smile,
  CreditCard,
  Layers,
  Download,
  FolderLock,
  History,
  Settings,
  Search,
  RefreshCw,
  Plus,
  Eye,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  CheckCheck,
  Lock,
  Unlock,
  ShieldAlert,
  ArrowRightLeft,
  Filter,
  Briefcase,
  PanelRight,
  PanelLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { api } from '../../services/api';

export type RhSectionId =
  // 1. Gestão de Pessoas
  | 'rh-dashboard'
  | 'rh-colaboradores'
  | 'rh-estrutura'
  | 'rh-recrutamento'
  | 'rh-admissao'
  | 'rh-contratos'
  // 2. Departamento Pessoal
  | 'rh-folha'
  | 'rh-ponto'
  | 'rh-banco-horas'
  | 'rh-ferias'
  | 'rh-13-salario'
  | 'rh-beneficios'
  | 'rh-afastamentos'
  | 'rh-rescisoes'
  | 'rh-emprestimos'
  // 3. Encargos e Obrigações
  | 'rh-encargos'
  | 'rh-esocial'
  | 'rh-fgts-dctf'
  | 'rh-seguranca-medicina'
  | 'rh-obrigacoes-calendario'
  | 'rh-provisoes'
  // 4. Gestão e Desenvolvimento
  | 'rh-treinamentos'
  | 'rh-avaliacao-desempenho'
  | 'rh-cargos-salarios'
  | 'rh-solicitacoes'
  | 'rh-portal-colaborador'
  | 'rh-clima'
  // 5. Administração e Controle
  | 'rh-pagamentos'
  | 'rh-integracao-contabil'
  | 'rh-relatorios'
  | 'rh-documentos'
  | 'rh-auditoria'
  | 'rh-configuracoes';

export interface RhSectionDef {
  id: RhSectionId;
  title: string;
  icon: React.ElementType;
  group: 'Gestão de Pessoas' | 'Departamento Pessoal' | 'Encargos e Obrigações' | 'Gestão e Desenvolvimento' | 'Administração e Controle';
  purpose: string;
  badge?: string;
  badgeColor?: string;
}

export const RH_SECTIONS: RhSectionDef[] = [
  // 1. Gestão de Pessoas (6 submenus)
  { id: 'rh-dashboard', title: 'Dashboard RH & DP', icon: LayoutDashboard, group: 'Gestão de Pessoas', purpose: 'Visão executiva do quadro, folha, indicadores de retenção e alertas.', badge: 'Painel', badgeColor: 'bg-blue-100 text-blue-800' },
  { id: 'rh-colaboradores', title: 'Colaboradores', icon: Users, group: 'Gestão de Pessoas', purpose: 'Quadro funcional completo, cadastros ativos, históricos e dados contratuais.' },
  { id: 'rh-estrutura', title: 'Estrutura Organizacional', icon: Building2, group: 'Gestão de Pessoas', purpose: 'Organograma corporativo, diretorias, departamentos e centros de custo.' },
  { id: 'rh-recrutamento', title: 'Recrutamento e Seleção', icon: Search, group: 'Gestão de Pessoas', purpose: 'Gestão de vagas abertas, triagem de candidatos e pipeline de contratação.' },
  { id: 'rh-admissao', title: 'Admissão e Onboarding', icon: UserPlus, group: 'Gestão de Pessoas', purpose: 'Checklists de integração de novos funcionários, coleta de documentos e ASO.' },
  { id: 'rh-contratos', title: 'Contratos de Trabalho', icon: FileCheck, group: 'Gestão de Pessoas', purpose: 'Contratos CLT, controle de período de experiência (45/90 dias) e teletrabalho.' },

  // 2. Departamento Pessoal (9 submenus)
  { id: 'rh-folha', title: 'Folha de Pagamento', icon: DollarSign, group: 'Departamento Pessoal', purpose: 'Motor de cálculo da folha, apuração de proventos, descontos legais e líquidos.', badge: 'Out/26', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'rh-ponto', title: 'Ponto e Jornada', icon: Clock, group: 'Departamento Pessoal', purpose: 'Espelho de ponto digital, tolerâncias, horas trabalhadas, faltas e atrasos.' },
  { id: 'rh-banco-horas', title: 'Banco de Horas', icon: CalendarClock, group: 'Departamento Pessoal', purpose: 'Acumulado de horas positivas e negativas, prazos de compensação e acordos.' },
  { id: 'rh-ferias', title: 'Férias', icon: Calendar, group: 'Departamento Pessoal', purpose: 'Controle de períodos aquisitivos e concessivos, escala anual e abono pecuniário.' },
  { id: 'rh-13-salario', title: '13º Salário', icon: Coins, group: 'Departamento Pessoal', purpose: 'Simulação e pagamento de 1ª e 2ª parcelas, médias de variáveis e provisões.' },
  { id: 'rh-beneficios', title: 'Benefícios', icon: Gift, group: 'Departamento Pessoal', purpose: 'Gestão de VR/VA flexível, assistência médica Bradesco, VT e seguro de vida.' },
  { id: 'rh-afastamentos', title: 'Afastamentos e Licenças', icon: AlertTriangle, group: 'Departamento Pessoal', purpose: 'Controle de atestados médicos, licença maternidade/paternidade e INSS.' },
  { id: 'rh-rescisoes', title: 'Rescisões e Desligamentos', icon: UserMinus, group: 'Departamento Pessoal', purpose: 'Cálculos rescisórios, aviso prévio trabalhado/indenizado, GRRF e TRCT.' },
  { id: 'rh-emprestimos', title: 'Empréstimos e Consignados', icon: CreditCard, group: 'Departamento Pessoal', purpose: 'Gestão de adiantamentos salariais, vales e consignações em folha.' },

  // 3. Encargos e Obrigações (6 submenus)
  { id: 'rh-encargos', title: 'Encargos Trabalhistas', icon: PieChart, group: 'Encargos e Obrigações', purpose: 'Apuração do INSS Patronal (20%), FGTS (8%), RAT/FAP e Sistema S (5.8%).' },
  { id: 'rh-esocial', title: 'eSocial', icon: Send, group: 'Encargos e Obrigações', purpose: 'Central de mensageria oficial de eventos não periódicos e periódicos (S-1200 / S-1210).', badge: 'Ativo', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'rh-fgts-dctf', title: 'FGTS Digital e DCTFWeb', icon: Building, group: 'Encargos e Obrigações', purpose: 'Geração e conciliação do FGTS Digital via Pix Caixa e guias DCTFWeb.' },
  { id: 'rh-seguranca-medicina', title: 'Segurança e Medicina do Trabalho', icon: HeartPulse, group: 'Encargos e Obrigações', purpose: 'Programas ocupacionais PCMSO, PGR, exames ASO e controle de EPIs.' },
  { id: 'rh-obrigacoes-calendario', title: 'Obrigações e Calendário', icon: Calendar, group: 'Encargos e Obrigações', purpose: 'Calendário de prazos legais: FGTS dia 20, DCTFWeb, pagamento 5º dia útil.' },
  { id: 'rh-provisoes', title: 'Provisões Trabalhistas', icon: TrendingUp, group: 'Encargos e Obrigações', purpose: 'Provisões contábeis mensais de férias e 13º salário com encargos patronais.' },

  // 4. Gestão e Desenvolvimento (6 submenus)
  { id: 'rh-treinamentos', title: 'Treinamentos', icon: GraduationCap, group: 'Gestão e Desenvolvimento', purpose: 'Plano de capacitação interna, treinamentos técnicos de bilheteria e vendas.' },
  { id: 'rh-avaliacao-desempenho', title: 'Avaliação de Desempenho', icon: Award, group: 'Gestão e Desenvolvimento', purpose: 'Ciclos de avaliação de competências 90° e 360°, metas e OKRs corporativos.' },
  { id: 'rh-cargos-salarios', title: 'Cargos e Salários', icon: Layers, group: 'Gestão e Desenvolvimento', purpose: 'Tabela de faixas salariais, níveis (Júnior, Pleno, Sênior) e plano de carreira.' },
  { id: 'rh-solicitacoes', title: 'Solicitações Internas', icon: HelpCircle, group: 'Gestão e Desenvolvimento', purpose: 'Central de atendimento ao colaborador para pedidos de declarações e benefícios.' },
  { id: 'rh-portal-colaborador', title: 'Portal do Colaborador', icon: Smartphone, group: 'Gestão e Desenvolvimento', purpose: 'Visão de autosserviço para consulta de holerites, espelho de ponto e férias.' },
  { id: 'rh-clima', title: 'Clima e Pesquisa Organizacional', icon: Smile, group: 'Gestão e Desenvolvimento', purpose: 'Termômetro contínuo de engajamento, satisfação interna e índice eNPS.' },

  // 5. Administração e Controle (6 submenus)
  { id: 'rh-pagamentos', title: 'Pagamentos de Pessoal', icon: CreditCard, group: 'Administração e Controle', purpose: 'Geração de lotes bancários de salários (CNAB 240) e integração com a Tesouraria.' },
  { id: 'rh-integracao-contabil', title: 'Integração Contábil', icon: ArrowRightLeft, group: 'Administração e Controle', purpose: 'Partidas dobradas automáticas no Razão e DRE da Disk Ingressos S.A.' },
  { id: 'rh-relatorios', title: 'Relatórios RH & DP', icon: Download, group: 'Administração e Controle', purpose: 'Catálogo de relatórios analíticos de folha, quadro, absenteísmo e turn-over.' },
  { id: 'rh-documentos', title: 'Documentos e Assinaturas', icon: FolderLock, group: 'Administração e Controle', purpose: 'Repositório de prontuários digitais com assinatura eletrônica e validade jurídica.' },
  { id: 'rh-auditoria', title: 'Auditoria e Histórico', icon: History, group: 'Administração e Controle', purpose: 'Trilha de auditoria das alterações cadastrais e salariais com conformidade LGPD.' },
  { id: 'rh-configuracoes', title: 'Configurações RH & DP', icon: Settings, group: 'Administração e Controle', purpose: 'Parametrização do motor de folha, tabelas vigentes de INSS/IRRF e sindicatos.' },
];

interface Props {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function RhDpModuloView({ activeSection = 'rh-dashboard', onSelectSection }: Props) {
  const [sectionId, setSectionId] = useState<RhSectionId>((activeSection as RhSectionId) || 'rh-dashboard');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);

  // Configuração da Barra Lateral de Estrutura RH: Posição à direita e visual claro
  const [sidebarSide, setSidebarSide] = useState<'right' | 'left'>('right');
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light');

  // Modais de ação
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [isCalculatePayrollModalOpen, setIsCalculatePayrollModalOpen] = useState(false);
  const [isApproveBatchModalOpen, setIsApproveBatchModalOpen] = useState(false);

  // Filtros de colaboradores
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeDepartmentFilter, setEmployeeDepartmentFilter] = useState('all');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('all');

  // Estado da folha
  const [payrollStatus, setPayrollStatus] = useState<'CALCULADA' | 'APROVADA' | 'ENVIADA_FINANCEIRO'>('CALCULADA');

  // Formatador monetário BRL
  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Sincronizar navegação externa
  useEffect(() => {
    if (activeSection) {
      const match = RH_SECTIONS.find((s) => s.id === activeSection);
      if (match) setSectionId(match.id);
    }
  }, [activeSection]);

  const handleSelect = (id: RhSectionId) => {
    setSectionId(id);
    if (onSelectSection) onSelectSection(id);
  };

  const currentSection = useMemo(
    () => RH_SECTIONS.find((s) => s.id === sectionId) || RH_SECTIONS[0],
    [sectionId],
  );

  // Filtragem de seções na busca lateral
  const filteredSections = useMemo(() => {
    if (!sidebarSearch.trim()) return RH_SECTIONS;
    const q = sidebarSearch.toLowerCase();
    return RH_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.purpose.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [sidebarSearch]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, RhSectionDef[]> = {};
    for (const s of filteredSections) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    }
    return groups;
  }, [filteredSections]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const collapseAll = () => {
    const allGroups = ['Gestão de Pessoas', 'Departamento Pessoal', 'Encargos e Obrigações', 'Gestão e Desenvolvimento', 'Administração e Controle'];
    const nextState: Record<string, boolean> = {};
    allGroups.forEach((g) => { nextState[g] = true; });
    setCollapsedGroups(nextState);
  };

  const expandAll = () => {
    setCollapsedGroups({});
  };

  // Base de colaboradores da DiskIngressos
  const [employeesList, setEmployeesList] = useState([
    { id: 'emp-01', code: 'MAT-1001', name: 'Lucas Santana', role: 'Tech Lead / Arquiteto Sênior', department: 'CC-101 TI', grossSalary: 18500.0, admissionDate: '15/03/2022', regime: 'CLT', status: 'Ativo', overtimeBonus: 0.0, inss: 908.85, irrf: 3752.40, benefits: 350.0 },
    { id: 'emp-02', code: 'MAT-1002', name: 'Camila Fernandes', role: 'Engenheira de Banco de Dados', department: 'CC-101 TI', grossSalary: 14000.0, admissionDate: '10/01/2023', regime: 'CLT', status: 'Ativo', overtimeBonus: 0.0, inss: 908.85, irrf: 2514.90, benefits: 350.0 },
    { id: 'emp-03', code: 'MAT-1003', name: 'Dr. Roberto Meirelles', role: 'Contador Chefe Responsável (CRC)', department: 'CC-302 Controladoria', grossSalary: 15500.0, admissionDate: '01/08/2021', regime: 'CLT', status: 'Ativo', overtimeBonus: 0.0, inss: 908.85, irrf: 2927.40, benefits: 350.0 },
    { id: 'emp-04', code: 'MAT-1004', name: 'Juliana Prado', role: 'Gerente Comercial de Produtores', department: 'CC-301 Comercial', grossSalary: 12000.0, admissionDate: '20/06/2023', regime: 'CLT', status: 'Ativo', overtimeBonus: 1500.0, inss: 908.85, irrf: 2377.40, benefits: 350.0 },
    { id: 'emp-05', code: 'MAT-1005', name: 'Marcos Vinicius', role: 'Supervisor de Bilheterias PDV', department: 'CC-201 Operações', grossSalary: 7500.0, admissionDate: '03/11/2022', regime: 'CLT', status: 'Ativo', overtimeBonus: 850.0, inss: 908.85, irrf: 961.15, benefits: 350.0 },
    { id: 'emp-06', code: 'MAT-1006', name: 'Aline Souza', role: 'Analista de Tax & Fiscal Compliance', department: 'CC-401 Fiscal', grossSalary: 8200.0, admissionDate: '15/02/2024', regime: 'CLT', status: 'Ativo', overtimeBonus: 0.0, inss: 908.85, irrf: 1045.20, benefits: 350.0 },
    { id: 'emp-07', code: 'MAT-1007', name: 'Gabriel Medina', role: 'Analista de Suporte ao Produtor Jr.', department: 'CC-201 Operações', grossSalary: 3800.0, admissionDate: '01/09/2026', regime: 'CLT', status: 'Experiência (45d)', overtimeBonus: 320.0, inss: 384.20, irrf: 142.10, benefits: 350.0 },
    { id: 'emp-08', code: 'MAT-1008', name: 'Mariana Duarte', role: 'Estagiária de Controladoria & FP&A', department: 'CC-302 Controladoria', grossSalary: 2200.0, admissionDate: '10/04/2026', regime: 'Estágio', status: 'Ativo', overtimeBonus: 0.0, inss: 0.0, irrf: 0.0, benefits: 250.0 },
    { id: 'emp-09', code: 'MAT-1009', name: 'Rodrigo Becker', role: 'Desenvolvedor Frontend Sênior', department: 'CC-101 TI', grossSalary: 13500.0, admissionDate: '05/05/2023', regime: 'CLT', status: 'Férias', overtimeBonus: 0.0, inss: 908.85, irrf: 2377.40, benefits: 350.0 },
  ]);

  // Form State para Novo Colaborador
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpCpf, setNewEmpCpf] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('CC-101 TI');
  const [newEmpSalary, setNewEmpSalary] = useState('');
  const [newEmpAdmission, setNewEmpAdmission] = useState('2026-10-08');
  const [newEmpRegime, setNewEmpRegime] = useState('CLT');

  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sal = parseFloat(newEmpSalary.replace(/\./g, '').replace(',', '.')) || 4500.0;
    const newRecord = {
      id: `emp-${Date.now()}`,
      code: `MAT-${Math.floor(1010 + Math.random() * 900)}`,
      name: newEmpName.trim(),
      role: newEmpRole.trim(),
      department: newEmpDept,
      grossSalary: sal,
      admissionDate: newEmpAdmission.split('-').reverse().join('/'),
      regime: newEmpRegime,
      status: 'Ativo',
      overtimeBonus: 0.0,
      inss: sal > 7786.02 ? 908.85 : sal * 0.14,
      irrf: sal * 0.15,
      benefits: 350.0,
    };
    setEmployeesList((prev) => [newRecord, ...prev]);
    setIsNewEmployeeModalOpen(false);
    setNotification(`Colaborador ${newEmpName} admitido e cadastrado com sucesso!`);
    setNewEmpName('');
    setNewEmpCpf('');
    setNewEmpEmail('');
    setNewEmpRole('');
    setNewEmpSalary('');
  };

  const handleCalculatePayrollConfirm = () => {
    setIsCalculatePayrollModalOpen(false);
    setPayrollStatus('CALCULADA');
    setNotification('Motor de cálculo da folha processado com sucesso em partidas dobradas!');
  };

  const handleApproveBatchConfirm = () => {
    setIsApproveBatchModalOpen(false);
    setPayrollStatus('ENVIADA_FINANCEIRO');
    setNotification('Lote de pagamentos aprovado e transmitido ao Contas a Pagar do Financeiro Disk (Tesouraria)!');
  };

  // Filtragem da lista de colaboradores
  const filteredEmployees = useMemo(() => {
    return employeesList.filter((emp) => {
      const matchesSearch =
        !employeeSearch.trim() ||
        emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.code.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(employeeSearch.toLowerCase());

      const matchesDept =
        employeeDepartmentFilter === 'all' || emp.department.includes(employeeDepartmentFilter);

      const matchesStatus =
        employeeStatusFilter === 'all' || emp.status.toLowerCase().includes(employeeStatusFilter.toLowerCase());

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employeesList, employeeSearch, employeeDepartmentFilter, employeeStatusFilter]);

  return (
    <div className="space-y-4 font-sans text-slate-900">
      {/* 1. Header Corporativo de RH & DP */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  RH & DP — Recursos Humanos e Departamento Pessoal
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  42 Colaboradores Ativos
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  DiskIngressos S.A.
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Gestão completa de pessoas, folha de pagamento, benefícios, jornada, eSocial e obrigações trabalhistas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Competência: <strong>Outubro / 2026</strong></span>
            </div>

            <button
              onClick={() => setIsNewEmployeeModalOpen(true)}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Colaborador</span>
            </button>

            <button
              onClick={() => setIsCalculatePayrollModalOpen(true)}
              className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Calcular Folha</span>
            </button>
          </div>
        </div>

        {/* Banner de Segregação Patrimonial e Integração */}
        <div className="p-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-xl border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Integração com Financeiro e Contabilidade:</strong> Os custos e encargos de colaboradores são <strong>100% corporativos da DiskIngressos</strong> (alimentando o Contas a Pagar e a Conta DRE 5.1.02), sem se misturar com as obrigações financeiras de produtores ou eventos.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 shrink-0 self-start sm:self-auto">
            Custo Total Folha: R$ 594.530,22
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Grid de Conteúdo: Área Operacional Central + Estrutura Lateral do RH à Direita */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Conteúdo Central da Tela Selecionada (Ocupa 9 colunas na esquerda quando a barra lateral está à direita) */}
        <main
          className={`space-y-4 xl:col-span-9 ${
            sidebarSide === 'right' ? 'xl:order-1 order-2' : 'xl:order-2 order-2'
          }`}
        >
          {/* Header da Subseção Ativa */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>ERP Keeper</span>
                <span>/</span>
                <span>RH & DP</span>
                <span>/</span>
                <span className="font-semibold text-slate-800">{currentSection.group}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <currentSection.icon className="w-5 h-5 text-indigo-600" />
                {currentSection.title}
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {currentSection.purpose}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                Módulo Ativo: <code className="font-mono text-[11px] text-indigo-700">{currentSection.id}</code>
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 🌟 1. TELA: DASHBOARD RH & DP                             */}
          {/* ======================================================== */}
          {sectionId === 'rh-dashboard' && (
            <div className="space-y-4">
              {/* KPIs de Destaque Executivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Quadro de Colaboradores</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">42 Ativos</div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    38 CLT · 4 Estagiários
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Folha Salarial Bruta</span>
                    <DollarSign className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{fmt(348500.0)}</div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Remessa Líquida: <strong>{fmt(282285.0)}</strong>
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Encargos Sociais Patronais</span>
                    <PieChart className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="text-2xl font-bold text-rose-700 mt-1">{fmt(124763.0)}</div>
                  <span className="text-[11px] text-rose-600 font-medium">
                    INSS 20% · FGTS 8% · RAT/S 7.8%
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Provisões Mensais (13º + Férias)</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-700 mt-1">{fmt(94482.22)}</div>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    1/12 avos constitucionais com encargos
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Benefícios Corporativos</span>
                    <Gift className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{fmt(64700.0)}</div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Flash VR/VA · Bradesco Saúde · VT
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs ring-2 ring-indigo-500/10">
                  <div className="flex items-center justify-between text-xs text-indigo-700 font-semibold">
                    <span>Custo Total de Pessoal (DRE)</span>
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-900 mt-1">{fmt(594530.22)}</div>
                  <span className="text-[11px] text-indigo-700 font-bold">
                    Classificação DRE Conta 5.1.02 Disk
                  </span>
                </div>
              </div>

              {/* Seção Central: Pipeline de Contratação + Alertas Trabalhistas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pipeline de Contratação */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      Recrutamento, Seleção & Onboarding
                    </h3>
                    <button
                      onClick={() => handleSelect('rh-recrutamento')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Ver vagas
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold text-blue-700">3</div>
                      <span className="text-slate-500 text-[11px]">Vagas Abertas</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-lg font-bold text-slate-800">8</div>
                      <span className="text-slate-500 text-[11px]">Em Triagem</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="text-lg font-bold text-emerald-700">2</div>
                      <span className="text-emerald-800 text-[11px]">Admissões Agendadas</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="p-2.5 bg-slate-50/80 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">Engenheiro de Software Frontend Sênior</span>
                        <p className="text-[11px] text-slate-500">CC-101 TI · 4 candidatos na etapa técnica</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                        Entrevista Final
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50/80 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">Assistente de Suporte a Produtores</span>
                        <p className="text-[11px] text-slate-500">CC-201 Operações · 2 candidatos em triagem</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                        Triagem
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alertas Trabalhistas e Prazos */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Alertas Trabalhistas & Compliance
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      3 Pendências
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-amber-950">Vencimento de Experiência (45 dias)</span>
                        <p className="text-[11px] text-amber-800">Gabriel Medina (Operações) · Limite: 22/10/2026</p>
                      </div>
                      <button
                        onClick={() => handleSelect('rh-contratos')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-900 cursor-pointer shadow-2xs"
                      >
                        Avaliar
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-blue-950">Programação de Férias Obrigatórias</span>
                        <p className="text-[11px] text-blue-800">Camila Fernandes (TI) · Limite de concessão: 15/11/2026</p>
                      </div>
                      <button
                        onClick={() => handleSelect('rh-ferias')}
                        className="px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-[11px] font-semibold text-blue-900 cursor-pointer shadow-2xs"
                      >
                        Programar
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">Exame Médico Periódico (ASO)</span>
                        <p className="text-[11px] text-slate-500">Lucas Santana (TI) · Vencimento: 30/10/2026</p>
                      </div>
                      <button
                        onClick={() => handleSelect('rh-seguranca-medicina')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 2. TELA: COLABORADORES                                 */}
          {/* ======================================================== */}
          {sectionId === 'rh-colaboradores' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quadro de Colaboradores DiskIngressos</h3>
                  <p className="text-xs text-slate-500">Relação completa de colaboradores ativos, cargos, departamentos e contratos</p>
                </div>
                <button
                  onClick={() => setIsNewEmployeeModalOpen(true)}
                  className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Colaborador</span>
                </button>
              </div>

              {/* Barra de Filtros de Colaboradores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Buscar por Nome, Matrícula ou Cargo</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      placeholder="Ex: Lucas Santana..."
                      className="w-full h-8 pl-8 pr-3 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filtrar Departamento</label>
                  <select
                    value={employeeDepartmentFilter}
                    onChange={(e) => setEmployeeDepartmentFilter(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="all">Todos os Departamentos</option>
                    <option value="TI">CC-101 TI</option>
                    <option value="Operações">CC-201 Operações</option>
                    <option value="Comercial">CC-301 Comercial</option>
                    <option value="Controladoria">CC-302 Controladoria</option>
                    <option value="Fiscal">CC-401 Fiscal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status Contratual</label>
                  <select
                    value={employeeStatusFilter}
                    onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="férias">Férias</option>
                    <option value="experiência">Experiência</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Colaboradores */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                      <th className="py-2.5 px-3">Matrícula</th>
                      <th className="py-2.5 px-3">Colaborador</th>
                      <th className="py-2.5 px-3">Cargo / Função</th>
                      <th className="py-2.5 px-3">Centro de Custo</th>
                      <th className="py-2.5 px-3">Admissão</th>
                      <th className="py-2.5 px-3 text-right">Salário Bruto</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{emp.code}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                              {emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">{emp.name}</span>
                              <span className="block text-[10px] text-slate-400">{emp.regime}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{emp.role}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{emp.department}</td>
                        <td className="py-2.5 px-3 text-slate-600">{emp.admissionDate}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{fmt(emp.grossSalary)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'Ativo'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : emp.status === 'Férias'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                handleSelect('rh-folha');
                                setNotification(`Abrindo ficha financeira e holerite de ${emp.name}`);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Ver Holerite"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                handleSelect('rh-ponto');
                                setNotification(`Consultando espelho de ponto de ${emp.name}`);
                              }}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Ver Ponto"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 3. TELA: FOLHA DE PAGAMENTO                             */}
          {/* ======================================================== */}
          {sectionId === 'rh-folha' && (
            <div className="space-y-4">
              {/* Stepper Operacional da Folha */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Fluxo de Fechamento da Competência 10/2026</h3>
                    <p className="text-xs text-slate-500">Cálculo, conferência fiscal, aprovação e integração com o Financeiro Disk</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCalculatePayrollModalOpen(true)}
                      className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Recalcular</span>
                    </button>
                    <button
                      onClick={() => setIsApproveBatchModalOpen(true)}
                      className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Aprovar & Transmitir ao Financeiro</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900">
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1. Apuração Ponto
                    </span>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Concluído (98.2%)</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900">
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 2. Cálculo Proventos
                    </span>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Folha Processada</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-900 ring-2 ring-blue-500/10">
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" /> 3. Conferência
                    </span>
                    <p className="text-[10px] text-blue-700 mt-0.5">Em Validação Fiscal</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                    <span className="font-bold">4. Aprovação Diretoria</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Aguardando lote</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                    <span className="font-bold">5. Financeiro & Razão</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Remessa bancária</p>
                  </div>
                </div>
              </div>

              {/* Indicadores Consolidados da Folha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Proventos Brutos</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{fmt(348500.0)}</div>
                  <span className="text-[11px] text-slate-500">Salários base + horas extras</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Descontos Legais (INSS/IRRF)</span>
                  <div className="text-2xl font-bold text-rose-700 mt-1">{fmt(66215.0)}</div>
                  <span className="text-[11px] text-rose-600">Retenções a recolher em guia</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-xs ring-2 ring-emerald-500/10">
                  <span className="text-xs text-emerald-700 font-semibold">Salários Líquidos a Pagar</span>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">{fmt(282285.0)}</div>
                  <span className="text-[11px] text-emerald-700 font-bold">Lote bancário Itaú CNAB 240</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Encargos Patronais Disk</span>
                  <div className="text-2xl font-bold text-indigo-700 mt-1">{fmt(124763.0)}</div>
                  <span className="text-[11px] text-indigo-600 font-medium">INSS + FGTS + RAT + S</span>
                </div>
              </div>

              {/* Tabela Analítica da Folha de Pagamento */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Espelho Analítico da Folha por Colaborador</h3>
                    <p className="text-xs text-slate-500">Discriminação de proventos, retenções e valor líquido final</p>
                  </div>
                  <button
                    onClick={() => setNotification('Exportando espelho da folha em Excel/PDF...')}
                    className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exportar Relatório</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                        <th className="py-2.5 px-3">Matrícula</th>
                        <th className="py-2.5 px-3">Colaborador</th>
                        <th className="py-2.5 px-3">Centro de Custo</th>
                        <th className="py-2.5 px-3 text-right">Salário Base</th>
                        <th className="py-2.5 px-3 text-right">Horas Extras</th>
                        <th className="py-2.5 px-3 text-right">INSS Retido</th>
                        <th className="py-2.5 px-3 text-right">IRRF Retido</th>
                        <th className="py-2.5 px-3 text-right">Salário Líquido</th>
                        <th className="py-2.5 px-3 text-center">Holerite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employeesList.map((emp) => {
                        const net = emp.grossSalary + emp.overtimeBonus - emp.inss - emp.irrf - emp.benefits;
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{emp.code}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{emp.name}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{emp.department}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-800">{fmt(emp.grossSalary)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-700">{emp.overtimeBonus > 0 ? fmt(emp.overtimeBonus) : '—'}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-rose-600">{emp.inss > 0 ? fmt(emp.inss) : '—'}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-rose-600">{emp.irrf > 0 ? fmt(emp.irrf) : '—'}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">{fmt(net)}</td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => setNotification(`Gerando holerite PDF de ${emp.name} para download...`)}
                                className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-blue-700 flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-2xs"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Holerite</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 4. TELAS PADRONIZADAS DOS DEMAIS 30 SUBMENUS          */}
          {/* ======================================================== */}
          {![
            'rh-dashboard',
            'rh-colaboradores',
            'rh-folha',
          ].includes(sectionId) && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentSection.title}</h3>
                  <p className="text-xs text-slate-500">{currentSection.purpose}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Módulo Operacional RH & DP
                  </span>
                  <button
                    onClick={() => setNotification(`Ação executada com sucesso no módulo ${currentSection.title}`)}
                    className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Registro</span>
                  </button>
                </div>
              </div>

              {/* Seção com KPIs específicos por tela */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium">Status Operacional</span>
                  <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Ativo & Conectado
                  </div>
                  <span className="text-[10px] text-slate-400">Ambiente DiskIngressos S.A.</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium">Última Sincronização</span>
                  <div className="text-base font-bold text-blue-700 mt-0.5">Hoje, às 14:30</div>
                  <span className="text-[10px] text-slate-400">Banco de Dados PostgreSQL</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium">Segurança & Auditoria</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Conforme LGPD
                  </div>
                  <span className="text-[10px] text-slate-400">Trilha auditável imutável</span>
                </div>
              </div>

              {/* Tabela de Dados Padronizada para Cada Submenu */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200 font-semibold text-slate-700 text-xs flex items-center justify-between">
                  <span>Registros e Operações — {currentSection.title}</span>
                  <span className="text-[11px] text-slate-500 font-normal">Exibindo registros da empresa</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-white">
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Descrição / Operação</th>
                        <th className="py-2.5 px-3">Responsável / Beneficiário</th>
                        <th className="py-2.5 px-3 text-right">Referência / Valor</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { code: `${currentSection.id.toUpperCase()}-001`, desc: `Registro homologado de ${currentSection.title}`, resp: 'Dr. Roberto Meirelles (Controladoria)', val: '42 Colaboradores', status: 'HOMOLOGADO' },
                        { code: `${currentSection.id.toUpperCase()}-002`, desc: `Validação e conferência de ${currentSection.title}`, resp: 'Lucas Santana (TI)', val: '100% Conforme', status: 'PROCESSADO' },
                        { code: `${currentSection.id.toUpperCase()}-003`, desc: `Parâmetro ativo do módulo ${currentSection.title}`, resp: 'Aline Souza (Fiscal & DP)', val: 'Ativo Out/2026', status: 'ATIVO' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{row.code}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">{row.desc}</td>
                          <td className="py-2.5 px-3 text-slate-600">{row.resp}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">{row.val}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* 🌟 ESTRUTURA LATERAL DO RH & DP — POSICIONADA À DIREITA, MAIS LONGA E VISUAL CLARO 🌟 */}
        {/* ========================================================================= */}
        <aside
          className={`xl:col-span-3 space-y-3 sticky top-4 self-start ${
            sidebarSide === 'right' ? 'xl:order-2 order-1' : 'xl:order-1 order-1'
          }`}
        >
          <div
            className={`rounded-2xl p-4 shadow-sm border transition-colors space-y-3.5 ${
              sidebarTheme === 'light'
                ? 'bg-white text-slate-800 border-slate-200/90'
                : 'bg-slate-900 text-slate-100 border-slate-800'
            }`}
          >
            {/* Header da Barra Lateral */}
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                sidebarTheme === 'light' ? 'border-slate-100' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${
                    sidebarTheme === 'light'
                      ? 'bg-indigo-50 border border-indigo-200/80 text-indigo-600'
                      : 'bg-indigo-900/40 border border-indigo-700/50 text-indigo-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        sidebarTheme === 'light' ? 'text-slate-900' : 'text-slate-200'
                      }`}
                    >
                      Estrutura RH & DP
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        sidebarTheme === 'light'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                          : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                      }`}
                    >
                      33 Submenus
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-medium ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    5 Grupos Corporativos Disk
                  </p>
                </div>
              </div>

              {/* Controles de Posição (Direita/Esquerda) e Tema (Claro/Escuro) */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSidebarSide((s) => (s === 'right' ? 'left' : 'right'))}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    sidebarTheme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                  }`}
                  title={`Mover estrutura lateral para a ${sidebarSide === 'right' ? 'Esquerda' : 'Direita'}`}
                >
                  {sidebarSide === 'right' ? (
                    <PanelRight className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <PanelLeft className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSidebarTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    sidebarTheme === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-amber-600 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-yellow-400 border-slate-700'
                  }`}
                  title={`Alternar visual para ${sidebarTheme === 'light' ? 'Escuro' : 'Claro'}`}
                >
                  {sidebarTheme === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Ações de Expandir/Recolher Todos */}
            <div
              className={`flex items-center justify-between px-1 text-[11px] font-medium ${
                sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <button
                type="button"
                onClick={collapseAll}
                className="hover:text-indigo-600 cursor-pointer transition-colors"
              >
                Recolher todos
              </button>
              <span className="opacity-40">·</span>
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-indigo-600 cursor-pointer transition-colors"
              >
                Expandir todos
              </button>
              <span className="opacity-40">·</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  sidebarTheme === 'light'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sidebarSide === 'right' ? 'Painel à Direita' : 'Painel à Esquerda'}
              </span>
            </div>

            {/* Busca Rápida de Menus */}
            <div className="relative">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${
                  sidebarTheme === 'light' ? 'text-slate-400' : 'text-slate-400'
                }`}
              />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Filtrar 33 submenus..."
                className={`w-full h-8 pl-8 pr-7 rounded-xl text-xs transition-colors focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
                  sidebarTheme === 'light'
                    ? 'bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 text-slate-800 placeholder-slate-400'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500'
                }`}
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Lista dos 5 Grupos Expansíveis — ALTURA ESTENDIDA ("MAIS LONGA") */}
            <div className="space-y-3.5 max-h-[calc(100vh-140px)] min-h-[820px] overflow-y-auto pr-1 select-none no-scrollbar">
              {Object.entries(groupedSections).map(([groupName, sections]) => {
                const isCollapsed = !!collapsedGroups[groupName];
                return (
                  <div key={groupName} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupName)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                        sidebarTheme === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border-slate-200/60'
                          : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{groupName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                            sidebarTheme === 'light'
                              ? 'bg-white border border-slate-200 text-slate-600 shadow-2xs'
                              : 'bg-slate-900 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {sections.length}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-0.5 pl-0.5">
                        {sections.map((item) => {
                          const Icon = item.icon;
                          const isCurrent = sectionId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-xs shadow-indigo-600/25 ring-1 ring-indigo-500'
                                  : sidebarTheme === 'light'
                                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Icon
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isCurrent
                                      ? 'text-white'
                                      : sidebarTheme === 'light'
                                      ? 'text-slate-400 group-hover:text-indigo-600'
                                      : 'text-slate-400'
                                  }`}
                                />
                                <span className="truncate">{item.title}</span>
                              </div>
                              {item.badge ? (
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    isCurrent
                                      ? 'bg-white/20 text-white border border-white/20'
                                      : item.badgeColor ||
                                        (sidebarTheme === 'light'
                                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                                          : 'bg-blue-100 text-blue-800')
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              ) : (
                                <ChevronRight
                                  className={`w-3 h-3 shrink-0 ${
                                    isCurrent
                                      ? 'text-white'
                                      : sidebarTheme === 'light'
                                      ? 'text-slate-300'
                                      : 'text-slate-500'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Card de Resumo de Governança RH no Rodapé da Barra Lateral */}
              <div className="pt-2">
                <div
                  className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                    sidebarTheme === 'light'
                      ? 'bg-gradient-to-br from-indigo-50/60 via-slate-50 to-blue-50/50 border-indigo-100/80'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold flex items-center gap-1.5 ${
                        sidebarTheme === 'light' ? 'text-slate-800' : 'text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Governança RH Disk
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        sidebarTheme === 'light'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-indigo-900/80 text-indigo-300'
                      }`}
                    >
                      CLT / DP
                    </span>
                  </div>
                  <p
                    className={`text-[10px] leading-tight ${
                      sidebarTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    42 colaboradores ativos com despesas classificadas na DRE Conta 5.1.02. Segregação patrimonial ativa.
                  </p>
                  <div
                    className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${
                      sidebarTheme === 'light'
                        ? 'text-slate-600 border-indigo-100/60'
                        : 'text-slate-400 border-slate-700/60'
                    }`}
                  >
                    <span>Posição: <strong>{sidebarSide === 'right' ? 'À Direita' : 'À Esquerda'}</strong></span>
                    <span>Visual: <strong>{sidebarTheme === 'light' ? 'Claro' : 'Escuro'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. MODAIS INTERATIVOS */}

      {/* MODAL 1: NOVO COLABORADOR */}
      {isNewEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateEmployeeSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Admissão de Novo Colaborador (DiskIngressos)
              </h3>
              <button type="button" onClick={() => setIsNewEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Ex: Amanda Silva Castro"
                  className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    required
                    value={newEmpCpf}
                    onChange={(e) => setNewEmpCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    placeholder="amanda@diskingressos.com.br"
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo / Função</label>
                  <input
                    type="text"
                    required
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                    placeholder="Ex: Analista de BI"
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Centro de Custo</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="CC-101 TI">CC-101 - TI & Cloud</option>
                    <option value="CC-201 Operações">CC-201 - Operações & PDV</option>
                    <option value="CC-301 Comercial">CC-301 - Comercial</option>
                    <option value="CC-302 Controladoria">CC-302 - Controladoria</option>
                    <option value="CC-401 Fiscal">CC-401 - Fiscal & Compliance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salário Bruto (R$)</label>
                  <input
                    type="text"
                    required
                    value={newEmpSalary}
                    onChange={(e) => setNewEmpSalary(e.target.value)}
                    placeholder="5500,00"
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Admissão</label>
                  <input
                    type="date"
                    required
                    value={newEmpAdmission}
                    onChange={(e) => setNewEmpAdmission(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Regime</label>
                  <select
                    value={newEmpRegime}
                    onChange={(e) => setNewEmpRegime(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="CLT">CLT</option>
                    <option value="Estágio">Estágio</option>
                    <option value="CLT (Experiência)">Experiência 45d</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewEmployeeModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar Admissão
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: CALCULAR FOLHA DE PAGAMENTO */}
      {isCalculatePayrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Processar Motor da Folha de Pagamento
              </h3>
              <button type="button" onClick={() => setIsCalculatePayrollModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                Você está prestes a executar o cálculo automatizado da <strong>Competência Outubro / 2026</strong> para os <strong>42 colaboradores</strong> ativos.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Espelho de Ponto:</span>
                  <span className="font-bold text-emerald-700">98.2% Apurado</span>
                </div>
                <div className="flex justify-between">
                  <span>Tabela INSS / IRRF:</span>
                  <span className="font-bold text-slate-800">RFB Vigente 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Partidas Dobradas Contábeis:</span>
                  <span className="font-bold text-blue-700">Ativa (Razão Disk)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCalculatePayrollModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCalculatePayrollConfirm}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirmar e Processar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: APROVAR E TRANSMITIR LOTE DE PAGAMENTOS */}
      {isApproveBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Aprovação e Transmissão Financeira da Folha
              </h3>
              <button type="button" onClick={() => setIsApproveBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                Confirma a aprovação da Folha de Outubro / 2026 e o envio dos títulos para a <strong>Tesouraria / Contas a Pagar do Financeiro Disk</strong>?
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium space-y-1">
                <div className="flex justify-between">
                  <span>Valor Líquido dos Salários:</span>
                  <span className="font-bold">{fmt(282285.0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Encargos Trabalhistas a Recolher:</span>
                  <span className="font-bold">{fmt(124763.0)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 text-sm">
                  <span>Total Transmitido:</span>
                  <span className="font-bold">{fmt(407048.0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsApproveBatchModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApproveBatchConfirm}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Aprovar & Transmitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
