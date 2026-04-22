 interface Provider {
  id: string;
  name: string;
  [key: string]: any;
}

export interface HistoryProvider {
  id: string;
  provider?: Provider;
  paidAmount: number;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHistoryProviderInput = Omit<
  HistoryProvider,
  "id" | "createdAt" | "updatedAt" | "provider"
>;
export type UpdateHistoryProviderInput = Partial<
  Omit<HistoryProvider, "id" | "createdAt" | "updatedAt" | "provider">
>;
export const MOCK_HISTORY_PROVIDERS: HistoryProvider[] = [
  // --- Lịch sử thanh toán cho Công ty Quần (PROV-001) ---
  {
    id: "HIST-001",
    paidAmount: 10000000,
    description: "Thanh toán đợt 1 cho lô hàng tháng 10",
    status: "completed",
    createdAt: new Date("2023-10-20T10:00:00Z"),
    updatedAt: new Date("2023-10-20T10:00:00Z"),
  },
  {
    id: "HIST-002",
    paidAmount: 10000000,
    description: "Thanh toán đợt 2",
    status: "completed",
    createdAt: new Date("2023-11-15T09:30:00Z"),
    updatedAt: new Date("2023-11-15T09:30:00Z"),
  },
  // (Còn nợ 5.000.000 như trong mock Provider)

  // --- Lịch sử thanh toán cho Công ty Áo (PROV-002) ---
  {
    id: "HIST-003",
    paidAmount: 50000000,
    description: "Thanh toán cọc hợp đồng may mặc",
    status: "completed",
    createdAt: new Date("2023-11-02T08:00:00Z"),
    updatedAt: new Date("2023-11-02T08:00:00Z"),
  },
  {
    id: "HIST-004",
    paidAmount: 70000000,
    description: "Thanh toán dứt điểm lô hàng",
    status: "completed",
    createdAt: new Date("2023-12-05T14:20:00Z"),
    updatedAt: new Date("2023-12-05T14:20:00Z"),
  },

  // --- Lịch sử thanh toán cho Công ty Váy (PROV-003) ---
  {
    id: "HIST-005",
    paidAmount: 0,
    description: "Yêu cầu thanh toán đang chờ duyệt",
    status: "pending",
    createdAt: new Date("2024-01-05T11:00:00Z"),
    updatedAt: new Date("2024-01-05T11:00:00Z"),
  },
  {
    id: "HIST-006",
    paidAmount: 500000,
    description: "Thanh toán lẻ đợt đầu",
    status: "completed",
    createdAt: new Date("2024-02-10T16:00:00Z"),
    updatedAt: new Date("2024-02-10T16:00:00Z"),
  },
];
