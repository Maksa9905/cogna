import { useForm, type ObjectValue } from "@tanstack/vue-form";
import { EMAIL_REGEX } from "@/shared/lib/regex";
import type { LoginFormValues } from "./types";
import { useI18n } from "vue-i18n";

type UseLoginFormReturn = {
	onSubmit: (values: LoginFormValues) => void
}

export const useLoginForm = ({onSubmit}: UseLoginFormReturn) => {
	const { t } = useI18n();

	const validateEmail = (value: ObjectValue<never, LoginFormValues, 'email'>) => {
		if (!value) return t('validation.email.required');
		if (!value.match(EMAIL_REGEX)) return t('validation.email.invalid');
		return undefined;
	};
	
	const validatePassword = (value: ObjectValue<never, LoginFormValues, 'password'>) => {
		if (!value) return t('validation.password.required');
		return undefined;
	};

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		} as LoginFormValues,
		onSubmit: async (props) => {
			console.debug('submit'); 
			onSubmit(props.value);
		},
	});

	return { form, validators: {
		email: validateEmail,
		password: validatePassword,
	}}
};
