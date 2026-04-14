


export interface ProductType {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductTypeInput = Omit<ProductType, "id" | "createdAt" | "updatedAt" | "products">;
export type UpdateProductTypeInput = Partial<Omit<ProductType, "id" | "createdAt" | "updatedAt" | "products">>;


export const MOCK_PRODUCT_TYPES: ProductType[] = [
  {
    id: "TYPE-001",
    name: "Quần bò",
    status: "active",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-05T15:30:00Z"),
  },
  {
    id: "TYPE-002",
    name: "ÁO phông",
    status: "active",
    createdAt: new Date("2024-02-10T08:00:00Z"),
    updatedAt: new Date("2024-02-10T08:00:00Z"),
  },
  {
    id: "TYPE-003",
    name: "Váy",
    status: "inactive",
    createdAt: new Date("2023-12-20T09:00:00Z"),
    updatedAt: new Date("2024-03-01T11:20:00Z"),
  }
];