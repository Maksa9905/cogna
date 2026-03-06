import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import AuthSeparator from "./AuthSeparator.vue";

describe("AuthSeparator", () => {
	it("рендерит текст или", () => {
		render(AuthSeparator);
		expect(screen.getByText("или")).toBeInTheDocument();
	});

	it("рендерит два hr", () => {
		const { container } = render(AuthSeparator);
		const hrElements = container.querySelectorAll("hr");
		expect(hrElements).toHaveLength(2);
	});

	it("применяет класс separator", () => {
		const { container } = render(AuthSeparator);
		expect(container.querySelector(".separator")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(AuthSeparator);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
