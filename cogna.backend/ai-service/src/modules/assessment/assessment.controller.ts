import { Controller } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { EventPattern } from '@nestjs/microservices';
import { AssessmentProcessEvent } from '@cogna-edu/contracts/gen/events/assessment/assessment';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @EventPattern('assessment.process')
  public async handleProcessTranscription(dto: AssessmentProcessEvent) {
    await this.assessmentService.processTranscription(dto);
  }
}
