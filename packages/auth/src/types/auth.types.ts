export interface JwtPayload {
  sub: string; // userId
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
  branchId?: string;
  isSuperAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
