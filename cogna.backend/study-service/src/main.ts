import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'study.ticket.v1',
      url: config.getOrThrow<string>('STUDY_GRPC_URL', 'localhost:50056'),
      protoPath: 'node_modules/@cogna-edu/contracts/proto/study/ticket.proto',
    },
  });

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'Study_client',
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(',')
      },
      consumer: {
        groupId: 'study_group',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
      },
      run: {
        autoCommit: false,
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<number>('HTTP_PORT', 4006));
}

bootstrap();
