<script setup lang="ts">
import { computed, inject, onMounted, onScopeDispose, onUnmounted, ref, watch } from "vue";
import {
	INFINITY_SCROLL_KEY,
	INFINITY_SCROLL_LOADING_UI_DELAY_MS,
	type InfinityScrollContext,
} from "./constants";
import { useI18n } from "vue-i18n";

defineOptions({
	name: "InfinityScrollMark",
});

const { t } = useI18n();

const markRef = ref<HTMLElement | null>(null);
const context = inject<InfinityScrollContext>(INFINITY_SCROLL_KEY);

const loading = computed(() => context?.loading.value ?? false);

const showLoadingLabel = ref(false);
let loadingLabelTimer: ReturnType<typeof setTimeout> | undefined;

watch(
	loading,
	(isLoading) => {
		if (loadingLabelTimer !== undefined) {
			clearTimeout(loadingLabelTimer);
			loadingLabelTimer = undefined;
		}
		if (!isLoading) {
			showLoadingLabel.value = false;
			return;
		}
		showLoadingLabel.value = false;
		loadingLabelTimer = setTimeout(() => {
			loadingLabelTimer = undefined;
			if (loading.value) {
				showLoadingLabel.value = true;
			}
		}, INFINITY_SCROLL_LOADING_UI_DELAY_MS);
	},
	{ flush: "sync" },
);

onScopeDispose(() => {
	if (loadingLabelTimer !== undefined) {
		clearTimeout(loadingLabelTimer);
	}
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
	if (!context || !markRef.value) return;
	observer = new IntersectionObserver(
		(entries) => {
			const [entry] = entries;
			if (entry?.isIntersecting) {
				void context.triggerLoadMore();
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
	<div v-if="context?.hasMore.value" ref="markRef" class="infinity-scroll-mark">
		<template v-if="showLoadingLabel">
			<slot>{{ t("loading") }}</slot>
		</template>
	</div>
</template>

<style scoped>
.infinity-scroll-mark {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 20px;
	padding: 12px;
	color: var(--text-color-muted, #666);
	font-size: 14px;
}
</style>
