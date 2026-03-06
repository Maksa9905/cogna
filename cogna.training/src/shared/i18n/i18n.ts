import { createI18n, type I18n } from "vue-i18n";
import type { App } from "vue";

export const SUPPORTED_LOCALES = ["ru", "en", "de"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "ru";

export let i18n: I18n<
	Record<string, unknown>,
	Record<string, unknown>,
	Record<string, unknown>,
	SupportedLocale,
	false
>;

export function setupI18n(app: App, locale: SupportedLocale = DEFAULT_LOCALE) {
	i18n = createI18n({
		legacy: false,
		locale,
		fallbackLocale: DEFAULT_LOCALE,
		messages: {},
	});

	app.use(i18n);
	return i18n;
}

export function setI18nLanguage(locale: SupportedLocale) {
	if (!i18n) return;

	(i18n.global.locale as { value: SupportedLocale }).value = locale;
	document.querySelector("html")?.setAttribute("lang", locale);
}

export function getCurrentLocale(): SupportedLocale {
	if (!i18n) return DEFAULT_LOCALE;
	return (i18n.global.locale as { value: SupportedLocale }).value;
}

const loadedLocales: Set<string> = new Set();

export async function loadLocaleMessages(locale: SupportedLocale, namespace: string = "common") {
	const key = `${locale}:${namespace}`;

	if (loadedLocales.has(key)) {
		return;
	}

	try {
		const messages = await import(`../../locales/${locale}/${namespace}.json`);

		const currentMessages = i18n.global.messages.value[locale] || {};
		i18n.global.setLocaleMessage(locale, {
			...currentMessages,
			[namespace]: messages.default,
		});

		loadedLocales.add(key);
	} catch (error) {
		// biome-ignore lint: handling error
		console.error(`Failed to load locale messages: ${locale}/${namespace}`, error);
	}
}

export async function loadNamespaces(locale: SupportedLocale, namespaces: string[]) {
	await Promise.all(namespaces.map((ns) => loadLocaleMessages(locale, ns)));
}

export function isSupportedLocale(locale?: string): locale is SupportedLocale {
	return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function getPreferredLocale(): SupportedLocale {
	const browserLocales = navigator.languages || [navigator.language];

	for (const browserLocale of browserLocales) {
		const lang = browserLocale.split("-")[0]?.toLowerCase();
		if (isSupportedLocale(lang)) {
			return lang;
		}
	}

	return DEFAULT_LOCALE;
}

export function getLocaleFromPath(path: string): SupportedLocale | null {
	const match = path.match(/^\/([a-z]{2})(\/|$)/);
	if (match && isSupportedLocale(match[1])) {
		return match[1];
	}
	return null;
}

export function localizedPath(path: string, locale?: SupportedLocale): string {
	const targetLocale = locale || getCurrentLocale();
	const pathWithoutLocale = path.replace(/^\/[a-z]{2}(\/|$)/, "/");
	return `/${targetLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
}
