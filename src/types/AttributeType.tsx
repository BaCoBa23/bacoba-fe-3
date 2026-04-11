import type { Attribute } from "./Attribute";


export interface AttributeType {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  attributes?: Attribute[];
}

export type CreateAttributeTypeInput = Omit<AttributeType, "id" | "createdAt" | "updatedAt" | "attributes">;
export type UpdateAttributeTypeInput = Partial<Omit<AttributeType, "id" | "createdAt" | "updatedAt" | "attributes">>;
