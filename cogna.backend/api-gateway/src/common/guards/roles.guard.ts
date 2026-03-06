import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { UserRole } from '@cogna-edu/corn/dist/enum';

interface GqlContext {
  req: Request;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: UserRole[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const req = GqlArgumentsHost.create(context).getContext<GqlContext>().req;
    console.log(req.user.role);
    console.log(roles);
    // if (!roles.includes(req.user.role))
    //   throw new ForbiddenException('Недостаточно прав');
    return true;
  }
}
