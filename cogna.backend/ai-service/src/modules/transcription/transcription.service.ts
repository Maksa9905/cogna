import { Injectable, Logger } from '@nestjs/common';
import {
  TranscriptionRequest,
  TranscriptionResponse,
} from '@cogna-edu/contracts/gen/transcription/transcription';
import { Observable } from 'rxjs';
import { TranscriptionCacheService } from './transcription-cache.service';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@cogna-edu/corn';
import { GroqService } from '../../groq/groq.service';
import Groq from 'groq-sdk';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(
    private readonly groqService: GroqService,
    private readonly cache: TranscriptionCacheService,
  ) {}

  public handleTranscriptionStream(
    message$: Observable<TranscriptionRequest>,
  ): Observable<TranscriptionResponse> {
    return new Observable((observer) => {
      let audioBuffer = Buffer.alloc(0);
      let lastMetadata: TranscriptionRequest;

      message$.subscribe({
        next: (msg) => {
          audioBuffer = Buffer.concat([
            audioBuffer,
            Buffer.from(msg.audioContent),
          ]);
          lastMetadata = msg;
        },
        error: (err) => observer.error(err),
        complete: () => {
          if (!lastMetadata) {
            throw new Error('No data received');
          }
          void (async () => {
            try {
              const text = await this.transcribe(audioBuffer);

              await this.cache.saveChunksByAttempt(
                lastMetadata.attemptId,
                lastMetadata.chunkIndex,
                text,
              );
              if (!lastMetadata.isLast) {
                observer.next({
                  attemptId: lastMetadata.attemptId,
                  chunkIndex: lastMetadata.chunkIndex,
                  text: text,
                  isFinal: lastMetadata.isLast,
                });
              } else {
                const finalText = await this.cache.getFullTranscription(
                  lastMetadata.attemptId,
                );
                observer.next({
                  attemptId: lastMetadata.attemptId,
                  chunkIndex: lastMetadata.chunkIndex,
                  text: finalText,
                  isFinal: lastMetadata.isLast,
                });
              }
              observer.complete();
            } catch (e) {
              observer.error(e);
            }
          })();
        },
      });
    });
  }

  public async transcribe(bufferFile: Buffer): Promise<string> {
    try {
      this.logger.log('start transcription...');
      const response =
        await this.groqService.client.audio.transcriptions.create({
          model: 'whisper-large-v3-turbo',
          file: await Groq.toFile(bufferFile, 'audio.mp3'),
          response_format: 'verbose_json',
          language: 'ru',
        });
      return response.text;
    } catch (e) {
      this.logger.error('Ошибка при отправке groq api', e);
      throw new RpcException({
        code: RpcStatus.UNAVAILABLE,
        message: 'transcription service unavailable',
      });
    }
  }
}
