import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import * as cookieParser from 'cookie-parser';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';
import { GrpcDateInterceptor } from './common/interceptors/grpc-date.interceptor';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalInterceptors(new GrpcDateInterceptor());

  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'http://localhost:4000',
      'https://localhost',
      'http://dev.cogna.localhost',
      'https://dev.cogna.localhost',
      'https://www.cogna.ru',
      'https://cogna.ru',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, apollo-require-preflight',
  });

  app.use(graphqlUploadExpress({ maxFileSize: 25000000, maxFiles: 1 }));

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.listen(process.env.PORT ?? 4000);
  console.log('graphql start: http://localhost:4000/graphql');
}

bootstrap();
