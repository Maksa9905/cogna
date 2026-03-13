import { Observable } from "rxjs";
import { SuccessResponse } from "./common";
export declare const protobufPackage = "ticket.v1";
/** Сущность тезиса для использования в ответах */
export interface Thesis {
    id: string;
    /** Сам тезис */
    value: string;
    importance: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface ThesisInput {
    value: string;
    importance: string;
}
/** Основной объект билета */
export interface Ticket {
    id: string;
    subjectId: string;
    question: string;
    answer: string;
    theses: Thesis[];
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
/** Сообщения для RPC */
export interface CreateTicketRequest {
    subjectId: string;
    question: string;
    answer: string;
    theses: ThesisInput[];
}
export interface TicketResponse {
    ticket: Ticket | undefined;
}
export interface FindAllTicketsRequest {
    /** Чтобы найти все билеты конкретного предмета */
    subjectId: string;
    limit?: number | undefined;
    offset?: number | undefined;
}
export interface FindAllTicketsResponse {
    tickets: Ticket[];
    totalCount: number;
}
export interface FindOneTicketRequest {
    id: string;
    userId: string;
}
export interface UpdateTicketRequest {
    id: string;
    userId: string;
    question?: string | undefined;
    answer?: string | undefined;
    theses: ThesisInput[];
}
export interface DeleteTicketRequest {
    id: string;
    userId: string;
}
/** Запрос на генерацию тезисов */
export interface GenerateThesesRequest {
    ticketId: string;
    question: string;
    answer: string;
}
export declare const TICKET_V1_PACKAGE_NAME = "ticket.v1";
export interface TicketServiceClient {
    createTicket(request: CreateTicketRequest): Observable<TicketResponse>;
    findAllTickets(request: FindAllTicketsRequest): Observable<FindAllTicketsResponse>;
    findOneTicket(request: FindOneTicketRequest): Observable<TicketResponse>;
    updateTicket(request: UpdateTicketRequest): Observable<TicketResponse>;
    deleteTicket(request: DeleteTicketRequest): Observable<SuccessResponse>;
    /** Метод для (пере)генерации тезисов через ИИ */
    generateTheses(request: GenerateThesesRequest): Observable<TicketResponse>;
}
export interface TicketServiceController {
    createTicket(request: CreateTicketRequest): Promise<TicketResponse> | Observable<TicketResponse> | TicketResponse;
    findAllTickets(request: FindAllTicketsRequest): Promise<FindAllTicketsResponse> | Observable<FindAllTicketsResponse> | FindAllTicketsResponse;
    findOneTicket(request: FindOneTicketRequest): Promise<TicketResponse> | Observable<TicketResponse> | TicketResponse;
    updateTicket(request: UpdateTicketRequest): Promise<TicketResponse> | Observable<TicketResponse> | TicketResponse;
    deleteTicket(request: DeleteTicketRequest): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse;
    /** Метод для (пере)генерации тезисов через ИИ */
    generateTheses(request: GenerateThesesRequest): Promise<TicketResponse> | Observable<TicketResponse> | TicketResponse;
}
export declare function TicketServiceControllerMethods(): (constructor: Function) => void;
export declare const TICKET_SERVICE_NAME = "TicketService";
