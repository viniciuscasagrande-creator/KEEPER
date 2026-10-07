import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthenticatedUser } from '@erp/shared';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || request.headers['x-tenant-id'];
  },
);
