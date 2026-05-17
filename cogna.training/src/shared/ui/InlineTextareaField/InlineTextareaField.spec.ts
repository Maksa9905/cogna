import { describe, expect, it } from "vitest";
import InlineTextareaField from "./InlineTextareaField.vue";
import { fireEvent, render, screen } from "@/test/utils";

describe("InlineTextareaField", () => {
	it("эмитит commit по Enter без Shift", async () => {
		const { emitted } = render(InlineTextareaField, {
			props: {
				modelValue: "Текст",
				ariaDescription: "Описание",
			},
		});

		const textarea = screen.getByRole("textbox");
		await fireEvent.focus(textarea);
		await fireEvent.keyDown(textarea, { key: "Enter" });

		expect(emitted("commit")).toHaveLength(1);
	});

	it("эмитит commit по blur", async () => {
		const { emitted } = render(InlineTextareaField, {
			props: {
				modelValue: "Текст",
				ariaDescription: "Описание",
			},
		});

		const textarea = screen.getByRole("textbox");
		await fireEvent.blur(textarea);

		expect(emitted("commit")).toHaveLength(1);
	});

	it("связывает textarea с sr-only текстом через aria-describedby", () => {
		render(InlineTextareaField, {
			props: {
				modelValue: "Текущее значение",
				ariaDescription: "Подсказка",
			},
		});

		const textarea = screen.getByRole("textbox");
		const describedBy = textarea.getAttribute("aria-describedby");

		expect(describedBy).toBeTruthy();
		const description = document.getElementById(describedBy as string);
		expect(description).toBeInTheDocument();
		expect(description?.textContent).toContain("Подсказка");
		expect(description?.textContent).toContain("Текущее значение");
	});
});
