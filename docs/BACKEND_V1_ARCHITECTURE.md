# Arquitetura Backend v1 — NestJS (Monólito Modular)

> **Status:** Especificação e Estruturação Implementada  
> **Framework:** NestJS 11 + TypeScript + Prisma Multi-schema  
> **Segurança:** JWT Bearer + RBAC Guard + RFC 7807 Problem Details  
> **Isolamento de Domínio:** Cada módulo encapsula controllers, serviços e regras, consumindo o Prisma Service comum e comunicando-se via eventos de domínio.

---

## 1. Estrutura Física do Backend (`apps/api/src`)

```text
apps/api/src/
├── common/                     # Utilitários transversais globais
│   ├── decorators/             # @CurrentUser(), @CurrentTenant(), @Public(), @RequirePermissions()
│   ├── filters/                # ProblemDetailsFilter (RFC 7807)
│   └── prisma/                 # PrismaService com suporte a multi-schema
│
├── core/                       # Plataforma Base (Fase 01)
│   ├── auth/                   # Autenticação JWT, login, hashing bcrypt e guards
│   ├── users/                  # Gestão de usuários do tenant e convites
│   ├── tenants/                # Provisionamento e configurações de tenants
│   ├── companies/              # Empresas, filiais e unidades
│   ├── permissions/            # RBAC (matriz de permissões, papéis e atribuições)
│   ├── audit/                  # Registro assíncrono de logs imutáveis
│   ├── workflow/               # Esteiras de aprovação e histórico de instâncias
│   └── core.module.ts          # Módulo agregador do Core
│
├── financeiro/                 # Contas a pagar, receber, tesouraria, conciliação
│   ├── financeiro.controller.ts
│   └── financeiro.module.ts
│
├── contabil/                   # Razão imutável, plano de contas e partidas dobradas
│   ├── contabil.controller.ts
│   └── contabil.module.ts
│
├── fiscal/                     # Tributos e documentos fiscais (NF-e/NFS-e)
│   └── fiscal.module.ts
│
├── rh/                         # Pessoas, cargos, ponto e folha de pagamento
│   └── rh.module.ts
│
├── compras/                    # Requisições e pedidos de compra
│   └── compras.module.ts
│
├── estoque/                    # Armazéns, produtos e Kardex
│   └── estoque.module.ts
│
├── vendas/                     # Clientes e pedidos de venda
│   └── vendas.module.ts
│
├── crm/                        # Leads e pipeline de oportunidades
│   └── crm.module.ts
│
├── contratos/                  # Gestão de contratos e vigências
│   └── contratos.module.ts
│
├── projetos/                   # Projetos e tarefas
│   └── projetos.module.ts
│
├── ativos/                     # Ativo imobilizado e depreciação
│   └── ativos.module.ts
│
├── integracoes/                # Integrações externas e webhooks
│   └── integracoes.module.ts
│
├── app.module.ts               # Módulo raiz com guards globais
└── main.ts                     # Bootstrap, OpenAPI Swagger e validação global
```

---

## 2. Catálogo de Endpoints Iniciais (Core v1)

| Módulo | Método | Endpoint | Proteção | Descrição |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/v1/core/auth/login` | `@Public()` | Autentica usuário e retorna tokens JWT |
| **Tenants** | `POST` | `/api/v1/core/tenants` | `@Public()` | Provisiona um novo tenant empresarial |
| **Tenants** | `GET` | `/api/v1/core/tenants/current` | JWT | Retorna metadados do tenant autenticado |
| **Users** | `POST` | `/api/v1/core/users` | `core.users.criar` | Cadastra novo colaborador no tenant |
| **Users** | `GET` | `/api/v1/core/users` | `core.users.visualizar` | Lista colaboradores do tenant |
| **Companies** | `POST` | `/api/v1/core/companies` | `core.empresas.criar` | Registra nova empresa sob o tenant |
| **Companies** | `GET` | `/api/v1/core/companies` | `core.empresas.visualizar` | Lista empresas e filiais do tenant |
| **Companies** | `POST` | `/api/v1/core/companies/:id/branches` | `core.filiais.criar` | Cadastra filial vinculada à empresa |
| **RBAC** | `GET` | `/api/v1/core/rbac/permissions` | `core.permissoes.visualizar` | Lista todas as permissões da plataforma |
| **RBAC** | `GET` | `/api/v1/core/rbac/roles` | `core.perfis.visualizar` | Lista papéis do tenant com suas permissões |
| **RBAC** | `POST` | `/api/v1/core/rbac/roles` | `core.perfis.criar` | Cria papel customizado |
| **RBAC** | `POST` | `/api/v1/core/rbac/roles/:id/permissions`| `core.perfis.editar` | Associa permissões granulares a um papel |
| **Audit** | `GET` | `/api/v1/core/audit/logs` | `core.auditoria.visualizar` | Consulta trilha de auditoria filtrável |
| **Workflow**| `POST` | `/api/v1/core/workflows` | `core.workflows.criar` | Registra fluxo de aprovação |
| **Workflow**| `POST` | `/api/v1/core/workflows/:id/instances` | `core.workflows.executar` | Inicia esteira de aprovação |
| **Financeiro**| `GET` | `/api/v1/financeiro/resumo` | `financeiro.titulos.visualizar` | Resumo de títulos a pagar e receber |
| **Contábil** | `GET` | `/api/v1/contabil/plano-contas` | `contabil.plano_contas.visualizar`| Consulta plano de contas estruturado |
