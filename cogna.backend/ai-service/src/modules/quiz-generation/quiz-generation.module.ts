import { Module } from '@nestjs/common';
import { QuizGenerationController } from './quiz-generation.controller';
import { QuizGenerationService } from './quiz-generation.service';

@Module({
  controllers: [QuizGenerationController],
  providers: [QuizGenerationService],
})
export class QuizGenerationModule {}
