import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import * as cookieParser from 'cookie-parser';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';
import { GrpcDateInterceptor } from './common/interceptors/grpc-date.interceptor';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function bootstrap() {
  //todo для продакшена k8s от этого надо будет избавится
  const rootPath = process.cwd(); // Всегда корень проекта (/app в докере)
  const httpsOptions = {
    key: fs.readFileSync(
      path.join(rootPath, 'dist/common/ca/localhost+2-key.pem'),
    ),
    cert: fs.readFileSync(
      path.join(rootPath, 'dist/common/ca/localhost+2.pem'),
    ),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(cookieParser());

  app.useGlobalInterceptors(new GrpcDateInterceptor());

  app.enableCors({
    // Разрешаем конкретно песочницу и локалку
    origin: ['https://studio.apollographql.com', 'http://localhost:4000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.listen(process.env.PORT ?? 4000);
  console.log('graphql start: https://localhost:4000/graphql');
}

bootstrap();
