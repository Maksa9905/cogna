import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import ConfirmCodeForm from "./ConfirmCodeForm.vue";

describe("ConfirmCodeForm", () => {
	const user = userEvent.setup();

	it("не рендерит форму без email", () => {
		render(ConfirmCodeForm);
		expect(screen.queryByLabelText("Код подтверждения")).not.toBeInTheDocument();
	});

	it("рендерит форму при наличии email", () => {
		render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		expect(screen.getByLabelText("Код подтверждения")).toBeInTheDocument();
	});

	it("рендерит плейсхолдер", () => {
		render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		expect(screen.getByPlaceholderText("Введите код из письма")).toBeInTheDocument();
	});

	it("рендерит кнопку отправки", () => {
		render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		expect(screen.getByRole("button", { name: "Подтвердить" })).toBeInTheDocument();
	});

	it("показывает ошибку валидации при пустой отправке", async () => {
		render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		await user.click(screen.getByRole("button", { name: "Подтвердить" }));
		expect(screen.getByText("Код подтверждения - обязательное поле")).toBeInTheDocument();
	});

	it("показывает ошибку при коде короче 6 символов", async () => {
		render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		await user.type(screen.getByPlaceholderText("Введите код из письма"), "12345");
		await user.click(screen.getByRole("button", { name: "Подтвердить" }));
		expect(screen.getByText("Код должен содержать минимум 6 символов")).toBeInTheDocument();
	});

	it("вызывает emit confirm с данными при валидной отправке", async () => {
		const { emitted } = render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});

		await user.type(screen.getByPlaceholderText("Введите код из письма"), "123456");
		await user.click(screen.getByRole("button", { name: "Подтвердить" }));

		expect(emitted("confirm")).toHaveLength(1);
		expect(emitted("confirm")[0]).toEqual([{ code: "123456" }]);
	});

	it("совпадает со snapshot", () => {
		const { container } = render(ConfirmCodeForm, {
			props: { email: "test@example.com" } as any,
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});
