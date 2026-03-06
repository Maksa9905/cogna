import { useI18n } from "vue-i18n";
import { getAuthErrorKey } from "./errors";

type ToastAdd = (options: { title: string; description: string; color: string; icon: string }) => void;

export function useAuthErrorHandler(handlerOptions?: { toast?: { add: ToastAdd } }) {
	const toast = handlerOptions?.toast ?? useToast();
	const { t } = useI18n();

	function handleError(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		const errorKey = getAuthErrorKey(message);

		const translationKey = errorKey ? `auth.error.${errorKey}` : "auth.error.unknown";

		toast.add({
			title: t("auth.error.title"),
			description: t(translationKey),
			color: "error",
			icon: "i-lucide-circle-x",
		});
	}

	return { handleError };
}
