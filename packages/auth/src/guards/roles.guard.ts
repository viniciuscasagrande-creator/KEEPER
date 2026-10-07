import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/auth.decorators';
import { AuthenticatedUser } from '@erp/shared';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      throw new ForbiddenException('User context not found');
    }

    if (user.isSuperAdmin) {
      return true;
    }

    const hasAnyRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasAnyRole) {
      throw new ForbiddenException(
        `Insufficient role privileges. Required one of: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
