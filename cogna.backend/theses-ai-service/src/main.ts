import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'thesis.v1',
      url: config.getOrThrow<string>('THESES_GRPC_URL', 'localhost:50054'),
      protoPath: [
        'node_modules/@cogna-edu/contracts/proto/thesis/thesis.proto',
      ],
    },
  });

  await app.startAllMicroservices();
  await app.listen(4003);
}

bootstrap();
