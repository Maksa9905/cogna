import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
import {
  TranscriptionRequest,
  TranscriptionResponse,
  TranscriptionServiceClient,
} from '@cogna-edu/contracts/dist/transcription/transcription';

@Injectable()
export class AnswerService implements OnModuleInit {
  private transcriptionClient: TranscriptionServiceClient;

  constructor(
    @Inject('TRANSCRIPTION_KAFKA_CLIENT')
    private readonly grpcClient: ClientGrpc,
    @Inject('ASSESSMENT_KAFKA_CLIENT')
    private readonly assessmentKafka: ClientKafka,
  ) {
    this.transcriptionClient =
      grpcClient.getService<TranscriptionServiceClient>('TranscriptionService');
  }

  async onModuleInit() {
    await this.assessmentKafka.connect();
  }

  public transcribeVoiceChunk(
    requestStream: Observable<TranscriptionRequest>,
  ): Observable<TranscriptionResponse> {
    return this.transcriptionClient.transcribeChunk(requestStream);
  }

  public async submitTextAnswer(dto: ProcessRequest) {
    await firstValueFrom(this.assessmentKafka.emit('assessment.process', dto));
    return { success: true };
  }
}
