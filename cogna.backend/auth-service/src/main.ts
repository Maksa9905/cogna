import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['auth.v1', 'user.v1'],
      protoPath: [
        'node_modules/@cogna-edu/contracts/proto/auth/auth.proto',
        'node_modules/@cogna-edu/contracts/proto/auth/user.proto',
      ],
      url: config.getOrThrow<string>('AUTH_GRPC_URL', '0.0.0.0:50051'),
    },
  });

  const KAFKA_BROKERS = config.getOrThrow<string>('KAFKA_BROKERS').split(',');
  console.log('Kafka brokers:', KAFKA_BROKERS);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS,
        clientId: 'auth-service',
      },
      consumer: {
        groupId: 'auth-consumer',
        sessionTimeout: 10000,
        heartbeatInterval: 3000,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  console.log('started all microservices...');
}

bootstrap();
