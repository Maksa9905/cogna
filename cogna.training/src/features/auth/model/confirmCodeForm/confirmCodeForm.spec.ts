import { describe, expect, it } from "vitest";
import { h } from "vue";
import { render, screen } from "@/test/utils";
import { useConfirmCodeForm } from "./confirmCodeForm";

/**
 * Тесты для useConfirmCodeForm.
 * Хук использует useI18n, поэтому тестируем через компонент-обёртку.
 */
const TestWrapper = {
	setup() {
		const onSubmit = vi.fn();
		const { form, validators } = useConfirmCodeForm({ onSubmit });

		const testEmpty = () => validators.code("");
		const testShort = () => validators.code("12345");
		const testValid = () => validators.code("123456");

		return () =>
			h("div", {}, [
				h("span", { "data-testid": "empty-error" }, testEmpty() ?? ""),
				h("span", { "data-testid": "short-error" }, testShort() ?? ""),
				h("span", { "data-testid": "valid-error" }, testValid() ?? "ok"),
				h(
					"button",
					{
						"data-testid": "submit",
						onClick: () => form.handleSubmit(),
					},
					"Submit",
				),
			]);
	},
};

describe("useConfirmCodeForm", () => {
	it("validators.code возвращает ошибку для пустой строки", () => {
		render(TestWrapper);
		expect(screen.getByTestId("empty-error").textContent).toBe(
			"Код подтверждения - обязательное поле",
		);
	});

	it("validators.code возвращает ошибку для кода короче 6 символов", () => {
		render(TestWrapper);
		expect(screen.getByTestId("short-error").textContent).toBe(
			"Код должен содержать минимум 6 символов",
		);
	});

	it("validators.code возвращает undefined для валидного кода (6+ символов)", () => {
		render(TestWrapper);
		expect(screen.getByTestId("valid-error").textContent).toBe("ok");
	});

	it("возвращает form и validators с функцией code", () => {
		const StructureTest = {
			setup() {
				const result = useConfirmCodeForm({ onSubmit: () => {} });
				return () =>
					h("div", { "data-testid": "structure" }, [
						h("span", { "data-has-form": !!result.form }),
						h("span", { "data-has-validators": !!result.validators }),
						h("span", { "data-code-type": typeof result.validators.code }),
					]);
			},
		};
		render(StructureTest);
		const el = screen.getByTestId("structure");
		expect(el.querySelector("[data-has-form]")?.getAttribute("data-has-form")).toBe("true");
		expect(el.querySelector("[data-has-validators]")?.getAttribute("data-has-validators")).toBe(
			"true",
		);
		expect(el.querySelector("[data-code-type]")?.getAttribute("data-code-type")).toBe("function");
	});
});
