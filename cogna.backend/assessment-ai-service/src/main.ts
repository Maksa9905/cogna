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
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
        clientId: 'assessment_service',
      },
      consumer: {
        groupId: 'assessment_consumer',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 4005);
}

bootstrap();
