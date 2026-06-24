import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../guards';

type UserStore = { userId: string };

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  constructor(
    @Inject('ALS')
    private readonly als: AsyncLocalStorage<UserStore>,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const req: Request = ctx.getContext<GqlContext>().req;
    const userId = req.user?.sub;
    if (userId) {
      this.als.enterWith({ userId });
    }
    return next.handle();
  }
}
