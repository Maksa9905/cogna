import { useCreateTicketMutation, usePatchTicketMutation } from "@/entities/tickets"
import type { SaveTicketPayload } from "./types";
import { CREATE_TICKET_ID } from "../lib/constants";

export const useTicketEditingMutations = () => {
  const { mutateAsync: editTicket, isPending: isEditLoading } = usePatchTicketMutation();
  const { mutateAsync: createTicket, isPending: isCreatingLoading } = useCreateTicketMutation();

  const saveTicket = async (payload: SaveTicketPayload) => {
    if (payload.id === CREATE_TICKET_ID) {
      if (!payload.question || !payload.answer) return;

      return await createTicket({
        subjectId: payload.subjectId,
        theses: payload.theses || [],
        question: payload.question,
        answer: payload.answer
      })
    }

    else if (payload.id) {
      return editTicket({
        id: payload.id,
        answer: payload.answer,
        question: payload.question,
        theses: payload.theses,
      })
    }
  }

  return {
    saveTicket,
    isLoading: isCreatingLoading,
    isCreatingLoading,
    isEditLoading,
  }
}