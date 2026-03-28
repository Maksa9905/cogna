<script setup lang="ts">
import { useQueryState } from "@/shared/lib";
import TicketSearchInput from "../TicketSearchInput/TicketSearchInput.vue";
import TicketsSortingSelect from "../TicketsSortingSelect";

import { ETicketLearningState, ETicketsSorting } from "../../model/types";
import TicketLeariningStateSelect from "../TicketLeariningStateSelect";

const search = useQueryState("search");
const sorting = useQueryState<ETicketsSorting>("sorting", {
	default: ETicketsSorting.ORDER,
});
const learningState = useQueryState<ETicketLearningState>("learningState", {
	default: ETicketLearningState.ALL,
});

</script>

<template>
	<div class="tickets-filters">
		<TicketSearchInput class="search-input" v-model:search="search" />
    <TicketsSortingSelect v-model:sorting="sorting" />
    <TicketLeariningStateSelect v-model:learningState="learningState" />
	</div>
</template>

<style scoped>
.tickets-filters {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  row-gap: 10px;
}

.search-input {
  grid-column: 1;
  grid-row: 1;
}

@container page-container (max-width: 576px) {
  .tickets-filters {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .search-input {
    grid-column: 1 / 3;
    grid-row: 1;
  }
}
</style>
