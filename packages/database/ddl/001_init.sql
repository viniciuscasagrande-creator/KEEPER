-- ERP v1.0 — PostgreSQL DDL
-- Banco novo / multi-tenant / multiempresa / modular
-- Recomendação: PostgreSQL 16+

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS financeiro;
CREATE SCHEMA IF NOT EXISTS contabil;
CREATE SCHEMA IF NOT EXISTS fiscal;
CREATE SCHEMA IF NOT EXISTS rh;
CREATE SCHEMA IF NOT EXISTS compras;
CREATE SCHEMA IF NOT EXISTS estoque;
CREATE SCHEMA IF NOT EXISTS vendas;
CREATE SCHEMA IF NOT EXISTS crm;
CREATE SCHEMA IF NOT EXISTS contratos;
CREATE SCHEMA IF NOT EXISTS projetos;
CREATE SCHEMA IF NOT EXISTS ativos;
CREATE SCHEMA IF NOT EXISTS servicos;
CREATE SCHEMA IF NOT EXISTS bi;
CREATE SCHEMA IF NOT EXISTS integracoes;

-- =========================
-- CORE
-- =========================

CREATE TYPE core.tenant_status AS ENUM ('ACTIVE','SUSPENDED','TRIAL','CANCELLED');
CREATE TYPE core.user_status AS ENUM ('ACTIVE','INVITED','BLOCKED','DISABLED');
CREATE TYPE core.workflow_status AS ENUM ('DRAFT','ACTIVE','INACTIVE');
CREATE TYPE core.workflow_instance_status AS ENUM ('PENDING','IN_PROGRESS','APPROVED','REJECTED','CANCELLED');
CREATE TYPE core.event_status AS ENUM ('PENDING','PROCESSING','PROCESSED','FAILED');

CREATE TABLE core.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    legal_name VARCHAR(255),
    document VARCHAR(30),
    status core.tenant_status NOT NULL DEFAULT 'TRIAL',
    plan VARCHAR(80),
    timezone VARCHAR(80) NOT NULL DEFAULT 'America/Sao_Paulo',
    locale VARCHAR(20) NOT NULL DEFAULT 'pt-BR',
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    postal_code VARCHAR(12),
    street VARCHAR(255),
    number VARCHAR(30),
    complement VARCHAR(120),
    district VARCHAR(120),
    city VARCHAR(120),
    state VARCHAR(80),
    country VARCHAR(80) NOT NULL DEFAULT 'BR',
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    parent_company_id UUID REFERENCES core.companies(id),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    document VARCHAR(30),
    state_registration VARCHAR(60),
    municipal_registration VARCHAR(60),
    tax_regime VARCHAR(60),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    email CITEXT,
    phone VARCHAR(40),
    website VARCHAR(255),
    address_id UUID REFERENCES core.addresses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE core.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    document VARCHAR(30),
    state_registration VARCHAR(60),
    municipal_registration VARCHAR(60),
    address_id UUID REFERENCES core.addresses(id),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (company_id, code)
);

CREATE TABLE core.persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(40),
    birth_date DATE,
    email CITEXT,
    phone VARCHAR(40),
    gender VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    address_id UUID REFERENCES core.addresses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE core.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    person_id UUID REFERENCES core.persons(id),
    name VARCHAR(255) NOT NULL,
    email CITEXT NOT NULL,
    phone VARCHAR(40),
    password_hash TEXT NOT NULL,
    status core.user_status NOT NULL DEFAULT 'INVITED',
    last_login_at TIMESTAMPTZ,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (tenant_id, email)
);

CREATE TABLE core.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(120) NOT NULL,
    description TEXT,
    system_role BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, name)
);

CREATE TABLE core.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(80) NOT NULL,
    resource VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    description TEXT,
    UNIQUE (module, resource, action)
);

