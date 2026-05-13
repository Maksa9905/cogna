<script setup lang="ts">
import { onScopeDispose, ref, watch } from "vue";
import { INFINITY_SCROLL_LOADING_UI_DELAY_MS } from "../InfinityScroll/constants";

defineOptions({
	name: "Skeleton",
});

const props = withDefaults(
	defineProps<{
		isLoading: boolean;
		delayMs?: number;
	}>(),
	{
		delayMs: INFINITY_SCROLL_LOADING_UI_DELAY_MS,
	},
);

const showDelayedSkeleton = ref(false);
const hasShownContentOnce = ref(false);
let delayTimer: ReturnType<typeof setTimeout> | undefined;

watch(
	() => props.isLoading,
	(loading) => {
		if (delayTimer !== undefined) {
			clearTimeout(delayTimer);
			delayTimer = undefined;
		}
		if (!loading) {
			hasShownContentOnce.value = true;
			showDelayedSkeleton.value = false;
			return;
		}
		if (hasShownContentOnce.value) {
			showDelayedSkeleton.value = true;
			return;
		}
		showDelayedSkeleton.value = false;
		delayTimer = setTimeout(() => {
			delayTimer = undefined;
			if (props.isLoading) {
				showDelayedSkeleton.value = true;
			}
		}, props.delayMs);
	},
	{ flush: "sync", immediate: true },
);

onScopeDispose(() => {
	if (delayTimer !== undefined) {
		clearTimeout(delayTimer);
	}
});
</script>

<template>
	<Transition name="skeleton-fade" mode="out-in">
		<div v-if="!isLoading" key="content" class="skeleton-root__panel">
			<slot />
		</div>
		<div v-else-if="showDelayedSkeleton" key="skeleton" class="skeleton-root__panel">
			<slot name="skeleton" />
		</div>
		<div
			v-else
			key="waiting"
			class="skeleton-root__panel skeleton-root__waiting"
			aria-busy="true"
		/>
	</Transition>
</template>

<style scoped>
.skeleton-root__panel {
	flex: 1;
	min-height: 0;
}

.skeleton-root__waiting {
	min-height: 1px;
	pointer-events: none;
	visibility: hidden;
}

.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
	transition: opacity 0.10s ease;
}

.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
	opacity: 0;
}
</style>
