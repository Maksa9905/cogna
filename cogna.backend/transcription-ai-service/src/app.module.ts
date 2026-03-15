import { Module } from '@nestjs/common';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { ConfigModule } from '@nestjs/config';
import { TranscriptionCacheModule } from './modules/transcription-cache/transcription-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TranscriptionModule,
    TranscriptionCacheModule,
  ],
})
export class AppModule {}
