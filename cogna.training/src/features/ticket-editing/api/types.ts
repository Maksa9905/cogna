import type { ThesisInput } from "@/entities/tickets";

export type SaveTicketPayload = {
  id: string;
  subjectId: string;
  question?: string;
  answer?: string;
  theses?: ThesisInput[];
}