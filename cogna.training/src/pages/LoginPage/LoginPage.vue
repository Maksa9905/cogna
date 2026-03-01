<script setup lang="ts">
import { useLoginMutation } from "@/entities/user";
import { useSession } from "@/entities/session";
import {
  AuthTitle,
  AuthDescription,
  AuthIntergrations,
  AuthSeparator,
  LoginForm,
  useAuthErrorHandler,
  type LoginFormValues,
} from "@/features/auth";
import { localizedRoutes } from "@/shared/router/routes";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import type { SupportedLocale } from "@/shared/i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { saveTokens } = useSession();
const { mutateAsync: login, isPending } = useLoginMutation();
const { handleError } = useAuthErrorHandler();

const handleSubmit = async (payload: LoginFormValues) => {
  try {
    const { email, password } = payload

    if (!password || !email) return;

    const result = await login({ email, password });

    saveTokens(result.login.accessToken, result.login.refreshToken);

    const locale = route.params.locale as SupportedLocale;

    await router.push(localizedRoutes(locale).home);
  } catch (error) {
    handleError(error);
  }
};
</script>

<template>
  <div class="login-page">
    <AuthTitle>{{ t('auth.login.title') }}</AuthTitle>
    <AuthDescription>{{ t('auth.login.description') }}</AuthDescription>
    <AuthIntergrations />
    <AuthSeparator />
    <LoginForm :is-loading="isPending" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.login-page {
  padding: 40px 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}
</style>
