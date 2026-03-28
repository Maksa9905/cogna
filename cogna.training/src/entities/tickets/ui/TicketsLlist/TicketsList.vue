<script setup lang="ts">
import {
	fetchTicketFindAll,
	fetchTicketFindOne,
	TICKET_FIND_ALL_STALE_MS,
	ticketFindAllKey,
	ticketFindOneKey,
} from "../../api/api";
import { InfinityScroll } from "@/shared/ui";
import { useQueryClient } from "@tanstack/vue-query";
import type { Ticket } from "../../api/types";
import TicketsListItem from "./TicketsListItem.vue";
import { ref } from "vue";
import { SUBJECT_FIND_ONE_STALE_MS } from "@/entities/subjects";
import { RouterUtils } from "@/shared/router";

defineOptions({
	name: "TicketsList",
});

const PAGE_SIZE = 10;

const props = defineProps<{
	subjectId: string;
}>();

const loadingTicket = ref<string | null>(null);

const emit = defineEmits<(e: "click", ticket: Ticket) => void>();

const queryClient = useQueryClient();

async function loadMoreTickets(params: { offset: number; limit: number }) {
	const payload = {
		subjectId: props.subjectId,
		offset: params.offset,
		limit: params.limit,
	};
	const { tickets, totalCount } = await queryClient.fetchQuery({
		queryKey: ticketFindAllKey(payload),
		queryFn: () => fetchTicketFindAll(payload),
		staleTime: TICKET_FIND_ALL_STALE_MS,
	});
	const nextOffset = params.offset + tickets.length;

	return {
		items: tickets,
		hasMore: nextOffset < totalCount,
	};
}

async function handleItemClick(ticket: Ticket) {
	if (loadingTicket.value) return;

	const timeout = setTimeout(() => {
		loadingTicket.value = ticket.id;
	}, 400);

	try {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ticketFindOneKey({ id: ticket.id }),
				queryFn: () => fetchTicketFindOne({ id: ticket.id }),
				staleTime: SUBJECT_FIND_ONE_STALE_MS,
			}),

			RouterUtils.loadPage('ticket')
		]);
	} finally {
		clearTimeout(timeout);
		loadingTicket.value = null;
	}

	emit("click", ticket);
}
</script>

<template>
	<InfinityScroll :load-more="loadMoreTickets" :limit="PAGE_SIZE" class="tickets-list">
		<InfinityScroll.List as="ul" class="tickets-list__list" v-slot="{ item, index }">
			<TicketsListItem
				:key="(item as Ticket).id"
				:ticket="item as Ticket"
				:order="index + 1"
				:is-loading="loadingTicket === (item as Ticket).id"
				@click="() => handleItemClick(item as Ticket)"
			/>
		</InfinityScroll.List>
		<InfinityScroll.Mark />
	</InfinityScroll>
</template>

<style scoped>
.tickets-list {
	width: 100%;
}

.tickets-list__list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
}
</style>
