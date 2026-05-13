import { useTicketFindOneQuery, usePatchTicketMutation } from "@/entities/tickets";
import { onBeforeUnmount, onMounted, type Ref } from "vue";

type UseTicketAutosaveProps = {
	id: string;
	answer: Ref<string, string>;
	title: Ref<string, string>;
};

export const useTicketAutosave = ({ id, answer, title }: UseTicketAutosaveProps) => {
	const { data: ticketData } = useTicketFindOneQuery({ id });
	const { mutateAsync: updateTicket } = usePatchTicketMutation();

	onMounted(() => {
		const interval = setInterval(() => {
			if (
				ticketData.value?.ticket?.answer === answer.value &&
				ticketData.value?.ticket?.question === title.value
			)
				return;

			updateTicket({ id, answer: answer.value, question: title.value });
		}, 5000);

		onBeforeUnmount(() => {
			clearInterval(interval);
		});
	});
};
