import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GroqModule } from './groq/groq.module';
import { KafkaModule } from './kafka/kafka.module';
import { ThesisModule } from './modules/thesis/thesis.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GroqModule,
    KafkaModule,
    ThesisModule,
    AssessmentModule,
    TranscriptionModule,
  ],
})
export class AppModule {}
