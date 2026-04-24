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
import { TextAlign } from "@tiptap/extension-text-align";
import { upperFirst } from "scule";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import EditorLinkPopover from "./EditorLinkPopover.vue";

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
		placeholder: "Ответ…",
		editorClass: "",
		isLoading: false,
	},
);

const customHandlers = {} satisfies EditorCustomHandlers;

const fixedToolbarToggleGroup = [
	{
		slot: "editableToggle" as const,
		icon: "i-lucide-lock",
	},
] satisfies EditorToolbarItem<typeof customHandlers>[];

const fixedToolbarGroupsEdit = [
	[
		{
			kind: "undo",
			icon: "i-lucide-undo",
			tooltip: { text: "Отменить" },
		},
		{
			kind: "redo",
			icon: "i-lucide-redo",
			tooltip: { text: "Вернуть" },
		},
	],
	[
		{
			icon: "i-lucide-heading",
			tooltip: { text: "Заголовки" },
			content: { align: "start" },
			items: [
				{ kind: "heading", level: 1, icon: "i-lucide-heading-1", label: "Заголовок 1" },
				{ kind: "heading", level: 2, icon: "i-lucide-heading-2", label: "Заголовок 2" },
				{ kind: "heading", level: 3, icon: "i-lucide-heading-3", label: "Заголовок 3" },
				{ kind: "heading", level: 4, icon: "i-lucide-heading-4", label: "Заголовок 4" },
			],
		},
		{
			icon: "i-lucide-list",
			tooltip: { text: "Списки" },
			content: { align: "start" },
			items: [
				{ kind: "bulletList", icon: "i-lucide-list", label: "Маркированный" },
				{ kind: "orderedList", icon: "i-lucide-list-ordered", label: "Нумерованный" },
			],
		},
		{
			kind: "blockquote",
			icon: "i-lucide-text-quote",
			tooltip: { text: "Цитата" },
		},
		{
			kind: "codeBlock",
			icon: "i-lucide-square-code",
			tooltip: { text: "Блок кода" },
		},
	],
	[
		{ kind: "mark", mark: "bold", icon: "i-lucide-bold", tooltip: { text: "Жирный" } },
		{ kind: "mark", mark: "italic", icon: "i-lucide-italic", tooltip: { text: "Курсив" } },
		{ kind: "mark", mark: "underline", icon: "i-lucide-underline", tooltip: { text: "Подчёркнутый" } },
		{ kind: "mark", mark: "strike", icon: "i-lucide-strikethrough", tooltip: { text: "Зачёркнутый" } },
		{ kind: "mark", mark: "code", icon: "i-lucide-code", tooltip: { text: "Код" } },
	],
	[{ slot: "link" as const, icon: "i-lucide-link" }],
	[
		{
			icon: "i-lucide-align-justify",
			tooltip: { text: "Выравнивание" },
			content: { align: "end" },
			items: [
				{ kind: "textAlign", align: "left", icon: "i-lucide-align-left", label: "Влево" },
				{ kind: "textAlign", align: "center", icon: "i-lucide-align-center", label: "По центру" },
				{ kind: "textAlign", align: "right", icon: "i-lucide-align-right", label: "Вправо" },
				{ kind: "textAlign", align: "justify", icon: "i-lucide-align-justify", label: "По ширине" },
			],
		},
	],
	fixedToolbarToggleGroup,
] satisfies EditorToolbarItem<typeof customHandlers>[][];

const fixedToolbarItems = computed((): EditorToolbarItem<typeof customHandlers>[][] =>
	editorEditable.value ? fixedToolbarGroupsEdit : [fixedToolbarToggleGroup],
);

const bubbleToolbarItems = [
	[
		{
			label: "Превратить в",
			trailingIcon: "i-lucide-chevron-down",
			activeColor: "neutral",
			activeVariant: "ghost",
			tooltip: { text: "Превратить в" },
			content: { align: "start" },
			ui: { label: "text-xs" },
			items: [
				{ type: "label", label: "Превратить в" },
				{ kind: "paragraph", label: "Абзац", icon: "i-lucide-type" },
				{ kind: "heading", level: 1, icon: "i-lucide-heading-1", label: "Заголовок 1" },
				{ kind: "heading", level: 2, icon: "i-lucide-heading-2", label: "Заголовок 2" },
				{ kind: "heading", level: 3, icon: "i-lucide-heading-3", label: "Заголовок 3" },
				{ kind: "heading", level: 4, icon: "i-lucide-heading-4", label: "Заголовок 4" },
				{ kind: "bulletList", icon: "i-lucide-list", label: "Список" },
				{ kind: "orderedList", icon: "i-lucide-list-ordered", label: "Нумерация" },
				{ kind: "blockquote", icon: "i-lucide-text-quote", label: "Цитата" },
				{ kind: "codeBlock", icon: "i-lucide-square-code", label: "Код" },
			],
		},
	],
	[
		{ kind: "mark", mark: "bold", icon: "i-lucide-bold", tooltip: { text: "Жирный" } },
		{ kind: "mark", mark: "italic", icon: "i-lucide-italic", tooltip: { text: "Курсив" } },
		{ kind: "mark", mark: "underline", icon: "i-lucide-underline", tooltip: { text: "Подчёркнутый" } },
		{ kind: "mark", mark: "strike", icon: "i-lucide-strikethrough", tooltip: { text: "Зачёркнутый" } },
		{ kind: "mark", mark: "code", icon: "i-lucide-code", tooltip: { text: "Код" } },
	],
	[{ slot: "link" as const, icon: "i-lucide-link" }],
	[
		{
			icon: "i-lucide-align-justify",
			tooltip: { text: "Выравнивание" },
			content: { align: "end" },
			items: [
				{ kind: "textAlign", align: "left", icon: "i-lucide-align-left", label: "Влево" },
				{ kind: "textAlign", align: "center", icon: "i-lucide-align-center", label: "По центру" },
				{ kind: "textAlign", align: "right", icon: "i-lucide-align-right", label: "Вправо" },
				{ kind: "textAlign", align: "justify", icon: "i-lucide-align-justify", label: "По ширине" },
			],
		},
	],
] satisfies EditorToolbarItem<typeof customHandlers>[][];

