import AuthLayout from "@/pages/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import { tokenStorage, onAuthFailure } from "@/shared/api";
import { localizedRoutes } from "@/shared/router/routes";
import {
	setI18nLanguage,
	loadNamespaces,
	getPreferredLocale,
	getLocaleFromPath,
	isSupportedLocale,
	type SupportedLocale,
} from "@/shared/i18n";

import { createWebHistory, createRouter, type RouteRecordRaw } from "vue-router";

const localizedRouteConfig: RouteRecordRaw[] = [
	{
		path: "/:locale",
		children: [
			{
				path: "",
				meta: { requiresAuth: true, namespaces: ["common", "subjects"] },
				component: () => import("@/pages/HomePage/HomePage.vue"),
			},
			{
				path: "auth",
				component: AuthLayout,
				meta: {
					requiresGuest: true,
					namespaces: ["auth", "validation", "common"],
				},
				children: [
					{ path: "login", component: LoginPage },
					{ path: "signup", component: SignUpPage },
				],
			},
		],
	},
];

const routeConfig: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: () => {
			const preferredLocale = getPreferredLocale();
			return `/${preferredLocale}`;
		},
	},
	...localizedRouteConfig,
	{
		path: "/:pathMatch(.*)*",
		redirect: (to) => {
			const pathMatch = to.params.pathMatch;
			const fullPath = "/" + (Array.isArray(pathMatch) ? pathMatch.join("/") : pathMatch);
			const preferredLocale = getPreferredLocale();
			return `/${preferredLocale}${fullPath}`;
		},
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes: routeConfig,
});

router.beforeEach(async (to) => {
	const localeParam = to.params.locale as string;

	if (localeParam && isSupportedLocale(localeParam)) {
		setI18nLanguage(localeParam);

		const namespaces = (to.meta.namespaces as string[]) || ["common"];
		await loadNamespaces(localeParam, namespaces);
	}

	const isAuthenticated = tokenStorage.hasTokens();
	const currentLocale = (localeParam as SupportedLocale) || getPreferredLocale();

	if (to.meta.requiresAuth && !isAuthenticated) {
		return localizedRoutes(currentLocale).login;
	}

	if (to.meta.requiresGuest && isAuthenticated) {
		return localizedRoutes(currentLocale).home;
	}
});

onAuthFailure(() => {
	const locale = getLocaleFromPath(window.location.pathname) || getPreferredLocale();
	router.push(localizedRoutes(locale).login);
});
