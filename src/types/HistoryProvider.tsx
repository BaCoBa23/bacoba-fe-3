import type { Provider } from "./Provider";


export interface HistoryProvider {
  id: string;
  provider?: Provider;
  paidAmount: number;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHistoryProviderInput = Omit<HistoryProvider, "id" | "createdAt" | "updatedAt" | "provider">;
export type UpdateHistoryProviderInput = Partial<Omit<HistoryProvider, "id" | "createdAt" | "updatedAt" | "provider">>;
