import { Observable } from "rxjs";
export declare const protobufPackage = "study.ticket.progress.v1";
export interface TicketProgress {
    id: string;
    ticketId: string;
    userId: string;
    subjectId: string;
    totalCount: number;
    bestScore: number;
    lastScore: number;
    averageScore: number;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface FindOneTicketProgressRequest {
    ticketId: string;
    subjectId: string;
    userId: string;
}
export interface FindOneTicketProgressResponse {
    ticketProgress: TicketProgress | undefined;
}
export interface FindAllTicketsProgressRequest {
    subjectId: string;
    userId: string;
}
export interface FindAllTicketsProgressResponse {
    ticketsProgress: TicketProgress[];
}
export interface BatchTicketProgressBySubjectsRequest {
    userId: string;
    subjectIds: string[];
}
export declare const STUDY_TICKET_PROGRESS_V1_PACKAGE_NAME = "study.ticket.progress.v1";
export interface StudyTicketProgressServiceClient {
    findOneTicketProgress(request: FindOneTicketProgressRequest): Observable<FindOneTicketProgressResponse>;
    findAllTicketProgress(request: FindAllTicketsProgressRequest): Observable<FindAllTicketsProgressResponse>;
    batchTicketProgressBySubjects(request: BatchTicketProgressBySubjectsRequest): Observable<FindAllTicketsProgressResponse>;
}
export interface StudyTicketProgressServiceController {
    findOneTicketProgress(request: FindOneTicketProgressRequest): Promise<FindOneTicketProgressResponse> | Observable<FindOneTicketProgressResponse> | FindOneTicketProgressResponse;
    findAllTicketProgress(request: FindAllTicketsProgressRequest): Promise<FindAllTicketsProgressResponse> | Observable<FindAllTicketsProgressResponse> | FindAllTicketsProgressResponse;
    batchTicketProgressBySubjects(request: BatchTicketProgressBySubjectsRequest): Promise<FindAllTicketsProgressResponse> | Observable<FindAllTicketsProgressResponse> | FindAllTicketsProgressResponse;
}
export declare function StudyTicketProgressServiceControllerMethods(): (constructor: Function) => void;
export declare const STUDY_TICKET_PROGRESS_SERVICE_NAME = "StudyTicketProgressService";
