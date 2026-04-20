import type { Product } from "@/types";
import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

// Sử dụng path relative trong development (proxy sẽ xử lý)
// Sử dụng environment variable trong production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

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

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: number;
  typeId?: number;
  status?: string;
  order?: Record<string, "asc" | "desc">;
}


export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

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

export default apiClient;
