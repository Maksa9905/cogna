export interface SignUpFormValues {
	email?: string;
	password?: string;
	repeatedPassword?: string;
	isAgree: boolean | 'indeterminate';
	faculty?: string;
}

export interface LoginFormValues {
	email?: string;
	password?: string;
	rememberMe?: boolean | "indeterminate";
}

export interface ConfirmCodeFormValues {
	code: string;
}
