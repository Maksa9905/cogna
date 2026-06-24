import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const rootProtoDir = 'node_modules/@cogna-edu/contracts/proto';

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['common.content.v1', 'subject.v1', 'ticket.v1', 'content.quiz.v1'],
      protoPath: [
        'content/common.proto',
        'content/subject.proto',
        'content/ticket.proto',
        'content/quiz.proto',
      ],
      loader: {
        includeDirs: [rootProtoDir],
      },
      url: config.getOrThrow<string>('CONTENT_GRPC_URL', '0.0.0.0:50052'),
    },
  });

  await app.startAllMicroservices();
  await app.init();
}

bootstrap();
