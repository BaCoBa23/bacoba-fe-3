import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

// Sử dụng environment variable trong production, mặc định là http://localhost:5555
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555/api/v1";

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Thêm token vào header trước khi gửi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý response từ server
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Nếu token hết hạn (401), xóa token và redirect về login
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ===== PRODUCT SERVICES =====
export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: number;
  typeId?: number;
  status?: string;
  order?: Record<string, "asc" | "desc">;
}

export interface ProductResponse {
  id: string;
  name: string;
  parentId?: string | null;
  productTypeId: number;
  brandId: number;
  initialPrice: number;
  salePrice: number;
  quantity: number;
  description?: string;
  barcode?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  type: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: ProductResponse[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

// Get danh sách sản phẩm
export const getProducts = async (params?: GetProductsParams) => {
  try {
    const response = await apiClient.get<ProductsApiResponse>("/products", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get chi tiết sản phẩm
export const getProductById = async (id: string) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Create sản phẩm mới
export const createProduct = async (data: any) => {
  try {
    const response = await apiClient.post("/products", data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update sản phẩm
export const updateProduct = async (id: string, data: any) => {
  try {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete sản phẩm
export const deleteProduct = async (id: string) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// ===== PROVIDER SERVICES =====
export interface GetProvidersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  order?: Record<string, "asc" | "desc">;
}

export interface ProviderResponse {
  id: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  debtTotal: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderInput {
  name: string;
  phoneNumber?: string;
  email?: string;
  debtTotal?: number;
  total?: number;
  status?: string;
}

export interface UpdateProviderInput {
  name?: string;
  phoneNumber?: string;
  email?: string;
  debtTotal?: number;
  total?: number;
  status?: string;
}

export interface ProvidersApiResponse {
  success: boolean;
  message: string;
  data: ProviderResponse[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProviderDetailResponse {
  success: boolean;
  message: string;
  data: ProviderResponse;
}

// Get danh sách nhà cung cấp
export const getProviders = async (params?: GetProvidersParams) => {
  try {
    const response = await apiClient.get<ProvidersApiResponse>("/providers", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
};

// Get chi tiết nhà cung cấp
export const getProviderById = async (id: number) => {
  try {
    const response = await apiClient.get<ProviderDetailResponse>(
      `/providers/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error);
    throw error;
  }
};

// Create nhà cung cấp mới
export const createProvider = async (data: CreateProviderInput) => {
  try {
    const response = await apiClient.post<ProviderDetailResponse>(
      "/providers",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};

// Update nhà cung cấp
export const updateProvider = async (
  id: number,
  data: UpdateProviderInput
) => {
  try {
    const response = await apiClient.put<ProviderDetailResponse>(
      `/providers/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating provider ${id}:`, error);
    throw error;
  }
};

// Delete nhà cung cấp
export const deleteProvider = async (id: number) => {
  try {
    const response = await apiClient.delete(`/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting provider ${id}:`, error);
    throw error;
  }
};

// ===== HISTORY PROVIDER SERVICES =====
export interface HistoryProviderResponse {
  id: number;
  providerId: number;
  paidAmount: number;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHistoryInput {
  providerId: number;
  paidAmount: number;
  description?: string;
  status?: string;
}

export interface UpdateHistoryInput {
  paidAmount?: number;
  description?: string;
  status?: string;
}

export interface HistoryProvidersApiResponse {
  success: boolean;
  message: string;
  data: HistoryProviderResponse[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface HistoryDetailResponse {
  success: boolean;
  message: string;
  data: HistoryProviderResponse;
}

// Get danh sách lịch sử thanh toán (tất cả)
export const getHistoryProviders = async (params?: GetProvidersParams) => {
  try {
    const response = await apiClient.get<HistoryProvidersApiResponse>(
      "/history-providers",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching history providers:", error);
    throw error;
  }
};

// Get lịch sử thanh toán của một nhà cung cấp
export const getHistoryProvidersByProviderId = async (
  providerId: number,
  params?: GetProvidersParams
) => {
  try {
    const response = await apiClient.get<HistoryProvidersApiResponse>(
      `/history-providers/provider/${providerId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching history providers for provider ${providerId}:`,
      error
    );
    throw error;
  }
};

// Get chi tiết lịch sử
export const getHistoryProviderById = async (id: number) => {
  try {
    const response = await apiClient.get<HistoryDetailResponse>(
      `/history-providers/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching history provider ${id}:`, error);
    throw error;
  }
};

// Create lịch sử thanh toán mới
export const createHistoryProvider = async (data: CreateHistoryInput) => {
  try {
    const response = await apiClient.post<HistoryDetailResponse>(
      "/history-providers",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating history provider:", error);
    throw error;
  }
};

// Update lịch sử thanh toán
export const updateHistoryProvider = async (
  id: number,
  data: UpdateHistoryInput
) => {
  try {
    const response = await apiClient.put<HistoryDetailResponse>(
      `/history-providers/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating history provider ${id}:`, error);
    throw error;
  }
};

// Delete lịch sử thanh toán
export const deleteHistoryProvider = async (id: number) => {
  try {
    const response = await apiClient.delete(`/history-providers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting history provider ${id}:`, error);
    throw error;
  }
};

// ===== RECEIVED NOTES SERVICES =====
export interface GetReceivedNotesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  providerId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReceivedProductResponse {
  id: string;
  productId: string;
  productName: string;
  addQuantity: number;
  discount: number;
  description?: string | null;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReceivedNoteResponse {
  id: string;
  provider: ProviderResponse;
  phoneNumber: string | null;
  discount: number;
  payedMoney: number;
  debtMoney: number;
  total: number;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  receivedProducts: ReceivedProductResponse[];
}

export interface CreateReceivedNoteInput {
  providerId: string;
  phoneNumber?: string;
  discount: number;
  payedMoney: number;
  status?: string;
  description?: string;
  receivedProducts: Array<{
    productId: string;
    addQuantity: number;
    discount: number;
    description?: string;
  }>;
}

export interface UpdateReceivedNoteInput {
  providerId?: string;
  phoneNumber?: string;
  discount?: number;
  payedMoney?: number;
  status?: string;
  description?: string;
  receivedProducts?: Array<{
    productId: string;
    addQuantity: number;
    discount: number;
    description?: string;
  }>;
}

export interface ReceivedNotesApiResponse {
  success: boolean;
  message: string;
  data: ReceivedNoteResponse[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ReceivedNoteDetailResponse {
  success: boolean;
  message: string;
  data: ReceivedNoteResponse;
}

// Get danh sách phiếu nhập
export const getReceivedNotes = async (params?: GetReceivedNotesParams) => {
  try {
    const response = await apiClient.get<ReceivedNotesApiResponse>(
      "/received-notes",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching received notes:", error);
    throw error;
  }
};

// Get chi tiết phiếu nhập
export const getReceivedNoteById = async (id: string) => {
  try {
    const response = await apiClient.get<ReceivedNoteDetailResponse>(
      `/received-notes/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching received note ${id}:`, error);
    throw error;
  }
};

// Create phiếu nhập mới
export const createReceivedNote = async (data: CreateReceivedNoteInput) => {
  try {
    const response = await apiClient.post<ReceivedNoteDetailResponse>(
      "/received-notes",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating received note:", error);
    throw error;
  }
};

// Update phiếu nhập
export const updateReceivedNote = async (
  id: string,
  data: UpdateReceivedNoteInput
) => {
  try {
    const response = await apiClient.put<ReceivedNoteDetailResponse>(
      `/received-notes/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating received note ${id}:`, error);
    throw error;
  }
};

// Delete phiếu nhập
export const deleteReceivedNote = async (id: string) => {
  try {
    const response = await apiClient.delete(`/received-notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting received note ${id}:`, error);
    throw error;
  }
};

export default apiClient;
