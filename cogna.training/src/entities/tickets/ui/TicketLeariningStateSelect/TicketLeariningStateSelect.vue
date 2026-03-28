<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ETicketLearningState } from "../../model/types";

const { t } = useI18n();

const learningState = defineModel<ETicketLearningState>("learningState", { required: true });

const learningStateOptions = computed(() =>
	Object.values(ETicketLearningState).map((value) => ({
		label: t(`tickets.learningState.${value}`),
		value,
	})),
);
</script>

<template>
	<USelect v-model="learningState" :items="learningStateOptions" />
</template>

<style scoped>
</style>
