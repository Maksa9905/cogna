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
      package: ['thesis.v1', 'transcription.v1'],
      protoPath: [
        'node_modules/@cogna-edu/contracts/proto/thesis/thesis.proto',
        'node_modules/@cogna-edu/contracts/proto/transcription/transcription.proto',
      ],
      url: config.getOrThrow('AI_GRPC_URL', '0.0.0.0:50051'),
      loader: {
        includeDirs: ['node_modules/@cogna-edu/contracts/proto'],
      },
    },
  });

  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
        clientId: 'ai_service',
      },
      consumer: {
        groupId: 'ai_consumer',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.get('AI_HTTP_PORT', 4003));
  console.log('ai-service started: gRPC :50051, HTTP :4003');
}

bootstrap();
