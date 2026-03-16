import { Controller } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { EventPattern } from '@nestjs/microservices';
import { ProcessTranscriptionRequest } from '@cogna-edu/contracts/gen/assessment/assessment';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @EventPattern('assessment.process-transcription')
  public async handleProcessTranscription(dto: ProcessTranscriptionRequest) {
    await this.assessmentService.processTranscription(dto)
  }
}
