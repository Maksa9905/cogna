import { Global, Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaStudyClient } from './clients/kafka-study.client';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): KafkaOptions => ({
          transport: Transport.KAFKA,

          options: {
            client: {
              clientId: 'content-client',
              brokers: configService
                .getOrThrow<string>('KAFKA_BROKERS')
                .split(','),
            },
            producer: {
              allowAutoTopicCreation: true,
              retry: {
                retries: 5,
                maxRetryTime: 3000,
              },
            },
            producerOnlyMode: true,
            run: {
              autoCommit: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [KafkaStudyClient],
  exports: [KafkaStudyClient],
})
export class KafkaModule {}
