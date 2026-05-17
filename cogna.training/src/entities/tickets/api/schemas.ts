import z from "zod";
import { EThesisImportance } from "./types";

export const ThesisSchema = z.object({
  value: z.string().min(1),
  importance: z.enum(EThesisImportance)
});

export const CreateTicketSchema = z.object({
  question: z.string().min(1),
	answer: z.string().min(1),
	subjectId: z.uuid(),
	theses: ThesisSchema.array(),
})

export const PatchTicketSchema = z.object({
  id: z.uuid(),
  question: z.string().min(1).or(z.undefined()),
	answer: z.string().min(1).or(z.undefined()),
	theses: ThesisSchema.array().or(z.undefined()),
})

export const FindOneTicketSchema = z.uuid()