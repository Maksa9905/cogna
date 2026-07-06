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

// Сборка gRPC metadata из контекста запроса. Новые ключи добавлять здесь.
function buildRequestMetadata(context: UserContextStore): Metadata {
  const metadata = new Metadata();
  metadata.set(USER_ID_METADATA_KEY, context.userId);
  return metadata;
}

// Низкий уровень: unary gRPC-вызов с уже собранным Metadata.
function callGrpcWithMetadata<TReq, TRes>(
  method: GrpcMethod<TReq, TRes>,
  request: TReq,
  metadata: Metadata,
): Promise<TRes> {
  return firstValueFrom(method(request, metadata));
}

// Явный контекст — когда ALS недоступен (вне HTTP/gRPC-запроса).
export function callGrpcWithContext<TReq, TRes>(
  method: GrpcMethod<TReq, TRes>,
  request: TReq,
  context: UserContextStore,
): Promise<TRes> {
  return callGrpcWithMetadata(method, request, buildRequestMetadata(context));
}

// Контекст из ALS — для root Query/Mutation через createGrpcClientWithMetadata.
function callWithMetadata<TReq, TRes>(
  als: AsyncLocalStorage<UserContextStore>,
  method: GrpcMethod<TReq, TRes>,
  request: TReq,
): Promise<TRes> {
  const store = als.getStore();
  if (!store?.userId) {
    throw new UnauthorizedException();
  }

  return callGrpcWithContext(method, request, store);
}

// Proxy: методы клиента автоматически читают UserContextStore из ALS.
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
