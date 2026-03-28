<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ClockIcon, LoaderIcon } from "@/shared/icons";
import { CircularProgress } from '@/shared/ui';
import { SubjectsListItemUtils } from "./SubjectsListItem.utils";

const { t } = useI18n();

defineOptions({
  name: "SubjectsListItem",
});

const emit = defineEmits<(e: "click") => void>();

const handleClick = () => {
  emit("click");
};

const { ...props } = defineProps<{
  title: string;
  progress: number;
  learnedTickets: number;
  totalTickets: number;
  averageScore: number;
  examinationDate: string;
  latestLessonDate: string;
  isLoading?: boolean;
}>();

const timeSinceLastRepetition = computed(() =>
  SubjectsListItemUtils.getTimeSinceLastRepetition(props.latestLessonDate),
);

const lastRepetitionText = computed(() => {
  const msg = SubjectsListItemUtils.getLastRepetitionMessage(timeSinceLastRepetition.value);
  return msg.n != null ? t(msg.key, msg.n, { named: { n: msg.n } }) : t(msg.key);
});

const remainingDays = computed(() =>
  SubjectsListItemUtils.getRemainingDays(props.examinationDate),
);

</script>

<template>
  <li tabindex="0" class="subject-list-item" @click="handleClick">
    <CircularProgress class="circular-progress" :value="progress" :max="100" :size="58" :strokeWidth="4">
      <span class="circular-progress__label">{{ progress }}%</span>
    </CircularProgress>
    <h3 class="subject-list-item-title">{{ title }}</h3>
    <p class="tickets-count">{{ t('subjects.learnedOutOfTotal', { learned: learnedTickets, total: totalTickets }) }}</p>
    <p class="average-score">{{ t('subjects.averageScore', { score: averageScore }) }}</p>
    <UProgress class="progress-bar" size="sm" :model-value="progress" :max="100" />
    <p class="latest-lesson-date">
      <ClockIcon class="icon" />
      {{ lastRepetitionText }}
    </p>
    <p class="remaining-days">{{ t('subjects.remainingDays', remainingDays, { named: { days: remainingDays } }) }}</p>
    <LoaderIcon v-if="isLoading" class="loader-icon" />
  </li>
</template>

<style scoped>
.subject-list-item {
  width: 100%;
  height: 90px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--ui-bg);
  position: relative;

  display: grid;
  grid-template-columns: auto auto 1fr auto;
  grid-template-rows: auto 1fr 1fr;
  column-gap: 12px;
  row-gap: 4px;
  outline: 1px solid var(--ui-bg-accented);
  transition: outline 100ms ease-in-out;
}

.subject-list-item:focus-visible {
  outline: 1px solid var(--color-primary);
}

.subject-list-item:hover {
  outline: 1px solid var(--color-primary);
  cursor: pointer;
}

.circular-progress {
  grid-row: 1 / 4;
  grid-column: 1;
  --accent-color: var(--color-primary);
}

.circular-progress__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-default);
}

.subject-list-item-title {
  grid-row: 1;
  grid-column: 2 / 4;
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
  color: var(--text-color-default);
}

.tickets-count {
  grid-row: 2;
  grid-column: 2;
  font-size: 12px;
  line-height: 1;
  color: var(--text-color-muted);
}

.average-score {
  grid-row: 2;
  grid-column: 3;
  font-size: 12px;
  line-height: 1;
  color: var(--text-color-muted);
}

.progress-bar {
  grid-row: 3;
  grid-column: 2 / 4;
  align-self: center;

  --ui-primary: var(--color-primary);
}

.latest-lesson-date {
  grid-row: 1;
  grid-column: 4;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-color-muted);
}

.remaining-days {
  grid-row: 2;
  grid-column: 4;
  font-size: 12px;
  color: var(--text-color-muted);
}

.loader-icon {
  position: absolute;
  right: 8px;
  bottom: 8px;
  color: var(--text-color-dimmed);
}

@container page-container (max-width: 576px) {
  .subject-list-item {
    padding: 12px;
    height: 76px;
  }

  .circular-progress,
  .latest-lesson-date,
  .remaining-days {
    display: none;
  }

  .subject-list-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
  }

  .subject-list-item-title {
    grid-column: 1 / 4;
  }

  .tickets-count {
    grid-column: 1 / 2;
  }

  .average-score {
    grid-column: 2 / 3;
  }

  .progress-bar {
    grid-column: 1 / 4;
  }
}

@container page-container (max-width: 576px) {
  .loader-icon {
    top: 8px;
    right: 8px;
  }
}
</style>
