<script setup lang="ts">
import { ref, provide } from "vue";
import { INFINITY_SCROLL_KEY } from "./constants";

export interface LoadMoreParams {
	offset: number;
	limit: number;
}

export interface LoadMoreResult {
	items: unknown[];
	hasMore?: boolean;
}

defineOptions({
	name: "InfinityScroll",
});

const props = withDefaults(
	defineProps<{
		loadMore: (params: LoadMoreParams) => Promise<LoadMoreResult>;
		limit?: number;
	}>(),
	{ limit: 10 },
);

const items = ref<unknown[]>([]);
const loading = ref(false);
const hasMore = ref(true);

async function triggerLoadMore() {
	if (loading.value || !hasMore.value) return;

	loading.value = true;

	try {
		const result = await props.loadMore({
			offset: items.value.length,
			limit: props.limit,
		});
		items.value = [...items.value, ...result.items];
		hasMore.value = result.hasMore ?? result.items.length >= props.limit;
	} finally {
		loading.value = false;
	}
}

provide(INFINITY_SCROLL_KEY, {
	items,
	loading,
	hasMore,
	triggerLoadMore,
});
</script>

<template>
	<div class="infinity-scroll">
		<slot />
	</div>
</template>

<style scoped>
.infinity-scroll {
	display: flex;
	flex-direction: column;
}
</style>
