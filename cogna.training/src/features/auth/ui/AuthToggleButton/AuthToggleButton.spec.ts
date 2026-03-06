import { describe, expect, it } from "vitest";
import { render, screen, userEvent, router } from "@/test/utils";
import AuthToggleButton from "./AuthToggleButton.vue";

describe("AuthToggleButton", () => {
	const user = userEvent.setup();

	it("рендерит кнопки Войти и Регистрация", () => {
		render(AuthToggleButton);
		expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Регистрация" })).toBeInTheDocument();
	});

	it("показывает Войти как выбранный на странице login", async () => {
		await router.push("/ru/auth/login");
		const { container } = render(AuthToggleButton);

		const loginButton = screen.getByRole("button", { name: "Войти" });
		expect(loginButton).toHaveAttribute("aria-selected", "true");
		expect(container.querySelector(".container")).toHaveAttribute("data-selected", "login");
	});

	it("показывает Регистрация как выбранный на странице signup", async () => {
		await router.push("/ru/auth/signup");
		const { container } = render(AuthToggleButton);

		const signupButton = screen.getByRole("button", { name: "Регистрация" });
		expect(signupButton).toHaveAttribute("aria-selected", "true");
		expect(container.querySelector(".container")).toHaveAttribute("data-selected", "signup");
	});

	it("переходит на login при клике на Войти", async () => {
		await router.push("/ru/auth/signup");
		render(AuthToggleButton);

		await user.click(screen.getByRole("button", { name: "Войти" }));

		expect(router.currentRoute.value.path).toBe("/ru/auth/login");
	});

	it("переходит на signup при клике на Регистрация", async () => {
		await router.push("/ru/auth/login");
		render(AuthToggleButton);

		await user.click(screen.getByRole("button", { name: "Регистрация" }));

		expect(router.currentRoute.value.path).toBe("/ru/auth/signup");
	});

	it("совпадает со snapshot на странице login", async () => {
		await router.push("/ru/auth/login");
		const { container } = render(AuthToggleButton);

		expect(container.innerHTML).toMatchSnapshot();
	});
});
