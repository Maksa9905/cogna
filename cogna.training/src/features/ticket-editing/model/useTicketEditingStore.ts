import { useTicketFindOneQuery } from "@/entities/tickets";
import { ref, watchEffect } from "vue";

type UseTicketEditingStoreProps = {
	id: string;
};

export const useTicketEditingStore = ({ id }: UseTicketEditingStoreProps) => {
	const { data } = useTicketFindOneQuery({ id });

	const title = ref("");
	const answer = ref("");

	watchEffect(() => {
		if (data.value?.ticket) {
			title.value = data.value.ticket.question;
			answer.value = data.value.ticket.answer;
		}
	});

	return {
		title,
		answer,
	};
};
