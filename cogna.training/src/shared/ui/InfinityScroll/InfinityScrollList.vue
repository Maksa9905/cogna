<script setup lang="ts">
import { inject, computed } from "vue";
import { INFINITY_SCROLL_KEY, type InfinityScrollContext } from "./constants";

defineOptions({
	name: "InfinityScrollList",
});

const props = withDefaults(
	defineProps<{
		/** HTML-тег контейнера (например "ul" для списка с li) */
		as?: "div" | "ul";
	}>(),
	{ as: "div" },
);

const context = inject<InfinityScrollContext>(INFINITY_SCROLL_KEY);

const items = computed(() => context?.items.value ?? []);
</script>

<template>
	<component :is="props.as" class="infinity-scroll-list">
		<template v-for="(item, index) in items" :key="index">
			<slot :item="item" :index="index" />
		</template>
	</component>
</template>

<style scoped>
.infinity-scroll-list {
	display: flex;
	flex-direction: column;
}
</style>
