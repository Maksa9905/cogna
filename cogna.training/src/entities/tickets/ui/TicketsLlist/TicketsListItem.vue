<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { SubjectsListItemUtils } from "@/entities/subjects/ui/SubjectsListItem/SubjectsListItem.utils";
import { ClockIcon, LoaderIcon } from "@/shared/icons";
import { Badge } from "@/shared/ui";
import type { Ticket } from "../../api/types";

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		ticket: Ticket;
		order: number;
		learningPercent?: number;
		repeatedAt?: string;
		isLoading?: boolean
	}>(),
	{ learningPercent: 0 },
);


const emit = defineEmits<(e: "click") => void>();

const handleClick = () => {
  emit("click");
};

const repeatedAtSource = computed(() => props.repeatedAt ?? props.ticket.updatedAt);

const timeSinceLastRepetition = computed(() =>
	SubjectsListItemUtils.getTimeSinceLastRepetition(repeatedAtSource.value),
);

const lastRepetitionText = computed(() => {
	const msg = SubjectsListItemUtils.getLastRepetitionMessage(timeSinceLastRepetition.value);
	return msg.n != null ? t(msg.key, msg.n, { named: { n: msg.n } }) : t(msg.key);
});
</script>

<template>
	<li class="tickets-list-item" tabindex="0" @click="handleClick">
		<Badge class="tickets-list-item__order" variant="transparent">{{ order }}</Badge>
		<h3 class="tickets-list-item__title">{{ ticket.question }}</h3>
		<p class="tickets-list-item__content">{{ ticket.answer }}</p>
		<UProgress
			size="sm"
			class="tickets-list-item__progress"
			:model-value="learningPercent"
			:max="100"
		/>
		<p class="tickets-list-item__repeated-at">
			<ClockIcon class="tickets-list-item__clock" />
			{{ lastRepetitionText }}
		</p>
		<LoaderIcon class="tickets-list-item__loader" v-if="isLoading" />
	</li>
</template>

<style scoped>
.tickets-list-item {
	display: grid;
	position: relative;
	grid-template-columns: auto 1fr auto 24px;
	grid-template-rows: auto auto auto;
	padding: 16px;
	border-radius: 8px;
	background-color: var(--ui-bg);
	border: 1px solid var(--ui-bg-accented);
	column-gap: 12px;
	row-gap: 8px;
	height: 90px;

	outline: 1px solid transparent;
	transition: outline 100ms ease-in-out;
}

.tickets-list-item:hover {
	outline: 1px solid var(--color-primary);
	cursor: pointer;
}

.tickets-list-item:focus-visible {
	outline: 1px solid var(--color-primary);
}

.tickets-list-item__order {
	grid-row: 1 / 3;
	grid-column: 1;
	width: 40px;
	height: 40px;
	background-color: var(--ui-bg-muted);
	border: 1px solid var(--ui-bg-accented);
	color: var(--text-color-default);
	align-self: center;
}

.tickets-list-item__title {
	grid-row: 1;
	grid-column: 2;
	font-size: 16px;
	font-weight: 600;
	color: var(--text-color-default);
	line-height: 1;
	align-self: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tickets-list-item__content {
	grid-row: 2;
	grid-column: 2 / 5;
	font-size: 12px;
	color: var(--text-color-dimmed);
	line-height: 1;
	align-self: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.tickets-list-item__progress {
	grid-row: 3;
	grid-column: 1 / 5;
	align-self: center;
	margin-top: 4px;
}

.tickets-list-item__repeated-at {
	grid-row: 1;
	grid-column: 3;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 12px;
	color: var(--text-color-dimmed);
	line-height: 1;
	align-self: center;
}

.tickets-list-item__loader {
	position: absolute;
	top: 8px;
	right: 8px;
	color: var(--text-color-dimmed);
}

.tickets-list-item__clock {
	width: 14px;
	height: 14px;
}

@container page-container (max-width: 576px) {
  .tickets-list-item {
		height: 76px;
    padding: 12px;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
  }

  .tickets-list-item__title {
    height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tickets-list-item__repeated-at {
    display: none;
  }

  .tickets-list-item__order {
    width: 32px;
    height: 32px;
  }
}

@container page-container (max-width: 480px) {
  .tickets-list-item__order {
    display: none;
  }

  .tickets-list-item__title {
    grid-row: 1;
    grid-column: 1 / 3;
  }

  .tickets-list-item__content {
    grid-row: 2;
    grid-column: 1 / 3;
  }
}
</style>
