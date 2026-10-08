# Blueprint Técnico de Banco de Dados: PostgreSQL ERP v1

> **Status:** Especificação Oficial de Banco de Dados do ERP v1  
> **SGBD Alvo:** PostgreSQL 16+  
> **Padrão de Tenancy:** Particionamento Lógico via `tenant_id` + Row Level Security (RLS) + Schemas por Domínio  
> **Precisão Monetária:** `NUMERIC(18, 4)`  
> **Imutabilidade Contábil:** Triggers de proteção estrita contra `UPDATE` e `DELETE` em lançamentos e partidas  

---

## 1. Estratégia de Schemas e Convenções Globais

Para garantir isolamento rigoroso entre os módulos e evitar dependências acidentais, o banco de dados é segmentado em **PostgreSQL Schemas**:

```text
erp_db
├── core              # Tenancy, Organização, IAM, Workflow, Regras, Auditoria, Outbox
├── financeiro        # Títulos, Parcelas, Tesouraria, Meios de Pagamento, Conciliação, Orçamento
├── contabil          # Plano de Contas, Razão Imutável, Partidas Dobradas, Períodos, Fechamento
├── fiscal            # Documentos Fiscais (NF-e/NFS-e), Impostos, CFOP, Apurações, SPED
├── rh                # Colaboradores, Ponto Eletrônico, Férias, Folha de Pagamento, eSocial
├── compras           # Requisições, Cotações, Pedidos de Compra, Homologação de Fornecedores
├── estoque           # Produtos, SKUs, Armazéns, Kardex, Custo Médio / FIFO, Inventário
├── vendas_crm        # CRM (Leads, Oportunidades), Propostas, Pedidos de Venda, Tabelas de Preço
├── contratos_projetos_ativos # Contratos & Reajustes, Projetos & Tarefas, Ativos Imobilizados
└── integracoes       # Integration Hub, Credenciais bancárias/Open Finance, Webhooks, Delivery Logs
```

### 1.1 Convenções de Nomenclatura
- **Tabelas e Colunas:** `snake_case` (ex: `payment_orders`, `total_amount`).
- **Chaves Primárias (PK):** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Chaves Estrangeiras (FK):** `[tabela_singular]_id UUID REFERENCES ...`.
- **Campos de Controle Obrigatórios em Toda Tabela de Negócio:**
  - `tenant_id UUID NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL`
  - `version INT DEFAULT 1 NOT NULL` (concorrência otimista)
- **Campos Monetários:** `NUMERIC(18, 4)` para valores brutos/cálculos e `NUMERIC(18, 2)` para apresentação/baixas.
- **Tipos Temporais:** Sempre `TIMESTAMP WITH TIME ZONE` (`TIMESTAMPTZ`), garantindo suporte multi-fuso horário para empresas em diferentes regiões.

---

## 2. Schema `core` (Plataforma Base)

### 2.1 Enums do Core
```sql
CREATE TYPE core.tenant_status AS ENUM ('ACTIVE', 'SUSPENDED', 'CANCELLED');
CREATE TYPE core.user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
CREATE TYPE core.audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'EXECUTE', 'APPROVE', 'REJECT', 'REVERSE');
CREATE TYPE core.outbox_status AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED');
CREATE TYPE core.workflow_status AS ENUM ('PENDING', 'RUNNING', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE core.approval_task_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
```

### 2.2 Tabelas Organizacionais e Multi-Tenant

#### `core.tenants`
```sql
CREATE TABLE core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    status core.tenant_status DEFAULT 'ACTIVE' NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_tenants_slug ON core.tenants(slug);
```

#### `core.companies`
```sql
CREATE TABLE core.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    corporate_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    tax_id VARCHAR(32) NOT NULL, -- CNPJ ou ID Fiscal Internacional
    state_registration VARCHAR(32),
    municipal_registration VARCHAR(32),
    currency VARCHAR(3) DEFAULT 'BRL' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_company_tax_id_per_tenant UNIQUE (tenant_id, tax_id)
);

CREATE INDEX idx_companies_tenant ON core.companies(tenant_id);
```

#### `core.branches`
```sql
CREATE TABLE core.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL, -- Ex: "0001", "FIL-SP"
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(32) NOT NULL,
    is_headquarters BOOLEAN DEFAULT FALSE NOT NULL,
    address JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_branch_code_per_company UNIQUE (company_id, code)
);

CREATE INDEX idx_branches_tenant_company ON core.branches(tenant_id, company_id);
```

