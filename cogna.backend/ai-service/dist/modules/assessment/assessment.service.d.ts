import { ClientGrpc } from '@nestjs/microservices';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
import { GroqService } from '../../groq/groq.service';
import { StudyClient } from '../../kafka/clients/study.client';
import { ApiGatewayClient } from '../../kafka/clients/api-gateway.client';
export declare class AssessmentService {
    private readonly groqService;
    private readonly studyClient;
    private readonly apiGatewayClient;
    private contentTicketClient;
    constructor(clientContent: ClientGrpc, groqService: GroqService, studyClient: StudyClient, apiGatewayClient: ApiGatewayClient);
    processTranscription(data: ProcessRequest): Promise<void>;
    private assume;
}
