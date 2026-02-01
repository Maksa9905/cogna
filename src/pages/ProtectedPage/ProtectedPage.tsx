import { Outlet } from "react-router-dom";

function ProtectedPage() {
	return (
		<div data-testid="protected-page">
			protected page
			<Outlet />
		</div>
	);
}

export default ProtectedPage;
