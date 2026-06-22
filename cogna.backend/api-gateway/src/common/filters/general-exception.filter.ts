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
import { log } from 'console';

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
          status: exception.getStatus(),
          details: exception.message
        },
      });
    }

    if (this.isRpcException(exception)) {
      
      const e = exception as RpcExceptionI;
      console.log(`это grpc ошибка: ${JSON.stringify(e)}`);
      console.log(`это grpc ошибка: ${e.code}, ${e.details}`);
      return new GraphQLError('rpc exception', {
        extensions: {
          status: RpcToHttpMap[e.code],
          details: e.details,
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
