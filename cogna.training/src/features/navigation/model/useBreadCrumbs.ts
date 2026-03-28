import { useRoute } from "vue-router";
import { computed } from "vue";
import { useLocalizedRouter } from "@/shared/i18n";
import { useSubjectFindOneQuery } from "@/entities/subjects";
import { useTicketFindOneQuery } from "@/entities/tickets";
import type { BreadcrumbItem } from "@nuxt/ui";

export const useBreadCrumbs = () => {
  const { params: { ticketId, subjectId } } = useRoute();
  const { routes } = useLocalizedRouter();

  const { data: subjectData, isLoading: isLoadingSubject } = useSubjectFindOneQuery({
    id: subjectId as string,
  }, Boolean(subjectId));

  const { data: ticketData, isLoading: isLoadingTicket } = useTicketFindOneQuery({
    id: ticketId as string,
  }, Boolean(ticketId));

  const subjectTitle = computed(() => subjectData.value?.subject.title);
  const ticketQuestion = computed(() => ticketData.value?.ticket?.question);

  const breadcrumbs = computed(() => {
    const result: BreadcrumbItem[] = [];

    if (isLoadingSubject.value || isLoadingTicket.value) return null;

    if (subjectTitle.value && subjectId) result.push({ label: subjectTitle.value, to: routes.value.subject(subjectId as string) });
    if (ticketQuestion.value && ticketId) result.push({ icon: 'i-lucide-file-text', label: ticketQuestion.value, to: routes.value.ticket(subjectId as string, ticketId as string) });

    const last = result[result.length - 1];
    if (last) last.to = undefined;

    return result;
  })

  return breadcrumbs;
}