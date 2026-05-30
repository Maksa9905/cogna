import { Global, Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudyClient } from './clients/study.client';
import { ApiGatewayClient } from './clients/api-gateway.client';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'STUDY_KAFKA_PRODUCER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): KafkaOptions => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'study_producer',
              brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
            },
            producer: {
              retry: { retries: 3 },
            },
          },
        }),
      },
      {
        name: 'API_GATEWAY_KAFKA_PRODUCER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): KafkaOptions => ({
          transport: Transport.KAFKA,
          options: {
            producerOnlyMode: true,
            client: {
              clientId: 'api_gateway_producer',
              brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
            },
            producer: {
              retry: { retries: 3 },
            },
          },
        }),
      },
    ]),
  ],
  providers: [StudyClient, ApiGatewayClient],
  exports: [StudyClient, ApiGatewayClient],
})
export class KafkaModule {}