CREATE TABLE core.role_permissions (
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES core.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE core.user_roles (
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE core.user_companies (
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, company_id)
);

CREATE TABLE core.user_branches (
    user_id UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES core.branches(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, branch_id)
);

CREATE TABLE core.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    user_id UUID REFERENCES core.users(id),
    company_id UUID REFERENCES core.companies(id),
    module VARCHAR(80) NOT NULL,
    entity VARCHAR(120) NOT NULL,
    entity_id UUID,
    action VARCHAR(80) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    entity_type VARCHAR(120) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_key TEXT NOT NULL,
    mime_type VARCHAR(150),
    size BIGINT,
    checksum VARCHAR(128),
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(150) NOT NULL,
    module VARCHAR(80) NOT NULL,
    entity VARCHAR(120) NOT NULL,
    status core.workflow_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES core.workflows(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    sequence INTEGER NOT NULL,
    approval_type VARCHAR(40) NOT NULL DEFAULT 'ANY',
    required BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (workflow_id, sequence)
);

CREATE TABLE core.workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES core.workflows(id),
    entity_id UUID NOT NULL,
    status core.workflow_instance_status NOT NULL DEFAULT 'PENDING',
    current_step INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE core.workflow_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID NOT NULL REFERENCES core.workflow_instances(id) ON DELETE CASCADE,
    workflow_step_id UUID NOT NULL REFERENCES core.workflow_steps(id),
    user_id UUID REFERENCES core.users(id),
    action VARCHAR(40) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE core.domain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    event_type VARCHAR(150) NOT NULL,
    aggregate_type VARCHAR(120) NOT NULL,
    aggregate_id UUID NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    payload JSONB NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    status core.event_status NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE core.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    key VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_hash VARCHAR(128) NOT NULL,
    response JSONB,
    status INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE (tenant_id, key, endpoint)
);

CREATE TABLE core.rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    module VARCHAR(80) NOT NULL,
    event VARCHAR(150) NOT NULL,
    condition JSONB NOT NULL DEFAULT '{}'::jsonb,
    action JSONB NOT NULL DEFAULT '{}'::jsonb,
    priority INTEGER NOT NULL DEFAULT 100,
    version INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- FINANCEIRO
-- =========================

CREATE TYPE financeiro.financial_account_type AS ENUM
('CASH','CHECKING','SAVINGS','INVESTMENT','DIGITAL_WALLET','OTHER');

CREATE TYPE financeiro.title_status AS ENUM
('DRAFT','PENDING_APPROVAL','OPEN','PARTIALLY_PAID','PAID','OVERDUE','CANCELLED','RENEGOTIATED');

CREATE TYPE financeiro.movement_type AS ENUM
('PAYMENT','RECEIPT','TRANSFER','FEE','INTEREST','REVERSAL','ADJUSTMENT');

CREATE TABLE financeiro.financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    type financeiro.financial_account_type NOT NULL,
    name VARCHAR(150) NOT NULL,
    bank_code VARCHAR(20),
    agency VARCHAR(30),
    account_number VARCHAR(60),
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    initial_balance NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financeiro.financial_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    parent_id UUID REFERENCES financeiro.financial_categories(id),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financeiro.payable_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    supplier_id UUID,
    description VARCHAR(255) NOT NULL,
    document_number VARCHAR(80),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(19,4) NOT NULL CHECK (total_amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    category_id UUID REFERENCES financeiro.financial_categories(id),
    cost_center_id UUID,
    project_id UUID,
    status financeiro.title_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financeiro.payable_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payable_title_id UUID NOT NULL REFERENCES financeiro.payable_titles(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(19,4) NOT NULL CHECK (amount >= 0),
    interest_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    fine_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status financeiro.title_status NOT NULL DEFAULT 'OPEN',
    UNIQUE (payable_title_id, installment_number)
);

CREATE TABLE financeiro.receivable_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    customer_id UUID,
    description VARCHAR(255) NOT NULL,
    document_number VARCHAR(80),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(19,4) NOT NULL CHECK (total_amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    category_id UUID REFERENCES financeiro.financial_categories(id),
    cost_center_id UUID,
    project_id UUID,
    status financeiro.title_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financeiro.receivable_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receivable_title_id UUID NOT NULL REFERENCES financeiro.receivable_titles(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(19,4) NOT NULL CHECK (amount >= 0),
    interest_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    fine_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    received_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status financeiro.title_status NOT NULL DEFAULT 'OPEN',
    UNIQUE (receivable_title_id, installment_number)
);

CREATE TABLE financeiro.financial_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    financial_account_id UUID NOT NULL REFERENCES financeiro.financial_accounts(id),
    source_type VARCHAR(80),
    source_id UUID,
    movement_type financeiro.movement_type NOT NULL,
    amount NUMERIC(19,4) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    movement_date TIMESTAMPTZ NOT NULL,
    description VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'POSTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE financeiro.financial_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    source_account_id UUID NOT NULL REFERENCES financeiro.financial_accounts(id),
    destination_account_id UUID NOT NULL REFERENCES financeiro.financial_accounts(id),
    amount NUMERIC(19,4) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL DEFAULT 'BRL',
    transfer_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'POSTED',
    description VARCHAR(255)
);

CREATE TABLE financeiro.bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    financial_account_id UUID NOT NULL REFERENCES financeiro.financial_accounts(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    file_name VARCHAR(255),
    imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(30) NOT NULL DEFAULT 'IMPORTED'
);

CREATE TABLE financeiro.bank_statement_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_statement_id UUID NOT NULL REFERENCES financeiro.bank_statements(id) ON DELETE CASCADE,
    external_id VARCHAR(255),
    transaction_date DATE NOT NULL,
    description TEXT,
    amount NUMERIC(19,4) NOT NULL,
    balance NUMERIC(19,4),
    type VARCHAR(30) NOT NULL,
    matched BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE financeiro.reconciliation_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_entry_id UUID NOT NULL REFERENCES financeiro.bank_statement_entries(id) ON DELETE CASCADE,
    financial_movement_id UUID NOT NULL REFERENCES financeiro.financial_movements(id),
    confidence_score NUMERIC(5,2),
    matched_by UUID REFERENCES core.users(id),
    matched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (statement_entry_id, financial_movement_id)
);

