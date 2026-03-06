import { render as tlRender, type RenderOptions } from "@testing-library/vue";
import { createI18n } from "vue-i18n";
import { createRouter, createMemoryHistory } from "vue-router";
import ui from "@nuxt/ui/vue-plugin";

const localeModules = import.meta.glob<Record<string, unknown>>(
	"../locales/*/*.json",
	{ eager: true, import: "default" },
);

const messages: Record<string, Record<string, unknown>> = {};

for (const [path, module] of Object.entries(localeModules)) {
	const match = path.match(/locales[/\\]([^/\\]+)[/\\]([^/\\]+)\.json/);
	const locale = match?.[1];
	const namespace = match?.[2];
	if (locale && namespace) {
		if (!messages[locale]) messages[locale] = {};
		messages[locale][namespace] = module;
	}
}

const i18n = createI18n({
	legacy: false,
	locale: "ru",
	fallbackLocale: "ru",
	messages: messages as Record<string, Record<string, string>>,
});

export const router = createRouter({
	history: createMemoryHistory(),
	routes: [
		{ path: "/", component: { template: "<div />" } },
		{
			path: "/:locale",
			component: { template: "<router-view />" },
			children: [
				{ path: "auth/login", component: { template: "<div />" } },
				{ path: "auth/signup", component: { template: "<div />" } },
				{ path: "", component: { template: "<div />" } },
			],
		},
	],
});

export function render<C>(
	component: C,
	options?: RenderOptions<C>,
) {
	return tlRender(component, {
		...options,
		global: {
			plugins: [i18n, router, ui],
			...options?.global,
		},
	});
}

export { screen, fireEvent } from "@testing-library/vue";
export { default as userEvent } from "@testing-library/user-event";
