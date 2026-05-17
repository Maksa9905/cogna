import { useRoute } from "vue-router";
import { computed } from "vue";
import { useLocalizedRouter } from "@/shared/i18n";
import { useSubjectFindOneQuery } from "@/entities/subjects";
import { useTicketFindOneQuery } from "@/entities/tickets";
import type { BreadcrumbItem } from "@nuxt/ui";

export const useBreadCrumbs = () => {
	const route = useRoute();
	const { routes } = useLocalizedRouter();

	const subjectId = computed(() => route.params.subjectId as string);
	const ticketId = computed(() => route.params.ticketId as string);

	const { data: subjectData, isLoading: isLoadingSubject } = useSubjectFindOneQuery(subjectId)
	const { data: ticketData, isLoading: isLoadingTicket } = useTicketFindOneQuery(ticketId);

	const subjectTitle = computed(() => subjectData.value?.subject.title);
	const ticketQuestion = computed(() => ticketData.value?.ticket?.question);

	const breadcrumbs = computed(() => {
		const result: BreadcrumbItem[] = [];

		if (isLoadingSubject.value || isLoadingTicket.value) return null;

		if (subjectTitle.value && subjectId)
			result.push({ 
				label: subjectTitle.value, 
				to: routes.value.subject(subjectId.value) 
			});
		if (ticketQuestion.value && ticketId)
			result.push({
				icon: "i-lucide-file-text",
				label: ticketQuestion.value,
				to: routes.value.ticket(subjectId.value, ticketId.value),
			});

		const last = result[result.length - 1];
		if (last) last.to = undefined;

		return result;
	});

	return breadcrumbs;
};
