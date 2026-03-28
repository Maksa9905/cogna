import { useSubjectFindAllQuery } from "@/entities/subjects";
import { useLocalizedRouter } from "@/shared/i18n";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default function useSideBarItems() {
	const { t } = useI18n();

	const { data } = useSubjectFindAllQuery();
	const { routes } = useLocalizedRouter();

	const items = computed(() => [
		[
			{
				label: t("menu.subjects"),
				icon: "i-lucide-book",
				to: routes.value.home,
				defaultOpen: true,
				children: [
					...(data?.value?.subjects.map((subject) => ({
						label: subject.title,
						icon: "i-lucide-file-text",
						to: routes.value.subject(subject.id),
					})) ?? []),
					{
						label: t("menu.createSubject"),
						color: "primary",
						icon: "i-lucide-plus",
						to: routes.value.subject("create"),
					},
				],
			},
			{
				label: t("menu.tests"),
				icon: "i-lucide-clipboard-list",
				to: routes.value.tests,
			},
			{ label: t("menu.statistics"), icon: "i-lucide-bar-chart", to: routes.value.statistics },
		],
		[
			{ label: t("menu.settings"), icon: "i-lucide-settings", to: routes.value.settings },
			{
				label: t("menu.help"),
				icon: "i-lucide-help-circle",
				external: true,
				href: "https://t.me/hakolr",
			},
		],
	]);

	return items;
}