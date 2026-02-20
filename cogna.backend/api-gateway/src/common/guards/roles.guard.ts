import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_ENUM, ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: ROLES_ENUM[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getClass(), context.getHandler()]
    );
    const req = context.switchToHttp().getRequest<Request>();
    console.log(roles);
    return true;
  }
}
