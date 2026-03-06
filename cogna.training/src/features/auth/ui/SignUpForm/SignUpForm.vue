<script setup lang="ts">
import { PasswordInput } from "@/shared/ui";
import type { SignUpFormValues } from "../../model/types";
import { useSignupForm } from "../../model/signupForm";
import { useI18n } from "vue-i18n";
import { LetterIcon, LockIcon } from "@/shared/icons";

const { t } = useI18n();

const { isLoading = false } = defineProps<{ isLoading?: boolean }>();

const emit = defineEmits<{
  submit: [payload: SignUpFormValues];
}>();

const { form, validators } = useSignupForm({
  onSubmit: (payload) => emit("submit", payload),
});

const { handleSubmit } = form;
</script>

<template>
  <form class="signup-form" @submit.prevent="handleSubmit">
    <form.Field name="email" :validators="{ onSubmit: ({ value }) => validators.email(value) }">
      <template v-slot="{ field }">
        <UFormField :error="field.state.meta.errors[0]" :label="t('common.email')">
          <UInput :icon="LetterIcon" :model-value="field.state.value" @update:model-value="field.handleChange" size="xl"
            class="w-full" placeholder="example@gmail.com" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="password" :validators="{ onSubmit: ({ value }) => validators.password(value) }">
      <template v-slot="{ field }">
        <UFormField :error="field.state.meta.errors[0]" :label="t('common.password')">
          <PasswordInput :icon="LockIcon" :model-value="field.state.value"
            @update:model-value="(value) => field.handleChange(value ?? '')" size="xl" class="w-full"
            :placeholder="t('auth.signup.passwordPlaceholder')" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="repeatedPassword" :validators="{
      onSubmit: ({ value, fieldApi }) => {
        return validators.repeatedPassword(value, fieldApi.form.getFieldValue('password'));
      },
    }">
      <template v-slot="{ field }">
        <UFormField :error="field.state.meta.errors[0]" :label="t('auth.signup.confirmPassword')">
          <PasswordInput :icon="LockIcon" :model-value="field.state.value"
            @update:model-value="(value) => field.handleChange(value ?? '')" size="xl" class="w-full"
            :placeholder="t('auth.signup.confirmPasswordPlaceholder')" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="faculty">
      <template v-slot="{ field }">
        <UFormField :label="t('auth.signup.faculty')" :hint="t('common.optional')">
          <UInput :model-value="field.state.value" @update:model-value="field.handleChange" size="xl" class="w-full"
            :placeholder="t('auth.signup.facultyPlaceholder')" />
        </UFormField>
      </template>
    </form.Field>

    <form.Field name="isAgree" :validators="{
      onSubmit: ({ value }) => validators.isAgree(value),
    }">
      <template v-slot="{ field }">
        <div class="terms-of-use">
          <UCheckbox :model-value="field.state.value" @update:model-value="field.handleChange" />
          <label>
            {{ t('auth.signup.termsAgree') }} <a href="#">{{ t('auth.signup.termsOfUse') }}</a> {{ t('auth.signup.and')
            }} <a href="#">{{ t('auth.signup.privacyPolicy') }}</a>
          </label>
        </div>
        <p v-if="field.state.meta.errors[0]" class="error-text">
          {{ field.state.meta.errors[0] }}
        </p>
      </template>
    </form.Field>

    <UButton :is-loading="isLoading" size="xl" class="justify-center" type="submit">{{ t('auth.signup.submit') }}
    </UButton>
  </form>
</template>

<style scoped>
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.terms-of-use {
  margin-bottom: 6px;
  margin-top: 6px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.error-text {
  color: var(--color-red-500);
  font-size: 14px;
  margin-top: 4px;
}
</style>
