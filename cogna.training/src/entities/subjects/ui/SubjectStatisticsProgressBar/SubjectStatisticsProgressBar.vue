<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  learned: number;
  total: number;
}>();

const progressPercent = ref(0);

const progress = computed(() => {
  if (props.total > 0) {
    return Math.round((props.learned / props.total) * 100);
  }

  return 0;
});

watch(() => progress.value, () => {
  if (progress.value > 0) {
    progressPercent.value = progress.value;
  }
});

const { t } = useI18n();
</script>

<template>
  <UTooltip v-if="total > 0" :text="t('subjects.progress', { percent: progress, learned: props.learned, total: props.total } )" placement="top">
    <UProgress class="subject-statistics-progress-bar" :model-value="progress" :max="100" />
  </UTooltip>
</template>

<style scoped>
.subject-statistics-progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 0;
  background-color: var(--ui-bg-accented);
}
</style>