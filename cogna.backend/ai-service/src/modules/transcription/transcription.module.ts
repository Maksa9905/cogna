import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionCacheService } from './transcription-cache.service';
import { TranscriptionCacheModule } from './transcription-cache.module';

@Module({
  imports: [TranscriptionCacheModule],
  controllers: [TranscriptionController],
  providers: [TranscriptionService],
})
export class TranscriptionModule {}
