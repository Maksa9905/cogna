import { describe, expect, it, beforeEach } from "vitest";
import { h } from "vue";
import { render, screen, userEvent } from "@/test/utils";
import { useSession } from "./session";
import { tokenStorage } from "@/shared/api";

const TestWrapper = {
	setup() {
		const { isAuthenticated, saveTokens, clearSession } = useSession();
		return () =>
			h("div", {}, [
				h("span", { "data-testid": "authenticated" }, String(isAuthenticated.value)),
				h("button", {
					"data-testid": "save-tokens",
					onClick: () => saveTokens("access-123", "refresh-456"),
				}, "Save tokens"),
				h("button", {
					"data-testid": "clear-session",
					onClick: () => clearSession(),
				}, "Clear session"),
			]);
	},
};

describe("useSession", () => {
	beforeEach(() => {
		tokenStorage.clear();
	});

	it("isAuthenticated false при отсутствии токенов", () => {
		render(TestWrapper);
		expect(screen.getByTestId("authenticated").textContent).toBe("false");
	});

	it("saveTokens сохраняет токены и устанавливает isAuthenticated в true", async () => {
		render(TestWrapper);
		expect(screen.getByTestId("authenticated").textContent).toBe("false");

		await userEvent.click(screen.getByTestId("save-tokens"));

		expect(screen.getByTestId("authenticated").textContent).toBe("true");
		expect(tokenStorage.getAccessToken()).toBe("access-123");
		expect(tokenStorage.getRefreshToken()).toBe("refresh-456");
	});

	it("clearSession очищает токены и устанавливает isAuthenticated в false", async () => {
		tokenStorage.setAccessToken("access");
		tokenStorage.setRefreshToken("refresh");

		render(TestWrapper);
		expect(screen.getByTestId("authenticated").textContent).toBe("true");

		await userEvent.click(screen.getByTestId("clear-session"));

		expect(screen.getByTestId("authenticated").textContent).toBe("false");
		expect(tokenStorage.getAccessToken()).toBeNull();
		expect(tokenStorage.getRefreshToken()).toBeNull();
	});

	it("возвращает isAuthenticated, saveTokens и clearSession", () => {
		const StructureTest = {
			setup() {
				const result = useSession();
				return () =>
					h("div", { "data-testid": "structure" }, [
					h("span", { "data-has-auth": "isAuthenticated" in result ? "true" : "false" }),
					h("span", { "data-has-save": typeof result.saveTokens === "function" ? "true" : "false" }),
					h("span", { "data-has-clear": typeof result.clearSession === "function" ? "true" : "false" }),
					]);
			},
		};
		render(StructureTest);
		const el = screen.getByTestId("structure");
		expect(el.querySelector("[data-has-auth]")?.getAttribute("data-has-auth")).toBe("true");
		expect(el.querySelector("[data-has-save]")?.getAttribute("data-has-save")).toBe("true");
		expect(el.querySelector("[data-has-clear]")?.getAttribute("data-has-clear")).toBe("true");
	});
});
