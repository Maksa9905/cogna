<script setup lang="ts">
import { InfinityScroll } from "@/shared/ui";
import { authRequest } from "@/shared/api";
import { subjectFindAllQueryDocument } from "../../api/graphql";
import type { Subject } from "../../api/types";
import SubjectsListItem from "../SubjectsListItem/SubjectsListItem.vue";

defineOptions({
	name: "SubjectsList",
});

const emit = defineEmits<{
	(e: "click", subject: Subject): void;
}>();

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

function handleItemClick(subject: Subject) {
	emit("click", subject);
}
</script>

<template>
	<InfinityScroll
		:load-more="loadMoreSubjects"
		:limit="PAGE_SIZE"
		class="subjects-list"
	>
		<InfinityScroll.List as="ul" class="subjects-list__list" v-slot="{ item }">
			<SubjectsListItem
				:key="(item as Subject).id"
				:title="(item as Subject).title"
				:progress="0"
				:learned-tickets="0"
				:total-tickets="0"
				:average-score="0"
				:examination-date="(item as Subject).createdAt"
				:latest-lesson-date="(item as Subject).updatedAt"
				@click="handleItemClick(item as Subject)"
			/>
		</InfinityScroll.List>
		<InfinityScroll.Mark />
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
</style>
