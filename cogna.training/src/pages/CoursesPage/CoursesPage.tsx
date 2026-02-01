import { Outlet } from "react-router-dom";

function CoursesPage() {
	return (
		<div data-testid="courses-page">
			courses page
			<Outlet />
		</div>
	);
}

export default CoursesPage;
