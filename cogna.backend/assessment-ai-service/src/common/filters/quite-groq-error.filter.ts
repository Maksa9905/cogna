import { ArgumentsHost, Catch, ExecutionContext, Logger, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class QuiteGroqErrorFilter implements RpcExceptionFilter {
  private logger: Logger = new Logger(QuiteGroqErrorFilter.name)
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception?.message.includes('json_validate_failed')) {
      this.logger.warn('Quiet Groq error:', exception.message)
    }
    return throwError(() => exception)
  }
}