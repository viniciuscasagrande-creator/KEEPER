import { PrismaClient } from '@prisma/client';

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

export function createPrismaClient(tenantId?: string) {
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (!tenantId) {
    return baseClient;
  }

  // Tenant-scoped extension for automatic multi-tenancy enforcement
  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // If the model has tenantId, inject tenantId filter on read/update/delete operations
          const modelsWithTenant = [
            'Company',
            'Branch',
            'User',
            'Role',
            'UserAccess',
            'AuditLog',
            'RuleDefinition',
            'WorkflowDefinition',
            'WorkflowInstance',
            'ApprovalTask',
            'OutboxEvent',
            'FinancialTitle',
            'TitleInstallment',
            'BankAccount',
            'PaymentOrder',
            'AccountingAccount',
            'AccountingPeriod',
            'JournalEntry',
          ];

          if (modelsWithTenant.includes(model)) {
            const anyArgs = args as Record<string, unknown>;
            if (operation === 'findMany' || operation === 'findFirst' || operation === 'count') {
              anyArgs.where = { ...(anyArgs.where as object), tenantId };
            } else if (operation === 'create') {
              anyArgs.data = { ...(anyArgs.data as object), tenantId };
            }
          }

          return query(args);
        },
      },
    },
  });
}