CREATE TABLE financeiro.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    name VARCHAR(150) NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
);

CREATE TABLE financeiro.budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES financeiro.budgets(id) ON DELETE CASCADE,
    period DATE NOT NULL,
    category_id UUID REFERENCES financeiro.financial_categories(id),
    cost_center_id UUID,
    project_id UUID,
    planned_amount NUMERIC(19,4) NOT NULL DEFAULT 0
);

CREATE TABLE financeiro.credit_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    customer_id UUID NOT NULL,
    limit_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    used_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    available_amount NUMERIC(19,4) GENERATED ALWAYS AS (limit_amount - used_amount) STORED,
    valid_from DATE,
    valid_until DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
);

-- =========================
-- CONTÁBIL
-- =========================

CREATE TYPE contabil.account_type AS ENUM
('ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE');

CREATE TYPE contabil.account_nature AS ENUM
('DEBIT','CREDIT');

CREATE TYPE contabil.period_status AS ENUM
('OPEN','CLOSED','BLOCKED');

CREATE TABLE contabil.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    parent_id UUID REFERENCES contabil.accounts(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_type contabil.account_type NOT NULL,
    nature contabil.account_nature NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    is_analytical BOOLEAN NOT NULL DEFAULT true,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (company_id, code)
);

CREATE TABLE contabil.reference_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(40) NOT NULL,
    valid_from DATE,
    valid_until DATE,
    UNIQUE (version, code)
);

CREATE TABLE contabil.account_reference_mapping (
    account_id UUID NOT NULL REFERENCES contabil.accounts(id),
    reference_account_id UUID NOT NULL REFERENCES contabil.reference_accounts(id),
    PRIMARY KEY (account_id, reference_account_id)
);

CREATE TABLE contabil.accounting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    status contabil.period_status NOT NULL DEFAULT 'OPEN',
    opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES core.users(id),
    UNIQUE (company_id, year, month)
);

CREATE TABLE contabil.cost_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    parent_id UUID REFERENCES contabil.cost_centers(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (company_id, code)
);

CREATE TABLE contabil.analytical_dimensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(120) NOT NULL,
    type VARCHAR(80) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE contabil.analytical_dimension_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension_id UUID NOT NULL REFERENCES contabil.analytical_dimensions(id) ON DELETE CASCADE,
    code VARCHAR(80) NOT NULL,
    name VARCHAR(150) NOT NULL,
    UNIQUE (dimension_id, code)
);

CREATE TABLE contabil.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    period_id UUID NOT NULL REFERENCES contabil.accounting_periods(id),
    entry_number BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    source_type VARCHAR(80),
    source_id UUID,
    status VARCHAR(30) NOT NULL DEFAULT 'POSTED',
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (company_id, entry_number)
);

CREATE TABLE contabil.journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES contabil.journal_entries(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES contabil.accounts(id),
    cost_center_id UUID REFERENCES contabil.cost_centers(id),
    project_id UUID,
    debit_amount NUMERIC(19,4) NOT NULL DEFAULT 0 CHECK (debit_amount >= 0),
    credit_amount NUMERIC(19,4) NOT NULL DEFAULT 0 CHECK (credit_amount >= 0),
    description TEXT,
    CHECK (
        (debit_amount > 0 AND credit_amount = 0)
        OR
        (credit_amount > 0 AND debit_amount = 0)
    )
);

