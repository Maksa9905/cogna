<script setup lang="ts">
import { PasswordInput } from "@/shared/ui";
import type { LoginFormValues } from "../../model/types";
import { useLoginForm } from "../../model/loginForm";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { isLoading = false } = defineProps<{ isLoading?: boolean }>();

const emit = defineEmits<{
  submit: [payload: LoginFormValues];
}>();

const { form, validators } = useLoginForm(
  {
    onSubmit: (values) =>
      emit('submit', values)
  }
);

const { handleSubmit } = form;
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <form.Field name="email" :validators="{ onSubmit: ({ value }) => validators.email(value) }">
      <template v-slot="{ field }">
        <UFormField :error="field.state.meta.errors[0]" :name="field.name" :label="t('common.email')">
          <UInput size="xl" class="w-full" :model-value="field.state.value" @update:model-value="(field.handleChange)"
            placeholder="example@yandex.ru" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="password" :validators="{ onSubmit: ({ value }) => validators.password(value) }">
      <template v-slot="{ field }">
        <UFormField :name="field.name" :error="field.state.meta.errors[0]" :label="t('common.password')">
          <PasswordInput :model-value="field.state.value" @update:model-value="field.handleChange" class="w-full"
            size="xl" :placeholder="t('auth.login.passwordPlaceholder')" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="rememberMe">
      <template v-slot="{ field }">
        <UCheckbox :model-value="field.state.value" @update:model-value="field.handleChange" :label="t('auth.login.rememberMe')" />
      </template>
    </form.Field>

    <UButton :is-loading="isLoading" class="justify-center" size="xl" color="primary" type="submit">{{ t('auth.login.submit') }}
    </UButton>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px
}

.remember-me {
  margin-bottom: 6px;
  margin-top: 6px;
}
</style>
