import { describe, expect, it } from "vitest";
import { h } from "vue";
import { render, screen } from "@/test/utils";
import { useSignupForm } from "./signupForm";

const SignupFormTestWrapper = {
	setup() {
		const { validators } = useSignupForm({ onSubmit: () => {} });

		return () =>
			h("div", {}, [
				h("span", { "data-testid": "email-empty" }, validators.email("") ?? ""),
				h("span", { "data-testid": "email-invalid" }, validators.email("invalid") ?? ""),
				h("span", { "data-testid": "email-valid" }, validators.email("test@example.com") ?? "ok"),
				h("span", { "data-testid": "password-empty" }, validators.password("") ?? ""),
				h("span", { "data-testid": "password-short" }, validators.password("123") ?? ""),
				h("span", { "data-testid": "password-valid" }, validators.password("password123") ?? "ok"),
				h(
					"span",
					{ "data-testid": "repeated-empty" },
					validators.repeatedPassword("pass", "") ?? "",
				),
				h(
					"span",
					{ "data-testid": "repeated-mismatch" },
					validators.repeatedPassword("pass", "other") ?? "",
				),
				h(
					"span",
					{ "data-testid": "repeated-valid" },
					validators.repeatedPassword("pass", "pass") ?? "ok",
				),
				h("span", { "data-testid": "isagree-false" }, validators.isAgree(false) ?? ""),
				h("span", { "data-testid": "isagree-true" }, validators.isAgree(true) ?? "ok"),
			]);
	},
};

describe("useSignupForm", () => {
	it("validators.email возвращает ошибку для пустой строки", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("email-empty").textContent).toBe("Email - обязательное поле");
	});

	it("validators.email возвращает ошибку для невалидного email", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("email-invalid").textContent).toBe("Неверно введен Email");
	});

	it("validators.email возвращает undefined для валидного email", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("email-valid").textContent).toBe("ok");
	});

	it("validators.password возвращает ошибку для пустой строки", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("password-empty").textContent).toBe("Пароль - обязательное поле");
	});

	it("validators.password возвращает ошибку для короткого пароля", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("password-short").textContent).toBe(
			"Пароль должен содержать минимум 8 символов",
		);
	});

	it("validators.password возвращает undefined для валидного пароля", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("password-valid").textContent).toBe("ok");
	});

	it("validators.repeatedPassword возвращает ошибку для пустой строки", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("repeated-empty").textContent).toBe("Подтвердите пароль");
	});

	it("validators.repeatedPassword возвращает ошибку при несовпадении", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("repeated-mismatch").textContent).toBe("Пароли не совпадают");
	});

	it("validators.repeatedPassword возвращает undefined при совпадении", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("repeated-valid").textContent).toBe("ok");
	});

	it("validators.isAgree возвращает ошибку для false", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("isagree-false").textContent).toBe(
			"Необходимо согласиться с условиями",
		);
	});

	it("validators.isAgree возвращает undefined для true", () => {
		render(SignupFormTestWrapper);
		expect(screen.getByTestId("isagree-true").textContent).toBe("ok");
	});

	it("возвращает form и validators", () => {
		const StructureTest = {
			setup() {
				const result = useSignupForm({ onSubmit: () => {} });
				return () =>
					h("div", { "data-testid": "structure" }, [
					h("span", { "data-has-form": !!result.form }),
					h("span", { "data-has-validators": !!result.validators }),
					h("span", { "data-email-type": typeof result.validators.email }),
					h("span", { "data-password-type": typeof result.validators.password }),
					h("span", { "data-repeated-type": typeof result.validators.repeatedPassword }),
					h("span", { "data-isagree-type": typeof result.validators.isAgree }),
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
		expect(el.querySelector("[data-repeated-type]")?.getAttribute("data-repeated-type")).toBe(
			"function",
		);
		expect(el.querySelector("[data-isagree-type]")?.getAttribute("data-isagree-type")).toBe(
			"function",
		);
	});
});
