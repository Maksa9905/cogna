import { useTicketFindOneQuery, useUpdateTicketMutation } from "@/entities/tickets";
import { onBeforeUnmount, onMounted } from "vue";

type UseTicketAutosaveProps = {
	id: string;
	answer: string;
	title: string;
};

export const useTicketAutosave = ({ id, answer, title }: UseTicketAutosaveProps) => {
	const { data: ticketData } = useTicketFindOneQuery({ id });
	const { mutateAsync: updateTicket } = useUpdateTicketMutation();

	onMounted(() => {
		const interval = setInterval(() => {
			if (
				ticketData.value?.ticket?.answer === answer &&
				ticketData.value?.ticket?.question === title
			)
				return;

			updateTicket({ id, answer, question: title });
		}, 30000);

		onBeforeUnmount(() => {
			clearInterval(interval);
		});
	});
};
