<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineOptions({
	name: "AuthSeparator",
});
</script>

<template>
  <div class="separator">
    <hr>
    {{ t('common.or') }}
    <hr>
  </div>
</template>

<style scoped>
.separator {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-weight: 300;
  color: var(--text-color-dimmed);
  margin-bottom: 12px;
}

.separator hr {
  flex: 1;
  border: none;
  border-top: 1px solid var(--text-color-dimmed);
  opacity: 0.2;
}
</style>
