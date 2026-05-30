import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
export declare class GroqService {
    private readonly configService;
    private _groq;
    constructor(configService: ConfigService);
    get client(): Groq;
}
