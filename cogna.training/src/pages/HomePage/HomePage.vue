<script setup lang="ts">
import { useRouter } from "vue-router";
import { SubjectsList } from "@/entities/subjects";
import { useLocalizedRouter } from "@/shared/i18n";
import { useMediaQuery } from "@/shared/lib";

defineOptions({
	name: "HomePage",
});

const isMobile = useMediaQuery("(min-width: 576px)");

const router = useRouter();
const { routes } = useLocalizedRouter();
</script>

<template>
  <section class="subjects-list-section">
    <header class="section-header">
      <h2 class="section-title">Мои предметы</h2>
        <UButton v-if="isMobile" trailing-icon="i-lucide-plus" size="sm" @click="router.push(routes.subject('create'))">Создать предмет</UButton>
        <UButton v-else variant="link" trailing-icon="i-lucide-plus" size="md" @click="router.push(routes.subject('create'))" />
      </header>
      <SubjectsList
        @click="(subject) => router.push(routes.subject(subject.id))"
      />
    </section>
</template>

<style scoped>
.home-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  max-width: 1200px;
}

.home-page__title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color-default);
  margin-bottom: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color-default);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subjects-list-section {
  max-width: 800px;
  width: 100%;
}

@container page-container (max-width: 576px) {
  .create-subject-button {
    display: none;
    #text {
      display: none;
    }
  }
}
</style>
