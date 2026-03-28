<script setup lang="ts">
import { TicketEditor, useTicketFindOneQuery } from "@/entities/tickets";
import { useBreadCrumbs } from "@/features/navigation";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const {
	params: { ticketId },
} = useRoute();

const { data: ticketData } = useTicketFindOneQuery({
	id: ticketId as string,
});

const breadcrumbs = useBreadCrumbs();

const answerDraft = ref("");

watch(
	() => ticketData.value?.ticket?.answer,
	(a) => {
		if (a !== undefined) answerDraft.value = a;
	},
	{ immediate: true },
);
</script>

<template>
	<div class="ticket-page">
		<header class="ticket-page__header">
			<h1 class="ticket-page__title">{{ ticketData?.ticket?.question }}</h1>
			<UBreadcrumb :items="breadcrumbs || []" />
		</header>

		<section class="ticket-page__answer" aria-label="Ответ">
			<div class="ticket-page__editor">
				<TicketEditor v-model="answerDraft" editor-class="px-3 sm:px-6 py-4 min-h-[340px]" />
			</div>
			<p class="ticket-page__editor-hint text-xs text-muted leading-snug">
				{{ t("tickets.editorHint") }}
			</p>
		</section>
	</div>
</template>

<style scoped>
.ticket-page {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.ticket-page__header {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.ticket-page__title {
	font-size: 24px;
	font-weight: 600;
	color: var(--text-color-default);
}

.ticket-page__answer {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.ticket-page__editor {
	border-radius: var(--ui-radius);
	border: 1px solid var(--ui-border-muted);
	background: var(--ui-bg-default);
}

.ticket-page__editor-hint {
	margin: 0;
	padding-inline: 0.125rem;
}
</style>