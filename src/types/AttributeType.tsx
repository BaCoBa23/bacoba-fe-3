import type { Attribute } from "./Attribute";


export interface AttributeType {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAttributeTypeInput = Omit<AttributeType, "id" | "createdAt" | "updatedAt" | "attributes">;
export type UpdateAttributeTypeInput = Partial<Omit<AttributeType, "id" | "createdAt" | "updatedAt" | "attributes">>;


export const mockAttributeTypes: AttributeType[] = [
  {
    id: "type-color",
    name: "Màu sắc",
    status: "ACTIVE",
    createdAt: new Date("2023-09-01T08:00:00Z"),
    updatedAt: new Date("2023-09-01T08:00:00Z"),

  },
  {
    id: "type-size",
    name: "Kích thước",
    status: "ACTIVE",
    createdAt: new Date("2023-09-02T10:00:00Z"),
    updatedAt: new Date("2023-09-02T10:00:00Z"),
  },
  {
    id: "type-material",
    name: "Chất liệu",
    status: "ACTIVE",
    createdAt: new Date("2023-09-03T11:00:00Z"),
    updatedAt: new Date("2023-09-03T11:00:00Z"),
  }
];