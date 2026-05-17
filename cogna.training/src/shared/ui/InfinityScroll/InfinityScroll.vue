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
const firstPageLoaded = ref(false);
const firstPageEmpty = ref(false);

function resetState() {
	items.value = [];
	loading.value = false;
	hasMore.value = true;
	firstPageLoaded.value = false;
	firstPageEmpty.value = false;
}

async function triggerLoadMore() {
	if (loading.value || !hasMore.value) return;

	loading.value = true;
	const offset = items.value.length;

	try {
		const result = await props.loadMore({
			offset,
			limit: props.limit,
		});
		items.value = [...items.value, ...result.items];
		hasMore.value = result.hasMore ?? result.items.length >= props.limit;
		if (offset === 0) {
			firstPageLoaded.value = true;
			firstPageEmpty.value = result.items.length === 0;
		}
	} finally {
		loading.value = false;
	}
}

async function reload() {
	resetState();
	await triggerLoadMore();
}

defineExpose({
	reload,
});

provide(INFINITY_SCROLL_KEY, {
	items,
	loading,
	hasMore,
	firstPageLoaded,
	firstPageEmpty,
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
