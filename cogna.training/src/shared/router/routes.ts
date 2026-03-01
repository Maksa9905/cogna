import type { SupportedLocale } from "@/shared/i18n";

export const localizedRoutes = (locale: SupportedLocale) => ({
	home: `/${locale}`,
	auth: `/${locale}/auth`,
	login: `/${locale}/auth/login`,
	signup: `/${locale}/auth/signup`,
});

export const routes = {
	home: "/",
	auth: "/auth",
	login: "/auth/login",
	signup: "/auth/signup",
};
