import "./styles/index.css";

import { createApp } from "vue";

import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import ui from "@nuxt/ui/vue-plugin";
import { setupI18n, getPreferredLocale } from "@/shared/i18n";

import App from "./App.vue";

const FONT_WAIT_MS = 10_000;

async function waitForLato() {
	const load = document.fonts.load('400 16px "Lato"');
	const timeout = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("Lato font load timeout")), FONT_WAIT_MS);
	});
	try {
		await Promise.race([load, timeout]);
	} catch {
		/* монтируем приложение даже при ошибке сети / таймауте */
	}
}

void waitForLato().then(() => {
	const app = createApp(App);

	setupI18n(app, getPreferredLocale());

	app.use(router).use(VueQueryPlugin).use(ui).mount("#app");
});
