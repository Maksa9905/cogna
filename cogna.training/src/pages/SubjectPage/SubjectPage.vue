<script setup lang="ts">
import {
  SubjectExamDateChip,
  useCreateSubjectMutation,
  useSubjectFindOneQuery,
  SubjectStatisticsProgressBar,
} from "@/entities/subjects";
import { TicketsFilters, TicketsList } from "@/entities/tickets";
import { useLocalizedRouter } from "@/shared/i18n";
import { InlineTextareaField } from "@/shared/ui";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
	name: "SubjectPage",
});

const subjectTitle = ref("")

const route = useRoute();
const subjectId = computed(() => route.params.subjectId as string);

const isNew = computed(() => subjectId.value === "create");

const router = useRouter()
const { routes } = useLocalizedRouter();
const { mutateAsync: createSubject } = useCreateSubjectMutation();

const { data: subjectData, isLoading } = useSubjectFindOneQuery(subjectId);

const progressStats = computed(() => {
  const s = subjectData.value?.subject;
  if (!s) {
    return { percent: 0, learned: 0, total: 0 };
  }
  const { totalTickets: total, learnedTickets: learned } = s;
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;

  return { percent, learned, total };
});

const handleCreateTicket = async () => {
  if (isNew.value) {
    const title = subjectTitle.value.trim();
    if (!title) return;

    const created = await createSubject({ title });
    await router.push(routes.value.ticket(created.subject.id, "create"));
    return;
  }

  await router.push(routes.value.ticket(subjectId.value, "create"));
};

</script>

<template>
  <template v-if="isNew">
    <InlineTextareaField
      v-model="subjectTitle"
      class="title-input"
      placeholder="Введите название предмета"
      ariaDescription="Введите название предмета"
    />
    <section class="subject-page__subjects">
      <TicketsFilters />
      <TicketsList
        class="tickets-list"
        :subject-id="subjectId"
        :is-new-subject="true"
        @create="handleCreateTicket"
        @click="(ticket) => router.push(routes.ticket(subjectId, ticket.id))"
      />
    </section>
  </template>
  <template v-else>
    <header v-if="!isLoading" class="subject-page__header">
      <h1 class="subject-page__title">{{subjectData?.subject.title}}</h1>
      <!-- <SubjectExamDateChip class="subject-page__exam-date-chip" :date="'2026-03-26T12:00:00.000Z'" /> -->
      <UButton variant="link" @click="handleCreateTicket" trailing-icon="i-lucide-plus">Добавить билет</UButton>
    </header>
    <USkeleton v-else class="h-[36px] subject-page__header" />
    <section class="subject-page__subjects">
      <TicketsFilters />
      <TicketsList
        v-if="subjectData?.subject.id"
        :key="subjectData.subject.id"
        class="tickets-list"
        :subject-id="subjectData.subject.id"
        :is-new-subject="false"
        @create="handleCreateTicket"
        @click="(ticket) => router.push(routes.ticket(subjectId, ticket.id))"
      />
    </section>
  
    <footer class="subject-page__footer">
      <SubjectStatisticsProgressBar :learned="progressStats.learned" :total="progressStats.total" />
    </footer>
  </template>
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  max-width: 800px;
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

.subject-page__subjects {
  max-width: 800px;
}

.title-input {
  font-size: 24px;
  font-weight: 600;
}
</style>