import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import AuthTitle from "./AuthTitle.vue";

describe("AuthTitle", () => {
	it("рендерит как h1", () => {
		const { container } = render(AuthTitle, {
			slots: { default: "Заголовок" },
		});
		const heading = container.querySelector("h1");
		expect(heading).toBeInTheDocument();
		expect(heading?.tagName).toBe("H1");
	});

	it("рендерит слот по умолчанию", () => {
		render(AuthTitle, {
			slots: { default: "С возвращением! 👋" },
		});
		expect(screen.getByText("С возвращением! 👋")).toBeInTheDocument();
	});

	it("применяет класс title", () => {
		const { container } = render(AuthTitle, {
			slots: { default: "Заголовок" },
		});
		expect(container.querySelector("h1.title")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(AuthTitle, {
			slots: { default: "Создай аккаунт 🚀" },
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});
