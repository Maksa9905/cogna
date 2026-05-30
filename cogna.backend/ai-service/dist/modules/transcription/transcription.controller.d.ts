import { TranscriptionService } from './transcription.service';
import { TranscriptionRequest, TranscriptionResponse, TranscriptionServiceController } from '@cogna-edu/contracts/gen/transcription/transcription';
import { Observable } from 'rxjs';
export declare class TranscriptionController implements TranscriptionServiceController {
    private readonly transcriptionService;
    constructor(transcriptionService: TranscriptionService);
    transcribeChunk(message$: Observable<TranscriptionRequest>): Observable<TranscriptionResponse>;
}
