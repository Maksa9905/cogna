import { Controller } from '@nestjs/common';
import { QuizGenerationService } from './quiz-generation.service';
import {
  QuizGenerationServiceController,
  QuizGenerationServiceControllerMethods,
} from '@cogna-edu/contracts/dist/internal/ai/quiz_generation';
import { GenerateQuizRequest } from '@cogna-edu/contracts/gen/internal/ai/quiz_generation';

@Controller()
@QuizGenerationServiceControllerMethods()
export class QuizGenerationController implements QuizGenerationServiceController {
  constructor(private readonly service: QuizGenerationService) {}

  generateQuiz(request: GenerateQuizRequest) {
    return this.service.generateQuiz(request);
  }
}
