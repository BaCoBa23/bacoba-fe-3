import { Toaster } from "sonner";
import "./App.css";
import { ThemeProvider } from "./components/theme/theme-provider";

import AppHeader from "./pages/Common/AppHeader";
import AppRoutes from "./router";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col w-full">
        <AppHeader />
        <div className="min-h-[calc(100vh-100px)] w-full">
          <AppRoutes />
        </div>

      </div>
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}

export default App;
