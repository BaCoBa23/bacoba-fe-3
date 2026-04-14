import type { Provider } from "./Provider";
import type { ReceivedProduct } from "./ReceivedProduct";


export interface ReceivedNote {
  id: string;
  provider?: Provider;
  phoneNumber?: string | null;
  discount: number;
  payedMoney: number;
  debtMoney: number;
  total: number;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  receivedProducts?: ReceivedProduct[];
}

export type CreateReceivedNoteInput = Omit<ReceivedNote, "id" | "createdAt" | "updatedAt" | "provider" | "receivedProducts">;
export type UpdateReceivedNoteInput = Partial<Omit<ReceivedNote, "id" | "createdAt" | "updatedAt" | "provider" | "receivedProducts">>;
