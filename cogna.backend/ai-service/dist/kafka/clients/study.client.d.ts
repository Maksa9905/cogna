import { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
export declare class StudyClient implements OnModuleInit {
    private readonly client;
    private readonly logger;
    constructor(client: ClientKafka);
    onModuleInit(): Promise<void>;
    emitTicketAttempt(pattern: string, data: any): Promise<void>;
}
