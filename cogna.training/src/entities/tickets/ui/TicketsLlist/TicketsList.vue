<script setup lang="ts">
import {
	fetchTicketFindAll,
	fetchTicketFindOne,
	TICKET_FIND_ALL_STALE_MS,
	ticketFindAllKey,
	ticketFindOneKey,
	useDeleteTicketMutation,
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
	subjectId?: string;
	isNewSubject: boolean;
}>();

const loadingTicket = ref<string | null>(null);

const emit = defineEmits<{
  (e: 'click', data: Ticket): void
  (e: 'create'): void
}>();

type InfinityScrollExpose = {
	reload: () => Promise<void>;
};

const queryClient = useQueryClient();
const { mutateAsync: deleteTicket } = useDeleteTicketMutation()
const infinityScrollRef = ref<InfinityScrollExpose | null>(null);

async function loadMoreTickets(params: { offset: number; limit: number }) {
	if (props.isNewSubject || !props.subjectId) return {
		items: [],
		hasMore: false,
	}

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
	}, 600);

	try {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ticketFindOneKey(ticket.id),
				queryFn: () => fetchTicketFindOne(ticket.id),
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

async function handleItemDelete(ticket: Ticket) {
	if (loadingTicket.value) return;

	loadingTicket.value = ticket.id;

	try {
		await deleteTicket(ticket.id)
		await infinityScrollRef.value?.reload();
	} finally {
		loadingTicket.value = null;
	}
}

const handleAddTicket = () => {
	emit('create')
}
</script>

<template>
	<InfinityScroll ref="infinityScrollRef" :load-more="loadMoreTickets" :limit="PAGE_SIZE" class="tickets-list">
		<InfinityScroll.List as="ul" class="tickets-list__list" v-slot="{ item, index }">
			<TicketsListItem
				:key="(item as Ticket).id"
				:ticket="item as Ticket"
				:order="index + 1"
				:is-loading="loadingTicket === (item as Ticket).id"
				@click="() => handleItemClick(item as Ticket)"
				@delete="() => handleItemDelete(item as Ticket)"
			/>
		</InfinityScroll.List>
		<InfinityScroll.Mark />
		<InfinityScroll.Empty>
			<div class="empty-tickets">
				<span class="empty-tickets__label">
					Список билетов пока пуст. Создайте свой первый билет.
				</span>
				<UButton variant="link" @click="handleAddTicket" trailing-icon="i-lucide-plus">
					Добавить билет
				</UButton>
			</div>
		</InfinityScroll.Empty>
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


.empty-tickets {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 200px;
	gap: 16px;
}

.empty-tickets__label {
	color: var(--ui-text-toned);
	text-align: center;
}
</style>
