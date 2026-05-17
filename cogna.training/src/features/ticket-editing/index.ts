export { default as TicketEditor } from "./ui/TicketEditor/TicketEditor.vue";
export { default as TicketThesesEditor } from "./ui/TicketThesesEditor/TicketThesesEditor.vue";

export { useTicketEditingStore } from "./model/useTicketEditingStore";
export { useTicketAutosave } from "./model/useTicketAutosave";
export { type ChangeThesisPayload } from './model/types'

export { useTicketEditingMutations } from './api/api'

export { CREATE_TICKET_ID } from './lib/constants'
export { mapThesis } from './lib/mappers'