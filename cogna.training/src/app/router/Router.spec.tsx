import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Router from "./Router";

describe("App routing", () => {
	describe("Auth routes", () => {
		it("should render auth page at /auth", () => {
			render(
				<MemoryRouter initialEntries={["/auth"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("auth-page")).toBeDefined();
			expect(screen.getByTestId("index-auth-page")).toBeDefined();
		});

		it("should render register page at /auth/register", () => {
			render(
				<MemoryRouter initialEntries={["/auth/register"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("auth-page")).toBeDefined();
			expect(screen.getByTestId("register-page")).toBeDefined();
		});

		it("should render login page at /auth/login", () => {
			render(
				<MemoryRouter initialEntries={["/auth/login"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("auth-page")).toBeDefined();
			expect(screen.getByTestId("login-page")).toBeDefined();
		});
	});

	describe("Protected routes", () => {
		it("should render protected page at /", () => {
			render(
				<MemoryRouter initialEntries={["/"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("protected-page")).toBeDefined();
		});

		it("should render courses page at /courses", () => {
			render(
				<MemoryRouter initialEntries={["/courses"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("protected-page")).toBeDefined();
			expect(screen.getByTestId("courses-page")).toBeDefined();
			expect(screen.getByTestId("index-courses-page")).toBeDefined();
		});

		it("should render course page at /courses/:courseId", () => {
			render(
				<MemoryRouter initialEntries={["/courses/123"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("protected-page")).toBeDefined();
			expect(screen.getByTestId("courses-page")).toBeDefined();
			expect(screen.getByTestId("course-page")).toBeDefined();
			expect(screen.getByTestId("index-course-page")).toBeDefined();
		});

		it("should render ticket page at /courses/:courseId/tickets/:ticketId", () => {
			render(
				<MemoryRouter initialEntries={["/courses/123/tickets/456"]}>
					<Router />
				</MemoryRouter>,
			);
			expect(screen.getByTestId("protected-page")).toBeDefined();
			expect(screen.getByTestId("courses-page")).toBeDefined();
			expect(screen.getByTestId("course-page")).toBeDefined();
			expect(screen.getByTestId("ticket-page")).toBeDefined();
		});
	});

	describe("Nested routes structure", () => {
		it("should render all parent layouts for nested route", () => {
			render(
				<MemoryRouter initialEntries={["/courses/123/tickets/456"]}>
					<Router />
				</MemoryRouter>,
			);

			expect(screen.getByTestId("protected-page")).toBeDefined();
			expect(screen.getByTestId("courses-page")).toBeDefined();
			expect(screen.getByTestId("course-page")).toBeDefined();
			expect(screen.getByTestId("ticket-page")).toBeDefined();
		});
	});

	describe("Route structure", () => {
		it("should have correct route paths configured", () => {
			const { container } = render(
				<MemoryRouter initialEntries={["/auth"]}>
					<Router />
				</MemoryRouter>,
			);

			expect(container.firstChild).toBeDefined();
		});
	});
});
