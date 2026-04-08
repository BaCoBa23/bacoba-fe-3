import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/services/authService";
import { loginUser, logout as logoutService, getAuthState } from "@/services/authService";

interface AppContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khởi tạo auth state từ localStorage
  useEffect(() => {
    const authState = getAuthState();
    setUser(authState.user);
    setToken(authState.token);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  // Hàm login
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser(username, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Hàm logout
  const handleLogout = () => {
    logoutService();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value: AppContextType = {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext phải được sử dụng bên trong <AppProvider>");
  }
  return context;
};

export default AppContext;
