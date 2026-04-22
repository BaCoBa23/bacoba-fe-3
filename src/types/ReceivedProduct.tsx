


 interface ReceivedProduct {
  id: string;
  productId: string;
  productName: string;
  addQuantity: number;
  discount: number;
  description?: string | null;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateReceivedProductInput = Omit<ReceivedProduct, "id" | "createdAt" | "updatedAt" | "receivedNote" | "product">;
export type UpdateReceivedProductInput = Partial<Omit<ReceivedProduct, "id" | "createdAt" | "updatedAt" | "receivedNote" | "product">>;


export const MOCK_RECEIVED_PRODUCTS: ReceivedProduct[] = [
  // Nhập Quần bò Baggy Nam ống rộng (Biến thể Đỏ-XL)
  {
    id: "REC-001",
    productId: "QB11-1",
    productName: "Quần bò Baggy Nam ống rộng-Đỏ-XL",
    addQuantity: 20,
    discount: 5000,
    description: "Nhập thêm hàng cho đợt sale tháng 4",
    total: (250000 - 5000) * 20, // initialPrice của QB11 là 250k
    createdAt: new Date("2024-04-10T08:00:00Z"),
    updatedAt: new Date("2024-04-10T08:00:00Z"),
  },
  // Nhập Quần bò Baggy Nam ống rộng (Biến thể Xanh dương-XL)
  {
    id: "REC-002",
    productId: "QB11-2",
    productName: "Quần bò Baggy Nam ống rộng-Xanh dương-XL",
    addQuantity: 15,
    discount: 0,
    description: "Hàng về thêm theo yêu cầu khách",
    total: 250000 * 15,
    createdAt: new Date("2024-04-10T08:30:00Z"),
    updatedAt: new Date("2024-04-10T08:30:00Z"),
  },
  // Nhập Áo phông Unisex (Biến thể Đỏ-XL)
  {
    id: "REC-003",
    productId: "AP11-1",
    productName: "Áo phông Unisex Cotton 100%-Đỏ-XL",
    addQuantity: 50,
    discount: 2000,
    description: "Nhập số lượng lớn từ xưởng A",
    total: (85000 - 2000) * 50, // initialPrice của AP11 là 85k
    createdAt: new Date("2024-04-11T09:00:00Z"),
    updatedAt: new Date("2024-04-11T09:00:00Z"),
  },
  // Nhập Áo phông Unisex (Biến thể Đỏ-M)
  {
    id: "REC-004",
    productId: "AP11-3",
    productName: "Áo phông Unisex Cotton 100%-Đỏ-M",
    addQuantity: 30,
    discount: 0,
    description: null,
    total: 85000 * 30,
    createdAt: new Date("2024-04-11T09:15:00Z"),
    updatedAt: new Date("2024-04-11T09:15:00Z"),
  },
  // Nhập Váy hoa nhí (Biến thể Đỏ-S)
  {
    id: "REC-005",
    productId: "VH11-1",
    productName: "Váy hoa nhí Vintage dáng dài-Đỏ-S",
    addQuantity: 10,
    discount: 10000,
    description: "Hàng lỗi nhẹ từ nhà cung cấp, được giảm giá thêm",
    total: (320000 - 10000) * 10, // initialPrice của VH11 là 320k
    createdAt: new Date("2024-04-12T14:00:00Z"),
    updatedAt: new Date("2024-04-12T14:00:00Z"),
  },
  // Nhập lại Quần bò (Biến thể Đỏ-L)
  {
    id: "REC-006",
    productId: "QB11-3",
    productName: "Quần bò Baggy Nam ống rộng-Đỏ-L",
    addQuantity: 25,
    discount: 0,
    description: "Bổ sung kho",
    total: 250000 * 25,
    createdAt: new Date("2024-04-12T15:00:00Z"),
    updatedAt: new Date("2024-04-12T15:00:00Z"),
  },
  // Nhập Áo phông (Xanh dương-XL)
  {
    id: "REC-007",
    productId: "AP11-2",
    productName: "Áo phông Unisex Cotton 100%-Xanh dương-XL",
    addQuantity: 40,
    discount: 1000,
    description: "Nhập hàng định kỳ",
    total: (85000 - 1000) * 40,
    createdAt: new Date("2024-04-13T10:00:00Z"),
    updatedAt: new Date("2024-04-13T10:00:00Z"),
  },
  // Nhập Váy hoa nhí (Xanh dương-S)
  {
    id: "REC-008",
    productId: "VH11-2",
    productName: "Váy hoa nhí Vintage dáng dài-Xanh dương-S",
    addQuantity: 5,
    discount: 0,
    description: "Số lượng ít do khan hiếm vải",
    total: 320000 * 5,
    createdAt: new Date("2024-04-13T11:00:00Z"),
    updatedAt: new Date("2024-04-13T11:00:00Z"),
  },
  // Nhập Váy hoa nhí (Đỏ-M)
  {
    id: "REC-009",
    productId: "VH11-3",
    productName: "Váy hoa nhí Vintage dáng dài-Đỏ-M",
    addQuantity: 12,
    discount: 5000,
    description: "Khuyến mãi từ xưởng",
    total: (320000 - 5000) * 12,
    createdAt: new Date("2024-04-14T16:30:00Z"),
    updatedAt: new Date("2024-04-14T16:30:00Z"),
  },
  // Nhập Quần bò (Sản phẩm cha - giả định nhập mẫu không phân loại)
  {
    id: "REC-010",
    productId: "QB11",
    productName: "Quần bò Baggy Nam ống rộng",
    addQuantity: 10,
    discount: 0,
    description: "Hàng mẫu trưng bày",
    total: 250000 * 10,
    createdAt: new Date("2024-04-15T09:00:00Z"),
    updatedAt: new Date("2024-04-15T09:00:00Z"),
  },
];