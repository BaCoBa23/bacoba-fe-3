import type { Product } from "./Product";
import type { ReceivedNote } from "./ReceivedNote";


export interface ReceivedProduct {
  id: string;
  productId: string;
  productName: string;
  addQuantity: number;
  discount: number;
  description?: string | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateReceivedProductInput = Omit<ReceivedProduct, "id" | "createdAt" | "updatedAt" | "receivedNote" | "product">;
export type UpdateReceivedProductInput = Partial<Omit<ReceivedProduct, "id" | "createdAt" | "updatedAt" | "receivedNote" | "product">>;
