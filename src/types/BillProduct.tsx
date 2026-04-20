


export interface BillProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBillProductInput = Omit<BillProduct, "id" | "createdAt" | "updatedAt" | "bill" | "product">;
export type UpdateBillProductInput = Partial<Omit<BillProduct, "id" | "createdAt" | "updatedAt" | "bill" | "product">>;


export const mockBillProducts: BillProduct[] = [
  // Sản phẩm 1: Quần bò Baggy Nam (Sản phẩm chính)
  {
    id: "BP-001",
    productId: "QB11",
    productName: "Quần bò Baggy Nam ống rộng",
    quantity: 2,
    salePrice: 450000,
    total: 900000,
    status: "active",
    createdAt: new Date("2024-03-20T08:00:00Z"),
    updatedAt: new Date("2024-03-20T08:00:00Z"),
  },
  // Sản phẩm 2: Variant của Quần bò (Đỏ - XL)
  {
    id: "BP-002",
    productId: "QB11-1",
    productName: "Quần bò Baggy Nam ống rộng-Đỏ-XL",
    quantity: 1,
    salePrice: 450000,
    total: 450000,
    status: "active",
    createdAt: new Date("2024-03-20T09:30:00Z"),
    updatedAt: new Date("2024-03-20T09:30:00Z"),
  },
  // Sản phẩm 3: Áo phông Unisex (Sản phẩm chính)
  {
    id: "BP-003",
    productId: "AP11",
    productName: "Áo phông Unisex Cotton 100%",
    quantity: 5,
    salePrice: 160000,
    total: 800000,
    status: "active",
    createdAt: new Date("2024-03-21T10:15:00Z"),
    updatedAt: new Date("2024-03-21T10:15:00Z"),
  },
  // Sản phẩm 4: Variant của Áo phông (Xanh dương - XL)
  {
    id: "BP-004",
    productId: "AP11-2",
    productName: "Áo phông Unisex Cotton 100%-Xanh dương-XL",
    quantity: 2,
    salePrice: 160000,
    total: 320000,
    status: "active",
    createdAt: new Date("2024-03-21T11:00:00Z"),
    updatedAt: new Date("2024-03-21T11:00:00Z"),
  },
  // Sản phẩm 5: Variant của Áo phông (Đỏ - M)
  {
    id: "BP-005",
    productId: "AP11-3",
    productName: "Áo phông Unisex Cotton 100%-Đỏ-M",
    quantity: 3,
    salePrice: 160000,
    total: 480000,
    status: "active",
    createdAt: new Date("2024-03-21T14:20:00Z"),
    updatedAt: new Date("2024-03-21T14:20:00Z"),
  },
  // Sản phẩm 6: Váy hoa nhí (Sản phẩm chính)
  {
    id: "BP-006",
    productId: "VH11",
    productName: "Váy hoa nhí Vintage dáng dài",
    quantity: 1,
    salePrice: 580000,
    total: 580000,
    status: "active",
    createdAt: new Date("2024-03-22T08:45:00Z"),
    updatedAt: new Date("2024-03-22T08:45:00Z"),
  },
  // Sản phẩm 7: Variant của Váy hoa nhí (Xanh dương - S)
  {
    id: "BP-007",
    productId: "VH11-2",
    productName: "Váy hoa nhí Vintage dáng dài-Xanh dương-S",
    quantity: 1,
    salePrice: 580000,
    total: 580000,
    status: "active",
    createdAt: new Date("2024-03-22T09:00:00Z"),
    updatedAt: new Date("2024-03-22T09:00:00Z"),
  },
  // Sản phẩm 8: Mua thêm Áo phông (Sản phẩm chính)
  {
    id: "BP-008",
    productId: "AP11",
    productName: "Áo phông Unisex Cotton 100%",
    quantity: 10,
    salePrice: 160000,
    total: 1600000,
    status: "active",
    createdAt: new Date("2024-03-23T10:00:00Z"),
    updatedAt: new Date("2024-03-23T10:00:00Z"),
  },
  // Sản phẩm 9: Variant của Quần bò (Xanh dương - XL)
  {
    id: "BP-009",
    productId: "QB11-2",
    productName: "Quần bò Baggy Nam ống rộng-Xanh dương-XL",
    quantity: 2,
    salePrice: 450000,
    total: 900000,
    status: "active",
    createdAt: new Date("2024-03-23T15:30:00Z"),
    updatedAt: new Date("2024-03-23T15:30:00Z"),
  },
  // Sản phẩm 10: Variant của Váy hoa nhí (Đỏ - M)
  {
    id: "BP-010",
    productId: "VH11-3",
    productName: "Váy hoa nhí Vintage dáng dài-Đỏ-M",
    quantity: 1,
    salePrice: 580000,
    total: 580000,
    status: "active",
    createdAt: new Date("2024-03-24T11:10:00Z"),
    updatedAt: new Date("2024-03-24T11:10:00Z"),
  }
];