import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  FileEdit,
  CalendarIcon,
  BadgeCent,
  Info,
  Save,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { updateHistoryProvider, deleteHistoryProvider } from "@/services/api";

// Interface cho lịch sử thanh toán
interface HistoryProvider {
  id: string;
  paidAmount: number;
  description?: string | null;
  createdAt: Date;
  status: string;
}

interface EditHistoryProviderProps {
  providerId: string;
  history: HistoryProvider;
  providerName: string;
  currentDebtOfProvider: number; // Nợ hiện tại của NCC để tính toán lại
}

function EditHistoryProvider({
  history,
  providerName,
  currentDebtOfProvider,
}: EditHistoryProviderProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const FormSchema = z.object({
    paidAmount: z.coerce.number().min(1, "Số tiền phải lớn hơn 0"),
    description: z.string().optional().nullable(),
    createdAt: z.string().min(1, "Ngày không được để trống"),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paidAmount: history.paidAmount,
      description: history.description || "",
      createdAt: new Date(history.createdAt).toISOString().split("T")[0],
    },
  });

  // Cập nhật lại form khi history thay đổi
  useEffect(() => {
    form.reset({
      paidAmount: history.paidAmount,
      description: history.description || "",
      createdAt: new Date(history.createdAt).toISOString().split("T")[0],
    });
  }, [history, form]);

  const newPaidAmount = useWatch({
    control: form.control,
    name: "paidAmount",
    defaultValue: history.paidAmount,
  });

  const debtBeforeThisBill = currentDebtOfProvider + history.paidAmount;
  const newRemainingDebt = debtBeforeThisBill - (newPaidAmount || 0);

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      const response = await updateHistoryProvider(parseInt(history.id), {
        paidAmount: data.paidAmount,
        description: data.description || undefined,
      });

      if (response.success) {
        alert("Cập nhật lịch sử thanh toán thành công!");
        setOpen(false);
        // Refresh page to see updates
        window.location.reload();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error: any) {
      console.error("Error updating history:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi cập nhật lịch sử thanh toán";
      alert(`Lỗi: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHistory = async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa phiếu chi này?")) {
      try {
        setSubmitting(true);
        const response = await deleteHistoryProvider(parseInt(history.id));
        if (response.success) {
          alert("Xóa phiếu chi thành công!");
          setOpen(false);
          window.location.reload();
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      } catch (error: any) {
        console.error("Error deleting history:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Lỗi xóa phiếu chi";
        alert(`Lỗi: ${errorMsg}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="sm:max-w-[600px] p-0 gap-0 overflow-hidden border-border shadow-2xl bg-background"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col bg-background"
          >
            {/* Header: Secondary Style */}
            <div className="p-6 bg-chart-2/50 text-secondary-foreground border-b border-border">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-lg shadow-sm border border-border">
                    <FileEdit className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl text-foreground font-bold">
                      Chỉnh Sửa Phiếu Chi
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                      Mã phiếu:{" "}
                      <span className="text-foreground font-semibold">{history.id}</span> |
                      NCC: {providerName}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Dashboard phân tích */}
            <div className="px-6 py-4 bg-muted/30 grid grid-cols-2 gap-4 border-b border-border">
              <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">
                  Số tiền cũ
                </p>
                <p className="text-sm font-bold opacity-50 line-through text-foreground">
                  {formatVND(history.paidAmount)}
                </p>
              </div>
              <div className="p-3 bg-chart-2/20  rounded-xl border border-chart-2/30  shadow-sm text-right">
                <p className="text-[10px] text-primary uppercase font-black mb-1">
                  Số tiền mới
                </p>
                <p className="text-sm font-bold text-primary">
                  {formatVND(newPaidAmount || 0)}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="font-bold flex items-center gap-2 text-foreground">
                        <BadgeCent className="w-4 h-4 text-primary" /> Số tiền thanh toán
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="h-12 text-lg font-bold border-input focus-visible:ring-primary/20 transition-all bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="font-bold text-foreground">Ngày chứng từ</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                            className="h-12 border-input focus-visible:ring-primary/20 transition-all bg-background"
                          />
                          <CalendarIcon className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-bold text-foreground">
                        Ghi chú nội dung
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="min-h-[100px] border-input focus-visible:ring-primary/20 transition-all resize-none bg-background"
                          placeholder="Nhập lý do điều chỉnh phiếu chi..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dự báo nợ sau khi sửa */}
              <div
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between",
                  newRemainingDebt < 0
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-accent/50 border-border text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 opacity-70" />
                  <span className="text-xs font-medium uppercase tracking-tight">
                    Nợ dự kiến sau điều chỉnh:
                  </span>
                </div>
                <span className="font-black text-sm">
                  {formatVND(newRemainingDebt)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/20 flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                disabled={submitting}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive font-bold gap-2"
                onClick={handleDeleteHistory}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <Trash2 className="w-4 h-4" /> {submitting ? "Đang xóa..." : "Hủy phiếu"}
              </Button>
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={submitting}
                    className="px-6 font-semibold border-border hover:bg-accent text-foreground"
                  >
                    Hủy bỏ
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-primary-foreground hover:opacity-90 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" /> {submitting ? "Đang cập nhật..." : "Cập nhật phiếu"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditHistoryProvider;