import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'Study_client',
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: 'study_group',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: [
        'study.subject.progress.v1',
        'study.ticket.attempt.v1',
        'study.ticket.progress.v1',
      ],
      protoPath: [
        'node_modules/@cogna-edu/contracts/proto/study/subject-progress.proto',
        'node_modules/@cogna-edu/contracts/proto/study/ticket-progress.proto',
        'node_modules/@cogna-edu/contracts/proto/study/ticket-attempt.proto',
      ],
      url: config.getOrThrow<string>('STUDY_GRPC_URL', '0.0.0.0:50056'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<number>('HTTP_PORT', 4006));
}

bootstrap();
