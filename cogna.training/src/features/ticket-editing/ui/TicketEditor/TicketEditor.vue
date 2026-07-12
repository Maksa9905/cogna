<script setup lang="ts">
import type {
	DropdownMenuItem,
	EditorCustomHandlers,
	EditorMentionMenuItem,
	EditorSuggestionMenuItem,
	EditorToolbarItem,
} from "@nuxt/ui";
import type { Editor, JSONContent } from "@tiptap/vue-3";
import { mapEditorItems } from "@nuxt/ui/utils/editor";
import { Mathematics } from "@tiptap/extension-mathematics";
import { TableKit } from "@tiptap/extension-table/kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { upperFirst } from "scule";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import EditorLinkPopover from "./EditorLinkPopover.vue";
import EditorMathPopover from "./EditorMathPopover.vue";
import EditorTablePopover from "./EditorTablePopover.vue";

const { t } = useI18n();

const editorEditable = ref(true);

function toggleEditorEditable(editor: Editor) {
	editorEditable.value = !editorEditable.value;
	editor.setEditable(editorEditable.value);
}

const model = defineModel<string>({ default: "" });

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		editorClass?: string;
		mentionItems?: EditorMentionMenuItem[];
		isLoading?: boolean;
	}>(),
	{
		placeholder: undefined,
		editorClass: "",
		isLoading: false,
	},
);

const emit = defineEmits<{
	commit: [],
}>()

const resolvedPlaceholder = computed(() => props.placeholder ?? t("tickets.editor.answerPlaceholder"));

const mathPopoverRef = useTemplateRef("mathPopover");
const tablePopoverRef = useTemplateRef("tablePopover");

const customHandlers = {
	inlineMath: {
		canExecute: () => true,
		execute: (editor: Editor) => {
			mathPopoverRef.value?.openInsert("inline");
			return editor.chain();
		},
		isActive: () => false,
		isDisabled: (editor: Editor) => !editor.isEditable,
	},
	blockMath: {
		canExecute: () => true,
		execute: (editor: Editor) => {
			mathPopoverRef.value?.openInsert("block");
			return editor.chain();
		},
		isActive: () => false,
		isDisabled: (editor: Editor) => !editor.isEditable,
	},
	table: {
		canExecute: () => true,
		execute: (editor: Editor) => {
			tablePopoverRef.value?.openInsert();
			return editor.chain();
		},
		isActive: () => false,
		isDisabled: (editor: Editor) => !editor.isEditable,
	},
} satisfies EditorCustomHandlers;

const editorExtensions = computed(() => [
	TextAlign.configure({ types: ["heading", "paragraph"] }),
	TableKit.configure({
		table: {
			HTMLAttributes: {
				class: "ticket-editor-table",
			},
		},
	}),
	Mathematics.configure({
		katexOptions: { throwOnError: false },
		inlineOptions: {
			onClick: (node, pos) => {
				mathPopoverRef.value?.openEdit({
					latex: node.attrs.latex ?? "",
					pos,
					type: "inline",
				});
			},
		},
		blockOptions: {
			onClick: (node, pos) => {
				mathPopoverRef.value?.openEdit({
					latex: node.attrs.latex ?? "",
					pos,
					type: "block",
				});
			},
		},
	}),
]);

const fixedToolbarToggleGroup = [
	{
		slot: "editableToggle" as const,
		icon: "i-lucide-lock",
	},
] satisfies EditorToolbarItem<typeof customHandlers>[];

