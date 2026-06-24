import { Controller, UseInterceptors } from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  CreateQuizRequest,
  CreateQuizResponse,
  DeleteQuizRequest,
  FindAllQuizzesByTicketIdRequest,
  FindAllQuizzesByTicketIdResponse,
  GetQuizRequest,
  QuizResponse,
  QuizServiceController,
  PatchQuizRequest,
} from '@cogna-edu/contracts/gen/content/quiz';
import { QuizServiceControllerMethods } from '@cogna-edu/contracts/dist/content/quiz';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import { MetadataInterceptor } from '../../common/interseptors/metadata.interceptor';

@Controller()
@UseInterceptors(MetadataInterceptor)
@QuizServiceControllerMethods()
export class QuizController implements QuizServiceController {
  constructor(private readonly quizService: QuizService) {}

  createQuiz(request: CreateQuizRequest): Promise<CreateQuizResponse> {
    return this.quizService.createQuiz(request);
  }

  getQuiz(request: GetQuizRequest): Promise<QuizResponse> {
    return this.quizService.getQuiz(request);
  }

  patchQuiz(request: PatchQuizRequest): Promise<QuizResponse> {
    return this.quizService.patchQuiz(request);
  }

  deleteQuiz(request: DeleteQuizRequest): Promise<SuccessResponse> {
    return this.quizService.deleteQuiz(request);
  }

  findAllQuizzesByTicketId(
    request: FindAllQuizzesByTicketIdRequest,
  ): Promise<FindAllQuizzesByTicketIdResponse> {
    return this.quizService.findAllQuizzesByTicketId(request);
  }
}
