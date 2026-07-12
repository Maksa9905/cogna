
<script lang="ts" setup>
import { useAssessmentCompletedSubscription, useSubmitTicketAnswer, useTicketFindOneQuery } from '@/entities/tickets';
import { TicketEditor, useTicketEditingStore } from '@/features/ticket-editing';
import { FloatingElement, Skeleton } from '@/shared/ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();	

const ticketId = computed(() => route.params.ticketId as string);

const { data, isLoading } = useTicketFindOneQuery(ticketId);

const { 
	answer, 
} = useTicketEditingStore(ticketId, true);

const { mutateAsync: submitTicketAnswer } = useSubmitTicketAnswer()

const handleCommitAnswer = () => {}

const handleReproduceTicket = () => {
  submitTicketAnswer({
    ticketId: ticketId.value,
    answer: answer.value,
  })
}

useAssessmentCompletedSubscription((data) => {
  console.debug(data)
}, )
</script>

<template>
  <div class="reproduce-ticket-page">
    <Skeleton :is-loading="isLoading">
			<template #skeleton>
				<header class="reproduce-ticket-page__header">
					<USkeleton class="reproduce-ticket-page__title bg-default rounded-lg w-full"  />
					<USkeleton class="bg-default rounded-lg h-[20px] w-[280px]" />
				</header>
			</template>

			<template #default>
				<header class="reproduce-ticket-page__header">
          <h1 class="reproduce-ticket-page__title">{{data?.ticket?.question}}</h1>
          <h2 class="text-dimmed">Попробуйте воспроизвести выученный билет своими словами</h2>
				</header>
			</template>
		</Skeleton>

    <Skeleton :is-loading="isLoading">
      <template #skeleton>
        <USkeleton class="w-full h-[340px] bg-default rounded-lg flex items-center justify-center">
          <LoadingIcon class="w-[24px] h-[24px]" />
        </USkeleton>
      </template>
      <template #default>
        <div class="ticket-page__editor">
          <TicketEditor 
            @commit="handleCommitAnswer"
            :is-loading="isLoading"
            v-model="answer"
            editor-class="px-3 sm:px-6 py-4 min-h-[340px]"
          />
        </div>
      </template>
    </Skeleton>
  </div>

  <FloatingElement position="bottom-right" class="floating-button">
		<UButton @click="handleReproduceTicket" size="md" icon="i-lucide-check" class="rounded-4 min-w-10 min-h-10">
      Проверить
		</UButton>
	</FloatingElement>
</template>

<style scoped>
.reproduce-ticket-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reproduce-ticket-page__header {
	display: flex;
	flex-direction: column;
  gap: 4px;
}

.reproduce-ticket-page__title {
	min-width: 120px;
	min-height: 36px;
	font-size: 24px;
	font-weight: 600;
	color: var(--text-color-default);
}

</style>