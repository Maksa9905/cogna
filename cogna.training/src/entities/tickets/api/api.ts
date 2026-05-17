import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { authRequest } from "@/shared/api";
import { subjectFindAllKey } from "@/entities/subjects/api/api";
import {
	ticketCreateTicketMutationDocument,
	ticketDeleteTicketMutationDocument,
	ticketFindAllQueryDocument,
	ticketFindOneQueryDocument,
	ticketGenerateThesesMutationDocument,
	ticketPatchTicketMutationDocument,
} from "./graphql";
import type {
	CreateTicketPayload,
	DeleteTicketPayload,
	FindAllTicketsPayload,
	FindAllTicketsResponse,
	FindOneTicketPayload,
	GenerateThesesPayload,
	SuccessResponseContent,
	TicketResponse,
	PatchTicketPayload,
} from "./types";
import { CreateTicketSchema, FindOneTicketSchema, PatchTicketSchema } from "./schemas";
import { computed, type Ref } from "vue";

export const TICKET_FIND_ALL_STALE_MS = 60_000;

const ticketsKey = ["tickets"] as const;

async function invalidateRelatedSubjectsCache(queryClient: ReturnType<typeof useQueryClient>) {
	await queryClient.invalidateQueries({ queryKey: subjectFindAllKey() });
}

function ticketFindAllKey(payload: FindAllTicketsPayload) {
	return [
		...ticketsKey,
		"list",
		payload.subjectId,
		{ limit: payload.limit, offset: payload.offset },
	] as const;
}

function ticketFindOneKey(id: FindOneTicketPayload) {
	return [...ticketsKey, "one", id] as const;
}

export const TICKET_FIND_ONE_STALE_MS = 60_000;

export function fetchTicketFindOne(id: FindOneTicketPayload) {
	return authRequest<{ ticketFindOneTicket: TicketResponse }>(ticketFindOneQueryDocument, {
		data: { id },
	}).then((res) => res.ticketFindOneTicket);
}

export function fetchTicketFindAll(payload: FindAllTicketsPayload) {
	return authRequest<{ ticketFindAllTickets: FindAllTicketsResponse }>(ticketFindAllQueryDocument, {
		data: payload,
	}).then((res) => res.ticketFindAllTickets);
}

export function useTicketFindAllQuery(payload: Ref<FindAllTicketsPayload>, enabled: boolean = true) {
	return useQuery({
		queryKey: ticketFindAllKey(payload.value),
		queryFn: () => fetchTicketFindAll(payload.value),
		staleTime: TICKET_FIND_ALL_STALE_MS,
		enabled,
	});
}

export function useTicketFindOneQuery(payload: Ref<FindOneTicketPayload>) {
	const enabled = computed(() => FindOneTicketSchema.safeParse(payload.value).success);

	return useQuery({
		queryKey: ticketFindOneKey(payload.value),
		queryFn: () => fetchTicketFindOne(payload.value),
		enabled: enabled,
		staleTime: TICKET_FIND_ONE_STALE_MS,
	});
}

export function useCreateTicketMutation() {
	const queryClient = useQueryClient();

	return useMutation<TicketResponse, Error, CreateTicketPayload>({
		mutationFn: (payload) => {
			CreateTicketSchema.parse(payload)

			return authRequest<{ ticketCreateTicket: TicketResponse }>(ticketCreateTicketMutationDocument, {
				data: payload,
			}).then((res) => res.ticketCreateTicket)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
			void invalidateRelatedSubjectsCache(queryClient);
		},
	});
}

export function usePatchTicketMutation() {
	const queryClient = useQueryClient();
	return useMutation<TicketResponse, Error, PatchTicketPayload>({
		mutationFn: (payload) => {
			PatchTicketSchema.parse(payload)

			return authRequest<{ ticketPatchTicket: TicketResponse }>(ticketPatchTicketMutationDocument, {
				data: payload,
			}).then((res) => res.ticketPatchTicket)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
			void invalidateRelatedSubjectsCache(queryClient);
		},
	});
}

export function useDeleteTicketMutation() {
	const queryClient = useQueryClient();
	return useMutation<SuccessResponseContent, Error, DeleteTicketPayload>({
		mutationFn: (id) =>
			authRequest<{ ticketDeleteTicket: SuccessResponseContent }>(
				ticketDeleteTicketMutationDocument,
				{ data: { id } },
			).then((res) => res.ticketDeleteTicket),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
			void invalidateRelatedSubjectsCache(queryClient);
		},
	});
}

export function useGenerateThesesMutation() {
	const queryClient = useQueryClient();
	return useMutation<TicketResponse, Error, GenerateThesesPayload>({
		mutationFn: (payload) =>
			authRequest<{ ticketGenerateTheses: TicketResponse }>(ticketGenerateThesesMutationDocument, {
				data: payload,
			}).then((res) => res.ticketGenerateTheses),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
		},
	});
}

export { ticketFindAllKey, ticketFindOneKey, ticketsKey };
