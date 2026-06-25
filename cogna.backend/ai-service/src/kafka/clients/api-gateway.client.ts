import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AssessmentCompletedEvent } from '@cogna-edu/contracts/gen/events/assessment/assessment';

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

  async emitAssessmentCompleted(data: AssessmentCompletedEvent) {
    await firstValueFrom(this.client.emit('assessment.completed', data));
  }
}
