import { describe, expect, it } from "vitest";
import { getColorFromName } from "./color-from-name";

describe("getColorFromName", () => {
	it("возвращает hex-цвет в формате #rrggbb", () => {
		const color = getColorFromName("Иван", "Петров");
		expect(color).toMatch(/^#[0-9a-f]{6}$/);
	});

	it("возвращает одинаковый цвет для одинаковых имён", () => {
		const color1 = getColorFromName("John", "Doe");
		const color2 = getColorFromName("John", "Doe");
		expect(color1).toBe(color2);
	});

	it("возвращает разные цвета для разных имён", () => {
		const color1 = getColorFromName("Alice", "Smith");
		const color2 = getColorFromName("Bob", "Jones");
		expect(color1).not.toBe(color2);
	});

	it("обрабатывает пустые строки — использует fallback", () => {
		const color = getColorFromName("", "");
		expect(color).toMatch(/^#[0-9a-f]{6}$/);
	});

	it("trim пробелы в начале и конце", () => {
		const color1 = getColorFromName("  John  ", "  Doe  ");
		const color2 = getColorFromName("John", "Doe");
		expect(color1).toBe(color2);
	});

	it("обрабатывает null/undefined как пустые строки", () => {
		const color = getColorFromName(null as unknown as string, undefined as unknown as string);
		expect(color).toMatch(/^#[0-9a-f]{6}$/);
	});
});
