export { default as SubjectsListItem } from "./ui/SubjectsListItem";
export { default as SubjectsList } from "./ui/SubjectsList";

export {
	useSubjectFindAllQuery,
	useSubjectFindOneQuery,
	useCreateSubjectMutation,
	useUpdateSubjectMutation,
	useDeleteSubjectMutation,
	subjectFindAllKey,
	subjectFindOneKey,
} from "./api/api";

export type {
	Subject,
	SubjectResponse,
	FindAllSubjectsResponse,
	SuccessResponseContent,
	CreateSubjectPayload,
	UpdateSubjectPayload,
	DeleteSubjectPayload,
	FindOneSubjectPayload,
	FindAllSubjectsPayload,
} from "./api/types";
