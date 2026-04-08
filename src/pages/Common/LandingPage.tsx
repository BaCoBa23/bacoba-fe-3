import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().trim().min(1, {
    message: "Tên đăng nhập không được để trống",
  }),
  password: z.string().trim().min(1, {
    message: "Mật khẩu không được để trống",
  }),
});

export const LandingPage = () => {
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAppContext();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLogin = async ({ username, password }: z.infer<typeof loginSchema>) => {
    setLoginLoading(true);
    try {
      const success = await login(username, password);

      if (success) {
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không chính xác!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Đăng nhập thất bại!";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không?";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/quan-ly-kho.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative z-10 w-full">
        <div className="flex flex-col items-center">
          {/* Card form */}
          <div className="flex justify-center w-full px-5">
            <Card className="w-full max-w-md bg-white border-0 shadow-lg rounded-lg">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance text-gray-800">
                    Đăng nhập
                  </h1>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onLogin)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Đăng Nhập</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên đăng nhập..."
                              className="my-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              placeholder="Nhập mật khẩu..."
                              className="mt-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loginLoading ? (
                      <Button type="submit" className="w-full" disabled>
                        <Loader2 className="animate-spin mr-2" />
                        Vui lòng chờ
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                      >
                        Đăng nhập
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
