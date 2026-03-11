import { describe, expect, it, vi } from "vitest";
import {
	SubjectsListItemUtils,
	TimeSinceLastRepetitionType,
	type TimeSinceLastRepetition,
} from "./SubjectsListItem.utils";

describe("SubjectsListItemUtils", () => {
	describe("getRemainingDays", () => {
		it("возвращает 0 для сегодняшней даты", () => {
			const today = new Date("2025-03-15T12:00:00.000Z");
			vi.useFakeTimers();
			vi.setSystemTime(today);
			expect(SubjectsListItemUtils.getRemainingDays(today.toISOString())).toBe(0);
			vi.useRealTimers();
		});

		it("возвращает положительное число для будущей даты", () => {
			const future = new Date();
			future.setDate(future.getDate() + 5);
			expect(SubjectsListItemUtils.getRemainingDays(future.toISOString())).toBe(5);
		});

		it("возвращает положительное число для прошедшей даты (ceil по модулю)", () => {
			const past = new Date();
			past.setDate(past.getDate() - 3);
			expect(SubjectsListItemUtils.getRemainingDays(past.toISOString())).toBe(3);
		});
	});

	describe("getTimeSinceLastRepetition", () => {
		it("возвращает Recently, если прошло меньше 30 минут", () => {
			const now = new Date();
			const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(tenMinAgo.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Recently);
			expect(result.value).toBeNull();
		});

		it("возвращает Minutes с числом минут, если прошло от 30 до 60 минут", () => {
			const now = new Date();
			const fortyFiveMinAgo = new Date(now.getTime() - 45 * 60 * 1000);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(fortyFiveMinAgo.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Minutes);
			expect(result).toHaveProperty("value", 45);
		});

		it("возвращает Hours с числом часов, если прошло больше часа в тот же день", () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-03-15T14:00:00.000Z"));
			const twoHoursAgo = new Date("2025-03-15T12:00:00.000Z");
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(twoHoursAgo.toISOString());
			vi.useRealTimers();
			expect(result.type).toBe(TimeSinceLastRepetitionType.Hours);
			expect(result).toHaveProperty("value", 2);
		});

		it("возвращает Yesterday, если последнее повторение было вчера", () => {
			const now = new Date();
			const yesterday = new Date(now);
			yesterday.setDate(yesterday.getDate() - 1);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(yesterday.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Yesterday);
			expect(result.value).toBeNull();
		});

		it("возвращает Days с числом дней, если прошло от 2 до 30 дней", () => {
			const now = new Date();
			const fiveDaysAgo = new Date(now);
			fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(fiveDaysAgo.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Days);
			expect(result).toHaveProperty("value", 5);
		});

		it("возвращает Months с числом месяцев, если прошло больше 30 дней", () => {
			const now = new Date();
			const fortyDaysAgo = new Date(now);
			fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(fortyDaysAgo.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Months);
			expect(result).toHaveProperty("value", 1); // floor(40/30)
		});

		it("возвращает Recently для даты в будущем", () => {
			const future = new Date();
			future.setHours(future.getHours() + 1);
			const result = SubjectsListItemUtils.getTimeSinceLastRepetition(future.toISOString());
			expect(result.type).toBe(TimeSinceLastRepetitionType.Recently);
			expect(result.value).toBeNull();
		});
	});

	describe("getLastRepetitionMessage", () => {
		it("возвращает ключ без n для Recently и Yesterday", () => {
			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: null,
					type: TimeSinceLastRepetitionType.Recently,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.recently" });

			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: null,
					type: TimeSinceLastRepetitionType.Yesterday,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.yesterday" });
		});

		it("возвращает ключ и n для Minutes, Hours, Days, Months", () => {
			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: 45,
					type: TimeSinceLastRepetitionType.Minutes,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.minutes", n: 45 });

			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: 2,
					type: TimeSinceLastRepetitionType.Hours,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.hours", n: 2 });

			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: 5,
					type: TimeSinceLastRepetitionType.Days,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.days", n: 5 });

			expect(
				SubjectsListItemUtils.getLastRepetitionMessage({
					value: 2,
					type: TimeSinceLastRepetitionType.Months,
				} as TimeSinceLastRepetition),
			).toEqual({ key: "subjects.lastRepetition.months", n: 2 });
		});
	});
});
