import { ref, readonly } from "vue";
import { tokenStorage } from "@/shared/api";

const authenticated = ref(tokenStorage.hasTokens());

export function useSession() {
	const saveTokens = (accessToken: string, refreshToken: string) => {
		tokenStorage.setAccessToken(accessToken);
		tokenStorage.setRefreshToken(refreshToken);
		authenticated.value = true;
	};

	const clearSession = () => {
		tokenStorage.clear();
		authenticated.value = false;
	};

	return {
		isAuthenticated: readonly(authenticated),
		saveTokens,
		clearSession,
	};
}
