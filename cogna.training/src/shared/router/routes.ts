export const routes = {
	protected: "/",
	auth: "/auth",
	register: "/auth/register",
	login: "/auth/login",
	courses: "/courses",
	courseById: (courseId: string) => `/courses/${courseId}`,
	"123": "123",
	ticketById: (courseId: string, ticketId: string) =>
		`/courses/${courseId}/tickets/${ticketId}`,
} as const;
