import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  TranscriptionRequest,
  TranscriptionResponse,
} from '@cogna-edu/contracts/gen/transcription/transcription';
import { Observable } from 'rxjs';
import { TranscriptionCacheService } from '../transcription-cache/transcription-cache.service';
import { AssessmentClient } from '../../infra/kafka/clients/assessment.client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private readonly agent: HttpsProxyAgent<string>;
  private groq: Groq;

  constructor(
    private readonly configService: ConfigService,
    private readonly cache: TranscriptionCacheService,
    private readonly assessmentClient: AssessmentClient,
  ) {
    const proxyUrl = this.configService.getOrThrow<string>('PROXY_URL');
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');

    this.agent = new HttpsProxyAgent(proxyUrl);

    this.groq = new Groq({
      apiKey: apiKey,
      httpAgent: this.agent,
    });

    this.logger.log('AppService инициализирован');
  }

  public handleTranscriptionStream(
    message$: Observable<TranscriptionRequest>,
  ): Observable<TranscriptionResponse> {
    return new Observable((observer) => {
      let audioBuffer = Buffer.alloc(0);
      let lastMetadata: TranscriptionRequest;

      message$.subscribe({
        next: (msg) => {
          // Накапливаем буфер
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
                console.log('it was last chunk');
                const finalText = await this.cache.getFullTranscription(
                  lastMetadata.attemptId,
                );
                console.log('text:', finalText);
                console.log('ticketId', lastMetadata.ticketId);
                await this.assessmentClient.assessment({
                  answer: finalText,
                  userId: lastMetadata.userId,
                  ticketId: lastMetadata.ticketId,
                });
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
      console.log('start transcription...');
      const response = await this.groq.audio.transcriptions.create({
        model: 'whisper-large-v3-turbo',
        file: await Groq.toFile(bufferFile, 'audio.mp3'),
        response_format: 'verbose_json',
        language: 'ru',
      });
      // console.log(response);
      return response.text;
    } catch (e) {
      this.logger.error('Ошибка при отправке groq api', e);
      throw new RpcException({});
    }
  }
}
