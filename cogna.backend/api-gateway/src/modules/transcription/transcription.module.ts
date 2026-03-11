import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionGateway } from './transcription.gateway';

@Module({
  providers: [TranscriptionGateway, TranscriptionService],
})
export class TranscriptionModule {}
