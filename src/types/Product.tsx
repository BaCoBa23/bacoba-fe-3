

export interface Product {
  id: string;
  name: string;
  parent?: any | null;
  variants?: any;
  productType?: any;
  brand?: any;
  initialPrice: number;
  salePrice: number;
  quantity: number;
  description?: string | null;
  barcode?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  attributes?: any[];
}

export type CreateProductInput = Omit<
  Product,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "parent"
  | "variants"
  | "type"
  | "brand"
  | "productAttributes"
>;

export type UpdateProductInput = Partial<
  Omit<
    Product,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "parent"
    | "variants"
    | "type"
    | "brand"
    | "productAttributes"
  >
>;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "QB11",
    name: "Quần bò Baggy Nam ống rộng",
    productType: {
      id: "TYPE-001",
      name: "Quần bò",
      status: "active",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-01-05T15:30:00Z"),
    },
    initialPrice: 250000,
    salePrice: 450000,
    quantity: 100,
    description: "Chất liệu denim dày dặn, phong cách Hàn Quốc",
    barcode: "JEAN-BAG-001",
    status: "active",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-05T15:30:00Z"),
    variants: [
      {
        id: "QB11-1",
        name: "Quần bò Baggy Nam ống rộng-Đỏ-XL",
        productType: {
          id: "TYPE-001",
          name: "Quần bò",
          status: "active",
          createdAt: new Date("2024-01-01T10:00:00Z"),
          updatedAt: new Date("2024-01-05T15:30:00Z"),
        },
        initialPrice: 250000,
        salePrice: 450000,
        quantity: 30,
        description: "Chất liệu denim dày dặn, phong cách Hàn Quốc",
        barcode: "JEAN-BAG-001-1",
        status: "active",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-03", value: "XL" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "QB11-2",
        name: "Quần bò Baggy Nam ống rộng-Xanh dương-XL",
        productType: {
          id: "TYPE-001",
          name: "Quần bò",
          status: "active",
          createdAt: new Date("2024-01-01T10:00:00Z"),
          updatedAt: new Date("2024-01-05T15:30:00Z"),
        },
        initialPrice: 250000,
        salePrice: 450000,
        quantity: 40,
        description: "Chất liệu denim dày dặn, phong cách Hàn Quốc",
        barcode: "JEAN-BAG-001-2",
        status: "active",
        attributes: [
          { id: "attr-02", value: "Xanh dương" },
          { id: "attr-03", value: "XL" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "QB11-3",
        name: "Quần bò Baggy Nam ống rộng-Đỏ-L",
        productType: {
          id: "TYPE-001",
          name: "Quần bò",
          status: "active",
          createdAt: new Date("2024-01-01T10:00:00Z"),
          updatedAt: new Date("2024-01-05T15:30:00Z"),
        },
        initialPrice: 250000,
        salePrice: 450000,
        quantity: 30,
        description: "Chất liệu denim dày dặn, phong cách Hàn Quốc",
        barcode: "JEAN-BAG-001-3",
        status: "active",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-04", value: "L" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "AP11",
    name: "Áo phông Unisex Cotton 100%",
    productType: {
      id: "TYPE-002",
      name: "ÁO phông",
      status: "active",
      createdAt: new Date("2024-02-10T08:00:00Z"),
      updatedAt: new Date("2024-02-10T08:00:00Z"),
    },
    initialPrice: 85000,
    salePrice: 160000,
    quantity: 200,
    description: "Áo thun basic, thấm hút mồ hôi tốt",
    barcode: "TSHIRT-UNI-002",
    status: "active",
    createdAt: new Date("2024-02-10T08:00:00Z"),
    updatedAt: new Date("2024-02-10T08:00:00Z"),
    variants: [
      {
        id: "AP11-1",
        name: "Áo phông Unisex Cotton 100%-Đỏ-XL",
        productType: {
          id: "TYPE-002",
          name: "ÁO phông",
          status: "active",
          createdAt: new Date("2024-02-10T08:00:00Z"),
          updatedAt: new Date("2024-02-10T08:00:00Z"),
        },
        initialPrice: 85000,
        salePrice: 160000,
        quantity: 60,
        description: "Áo thun basic, thấm hút mồ hôi tốt",
        barcode: "TSHIRT-UNI-002-1",
        status: "active",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-03", value: "XL" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "AP11-2",
        name: "Áo phông Unisex Cotton 100%-Xanh dương-XL",
        productType: {
          id: "TYPE-002",
          name: "ÁO phông",
          status: "active",
          createdAt: new Date("2024-02-10T08:00:00Z"),
          updatedAt: new Date("2024-02-10T08:00:00Z"),
        },
        initialPrice: 85000,
        salePrice: 160000,
        quantity: 70,
        description: "Áo thun basic, thấm hút mồ hôi tốt",
        barcode: "TSHIRT-UNI-002-2",
        status: "active",
        attributes: [
          { id: "attr-02", value: "Xanh dương" },
          { id: "attr-03", value: "XL" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "AP11-3",
        name: "Áo phông Unisex Cotton 100%-Đỏ-M",
        productType: {
          id: "TYPE-002",
          name: "ÁO phông",
          status: "active",
          createdAt: new Date("2024-02-10T08:00:00Z"),
          updatedAt: new Date("2024-02-10T08:00:00Z"),
        },
        initialPrice: 85000,
        salePrice: 160000,
        quantity: 70,
        description: "Áo thun basic, thấm hút mồ hôi tốt",
        barcode: "TSHIRT-UNI-002-3",
        status: "active",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-05", value: "M" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "VH11",
    name: "Váy hoa nhí Vintage dáng dài",
    productType: {
      id: "TYPE-003",
      name: "Váy",
      status: "inactive",
      createdAt: new Date("2023-12-20T09:00:00Z"),
      updatedAt: new Date("2024-03-01T11:20:00Z"),
    },
    initialPrice: 320000,
    salePrice: 580000,
    quantity: 50,
    description: "Thiết kế nữ tính, phù hợp đi chơi, dạo phố",
    barcode: "DRESS-VIN-003",
    status: "inactive",
    createdAt: new Date("2023-12-20T09:00:00Z"),
    updatedAt: new Date("2024-03-01T11:20:00Z"),
    variants: [
      {
        id: "VH11-1",
        name: "Váy hoa nhí Vintage dáng dài-Đỏ-S",
        productType: {
          id: "TYPE-003",
          name: "Váy",
          status: "inactive",
          createdAt: new Date("2023-12-20T09:00:00Z"),
          updatedAt: new Date("2024-03-01T11:20:00Z"),
        },
        initialPrice: 320000,
        salePrice: 580000,
        quantity: 15,
        description: "Thiết kế nữ tính, phù hợp đi chơi, dạo phố",
        barcode: "DRESS-VIN-003-1",
        status: "inactive",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-06", value: "S" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "VH11-2",
        name: "Váy hoa nhí Vintage dáng dài-Xanh dương-S",
        productType: {
          id: "TYPE-003",
          name: "Váy",
          status: "inactive",
          createdAt: new Date("2023-12-20T09:00:00Z"),
          updatedAt: new Date("2024-03-01T11:20:00Z"),
        },
        initialPrice: 320000,
        salePrice: 580000,
        quantity: 15,
        description: "Thiết kế nữ tính, phù hợp đi chơi, dạo phố",
        barcode: "DRESS-VIN-003-2",
        status: "inactive",
        attributes: [
          { id: "attr-02", value: "Xanh dương" },
          { id: "attr-06", value: "S" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "VH11-3",
        name: "Váy hoa nhí Vintage dáng dài-Đỏ-M",
        productType: {
          id: "TYPE-003",
          name: "Váy",
          status: "inactive",
          createdAt: new Date("2023-12-20T09:00:00Z"),
          updatedAt: new Date("2024-03-01T11:20:00Z"),
        },
        initialPrice: 320000,
        salePrice: 580000,
        quantity: 20,
        description: "Thiết kế nữ tính, phù hợp đi chơi, dạo phố",
        barcode: "DRESS-VIN-003-3",
        status: "inactive",
        attributes: [
          { id: "attr-01", value: "Đỏ" },
          { id: "attr-05", value: "M" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

// export const MOCK_FLATTENED_PRODUCTS: Product[] = [
//   // --- SẢN PHẨM CHA 1: QUẦN BÒ ---
//   {
//     id: "QB11",
//     name: "Quần bò Baggy Nam ống rộng",
//     productType: {
//       id: "TYPE-001",
//       name: "Quần bò",
//       status: "active",
//       createdAt: new Date("2024-01-01T10:00:00Z"),
//       updatedAt: new Date("2024-01-05T15:30:00Z"),
//     },
//     initialPrice: 250000,
//     salePrice: 450000,
//     quantity: 100,
//     description: "Chất liệu denim dày dặn, phong cách Hàn Quốc",
//     barcode: "JEAN-BAG-001",
//     status: "active",
//     createdAt: new Date("2024-01-01T10:00:00Z"),
//     updatedAt: new Date("2024-01-05T15:30:00Z"),
//     parent: null,
//   },
//   // BIẾN THỂ CỦA QB11
//   {
//     id: "QB11-1",
//     name: "Quần bò Baggy Nam ống rộng-Đỏ-XL",
//     parent: { id: "QB11", name: "Quần bò Baggy Nam ống rộng" },
//     productType: { id: "TYPE-001", name: "Quần bò", status: "active", createdAt: new Date("2024-01-01T10:00:00Z"), updatedAt: new Date("2024-01-05T15:30:00Z") },
//     initialPrice: 250000,
//     salePrice: 450000,
//     quantity: 30,
//     barcode: "JEAN-BAG-001-1",
//     status: "active",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-03", value: "XL" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "QB11-2",
//     name: "Quần bò Baggy Nam ống rộng-Xanh dương-XL",
//     parent: { id: "QB11", name: "Quần bò Baggy Nam ống rộng" },
//     productType: { id: "TYPE-001", name: "Quần bò", status: "active", createdAt: new Date("2024-01-01T10:00:00Z"), updatedAt: new Date("2024-01-05T15:30:00Z") },
//     initialPrice: 250000,
//     salePrice: 450000,
//     quantity: 40,
//     barcode: "JEAN-BAG-001-2",
//     status: "active",
//     attributes: [{ id: "attr-02", value: "Xanh dương" }, { id: "attr-03", value: "XL" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "QB11-3",
//     name: "Quần bò Baggy Nam ống rộng-Đỏ-L",
//     parent: { id: "QB11", name: "Quần bò Baggy Nam ống rộng" },
//     productType: { id: "TYPE-001", name: "Quần bò", status: "active", createdAt: new Date("2024-01-01T10:00:00Z"), updatedAt: new Date("2024-01-05T15:30:00Z") },
//     initialPrice: 250000,
//     salePrice: 450000,
//     quantity: 30,
//     barcode: "JEAN-BAG-001-3",
//     status: "active",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-04", value: "L" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },

//   // --- SẢN PHẨM CHA 2: ÁO PHÔNG ---
//   {
//     id: "AP11",
//     name: "Áo phông Unisex Cotton 100%",
//     productType: {
//       id: "TYPE-002",
//       name: "ÁO phông",
//       status: "active",
//       createdAt: new Date("2024-02-10T08:00:00Z"),
//       updatedAt: new Date("2024-02-10T08:00:00Z"),
//     },
//     initialPrice: 85000,
//     salePrice: 160000,
//     quantity: 200,
//     description: "Áo thun basic, thấm hút mồ hôi tốt",
//     barcode: "TSHIRT-UNI-002",
//     status: "active",
//     createdAt: new Date("2024-02-10T08:00:00Z"),
//     updatedAt: new Date("2024-02-10T08:00:00Z"),
//     parent: null,
//   },
//   // BIẾN THỂ CỦA AP11
//   {
//     id: "AP11-1",
//     name: "Áo phông Unisex Cotton 100%-Đỏ-XL",
//     parent: { id: "AP11", name: "Áo phông Unisex Cotton 100%" },
//     productType: { id: "TYPE-002", name: "ÁO phông", status: "active", createdAt: new Date("2024-02-10T08:00:00Z"), updatedAt: new Date("2024-02-10T08:00:00Z") },
//     initialPrice: 85000,
//     salePrice: 160000,
//     quantity: 60,
//     barcode: "TSHIRT-UNI-002-1",
//     status: "active",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-03", value: "XL" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "AP11-2",
//     name: "Áo phông Unisex Cotton 100%-Xanh dương-XL",
//     parent: { id: "AP11", name: "Áo phông Unisex Cotton 100%" },
//     productType: { id: "TYPE-002", name: "ÁO phông", status: "active", createdAt: new Date("2024-02-10T08:00:00Z"), updatedAt: new Date("2024-02-10T08:00:00Z") },
//     initialPrice: 85000,
//     salePrice: 160000,
//     quantity: 70,
//     barcode: "TSHIRT-UNI-002-2",
//     status: "active",
//     attributes: [{ id: "attr-02", value: "Xanh dương" }, { id: "attr-03", value: "XL" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "AP11-3",
//     name: "Áo phông Unisex Cotton 100%-Đỏ-M",
//     parent: { id: "AP11", name: "Áo phông Unisex Cotton 100%" },
//     productType: { id: "TYPE-002", name: "ÁO phông", status: "active", createdAt: new Date("2024-02-10T08:00:00Z"), updatedAt: new Date("2024-02-10T08:00:00Z") },
//     initialPrice: 85000,
//     salePrice: 160000,
//     quantity: 70,
//     barcode: "TSHIRT-UNI-002-3",
//     status: "active",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-05", value: "M" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },

//   // --- SẢN PHẨM CHA 3: VÁY ---
//   {
//     id: "VH11",
//     name: "Váy hoa nhí Vintage dáng dài",
//     productType: {
//       id: "TYPE-003",
//       name: "Váy",
//       status: "inactive",
//       createdAt: new Date("2023-12-20T09:00:00Z"),
//       updatedAt: new Date("2024-03-01T11:20:00Z"),
//     },
//     initialPrice: 320000,
//     salePrice: 580000,
//     quantity: 50,
//     description: "Thiết kế nữ tính, phù hợp đi chơi, dạo phố",
//     barcode: "DRESS-VIN-003",
//     status: "inactive",
//     createdAt: new Date("2023-12-20T09:00:00Z"),
//     updatedAt: new Date("2024-03-01T11:20:00Z"),
//     parent: null,
//   },
//   // BIẾN THỂ CỦA VH11
//   {
//     id: "VH11-1",
//     name: "Váy hoa nhí Vintage dáng dài-Đỏ-S",
//     parent: { id: "VH11", name: "Váy hoa nhí Vintage dáng dài" },
//     productType: { id: "TYPE-003", name: "Váy", status: "inactive", createdAt: new Date("2023-12-20T09:00:00Z"), updatedAt: new Date("2024-03-01T11:20:00Z") },
//     initialPrice: 320000,
//     salePrice: 580000,
//     quantity: 15,
//     barcode: "DRESS-VIN-003-1",
//     status: "inactive",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-06", value: "S" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "VH11-2",
//     name: "Váy hoa nhí Vintage dáng dài-Xanh dương-S",
//     parent: { id: "VH11", name: "Váy hoa nhí Vintage dáng dài" },
//     productType: { id: "TYPE-003", name: "Váy", status: "inactive", createdAt: new Date("2023-12-20T09:00:00Z"), updatedAt: new Date("2024-03-01T11:20:00Z") },
//     initialPrice: 320000,
//     salePrice: 580000,
//     quantity: 15,
//     barcode: "DRESS-VIN-003-2",
//     status: "inactive",
//     attributes: [{ id: "attr-02", value: "Xanh dương" }, { id: "attr-06", value: "S" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "VH11-3",
//     name: "Váy hoa nhí Vintage dáng dài-Đỏ-M",
//     parent: { id: "VH11", name: "Váy hoa nhí Vintage dáng dài" },
//     productType: { id: "TYPE-003", name: "Váy", status: "inactive", createdAt: new Date("2023-12-20T09:00:00Z"), updatedAt: new Date("2024-03-01T11:20:00Z") },
//     initialPrice: 320000,
//     salePrice: 580000,
//     quantity: 20,
//     barcode: "DRESS-VIN-003-3",
//     status: "inactive",
//     attributes: [{ id: "attr-01", value: "Đỏ" }, { id: "attr-05", value: "M" }],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];
