import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service',
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: 'notification-consumer',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
      run: {
        autoCommit: false,
      },
    },
  });
  await app.startAllMicroservices();
  console.log('start all microservices...');
}

bootstrap();
