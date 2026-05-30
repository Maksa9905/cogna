import { ThesisService } from './thesis.service';
import { ThesisServiceController } from '@cogna-edu/contracts/dist/thesis/thesis';
import { GenerateAnswerRequest, GenerateThesesRequest } from '@cogna-edu/contracts/gen/thesis/thesis';
export declare class ThesisController implements ThesisServiceController {
    private readonly thesisService;
    constructor(thesisService: ThesisService);
    createThesis(request: GenerateThesesRequest): Promise<import("@cogna-edu/contracts/gen/thesis/thesis").GenerateThesesResponse>;
    generateAnswer(request: GenerateAnswerRequest): Promise<import("@cogna-edu/contracts/gen/thesis/thesis").GenerateAnswerResponse>;
}
