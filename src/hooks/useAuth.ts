import { useAppContext } from "@/context/AppContext";

/**
 * Hook để sử dụng authentication ở bất kỳ component nào
 */
export const useAuth = () => {
  const context = useAppContext();

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong <AppProvider>");
  }

  return {
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
  };
};
