import { ContentGenerationService } from './content-generation.service';
import { ThesisServiceController } from '@cogna-edu/contracts/dist/thesis/thesis';
import { GenerateAnswerRequest, GenerateThesesRequest } from '@cogna-edu/contracts/gen/thesis/thesis';
export declare class ContentGenerationController implements ThesisServiceController {
    private readonly service;
    constructor(service: ContentGenerationService);
    createThesis(request: GenerateThesesRequest): Promise<import("@cogna-edu/contracts/gen/thesis/thesis").GenerateThesesResponse>;
    generateAnswer(request: GenerateAnswerRequest): Promise<import("@cogna-edu/contracts/gen/thesis/thesis").GenerateAnswerResponse>;
}
