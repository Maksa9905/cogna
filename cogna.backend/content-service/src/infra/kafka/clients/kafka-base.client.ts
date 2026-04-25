import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class KafkaBaseClient {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  public async emit(pattern: string, data: any) {
    await firstValueFrom(this.client.emit(pattern, data));
  }
}
