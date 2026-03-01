<script setup lang="ts">
defineOptions({
	name: "FeaturesListItemTitle",
});
</script>

<template>
  <p class="feature-item-title">
    <slot></slot>
  </p>
</template>

<style scoped>
.feature-item-title {
  grid-column: 2;
  grid-row: 1;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-gray-1);
  text-wrap: nowrap;
}
</style>