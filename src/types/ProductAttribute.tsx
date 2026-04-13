import type { Attribute } from "./Attribute";
import type { Product } from "./Product";


export interface ProductAttribute {
  productId: string;
  attributeId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductAttributeInput = Omit<ProductAttribute, "createdAt" | "updatedAt" | "product" | "attribute">;
export type UpdateProductAttributeInput = Partial<Omit<ProductAttribute, "createdAt" | "updatedAt" | "product" | "attribute">>;
