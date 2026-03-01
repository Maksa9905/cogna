<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useConfirmCodeForm, type ConfirmCodeFormValues } from "../../model/confirmCodeForm";

const { t } = useI18n();

const { email, isLoading } = defineProps<{
	email?: string;
	isLoading?: boolean;
}>();

const emit = defineEmits<{ confirm: [payload: ConfirmCodeFormValues] }>();

const { form, validators } = useConfirmCodeForm({
	onSubmit: (payload) => emit("confirm", payload),
});

const { handleSubmit } = form;
</script>

<template>
  <form v-if="email" @submit.prevent="handleSubmit" class="confirm-code-form">
    <form.Field 
      name="code"
      :validators="{
        onChange: ({ value }) => validators.code(value),
        onBlur: ({ value }) => validators.code(value),
      }"
    >
      <template v-slot="{ field }">
        <UFormField :error="field.state.meta.errors?.[0]" :label="t('auth.confirm.codeLabel')">
          <UInput 
            :model-value="field.state.value"
            @update:model-value="field.handleChange"
            size="xl"
            class="w-full"
            :placeholder="t('auth.confirm.codePlaceholder')" 
          />
        </UFormField>
      </template>
    </form.Field>

    <UButton :is-loading="isLoading" size="xl" class="justify-center" color="primary" type="submit">
      {{ t('auth.confirm.submit') }}
    </UButton>
  </form>
</template>

<style scoped>
.confirm-code-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>