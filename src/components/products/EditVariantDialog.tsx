// import { editVariant } from "@/services/api"; // Giả định service của bạn

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  DollarSign,
  Edit2,
  Info,
  Package,
  Save,
  Tag,
  TrendingUp,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { editProduct } from "@/services/api";

interface EditVariantDialogProps {
  variant: any; // Thay 'any' bằng interface Variant của bạn
  onSuccess?: () => void;
}

function EditVariantDialog({ variant, onSuccess }: EditVariantDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Schema chỉ tập trung vào thay đổi giá
  const FormSchema = z.object({
    initialPrice: z.coerce.number().min(0, "Giá vốn không được âm"),
    salePrice: z.coerce.number().min(0, "Giá bán không được âm"),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      initialPrice: variant?.initialPrice ?? 0,
      salePrice: variant?.salePrice ?? 0,
    },
  });

  // Reset form khi mở dialog hoặc variant thay đổi
  useEffect(() => {
    if (isOpen && variant) {
      form.reset({
        initialPrice: variant.initialPrice,
        salePrice: variant.salePrice,
      });
    }
  }, [variant, form, isOpen]);

  // Chuyển số thành chuỗi format: 1000000 -> "1.000.000"
  const formatNumber = (value: string | number) => {
    if (!value) return "";
    const stringValue = value.toString().replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải số
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Chuyển chuỗi format ngược lại thành số: "1.000.000" -> 1000000
  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, "")) || 0;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // 2. Thực hiện gọi API với variant.id và dữ liệu từ form
      await editProduct(variant.id, data);

      // 3. Thông báo thành công
      toast.success("Cập nhật giá biến thể thành công!");

      // 4. Gọi callback để load lại danh sách ở trang cha (nếu có)
      if (onSuccess) onSuccess();

      // 5. Đóng Dialog
      setIsOpen(false);
    } catch (error: any) {
      console.error("Lỗi khi update variant:", error);

      // 6. Xử lý thông báo lỗi từ server trả về
      const errorMessage =
        error.response?.data?.message || "Không thể cập nhật biến thể";
      toast.error(errorMessage);
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

  // Tính toán các giá trị hiển thị
  const watchedSalePrice = form.watch("salePrice") || 0;
  const watchedInitialPrice = form.watch("initialPrice") || 0;
  const profit = watchedSalePrice - watchedInitialPrice;
  const profitMargin =
    watchedSalePrice > 0 ? (profit / watchedSalePrice) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-start px-2 font-normal"
        >
          <Edit2 className="mr-2 h-4 w-4" /> Sửa biến thể
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col bg-background"
          >
            {/* Header Section - Sử dụng màu Primary của hệ thống */}
            <div className="p-6 bg-primary text-primary-foreground">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Tag className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      Điều chỉnh giá biến thể
                    </DialogTitle>
                    <DialogDescription className="text-primary-foreground/80">
                      Mã:{" "}
                      <span className="font-mono font-bold">{variant.id}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Thông tin sản phẩm hiện tại */}
            <div className="px-6 py-4 bg-muted/50 flex items-center gap-3 border-b">
              <Package className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">
                  Biến thể
                </p>
                <p className="text-sm font-bold">{variant.name}</p>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Giá vốn */}
                <FormField
                  control={form.control}
                  name="initialPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                        Giá vốn (Giá nhập)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text" // Chuyển sang text để hiển thị dấu chấm
                            placeholder="0"
                            className="h-12 pl-4 pr-12 font-bold text-lg text-primary border-primary/20"
                            {...field}
                            // 1. Hiển thị giá trị đã được format
                            value={formatNumber(field.value)}
                            // 2. Khi gõ, xóa dấu chấm rồi mới lưu vào form state
                            onChange={(e) => {
                              const rawValue = parseNumber(e.target.value);
                              field.onChange(rawValue);
                            }}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        Hiện tại: {formatVND(variant.initialPrice)}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Giá bán */}
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2 text-primary">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Giá bán niêm yết
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text" // Chuyển sang text để hiển thị dấu chấm
                            placeholder="0"
                            className="h-12 pl-4 pr-12 font-bold text-lg text-primary border-primary/20"
                            {...field}
                            // 1. Hiển thị giá trị đã được format
                            value={formatNumber(field.value)}
                            // 2. Khi gõ, xóa dấu chấm rồi mới lưu vào form state
                            onChange={(e) => {
                              const rawValue = parseNumber(e.target.value);
                              field.onChange(rawValue);
                            }}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-medium">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        Hiện tại: {formatVND(variant.salePrice)}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gợi ý lợi nhuận - Sử dụng màu Accent hoặc trạng thái success */}
              {watchedSalePrice > 0 && (
                <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl border border-accent">
                  <Info className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
                  <div className="text-xs text-accent-foreground leading-relaxed">
                    Lợi nhuận dự kiến:{" "}
                    <span className="font-bold">{formatVND(profit)}</span>
                    <p className="mt-1 italic opacity-80">
                      Tỷ lệ lợi nhuận: {profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Section */}
            <div className="p-6 border-t bg-muted/30 flex items-center justify-end gap-3">
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
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-lg shadow-primary/20 font-bold gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Đang lưu...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditVariantDialog;
