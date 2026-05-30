import { Controller } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { EventPattern } from '@nestjs/microservices';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @EventPattern('assessment.process')
  public async handleProcessTranscription(dto: ProcessRequest) {
    await this.assessmentService.processTranscription(dto);
  }
}
