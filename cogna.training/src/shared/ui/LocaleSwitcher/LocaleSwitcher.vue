<script setup lang="ts">
import { useLocalizedRouter, type SupportedLocale } from "@/shared/i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { currentLocale, switchLocale, availableLocales } = useLocalizedRouter();

const localeLabel = (locale: SupportedLocale) => t(`common.localeName.${locale}`);

const handleLocaleChange = (locale: SupportedLocale) => {
	switchLocale(locale);
};
</script>

<template>
  <UDropdownMenu
    :items="availableLocales.map(locale => ({
      label: localeLabel(locale),
      onSelect: () => handleLocaleChange(locale),
    }))"
  >
    <UButton variant="ghost" size="sm">
      {{ localeLabel(currentLocale) }}
    </UButton>
  </UDropdownMenu>
</template>
