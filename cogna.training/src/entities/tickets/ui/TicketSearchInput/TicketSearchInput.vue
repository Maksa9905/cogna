<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const DEBOUNCE_MS = 300;

const { t } = useI18n();

const search = defineModel<string>("search", { required: true });

const localSearch = ref(search.value);

watch(
	() => search.value,
	(v) => {
		localSearch.value = v;
	},
);

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleCommit(value: string) {
	if (debounceTimer !== undefined) {
		clearTimeout(debounceTimer);
	}
	debounceTimer = setTimeout(() => {
		debounceTimer = undefined;
		search.value = value;
	}, DEBOUNCE_MS);
}

function onLocalInput(value: string) {
	localSearch.value = value;
	scheduleCommit(value);
}

onBeforeUnmount(() => {
	if (debounceTimer !== undefined) {
		clearTimeout(debounceTimer);
	}
	if (localSearch.value !== search.value) {
		search.value = localSearch.value;
	}
});
</script>

<template>
		<UInput
			leading-icon="i-lucide-search"
			:model-value="localSearch"
			:placeholder="t('tickets.searchPlaceholder')"
			@update:model-value="onLocalInput"
		/>
</template>

<style scoped>
</style>
