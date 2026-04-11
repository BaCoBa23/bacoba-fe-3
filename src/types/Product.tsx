import type { Brand } from "./Brand";
import type { ProductAttribute } from "./ProductAttribute";
import type { ProductType } from "./ProductType";


export interface Product {
  id: string;
  parentId?: string | null;
  parent?: Product | null;
  variants?: Product[];
  productTypeId: number;
  type?: ProductType;
  brandId: number;
  brand?: Brand;
  initialPrice: number;
  salePrice: number;
  quantity: number;
  description?: string | null;
  barcode?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  productAttributes?: ProductAttribute[];
}

export type CreateProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "parent" | "variants" | "type" | "brand" | "productAttributes"
>;

export type UpdateProductInput = Partial<
  Omit<
    Product,
    "id" | "createdAt" | "updatedAt" | "parent" | "variants" | "type" | "brand" | "productAttributes"
  >
>;
