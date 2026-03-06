import { GraphQLClient } from "graphql-request";
import { tokenStorage } from "./tokenStorage";

const API_BASE =
	(typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
	"http://dev.cogna.localhost/api";
const API_URL = `${API_BASE.replace(/\/$/, "")}/graphql`;

const REFRESH_MUTATION = `
  mutation RefreshTokens {
    refreshTokens {
      accessToken
      refreshToken
    }
  }
`;

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
	const refreshToken = tokenStorage.getRefreshToken();
	if (!refreshToken) return false;

	try {
		const data = await new GraphQLClient(API_URL, {
			headers: { Authorization: `Bearer ${refreshToken}` },
		}).request<{
			refreshTokens: { accessToken: string; refreshToken: string };
		}>(REFRESH_MUTATION);

		tokenStorage.setAccessToken(data.refreshTokens.accessToken);
		tokenStorage.setRefreshToken(data.refreshTokens.refreshToken);
		return true;
	} catch {
		tokenStorage.clear();
		onAuthFailureCallback?.();
		return false;
	}
}

function tryRefresh(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = doRefresh().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}

function isUnauthorizedError(error: unknown): boolean {
	if (!(error instanceof Error)) return false;
	const msg = error.message;
	return msg.includes("Unauthorized") || msg.includes("401") || msg.includes("UNAUTHENTICATED");
}

function createClient(token?: string | null): GraphQLClient {
	const headers: Record<string, string> = {};
	if (token) headers.Authorization = `Bearer ${token}`;
	return new GraphQLClient(API_URL, { headers });
}

let onAuthFailureCallback: (() => void) | null = null;

export function onAuthFailure(callback: () => void) {
	onAuthFailureCallback = callback;
}

export async function authRequest<T>(
	document: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	try {
		return await createClient(tokenStorage.getAccessToken()).request<T>(document, variables);
	} catch (error) {
		if (!isUnauthorizedError(error)) throw error;

		const refreshed = await tryRefresh();
		if (!refreshed) throw error;

		return await createClient(tokenStorage.getAccessToken()).request<T>(document, variables);
	}
}

export function publicRequest<T>(
	document: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	return createClient().request<T>(document, variables);
}
