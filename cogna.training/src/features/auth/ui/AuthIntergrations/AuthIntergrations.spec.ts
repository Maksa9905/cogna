import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import AuthIntergrations from "./AuthIntergrations.vue";

describe("AuthIntergrations", () => {
	it("рендерит кнопку Google", () => {
		render(AuthIntergrations);
		expect(screen.getByRole("button", { name: /Google/ })).toBeInTheDocument();
	});

	it("рендерит кнопку GitHub", () => {
		render(AuthIntergrations);
		expect(screen.getByRole("button", { name: /GitHub/ })).toBeInTheDocument();
	});

	it("применяет класс integrations", () => {
		const { container } = render(AuthIntergrations);
		expect(container.querySelector(".integrations")).toBeInTheDocument();
	});

	it("рендерит две кнопки", () => {
		const { container } = render(AuthIntergrations);
		const buttons = container.querySelectorAll("button");
		expect(buttons).toHaveLength(2);
	});

	it("совпадает со snapshot", () => {
		const { container } = render(AuthIntergrations);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
