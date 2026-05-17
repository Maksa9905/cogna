import { EThesisImportance, useTicketFindOneQuery } from "@/entities/tickets";
import { uuid } from "@tanstack/vue-form";
import { ref, watchEffect, type Ref } from "vue";
import type { ChangeThesisPayload, Thesis } from "./types";

export type TicketEditingStore = {
	title: Ref<string, string>;
	answer: Ref<string, string>;
	theses: Ref<Thesis[], Thesis[]>;
	addNewThesis: () => void;
	changeThesis: (payload: ChangeThesisPayload) => void
};

export const useTicketEditingStore = (id: Ref<string>): TicketEditingStore => {
	const ticket = useTicketFindOneQuery(id);

	const { data } = ticket

	const title = ref("");
	const answer = ref("");
	const theses = ref<Thesis[]>([]);

	watchEffect(() => {
		console.debug(ticket.data)
		console.debug(id)
	})

	const addNewThesis = () => {
		if (theses.value.some(thesis => thesis.isNew && !thesis.value)) return;

		const newThesis = {
			id: uuid(),
			isNew: true,
			value: "",
			importance: EThesisImportance.LOW
		}
	
		theses.value = [
			...theses.value,
			newThesis,
		]
	}

	const changeThesis = (payload: ChangeThesisPayload) => {
		const newTheses = [
    ...theses.value
		]

		const editingThesis = newTheses.find(thesis => thesis.id === payload.id)

		if (!editingThesis) return;

		if (payload.thesis === "") {
			theses.value = theses.value.filter(thesis => thesis.id !== payload.id)
			return;
		}

		if (editingThesis) {
			if (payload.thesis) editingThesis.value = payload.thesis
			if (payload.importance) editingThesis.importance = payload.importance
		}

		theses.value = newTheses;
	}

	watchEffect(() => {
		if (data.value?.ticket) {
			title.value = data.value.ticket.question;
			answer.value = data.value.ticket.answer;
			theses.value = data.value.ticket.theses.map((thesis) => ({
				...thesis,
				isNew: false,
			}));
		}
	});

	return {
		title,
		answer,
		theses,
		addNewThesis,
		changeThesis,
	};
};
