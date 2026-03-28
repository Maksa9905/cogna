const lazyPageLoaders = {
	home: () => import("@/pages/HomePage/HomePage.vue"),
	subject: () => import("@/pages/SubjectPage/SubjectPage.vue"),
	ticket: () => import("@/pages/TicketPage/TicketPage.vue"),
	authLayout: () => import("@/pages/AuthLayout/AuthLayout.vue"),
	login: () => import("@/pages/LoginPage/LoginPage.vue"),
	signup: () => import("@/pages/SignUpPage/SignUpPage.vue"),
} as const;

export type LazyPageRoute = keyof typeof lazyPageLoaders;

export class RouterUtils {
	private constructor() {}

	static loadPage(route: LazyPageRoute) {
		return lazyPageLoaders[route]();
	}
}
