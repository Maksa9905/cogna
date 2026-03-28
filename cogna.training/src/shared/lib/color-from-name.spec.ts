import { describe, expect, it } from "vitest";
import { getColorFromName } from "./color-from-name";

describe("getColorFromName", () => {
	it("возвращает linear-gradient с двумя hex-цветами", () => {
		const gradient = getColorFromName("Иван Петров");
		expect(gradient).toMatch(/^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
	});

	it("возвращает одинаковый градиент для одинаковых имён", () => {
		const gradient1 = getColorFromName("John Doe");
		const gradient2 = getColorFromName("John Doe");
		expect(gradient1).toBe(gradient2);
	});

	it("возвращает разные градиенты для разных имён", () => {
		const gradient1 = getColorFromName("Alice Smith");
		const gradient2 = getColorFromName("Bob Jones");
		expect(gradient1).not.toBe(gradient2);
	});

	it("обрабатывает пустые строки — возвращает градиент", () => {
		const gradient = getColorFromName("");
		expect(gradient).toMatch(/^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
	});

	it("trim пробелы в начале и конце", () => {
		const gradient1 = getColorFromName("  John Doe  ");
		const gradient2 = getColorFromName("John Doe");
		expect(gradient1).toBe(gradient2);
	});

	it("обрабатывает null/undefined как пустые строки", () => {
		const gradient = getColorFromName(null as unknown as string);
		expect(gradient).toMatch(/^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/);
	});
});
