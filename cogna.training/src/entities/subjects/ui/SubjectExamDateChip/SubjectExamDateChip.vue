<script setup lang="ts">
import { DateUtils } from '@/shared/lib';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
  name: "SubjectExamDateChip",
});

const { date } = defineProps<{
  date: string | null;
}>();

const remainingDays = computed(() => {
  return DateUtils.getRemainingDays(date ?? '');
});
</script>

<template>
  <div class="subject-exam-date-chip">
    <p v-if="remainingDays" class="remaining-days">{{ t('subjects.remainingDays', remainingDays, { named: { days: remainingDays } }) }}</p>  </div>
</template>

<style scoped>
.subject-exam-date-chip {
  background-color: var(--ui-bg-accented);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-default);
}
</style>