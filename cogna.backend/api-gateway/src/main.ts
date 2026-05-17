import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import * as cookieParser from 'cookie-parser';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';
import { GrpcDateInterceptor } from './common/interceptors/grpc-date.interceptor';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalInterceptors(new GrpcDateInterceptor());

  const config = app.get(ConfigService);

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
        clientId: 'cogna_graphql_service',
      },
      consumer: {
        groupId: 'cogna_graphql_group',
      },
    },
  });

  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'http://localhost:4000',
      'https://localhost',
      'http://dev.cogna.localhost',
      'https://dev.cogna.localhost',
      'https://www.cogna.ru',
      'https://cogna.ru',
      'http://192.168.0.100:5173',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Accept, Authorization, apollo-require-preflight',
  });

  app.use(graphqlUploadExpress({ maxFileSize: 25000000, maxFiles: 1 }));

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(4000);
  console.log('graphql start: http://localhost:4000/graphql');
}

bootstrap();
