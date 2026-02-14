import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  providers: [],
  imports: [RedisModule, PrismaModule, KafkaModule],
})
export class InfraModule {}
