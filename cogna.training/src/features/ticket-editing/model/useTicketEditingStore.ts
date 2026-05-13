import { useTicketFindOneQuery, type Thesis } from "@/entities/tickets";
import { ref, watchEffect, type Ref } from "vue";

type UseTicketEditingStoreProps = {
	id: string;
};

export type TicketEditingStore = {
	title: Ref<string, string>,
	answer: Ref<string, string>,
	theses: Ref<Thesis[], Thesis[]>,
}

export const useTicketEditingStore = ({ id }: UseTicketEditingStoreProps): TicketEditingStore => {
	const { data } = useTicketFindOneQuery({ id });

	const title = ref("");
	const answer = ref("");
	const theses = ref<Thesis[]>([]);

	watchEffect(() => {
		if (data.value?.ticket) {
			title.value = data.value.ticket.question;
			answer.value = data.value.ticket.answer;
			theses.value = data.value.ticket.theses.map(thesis => ({
				...thesis,
				isNew: false,
			}));
		}
	});

	return {
		title,
		answer,
		theses,
	};
};
