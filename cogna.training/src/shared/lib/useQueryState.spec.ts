import { render, router, userEvent } from "@/test/utils";
import { screen } from "@testing-library/vue";
import { defineComponent, h } from "vue";
import { describe, expect, it } from "vitest";
import { useQueryState } from "./useQueryState";

const Harness = defineComponent({
	setup() {
		const search = useQueryState("search");
		return () =>
			h("div", [
				h("span", { "data-testid": "search" }, search.value),
				h(
					"button",
					{
						type: "button",
						"data-testid": "set",
						onClick: () => {
							search.value = "next";
						},
					},
					"set",
				),
				h(
					"button",
					{
						type: "button",
						"data-testid": "clear",
						onClick: () => {
							search.value = "";
						},
					},
					"clear",
				),
			]);
	},
});

describe("useQueryState", () => {
	it("читает значение из query и записывает через replace", async () => {
		await router.push({ path: "/ru", query: { search: "hello" } });
		render(Harness);
		expect(screen.getByTestId("search").textContent).toBe("hello");

		const user = userEvent.setup();
		await user.click(screen.getByTestId("set"));
		expect(router.currentRoute.value.query.search).toBe("next");
		expect(screen.getByTestId("search").textContent).toBe("next");

		await user.click(screen.getByTestId("clear"));
		expect(router.currentRoute.value.query.search).toBeUndefined();
		expect(screen.getByTestId("search").textContent).toBe("");
	});
});
