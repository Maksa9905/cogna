<script setup lang="ts">
defineOptions({
  name: "CoursesListItem",
});
</script>

<template>
  <li class="course-list-item">
    <div class="circular-progress"></div>
  </li>
</template>

<style scoped>
.course-list-item {
  width: 100%;
  height: 120px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr 1fr;
}
</style>