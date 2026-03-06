import { describe, expect, it } from "vitest";
import { h } from "vue";
import { render, screen } from "@/test/utils";
import { useLoginForm } from "./loginForm";

const LoginFormTestWrapper = {
	setup() {
		const {  validators } = useLoginForm({ onSubmit: () => {} });

		return () =>
			h("div", {}, [
				h("span", { "data-testid": "email-empty" }, validators.email("") ?? ""),
				h("span", { "data-testid": "email-invalid" }, validators.email("invalid") ?? ""),
				h("span", { "data-testid": "email-valid" }, validators.email("test@example.com") ?? "ok"),
				h("span", { "data-testid": "password-empty" }, validators.password("") ?? ""),
				h("span", { "data-testid": "password-valid" }, validators.password("password123") ?? "ok"),
			]);
	},
};

describe("useLoginForm", () => {
	it("validators.email возвращает ошибку для пустой строки", () => {
		render(LoginFormTestWrapper);
		expect(screen.getByTestId("email-empty").textContent).toBe("Email - обязательное поле");
	});

	it("validators.email возвращает ошибку для невалидного email", () => {
		render(LoginFormTestWrapper);
		expect(screen.getByTestId("email-invalid").textContent).toBe("Неверно введен Email");
	});

	it("validators.email возвращает undefined для валидного email", () => {
		render(LoginFormTestWrapper);
		expect(screen.getByTestId("email-valid").textContent).toBe("ok");
	});

	it("validators.password возвращает ошибку для пустой строки", () => {
		render(LoginFormTestWrapper);
		expect(screen.getByTestId("password-empty").textContent).toBe("Пароль - обязательное поле");
	});

	it("validators.password возвращает undefined для валидного пароля", () => {
		render(LoginFormTestWrapper);
		expect(screen.getByTestId("password-valid").textContent).toBe("ok");
	});

	it("возвращает form и validators", () => {
		const StructureTest = {
			setup() {
				const result = useLoginForm({ onSubmit: () => {} });
				return () =>
					h("div", { "data-testid": "structure" }, [
					h("span", { "data-has-form": !!result.form }),
					h("span", { "data-has-validators": !!result.validators }),
					h("span", { "data-email-type": typeof result.validators.email }),
					h("span", { "data-password-type": typeof result.validators.password }),
					]);
			},
		};
		render(StructureTest);
		const el = screen.getByTestId("structure");
		expect(el.querySelector("[data-has-form]")?.getAttribute("data-has-form")).toBe("true");
		expect(el.querySelector("[data-has-validators]")?.getAttribute("data-has-validators")).toBe(
			"true",
		);
		expect(el.querySelector("[data-email-type]")?.getAttribute("data-email-type")).toBe(
			"function",
		);
		expect(el.querySelector("[data-password-type]")?.getAttribute("data-password-type")).toBe(
			"function",
		);
	});
});
