import type { HistoryProvider } from "./HistoryProvider";
import type { ReceivedNote } from "./ReceivedNote";


export interface Provider {
  id: string;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  debtTotal: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  histories?: HistoryProvider[];
  receivedNotes?: ReceivedNote[];
}

export type CreateProviderInput = Omit<Provider, "id" | "createdAt" | "updatedAt" | "histories" | "receivedNotes">;
export type UpdateProviderInput = Partial<Omit<Provider, "id" | "createdAt" | "updatedAt" | "histories" | "receivedNotes">>;


export const MOCK_PROVIDERS: Provider[] = [
  {
    id: "PROV-001",
    name: "Công ty Văn phòng phẩm Toàn Cầu",
    phoneNumber: "02838445566",
    email: "contact@toancau-stationery.com",
    debtTotal: 5000000,
    total: 25000000,
    status: "active",
    createdAt: new Date("2023-10-15T08:30:00Z"),
    updatedAt: new Date("2024-03-20T14:15:00Z"),
    histories: [], // Có thể thêm mock HistoryProvider[] vào đây
    receivedNotes: [], // Có thể thêm mock ReceivedNote[] vào đây
  },
  {
    id: "PROV-002",
    name: "Nhà phân phối Linh kiện ABC",
    phoneNumber: "0909123456",
    email: null,
    debtTotal: 0,
    total: 120000000,
    status: "active",
    createdAt: new Date("2023-11-01T09:00:00Z"),
    updatedAt: new Date("2023-11-01T09:00:00Z"),
  },
  {
    id: "PROV-003",
    name: "Xưởng May Mặc Việt Nam (Cũ)",
    phoneNumber: null,
    email: "support@xuongmayvn.vn",
    debtTotal: 1500000,
    total: 1500000,
    status: "inactive",
    createdAt: new Date("2022-01-10T10:00:00Z"),
    updatedAt: new Date("2023-12-30T16:45:00Z"),
  }
];