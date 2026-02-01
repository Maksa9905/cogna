import { Outlet } from "react-router-dom";

function CoursePage() {
	return (
		<div data-testid="course-page">
			course page
			<Outlet />
		</div>
	);
}

export default CoursePage;
