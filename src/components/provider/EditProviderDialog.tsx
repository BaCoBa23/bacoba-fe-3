import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  UserCog,
  Phone,
  Mail,
  ShieldCheck,
  Info,
  Save,
  // Edit,
  Edit2,
} from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import type { Provider } from "@/types";
import { editProviders } from "@/services/api";

// import { Textarea } from "../ui/textarea";

// Giả định cấu trúc Provider từ danh sách của bạn


interface EditProviderDialogProps {
  provider: Provider;
  trigger?: React.ReactNode; // Cho phép tùy biến nút bấm mở dialog
  onSuccess?: () => void;
}

function EditProviderDialog({ provider,onSuccess }: EditProviderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const FormSchema = z.object({
    name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
    phoneNumber: z.string().optional().nullable(),
    email: z
      .string()
      .email("Email không hợp lệ")
      .optional()
      .or(z.literal(""))
      .nullable(),
    status: z.enum(["active", "inactive"]), // Giữ nguyên để hiển thị nhưng có thể không gửi
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: provider.name,
      phoneNumber: provider.phoneNumber || "",
      email: provider.email || "",
      status: provider.status as "active" | "inactive",
    },
  });

  // Cập nhật lại form khi provider prop thay đổi
  
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: provider.name,
        phoneNumber: provider.phoneNumber || "",
        email: provider.email || "",
        status: provider.status as "active" | "inactive",
      });
    }
  }, [provider, form, isOpen]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Chỉ lấy 3 trường dữ liệu như yêu cầu
      const payload = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        status: data.status, // Thêm status nếu backend yêu cầu hoặc bỏ ra nếu chỉ muốn 3 cái trên
      };

      const response = await editProviders(provider.id, payload as any);

      if (response.success) {
        toast.success("Cập nhật thông tin thành công");
        const newData = response.data as unknown as Provider;
        if (onSuccess) {
          onSuccess();
        }
        setIsOpen(false);
        // Có thể gọi hàm reload data ở đây nếu cần
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật nhà cung cấp");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="">
          <Edit2 className="w-4 h-4" /> Chỉnh sửa thông tin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col bg-background"
          >
            {/* Header Section */}
            <div className="p-6 bg-primary text-primary-foreground">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <UserCog className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      Chỉnh sửa nhà cung cấp
                    </DialogTitle>
                    <DialogDescription className="text-primary-foreground/80">
                      Cập nhật thông tin chi tiết cho đối tác:{" "}
                      <span className="font-bold text-background  uppercase">
                        {provider.id}
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Dashboard tóm tắt (Chỉ đọc) */}
            <div className="px-6 py-4 bg-secondary/30 grid grid-cols-2 gap-4 border-b">
              <div className="p-3 bg-card rounded-xl border shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">
                  Tổng giá trị nhập
                </p>
                <p className="text-sm font-bold text-primary">
                  {formatVND(provider.total)}
                </p>
              </div>
              <div className="p-3 bg-card rounded-xl border shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">
                  Nợ hiện tại
                </p>
                <p className="text-sm font-bold text-destructive">
                  {formatVND(provider.debtTotal)}
                </p>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên nhà cung cấp */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-bold">
                        Tên nhà cung cấp (*)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Số điện thoại */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Trạng thái */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-bold flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                        Trạng thái hoạt động
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Đang hoạt động</SelectItem>
                          <SelectItem value="inactive">
                            Ngừng hoạt động
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông báo nhắc nhở */}
              <div className="flex items-start gap-3 p-4 bg-accent rounded-xl border border-border">
                <Info className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-accent-foreground/80 leading-relaxed italic">
                  Thay đổi trạng thái sang "Ngừng hoạt động" sẽ ẩn nhà cung cấp
                  này khỏi các danh sách chọn khi nhập hàng nhưng không làm mất
                  lịch sử giao dịch cũ.
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="p-6 border-t bg-secondary/20 flex items-center justify-between">
              <div></div>
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="px-6 font-semibold"
                  >
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:opacity-90 px-8 shadow-lg shadow-primary/20 font-bold gap-2"
                >
                  <Save className="w-4 h-4" /> Lưu thay đổi
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProviderDialog;
