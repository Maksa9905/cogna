import { Metadata } from '@grpc/grpc-js';
import { UnauthorizedException } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { firstValueFrom, Observable } from 'rxjs';

export const USER_ID_METADATA_KEY = 'user-id';

export type UserContextStore = { userId: string };

type GrpcMethod<TReq, TRes> = (
  request: TReq,
  metadata?: Metadata,
) => Observable<TRes>;

export type WithGrpcMetadata<T> = {
  [K in keyof T]: T[K] extends (
    req: infer R,
    ...args: unknown[]
  ) => Observable<infer Res>
    ? (req: R) => Promise<Res>
    : T[K];
};

function callWithMetadata<TReq, TRes>(
  als: AsyncLocalStorage<UserContextStore>,
  method: GrpcMethod<TReq, TRes>,
  request: TReq,
): Promise<TRes> {
  const userId = als.getStore()?.userId;
  if (!userId) {
    throw new UnauthorizedException();
  }

  const metadata = new Metadata();
  metadata.set(USER_ID_METADATA_KEY, userId);
  return firstValueFrom(method(request, metadata));
}

export function createGrpcClientWithMetadata<T extends object>(
  client: T,
  als: AsyncLocalStorage<UserContextStore>,
): WithGrpcMetadata<T> {
  return new Proxy(client, {
    get(target, prop) {
      const value = (target as Record<string, unknown>)[String(prop)];
      if (typeof value !== 'function') {
        return value;
      }

      return (request: unknown) =>
        callWithMetadata(als, value.bind(target), request);
    },
  }) as WithGrpcMetadata<T>;
}
