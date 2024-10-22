import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RBAC } from '../decorator/rbac.decorator';
import { Role } from '../../user/entities/user.entity';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>(RBAC, context.getHandler());

    console.log(role);
    if (!Object.values(Role).includes(role)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }

    console.log(user);

    // user.role === 토큰의 롤 // role은 가드에 적용된 롤
    return user.role <= role;
  }
}
