<script setup lang="ts">
import { ref, useAttrs } from "vue";
import type { InputProps } from "@nuxt/ui";

interface Props
	extends Omit<
		InputProps,
		"type" | "trailingIcon" | "modelValue" | "defaultValue"
	> {
	defaultValue?: string;
}

defineProps<Props>();

const modelValue = defineModel<string>();

const show = ref(false);

const attrs = useAttrs();
</script>

<template>
  <UInput v-model="modelValue" v-bind="{ ...$props, ...attrs }" :type="show ? 'text' : 'password'">
    <template #trailing>
      <UButton color="neutral" variant="link" size="sm" :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
        @click="show = !show" />
    </template>
  </UInput>
</template>
