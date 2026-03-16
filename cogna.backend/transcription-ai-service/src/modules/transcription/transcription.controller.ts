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
    return this.transcriptionService.handleTranscriptionStream(message$);
  }
}
