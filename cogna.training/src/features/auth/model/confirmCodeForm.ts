import { useForm } from "@tanstack/vue-form";

export type ConfirmCodeFormValues = {
	code: string;
};

type UseConfirmCodeFormOptions = {
	onSubmit: (values: ConfirmCodeFormValues) => void;
};

export const validateCode = (value: string) => {
	if (!value) return 'Код подтверждения - обязательное поле';
	if (value.length < 6) return 'Код должен содержать минимум 6 символов';
	return undefined;
};

export const useConfirmCodeForm = ({ onSubmit }: UseConfirmCodeFormOptions) => {
	const form = useForm({
		defaultValues: {
			code: "",
		} as ConfirmCodeFormValues,
		onSubmit: async (props) => {
			console.debug('submit');
			onSubmit(props.value);
		},
	});

	return { form, validators: {
		code: validateCode,
	}};
};
