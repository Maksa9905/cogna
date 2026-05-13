import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import ui from "@nuxt/ui/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		ui({
			theme: {
				colors: ["primary", "error", "warning", 'success'],
			},
			ui: { colors: { primary: "purple"} },
		}),
	],
	resolve: {
		alias: {
			"@/": path.resolve(__dirname, "./src"),
			"@/entities": path.resolve(__dirname, "./src/entities"),
			"@/features": path.resolve(__dirname, "./src/features"),
			"@/pages": path.resolve(__dirname, "./src/pages"),
			"@/shared": path.resolve(__dirname, "./src/shared"),
			"@/widgets": path.resolve(__dirname, "./src/widgets"),
			"@/app": path.resolve(__dirname, "./src/app"),
			"@/test": path.resolve(__dirname, "./src/test"),
		},
	},
	server: {
		allowedHosts: ['www.cogna.ru'],
		host: "0.0.0.0",
		port: 5173,
	},
});
