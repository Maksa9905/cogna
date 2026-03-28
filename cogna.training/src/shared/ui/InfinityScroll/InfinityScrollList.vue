<script setup lang="ts">
import { computed, inject, onScopeDispose, ref, watch } from "vue";
import {
	INFINITY_SCROLL_KEY,
	INFINITY_SCROLL_LOADING_UI_DELAY_MS,
	type InfinityScrollContext,
} from "./constants";

defineOptions({
	name: "InfinityScrollList",
});

const props = withDefaults(
	defineProps<{
		as?: "div" | "ul";
	}>(),
	{ as: "div" },
);

const context = inject<InfinityScrollContext>(INFINITY_SCROLL_KEY);

const items = computed(() => context?.items.value ?? []);
const loading = computed(() => context?.loading.value ?? false);

const showSkeleton = ref(false);
let skeletonTimer: ReturnType<typeof setTimeout> | undefined;

watch(
	loading,
	(isLoading) => {
		if (skeletonTimer !== undefined) {
			clearTimeout(skeletonTimer);
			skeletonTimer = undefined;
		}
		if (!isLoading) {
			showSkeleton.value = false;
			return;
		}
		showSkeleton.value = false;
		skeletonTimer = setTimeout(() => {
			skeletonTimer = undefined;
			if (loading.value) {
				showSkeleton.value = true;
			}
		}, INFINITY_SCROLL_LOADING_UI_DELAY_MS);
	},
	{ flush: "sync" },
);

onScopeDispose(() => {
	if (skeletonTimer !== undefined) {
		clearTimeout(skeletonTimer);
	}
});

const showItems = computed(() => !loading.value || !showSkeleton.value);
</script>

<template>
	<component :is="props.as" class="infinity-scroll-list">
		<template v-if="showItems">
			<template v-for="(item, index) in items" :key="index">
				<slot :item="item" :index="index" />
			</template>
		</template>
		<template v-if="loading && showSkeleton">
			<USkeleton v-for="i in 5" :key="i" class="h-[90px] w-full bg-default rounded-lg" />
		</template>
	</component>
</template>

<style scoped>
.infinity-scroll-list {
	display: flex;
	flex-direction: column;
}
</style>
