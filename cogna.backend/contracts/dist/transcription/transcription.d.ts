import { Observable } from "rxjs";
export declare const protobufPackage = "transcription.v1";
export interface TranscriptionRequest {
    audioContent: Uint8Array;
    attemptId: string;
    ticketId: string;
    userId: string;
    chunkIndex: number;
    isLast: boolean;
}
export interface TranscriptionResponse {
    attemptId: string;
    chunkIndex: number;
    text: string;
    isFinal: boolean;
}
export declare const TRANSCRIPTION_V1_PACKAGE_NAME = "transcription.v1";
export interface TranscriptionServiceClient {
    transcribeChunk(request: Observable<TranscriptionRequest>): Observable<TranscriptionResponse>;
}
export interface TranscriptionServiceController {
    transcribeChunk(request: Observable<TranscriptionRequest>): Promise<TranscriptionResponse> | Observable<TranscriptionResponse> | TranscriptionResponse;
}
export declare function TranscriptionServiceControllerMethods(): (constructor: Function) => void;
export declare const TRANSCRIPTION_SERVICE_NAME = "TranscriptionService";
