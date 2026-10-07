import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../../common/decorators/require-permissions.decorator';
import { UserContext } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserContext = request.user;

    if (!user) {
      throw new ForbiddenException('User context not found in request');
    }

    // Check if user has ADMIN or SUPER_ADMIN role (bypass)
    if (user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    const hasAll = requiredPermissions.every((perm) =>
      user.permissions?.includes(perm),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