CREATE TABLE contabil.journal_reversals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_entry_id UUID NOT NULL UNIQUE REFERENCES contabil.journal_entries(id),
    reversal_entry_id UUID NOT NULL UNIQUE REFERENCES contabil.journal_entries(id),
    reason TEXT NOT NULL,
    created_by UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- FISCAL
-- =========================

CREATE TABLE fiscal.tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES core.tenants(id),
    name VARCHAR(150) NOT NULL,
    tax_type VARCHAR(60) NOT NULL,
    regime VARCHAR(60),
    valid_from DATE NOT NULL,
    valid_until DATE,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE fiscal.fiscal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    document_type VARCHAR(40) NOT NULL,
    series VARCHAR(20),
    number BIGINT,
    access_key VARCHAR(100),
    issue_date TIMESTAMPTZ NOT NULL,
    operation_type VARCHAR(40),
    customer_id UUID,
    supplier_id UUID,
    total_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
    xml_storage_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fiscal.fiscal_document_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_document_id UUID NOT NULL REFERENCES fiscal.fiscal_documents(id) ON DELETE CASCADE,
    product_id UUID,
    description TEXT NOT NULL,
    quantity NUMERIC(19,6) NOT NULL DEFAULT 1,
    unit_price NUMERIC(19,6) NOT NULL DEFAULT 0,
    total_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    cfop VARCHAR(10),
    ncm VARCHAR(20),
    cst VARCHAR(20),
    csosn VARCHAR(20),
    icms_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    ipi_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    pis_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    cofins_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    iss_amount NUMERIC(19,4) NOT NULL DEFAULT 0
);

-- =========================
-- RH
-- =========================

CREATE TABLE rh.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    parent_id UUID REFERENCES rh.departments(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    manager_employee_id UUID,
    UNIQUE (company_id, code)
);

CREATE TABLE rh.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    salary_range_min NUMERIC(19,4),
    salary_range_max NUMERIC(19,4),
    UNIQUE (company_id, code)
);

CREATE TABLE rh.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    person_id UUID NOT NULL REFERENCES core.persons(id),
    employee_code VARCHAR(50) NOT NULL,
    admission_date DATE NOT NULL,
    termination_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    department_id UUID REFERENCES rh.departments(id),
    position_id UUID REFERENCES rh.positions(id),
    salary NUMERIC(19,4) NOT NULL DEFAULT 0,
    employment_type VARCHAR(50),
    UNIQUE (company_id, employee_code)
);

ALTER TABLE rh.departments
ADD CONSTRAINT fk_department_manager
FOREIGN KEY (manager_employee_id) REFERENCES rh.employees(id);

CREATE TABLE rh.time_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES rh.employees(id),
    date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    break_minutes INTEGER NOT NULL DEFAULT 0,
    worked_minutes INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    source VARCHAR(40)
);

CREATE TABLE rh.vacations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES rh.employees(id),
    acquisition_start DATE NOT NULL,
    acquisition_end DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    days INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNED'
);

CREATE TABLE rh.benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(60) NOT NULL,
    provider VARCHAR(150),
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE rh.employee_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES rh.employees(id),
    benefit_id UUID NOT NULL REFERENCES rh.benefits(id),
    start_date DATE NOT NULL,
    end_date DATE,
    employee_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    company_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE rh.payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    period DATE NOT NULL,
    type VARCHAR(40) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    calculated_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    UNIQUE (company_id, period, type)
);

CREATE TABLE rh.payroll_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL,
    formula TEXT,
    taxable_inss BOOLEAN NOT NULL DEFAULT false,
    taxable_irrf BOOLEAN NOT NULL DEFAULT false,
    taxable_fgts BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (tenant_id, code)
);

CREATE TABLE rh.payroll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID NOT NULL REFERENCES rh.payrolls(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES rh.employees(id),
    event_id UUID NOT NULL REFERENCES rh.payroll_events(id),
    reference NUMERIC(19,6),
    quantity NUMERIC(19,6),
    base_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    type VARCHAR(30) NOT NULL
);

-- =========================
-- COMPRAS
-- =========================

CREATE TABLE compras.purchase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    requester_id UUID REFERENCES core.users(id),
    department_id UUID REFERENCES rh.departments(id),
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE compras.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    supplier_id UUID,
    number VARCHAR(60) NOT NULL,
    issue_date DATE NOT NULL,
    total_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    UNIQUE (company_id, number)
);

