import type { ApiThesis, EThesisImportance } from "@/entities/tickets";

export type ChangeThesisPayload = {
  id: string;
  isNew: boolean;
  thesis?: string, 
  importance?: EThesisImportance
};

export type Thesis = Omit<ApiThesis, "updatedAt" | "createdAt"> & {
	isNew: boolean;
};
