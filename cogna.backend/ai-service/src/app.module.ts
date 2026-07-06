import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GroqModule } from './groq/groq.module';
import { KafkaModule } from './kafka/kafka.module';
import { ContentGenerationModule } from './modules/content-generation/content-generation.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { QuizGenerationModule } from './modules/quiz-generation/quiz-generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GroqModule,
    KafkaModule,
    ContentGenerationModule,
    AssessmentModule,
    TranscriptionModule,
    QuizGenerationModule,
  ],
})
export class AppModule {}
