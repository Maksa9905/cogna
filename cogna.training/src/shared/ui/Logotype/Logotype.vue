<script setup lang="ts">
import Badge from "../Badge";

interface Props {
	badgeClass?: string;
	containerClass?: string;
}

defineProps<Props>();
</script>

<template>
  <span class='logotype' :class="containerClass">
    <Badge variant='transparent' class="character" :class="badgeClass">C</Badge>
    <span class="logotype-text">Cogna</span>
  </span>
</template>

<style scoped>
.character {
  font-weight: 800;
  font-size: 20px;
  width: 36px;
  height: 36px;
}

.logotype {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.logotype-text {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-gray-1);
}
</style>