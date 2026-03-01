<script setup lang="ts">
defineOptions({
	name: "FeaturesListItemDescription",
});
</script>

<template>
  <p class="feature-item-description">
    <slot></slot>
  </p>
</template>

<style scoped>
.feature-item-description {
  grid-column: 2;
  grid-row: 2;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-purple-3);
}
</style>