import { Inject, Injectable } from '@nestjs/common';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  FindAllQuizzesBySubjectIdRequest,
  GenerateQuizRequest,
  GetQuizRequest,
  QuizServiceClient,
  PatchQuizRequest,
} from '@cogna-edu/contracts/gen/content/quiz';
import { ClientGrpc } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  createGrpcClientWithMetadata,
  UserContextStore,
  WithGrpcMetadata,
} from '../../../common/utils/grpc-with-metadata.util';

@Injectable()
export class QuizService {
  private readonly quizClient: WithGrpcMetadata<QuizServiceClient>;

  constructor(
    @Inject('CONTENT_GRPC') client: ClientGrpc,
    @Inject('ALS') als: AsyncLocalStorage<UserContextStore>,
  ) {
    this.quizClient = createGrpcClientWithMetadata(
      client.getService<QuizServiceClient>('QuizService'),
      als,
    );
  }

  public createQuiz(dto: CreateQuizRequest) {
    return this.quizClient.createQuiz(dto);
  }

  public generateQuiz(dto: GenerateQuizRequest) {
    return this.quizClient.generateQuiz(dto);
  }

  public getQuiz(dto: GetQuizRequest) {
    return this.quizClient.getQuiz(dto);
  }

  public patchQuiz(dto: PatchQuizRequest) {
    return this.quizClient.patchQuiz(dto);
  }

  public deleteQuiz(dto: DeleteQuizRequest) {
    return this.quizClient.deleteQuiz(dto);
  }

  public findAllQuizzesBySubjectId(dto: FindAllQuizzesBySubjectIdRequest) {
    return this.quizClient.findAllQuizzesBySubjectId(dto);
  }
}
