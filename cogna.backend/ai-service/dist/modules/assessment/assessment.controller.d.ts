import { AssessmentService } from './assessment.service';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
export declare class AssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: AssessmentService);
    handleProcessTranscription(dto: ProcessRequest): Promise<void>;
}
