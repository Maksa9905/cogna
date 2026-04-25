import { Observable } from "rxjs";
export declare const protobufPackage = "study.ticket.attempt.v1";
/**
 * Kafka. Assessment-service -> Study-service
 * Ticket Attempt
 */
export interface TicketAttemptRequest {
    ticketId: string;
    userId: string;
    subjectId: string;
    score: number;
    theses: ThesisAssessment[];
    summary: string;
}
export interface ThesisAssessment {
    thesis: string;
    assessment: string;
}
export interface TicketAttempt {
    id: string;
    ticketProgressId: string;
    score: number;
    summary: string;
    theses: ThesisAssessment[];
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface FindOneTicketAttemptRequest {
    ticketAttemptId: string;
    ticketId: string;
    userId: string;
}
export interface FindOneTicketAttemptResponse {
    ticketAttempt: TicketAttempt | undefined;
}
export interface FindAllTicketsAttemptsRequest {
    ticketId: string;
    userId: string;
}
export interface FindAllTicketsAttemptsResponse {
    ticketsAttempts: TicketAttempt[];
}
export interface BatchTicketAttemptsRequest {
    userId: string;
    ticketProgressIds: string;
}
export declare const STUDY_TICKET_ATTEMPT_V1_PACKAGE_NAME = "study.ticket.attempt.v1";
export interface StudyTicketAttemptServiceClient {
    /**
     * rpc TicketAttempt(TicketAttemptRequest) returns (google.protobuf.Empty);
     *  rpc FindOneTicketAttempt(findOneTicketAttemptRequest) returns (findOneTicketAttemptResponse);
     *  rpc FindAllTicketsAttempts(findAllTicketsAttemptsRequest) returns (findAllTicketsAttemptsResponse);
     */
    batchTicketAttemptsByTicketProgress(request: BatchTicketAttemptsRequest): Observable<FindAllTicketsAttemptsResponse>;
}
export interface StudyTicketAttemptServiceController {
    /**
     * rpc TicketAttempt(TicketAttemptRequest) returns (google.protobuf.Empty);
     *  rpc FindOneTicketAttempt(findOneTicketAttemptRequest) returns (findOneTicketAttemptResponse);
     *  rpc FindAllTicketsAttempts(findAllTicketsAttemptsRequest) returns (findAllTicketsAttemptsResponse);
     */
    batchTicketAttemptsByTicketProgress(request: BatchTicketAttemptsRequest): Promise<FindAllTicketsAttemptsResponse> | Observable<FindAllTicketsAttemptsResponse> | FindAllTicketsAttemptsResponse;
}
export declare function StudyTicketAttemptServiceControllerMethods(): (constructor: Function) => void;
export declare const STUDY_TICKET_ATTEMPT_SERVICE_NAME = "StudyTicketAttemptService";
