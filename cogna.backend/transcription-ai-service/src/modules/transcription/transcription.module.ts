import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionCacheService } from '../transcription-cache/transcription-cache.service';

@Module({
  controllers: [TranscriptionController],
  providers: [TranscriptionService, TranscriptionCacheService],
})
export class TranscriptionModule {}
