<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
	editor: Editor;
}>();

const { t } = useI18n();

const open = ref(false);
const rows = ref(3);
const cols = ref(3);
const withHeaderRow = ref(true);

const disabled = computed(() => !props.editor.isEditable);

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function openInsert() {
	rows.value = 3;
	cols.value = 3;
	withHeaderRow.value = true;
	open.value = true;
}

function insertTable() {
	const safeRows = clamp(rows.value, 1, 12);
	const safeCols = clamp(cols.value, 1, 12);

	props.editor
		.chain()
		.focus()
		.insertTable({
			rows: safeRows,
			cols: safeCols,
			withHeaderRow: withHeaderRow.value,
		})
		.run();

	open.value = false;
}

defineExpose({ openInsert });
</script>

<template>
	<UPopover v-model:open="open" :ui="{ content: 'p-3 w-72 sm:w-80' }">
		<UTooltip :text="t('tickets.editor.table.tooltip')">
			<UButton
				icon="i-lucide-table"
				color="neutral"
				active-color="primary"
				variant="ghost"
				active-variant="soft"
				size="sm"
				:disabled="disabled"
			/>
		</UTooltip>

		<template #content>
			<div class="flex flex-col gap-3">
				<p class="text-sm font-medium text-highlighted">
					{{ t("tickets.editor.table.insertTitle") }}
				</p>

				<div class="grid grid-cols-2 gap-3">
					<UFormField :label="t('tickets.editor.table.rows')">
						<UInput
							v-model.number="rows"
							type="number"
							min="1"
							max="12"
							size="sm"
						/>
					</UFormField>
					<UFormField :label="t('tickets.editor.table.columns')">
						<UInput
							v-model.number="cols"
							type="number"
							min="1"
							max="12"
							size="sm"
						/>
					</UFormField>
				</div>

				<UCheckbox
					v-model="withHeaderRow"
					:label="t('tickets.editor.table.withHeaderRow')"
				/>

				<div class="flex items-center justify-end">
					<UButton
						:label="t('tickets.editor.table.insert')"
						color="primary"
						variant="soft"
						size="sm"
						@click="insertTable"
					/>
				</div>
			</div>
		</template>
	</UPopover>
</template>
