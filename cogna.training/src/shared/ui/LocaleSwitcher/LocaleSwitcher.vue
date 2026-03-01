<script setup lang="ts">
import { useLocalizedRouter, type SupportedLocale } from "@/shared/i18n";

const { currentLocale, switchLocale, availableLocales } = useLocalizedRouter();

const localeLabels: Record<SupportedLocale, string> = {
	ru: "Русский",
	en: "English",
	de: "Deutsch",
};

const handleLocaleChange = (locale: SupportedLocale) => {
	switchLocale(locale);
};
</script>

<template>
  <UDropdownMenu
    :items="availableLocales.map(locale => ({
      label: localeLabels[locale],
      onSelect: () => handleLocaleChange(locale),
    }))"
  >
    <UButton variant="ghost" size="sm">
      {{ localeLabels[currentLocale] }}
    </UButton>
  </UDropdownMenu>
</template>
