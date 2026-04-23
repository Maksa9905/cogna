import { Module } from '@nestjs/common';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [PubSubModule],
})
export class InfraModule {}
