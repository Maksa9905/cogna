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
      package: 'transcription.v1',
      protoPath: 'node_modules/@cogna-edu/contracts/proto/transcription/transcription.proto',
      url: config.getOrThrow('TRANSCRIPTION_GRPC_URL', 'localhost:50054'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(4004);
}

bootstrap();
