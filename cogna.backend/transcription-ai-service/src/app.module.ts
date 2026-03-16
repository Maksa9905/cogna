import { Module } from '@nestjs/common';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { ConfigModule } from '@nestjs/config';
import { TranscriptionCacheModule } from './modules/transcription-cache/transcription-cache.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TranscriptionModule,
    TranscriptionCacheModule,
    InfraModule,
  ],
})
export class AppModule {}
