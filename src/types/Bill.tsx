import type { BillProduct } from "./BillProduct";


export interface Bill {
  id: number;
  exchangeId?: number | null;
  exchange?: Bill | null;
  exchangedBy?: Bill[];
  name?: string | null;
  customerName?: string | null;
  phoneNumber?: string | null;
  discount: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  billProducts?: BillProduct[];
}

export type CreateBillInput = Omit<Bill, "id" | "createdAt" | "updatedAt" | "exchange" | "exchangedBy" | "billProducts">;
export type UpdateBillInput = Partial<Omit<Bill, "id" | "createdAt" | "updatedAt" | "exchange" | "exchangedBy" | "billProducts">>;
