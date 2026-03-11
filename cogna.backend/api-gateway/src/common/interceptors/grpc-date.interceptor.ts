/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class GrpcDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType().toString() === 'graphql') {
      const gqlContext = context.getArgByIndex(3); // Инфо об операции
      if (gqlContext?.parentType?.name === 'Subscription') {
        return next.handle(); // Просто пропускаем подписку без изменений
      }
    }

    return next.handle().pipe(map((data) => this.recursive(data)));
  }

  private recursive(data: any) {
    if (!data || typeof data !== 'object' || data instanceof Date) return data;
    if (Array.isArray(data)) return data.map((d) => this.recursive(d));
    if (this.isTimeStampData(data)) {
      const seconds =
        typeof data.seconds === 'string'
          ? parseInt(data.seconds, 10)
          : data.seconds;
      return new Date(seconds * 1000);
    }

    const mapped: any = {};
    for (const key of Object.keys(data)) {
      mapped[key] = this.recursive(data[key]);
    }
    console.log(mapped);
    return mapped;
  }

  private isTimeStampData(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      'seconds' in obj &&
      'nanos' in obj &&
      Object.keys(obj).length === 2
    );
  }
}
