import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudyClient implements OnModuleInit {
  private readonly logger = new Logger(StudyClient.name);

  constructor(
    @Inject('STUDY_KAFKA_PRODUCER') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Study Kafka producer connected');
  }

  async emitTicketAttempt(pattern: string, data: any) {
    await firstValueFrom(this.client.emit(pattern, data));
  }
}
