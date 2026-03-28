/**
 * Хэширует строку в число (djb2-подобный).
 */
function hashString(str: string): number {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 33) ^ str.charCodeAt(i);
	}
	return hash >>> 0;
}

/**
 * Конвертирует HSL в hex.
 * h — 0..360, s и l — 0..100.
 */
function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Возвращает устойчивый градиент по имени.
 * Подходит для фона аватара: на нём хорошо смотрится белый текст.
 *
 * @param name — имя (например, "Иван Петров")
 * @returns CSS linear-gradient, например linear-gradient(135deg, #1a2b3c, #4d5e6f)
 */
export function getColorFromName(name: string): string {
	const normalized = (name ?? "").trim();
	const hash = hashString(normalized);
	const h = hash % 360;
	const s = 52;
	const lDark = 28; // тёмный оттенок
	const lLight = 44; // светлый оттенок того же тона
	const color1 = hslToHex(h, s, lDark);
	const color2 = hslToHex(h, s, lLight);
	return `linear-gradient(135deg, ${color1}, ${color2})`;
}
