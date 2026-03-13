import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranscriptionModule } from './modules/transcription/transcription.module';

@Module({
  imports: [TranscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
