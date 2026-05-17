<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
		ariaDescription: string;
		textareaClass?: string;
		commitOnEnter?: boolean;
	}>(),
	{
		placeholder: "",
		textareaClass: "",
		commitOnEnter: true,
	},
);

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "commit"): void;
}>();

const elementId = `inline-textarea-field-${Math.random().toString(36).slice(2, 11)}`;
const describedById = `${elementId}-description`;

const committedInCurrentFocus = ref(false);

const value = computed({
	get: () => props.modelValue,
	set: (newValue: string) => emit("update:modelValue", newValue),
});

const handleFocus = () => {
	committedInCurrentFocus.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
	if (!props.commitOnEnter) return;
	if (event.key !== "Enter" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
		return;
	}

	event.preventDefault();
	committedInCurrentFocus.value = true;
	emit("commit");
};

const handleBlur = () => {
	if (committedInCurrentFocus.value) {
		committedInCurrentFocus.value = false;
		return;
	}

	emit("commit");
};
</script>

<template>
	<div class="inline-textarea-field">
		<textarea
			:id="elementId"
			v-model="value"
			:placeholder="placeholder"
			:aria-describedby="describedById"
			:class="textareaClass"
			class="textarea"
			@keydown="handleKeydown"
			@focus="handleFocus"
			@blur="handleBlur"
		/>
		<span :id="describedById" class="inline-textarea-field__sr-only">
			{{ ariaDescription }} {{ modelValue }}
		</span>
	</div>
</template>

<style scoped>
.inline-textarea-field__sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.textarea {
	field-sizing: content;
	overflow-y: hidden;
  resize: none;
	outline: none;
	border: none;
}
</style>
