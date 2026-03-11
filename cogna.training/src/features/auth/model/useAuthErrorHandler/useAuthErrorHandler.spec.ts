import { describe, expect, it, vi, beforeEach } from "vitest";
import { h } from "vue";
import { render, screen, userEvent } from "@/test/utils";
import { useAuthErrorHandler } from "../useAuthErrorHandler";

const toastAdd = vi.fn();
const mockToast = { add: toastAdd };

const TestWrapper = {
	setup() {
		const { handleError } = useAuthErrorHandler({ toast: mockToast });
		return () =>
			h("div", {}, [
				h(
					"button",
					{
						"data-testid": "error-user-registered",
						onClick: () => handleError(new Error("user already registered")),
					},
					"Trigger user registered",
				),
				h(
					"button",
					{
						"data-testid": "error-invalid-otp",
						onClick: () => handleError(new Error("invalid otp")),
					},
					"Trigger invalid otp",
				),
				h(
					"button",
					{
						"data-testid": "error-unknown",
						onClick: () => handleError(new Error("some unknown error")),
					},
					"Trigger unknown",
				),
				h(
					"button",
					{
						"data-testid": "error-string",
						onClick: () => handleError("string error"),
					},
					"Trigger string",
				),
			]);
	},
};

describe("useAuthErrorHandler", () => {
	beforeEach(() => {
		toastAdd.mockClear();
	});

	it("вызывает toast.add с переведённым сообщением для user already registered", async () => {
		render(TestWrapper);
		await userEvent.click(screen.getByTestId("error-user-registered"));

		expect(toastAdd).toHaveBeenCalledTimes(1);
		expect(toastAdd).toHaveBeenCalledWith({
			title: "Произошла ошибка, пожалуйста повторите попытку",
			description: "Этот email уже зарегистрирован. Войдите или используйте другой email.",
			color: "error",
			icon: "i-lucide-circle-x",
		});
	});

	it("вызывает toast.add с переведённым сообщением для invalid otp", async () => {
		render(TestWrapper);
		await userEvent.click(screen.getByTestId("error-invalid-otp"));

		expect(toastAdd).toHaveBeenCalledWith({
			title: "Произошла ошибка, пожалуйста повторите попытку",
			description: "Неверный код подтверждения. Проверьте и попробуйте снова.",
			color: "error",
			icon: "i-lucide-circle-x",
		});
	});

	it("вызывает toast.add с auth.error.unknown для неизвестной ошибки", async () => {
		render(TestWrapper);
		await userEvent.click(screen.getByTestId("error-unknown"));

		expect(toastAdd).toHaveBeenCalledWith({
			title: "Произошла ошибка, пожалуйста повторите попытку",
			description: "Что-то пошло не так. Попробуйте позже.",
			color: "error",
			icon: "i-lucide-circle-x",
		});
	});

	it("обрабатывает ошибку как строку", async () => {
		render(TestWrapper);
		await userEvent.click(screen.getByTestId("error-string"));

		expect(toastAdd).toHaveBeenCalledTimes(1);
		expect(toastAdd).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Произошла ошибка, пожалуйста повторите попытку",
				color: "error",
				icon: "i-lucide-circle-x",
			}),
		);
	});

	it("возвращает handleError", () => {
		const StructureTest = {
			setup() {
				const result = useAuthErrorHandler({ toast: mockToast });
				return () =>
					h("div", { "data-testid": "structure" }, [
						h("span", {
							"data-has-handler": typeof result.handleError === "function" ? "true" : "false",
						}),
					]);
			},
		};
		render(StructureTest);
		expect(
			screen
				.getByTestId("structure")
				.querySelector("[data-has-handler]")
				?.getAttribute("data-has-handler"),
		).toBe("true");
	});
});
