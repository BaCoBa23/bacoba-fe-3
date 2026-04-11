import type { Product } from "./Product";

export interface Brand {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export type CreateBrandInput = Omit<Brand, "id" | "createdAt" | "updatedAt" | "products">;
export type UpdateBrandInput = Partial<Omit<Brand, "id" | "createdAt" | "updatedAt" | "products">>;