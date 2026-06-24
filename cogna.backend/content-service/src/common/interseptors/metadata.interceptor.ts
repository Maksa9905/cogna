import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Metadata } from '@grpc/grpc-js';

export const USER_ID_METADATA_KEY = 'user-id';

type UserStore = { userId: string };

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  constructor(
    @Inject('ALS') private readonly als: AsyncLocalStorage<UserStore>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToRpc();
    const metadata = ctx.getContext<Metadata>();
    const userId = metadata.get(USER_ID_METADATA_KEY)[0] as string | undefined;

    if (!userId) {
      return next.handle();
    }

    return new Observable((subscriber) => {
      this.als.run({ userId }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