#### `core.departments` & `core.cost_centers`
```sql
CREATE TABLE core.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    manager_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_department_code UNIQUE (company_id, code)
);

CREATE TABLE core.cost_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES core.cost_centers(id) ON DELETE SET NULL,
    code VARCHAR(64) NOT NULL, -- Ex: "1.01.002"
    name VARCHAR(128) NOT NULL,
    is_synthetic BOOLEAN DEFAULT FALSE NOT NULL, -- Sintético (agrupador) ou Analítico (recebe lançamentos)
    accepts_entries BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_cost_center_code UNIQUE (company_id, code)
);

CREATE INDEX idx_cost_centers_lookup ON core.cost_centers(tenant_id, company_id, code);
```

### 2.3 Segurança, Identidade e RBAC/ABAC

#### `core.users`, `core.roles`, `core.permissions`
```sql
CREATE TABLE core.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(32),
    status core.user_status DEFAULT 'ACTIVE' NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    mfa_secret VARCHAR(128),
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    lockout_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_user_email_per_tenant UNIQUE (tenant_id, email)
);

CREATE TABLE core.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL, -- Ex: "FIN_DIRECTOR", "ACCOUNTANT_CHIEF"
    name VARCHAR(128) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_role_code_per_tenant UNIQUE (tenant_id, code)
);

CREATE TABLE core.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(128) NOT NULL UNIQUE, -- Ex: "finance:payables:approve"
    module VARCHAR(32) NOT NULL,
    resource VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE core.role_permissions (
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES core.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE core.user_accesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_user_branch_role UNIQUE (user_id, branch_id, role_id)
);

CREATE INDEX idx_user_accesses_user ON core.user_accesses(user_id);
CREATE INDEX idx_user_accesses_tenant_company ON core.user_accesses(tenant_id, company_id);
```

### 2.4 Auditoria, Regras, Workflow e Outbox

#### `core.audit_logs` & `core.security_logs`
```sql
CREATE TABLE core.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID REFERENCES core.companies(id) ON DELETE SET NULL,
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    entity_name VARCHAR(128) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    action core.audit_action NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address INET,
    user_agent TEXT,
    justification TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_lookup ON core.audit_logs(tenant_id, entity_name, entity_id);
CREATE INDEX idx_audit_logs_created_at ON core.audit_logs(created_at);
```

#### `core.rule_definitions`
```sql
CREATE TABLE core.rule_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(128) NOT NULL, -- Ex: "finance.payable.payment_requested"
    priority INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    conditions JSONB NOT NULL, -- JSON-logic schema
    actions JSONB NOT NULL,    -- Array de ações e parâmetros
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_rule_trigger ON core.rule_definitions(tenant_id, trigger_event, is_active, priority DESC);
```

#### `core.workflow_definitions`, `core.workflow_instances`, `core.approval_tasks`
```sql
CREATE TABLE core.workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Definição das etapas, alçadas e papéis
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_workflow_code_per_tenant UNIQUE (tenant_id, code)
);

CREATE TABLE core.workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    workflow_definition_id UUID NOT NULL REFERENCES core.workflow_definitions(id) ON DELETE RESTRICT,
    entity_type VARCHAR(64) NOT NULL, -- Ex: "FINANCIAL_TITLE", "PURCHASE_ORDER"
    entity_id VARCHAR(64) NOT NULL,
    current_step INT DEFAULT 1 NOT NULL,
    status core.workflow_status DEFAULT 'RUNNING' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE core.approval_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    instance_id UUID NOT NULL REFERENCES core.workflow_instances(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    assigned_role_id UUID REFERENCES core.roles(id) ON DELETE SET NULL,
    assigned_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    status core.approval_task_status DEFAULT 'PENDING' NOT NULL,
    decision_at TIMESTAMPTZ,
    decision_by_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_approval_tasks_pending ON core.approval_tasks(tenant_id, status) WHERE status = 'PENDING';
```

#### `core.outbox_events` (Transactional Outbox Pattern)
```sql
CREATE TABLE core.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(128) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    status core.outbox_status DEFAULT 'PENDING' NOT NULL,
    retry_count INT DEFAULT 0 NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_pending ON core.outbox_events(status, created_at) WHERE status = 'PENDING';
```

