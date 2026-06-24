import { Module } from '@nestjs/common';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { AlsModule } from '../als/als.module';

@Module({
  imports: [PubSubModule, AlsModule],
})
export class InfraModule {}