const fixedToolbarGroupsEdit = computed((): EditorToolbarItem<typeof customHandlers>[][] => [
	[
		{
			kind: "undo",
			icon: "i-lucide-undo",
			tooltip: { text: t("tickets.editor.undo") },
		},
		{
			kind: "redo",
			icon: "i-lucide-redo",
			tooltip: { text: t("tickets.editor.redo") },
		},
	],
	[
		{
			icon: "i-lucide-heading",
			tooltip: { text: t("tickets.editor.headings") },
			content: { align: "start" },
			items: [
				{ kind: "heading", level: 1, icon: "i-lucide-heading-1", label: t("tickets.editor.heading1") },
				{ kind: "heading", level: 2, icon: "i-lucide-heading-2", label: t("tickets.editor.heading2") },
				{ kind: "heading", level: 3, icon: "i-lucide-heading-3", label: t("tickets.editor.heading3") },
				{ kind: "heading", level: 4, icon: "i-lucide-heading-4", label: t("tickets.editor.heading4") },
			],
		},
		{
			icon: "i-lucide-list",
			tooltip: { text: t("tickets.editor.lists") },
			content: { align: "start" },
			items: [
				{ kind: "bulletList", icon: "i-lucide-list", label: t("tickets.editor.bulletList") },
				{ kind: "orderedList", icon: "i-lucide-list-ordered", label: t("tickets.editor.orderedList") },
			],
		},
		{
			kind: "blockquote",
			icon: "i-lucide-text-quote",
			tooltip: { text: t("tickets.editor.blockquote") },
		},
		{
			kind: "codeBlock",
			icon: "i-lucide-square-code",
			tooltip: { text: t("tickets.editor.codeBlock") },
		},
	],
	[
		{ kind: "mark", mark: "bold", icon: "i-lucide-bold", tooltip: { text: t("tickets.editor.bold") } },
		{ kind: "mark", mark: "italic", icon: "i-lucide-italic", tooltip: { text: t("tickets.editor.italic") } },
		{
			kind: "mark",
			mark: "underline",
			icon: "i-lucide-underline",
			tooltip: { text: t("tickets.editor.underline") },
		},
		{ kind: "mark", mark: "strike", icon: "i-lucide-strikethrough", tooltip: { text: t("tickets.editor.strike") } },
		{ kind: "mark", mark: "code", icon: "i-lucide-code", tooltip: { text: t("tickets.editor.code") } },
	],
	[{ slot: "link" as const, icon: "i-lucide-link" }],
	[{ slot: "math" as const, icon: "i-lucide-sigma" }],
	[{ slot: "table" as const, icon: "i-lucide-table" }],
	[
		{
			icon: "i-lucide-align-justify",
			tooltip: { text: t("tickets.editor.alignment") },
			content: { align: "end" },
			items: [
				{ kind: "textAlign", align: "left", icon: "i-lucide-align-left", label: t("tickets.editor.alignLeft") },
				{
					kind: "textAlign",
					align: "center",
					icon: "i-lucide-align-center",
					label: t("tickets.editor.alignCenter"),
				},
				{ kind: "textAlign", align: "right", icon: "i-lucide-align-right", label: t("tickets.editor.alignRight") },
				{
					kind: "textAlign",
					align: "justify",
					icon: "i-lucide-align-justify",
					label: t("tickets.editor.alignJustify"),
				},
			],
		},
	],
	fixedToolbarToggleGroup,
]);

const fixedToolbarItems = computed((): EditorToolbarItem<typeof customHandlers>[][] =>
	editorEditable.value ? fixedToolbarGroupsEdit.value : [fixedToolbarToggleGroup],
);