---

## 3. Schema `financeiro` (Gestão Financeira & Tesouraria)

### 3.1 Enums do Financeiro
```sql
CREATE TYPE financeiro.title_type AS ENUM ('PAYABLE', 'RECEIVABLE');
CREATE TYPE financeiro.title_status AS ENUM ('DRAFT', 'OPEN', 'AWAITING_APPROVAL', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED', 'REVERSED');
CREATE TYPE financeiro.installment_status AS ENUM ('PENDING', 'SCHEDULED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');
CREATE TYPE financeiro.payment_method AS ENUM ('PIX', 'TED', 'DOC', 'BOLETO', 'TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH');
CREATE TYPE financeiro.payment_order_status AS ENUM ('PENDING', 'SCHEDULED', 'CONFIRMED', 'FAILED', 'REVERSED');
CREATE TYPE financeiro.reconciliation_status AS ENUM ('UNRECONCILED', 'EXACT_MATCH', 'SUGGESTED_MATCH', 'MANUAL_MATCH', 'IGNORED');
```

### 3.2 Tabelas de Entidades de Negócio e Bancos

#### `financeiro.financial_entities` (Clientes, Fornecedores e Parceiros)
```sql
CREATE TABLE financeiro.financial_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    entity_type VARCHAR(32) NOT NULL, -- 'SUPPLIER', 'CUSTOMER', 'BOTH', 'PARTNER'
    tax_id VARCHAR(32) NOT NULL, -- CPF ou CNPJ
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(32),
    address JSONB DEFAULT '{}'::jsonb NOT NULL,
    bank_details JSONB DEFAULT '[]'::jsonb NOT NULL,
    pix_key VARCHAR(128),
    credit_limit NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_entity_tax_id UNIQUE (tenant_id, tax_id)
);

CREATE INDEX idx_fin_entities_lookup ON financeiro.financial_entities(tenant_id, entity_type, tax_id);
```

#### `financeiro.bank_accounts`
```sql
CREATE TABLE financeiro.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    bank_code VARCHAR(16) NOT NULL, -- Ex: '001', '341', '033'
    bank_name VARCHAR(128) NOT NULL,
    agency_number VARCHAR(16) NOT NULL,
    agency_digit VARCHAR(4),
    account_number VARCHAR(32) NOT NULL,
    account_digit VARCHAR(4),
    account_type VARCHAR(32) DEFAULT 'CHECKING' NOT NULL, -- 'CHECKING', 'SAVINGS', 'INVESTMENT'
    description VARCHAR(128) NOT NULL,
    current_balance NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    accounting_account_id UUID, -- Chave de amarração com plano de contas
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL
);

CREATE INDEX idx_bank_accounts_tenant ON financeiro.bank_accounts(tenant_id, company_id);
```

### 3.3 Títulos, Parcelas e Liquidação

#### `financeiro.financial_titles`
```sql
CREATE TABLE financeiro.financial_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    title_type financeiro.title_type NOT NULL,
    document_number VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL REFERENCES financeiro.financial_entities(id) ON DELETE RESTRICT,
    category_id UUID,
    issue_date DATE NOT NULL,
    competence_date DATE NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    discount_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    fine_penalty_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    net_amount NUMERIC(18, 2) NOT NULL,
    status financeiro.title_status DEFAULT 'OPEN' NOT NULL,
    description TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT chk_title_amount_positive CHECK (total_amount > 0)
);

CREATE INDEX idx_titles_search ON financeiro.financial_titles(tenant_id, company_id, title_type, status, issue_date);
```

#### `financeiro.title_installments`
```sql
CREATE TABLE financeiro.title_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    title_id UUID NOT NULL REFERENCES financeiro.financial_titles(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    original_amount NUMERIC(18, 2) NOT NULL,
    balance_remaining NUMERIC(18, 2) NOT NULL,
    paid_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    status financeiro.installment_status DEFAULT 'PENDING' NOT NULL,
    barcode VARCHAR(128),
    pix_qr_code TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_installment_per_title UNIQUE (title_id, installment_number)
);

CREATE INDEX idx_installments_due ON financeiro.title_installments(tenant_id, due_date, status);
```

