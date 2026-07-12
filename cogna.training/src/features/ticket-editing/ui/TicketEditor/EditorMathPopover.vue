<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import katex from "katex";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

type MathType = "inline" | "block";

const props = defineProps<{
	editor: Editor;
}>();

const { t } = useI18n();

const open = ref(false);
const latex = ref("");
const mathType = ref<MathType>("inline");
const editPos = ref<number | null>(null);

const active = computed(
	() => props.editor.isActive("inlineMath") || props.editor.isActive("blockMath"),
);

const disabled = computed(() => !props.editor.isEditable);

const isEditing = computed(() => editPos.value != null);

const previewHtml = computed(() => {й
	const value = latex.value.trim();
	if (!value) return "";

	try {
		return katex.renderToString(value, {
			throwOnError: false,
			displayMode: mathType.value === "block",
		});
	} catch {
		return "";
	}
});

function openInsert(type: MathType = "inline") {
	editPos.value = null;
	mathType.value = type;
	latex.value = "";
	open.value = true;
}

function openEdit(opt: { latex: string; pos: number; type: MathType }) {
	editPos.value = opt.pos;
	mathType.value = opt.type;
	latex.value = opt.latex;
	open.value = true;
}

function applyMath() {
	const value = latex.value.trim();
	if (!value) return;

	const chain = props.editor.chain().focus();

	if (editPos.value != null) {
		if (mathType.value === "inline") {
			chain.setNodeSelection(editPos.value).updateInlineMath({ latex: value }).run();
		} else {
			chain.setNodeSelection(editPos.value).updateBlockMath({ latex: value }).run();
		}
	} else if (mathType.value === "inline") {
		chain.insertInlineMath({ latex: value }).run();
	} else {
		chain.insertBlockMath({ latex: value }).run();
	}

	open.value = false;
}

function removeMath() {
	if (editPos.value != null) {
		if (mathType.value === "inline") {
			props.editor.chain().focus().setNodeSelection(editPos.value).deleteInlineMath().run();
		} else {
			props.editor.chain().focus().setNodeSelection(editPos.value).deleteBlockMath().run();
		}
	}

	latex.value = "";
	open.value = false;
}

function handleKeyDown(event: KeyboardEvent) {
	if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
		event.preventDefault();
		applyMath();
	}
}

defineExpose({ openInsert, openEdit });
</script>

<template>
	<UPopover v-model:open="open" :ui="{ content: 'p-3 w-80 sm:w-96' }">
		<UTooltip :text="t('tickets.editor.math.tooltip')">
			<UButton
				icon="i-lucide-sigma"
				color="neutral"
				active-color="primary"
				variant="ghost"
				active-variant="soft"
				size="sm"
				:active="active"
				:disabled="disabled"
			/>
		</UTooltip>

		<template #content>
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-2">
					<p class="text-sm font-medium text-highlighted">
						{{ isEditing ? t("tickets.editor.math.editTitle") : t("tickets.editor.math.insertTitle") }}
					</p>
					<div class="flex items-center gap-1 rounded-md bg-muted p-0.5">
						<UButton
							:label="t('tickets.editor.math.inline')"
							color="neutral"
							:variant="mathType === 'inline' ? 'soft' : 'ghost'"
							size="xs"
							:disabled="isEditing"
							@click="mathType = 'inline'"
						/>
						<UButton
							:label="t('tickets.editor.math.block')"
							color="neutral"
							:variant="mathType === 'block' ? 'soft' : 'ghost'"
							size="xs"
							:disabled="isEditing"
							@click="mathType = 'block'"
						/>
					</div>
				</div>

				<UTextarea
					v-model="latex"
					:placeholder="t('tickets.editor.math.placeholder')"
					:rows="3"
					autoresize
					@keydown="handleKeyDown"
				/>

				<div
					v-if="previewHtml"
					class="math-preview rounded-md border border-muted bg-muted/30 px-3 py-2 overflow-x-auto"
					:class="mathType === 'block' ? 'text-center' : ''"
					v-html="previewHtml"
				/>

				<p class="text-xs text-muted">{{ t("tickets.editor.math.hint") }}</p>

				<div class="flex items-center justify-end gap-1">
					<UButton
						v-if="isEditing"
						:label="t('tickets.editor.math.remove')"
						color="neutral"
						variant="ghost"
						size="sm"
						@click="removeMath"
					/>
					<UButton
						:label="t('tickets.editor.math.apply')"
						color="primary"
						variant="soft"
						size="sm"
						:disabled="!latex.trim()"
						@click="applyMath"
					/>
				</div>
			</div>
		</template>
	</UPopover>
</template>
