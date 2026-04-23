import { Module } from '@nestjs/common';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { GraphQLUpload } from 'graphql-upload-ts';
import { ClientsModule, GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnswerController } from './answer.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRANSCRIPTION_KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            package: 'transcription.v1',
            url: config.getOrThrow<string>(
              'TRANSCRIPTION_GRPC_URL',
              'localhost:50054',
            ),
            protoPath: [
              './node_modules/@cogna-edu/contracts/proto/transcription/transcription.proto',
            ],
          },
        }),
      },
      {
        name: 'ASSESSMENT_KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): KafkaOptions => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'ASSESSMENT_CLIENT',
              brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
            },
            producer: {
              allowAutoTopicCreation: true,
              retry: {
                retries: 5,
              },
            },
          },
        }),
      },
    ]),
  ],
  providers: [
    AnswerResolver,
    AnswerService,
    {
      provide: 'GraphQLUpload',
      useValue: GraphQLUpload,
    },
  ],
  controllers: [AnswerController],
})
export class AnswerModule {}