const bubbleToolbarItems = computed((): EditorToolbarItem<typeof customHandlers>[][] => {
	const turnInto = t("tickets.editor.turnInto");
	return [
		[
			{
				label: turnInto,
				trailingIcon: "i-lucide-chevron-down",
				activeColor: "neutral",
				activeVariant: "ghost",
				tooltip: { text: turnInto },
				content: { align: "start" },
				ui: { label: "text-xs" },
				items: [
					{ type: "label", label: turnInto },
					{ kind: "paragraph", label: t("tickets.editor.paragraph"), icon: "i-lucide-type" },
					{ kind: "heading", level: 1, icon: "i-lucide-heading-1", label: t("tickets.editor.heading1") },
					{ kind: "heading", level: 2, icon: "i-lucide-heading-2", label: t("tickets.editor.heading2") },
					{ kind: "heading", level: 3, icon: "i-lucide-heading-3", label: t("tickets.editor.heading3") },
					{ kind: "heading", level: 4, icon: "i-lucide-heading-4", label: t("tickets.editor.heading4") },
					{ kind: "bulletList", icon: "i-lucide-list", label: t("tickets.editor.list") },
					{ kind: "orderedList", icon: "i-lucide-list-ordered", label: t("tickets.editor.numberedList") },
					{ kind: "blockquote", icon: "i-lucide-text-quote", label: t("tickets.editor.blockquote") },
					{ kind: "codeBlock", icon: "i-lucide-square-code", label: t("tickets.editor.code") },
				],
			},
		],
		[
			{ kind: "mark", mark: "bold", icon: "i-lucide-bold", tooltip: { text: t("tickets.editor.bold") } },
			{ kind: "mark", mark: "italic", icon: "i-lucide-italic", tooltip: { text: t("tickets.editor.italic") } },
			{
				kind: "mark",
				mark: "underline",
				icon: "i-lucide-underline",
				tooltip: { text: t("tickets.editor.underline") },
			},
			{
				kind: "mark",
				mark: "strike",
				icon: "i-lucide-strikethrough",
				tooltip: { text: t("tickets.editor.strike") },
			},
			{ kind: "mark", mark: "code", icon: "i-lucide-code", tooltip: { text: t("tickets.editor.code") } },
		],
		[{ slot: "link" as const, icon: "i-lucide-link" }],
		[
			{
				icon: "i-lucide-align-justify",
				tooltip: { text: t("tickets.editor.alignment") },
				content: { align: "end" },
				items: [
					{ kind: "textAlign", align: "left", icon: "i-lucide-align-left", label: t("tickets.editor.alignLeft") },
					{
						kind: "textAlign",
						align: "center",
						icon: "i-lucide-align-center",
						label: t("tickets.editor.alignCenter"),
					},
					{
						kind: "textAlign",
						align: "right",
						icon: "i-lucide-align-right",
						label: t("tickets.editor.alignRight"),
					},
					{
						kind: "textAlign",
						align: "justify",
						icon: "i-lucide-align-justify",
						label: t("tickets.editor.alignJustify"),
					},
				],
			},
		],
	];
});

const imageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
	const node = editor.state.doc.nodeAt(editor.state.selection.from);

	return [
		[
			{
				icon: "i-lucide-download",
				to: node?.attrs?.src,
				download: true,
				tooltip: { text: t("tickets.editor.download") },
			},
		],
		[
			{
				icon: "i-lucide-trash",
				tooltip: { text: t("tickets.editor.delete") },
				onClick: () => {
					const { state } = editor;
					const { selection } = state;
					const pos = selection.from;
					const n = state.doc.nodeAt(pos);
					if (n && n.type.name === "image") {
						editor.chain().focus().deleteRange({ from: pos, to: pos + n.nodeSize }).run();
					}
				},
			},
		],
	];
};

const tableToolbarItems = (editor: Editor): EditorToolbarItem[][] => [
	[
		{
			icon: "i-lucide-arrow-up-from-line",
			tooltip: { text: t("tickets.editor.table.addRowBefore") },
			onClick: () => editor.chain().focus().addRowBefore().run(),
		},
		{
			icon: "i-lucide-arrow-down-from-line",
			tooltip: { text: t("tickets.editor.table.addRowAfter") },
			onClick: () => editor.chain().focus().addRowAfter().run(),
		},
		{
			icon: "i-lucide-minus",
			tooltip: { text: t("tickets.editor.table.deleteRow") },
			onClick: () => editor.chain().focus().deleteRow().run(),
		},
	],
	[
		{
			icon: "i-lucide-arrow-left-from-line",
			tooltip: { text: t("tickets.editor.table.addColumnBefore") },
			onClick: () => editor.chain().focus().addColumnBefore().run(),
		},
		{
			icon: "i-lucide-arrow-right-from-line",
			tooltip: { text: t("tickets.editor.table.addColumnAfter") },
			onClick: () => editor.chain().focus().addColumnAfter().run(),
		},
		{
			icon: "i-lucide-minus",
			tooltip: { text: t("tickets.editor.table.deleteColumn") },
			onClick: () => editor.chain().focus().deleteColumn().run(),
		},
	],
	[
		{
			icon: "i-lucide-table-properties",
			tooltip: { text: t("tickets.editor.table.toggleHeaderRow") },
			onClick: () => editor.chain().focus().toggleHeaderRow().run(),
		},
		{
			icon: "i-lucide-trash",
			tooltip: { text: t("tickets.editor.table.deleteTable") },
			onClick: () => editor.chain().focus().deleteTable().run(),
		},
	],
];

