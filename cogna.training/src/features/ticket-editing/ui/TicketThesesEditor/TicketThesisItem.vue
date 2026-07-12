
<script setup lang="ts">
import { EThesisImportance } from '@/entities/tickets';
import { InlineTextareaField } from '@/shared/ui';
import type { DropdownMenuItem } from '@nuxt/ui';
import { ref } from 'vue';
import type { ChangeThesisPayload } from '../../model/types';


const { thesis, id, isNew } = defineProps<{
  id: string;
  isNew: boolean;
  importance: EThesisImportance;
  thesis: string;
}>()

const emit = defineEmits<(e: "change", thesis: ChangeThesisPayload) => void>();

const thesisValue = ref(thesis);
const thesisPlaceholder = "Введите содержимое вашего тезиса";

const handleCommitThesis = () => {
  emit('change', { id, isNew, thesis: thesisValue.value });
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
    <InlineTextareaField
      v-model="thesisValue"
      :placeholder="thesisPlaceholder"
      :ariaDescription="thesisPlaceholder"
      textarea-class="thesis-editor"
      @commit="handleCommitThesis"
    />
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
  min-width: 24px;
  min-height: 24px;
  padding: 4px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
}

.importance-indicator.HIGH {
  color: var(--ui-color-error-500);
}

.importance-indicator.MEDIUM {
  color: var(--ui-color-warning-500);
}

.importance-indicator.LOW {
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