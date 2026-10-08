export interface TenantContext {
  tenantId: string;
  companyId?: string;
  branchId?: string;
  userId?: string;
  roles?: string[];
  permissions?: string[];
  isSuperAdmin?: boolean;
}

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  activeBranchId?: string;
  isSuperAdmin: boolean;
}