const selectedNode = ref<{ node: JSONContent; pos: number }>();

const handleItems = (editor: Editor): DropdownMenuItem[][] => {
	if (!selectedNode.value?.node?.type) {
		return [];
	}

	return mapEditorItems(editor, [
		[
			{
				type: "label",
				label: upperFirst(selectedNode.value.node.type),
			},
			{
				label: t("tickets.editor.turnInto"),
				icon: "i-lucide-repeat-2",
				children: [
					{ kind: "paragraph", label: t("tickets.editor.paragraph"), icon: "i-lucide-type" },
					{ kind: "heading", level: 1, label: t("tickets.editor.heading1"), icon: "i-lucide-heading-1" },
					{ kind: "heading", level: 2, label: t("tickets.editor.heading2"), icon: "i-lucide-heading-2" },
					{ kind: "heading", level: 3, label: t("tickets.editor.heading3"), icon: "i-lucide-heading-3" },
					{ kind: "heading", level: 4, label: t("tickets.editor.heading4"), icon: "i-lucide-heading-4" },
					{ kind: "bulletList", label: t("tickets.editor.list"), icon: "i-lucide-list" },
					{ kind: "orderedList", label: t("tickets.editor.numberedList"), icon: "i-lucide-list-ordered" },
					{ kind: "blockquote", label: t("tickets.editor.blockquote"), icon: "i-lucide-text-quote" },
					{ kind: "codeBlock", label: t("tickets.editor.code"), icon: "i-lucide-square-code" },
				],
			},
			{
				kind: "clearFormatting",
				pos: selectedNode.value?.pos,
				label: t("tickets.editor.clearFormatting"),
				icon: "i-lucide-rotate-ccw",
			},
		],
		[
			{
				kind: "duplicate",
				pos: selectedNode.value?.pos,
				label: t("tickets.editor.duplicate"),
				icon: "i-lucide-copy",
			},
			{
				label: t("tickets.editor.copyText"),
				icon: "i-lucide-clipboard",
				onSelect: async () => {
					if (!selectedNode.value) return;
					const pos = selectedNode.value.pos;
					const n = editor.state.doc.nodeAt(pos);
					if (n) {
						await navigator.clipboard.writeText(n.textContent);
					}
				},
			},
		],
		[
			{
				kind: "moveUp",
				pos: selectedNode.value?.pos,
				label: t("tickets.editor.moveUp"),
				icon: "i-lucide-arrow-up",
			},
			{
				kind: "moveDown",
				pos: selectedNode.value?.pos,
				label: t("tickets.editor.moveDown"),
				icon: "i-lucide-arrow-down",
			},
		],
		[
			{
				kind: "delete",
				pos: selectedNode.value?.pos,
				label: t("tickets.editor.delete"),
				icon: "i-lucide-trash",
			},
		],
	]) as DropdownMenuItem[][];
};

