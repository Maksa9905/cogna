import { Injectable } from '@nestjs/common';
import { BaseClient } from './base.client';
import { ProcessTranscriptionRequest } from '@cogna-edu/contracts/gen/assessment/assessment';

@Injectable()
export class AssessmentClient extends BaseClient {
  public async assessment(data: ProcessTranscriptionRequest) {
    await this.emit('assessment.process-transcription', data);
  }
}
