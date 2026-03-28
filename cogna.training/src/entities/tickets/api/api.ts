import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { authRequest } from "@/shared/api";
import {
	ticketCreateTicketMutationDocument,
	ticketDeleteTicketMutationDocument,
	ticketFindAllQueryDocument,
	ticketFindOneQueryDocument,
	ticketGenerateThesesMutationDocument,
	ticketUpdateTicketMutationDocument,
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
	UpdateTicketPayload,
} from "./types";

export const TICKET_FIND_ALL_STALE_MS = 60_000;

const ticketsKey = ["tickets"] as const;

function ticketFindAllKey(payload: FindAllTicketsPayload) {
	return [
		...ticketsKey,
		"list",
		payload.subjectId,
		{ limit: payload.limit, offset: payload.offset },
	] as const;
}

function ticketFindOneKey(payload: FindOneTicketPayload) {
	return [...ticketsKey, "one", payload.id] as const;
}

export const TICKET_FIND_ONE_STALE_MS = 60_000;

export function fetchTicketFindOne(payload: FindOneTicketPayload) {
	return authRequest<{ ticketFindOneTicket: TicketResponse }>(ticketFindOneQueryDocument, {
		data: payload,
	}).then((res) => res.ticketFindOneTicket);
}

export function fetchTicketFindAll(payload: FindAllTicketsPayload) {
	return authRequest<{ ticketFindAllTickets: FindAllTicketsResponse }>(ticketFindAllQueryDocument, {
		data: payload,
	}).then((res) => res.ticketFindAllTickets);
}

export function useTicketFindAllQuery(payload: FindAllTicketsPayload, enabled: boolean = true) {
	return useQuery({
		queryKey: ticketFindAllKey(payload),
		queryFn: () => fetchTicketFindAll(payload),
		staleTime: TICKET_FIND_ALL_STALE_MS,
		enabled,
	});
}

export function useTicketFindOneQuery(payload: FindOneTicketPayload, enabled: boolean = true) {
	return useQuery({
		queryKey: ticketFindOneKey(payload),
		queryFn: () => fetchTicketFindOne(payload),
		enabled,
		staleTime: TICKET_FIND_ONE_STALE_MS,
	});
}

export function useCreateTicketMutation() {
	const queryClient = useQueryClient();
	return useMutation<TicketResponse, Error, CreateTicketPayload>({
		mutationFn: (payload) =>
			authRequest<{ ticketCreateTicket: TicketResponse }>(ticketCreateTicketMutationDocument, {
				data: payload,
			}).then((res) => res.ticketCreateTicket),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
		},
	});
}

export function useUpdateTicketMutation() {
	const queryClient = useQueryClient();
	return useMutation<TicketResponse, Error, UpdateTicketPayload>({
		mutationFn: (payload) =>
			authRequest<{ ticketUpdateTicket: TicketResponse }>(ticketUpdateTicketMutationDocument, {
				data: payload,
			}).then((res) => res.ticketUpdateTicket),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
		},
	});
}

export function useDeleteTicketMutation() {
	const queryClient = useQueryClient();
	return useMutation<SuccessResponseContent, Error, DeleteTicketPayload>({
		mutationFn: (payload) =>
			authRequest<{ ticketDeleteTicket: SuccessResponseContent }>(
				ticketDeleteTicketMutationDocument,
				{ data: payload },
			).then((res) => res.ticketDeleteTicket),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ticketsKey });
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