const suggestionItems = computed((): EditorSuggestionMenuItem<typeof customHandlers>[][] => [
	[
		{ type: "label", label: t("tickets.editor.style") },
		{ kind: "paragraph", label: t("tickets.editor.paragraph"), icon: "i-lucide-type" },
		{ kind: "heading", level: 1, label: t("tickets.editor.heading1"), icon: "i-lucide-heading-1" },
		{ kind: "heading", level: 2, label: t("tickets.editor.heading2"), icon: "i-lucide-heading-2" },
		{ kind: "heading", level: 3, label: t("tickets.editor.heading3"), icon: "i-lucide-heading-3" },
		{ kind: "bulletList", label: t("tickets.editor.list"), icon: "i-lucide-list" },
		{ kind: "orderedList", label: t("tickets.editor.numberedList"), icon: "i-lucide-list-ordered" },
		{ kind: "blockquote", label: t("tickets.editor.blockquote"), icon: "i-lucide-text-quote" },
		{ kind: "codeBlock", label: t("tickets.editor.codeBlock"), icon: "i-lucide-square-code" },
	],
	[
		{ type: "label", label: t("tickets.editor.insert") },
		{ kind: "mention", label: t("tickets.editor.mention"), icon: "i-lucide-at-sign" },
		{
			kind: "inlineMath",
			label: t("tickets.editor.math.inlineFormula"),
			icon: "i-lucide-sigma",
		},
		{
			kind: "blockMath",
			label: t("tickets.editor.math.blockFormula"),
			icon: "i-lucide-square-sigma",
		},
		{ kind: "table", label: t("tickets.editor.table.insertItem"), icon: "i-lucide-table" },
		{ kind: "horizontalRule", label: t("tickets.editor.horizontalRule"), icon: "i-lucide-separator-horizontal" },
	],
]);

const defaultMentionItems = computed(
	(): EditorMentionMenuItem[] => [
		{ label: t("tickets.editor.mentionType.concept"), icon: "i-lucide-bookmark" },
		{ label: t("tickets.editor.mentionType.definition"), icon: "i-lucide-text-quote" },
		{ label: t("tickets.editor.mentionType.example"), icon: "i-lucide-lightbulb" },
	],
);

const resolvedMentionItems = computed(() => props.mentionItems ?? defaultMentionItems.value);
</script>


<template>
	<UEditor
		v-slot="{ editor, handlers }"
		v-model="model"
		content-type="markdown"
		@blur="() => emit('commit')"
		:extensions="editorExtensions"
		:handlers="customHandlers"
		:placeholder="resolvedPlaceholder"
		:ui="{ base: ['w-full', editorClass] }"
		:class="['w-full bg-default transition-opacity duration-200', !editorEditable && 'ticket-editor--read-only']"
	>
		<UEditorToolbar
			:editor="editor"
			:items="fixedToolbarItems"
			:class="[
				'ticket-editor-fixed-toolbar border-b border-muted sticky top-0 inset-x-0 z-1 overflow-x-auto px-3 sm:px-6 py-2 transition-[background-color,border-color] duration-200',
				editorEditable ? 'bg-default' : 'bg-muted/30 ticket-editor-fixed-toolbar--read-only',
			]"
		>
			<template #link>
				<EditorLinkPopover :editor="editor" auto-open />
			</template>
			<template #math>
				<EditorMathPopover ref="mathPopover" :editor="editor" />
			</template>
			<template #table>
				<EditorTablePopover ref="tablePopover" :editor="editor" />
			</template>
			<template #editableToggle>
				<UTooltip :text="editorEditable ? t('tickets.editorSwitchToReadOnly') : t('tickets.editorSwitchToEdit')">
					<UButton
						color="neutral"
						variant="ghost"
						size="sm"
						:icon="editorEditable ? 'i-lucide-eye' : 'i-lucide-pencil-line'"
						:active="!editorEditable"
						@click="toggleEditorEditable(editor)"
					/>
				</UTooltip>
			</template>
		</UEditorToolbar>

		<UEditorToolbar
			:editor="editor"
			:items="bubbleToolbarItems"
			layout="bubble"
			:should-show="({ editor: ed, view, state }) => {
				if (!ed.isEditable || ed.isActive('image') || ed.isActive('table')) return false;
				const { selection } = state;
				return view.hasFocus() && !selection.empty;
			}"
		>
			<template #link>
				<EditorLinkPopover :editor="editor" />
			</template>
		</UEditorToolbar>

		<UEditorToolbar
			:editor="editor"
			:items="imageToolbarItems(editor)"
			layout="bubble"
			:should-show="({ editor: ed, view }) =>
				ed.isEditable && ed.isActive('image') && view.hasFocus()"
		/>

		<UEditorToolbar
			:editor="editor"
			:items="tableToolbarItems(editor)"
			layout="bubble"
			:should-show="({ editor: ed, view }) =>
				ed.isEditable && ed.isActive('table') && view.hasFocus()"
		/>

		<UEditorSuggestionMenu v-if="editorEditable" :editor="editor" :items="suggestionItems" />

		<UEditorMentionMenu v-if="editorEditable" :editor="editor" :items="resolvedMentionItems" />

		<UEditorDragHandle
			v-if="editorEditable"
			v-slot="{ ui, onClick }"
			:editor="editor"
			@node-change="selectedNode = $event"
		>
			<UButton
				icon="i-lucide-plus"
				color="neutral"
				variant="ghost"
				size="sm"
				:class="ui.handle?.()"
				@click="
					(e) => {
						e.stopPropagation();
						const selected = onClick();
						handlers.suggestion?.execute(editor, { pos: selected?.pos }).run();
					}
				"
			/>

			<UDropdownMenu
				v-slot="{ open }"
				:modal="false"
				:items="handleItems(editor)"
				:content="{ side: 'left' }"
				:ui="{ content: 'w-48', label: 'text-xs' }"
				@update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
			>
				<UButton
					color="neutral"
					variant="ghost"
					active-variant="soft"
					size="sm"
					icon="i-lucide-grip-vertical"
					:active="open"
					:class="ui.handle?.()"
				/>
			</UDropdownMenu>
		</UEditorDragHandle>
	</UEditor>
