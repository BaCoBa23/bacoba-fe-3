import type { AttributeType } from "./AttributeType";
import type { ProductAttribute } from "./ProductAttribute";


export interface Attribute {
  id: string;
  attributeType?: any ;
  value: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAttributeInput = Omit<Attribute, "id" | "createdAt" | "updatedAt" | "attributeType" | "productAttributes">;
export type UpdateAttributeInput = Partial<Omit<Attribute, "id" | "createdAt" | "updatedAt" | "attributeType" | "productAttributes">>;




export const mockAttributes: Attribute[] = [
  {
    id: "attr-001",
    value: "Đỏ",
    status: "ACTIVE",
    createdAt: new Date("2023-10-01T08:00:00Z"),
    updatedAt: new Date("2023-10-01T08:00:00Z"),
    attributeType: { id: "type-color", name: "Màu sắc" ,status: "ACTIVE",
    createdAt: new Date("2023-09-01T08:00:00Z"),
    updatedAt: new Date("2023-09-01T08:00:00Z"), }, // Giả định AttributeType
  },
  {
    id: "attr-002",
    value: "Xanh dương",
    status: "ACTIVE",
    createdAt: new Date("2023-10-02T09:30:00Z"),
    updatedAt: new Date("2023-10-02T10:00:00Z"),
    attributeType: { id: "type-color", name: "Màu sắc" },
  },
  {
    id: "attr-003",
    value: "XL",
    status: "ACTIVE",
    createdAt: new Date("2023-10-05T14:20:00Z"),
    updatedAt: new Date("2023-10-05T14:20:00Z"),
    attributeType: { id: "type-size", name: "Kích thước" },
  },
  {
    id: "attr-004",
    value: "Cotton 100%",
    status: "INACTIVE",
    createdAt: new Date("2023-11-12T11:00:00Z"),
    updatedAt: new Date("2023-11-12T11:00:00Z"),
    attributeType: { id: "type-material", name: "Chất liệu" },
  }
];