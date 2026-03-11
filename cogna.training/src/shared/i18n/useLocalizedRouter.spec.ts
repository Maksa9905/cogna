import { describe, expect, it } from "vitest";
import { h } from "vue";
import { render, screen, userEvent, router } from "@/test/utils";
import { useLocalizedRouter } from "./useLocalizedRouter";

const TestWrapper = {
	setup() {
		const { currentLocale, switchLocale, availableLocales, routes } = useLocalizedRouter();
		return () =>
			h("div", [
				h("span", { "data-testid": "locale" }, currentLocale.value),
				h("span", { "data-testid": "available" }, availableLocales.join(",")),
				h("span", { "data-testid": "login-route" }, routes.value.login),
				h(
					"button",
					{
						"data-testid": "switch-en",
						onClick: () => switchLocale("en"),
					},
					"Switch to EN",
				),
				h(
					"button",
					{
						"data-testid": "switch-de",
						onClick: () => switchLocale("de"),
					},
					"Switch to DE",
				),
			]);
	},
};

describe("useLocalizedRouter", () => {
	const user = userEvent.setup();

	it("возвращает currentLocale из params при маршруте с локалью", async () => {
		await router.push("/ru/auth/login");
		render(TestWrapper);
		expect(screen.getByTestId("locale").textContent).toBe("ru");
	});

	it("возвращает localized routes для текущей локали", async () => {
		await router.push("/ru/auth/login");
		render(TestWrapper);
		expect(screen.getByTestId("login-route").textContent).toBe("/ru/auth/login");
	});

	it("возвращает availableLocales", () => {
		render(TestWrapper);
		expect(screen.getByTestId("available").textContent).toBe("ru,en,de");
	});

	it("switchLocale переводит на путь с новой локалью", async () => {
		await router.push("/ru/auth/login");
		render(TestWrapper);

		await user.click(screen.getByTestId("switch-en"));

		expect(router.currentRoute.value.path).toBe("/en/auth/login");
	});

	it("switchLocale сохраняет путь при смене локали", async () => {
		await router.push("/ru/auth/signup");
		render(TestWrapper);

		await user.click(screen.getByTestId("switch-de"));

		expect(router.currentRoute.value.path).toBe("/de/auth/signup");
	});
});
