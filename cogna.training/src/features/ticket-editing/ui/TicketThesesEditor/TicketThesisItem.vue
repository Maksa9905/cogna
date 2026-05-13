
<script setup lang="ts">
import { EThesisImportance } from '@/entities/tickets';
import type { DropdownMenuItem } from '@nuxt/ui';
import { ref, useTemplateRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

export type ChangeThesisPayload = {
  id: string;
  isNew: boolean;
  thesis?: string, 
  importance?: EThesisImportance
};

const { t } = useI18n();

const { thesis, id, isNew } = defineProps<{
  id: string;
  isNew: boolean;
  importance: EThesisImportance;
  thesis: string;
}>()

const emit = defineEmits<(e: "change", thesis: ChangeThesisPayload) => void>();

const input = useTemplateRef<HTMLInputElement>("thesis-input");

const thesisValue = ref(thesis);
const isEditable = ref(false);

watchEffect(() => {
  if (!thesisValue.value) isEditable.value = true
})

const handleBlurThesis = () => {
  emit('change', { id, isNew, thesis: thesisValue.value });
}

const handleThesisClick = () => {
  isEditable.value = true

  setTimeout(() => {
    input.value?.focus();
  }, 0);
}


const items = ref<DropdownMenuItem[]>([
  {
    label: "Критично",
    icon: 'i-lucide-circle-small',
    color: 'error',
    onSelect: () => emit('change', { id, isNew, importance: EThesisImportance.HIGH })
  },
  {
    label: "Средне",
    icon: 'i-lucide-circle-small',
    color: 'warning',
    onSelect: () => emit('change', { id, isNew, importance: EThesisImportance.MEDIUM })
  },
  {
    label: "Не так важно",
    icon: 'i-lucide-circle-small',
    color: 'success',
    onSelect: () => emit('change', { id, isNew, importance: EThesisImportance.LOW })
  }
])

</script>

<template>
  <li class="thesis-item">
    <UDropdownMenu :items="items">
      <UIcon name="i-lucide-circle-small" class="importance-indicator" :class="importance" />
    </UDropdownMenu>
    <textarea :placeholder='"Введите содержимое вашего тезиса"' v-model="thesisValue" class="thesis-editor" v-if="isEditable" @blur="handleBlurThesis" ref="thesis-input" />
    <span @click="handleThesisClick" v-else>{{thesisValue}}</span>
  </li>
</template>

<style scoped>
.thesis-item {
  display: flex;
  flex-direction: row;
  align-items:start;
  cursor: pointer;
}

.importance-indicator {
  width: 24px;
  height: 24px;
  padding: 4px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
}

.importance-indicator.high {
  color: var(--ui-color-error-500);
}

.importance-indicator.medium {
  color: var(--ui-color-warning-500);
}

.importance-indicator.low {
  color: var(--ui-color-success-500);
}

.thesis-editor {
	field-sizing: content;
	min-width: 120px;
	min-height: 14px;
	font-size: 16px;
	color: var(--text-color-default);
}

textarea.thesis-editor {
  overflow-y: hidden;
  resize: none;
}

.thesis-editor:focus-visible {
	outline: none;
	border: none;
}

</style>