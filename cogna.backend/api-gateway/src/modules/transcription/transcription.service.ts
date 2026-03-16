import { Inject, Injectable } from '@nestjs/common';
import {
  TranscriptionRequest,
  TranscriptionResponse,
  TranscriptionServiceClient,
} from '@cogna-edu/contracts/dist/transcription/transcription';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class TranscriptionService {
  private transcriptionClient: TranscriptionServiceClient;

  constructor(
    @Inject('TRANSCRIPTION_CLIENT') private readonly client: ClientGrpc,
  ) {
    this.transcriptionClient = client.getService<TranscriptionServiceClient>(
      'TranscriptionService',
    );
  }

  public createTranscriptionChunk(
    requestStream: Observable<TranscriptionRequest>,
  ): Observable<TranscriptionResponse> {
    return this.transcriptionClient.transcribeChunk(requestStream);
  }
}
