import { useTicketFindOneQuery } from "@/entities/tickets";
import { watch, type Ref } from "vue";
import { useTicketEditingMutations } from "../api/api";
import { debounce } from "@/shared/lib/debounce";

type UseTicketAutosaveProps = {
	id: Ref<string>;
	subjectId: Ref<string>;
	answer: Ref<string, string>;
	title: Ref<string, string>;
};

export const useTicketAutosave = ({ id, subjectId, answer, title }: UseTicketAutosaveProps) => {
	const { data: ticketData } = useTicketFindOneQuery(id);
	const { saveTicket } = useTicketEditingMutations();

	const debouncedSave = debounce(() => {
		if(
			ticketData.value?.ticket?.answer === answer.value &&
			ticketData.value?.ticket?.question === title.value
		)
		return;

		saveTicket({ 
			id: id.value, 
			subjectId: subjectId.value, 
			answer: answer.value, 
			question: title.value
		});
	}, 5000)

	watch([answer, title], () => {
		debouncedSave()
	})
};
