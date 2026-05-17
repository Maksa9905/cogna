import type { ThesisInput } from "@/entities/tickets";
import type { Thesis } from "../model/types";

export const mapThesis = (thesis: Thesis): ThesisInput => ({
  id: thesis.isNew ? undefined : thesis.id,
  importance: thesis.importance,
  value: thesis.value,
})