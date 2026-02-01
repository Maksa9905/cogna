import { Route, Routes } from "react-router-dom";
import { AuthPage, IndexAuthPage } from "@/pages/AuthPage";
import { CoursePage, IndexCoursePage } from "@/pages/CoursePage";
import { CoursesPage, IndexCoursesPage } from "@/pages/CoursesPage";
import LoginPage from "@/pages/LoginPage";
import ProtectedPage from "@/pages/ProtectedPage";
import RegisterPage from "@/pages/RegisterPage";
import TicketPage from "@/pages/TicketPage";
import { routes } from "@/shared/router";

function Router() {
	fetch('/api/')

	return (
		<Routes>
			<Route path={routes.auth} element={<AuthPage />}>
				<Route index element={<IndexAuthPage />} />
				<Route path={routes.register} element={<RegisterPage />} />
				<Route path={routes.login} element={<LoginPage />} />
			</Route>
			<Route path={routes.protected} element={<ProtectedPage />}>
				<Route path={routes.courses} element={<CoursesPage />}>
					<Route index element={<IndexCoursesPage />} />
					<Route path={routes.courseById(":courseId")} element={<CoursePage />}>
						<Route index element={<IndexCoursePage />} />
						<Route
							path={routes.ticketById(":courseId", ":ticketId")}
							element={<TicketPage />}
						/>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default Router;