</template>

<style scoped>
.ticket-editor-fixed-toolbar :deep([data-slot="base"]) {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: 100%;
}

.ticket-editor-fixed-toolbar :deep([data-slot="group"]:last-child) {
	margin-left: auto;
}

/* Режим просмотра: одна группа — так же справа, как переключатель в полном тулбаре */
.ticket-editor-fixed-toolbar--read-only :deep([data-slot="base"]) {
	justify-content: flex-end;
	flex-wrap: nowrap;
}

.ticket-editor-fixed-toolbar--read-only :deep([data-slot="group"]) {
	margin-left: auto;
}

.ticket-editor--read-only :deep([data-slot="content"]) {
	opacity: 0.92;
}
</style>

<style>
.tiptap pre {
	background-color: var(--ui-bg-muted);
	border-radius: var(--ui-radius);
	padding: 0.75rem 1rem;
	overflow-x: auto;
}

.tiptap pre code {
	font-size: 0.875em;
}

.tiptap .tiptap-mathematics-render--editable {
	cursor: pointer;
	border-radius: var(--ui-radius);
}

.tiptap .tiptap-mathematics-render--editable:hover {
	background-color: var(--ui-bg-muted);
}

.tiptap [data-type="block-math"] {
	display: block;
	margin: 0.75rem 0;
}

.tiptap .ticket-editor-table,
.tiptap table {
	border-collapse: collapse;
	width: 100%;
	margin: 0.75rem 0;
	table-layout: fixed;
}

.tiptap .ticket-editor-table th,
.tiptap .ticket-editor-table td,
.tiptap table th,
.tiptap table td {
	border: 1px solid var(--ui-border);
	padding: 0.5rem 0.75rem;
	vertical-align: top;
	min-width: 4rem;
}

.tiptap .ticket-editor-table th,
.tiptap table th {
	background-color: var(--ui-bg-muted);
	font-weight: 600;
}

.tiptap .ticket-editor-table .selectedCell::after,
.tiptap table .selectedCell::after {
	background-color: color-mix(in srgb, var(--ui-primary) 12%, transparent);
}
</style>
