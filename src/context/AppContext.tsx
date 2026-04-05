
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";




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
