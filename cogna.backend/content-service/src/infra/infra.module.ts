import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlsModule } from './als/als.module';

@Module({
  imports: [KafkaModule, PrismaModule, AlsModule],
})
export class InfraModule {}
