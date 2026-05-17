<script setup lang="ts">
import { computed, inject } from "vue";
import { INFINITY_SCROLL_KEY, type InfinityScrollContext } from "./constants";

defineOptions({
	name: "InfinityScrollEmpty",
});

const context = inject<InfinityScrollContext>(INFINITY_SCROLL_KEY);

const showEmpty = computed(() => {
	if (!context) return false;
	return context.firstPageLoaded.value && context.firstPageEmpty.value && !context.loading.value;
});
</script>

<template>
	<div v-if="showEmpty" class="infinity-scroll-empty">
		<slot />
	</div>
</template>

<style scoped>
.infinity-scroll-empty {
	display: flex;
	flex-direction: column;
}
</style>
