import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { authRequest } from "@/shared/api";
import {
	subjectCreateSubjectMutationDocument,
	subjectDeleteSubjectMutationDocument,
	subjectFindAllQueryDocument,
	subjectFindOneQueryDocument,
	subjectUpdateSubjectMutationDocument,
} from "./graphql";
import type {
	CreateSubjectPayload,
	DeleteSubjectPayload,
	FindAllSubjectsPayload,
	FindAllSubjectsResponse,
	FindOneSubjectPayload,
	SubjectResponse,
	SuccessResponseContent,
	UpdateSubjectPayload,
} from "./types";

const subjectsKey = ["subjects"] as const;

function subjectFindAllKey(payload?: FindAllSubjectsPayload) {
	return [...subjectsKey, "list", payload ?? {}] as const;
}

function subjectFindOneKey(payload: FindOneSubjectPayload) {
	return [...subjectsKey, "one", payload.id] as const;
}

export const SUBJECT_FIND_ONE_STALE_MS = 60_000;

export function fetchSubjectFindOne(payload: FindOneSubjectPayload) {
	return authRequest<{ subjectFindOne: SubjectResponse }>(subjectFindOneQueryDocument, {
		data: payload,
	}).then((res) => res.subjectFindOne);
}

export function useSubjectFindAllQuery(payload?: FindAllSubjectsPayload) {
	return useQuery({
		queryKey: subjectFindAllKey(payload),
		queryFn: () =>
			authRequest<{ subjectFindAll: FindAllSubjectsResponse }>(subjectFindAllQueryDocument, {
				data: payload ?? {},
			}).then((res) => res.subjectFindAll),
	});
}

export function useSubjectFindOneQuery(payload: FindOneSubjectPayload, enabled: boolean = true) {
	return useQuery({
		queryKey: subjectFindOneKey(payload),
		queryFn: () => fetchSubjectFindOne(payload),
		enabled,
		staleTime: SUBJECT_FIND_ONE_STALE_MS,
	});
}

export function useCreateSubjectMutation() {
	const queryClient = useQueryClient();
	return useMutation<SubjectResponse, Error, CreateSubjectPayload>({
		mutationFn: (payload) =>
			authRequest<{ subjectCreateSubject: SubjectResponse }>(subjectCreateSubjectMutationDocument, {
				data: payload,
			}).then((res) => res.subjectCreateSubject),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subjectsKey });
		},
	});
}

export function useUpdateSubjectMutation() {
	const queryClient = useQueryClient();
	return useMutation<SubjectResponse, Error, UpdateSubjectPayload>({
		mutationFn: (payload) =>
			authRequest<{ subjectUpdateSubject: SubjectResponse }>(subjectUpdateSubjectMutationDocument, {
				data: payload,
			}).then((res) => res.subjectUpdateSubject),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subjectsKey });
		},
	});
}

export function useDeleteSubjectMutation() {
	const queryClient = useQueryClient();
	return useMutation<SuccessResponseContent, Error, DeleteSubjectPayload>({
		mutationFn: (payload) =>
			authRequest<{ subjectDeleteSubject: SuccessResponseContent }>(
				subjectDeleteSubjectMutationDocument,
				{ data: payload },
			).then((res) => res.subjectDeleteSubject),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subjectsKey });
		},
	});
}

export { subjectFindAllKey, subjectFindOneKey };
