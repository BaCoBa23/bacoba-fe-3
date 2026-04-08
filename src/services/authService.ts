import apiClient from "./api";

export interface User {
  id: number;
  username: string;
  status: "active" | "inactive" | "banned";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    user: User;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * Đăng nhập với username và password
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/users/login", {
      username,
      password,
    });

    if (response.data.success && response.data.data) {
      // Lưu token vào localStorage
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Lấy thông tin user hiện tại (từ localStorage)
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Lấy token hiện tại
 */
export const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/**
 * Kiểm tra xem user có đăng nhập hay không
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Đăng xuất
 */
export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

/**
 * Lấy current auth state
 */
export const getAuthState = (): AuthState => {
  const user = getCurrentUser();
  const token = getToken();
  return {
    user,
    token,
    isAuthenticated: !!token,
  };
};
