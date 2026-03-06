import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import SignUpForm from "./SignUpForm.vue";

describe("SignUpForm", () => {
	const user = userEvent.setup();

	it("рендерит поля формы", () => {
		render(SignUpForm);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
		expect(screen.getByLabelText("Подтвердите пароль")).toBeInTheDocument();
		expect(screen.getByLabelText("Факультет / Направление")).toBeInTheDocument();
	});

	it("рендерит плейсхолдеры", () => {
		render(SignUpForm);
		expect(screen.getByPlaceholderText("example@gmail.com")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Минимум 8 символов")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Подтвердите пароль")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Бизнес-информатика / Экономика")).toBeInTheDocument();
	});

	it("рендерит чекбокс согласия с условиями", () => {
		render(SignUpForm);
		expect(screen.getByText(/Я согласен с/)).toBeInTheDocument();
		expect(screen.getByText("условиями использования")).toBeInTheDocument();
		expect(screen.getByText("политикой конфиденциальности")).toBeInTheDocument();
	});

	it("рендерит кнопку отправки", () => {
		render(SignUpForm);
		expect(screen.getByRole("button", { name: "Зарегистрироваться" })).toBeInTheDocument();
	});

	it("показывает ошибку валидации при пустой отправке", async () => {
		render(SignUpForm);
		await user.click(screen.getByRole("button", { name: "Зарегистрироваться" }));
		expect(screen.getByText("Email - обязательное поле")).toBeInTheDocument();
		expect(screen.getByText("Пароль - обязательное поле")).toBeInTheDocument();
	});

	it("вызывает emit submit с данными при валидной отправке", async () => {
		const { emitted } = render(SignUpForm);

		await user.type(screen.getByPlaceholderText("example@gmail.com"), "test@example.com");
		await user.type(screen.getByPlaceholderText("Минимум 8 символов"), "password123");
		await user.type(screen.getByPlaceholderText("Подтвердите пароль"), "password123");
		await user.click(screen.getByRole("checkbox"));
		await user.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

		expect(emitted("submit")).toHaveLength(1);
		expect((emitted("submit")[0] as any)[0]).toMatchObject({
			email: "test@example.com",
			password: "password123",
			repeatedPassword: "password123",
			isAgree: true,
		});
	});

	it("совпадает со snapshot", () => {
		const { container } = render(SignUpForm);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
