import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import OnboardingAside from "./OnboardingAside.vue";

describe("OnboardingAside", () => {
	it("рендерит заголовок", () => {
		render(OnboardingAside);
		expect(screen.getByText("Готовься умнее,")).toBeInTheDocument();
		expect(screen.getByText("сдавай лучше")).toBeInTheDocument();
	});

	it("рендерит AI badge", () => {
		render(OnboardingAside);
		expect(screen.getByText("AI-powered подготовка к сессии")).toBeInTheDocument();
	});

	it("рендерит описание", () => {
		render(OnboardingAside);
		expect(
			screen.getByText(
				"Cogna помогает студентам учить билеты по науке о памяти — интервальное повторение, активное вспоминание и AI-проверка ответов.",
			),
		).toBeInTheDocument();
	});

	it("рендерит список фич", () => {
		render(OnboardingAside);
		expect(screen.getByText("Умные билеты")).toBeInTheDocument();
		expect(screen.getByText("AI-проверка")).toBeInTheDocument();
		expect(screen.getByText("Интервальное повторение")).toBeInTheDocument();
	});

	it("рендерит описания фич", () => {
		render(OnboardingAside);
		expect(
			screen.getByText("Создавай структурированные конспекты с формулами, схемами и таблицами"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Нейросеть анализирует твой ответ и указывает на пробелы"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Алгоритм напоминает о билетах в момент, когда они начинают забываться"),
		).toBeInTheDocument();
	});

	it("рендерит блок с количеством пользователей", () => {
		render(OnboardingAside);
		expect(screen.getByText("12 000+ студентов")).toBeInTheDocument();
		expect(screen.getByText("уже готовятся с Cogna")).toBeInTheDocument();
	});

	it("рендерит логотип Cogna", () => {
		render(OnboardingAside);
		expect(screen.getByText("Cogna")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(OnboardingAside);
		expect(container.innerHTML).toMatchSnapshot();
	});
});
