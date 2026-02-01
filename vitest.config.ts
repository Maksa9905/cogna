import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/": path.resolve(__dirname, "./src"),
			"@/entities": path.resolve(__dirname, "./src/entities"),
			"@/features": path.resolve(__dirname, "./src/features"),
			"@/pages": path.resolve(__dirname, "./src/pages"),
			"@/shared": path.resolve(__dirname, "./src/shared"),
			"@/widgets": path.resolve(__dirname, "./src/widgets"),
			"@/app": path.resolve(__dirname, "./src/app"),
		},
	},
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: "./vitest/setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"vitest/",
				"dist/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/mockData",
			],
		},
	},
});
