export interface ThesisInput {
	value: string;
	importance: string;
}

export interface Thesis {
	id: string;
	value: string;
	importance: string;
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
	subjectId: string;
	question: string;
	answer: string;
	theses?: ThesisInput[];
}

export interface UpdateTicketPayload {
	id: string;
	question?: string;
	answer?: string;
	theses?: ThesisInput[];
}

export interface DeleteTicketPayload {
	id: string;
}

export interface FindOneTicketPayload {
	id: string;
}

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
