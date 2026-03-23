import { Observable } from "rxjs";
import { Empty } from "../google/protobuf/empty";
export declare const protobufPackage = "study.ticket.v1";
/** Kafka. Assessment-service -> Study-service */
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
export declare const STUDY_TICKET_V1_PACKAGE_NAME = "study.ticket.v1";
export interface StudyTicketServiceClient {
    ticketAttempt(request: TicketAttemptRequest): Observable<Empty>;
}
export interface StudyTicketServiceController {
    ticketAttempt(request: TicketAttemptRequest): void | Promise<void>;
}
export declare function StudyTicketServiceControllerMethods(): (constructor: Function) => void;
export declare const STUDY_TICKET_SERVICE_NAME = "StudyTicketService";
