<script setup lang="ts">
defineOptions({
	name: "FeaturesListItem",
});
</script>

<template>
  <li class="feature-item">
    <slot></slot>
  </li>
</template>

<style scoped>
.feature-item {
  display: grid;
  grid-template-columns: 36px 1fr;
  grid-template-rows: auto auto;
  row-gap: 8px;
  column-gap: 16px;
}
</style>