<script setup lang="ts">
import { localizedRoutes } from "@/shared/router";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import type { SupportedLocale } from "@/shared/i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const locale = computed(() => route.params.locale as SupportedLocale);
const routes = computed(() => localizedRoutes(locale.value));

const type = computed(() =>
	router.currentRoute.value.path === routes.value.login ? "login" : "signup",
);
</script>

<template>
  <div class="container" :data-selected="type">
    <button @click="() => router.push(routes.login)" :aria-selected="type === 'login'" class="button">{{ t('auth.login.tab') }}</button>
    <button @click="() => router.push(routes.signup)" :aria-selected="type === 'signup'"
      class="button">{{ t('auth.signup.tab') }}</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  padding: 4px;
  border-radius: 14px;
  background-color: var(--background-color-elevated);
  border: none;
  position: relative
}

.container[data-selected='login']::before {
  transform: translateX(0);
}

.container[data-selected='signup']::before {
  transform: translateX(100%);
}

.container::before {
  content: '';
  position: absolute;
  background-color: var(--background-color-default);
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 10px;
  z-index: 0;

  transition: transform 100ms ease-out;
}

.button {
  flex-grow: 1;
  width: 100%;
  padding: 10px;
  border: none;
  z-index: 1;
  background-color: transparent;
}

.button[aria-selected="true"] {
  color: var(--color-primary)
}

.button[aria-selected="false"] {
  cursor: pointer;
  color: var(--text-color-default);

  &:hover {
    color: var(--text-color-toned);
  }
}
</style>