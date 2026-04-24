import { tokenStorage, onAuthFailure } from "@/shared/api";
import { RouterUtils } from "@/shared/router";
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
import BaseLayout from "@/pages/BaseLayout";

const localizedRouteConfig: RouteRecordRaw[] = [
	{
		path: "/:locale",
		children: [
			{
				path: "",
				component: BaseLayout,
				children: [
					{
						path: "",
						component: () => RouterUtils.loadPage("home"),
						meta: {
							requiresAuth: true,
							namespaces: ["common", "subjects", "tickets", "user", "menu"],
						},
					},
					{
						path: "subjects/:subjectId",
						component: () => RouterUtils.loadPage("subject"),
						meta: {
							requiresAuth: true,
							namespaces: ["common", "subjects", "tickets", "user", "menu"],
						},
					},
					{
						path: "subjects/:subjectId/tickets/:ticketId",
						component: () => RouterUtils.loadPage("ticket"),
						meta: {
							requiresAuth: true,
							namespaces: ["common", "subjects", "tickets", "user", "menu"],
						},
					},
					{
						path: "subjects/:subjectId/tickets/:ticketId/reproduce",
						component: () => RouterUtils.loadPage("reproduceTicket"),
						meta: {
							requiresAuth: true,
							namespaces: ["common", "subjects", "tickets", "user", "menu"],
						}
					}
				],
			},
			{
				path: "auth",
				component: () => RouterUtils.loadPage("authLayout"),
				children: [
					{
						path: "login",
						meta: { namespaces: ["auth", "validation", "common"] },
						component: () => RouterUtils.loadPage("login"),
					},
					{
						path: "signup",
						meta: { namespaces: ["auth", "validation", "common"] },
						component: () => RouterUtils.loadPage("signup"),
					},
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
