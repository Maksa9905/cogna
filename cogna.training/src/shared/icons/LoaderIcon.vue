<script setup lang="ts">
defineOptions({
  name: "LoaderIcon",
});
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" class="loader-icon" aria-hidden="true">
    <title>loading</title>
    <circle class="loader-icon__circle" cx="12" cy="12" r="10" />
  </svg>
</template>

<style scoped>
.loader-icon {
  display: block;
  animation: loader-icon-spin 1.1s linear infinite;
}

.loader-icon__circle {
  stroke-dasharray: 12 52;
}

@keyframes loader-icon-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
