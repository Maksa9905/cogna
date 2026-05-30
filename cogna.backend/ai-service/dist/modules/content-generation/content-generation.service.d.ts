import { GenerateAnswerRequest, GenerateAnswerResponse, GenerateThesesRequest, GenerateThesesResponse } from '@cogna-edu/contracts/gen/thesis/thesis';
import { GroqService } from '../../groq/groq.service';
export declare class ContentGenerationService {
    private readonly groqService;
    constructor(groqService: GroqService);
    generateThesis(dto: GenerateThesesRequest): Promise<GenerateThesesResponse>;
    generateAnswer(dto: GenerateAnswerRequest): Promise<GenerateAnswerResponse>;
}
