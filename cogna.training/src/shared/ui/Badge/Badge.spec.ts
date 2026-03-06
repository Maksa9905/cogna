import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import Badge from "./Badge.vue";

describe("Badge", () => {
	it("рендерит слот по умолчанию", () => {
		render(Badge, { slots: { default: "Тест" } });
		expect(screen.getByText("Тест")).toBeInTheDocument();
	});

	it("использует variant filled по умолчанию", () => {
		const { container } = render(Badge, {
			slots: { default: "Badge" },
		});
		expect(container.querySelector(".filled")).toBeInTheDocument();
	});

	it("применяет variant transparent при передаче", () => {
		const { container } = render(Badge, {
			props: { variant: "transparent" } as any,
			slots: { default: "Badge" },
		});

		expect(container.querySelector(".transparent")).toBeInTheDocument();
	});

	it("применяет variant filled при передаче", () => {
		const { container } = render(Badge, {
			props: { variant: "filled" } as any,
			slots: { default: "Badge" },
		});

		expect(container.querySelector(".filled")).toBeInTheDocument();
	})

	it("совпадает со snapshot для filled", () => {
		const { container } = render(Badge, {
			slots: { default: "Badge" },
		});
		expect(container.innerHTML).toMatchSnapshot();
	});

	it("совпадает со snapshot для transparent", () => {
		const { container } = render(Badge, {
			props: { variant: "transparent" } as any,
			slots: { default: "Badge" },
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});
