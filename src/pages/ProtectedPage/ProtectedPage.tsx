import { Outlet } from "react-router-dom";

function ProtectedPage() {
	return (
		<>
			protected page
			<Outlet />
		</>
	);
}

export default ProtectedPage;
