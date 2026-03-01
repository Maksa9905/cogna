<script setup lang="ts">
defineOptions({
	name: "AuthDescription",
});
</script>

<template>
  <p class="description">
    <slot></slot>
  </p>
</template>

<style scoped>
.description {
  font-size: 14px;
  color: var(--color-gray-5);
}
</style>
