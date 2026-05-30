import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayClient implements OnModuleInit {
  private readonly logger = new Logger(ApiGatewayClient.name);

  constructor(
    @Inject('API_GATEWAY_KAFKA_PRODUCER') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('API Gateway Kafka producer connected');
  }

  async emitAssessmentCompleted(data: any) {
    await firstValueFrom(this.client.emit('assessment.completed', data));
  }
}
