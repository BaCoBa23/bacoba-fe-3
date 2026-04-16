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
  price: number;
  quantity: number;
  description?: string;
  barcode?: string;
  brandId?: number;
  productTypeId?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export default apiClient;
