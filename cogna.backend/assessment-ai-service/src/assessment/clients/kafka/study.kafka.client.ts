import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

export const getStudyKafkaClientConfig = (config: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    producerOnlyMode: true,
    client: {
      clientId: 'STUDY_CLIENT',
      brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
    },
    producer: {
      retry: {
        retries: 3,
      },
    },
  },
});