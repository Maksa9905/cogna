import type { SupportedLocale } from "@/shared/i18n";

export const localizedRoutes = (locale: SupportedLocale) => ({
	home: `/${locale}`,
	auth: `/${locale}/auth`,
	login: `/${locale}/auth/login`,
	signup: `/${locale}/auth/signup`,
	subject: (id: string) => `/${locale}/subjects/${id}`,
	ticket: (subjectId: string, ticketId: string) => `/${locale}/subjects/${subjectId}/tickets/${ticketId}`,
	subjects: `/${locale}/subjects`,
	tests: `/${locale}/tests`,
	statistics: `/${locale}/statistics`,
	settings: `/${locale}/settings`,
});

export const routes = {
	home: "/",
	auth: "/auth",
	login: "/auth/login",
	signup: "/auth/signup",
	subject: (id: string) => `/subjects/${id}`,
	ticket: (subjectId: string, ticketId: string) => `/subjects/${subjectId}/tickets/${ticketId}`,
	subjects: "/subjects",
	tests: "/tests",
	statistics: "/statistics",
	settings: "/settings",
};
