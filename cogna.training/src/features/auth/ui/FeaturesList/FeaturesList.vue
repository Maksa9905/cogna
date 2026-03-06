<script setup lang="ts">
defineOptions({
	name: "FeaturesList",
});
</script>

<template>
  <ul class="features-list">
    <slot></slot>
  </ul>
</template>

<style scoped>
.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>