import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class BaseClient implements OnModuleInit {
  private readonly logger = new Logger(BaseClient.name);

  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  public async emit(pattern: string, data: any) {
    console.log(`[Kafka] Отправка в топик ${pattern}...`);
    try {
      await firstValueFrom(this.client.emit(pattern, data));
      this.logger.log(`[Kafka] ✅ Сообщение записано!`);
    } catch (err) {
      console.error(`[Kafka] ❌ ОШИБКА записи:`, err);
      throw err;
    }
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('--- Kafka Producer Connected ---');
  }
}
