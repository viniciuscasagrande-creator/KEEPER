# Keeper — Enterprise Resource Planning (ERP v1)

Plataforma empresarial modular, multi-tenant e multiempresa construída do zero, seguindo os princípios de **Domain-Driven Design (DDD)**, **Clean Architecture**, **Event-Driven Architecture (Outbox Pattern)** e **Strict Accounting Immutability (Partidas Dobradas)**.

---

## 🏛️ Arquitetura do Sistema

```text
┌──────────────────────────────────────────────────────────────┐
│                        KEEPER ERP                            │
├──────────────────────────────────────────────────────────────┤
│                         EXPERIENCE                           │
│  React 18 + Vite + Tailwind CSS (NetSuite Executive Shell)   │
├──────────────────────────────────────────────────────────────┤
│                            CORE                              │
│  Auth (JWT/RBAC) │ Tenants │ Users │ Companies │ Audit Logs  │
│  Workflow Engine │ Declarative Rule Engine (Json-Logic)      │
├──────────────────────────────────────────────────────────────┤
│                          BUSINESS                            │
│  Financeiro │ Contábil │ Fiscal │ RH │ Compras │ Estoque     │
│  Vendas │ CRM │ Contratos │ Projetos │ Ativos │ Integrações  │
├──────────────────────────────────────────────────────────────┤
│                       INFRASTRUCTURE                         │
│  PostgreSQL 16 (15 Schemas) │ Prisma ORM │ RabbitMQ │ Redis  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Estrutura do Monorepo

```text
keeper/
├── apps/
│   ├── api/            # Backend REST API (NestJS 11 + Swagger OpenAPI + Problem Details RFC 7807)
│   ├── web/            # Frontend Web (React 18 + Vite + Tailwind CSS + Lucide Icons)
│   └── worker/         # Background Worker (Outbox Pattern Relay + Agendamento de Tarefas)
├── packages/
│   ├── auth/           # Utilitários de autenticação, JWT guards, RBAC e PasswordHasher
│   ├── database/       # Prisma multi-schema ORM, extensões multi-tenant e DDL PostgreSQL
│   ├── events/         # Catálogo de Domain Events e interfaces de Outbox
│   ├── rules/          # Motor de regras declarativo baseado em Json-Logic
│   ├── shared/         # Primitivas DDD, AppError, Result/Either, paginação e filtros
│   └── tsconfig/       # Configurações TypeScript compartilhadas
├── infrastructure/
│   └── postgres/       # Script DDL oficial (init.sql) com 15 schemas e triggers de imutabilidade
├── docker/
│   └── docker-compose.yml # PostgreSQL 16 Alpine, Redis 7 e RabbitMQ 3.13
└── docs/               # Blueprints técnicos oficiais e documentação de arquitetura
```

---

## 🗄️ Esquemas de Banco de Dados (PostgreSQL 16)

O banco de dados é particionado logicamente em **15 schemas** isolados para garantir limites claros de domínio (*Bounded Contexts*):

| Schema | Propósito | Principais Entidades |
| :--- | :--- | :--- |
| `core` | Fundação da plataforma e segurança | `tenants`, `companies`, `branches`, `users`, `roles`, `permissions`, `audit_logs`, `rules`, `workflows`, `domain_events` |
| `financeiro` | Gestão de tesouraria e liquidez | `financial_accounts`, `payable_titles`, `receivable_titles`, `financial_movements`, `bank_statements` |
| `contabil` | Razão geral e partidas dobradas | `accounting_accounts`, `accounting_periods`, `journal_entries`, `journal_lines`, `journal_reversals` |
| `fiscal` | Documentos fiscais e tributos | `fiscal_tax_rules`, `fiscal_documents`, `fiscal_document_items` |
| `rh` | Gestão de pessoas e folha | `departments`, `positions`, `employees`, `payrolls`, `payroll_items`, `payroll_events` |
| `compras` | Suprimentos e compras | `purchase_requests`, `purchase_orders`, `purchase_order_items` |
| `estoque` | Controle físico e centros de distribuição | `products`, `warehouses`, `stock_balances`, `stock_movements` |
| `vendas` | Faturamento comercial | `sales_orders`, `sales_order_items` |
| `crm` | Relacionamento e pipeline | `customers`, `leads`, `opportunities` |
| `contratos` | Contratos de clientes e fornecedores | `contracts`, `contract_amendments` |
| `projetos` | Gestão de projetos e horas | `projects`, `project_tasks`, `project_members` |
| `ativos` | Ativos fixos e imobilizado | `fixed_assets`, `asset_depreciations` |
| `servicos` | Ordens de serviços prestados | `service_orders`, `service_order_items` |
| `bi` | Vistas materializadas e indicadores | Snapshots consolidados |
| `integracoes` | Webhooks e conectores externos | `integrations`, `webhooks`, `webhook_deliveries` |

> [!IMPORTANT]
> **Imutabilidade Contábil:** O Razão Geral (`contabil.journal_entries` e `contabil.journal_lines`) é protegido por trigger PostgreSQL (`trg_immutable_journal_entries`) contra `UPDATE` ou `DELETE`. Retificações são realizadas exclusivamente através de estornos rastreados (`journal_reversals`).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 20+ (recomendado Node 22+)
- pnpm 10+ (`npm install -g pnpm`)
- PostgreSQL 16 (ou via Docker Compose)

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Subir Serviços de Infraestrutura (Opcional se usar PostgreSQL local)
```bash
cd docker
docker compose up -d
```
*O script `init.sql` com todos os 15 schemas e tabelas é montado automaticamente no primeiro boot.*

### 3. Gerar Prisma Client
```bash
pnpm db:generate
```

### 4. Compilar Todos os Pacotes (Turborepo)
```bash
pnpm build
```

### 5. Iniciar em Desenvolvimento
```bash
# Iniciar todos os serviços simultaneamente
pnpm dev

# Ou executar serviços individualmente:
pnpm --filter @erp/api dev      # Backend na porta 4000 (Swagger: /api/docs)
pnpm --filter @erp/web dev      # Frontend na porta 3000
pnpm --filter @erp/worker dev   # Worker de Outbox
```

---

## 🖥️ Portais e Acessos

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost:3000` | NetSuite Executive Shell com navegação horizontal e painel corporativo |
| **API Docs (Swagger)** | `http://localhost:4000/api/docs` | Documentação OpenAPI interativa de todos os módulos |
| **RabbitMQ Management** | `http://localhost:15672` | Painel de mensageria (guest/guest) |

---

## 🛡️ Segurança e Governança
- **Autenticação:** JWT Bearer com Tokens de Acesso (1h) e Refresh Tokens (7d).
- **Autorização:** RBAC (`@RequirePermissions`) com validação granular por `modulo.recurso.acao`.
- **Multi-Tenancy:** Isolamento lógico via `tenant_id` garantido em nível de modelo Prisma e triggers PostgreSQL.
- **Trilha de Auditoria:** Registro obrigatório de todas as mutações com endereço IP, User-Agent e diferencial de payload (antes/depois).
