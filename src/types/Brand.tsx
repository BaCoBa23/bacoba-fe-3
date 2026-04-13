

export interface Brand {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBrandInput = Omit<Brand, "id" | "createdAt" | "updatedAt" | "products">;
export type UpdateBrandInput = Partial<Omit<Brand, "id" | "createdAt" | "updatedAt" | "products">>;