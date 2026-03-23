import { Injectable } from '@nestjs/common';
import { BaseClient } from './base.client';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';

@Injectable()
export class AssessmentClient extends BaseClient {
  public async assessment(data: ProcessRequest) {
    await this.emit('assessment.process', data);
  }
}
