<script setup lang="ts">
import { BrainLogotype } from "@/shared/icons";

interface Props {
	badgeClass?: string;
	containerClass?: string;
	variant: 'icon' | 'textWithIcon'
}

const { variant = 'icon' } = defineProps<Props>();
</script>

<template>
	<a href="/"> <span v-if="variant === 'icon'" class='logotype' :class="containerClass">
		<BrainLogotype class="brain-logotype" />
  </span>

  <span v-else class='logotype' :class="containerClass">
		<span class="logotype-text">C</span>
		<BrainLogotype class="brain-logotype" />
		<span class="logotype-text">gna</span>
  </span>
	</a>
</template>

<style scoped>
.logotype {
	position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.1em;
	height: 1em;
	font-size: 24px;
	font-weight: 600;
}

.o-character {
	opacity: 0;
	position: absolute;
}

.brain-logotype {
	height: 1em;
	width: fit-content;
}

.logotype-text {
  font-size: 24px;
  color: var(--color-gray-1);
}
</style>