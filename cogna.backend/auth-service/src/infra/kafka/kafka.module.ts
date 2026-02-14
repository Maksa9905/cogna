import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaNotificationClient } from './clients/kafka-notification.client';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'auth-producer',
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
  providers: [KafkaNotificationClient],
  exports: [KafkaNotificationClient],
})
export class KafkaModule {}
