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
 * Возвращает устойчивый, слегка затемнённый цвет по имени и фамилии.
 * Подходит для фона аватара: на нём хорошо смотрится белый текст.
 *
 * @param firstName — имя
 * @param lastName — фамилия
 * @returns цвет в формате #rrggbb
 */
export function getColorFromName(firstName: string, lastName: string): string {
	const str =
		`${(firstName ?? "").trim()} ${(lastName ?? "").trim()}`.trim() || "?";
	const hash = hashString(str);
	const h = hash % 360;
	const s = 52;
	const l = 36; // затемнённый тон для контраста с белым текстом
	return hslToHex(h, s, l);
}
