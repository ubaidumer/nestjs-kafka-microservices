import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
// guard to use firebase authentication verification

@Injectable()
export class AuthGuard
  extends PassportAuthGuard('auth-strategy')
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    await super.canActivate(context);
    if (!roles) {
      return true;
    } else {
      const user = request.user;
      return await this.matchRoles(user.role, roles);
    }
  }

  async matchRoles(userRole, requiredRoles) {
    const result = requiredRoles.some((role) => userRole.includes(role));
    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
