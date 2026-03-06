import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import * as cookieParser from 'cookie-parser';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';
import { GrpcDateInterceptor } from './common/interceptors/grpc-date.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalInterceptors(new GrpcDateInterceptor());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.listen(process.env.PORT ?? 4000);
  console.log('graphql start: http://localhost:4000/graphql');
}

bootstrap();
