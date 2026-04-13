import type { Bill } from "./Bill";
import type { Product } from "./Product";


export interface BillProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBillProductInput = Omit<BillProduct, "id" | "createdAt" | "updatedAt" | "bill" | "product">;
export type UpdateBillProductInput = Partial<Omit<BillProduct, "id" | "createdAt" | "updatedAt" | "bill" | "product">>;
