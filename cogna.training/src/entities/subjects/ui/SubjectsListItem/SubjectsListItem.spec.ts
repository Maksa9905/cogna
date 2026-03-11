import { describe, expect, it } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import SubjectsListItem from "./SubjectsListItem.vue";

function defaultProps() {
	const now = new Date();
	const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
	const inFiveDays = new Date(now);
	inFiveDays.setDate(inFiveDays.getDate() + 5);
	return {
		title: "Экономика",
		progress: 7,
		learnedTickets: 10,
		totalTickets: 12,
		averageScore: 85,
		examinationDate: inFiveDays.toISOString(),
		latestLessonDate: tenMinAgo.toISOString(),
	};
}

describe("SubjectsListItem", () => {
	it("рендерит заголовок предмета", () => {
		render(SubjectsListItem, {
			props: defaultProps(),
		});
		expect(screen.getByText("Экономика")).toBeInTheDocument();
	});

	it("рендерит счётчик билетов и средний балл", () => {
		render(SubjectsListItem, {
			props: defaultProps(),
		});
		expect(screen.getByText("10 / 12 билетов")).toBeInTheDocument();
		expect(screen.getByText("Средний балл: 85%")).toBeInTheDocument();
	});

	it("рендерит прогресс в процентах в круге", () => {
		render(SubjectsListItem, {
			props: { ...defaultProps(), progress: 4 },
		});
		expect(screen.getByText("40%")).toBeInTheDocument();
	});

	it("рендерит текст последнего повторения и дней до экзамена", () => {
		render(SubjectsListItem, {
			props: defaultProps(),
		});
		expect(screen.getByText("Только что")).toBeInTheDocument();
		expect(screen.getByText(/5 .* до экзамена/)).toBeInTheDocument();
	});

	it("эмитит click при клике по элементу", async () => {
		const user = userEvent.setup();
		const { emitted } = render(SubjectsListItem, {
			props: defaultProps(),
		});
		await user.click(screen.getByRole("listitem"));
		expect(emitted("click")).toHaveLength(1);
	});

	it("применяет accentColor через CSS-переменную", () => {
		const { container } = render(SubjectsListItem, {
			props: { ...defaultProps(), accentColor: "rgb(255, 0, 0)" },
		});
		const item = container.querySelector(".subject-list-item") as HTMLElement;
		expect(item?.style.getPropertyValue("--accent-color")).toBe("rgb(255, 0, 0)");
	});

	it("не показывает LoaderIcon по умолчанию", () => {
		const { container } = render(SubjectsListItem, {
			props: defaultProps(),
		});
		expect(container.querySelector(".loader-icon")).not.toBeInTheDocument();
	});

	it("показывает LoaderIcon при isLoading", () => {
		const { container } = render(SubjectsListItem, {
			props: { ...defaultProps(), isLoading: true },
		});
		expect(container.querySelector(".loader-icon")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(SubjectsListItem, {
			props: defaultProps(),
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});
