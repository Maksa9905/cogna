<script setup lang="ts">
defineOptions({
	name: "AuthTitle",
});
</script>

<template>
  <h1 class="title">
    <slot></slot>
  </h1>
</template>

<style scoped>
.title {
  font-size: 26px;
  margin-bottom: 8px;
}
</style>
