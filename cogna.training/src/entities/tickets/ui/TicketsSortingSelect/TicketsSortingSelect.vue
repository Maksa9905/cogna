<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ETicketsSorting } from "../../model/types";

const { t } = useI18n();

const sorting = defineModel<ETicketsSorting>("sorting", { required: true });

const sortingOptions = computed(() =>
	Object.values(ETicketsSorting).map((value) => ({
		label: t(`tickets.sorting.${value}`),
		value,
	})),
);
</script>

<template>
	<USelect v-model="sorting" :items="sortingOptions" />
</template>

<style scoped>
</style>