#### `financeiro.title_cost_allocations` (Rateio de Centro de Custo)
```sql
CREATE TABLE financeiro.title_cost_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    title_id UUID NOT NULL REFERENCES financeiro.financial_titles(id) ON DELETE CASCADE,
    cost_center_id UUID NOT NULL REFERENCES core.cost_centers(id) ON DELETE RESTRICT,
    percentage NUMERIC(5, 2) NOT NULL, -- Ex: 50.00
    allocated_amount NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_allocation_percentage CHECK (percentage > 0 AND percentage <= 100)
);
```

#### `financeiro.payment_orders`
```sql
CREATE TABLE financeiro.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    installment_id UUID NOT NULL REFERENCES financeiro.title_installments(id) ON DELETE RESTRICT,
    bank_account_id UUID NOT NULL REFERENCES financeiro.bank_accounts(id) ON DELETE RESTRICT,
    payment_method financeiro.payment_method NOT NULL,
    amount_paid NUMERIC(18, 2) NOT NULL,
    interest_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    fine_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    discount_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    status financeiro.payment_order_status DEFAULT 'CONFIRMED' NOT NULL,
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_by_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    transaction_reference VARCHAR(128), -- Ex: End-to-End ID do PIX ou Autenticação bancária
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL
);

CREATE INDEX idx_payment_orders_paid_at ON financeiro.payment_orders(tenant_id, paid_at);
```

### 3.4 Extratos Bancários e Conciliação

#### `financeiro.bank_statement_entries` & `financeiro.bank_reconciliations`
```sql
CREATE TABLE financeiro.bank_statement_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    bank_account_id UUID NOT NULL REFERENCES financeiro.bank_accounts(id) ON DELETE CASCADE,
    fitid VARCHAR(128) NOT NULL, -- Identificador único do extrato OFX
    transaction_date DATE NOT NULL,
    amount NUMERIC(18, 2) NOT NULL, -- Positivo = Entrada, Negativo = Saída
    description VARCHAR(255) NOT NULL,
    document_number VARCHAR(64),
    reconciliation_status financeiro.reconciliation_status DEFAULT 'UNRECONCILED' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_statement_entry UNIQUE (bank_account_id, fitid)
);

CREATE TABLE financeiro.bank_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    statement_entry_id UUID NOT NULL REFERENCES financeiro.bank_statement_entries(id) ON DELETE RESTRICT,
    payment_order_id UUID NOT NULL REFERENCES financeiro.payment_orders(id) ON DELETE RESTRICT,
    reconciled_by_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    reconciled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT,
    CONSTRAINT uq_reconciliation_pair UNIQUE (statement_entry_id, payment_order_id)
);
```

---

## 4. Schema `contabil` (Razão Imutável & Partidas Dobradas)

### 4.1 Enums do Contábil
```sql
CREATE TYPE contabil.account_class AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');
CREATE TYPE contabil.account_nature AS ENUM ('DEBIT', 'CREDIT');
CREATE TYPE contabil.period_status AS ENUM ('OPEN', 'CLOSED', 'AUDITING');
CREATE TYPE contabil.entry_origin AS ENUM ('FINANCIAL', 'FISCAL', 'PAYROLL', 'PURCHASE', 'SALES', 'INVENTORY', 'MANUAL');
CREATE TYPE contabil.line_type AS ENUM ('DEBIT', 'CREDIT');
```

### 4.2 Plano de Contas e Períodos

#### `contabil.accounting_accounts`
```sql
CREATE TABLE contabil.accounting_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES contabil.accounting_accounts(id) ON DELETE SET NULL,
    code VARCHAR(64) NOT NULL, -- Ex: "1.1.1.02.0001"
    name VARCHAR(255) NOT NULL,
    account_class contabil.account_class NOT NULL,
    nature contabil.account_nature NOT NULL,
    level INT NOT NULL,
    is_synthetic BOOLEAN DEFAULT FALSE NOT NULL,
    accepts_entries BOOLEAN DEFAULT TRUE NOT NULL,
    sped_account_ref VARCHAR(64), -- Mapeamento com Plano Referencial SPED
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_account_code_per_company UNIQUE (company_id, code)
);

CREATE INDEX idx_accounting_accounts_lookup ON contabil.accounting_accounts(tenant_id, company_id, code);
```

