<script setup lang="ts">

import { inject, watchEffect } from 'vue';
import TicketThesisItem, { type ChangeThesisPayload } from './TicketThesisItem.vue';

import type { TicketEditingStore } from '../../model/useTicketEditingStore';
import { EThesisImportance } from '@/entities/tickets';
import { uuid } from '@tanstack/vue-form';

defineProps<{
  isLoading: boolean;
}>()

const emit = defineEmits<{
  blur: [],
  generate: []
}>()

const { theses } = inject<TicketEditingStore>('tickerEditingStore')!

const handleCreateThesis = () => {
  if (theses.value.some(thesis => thesis.isNew && !thesis.value)) return;

  const newThesis = {
    id: uuid() as string,
    isNew: true,
    value: "",
    importance: EThesisImportance.LOW
  }

  theses.value = [
    ...theses.value,
    newThesis,
  ]
}

watchEffect(() => {
  console.debug(theses.value)
})

const handleChangeThesis = (payload: ChangeThesisPayload) => {
  const newTheses = [
    ...theses.value
  ]

  const editingThesis = newTheses.find(thesis => thesis.id === payload.id)

  if (!editingThesis) return;

  if (payload.thesis === "") {
    theses.value = theses.value.filter(thesis => thesis.id !== payload.id)
    emit('blur')

    return;
  }

  if (editingThesis) {
    if (payload.thesis) editingThesis.value = payload.thesis
    if (payload.importance) editingThesis.importance = payload.importance
  }

  theses.value = newTheses;

  emit('blur')
}

const handleGenerateThesis = () => {
  emit('generate');
}
</script>

<template>
  <section class="theses-editor">
    <header class="theses-editor__header">
      <h2>
        <UIcon name="lucide-info" /> Не забудьте упомянуть об этом в своём билете:
      </h2>
    </header>
    <ul v-if="theses.length" class="theses-editor__body">
      <template v-for="(thesis) of theses" :key="thesis.id">
        <TicketThesisItem @change="handleChangeThesis" :isNew="thesis.isNew" :id="thesis.id" :thesis="thesis.value" :importance="thesis.importance" />
      </template>
    </ul>
    <div v-else class="theses-editor__body">
      <p class="text-muted text-center">Тезисов по этому билету еще нет. <br> Вы можете добавить их вручную или сгенерировать при помощью ИИ:</p>
    </div>
    <footer class="theses-editor__footer">
      <UButton trailing-icon="lucide-plus" class="justify-center" @click="handleCreateThesis" variant="ghost">Добавить тезис</UButton>
      <UButton v-if="!theses.length" trailing-icon="lucide-brain" class="justify-center" @click="handleGenerateThesis">Сгенерировать тезисы</UButton>
      <UButton v-else trailing-icon="lucide-refresh-ccw" class="justify-center" @click="handleGenerateThesis">Перегенерировать тезисы</UButton>
    </footer>
  </section>
</template>

<style scoped>
.theses-editor {
  min-width: 460px;
  flex: 1;
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-bg-accented);
}

@media screen and (max-width: 1024px) {
  .theses-editor {
    min-width: unset;
    flex: unset;
  }
}

.theses-editor__header {
  padding: 24px;
  padding-block: 16px;
  border-bottom: 1px solid var(--ui-bg-accented);
}

.theses-editor__body {
  padding: 24px;
  padding-bottom: 0px;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: fit-content;
}

.theses-editor__footer {
  padding: 24px;
  padding-top: 8px;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

@media screen and (max-width: 640px) {
  .theses-editor__body {
    padding: 16px 12px;
  }

  .theses-editor__footer {
    padding: 16px 12px;
  }

  .theses-editor__header {
    padding: 8px 12px;
  }
}

@media screen and (max-width: 576px) {
  .theses-editor__footer {
    flex-direction: column;
    align-items: stretch
  }
}

.theses-editor__header h2 {
  font-weight: 500;
}

.theses-editor__header svg {
  display: inline;
  position: relative;
  top: -1.5px;
  margin-right: 4px;
}

</style>