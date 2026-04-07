
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,

} from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";



export const LandingPage = () => {
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const navigate = useNavigate();
//   const hasRun = useRef(false);

//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const redirectPath = searchParams.get("redirect") || "";

  const loginSchema = z.object({
    username: z.string().trim().min(1, {
      message: "Tên đăng nhập không được để trống",
    }),
    password: z.string().trim().min(1, {
      message: "Mật khẩu không được để trống",
    }),
  });
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
      const loginData = {
        username: username,
        password: password,
      };
      
      console.log("Sending login data:", loginData);
      
      const response = await axios.post(
        "/api/v1/users/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Đăng nhập thành công!");
        console.log("Login response:", response.data);
        // Lưu token nếu có
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }
        setLoginLoading(false);
        navigate("/home");
      }
    } catch (error: any) {
      setLoginLoading(false);
      console.log("Full error response:", error.response);
      console.log("Error data:", JSON.stringify(error.response?.data, null, 2));
      console.log("Error status:", error.response?.status);
      
      let errorMessage = "Đăng nhập thất bại!";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.response?.status === 400) {
        errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không?";
      }
      
      alert(errorMessage);
      console.log("Login error:", error);
    }
  };

//   useEffect(() => {
//     // cho toast hien thi 1 lan duy nhat
//     if (hasRun.current) return;
//     hasRun.current = true;

//     const urlParams = new URLSearchParams(window.location.search);
//     const isLoginByGoogle = urlParams.get("isLoginByGoogle");
//     const message = urlParams.get("message");

//     if (isLoginByGoogle === "false") {
//       setLoginLoading(false);
//       setTimeout(() => {
//         setLoginLoading(false);
//         toast.error(message);
//       }, 200);
//     }

//     if (isLoginByGoogle === "true") {
//       setLoginLoading(true);
//       axios
//         .get(`${authAPI}/getUserByAccessToken`, { withCredentials: true })
//         .then((res) => {
//           const { user, accessToken } = res.data;
//           switch (user.status) {
//             case "verifying":
//               setLoginLoading(false);
//               toast.error(
//                 "Tài khoản của bạn chưa kích hoạt! Hãy kích hoạt thông qua email"
//               );
//               break;
//             case "banned":
//               setLoginLoading(false);
//               toast.error("Tài khoản của bạn đã bị khóa!");
//               break;
//             default:
//               toast.success("Đăng nhập bằng tài khoản google thành công!");
//               setTimeout(() => {
//                 setLoginLoading(false);
//                 login(accessToken, user);

//                 const redirectPath = localStorage.getItem("redirectAfterLogin");
//                 if (redirectPath) {
//                   localStorage.removeItem("redirectAfterLogin");
//                   navigate(redirectPath);
//                 } else {
//                   navigate("/home");
//                 }
//                 navigate(
//                   redirectPath ? decodeURIComponent(redirectPath) : "/home"
//                 );
//               }, 200);
//               break;
//           }
//         })
//         .catch((error) => {
//           console.log(error?.response.data.message);
//         });
//     }
//   }, []);

//   const sendActiveToken = async (activeToken: string) => {
//     try {
//       const res = await axios.post(`${authAPI}/send-activation-email`, {
//         activeToken: activeToken,
//       });
//       toast.success(res?.data.message);
//     } catch (error: any) {
//       console.log(error?.response.data.message);
//     }
//   };

//   const onLogin = async ({ email, password }: z.infer<typeof loginSchema>) => {
//     setLoginLoading(true);
//     try {
//       const response = await axios.post(`${authAPI}/login`, {
//         email: email,
//         password: password,
//         type: "user",
//       });

//       if (response.status === 200) {
//         toast.success("Đăng nhập thành công!");
//         login(response.data.accessToken, response.data.user);
//         setTimeout(() => {
//           setLoginLoading(false);
//           const redirectPath = localStorage.getItem("redirectAfterLogin");
//           if (redirectPath) {
//             localStorage.removeItem("redirectAfterLogin");
//             navigate(redirectPath);
//           } else {
//             navigate("/home");
//           }
//         }, 200);
//       }
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         toast.error(error?.response.data.message);
//       } else {
//         toast.error(error?.response.data.message, {
//           description: "Gửi lại mã xác nhận ?",
//           action: {
//             label: "Gửi lại",
//             onClick: () => sendActiveToken(error?.response.data.activeToken),
//           },
//         });
//       }
//       setLoginLoading(false);
//     }
//   };

//   function handleGoogleLogin() {
//     const searchParams = new URLSearchParams(location.search);
//     const redirectPaths = searchParams.get("redirect") || "";
//     window.open(
//       `${authAPI}/loginByGoogle?redirect=${decodeURIComponent(redirectPaths)}`,
//       "_self"
//     );
//   }
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
          <div className="flex  justify-center w-full px-5">
            <Card className="w-full max-w-md bg-white border-0 shadow-lg rounded-lg">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance text-gray-800">
                    Đăng nhập
                  </h1>
                </div>
                <Form 
                {...form}
                >
                  <form
                    onSubmit={form.handleSubmit(onLogin)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={(
                        { field }
                    ) => (
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
                      render={(
                        { field }

                      ) => (
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
