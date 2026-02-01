import { Outlet } from "react-router-dom";

function AuthPage() {
	return (
		<div data-testid="auth-page">
			auth page
			<Outlet />
		</div>
	);
}

export default AuthPage;
