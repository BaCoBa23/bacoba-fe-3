import type { Product } from "./Product";


export interface ProductType {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export type CreateProductTypeInput = Omit<ProductType, "id" | "createdAt" | "updatedAt" | "products">;
export type UpdateProductTypeInput = Partial<Omit<ProductType, "id" | "createdAt" | "updatedAt" | "products">>;
