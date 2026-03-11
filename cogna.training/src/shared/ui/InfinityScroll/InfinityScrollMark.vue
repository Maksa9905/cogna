<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue";
import { INFINITY_SCROLL_KEY, type InfinityScrollContext } from "./constants";

defineOptions({
	name: "InfinityScrollMark",
});

const markRef = ref<HTMLElement | null>(null);
const context = inject<InfinityScrollContext>(INFINITY_SCROLL_KEY);

let observer: IntersectionObserver | null = null;

onMounted(() => {
	if (!context || !markRef.value) return;
	observer = new IntersectionObserver(
		(entries) => {
			const [entry] = entries;
			if (entry?.isIntersecting) {
				context.triggerLoadMore();
			}
		},
		{ rootMargin: "100px", threshold: 0 },
	);

	observer.observe(markRef.value);
});

onUnmounted(() => {
	if (observer && markRef.value) {
		observer.unobserve(markRef.value);
	}
	observer = null;
});
</script>

<template>
	<div ref="markRef" class="infinity-scroll-mark">
		<slot>Loading</slot>
	</div>
</template>

<style scoped>
.infinity-scroll-mark {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px;
	color: var(--text-color-muted, #666);
	font-size: 14px;
}
</style>
