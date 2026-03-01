export interface RegisterMutationPayload {
	email: string;
	password: string;
}

export interface RegisterMutationResponse {
	register: {
		ok: boolean;
	};
}

export interface ConfirmRegisterMutationPayload {
	email: string;
	otp: number;
}

export interface ConfirmRegisterMutationResponse {
	confirmRegister: {
		refreshToken: string;
		accessToken: string;
	};
}

export interface LoginMutationPayload {
	email: string;
	password: string;
}

export interface LoginMutationResponse {
	login: {
		accessToken: string;
		refreshToken: string;
	};
}

export interface LogoutMutationResponse {
	logout: {
		ok: boolean;
	};
}
