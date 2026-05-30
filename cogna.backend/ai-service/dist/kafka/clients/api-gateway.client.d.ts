import { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
export declare class ApiGatewayClient implements OnModuleInit {
    private readonly client;
    private readonly logger;
    constructor(client: ClientKafka);
    onModuleInit(): Promise<void>;
    emitAssessmentCompleted(data: any): Promise<void>;
}