-- =========================
-- ESTOQUE
-- =========================

CREATE TABLE estoque.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    code VARCHAR(80) NOT NULL,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID,
    unit_id UUID,
    cost_method VARCHAR(30) NOT NULL DEFAULT 'AVERAGE',
    active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (tenant_id, code)
);

CREATE TABLE estoque.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    UNIQUE (company_id, code)
);

CREATE TABLE estoque.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    warehouse_id UUID NOT NULL REFERENCES estoque.warehouses(id),
    product_id UUID NOT NULL REFERENCES estoque.products(id),
    movement_type VARCHAR(40) NOT NULL,
    quantity NUMERIC(19,6) NOT NULL,
    unit_cost NUMERIC(19,6) NOT NULL DEFAULT 0,
    total_cost NUMERIC(19,4) NOT NULL DEFAULT 0,
    source_type VARCHAR(80),
    source_id UUID,
    movement_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- VENDAS
-- =========================

CREATE TABLE vendas.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    person_id UUID REFERENCES core.persons(id),
    customer_code VARCHAR(80) NOT NULL,
    credit_limit NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    UNIQUE (tenant_id, customer_code)
);

CREATE TABLE vendas.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    customer_id UUID NOT NULL REFERENCES vendas.customers(id),
    number VARCHAR(60) NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    total_amount NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    UNIQUE (company_id, number)
);

CREATE TABLE vendas.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES vendas.sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES estoque.products(id),
    quantity NUMERIC(19,6) NOT NULL,
    unit_price NUMERIC(19,6) NOT NULL,
    discount NUMERIC(19,4) NOT NULL DEFAULT 0,
    total_amount NUMERIC(19,4) NOT NULL
);

-- =========================
-- CRM
-- =========================

CREATE TABLE crm.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(255) NOT NULL,
    email CITEXT,
    phone VARCHAR(40),
    source VARCHAR(100),
    status VARCHAR(40) NOT NULL DEFAULT 'NEW',
    owner_id UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE crm.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    customer_id UUID REFERENCES vendas.customers(id),
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(80) NOT NULL,
    value NUMERIC(19,4) NOT NULL DEFAULT 0,
    probability NUMERIC(5,2) NOT NULL DEFAULT 0,
    expected_close_date DATE,
    owner_id UUID REFERENCES core.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- CONTRATOS
-- =========================

CREATE TABLE contratos.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    customer_id UUID REFERENCES vendas.customers(id),
    supplier_id UUID,
    contract_number VARCHAR(80) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    value NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
    renewal_type VARCHAR(40),
    UNIQUE (company_id, contract_number)
);

-- =========================
-- PROJETOS
-- =========================

CREATE TABLE projetos.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    code VARCHAR(80) NOT NULL,
    name VARCHAR(255) NOT NULL,
    manager_id UUID REFERENCES core.users(id),
    start_date DATE,
    end_date DATE,
    budget NUMERIC(19,4) NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'PLANNED',
    UNIQUE (company_id, code)
);

CREATE TABLE projetos.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projetos.projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES projetos.project_tasks(id),
    name VARCHAR(255) NOT NULL,
    assigned_to UUID REFERENCES core.users(id),
    start_date DATE,
    due_date DATE,
    status VARCHAR(40) NOT NULL DEFAULT 'TODO',
    estimated_hours NUMERIC(10,2),
    actual_hours NUMERIC(10,2)
);

-- =========================
-- ATIVOS
-- =========================

CREATE TABLE ativos.fixed_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    company_id UUID NOT NULL REFERENCES core.companies(id),
    branch_id UUID REFERENCES core.branches(id),
    asset_code VARCHAR(80) NOT NULL,
    name VARCHAR(255) NOT NULL,
    acquisition_date DATE NOT NULL,
    acquisition_value NUMERIC(19,4) NOT NULL,
    residual_value NUMERIC(19,4) NOT NULL DEFAULT 0,
    useful_life INTEGER NOT NULL,
    depreciation_method VARCHAR(40) NOT NULL DEFAULT 'STRAIGHT_LINE',
    status VARCHAR(40) NOT NULL DEFAULT 'ACTIVE',
    UNIQUE (company_id, asset_code)
);

