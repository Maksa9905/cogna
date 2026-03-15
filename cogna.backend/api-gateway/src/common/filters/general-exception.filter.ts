import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';
import { RpcToHttpMap } from '@cogna-edu/corn';

interface RpcExceptionI {
  code: number;
  details: string;
}

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    if (exception instanceof HttpException) {
      console.log('exp:', exception);
      return new GraphQLError('http exception', {
        extensions: {
          code: exception.getStatus(),
          message: exception.message,
        },
      });
    }

    if (this.isRpcException(exception)) {
      const e = exception as RpcExceptionI;
      return new GraphQLError('rpc exception', {
        extensions: {
          status: RpcToHttpMap[e.code],
          message: e.details,
        },
      });
    }

    console.error(exception)
    return new GraphQLError('unhandled exception', {
      extensions: {
        status: 500,
        message: 'Internal exception error',
      },
    });
  }

  isRpcException(e: RpcExceptionI): boolean {
    return !!(e?.code && e?.details);
  }
}
