import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import LoginForm from "./LoginForm.vue";

describe("LoginForm", () => {
	const user = userEvent.setup();

	it("рендерит поля формы", () => {
		render(LoginForm);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
		expect(screen.getByText("Запомнить меня")).toBeInTheDocument();
	});

	it("рендерит плейсхолдеры", () => {
		render(LoginForm);
		expect(screen.getByPlaceholderText("example@yandex.ru")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Введите пароль")).toBeInTheDocument();
	});

	it("рендерит кнопку отправки", () => {
		render(LoginForm);
		expect(screen.getByRole("button", { name: "Войти в Cogna" })).toBeInTheDocument();
	});

	it("показывает ошибку валидации при пустой отправке", async () => {
		render(LoginForm);
		await user.click(screen.getByRole("button", { name: "Войти в Cogna" }));
		expect(screen.getByText("Email - обязательное поле")).toBeInTheDocument();
		expect(screen.getByText("Пароль - обязательное поле")).toBeInTheDocument();
	});

	it("вызывает emit submit с данными при валидной отправке", async () => {
		const { emitted } = render(LoginForm);

		await user.type(screen.getByPlaceholderText("example@yandex.ru"), "test@example.com");
		await user.type(screen.getByPlaceholderText("Введите пароль"), "password123");
		await user.click(screen.getByRole("button", { name: "Войти в Cogna" }));

		expect(emitted("submit")).toHaveLength(1);
		expect(emitted("submit")[0]).toEqual([
			{
				email: "test@example.com",
				password: "password123",
				rememberMe: false,
			},
		]);
	});

	it("передаёт rememberMe при отмеченном чекбоксе", async () => {
		const { emitted } = render(LoginForm);

		await user.type(screen.getByPlaceholderText("example@yandex.ru"), "test@example.com");
		await user.type(screen.getByPlaceholderText("Введите пароль"), "password123");
		await user.click(screen.getByLabelText("Запомнить меня"));
		await user.click(screen.getByRole("button", { name: "Войти в Cogna" }));

		expect(emitted("submit")).toHaveLength(1);
		expect((emitted("submit")[0] as any)[0]).toMatchObject({ rememberMe: true });
	});

	it("совпадает со snapshot", () => {
		const { container } = render(LoginForm);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
