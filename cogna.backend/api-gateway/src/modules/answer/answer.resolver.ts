import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import {
  SubmitVoiceAnswerRequestGql,
  SubmitTextAnswerRequestGql,
} from './dto/requests';
import {
  AssessmentCompletedResponseGql,
  SubmitAnswerResponseGql,
} from './dto/responses';
import { ReplaySubject } from 'rxjs';
import { TranscriptionRequest } from '@cogna-edu/contracts/dist/transcription/transcription';
import { Request } from 'express';
import { Protected } from '../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AssessmentCompletedResponse } from '@cogna-edu/contracts/gen/assessment/assessment';

export function AssessmentCompletedChannel(userId: string) {
  return `ASSESSMENT_EVENT:${userId}`;
}

@Protected(UserRole.USER)
@Resolver()
export class AnswerResolver {
  constructor(
    private readonly answerService: AnswerService,
    @Inject('PUB_SUB') private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => Boolean)
  public async submitVoiceAnswer(
    @Context('req') req: Request,
    @Args('data') dto: SubmitVoiceAnswerRequestGql,
  ): Promise<boolean> {
    const { audioContent, attemptId, chunkIndex, isLast, ticketId } = dto;
    const file = await audioContent;
    const { createReadStream } = file;
    const readStream = createReadStream();
    const userId = req.user.sub;

    const stream = new ReplaySubject<TranscriptionRequest>();
    this.answerService.transcribeVoiceChunk(stream).subscribe({
      next: (res) => {
        console.log('Транскрипция получена:', res);
      },
      error: (err) => console.error('Ошибка транскрибации:', err),
    });

    readStream.on('data', (chunk: Buffer) => {
      stream.next({
        audioContent: chunk,
        attemptId,
        ticketId,
        userId,
        chunkIndex,
        isLast,
      });
    });

    return new Promise((resolve) => {
      readStream.on('end', () => {
        stream.complete();
        resolve(true);
      });
    });
  }

  @Mutation(() => SubmitAnswerResponseGql)
  public async submitTextAnswer(
    @Context('req') req: Request,
    @Args('data') dto: SubmitTextAnswerRequestGql,
  ): Promise<SubmitAnswerResponseGql> {
    return this.answerService.submitTextAnswer({
      answer: dto.answer,
      ticketId: dto.ticketId,
      userId: req.user.sub,
    });
  }

  @Subscription(() => AssessmentCompletedResponseGql, {
    resolve: (payload: {
      onAssessmentCompleted: AssessmentCompletedResponse;
    }): AssessmentCompletedResponse => payload.onAssessmentCompleted,
  })
  onAssessmentCompleted(@Context('req') req: Request) {
    return this.pubSub.asyncIterator(AssessmentCompletedChannel(req.user.sub));
  }
}
