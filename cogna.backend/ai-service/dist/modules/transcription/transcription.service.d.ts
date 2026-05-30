import { TranscriptionRequest, TranscriptionResponse } from '@cogna-edu/contracts/gen/transcription/transcription';
import { Observable } from 'rxjs';
import { TranscriptionCacheService } from './transcription-cache.service';
import { GroqService } from '../../groq/groq.service';
export declare class TranscriptionService {
    private readonly groqService;
    private readonly cache;
    private readonly logger;
    constructor(groqService: GroqService, cache: TranscriptionCacheService);
    handleTranscriptionStream(message$: Observable<TranscriptionRequest>): Observable<TranscriptionResponse>;
    transcribe(bufferFile: Buffer): Promise<string>;
}
