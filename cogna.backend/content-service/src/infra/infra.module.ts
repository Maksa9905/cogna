import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [KafkaModule, PrismaModule],
})
export class InfraModule {}
