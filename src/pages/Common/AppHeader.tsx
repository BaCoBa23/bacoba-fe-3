
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAppContext } from "@/context/AppContext";

function AppHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="md:px-12 sticky top-0 z-50 w-full border-b border-border/40 bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 justify-between items-center px-4">
        <div className="basis-1/2 h-full">
          <img
            src={"logo"}
            alt="logo"
            className="h-full w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="basis-1/2 flex justify-end items-center gap-4">
          <div className="hidden md:block">
            {isAuthenticated && user && (
              <span className="text-sm text-muted-foreground">
                Xin chào, <strong>{user.username}</strong>
              </span>
            )}
          </div>

          <ModeToggle />
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            ) : (
              <>
                <Button
                  className="bg-background text-primary border border-border hover:bg-primary hover:text-white"
                  variant="outline"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button variant="ghost">
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
