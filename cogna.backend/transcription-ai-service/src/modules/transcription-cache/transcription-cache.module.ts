import { Module } from '@nestjs/common';
import { TranscriptionCacheService } from './transcription-cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        readyLog: true,
        config: {
          host: config.getOrThrow<string>('REDIS_HOST', 'localhost'),
          port: config.getOrThrow<number>('REDIST_PORT', 6379),
        },
      }),
    }),
  ],
  providers: [TranscriptionCacheService],
  exports: [TranscriptionCacheService],
})
export class TranscriptionCacheModule {}
