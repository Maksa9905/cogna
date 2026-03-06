import "./styles/style.css";

import { createApp } from "vue";

import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import ui from "@nuxt/ui/vue-plugin";
import { setupI18n, getPreferredLocale } from "@/shared/i18n";

import App from "./App.vue";

const app = createApp(App);

setupI18n(app, getPreferredLocale());

app.use(router).use(VueQueryPlugin).use(ui).mount("#app");
