
import React, {
  createContext,

  useContext,

  type ReactNode,
} from "react";





interface AppContextType {
 
}

const AppContext = createContext<AppContextType>({
  
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

  return (
    <AppContext.Provider
      value={{
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContext;
