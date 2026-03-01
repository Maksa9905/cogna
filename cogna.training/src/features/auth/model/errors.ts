export const AUTH_ERROR_MESSAGES = {
	USER_ALREADY_REGISTERED: "user already registered",
	REDIS_DATA_NOT_FOUND: "redis data not found",
	INVALID_OTP: "invalid otp",
	USER_NOT_FOUND: "user not found",
	PASSWORD_NOT_VALID: "password not valid",
	REFRESH_TOKEN_NOT_FOUND: "refresh token not found",
	TOKEN_BELONGS_ANOTHER_USER: "the token belongs another user",
	USER_DOES_NOT_BELONG_REFRESH_TOKEN: "user does not belong refresh token",
} as const;

export type AuthErrorMessage = (typeof AUTH_ERROR_MESSAGES)[keyof typeof AUTH_ERROR_MESSAGES];

export function getAuthErrorKey(message: string): string | null {
	const errorMap: Record<string, string> = {
		[AUTH_ERROR_MESSAGES.USER_ALREADY_REGISTERED]: "userAlreadyRegistered",
		[AUTH_ERROR_MESSAGES.REDIS_DATA_NOT_FOUND]: "codeExpired",
		[AUTH_ERROR_MESSAGES.INVALID_OTP]: "invalidOtp",
		[AUTH_ERROR_MESSAGES.USER_NOT_FOUND]: "userNotFound",
		[AUTH_ERROR_MESSAGES.PASSWORD_NOT_VALID]: "invalidPassword",
		[AUTH_ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND]: "sessionExpired",
		[AUTH_ERROR_MESSAGES.TOKEN_BELONGS_ANOTHER_USER]: "sessionInvalid",
		[AUTH_ERROR_MESSAGES.USER_DOES_NOT_BELONG_REFRESH_TOKEN]: "sessionInvalid",
	};

	const lowerMessage = message.toLowerCase();

	for (const [key, value] of Object.entries(errorMap)) {
		if (lowerMessage.includes(key.toLowerCase())) {
			return value;
		}
	}

	return null;
}
