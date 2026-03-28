<script setup lang="ts">
import { getColorFromName } from '@/shared/lib';
import { computed } from 'vue';

defineOptions({
  name: "UserAvatar",
});

const { name } = defineProps<{
  src?: string;
  name: string;
}>();

const color = computed(() => {
  return getColorFromName(name);
});
</script>

<template>
  <div class="user-avatar">
    <img v-if="src":src="src" alt="User Avatar" class="user-avatar__image" />
    <span v-else class="user-avatar__name" :style="{ background: color }">{{ name[0] }}</span>
  </div>
</template>

<style scoped>
.user-avatar {
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
}

.user-avatar__name {
  min-width: 48px;
  min-height: 48px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>