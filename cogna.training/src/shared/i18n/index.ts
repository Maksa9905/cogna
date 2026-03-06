export {
	i18n,
	setupI18n,
	loadLocaleMessages,
	loadNamespaces,
	setI18nLanguage,
	getCurrentLocale,
	getPreferredLocale,
	getLocaleFromPath,
	localizedPath,
	isSupportedLocale,
	SUPPORTED_LOCALES,
	DEFAULT_LOCALE,
} from "./i18n.ts";
export type { SupportedLocale } from "./i18n.ts";
export { useLocalizedRouter } from "./useLocalizedRouter";
