import type { Attribute, AttributeType, Product, ProductType, Provider } from "@/types";
import type { HistoryProvider } from "@/types/HistoryProvider";
import type { ReceivedNote } from "@/types/ReceivedNote";
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

export interface ProductAttribute {
  id: string;
  value: string;
}

export interface CreateProductParams {
  name: string;
  productTypeId: string;
  brandId: string;
  initialPrice: number;
  salePrice: number;
  description: string;
  attributes: ProductAttribute[][]; 
}


export const createProduct = async (params?: CreateProductParams) => {
  try {
    const response = await apiClient.post<ProductsApiResponse>("/products", 
      params,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// product Type
export interface ProductTypesApiResponse {
  success: boolean;
  message: string;
  data: ProductType[];
}

export interface CreateProductTypes {
  name: string;

}

export const getProductTypes = async () => {
  try {
    const response = await apiClient.get<ProductTypesApiResponse>("/product-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProductType = async (params:CreateProductTypes) => {
  try {
    const response = await apiClient.post<ProductTypesApiResponse>("/product-types",params);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const editProductType = async (id:string,params:CreateProductTypes) => {
  try {
    const response = await apiClient.put<ProductTypesApiResponse>(`/product-types/${id}`,params);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// attributeTypes
export interface AttributeTypesApiResponse {
  success: boolean;
  message: string;
  data: AttributeType[];
}
export interface CreateAttributeTypes {
  name: string;

}

export const createAttributeType = async (params:CreateAttributeTypes) => {
  try {
    const response = await apiClient.post<AttributeTypesApiResponse>("/attribute-types",params);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAttributeTypes = async () => {
  try {
    const response = await apiClient.get<AttributeTypesApiResponse>("/attribute-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const editAttributeType = async (id:string,params:CreateAttributeTypes) => {
  try {
    const response = await apiClient.put<ProductTypesApiResponse>(`/attribute-types/${id}`,params);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// attribute
export interface AttributesApiResponse {
  success: boolean;
  message: string;
  data: Attribute[];
}

export const getAttributes = async () => {
  try {
    const response = await apiClient.get<AttributesApiResponse>("/attributes");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// received-notes
export interface ReceivedNotesApiResponse {
  success: boolean;
  message: string;
  data: ReceivedNote[];
  meta: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export const getReceivedNotes = async (params?:GetProductsParams) => {
  try {
    // Đổi AttributesApiResponse thành ReceivedNotesApiResponse
    const response = await apiClient.get<ReceivedNotesApiResponse>("/received-notes",{params,});
    return response.data;
  } catch (error) {
    // Cập nhật log lỗi cho đúng ngữ cảnh (Received Notes thay vì Products)
    console.error("Error fetching received notes:", error);
    throw error;
  }
};

// Provider
export interface ProvidersApiResponse {
  success: boolean;
  message: string;
  data: Provider[];
  meta: {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CreateProvidersParams {
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  status: "active" | "inactive"; 
  debtTotal: number;
  total: number;
}


export const getProviders = async (params?:GetProductsParams) => {
  try {
    // Đổi AttributesApiResponse thành ReceivedNotesApiResponse
    const response = await apiClient.get<ProvidersApiResponse>("/providers",{params});
    return response.data;
  } catch (error) {
    // Cập nhật log lỗi cho đúng ngữ cảnh (Received Notes thay vì Products)
    console.error("Error fetching provider :", error);
    throw error;
  }
};

export const createProviders = async (params?:CreateProvidersParams) => {
  try {
    // Đổi AttributesApiResponse thành ReceivedNotesApiResponse
    const response = await apiClient.post<ProvidersApiResponse>("/providers",params);
    return response.data;
  } catch (error) {
    // Cập nhật log lỗi cho đúng ngữ cảnh (Received Notes thay vì Products)
    console.error("Error create  provider:", error);
    throw error;
  }
};

export const editProviders = async (id:string,params:CreateProvidersParams) => {
  try {
    const response = await apiClient.put<ProductTypesApiResponse>(`/providers/${id}`,params);
    return response.data;
  } catch (error) {
    console.error("Error fetching provider:", error);
    throw error;
  }
};

// History Provider
export interface HistoryProvidersApiResponse {
  success: boolean;
  message: string;
  data: HistoryProvider[];
}

export interface CreateHistoryProvidersParams 
  {
    providerId: string;
    paidAmount: number;
    description?: string | null ;
    status?: "active";
  }



  export const getHistoryProviders = async () => {
    try {
      const response = await apiClient.get<HistoryProvidersApiResponse>("/history-providers");
      return response.data;
    } catch (error) {
      console.error("Error fetching history providers:", error);
      throw error;
    }
  };
  
  export const createHistoryProviders = async (params: CreateHistoryProvidersParams) => {
    try {
      const response = await apiClient.post<HistoryProvidersApiResponse>("/history-providers", params);
      return response.data;
    } catch (error) {
      console.error("Error creating history provider:", error);
      throw error;
    }
  };
  
  export const editHistoryProviders = async (id: string, params: CreateHistoryProvidersParams) => {
    try {
      const response = await apiClient.put<HistoryProvidersApiResponse>(`/history-providers/${id}`, params);
      return response.data;
    } catch (error) {
      console.error("Error updating history provider:", error);
      throw error;
    }
  };

export default apiClient;
