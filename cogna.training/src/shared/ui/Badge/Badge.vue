<script setup lang="ts">
const { variant = "filled" } = defineProps<{
	variant?: "transparent" | "filled";
}>();
</script>

<template>
  <span :class="variant" class="badge-container">
    <slot></slot>
  </span>
</template>

<style scoped>
.badge-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  color: var(--text-color-inverted);
  overflow: hidden;
}

.filled {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.transparent {
  background: transparent;
  position: relative;
  border: 1px solid var(--text-color-inverted);
}

.transparent::before {
  content: "";
  background-color: var(--text-color-inverted);
  opacity: 0.2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  position: absolute;
}
</style>