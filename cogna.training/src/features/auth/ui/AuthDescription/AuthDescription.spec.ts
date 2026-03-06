import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import AuthDescription from "./AuthDescription.vue";

describe("AuthDescription", () => {
	it("рендерит как p", () => {
		const { container } = render(AuthDescription, {
			slots: { default: "Описание" },
		});
		const paragraph = container.querySelector("p");
		expect(paragraph).toBeInTheDocument();
		expect(paragraph?.tagName).toBe("P");
	});

	it("рендерит слот по умолчанию", () => {
		render(AuthDescription, {
			slots: { default: "Войди, чтобы продолжить подготовку" },
		});
		expect(screen.getByText("Войди, чтобы продолжить подготовку")).toBeInTheDocument();
	});

	it("применяет класс description", () => {
		const { container } = render(AuthDescription, {
			slots: { default: "Описание" },
		});
		expect(container.querySelector("p.description")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(AuthDescription, {
			slots: { default: "Первые шаги к пятёрке на сессии" },
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});
