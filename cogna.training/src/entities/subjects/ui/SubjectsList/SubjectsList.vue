<script setup lang="ts">
import {
	fetchSubjectFindOne,
	subjectFindOneKey,
	SUBJECT_FIND_ONE_STALE_MS,
} from "../../api/api";
import { authRequest } from "@/shared/api";
import { InfinityScroll } from "@/shared/ui";
import { useQueryClient } from "@tanstack/vue-query";
import { subjectFindAllQueryDocument } from "../../api/graphql";
import type { Subject } from "../../api/types";
import SubjectsListItem from "../SubjectsListItem/SubjectsListItem.vue";
import { ref } from "vue";
import { fetchTicketFindAll, TICKET_FIND_ALL_STALE_MS, ticketFindAllKey } from "@/entities/tickets";

defineOptions({
	name: "SubjectsList",
});

const loadingSubject = ref<string | null>(null);

const queryClient = useQueryClient();

const emit = defineEmits<(e: "click", subject: Subject) => void>();

const PAGE_SIZE = 10;

async function loadMoreSubjects(params: { offset: number; limit: number }) {
	const res = await authRequest<{ subjectFindAll: { subjects: Subject[] } }>(
		subjectFindAllQueryDocument,
		{ data: { offset: params.offset, limit: params.limit } },
	);

	const subjects = res.subjectFindAll.subjects;
	return {
		items: subjects,
		hasMore: subjects.length >= params.limit,
	};
}


async function handleItemClick(subject: Subject) {
	if (loadingSubject.value) return;

	const timeout = setTimeout(() => {
		loadingSubject.value = subject.id;
	}, 400);

	try {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: subjectFindOneKey(subject.id),
				queryFn: () => fetchSubjectFindOne(subject.id),
				staleTime: SUBJECT_FIND_ONE_STALE_MS,
			}),

			queryClient.prefetchQuery({
				queryKey: ticketFindAllKey({ subjectId: subject.id, offset: 0, limit: 10  }),
				queryFn: () => fetchTicketFindAll({ subjectId: subject.id, offset: 0, limit: 10 }),
				staleTime: TICKET_FIND_ALL_STALE_MS,
			}),
		]);
	} finally {
		clearTimeout(timeout);
		loadingSubject.value = null;
	}

	emit("click", subject);
}
</script>

<template>
	<InfinityScroll :load-more="loadMoreSubjects" :limit="PAGE_SIZE" class="subjects-list">
		<InfinityScroll.List as="ul" class="subjects-list__list" v-slot="{ item }">
			<SubjectsListItem 
				:key="(item as Subject).id" 
				:title="(item as Subject).title"
				:progress="87"
				:learned-tickets="32" 
				:total-tickets="28"
				:average-score="74" 
				:is-loading="loadingSubject === (item as Subject).id"
				:examination-date="'2026-03-15T12:00:00.000Z'"
				:latest-lesson-date="'2026-03-14T12:00:00.000Z'" 
				@click="handleItemClick(item as Subject)" />
		</InfinityScroll.List>
		<InfinityScroll.Mark />
		<InfinityScroll.Empty>
			<div class="empty-subjects">
				<span class="empty-subjects__label">
					Список предметов пока пуст. Создайте свой первый предмет.
				</span>
				<UButton variant="link" trailing-icon="i-lucide-plus">
					Создать предмет
				</UButton>
			</div>
		</InfinityScroll.Empty>
	</InfinityScroll>
</template>

<style scoped>
.subjects-list {
	width: 100%;
}

.subjects-list__list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.empty-subjects {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 200px;
	gap: 16px;
}

.empty-subjects__label {
	color: var(--ui-text-toned);
	text-align: center;
}
</style>