#### `contabil.accounting_periods`
```sql
CREATE TABLE contabil.accounting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT NOT NULL,
    status contabil.period_status DEFAULT 'OPEN' NOT NULL,
    closed_at TIMESTAMPTZ,
    closed_by_user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_period_per_company UNIQUE (company_id, year, month),
    CONSTRAINT chk_period_month CHECK (month >= 1 AND month <= 12)
);
```

### 4.3 O Livro Razão Imutável (Diário e Partidas Dobradas)

#### `contabil.journal_entries`
```sql
CREATE TABLE contabil.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES contabil.accounting_periods(id) ON DELETE RESTRICT,
    entry_number BIGSERIAL NOT NULL,
    entry_date DATE NOT NULL,
    origin_module contabil.entry_origin NOT NULL,
    origin_entity_id VARCHAR(64),
    description TEXT NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    hash_fingerprint VARCHAR(64) NOT NULL, -- SHA-256 do lote
    previous_hash VARCHAR(64),             -- Encadeamento com o lançamento anterior
    is_reversed BOOLEAN DEFAULT FALSE NOT NULL,
    reversal_entry_id UUID REFERENCES contabil.journal_entries(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_entry_number_per_company UNIQUE (company_id, entry_number)
);

CREATE INDEX idx_journal_entries_date ON contabil.journal_entries(tenant_id, company_id, entry_date);
```

#### `contabil.journal_entry_lines`
```sql
CREATE TABLE contabil.journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES contabil.journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES contabil.accounting_accounts(id) ON DELETE RESTRICT,
    line_type contabil.line_type NOT NULL, -- DEBIT ou CREDIT
    amount NUMERIC(18, 2) NOT NULL,
    cost_center_id UUID REFERENCES core.cost_centers(id) ON DELETE RESTRICT,
    memo TEXT,
    CONSTRAINT chk_line_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_entry_lines_entry ON contabil.journal_entry_lines(journal_entry_id);
CREATE INDEX idx_entry_lines_account ON contabil.journal_entry_lines(account_id);
```

### 4.4 Garantia de Imutabilidade no PostgreSQL (Triggers de Proteção)
```sql
-- Trigger para impedir UPDATE e DELETE no Livro Razão
CREATE OR REPLACE FUNCTION contabil.fn_prevent_ledger_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'VIOLAÇÃO DE IMUTABILIDADE: Registros de lançamentos contábeis (journal_entries) e partidas (journal_entry_lines) não podem sofrer UPDATE ou DELETE. Correções devem ser feitas via Lançamento de Estorno.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_journal_entries
BEFORE UPDATE OR DELETE ON contabil.journal_entries
FOR EACH ROW EXECUTE FUNCTION contabil.fn_prevent_ledger_mutation();

CREATE TRIGGER trg_protect_journal_entry_lines
BEFORE UPDATE OR DELETE ON contabil.journal_entry_lines
FOR EACH ROW EXECUTE FUNCTION contabil.fn_prevent_ledger_mutation();
```

---

## 5. Schema `rh` (Recursos Humanos & Departamento Pessoal)

### 5.1 Enums do RH
```sql
CREATE TYPE rh.contract_type AS ENUM ('CLT', 'PJ', 'ESTAGIO', 'TEMPORARIO', 'AUTONOMO');
CREATE TYPE rh.employee_status AS ENUM ('ACTIVE', 'ON_LEAVE', 'VACATION', 'TERMINATED');
CREATE TYPE rh.payroll_run_status AS ENUM ('DRAFT', 'CALCULATED', 'APPROVED', 'CLOSED');
CREATE TYPE rh.payroll_item_type AS ENUM ('EARNING', 'DEDUCTION', 'EMPLOYER_CONTRIBUTION');
```

### 5.2 Colaboradores, Cargos e Estrutura

