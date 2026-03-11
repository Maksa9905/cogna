export interface Subject {
	id: string;
	userId: string;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface SubjectResponse {
	subject: Subject | null;
}

export interface FindAllSubjectsResponse {
	subjects: Subject[];
}

export interface SuccessResponseContent {
	ok: boolean;
}

export interface CreateSubjectPayload {
	title: string;
}

export interface UpdateSubjectPayload {
	id: string;
	title: string;
}

export interface DeleteSubjectPayload {
	id: string;
}

export interface FindOneSubjectPayload {
	id: string;
}

export interface FindAllSubjectsPayload {
	limit?: number;
	offset?: number;
}
