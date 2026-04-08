
import { useAppContext } from "@/context/AppContext";

function HomePage() {
  const { user } = useAppContext();

  return (
    <div className="w-full py-10">
      <div className="container mx-auto px-4">
        <div className="bg-muted rounded-lg p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Chào mừng, {user?.username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Bạn đã đăng nhập thành công vào hệ thống Quản lý Kho.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
