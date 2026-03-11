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

function ruPluralRule(choice: number, choicesLength: number) {
	if (choice === 0) return 0;
	const teen = choice > 10 && choice < 20;
	const endsWithOne = choice % 10 === 1;
	if (!teen && endsWithOne) return 1;
	if (!teen && choice % 10 >= 2 && choice % 10 <= 4) return 2;
	return choicesLength < 4 ? 2 : 3;
}

export function setupI18n(app: App, locale: SupportedLocale = DEFAULT_LOCALE) {
	i18n = createI18n({
		legacy: false,
		locale,
		fallbackLocale: DEFAULT_LOCALE,
		messages: {},
		pluralizationRules: {
			ru: ruPluralRule,
		},
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