CREATE TABLE ativos.asset_depreciations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES ativos.fixed_assets(id) ON DELETE CASCADE,
    period DATE NOT NULL,
    base_amount NUMERIC(19,4) NOT NULL,
    depreciation_amount NUMERIC(19,4) NOT NULL,
    accumulated_amount NUMERIC(19,4) NOT NULL,
    UNIQUE (asset_id, period)
);

-- =========================
-- INTEGRAÇÕES
-- =========================

CREATE TABLE integracoes.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    name VARCHAR(150) NOT NULL,
    provider VARCHAR(120) NOT NULL,
    type VARCHAR(80) NOT NULL,
    credentials_encrypted TEXT,
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE integracoes.webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    url TEXT NOT NULL,
    event_type VARCHAR(150) NOT NULL,
    secret TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE integracoes.webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID NOT NULL REFERENCES integracoes.webhooks(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES core.domain_events(id),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    http_status INTEGER,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    response TEXT
);

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX idx_audit_logs_tenant_created
ON core.audit_logs (tenant_id, created_at DESC);

CREATE INDEX idx_audit_logs_entity
ON core.audit_logs (entity, entity_id);

CREATE INDEX idx_domain_events_status
ON core.domain_events (status, occurred_at);

CREATE INDEX idx_domain_events_aggregate
ON core.domain_events (aggregate_type, aggregate_id);

CREATE INDEX idx_payable_installments_due
ON financeiro.payable_installments (due_date, status);

CREATE INDEX idx_receivable_installments_due
ON financeiro.receivable_installments (due_date, status);

CREATE INDEX idx_financial_movements_account_date
ON financeiro.financial_movements (financial_account_id, movement_date);

CREATE INDEX idx_bank_statement_entries_match
ON financeiro.bank_statement_entries (matched, transaction_date);

CREATE INDEX idx_journal_entries_company_date
ON contabil.journal_entries (company_id, entry_date);

CREATE INDEX idx_journal_lines_account
ON contabil.journal_lines (account_id);

CREATE INDEX idx_payroll_items_employee
ON rh.payroll_items (employee_id);

CREATE INDEX idx_stock_movements_product_date
ON estoque.stock_movements (product_id, movement_date);

CREATE INDEX idx_sales_orders_customer_date
ON vendas.sales_orders (customer_id, issue_date);

-- =========================
-- TRIGGER: updated_at
-- =========================

CREATE OR REPLACE FUNCTION core.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar aos principais objetos mutáveis
CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON core.tenants
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON core.companies
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_branches_updated_at BEFORE UPDATE ON core.branches
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON core.users
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON core.roles
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_workflows_updated_at BEFORE UPDATE ON core.workflows
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_financial_accounts_updated_at BEFORE UPDATE ON financeiro.financial_accounts
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_financial_categories_updated_at BEFORE UPDATE ON financeiro.financial_categories
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_payable_titles_updated_at BEFORE UPDATE ON financeiro.payable_titles
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

CREATE TRIGGER trg_receivable_titles_updated_at BEFORE UPDATE ON financeiro.receivable_titles
FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();

-- =========================
-- IMUTABILIDADE DO RAZÃO
-- =========================

CREATE OR REPLACE FUNCTION contabil.prevent_journal_line_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'journal_lines são imutáveis; utilize estorno e novo lançamento';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION contabil.prevent_journal_entry_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'journal_entries são imutáveis; utilize estorno e novo lançamento';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_journal_lines_no_update
BEFORE UPDATE OR DELETE ON contabil.journal_lines
FOR EACH ROW EXECUTE FUNCTION contabil.prevent_journal_line_update();

CREATE TRIGGER trg_journal_entries_no_update
BEFORE UPDATE OR DELETE ON contabil.journal_entries
FOR EACH ROW EXECUTE FUNCTION contabil.prevent_journal_entry_mutation();

-- =========================
-- RLS BASE
-- =========================

-- O aplicativo deverá executar:
-- SET app.tenant_id = '<uuid>';
--
-- Em produção, habilitar RLS nas tabelas tenantizadas e criar
-- policies com current_setting('app.tenant_id', true)::uuid.
--
-- Exemplo:
--
-- ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY users_tenant_isolation ON core.users
-- USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- =========================
-- OBSERVAÇÃO
-- =========================
-- Algumas referências entre módulos (supplier_id, customer_id,
-- project_id, cost_center_id etc.) permanecem UUID sem FK físico.
-- Isso é intencional para preservar o isolamento dos bounded contexts.
-- A integridade entre módulos será garantida pelos serviços/eventos.
