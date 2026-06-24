import { Inject, Injectable } from '@nestjs/common';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  FindAllQuizzesByTicketIdRequest,
  GetQuizRequest,
  QuizServiceClient,
  PatchQuizRequest,
} from '@cogna-edu/contracts/dist/content/quiz';
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

  public getQuiz(dto: GetQuizRequest) {
    return this.quizClient.getQuiz(dto);
  }

  public patchQuiz(dto: PatchQuizRequest) {
    return this.quizClient.patchQuiz(dto);
  }

  public deleteQuiz(dto: DeleteQuizRequest) {
    return this.quizClient.deleteQuiz(dto);
  }

  public findAllQuizzesByTicketId(dto: FindAllQuizzesByTicketIdRequest) {
    return this.quizClient.findAllQuizzesByTicketId(dto);
  }
}