#### `rh.job_positions` & `rh.employees`
```sql
CREATE TABLE rh.job_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    title VARCHAR(128) NOT NULL,
    cbo_code VARCHAR(16) NOT NULL, -- Código CBO oficial
    base_salary NUMERIC(18, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_job_code UNIQUE (company_id, code)
);

CREATE TABLE rh.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES core.departments(id) ON DELETE RESTRICT,
    job_position_id UUID NOT NULL REFERENCES rh.job_positions(id) ON DELETE RESTRICT,
    cost_center_id UUID REFERENCES core.cost_centers(id) ON DELETE RESTRICT,
    registration_number VARCHAR(32) NOT NULL, -- Matrícula interna
    tax_id VARCHAR(32) NOT NULL,              -- CPF
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    admission_date DATE NOT NULL,
    termination_date DATE,
    contract_type rh.contract_type NOT NULL,
    current_salary NUMERIC(18, 2) NOT NULL,
    status rh.employee_status DEFAULT 'ACTIVE' NOT NULL,
    dependents_count INT DEFAULT 0 NOT NULL,
    bank_account_info JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    CONSTRAINT uq_employee_registration UNIQUE (company_id, registration_number),
    CONSTRAINT uq_employee_tax_id UNIQUE (tenant_id, tax_id)
);

CREATE INDEX idx_employees_status ON rh.employees(tenant_id, company_id, status);
```

### 5.3 Ponto Eletrônico e Folha de Pagamento

#### `rh.time_clock_entries`
```sql
CREATE TABLE rh.time_clock_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES rh.employees(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    source VARCHAR(32) DEFAULT 'REP' NOT NULL, -- 'REP', 'WEB', 'MOBILE'
    location_coords POINT,
    hash_signature VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_time_clock_employee ON rh.time_clock_entries(employee_id, recorded_at);
```

#### `rh.payroll_runs` & `rh.payroll_items`
```sql
CREATE TABLE rh.payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT NOT NULL,
    run_type VARCHAR(32) DEFAULT 'MONTHLY' NOT NULL, -- 'MONTHLY', '13TH_FIRST', '13TH_FINAL', 'TERMINATION'
    status rh.payroll_run_status DEFAULT 'DRAFT' NOT NULL,
    total_gross NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    total_deductions NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    total_net NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    total_employer_charges NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_payroll_run UNIQUE (company_id, year, month, run_type)
);

CREATE TABLE rh.payroll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES rh.payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES rh.employees(id) ON DELETE CASCADE,
    event_code VARCHAR(32) NOT NULL, -- Ex: '101' (Salário Base), '201' (INSS), '202' (IRRF)
    event_name VARCHAR(128) NOT NULL,
    item_type rh.payroll_item_type NOT NULL,
    base_value NUMERIC(18, 2) NOT NULL,
    reference_percentage NUMERIC(5, 2),
    calculated_amount NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_payroll_items_run ON rh.payroll_items(payroll_run_id, employee_id);
```

---

## 6. Schema `fiscal` (Tributação & Documentos Fiscais)

### 6.1 Tabelas de Escrituração e Documentos Fiscais

#### `fiscal.fiscal_notes` & `fiscal.fiscal_note_items`
```sql
CREATE TABLE fiscal.fiscal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    note_type VARCHAR(16) NOT NULL, -- 'NFE', 'NFSE', 'NFCE', 'CTE'
    operation_type VARCHAR(16) NOT NULL, -- 'INBOUND', 'OUTBOUND'
    series VARCHAR(8) NOT NULL,
    number BIGINT NOT NULL,
    access_key VARCHAR(44) UNIQUE, -- Chave de 44 dígitos da NF-e
    nature_of_operation VARCHAR(128) NOT NULL,
    entity_tax_id VARCHAR(32) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL,
    total_products NUMERIC(18, 2) NOT NULL,
    total_services NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    total_taxes NUMERIC(18, 2) NOT NULL,
    total_invoice NUMERIC(18, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'AUTHORIZED' NOT NULL, -- 'AUTHORIZED', 'CANCELLED', 'DENIED'
    xml_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_fiscal_number UNIQUE (branch_id, note_type, series, number)
);

CREATE TABLE fiscal.fiscal_note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_note_id UUID NOT NULL REFERENCES fiscal.fiscal_notes(id) ON DELETE CASCADE,
    item_number INT NOT NULL,
    product_code VARCHAR(64) NOT NULL,
    cfop VARCHAR(8) NOT NULL,
    ncm VARCHAR(16) NOT NULL,
    cst_csosn VARCHAR(8) NOT NULL,
    quantity NUMERIC(14, 4) NOT NULL,
    unit_price NUMERIC(18, 4) NOT NULL,
    total_price NUMERIC(18, 2) NOT NULL,
    icms_base NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    icms_rate NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    icms_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    pis_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    cofins_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    iss_amount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL
);
```

---

## 7. Schema `compras` (Suprimentos & Recebimento)

