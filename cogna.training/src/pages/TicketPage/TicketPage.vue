<script setup lang="ts">
import { useTicketFindOneQuery, useUpdateTicketMutation } from "@/entities/tickets";
import { TicketEditor, useTicketAutosave, useTicketEditingStore } from "@/features/ticket-editing";
import { useBreadCrumbs } from "@/features/navigation";
import { ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { FloatingElement, Skeleton } from "@/shared/ui";
import { LoadingIcon } from "@/shared/icons";

const { t } = useI18n();

const {
	params: { ticketId, subjectId },
} = useRoute();	
const router = useRouter();


const { title, answer } = useTicketEditingStore({ id: ticketId as string });

const { mutateAsync: updateTicket } = useUpdateTicketMutation()

const { data: ticketData, isLoading } = useTicketFindOneQuery({
	id: ticketId as string,
});


const breadcrumbs = useBreadCrumbs();

const input = useTemplateRef<HTMLInputElement>("input");

const isTitleEditable = ref(false);

useTicketAutosave({ id: ticketId as string, answer: answer.value, title: title.value });

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

		<section class="ticket-page__answer" :aria-label="t('tickets.answerAriaLabel')">
			<Skeleton :is-loading="isLoading">
				<template #skeleton>
					<USkeleton # class="w-full h-[340px] bg-default rounded-lg flex items-center justify-center">
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

	<FloatingElement position="bottom-right" :offset='16'>
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

.visibility-switch {
	align-self: flex-end;
}
</style>