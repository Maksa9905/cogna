<script setup lang="ts">
import { useGenerateThesesMutation, useTicketFindOneQuery, usePatchTicketMutation } from "@/entities/tickets";
import { TicketEditor, TicketThesesEditor, useTicketAutosave, useTicketEditingStore } from "@/features/ticket-editing";
import { useBreadCrumbs } from "@/features/navigation";
import { provide, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { FloatingElement, Skeleton } from "@/shared/ui";
import { LoadingIcon } from "@/shared/icons";

const { t } = useI18n();

const {
	params: { ticketId, subjectId },
} = useRoute();	
const router = useRouter();


const ticketEditingStore = useTicketEditingStore({ id: ticketId as string });
provide('tickerEditingStore', ticketEditingStore)

const { title, answer, theses } = ticketEditingStore

const { mutateAsync: updateTicket } = usePatchTicketMutation()
const { mutateAsync: generateTheses, isPending } = useGenerateThesesMutation();
const { data: ticketData, isLoading } = useTicketFindOneQuery({
	id: ticketId as string,
});

const breadcrumbs = useBreadCrumbs();

const input = useTemplateRef<HTMLInputElement>("input");

const isTitleEditable = ref(false);

useTicketAutosave({ id: ticketId as string, answer, title });

const handleEditTitle = () => {
	isTitleEditable.value = true

	setTimeout(() => {
		input.value?.focus();
	}, 0);
}

const handleBlurTitle = async () => {
	if (!title.value) return;

	await updateTicket({
		id: ticketId as string,
		question: title.value,
	})

	isTitleEditable.value = false
}

const handleBlurAnswer = async () => {
	if (answer.value === ticketData.value?.ticket?.answer) return;

	await updateTicket({ id: ticketId as string, answer: answer.value })
}

const handleReproduceTicket = async () => {
	router.push(`/subjects/${subjectId}/tickets/${ticketId}/reproduce`);
}

const handleGenerateTheses = async () => {
	if (!ticketId) return;

	await generateTheses({
		ticketId: ticketId as string,
		question: title.value,
		answer: answer.value,
	})
}

const handleUpdateTheses = async () => {
	if (!ticketId) return;

	updateTicket({
		id: ticketId as string,
		theses: theses.value.flatMap(thesis => [{
			value: thesis.value,
			importance: thesis.importance,
			id: undefined,
		}])
	})
}
</script>

<template>
	<div class="ticket-page">
		<Skeleton :is-loading="isLoading">
			<template #skeleton>
				<header class="ticket-page__header">
					<USkeleton class="ticket-page__title bg-default rounded-lg w-full"  />
					<USkeleton class="bg-default rounded-lg h-[20px] w-[280px]" />
				</header>
			</template>

			<template #default>
				<header class="ticket-page__header">
					<textarea :placeholder="t('tickets.titlePlaceholder')" v-model="title" class="ticket-page__title" v-if="isTitleEditable || !title" @blur="handleBlurTitle" ref="input" />
					<h1 v-else @click="handleEditTitle" class="ticket-page__title">{{ title }}</h1>
					<UBreadcrumb :items="breadcrumbs || []" />
				</header>
			</template>
		</Skeleton>

		<div class="ticket-page__main">
			<Skeleton :is-loading="isLoading || isPending">
				<template #default>
					<TicketThesesEditor @blur="handleUpdateTheses" @generate="handleGenerateTheses" :isLoading="isLoading" />
				</template>
				<template #skeleton>
					<USkeleton class="theses-editor__skeleton">
						<LoadingIcon class="w-[24px] h-[24px]" />
					</USkeleton>
				</template>
			</Skeleton>

			<section class="ticket-page__answer" :aria-label="t('tickets.answerAriaLabel')">
				<Skeleton :is-loading="isLoading">
					<template #skeleton>
						<USkeleton class="w-full h-[340px] bg-default rounded-lg flex items-center justify-center">
							<LoadingIcon class="w-[24px] h-[24px]" />
						</USkeleton>
					</template>
					<template #default>
						<div class="ticket-page__editor">
							<TicketEditor @blur="handleBlurAnswer" :is-loading="isLoading" v-model="answer" editor-class="px-3 sm:px-6 py-4 min-h-[340px]" />
						</div>
					</template>
				</Skeleton>
			</section>
		</div>
	</div>

	<FloatingElement position="bottom-right" class="floating-button">
		<UButton @click="handleReproduceTicket" size="md" icon="i-lucide-check" class="rounded-4 min-w-10 min-h-10">
			{{ t('tickets.rememberedButton') }}
		</UButton>
	</FloatingElement>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 1s ease,
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}


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
	field-sizing: content;
	min-width: 120px;
	min-height: 36px;
	font-size: 24px;
	font-weight: 600;
	color: var(--text-color-default);
}

textarea.ticket-page__title {
  overflow-y: hidden;
  resize: none;
}

.ticket-page__title:focus-visible {
	outline: none;
	border: none;
}

.ticket-page__main {
	display: flex;
	flex-direction: row-reverse;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.ticket-page__answer {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	flex: 1;
	min-width: 800px;
	width: 100%;
}

.ticket-page__theses {
	flex: 1;
	background: var(--ui-bg);
	border: 1px solid var(--ui-bg-accented);
	height: fit-content;
	padding: 24px;
	padding-block: 16px;
}

@media screen and (max-width: 1440px) {
	.ticket-page__main {
		flex-direction: column;
	}

	.ticket-page__answer {
		min-width: unset;
	}

	.ticket-page__theses {
		min-width: unset;
	}
}


.theses-editor__skeleton {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 460px;
	height: 200px;
	background: var(--ui-bg)
}

.theses-header h2 {
	font-size: 14px;
	font-weight: 600;
}

.theses-header svg {
	display: inline;
	margin-right: 4px;
	position: relative;
	top: -1.5px;
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

.visibility-switch {
	align-self: flex-end;
}

.floating-button {
	bottom: 16px;
	right: 16px;
}

@media screen and (max-width: 576px) {
	.floating-button {
		bottom: 78px !important;
		right: 16px;
	}
}
</style>