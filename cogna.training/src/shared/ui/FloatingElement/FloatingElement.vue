<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
		offset?: number | { x: number; y: number };
	}>(),
	{
		position: "bottom-right",
		offset: 16,
	},
);

defineEmits<{
	(e: "click"): void;
}>();

const floatingStyle = computed(() => {
	const o =
		typeof props.offset === "number"
			? { x: props.offset, y: props.offset }
			: props.offset;

	const base = { position: "fixed" as const, zIndex: 1000 };

	switch (props.position) {
		case "top-right":
			return { ...base, top: `${o.y}px`, right: `${o.x}px` };
		case "bottom-right":
			return { ...base, bottom: `${o.y}px`, right: `${o.x}px` };
		case "top-left":
			return { ...base, top: `${o.y}px`, left: `${o.x}px` };
		case "bottom-left":
			return { ...base, bottom: `${o.y}px`, left: `${o.x}px` };
	}
});
</script>

<template>
	<div :style="floatingStyle">
		<slot />
	</div>
</template>
