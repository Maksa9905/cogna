<script setup lang="ts">
import { SubjectExamDateChip, useSubjectFindOneQuery, SubjectStatisticsProgressBar } from "@/entities/subjects";
import { TicketsFilters, TicketsList } from "@/entities/tickets";
import { useLocalizedRouter } from "@/shared/i18n";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
	name: "SubjectPage",
});

const {
	params: { subjectId },
} = useRoute();

const router = useRouter()
const { routes } = useLocalizedRouter();

const { data: subjectData, isLoading } = useSubjectFindOneQuery({
  id: subjectId as string,
});

const progressStats = computed(() => {
  const s = subjectData.value?.subject;
  if (!s) {
    return { percent: 0, learned: 0, total: 0 };
  }
  const { totalTickets: total, learnedTickets: learned } = s;
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;

  return { percent, learned, total };
}); 

</script>

<template>
    <header v-if="!isLoading" class="subject-page__header">
      <!-- <UBreadcrumb :items="breadcrumbs || []" /> -->
      <h1 class="subject-page__title">{{subjectData?.subject.title}}</h1>
      <SubjectExamDateChip class="subject-page__exam-date-chip" :date="'2026-03-26T12:00:00.000Z'" />
    </header>
    <USkeleton v-else class="h-[36px] subject-page__header" />
		<TicketsFilters />
		<TicketsList
			v-if="subjectData?.subject.id"
			:key="subjectData.subject.id"
			class="tickets-list"
			:subject-id="subjectData.subject.id"
      @click="(ticket) => router.push(routes.ticket(subjectId as string, ticket.id))"
		/>
  
  <footer class="subject-page__footer">
		<SubjectStatisticsProgressBar :learned="progressStats.learned" :total="progressStats.total" />
  </footer>
</template>

<style scoped>
.tickets-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-page__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}

.subject-page__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-default);
}

.subject-page__footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
}

.subject-page__progress {
  width: 100%;
  height: 10px;
  border-radius: 0;
  background-color: var(--ui-bg-accented);
}

.subject-page__exam-date-chip {
  position: relative;
  top: 2px;
}
</style>