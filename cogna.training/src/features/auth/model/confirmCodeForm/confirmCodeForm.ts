import { useForm, type ObjectValue } from "@tanstack/vue-form";
import { useI18n } from "vue-i18n";
import type { ConfirmCodeFormValues } from "../types";

type UseConfirmCodeFormOptions = {
	onSubmit: (values: ConfirmCodeFormValues) => void;
};

export const useConfirmCodeForm = ({ onSubmit }: UseConfirmCodeFormOptions) => {
	const { t } = useI18n();

	const validateCode = (value: ObjectValue<never, ConfirmCodeFormValues, "code">) => {
		if (!value) return t("validation.code.required");
		if (value.length < 6) return t("validation.code.minLength");
		return undefined;
	};

	const form = useForm({
		defaultValues: {
			code: "",
		} as ConfirmCodeFormValues,
		onSubmit: async (props) => {
			onSubmit(props.value);
		},
	});

	return {
		form,
		validators: {
			code: validateCode,
		},
	};
};
