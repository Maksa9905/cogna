import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { TranscriptionService } from './transcription.service';
import { AppendAnswerChunkRequestGql } from './dto/requests/append-answer-chunk.request';
import { ReplaySubject } from 'rxjs';
import { TranscriptionRequest } from '@cogna-edu/contracts/dist/transcription/transcription';
import { Request } from 'express';
import { Protected } from '../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';


@Protected(UserRole.USER)
@Resolver()
export class TranscriptionResolver {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Mutation(() => Boolean)
  public async appendAnswerChunk(
    @Context('req') req: Request,
    @Args('data') dto: AppendAnswerChunkRequestGql,
  ) {
    const { audioContent, attemptId, chunkIndex, isLast, ticketId } = dto;
    const file = await audioContent;
    const { createReadStream } = file;
    const readStream = createReadStream();
    const userId = req.user.sub;

    const stream = new ReplaySubject<TranscriptionRequest>();
    console.log('!:',audioContent);
    console.log('ticket id', ticketId);
    this.transcriptionService.createTranscriptionChunk(stream).subscribe({
      next: (res) => {
        console.log('текст получен', res);
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
        stream.complete(); // Закрываем gRPC стрим
        resolve(true);
      });
    });
  }
}
