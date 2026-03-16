import { Global, Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AssessmentClient } from './clients/assessment.client';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): KafkaOptions => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'kafka_producer',
              brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
            },
            producer: {
              allowAutoTopicCreation: true,
              idempotent: true,
              retry: {
                retries: 5,
              },
            },
          },
        }),
      },
    ]),
  ],
  providers: [AssessmentClient],
  exports: [AssessmentClient],
})
export class KafkaModule {}
