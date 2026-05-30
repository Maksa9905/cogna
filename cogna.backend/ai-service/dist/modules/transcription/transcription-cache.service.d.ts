import { RedisService } from '@liaoliaots/nestjs-redis';
export declare class TranscriptionCacheService {
    private readonly redisService;
    private readonly redis;
    constructor(redisService: RedisService);
    saveChunksByAttempt(attemptId: string, chunkIndex: number, text: string): Promise<void>;
    getFullTranscription(attemptId: string): Promise<string>;
}
