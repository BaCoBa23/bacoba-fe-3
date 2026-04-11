import type { AttributeType } from "./AttributeType";
import type { ProductAttribute } from "./ProductAttribute";


export interface Attribute {
  id: number;
  attributeTypeId: number;
  attributeType?: AttributeType ;
  value: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  productAttributes?: ProductAttribute[];
}

export type CreateAttributeInput = Omit<Attribute, "id" | "createdAt" | "updatedAt" | "attributeType" | "productAttributes">;
export type UpdateAttributeInput = Partial<Omit<Attribute, "id" | "createdAt" | "updatedAt" | "attributeType" | "productAttributes">>;
