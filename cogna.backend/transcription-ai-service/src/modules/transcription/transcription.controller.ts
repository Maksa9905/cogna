import { Controller } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import {
  TranscriptionRequest,
  TranscriptionResponse,
  TranscriptionServiceController,
} from '@cogna-edu/contracts/gen/transcription/transcription';
import { TranscriptionServiceControllerMethods } from '@cogna-edu/contracts/dist/transcription/transcription';
import { Observable } from 'rxjs';
import { GrpcStreamMethod } from '@nestjs/microservices';
import * as fs from 'node:fs';

@Controller('transcription')
@TranscriptionServiceControllerMethods()
export class TranscriptionController implements TranscriptionServiceController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @GrpcStreamMethod('TranscriptionService', 'TranscribeChunk')
  transcribeChunk(
    message$: Observable<TranscriptionRequest>,
  ): Observable<TranscriptionResponse> {
    return new Observable((observer) => {
      let audioBuffer = Buffer.alloc(0);
      let metadata: { attemptId: string; chunkIndex: number; isLast: boolean };
      console.log('start truba');
      message$.subscribe({
        next: (msg) => {
          audioBuffer = Buffer.concat([
            audioBuffer,
            Buffer.from(msg.audioContent),
          ]);
          metadata = {
            attemptId: msg.attemptId,
            chunkIndex: msg.chunkIndex,
            isLast: msg.isLast,
          };
        },
        complete: () => {
          if (!metadata) {
            observer.error(new Error('No data received'));
            return;
          }
          void (async () => {
            try {
              console.log('nice');
              console.log(audioBuffer.length);

              // Теперь await работает законно
              const text =
                await this.transcriptionService.transcribe(audioBuffer);
              console.log(text);

              fs.writeFileSync('voice_massage', audioBuffer);

              observer.next({
                attemptId: metadata.attemptId,
                chunkIndex: metadata.chunkIndex,
                text: text,
                isFinal: metadata.isLast,
              });
              observer.complete();
            } catch (err) {
              observer.error(err);
            }
          })();
        },
      });
    });
  }
}
