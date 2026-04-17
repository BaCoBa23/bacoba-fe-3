

export interface Provider {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}
export interface ReceivedProduct {
  id: string;
  productId: string;
  productName: string;
  addQuantity: number;
  discount: number;
  description?: string | null;
  total: number;
  [key: string]: any;
}

export interface ReceivedNote {
  id: string;
  provider?: Provider;
  phoneNumber?: string | null;
  discount: number;
  payedMoney: number;
  debtMoney: number;
  total: number;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  receivedProducts?: ReceivedProduct[];
}

export type CreateReceivedNoteInput = Omit<ReceivedNote, "id" | "createdAt" | "updatedAt" | "provider" | "receivedProducts">;
export type UpdateReceivedNoteInput = Partial<Omit<ReceivedNote, "id" | "createdAt" | "updatedAt" | "provider" | "receivedProducts">>;


export const MOCK_RECEIVED_NOTES: ReceivedNote[] = [
  {
    id: "NOTE-2024-001",
    // Nhà cung cấp: Công ty Quần (PROV-001)
    provider: {
      id: "PROV-001",
      name: "Công ty Quần",
      status: "active",

    },
    phoneNumber: "02838445566",
    discount: 20000,
    payedMoney: 8630000,
    debtMoney: 0,
    total: 8650000,
    description: "Nhập lô hàng quần bò đầu tháng - Đã kiểm kho",
    status: "completed",
    createdAt: new Date("2024-04-10T10:00:00Z"),
    updatedAt: new Date("2024-04-10T10:00:00Z"),
    receivedProducts: [
      {
        id: "REC-001",
        productId: "QB11-1",
        productName: "Quần bò Baggy Nam ống rộng-Đỏ-XL",
        addQuantity: 20,
        discount: 5000,
        total: 4900000,
      },
      {
        id: "REC-002",
        productId: "QB11-2",
        productName: "Quần bò Baggy Nam ống rộng-Xanh dương-XL",
        addQuantity: 15,
        discount: 0,
        total: 3750000,
      }
    ],
  },
  {
    id: "NOTE-2024-002",
    // Nhà cung cấp: Công ty Áo (PROV-002)
    provider: {
      id: "PROV-002",
      name: "Công ty Áo",
      status: "active",

    },
    phoneNumber: "0909123456",
    discount: 50000,
    payedMoney: 0,
    debtMoney: 6650000,
    total: 6700000,
    description: "Đơn nháp chờ sếp duyệt chi phí nhập",
    status: "draft",
    createdAt: new Date("2024-04-11T11:00:00Z"),
    updatedAt: new Date("2024-04-11T11:00:00Z"),
    receivedProducts: [
      {
        id: "REC-003",
        productId: "AP11-1",
        productName: "Áo phông Unisex Cotton 100%-Đỏ-XL",
        addQuantity: 50,
        discount: 2000,
        total: 4150000,
      },
      {
        id: "REC-004",
        productId: "AP11-3",
        productName: "Áo phông Unisex Cotton 100%-Đỏ-M",
        addQuantity: 30,
        discount: 0,
        total: 2550000,
      }
    ],
  },
  {
    id: "NOTE-2024-003",
    // Nhà cung cấp: Công ty Váy (PROV-003) kết hợp mẫu Áo lẻ
    provider: {
      id: "PROV-003",
      name: "Công ty Váy",
      status: "active",
    },
    phoneNumber: null,
    discount: 0,
    payedMoney: 0,
    debtMoney: 0,
    total: 12550000,
    description: "Nhà cung cấp báo hết hàng đột xuất",
    status: "cancelled",
    createdAt: new Date("2024-04-12T16:00:00Z"),
    updatedAt: new Date("2024-04-12T16:00:00Z"),
    receivedProducts: [
      {
        id: "REC-005",
        productId: "VH11-1",
        productName: "Váy hoa nhí Vintage dáng dài-Đỏ-S",
        addQuantity: 10,
        discount: 10000,
        total: 3100000,
      },
      {
        id: "REC-006",
        productId: "QB11-3",
        productName: "Quần bò Baggy Nam ống rộng-Đỏ-L",
        addQuantity: 25,
        discount: 0,
        total: 6250000,
      },
      {
        id: "REC-007",
        productId: "AP11-2",
        productName: "Áo phông Unisex Cotton 100%-Xanh dương-XL",
        addQuantity: 40,
        discount: 1000,
        total: 3200000,
      }
    ],
  },
  {
    id: "NOTE-2024-004",
    // Nhà cung cấp: Công ty Váy (PROV-003)
    provider: {
      id: "PROV-003",
      name: "Công ty Váy",
      status: "active",
    },
    phoneNumber: "0888999111", // Số điện thoại liên hệ riêng cho đơn này
    discount: 0,
    payedMoney: 7880000,
    debtMoney: 0,
    total: 7880000,
    description: "Đã thanh toán và nhập kho thành công",
    status: "completed",
    createdAt: new Date("2024-04-15T11:00:00Z"),
    updatedAt: new Date("2024-04-15T11:00:00Z"),
    receivedProducts: [
      {
        id: "REC-008",
        productId: "VH11-2",
        productName: "Váy hoa nhí Vintage dáng dài-Xanh dương-S",
        addQuantity: 5,
        discount: 0,
        total: 1600000,
      },
      {
        id: "REC-009",
        productId: "VH11-3",
        productName: "Váy hoa nhí Vintage dáng dài-Đỏ-M",
        addQuantity: 12,
        discount: 5000,
        total: 3780000,
      },
      {
        id: "REC-010",
        productId: "QB11",
        productName: "Quần bò Baggy Nam ống rộng",
        addQuantity: 10,
        discount: 0,
        total: 2500000,
      }
    ],
  }
];