import type { HistoryProvider } from "./HistoryProvider";
import type { ReceivedNote } from "./ReceivedNote";


export interface Provider {
  id: number;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  debtTotal: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  histories?: HistoryProvider[];
  receivedNotes?: ReceivedNote[];
}

export type CreateProviderInput = Omit<Provider, "id" | "createdAt" | "updatedAt" | "histories" | "receivedNotes">;
export type UpdateProviderInput = Partial<Omit<Provider, "id" | "createdAt" | "updatedAt" | "histories" | "receivedNotes">>;
