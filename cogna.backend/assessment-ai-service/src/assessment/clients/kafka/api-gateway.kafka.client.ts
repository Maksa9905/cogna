import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export function getApiGatewayKafkaClient(config: ConfigService): KafkaOptions{
  return {
    transport: Transport.KAFKA,
    options: {
      producerOnlyMode: true,
      client: {
        clientId: 'API_GATEWAY_CLIENT',
        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
      },
      producer: {
        retry: {
          retries: 3,
        },
      },
    }
  }
}