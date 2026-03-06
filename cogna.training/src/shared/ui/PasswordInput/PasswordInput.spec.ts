import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import PasswordInput from "./PasswordInput.vue";

function getInput(container: Element) {
	return container.querySelector<HTMLInputElement>("input");
}

describe("PasswordInput", () => {
	const user = userEvent.setup();

	it("рендерит input с type password по умолчанию", () => {
		const { container } = render(PasswordInput);
		const input = getInput(container);
		expect(input).toHaveAttribute("type", "password");
	});

	it("переключает видимость пароля по клику на кнопку", async () => {
		const { container } = render(PasswordInput);
		const toggleButton = screen.getByRole("button", { name: "Show password" });
		const input = getInput(container)!;

		expect(input).toHaveAttribute("type", "password");

		await user.click(toggleButton);
		expect(input).toHaveAttribute("type", "text");
		expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Hide password" }));
		expect(input).toHaveAttribute("type", "password");
	});

	it("поддерживает v-model", async () => {
		const TestWrapper = {
			components: { PasswordInput },
			template: `
				<PasswordInput v-model="value" />
				<span data-testid="value">{{ value }}</span>
			`,
			data: () => ({ value: "" }),
		};

		const { container } = render(TestWrapper);
		const input = getInput(container)!;
		await user.type(input, "secret123");
		expect(screen.getByTestId("value").textContent).toBe("secret123");
	});

	it("совпадает со snapshot", () => {
		const { container } = render(PasswordInput);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