```sql
CREATE TABLE compras.purchase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL,
    justification TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE compras.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES financeiro.financial_entities(id) ON DELETE RESTRICT,
    order_number BIGSERIAL NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'APPROVED' NOT NULL,
    expected_delivery_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE compras.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES compras.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL, -- FK em estoque.products
    quantity NUMERIC(14, 4) NOT NULL,
    unit_price NUMERIC(18, 4) NOT NULL,
    total_price NUMERIC(18, 2) NOT NULL
);
```

---

## 8. Schema `estoque` (Armazenagem & Kardex)

```sql
CREATE TABLE estoque.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT uq_warehouse_code UNIQUE (branch_id, code)
);

CREATE TABLE estoque.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL,
    barcode VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    unit_of_measure VARCHAR(8) NOT NULL, -- 'UN', 'KG', 'CX', 'MT'
    average_cost NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    last_purchase_price NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    sale_price NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    ncm VARCHAR(16),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_product_sku UNIQUE (tenant_id, sku)
);

CREATE TABLE estoque.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES estoque.warehouses(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES estoque.products(id) ON DELETE RESTRICT,
    movement_type VARCHAR(32) NOT NULL, -- 'INBOUND_PURCHASE', 'OUTBOUND_SALE', 'TRANSFER', 'ADJUSTMENT'
    quantity NUMERIC(14, 4) NOT NULL,
    unit_cost NUMERIC(18, 4) NOT NULL,
    total_cost NUMERIC(18, 2) NOT NULL,
    balance_after NUMERIC(14, 4) NOT NULL,
    document_reference VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_stock_kardex ON estoque.stock_movements(tenant_id, warehouse_id, product_id, created_at);
```

---

## 9. Schema `vendas_crm` (Comercial, Propostas e Pedidos)

```sql
CREATE TABLE vendas_crm.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES financeiro.financial_entities(id) ON DELETE RESTRICT,
    order_number BIGSERIAL NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'INVOICED', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE vendas_crm.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES vendas_crm.sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES estoque.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(14, 4) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    discount NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    total_price NUMERIC(18, 2) NOT NULL
);
```

---

## 10. Schema `contratos_projetos_ativos`

```sql
CREATE TABLE contratos_projetos_ativos.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES financeiro.financial_entities(id) ON DELETE RESTRICT,
    contract_number VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_amount NUMERIC(18, 2) NOT NULL,
    readjustment_index VARCHAR(16) DEFAULT 'IPCA', -- 'IPCA', 'IGPM', 'INPC'
    status VARCHAR(32) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE contratos_projetos_ativos.fixed_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    tag_code VARCHAR(32) NOT NULL, -- Placa de patrimônio
    description VARCHAR(255) NOT NULL,
    acquisition_date DATE NOT NULL,
    acquisition_value NUMERIC(18, 2) NOT NULL,
    residual_value NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    useful_life_months INT NOT NULL,
    accumulated_depreciation NUMERIC(18, 2) DEFAULT 0.00 NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE' NOT NULL, -- 'ACTIVE', 'WRITTEN_OFF', 'SOLD'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## 11. Schema `integracoes` (Integration Hub)

```sql
CREATE TABLE integracoes.webhook_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    event_pattern VARCHAR(128) NOT NULL, -- Ex: "finance.payment.*"
    target_url TEXT NOT NULL,
    secret_token VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE integracoes.webhook_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES integracoes.webhook_subscriptions(id) ON DELETE CASCADE,
    event_id UUID NOT NULL,
    http_status INT NOT NULL,
    request_payload JSONB NOT NULL,
    response_body TEXT,
    execution_time_ms INT NOT NULL,
    delivered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## 12. Políticas de Row Level Security (RLS) no PostgreSQL

Para reforçar a segurança e evitar qualquer vazamento de dados inter-tenant no nível mais profundo da infraestrutura:

```sql
-- Habilitação de RLS em todas as tabelas multi-tenant críticas
ALTER TABLE core.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro.financial_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contabil.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rh.employees ENABLE ROW LEVEL SECURITY;

-- Exemplo de política baseada em variável de sessão da transação:
-- current_setting('app.current_tenant_id', true)::uuid
CREATE POLICY tenant_isolation_policy ON financeiro.financial_titles
FOR ALL
USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
```
