export enum EThesisImportance {
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW",
}

export interface ThesisInput {
	id?: string
	value: string;
	importance: EThesisImportance;
}

export interface Thesis {
	id: string;
	value: string;
	importance: EThesisImportance;
	createdAt: string;
	updatedAt: string;
}

export interface Ticket {
	id: string;
	subjectId: string;
	question: string;
	answer: string;
	theses: Thesis[];
	createdAt: string;
	updatedAt: string;
}

export interface TicketResponse {
	ticket: Ticket | undefined;
}

export interface FindAllTicketsResponse {
	tickets: Ticket[];
	totalCount: number;
}

export interface SuccessResponseContent {
	ok: boolean;
}

export interface CreateTicketPayload {
	question: string;
	answer: string;
	subjectId: string;
	theses?: ThesisInput[];
}

export interface PatchTicketPayload {
	id: string;
	question?: string;
	answer?: string;
	theses?: ThesisInput[];
}

export type DeleteTicketPayload = string

export type FindOneTicketPayload = string

export interface FindAllTicketsPayload {
	subjectId: string;
	limit?: number;
	offset?: number;
}

export interface GenerateThesesPayload {
	ticketId: string;
	question: string;
	answer: string;
}

export interface SubmitAnswerPayload {
	answer: string,
	ticketId: string
}

export interface SubmitAnswerResponse {
	success: boolean
}

export interface ThesisAssessment {
	thesis: string;
	assessment: string;
}

export interface AssessmentCompletedResponse {
	ticketId: string;
	userId: string;
	subjectId: string;
	score: number;
	theses: ThesisAssessment[];
	summary: string;
}