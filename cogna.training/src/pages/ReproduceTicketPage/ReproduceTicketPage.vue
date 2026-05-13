
<script lang="ts" setup>
import { useTicketFindOneQuery } from '@/entities/tickets';
import { Skeleton } from '@/shared/ui';
import { useRoute } from 'vue-router';

const {
	params: { ticketId },
} = useRoute();	

const { data, isLoading } = useTicketFindOneQuery({ id: ticketId as string });
</script>

<template>
  <Skeleton :isLoading="isLoading">
    <template #default>

    </template>
    <template #skeleton>
    </template>
  </Skeleton>
</template>

<style scoped>
.reproduce-ticket-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>