const imageToolbarItems = (editor: Editor): EditorToolbarItem[][] => {
	const node = editor.state.doc.nodeAt(editor.state.selection.from);

	return [
		[
			{
				icon: "i-lucide-download",
				to: node?.attrs?.src,
				download: true,
				tooltip: { text: "Скачать" },
			},
		],
		[
			{
				icon: "i-lucide-trash",
				tooltip: { text: "Удалить" },
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
				label: "Превратить в",
				icon: "i-lucide-repeat-2",
				children: [
					{ kind: "paragraph", label: "Абзац", icon: "i-lucide-type" },
					{ kind: "heading", level: 1, label: "Заголовок 1", icon: "i-lucide-heading-1" },
					{ kind: "heading", level: 2, label: "Заголовок 2", icon: "i-lucide-heading-2" },
					{ kind: "heading", level: 3, label: "Заголовок 3", icon: "i-lucide-heading-3" },
					{ kind: "heading", level: 4, label: "Заголовок 4", icon: "i-lucide-heading-4" },
					{ kind: "bulletList", label: "Список", icon: "i-lucide-list" },
					{ kind: "orderedList", label: "Нумерация", icon: "i-lucide-list-ordered" },
					{ kind: "blockquote", label: "Цитата", icon: "i-lucide-text-quote" },
					{ kind: "codeBlock", label: "Код", icon: "i-lucide-square-code" },
				],
			},
			{
				kind: "clearFormatting",
				pos: selectedNode.value?.pos,
				label: "Сбросить оформление",
				icon: "i-lucide-rotate-ccw",
			},
		],
		[
			{
				kind: "duplicate",
				pos: selectedNode.value?.pos,
				label: "Дублировать",
				icon: "i-lucide-copy",
			},
			{
				label: "Копировать текст",
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
				label: "Выше",
				icon: "i-lucide-arrow-up",
			},
			{
				kind: "moveDown",
				pos: selectedNode.value?.pos,
				label: "Ниже",
				icon: "i-lucide-arrow-down",
			},
		],
		[
			{
				kind: "delete",
				pos: selectedNode.value?.pos,
				label: "Удалить",
				icon: "i-lucide-trash",
			},
		],
	]) as DropdownMenuItem[][];
};

const suggestionItems = [
	[
		{ type: "label", label: "Стиль" },
		{ kind: "paragraph", label: "Абзац", icon: "i-lucide-type" },
		{ kind: "heading", level: 1, label: "Заголовок 1", icon: "i-lucide-heading-1" },
		{ kind: "heading", level: 2, label: "Заголовок 2", icon: "i-lucide-heading-2" },
		{ kind: "heading", level: 3, label: "Заголовок 3", icon: "i-lucide-heading-3" },
		{ kind: "bulletList", label: "Список", icon: "i-lucide-list" },
		{ kind: "orderedList", label: "Нумерация", icon: "i-lucide-list-ordered" },
		{ kind: "blockquote", label: "Цитата", icon: "i-lucide-text-quote" },
		{ kind: "codeBlock", label: "Блок кода", icon: "i-lucide-square-code" },
	],
	[
		{ type: "label", label: "Вставка" },
		{ kind: "mention", label: "Упоминание", icon: "i-lucide-at-sign" },
		{ kind: "horizontalRule", label: "Разделитель", icon: "i-lucide-separator-horizontal" },
	],
] satisfies EditorSuggestionMenuItem<typeof customHandlers>[][];

const defaultMentionItems: EditorMentionMenuItem[] = [
	{ label: "concept", icon: "i-lucide-bookmark" },
	{ label: "definition", icon: "i-lucide-text-quote" },
	{ label: "example", icon: "i-lucide-lightbulb" },
];

const resolvedMentionItems = computed(() => props.mentionItems ?? defaultMentionItems);
</script>


<template>
	<UEditor
		v-slot="{ editor, handlers }"
		v-model="model"
		content-type="markdown"
		:extensions="[TextAlign.configure({ types: ['heading', 'paragraph'] })]"
		:placeholder="placeholder"
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
				if (!ed.isEditable || ed.isActive('image')) return false;
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
</style>
