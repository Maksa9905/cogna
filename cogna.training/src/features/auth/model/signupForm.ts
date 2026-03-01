import { useForm, type ObjectValue } from "@tanstack/vue-form";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/shared/lib/regex";
import type { SignUpFormValues } from "./types";
import { useI18n } from "vue-i18n";

type UseSignupFormOptions = {
	onSubmit: (values: SignUpFormValues) => void;
};

export const useSignupForm = ({ onSubmit }: UseSignupFormOptions) => {
	const { t } = useI18n();

	const validateEmail = (value: ObjectValue<never, SignUpFormValues, "email">) => {
		if (!value) return t("validation.email.required");
		if (!value.match(EMAIL_REGEX)) return t("validation.email.invalid");
		return undefined;
	};

	const validatePassword = (value: ObjectValue<never, SignUpFormValues, "password">) => {
		if (!value) return t("validation.password.required");
		if (!value.match(PASSWORD_REGEX)) return t("validation.password.minLength");
		return undefined;
	};

	const validateRepeatedPassword = (
		password: ObjectValue<never, SignUpFormValues, "password">,
		repeatedPassword: ObjectValue<never, SignUpFormValues, "repeatedPassword">,
	) => {
		if (!repeatedPassword) return t("validation.confirmPassword.required");
		if (password !== repeatedPassword) return t("validation.confirmPassword.mismatch");
		return undefined;
	};

	const validateIsAgree = (value: ObjectValue<never, SignUpFormValues, "isAgree">) => {
		if (!value) return t("validation.terms.required");
		return undefined;
	};

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			repeatedPassword: "",
			isAgree: false,
			faculty: "",
		} as SignUpFormValues,
		onSubmit: async (props) => {
			onSubmit(props.value);
		},
	});

	return {
		form,
		validators: {
			email: validateEmail,
			password: validatePassword,
			repeatedPassword: validateRepeatedPassword,
			isAgree: validateIsAgree,
		},
	};
};
