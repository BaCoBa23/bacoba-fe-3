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
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm, useWatch } from "react-hook-form";
  import z from "zod";
  import { Button } from "../ui/button";
  import { Wallet, CalendarIcon, ArrowRightLeft, Receipt, Info, Loader2 } from "lucide-react";
  import { Input } from "../ui/input";
  import { Textarea } from "../ui/textarea";
  import { useState } from "react";
  import { createHistoryProvider } from "@/services/api";
  
  interface AddNewHistoryProps {
    providerId: string;
    providerName: string;
    currentDebt: number;
  }
  
  function AddNewHistory({ providerId, providerName, currentDebt }: AddNewHistoryProps) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const FormSchema = z.object({
      paidAmount: z.coerce.number().min(1, "Số tiền thanh toán phải lớn hơn 0"),
      description: z.string().optional().nullable(),
      createdAt: z.string().min(1, "Ngày thanh toán là bắt buộc"),
    });
  
    type FormValues = z.infer<typeof FormSchema>;
  
    const form = useForm<FormValues>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        paidAmount: 0,
        description: "",
        createdAt: new Date().toISOString().split("T")[0],
      },
    });
  
    const paidAmount = useWatch({
      control: form.control,
      name: "paidAmount",
      defaultValue: 0,
    });
  
    const remainingDebt = currentDebt - (paidAmount || 0);
  
    const onSubmit = async (data: FormValues) => {
      try {
        setSubmitting(true);
        const response = await createHistoryProvider({
          providerId: parseInt(providerId),
          paidAmount: data.paidAmount,
          description: data.description || undefined,
          status: "active",
        });

        if (response.success) {
          alert("Tạo lịch sử thanh toán thành công!");
          form.reset();
          setOpen(false);
          // Refresh page to see the new history
          window.location.reload();
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      } catch (error: any) {
        console.error("Error creating history:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Lỗi tạo lịch sử thanh toán";
        alert(`Lỗi: ${errorMsg}`);
      } finally {
        setSubmitting(false);
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
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-chart-2/50 text-chart-2/50 hover:bg-chart-2/50 hover:text-chart-2/50-foreground transition-all duration-300 shadow-sm"
          >
            <Wallet className="w-4 h-4" /> Lập phiếu chi trả
          </Button>
        </DialogTrigger>
  
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden border-none shadow-2sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col bg-background">
              
              {/* Header: Sử dụng chart-2/50 Background */}
              <div className="p-6 bg-chart-2/50 text-chart-2/50-foreground">
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-chart-2/50-foreground/20 rounded-lg">
                      <Receipt className="w-6 h-6 text-chart-2/50-foreground" />
                    </div>
                    <div>
                      <DialogTitle className="text-sm font-bold text-chart-2/50-foreground">Phiếu Chi Trả Nợ</DialogTitle>
                      <DialogDescription className="text-chart-2/50-foreground/80 flex items-center gap-1">
                        NCC: <span className="font-medium text-chart-2/50-foreground uppercase">{providerName}</span>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>
  
              {/* Dashboard Tài chính: Sử dụng Secondary & Muted Background */}
              <div className="px-6 py-4 bg-secondary/50 flex items-center justify-between gap-4">
                <div className="flex-1 p-3 bg-card rounded-sm border border-border shadow-sm text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Nợ hiện tại</p>
                  <p className="text-sm font-medium text-destructive">{formatVND(currentDebt)}</p>
                </div>
  
                <div className="flex shrink-0 animate-pulse text-muted-foreground">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
  
                <div className="flex-1 p-3 bg-chart-2/50 rounded-sm shadow-md shadow-chart-2/50/20 text-center">
                  <p className="text-[10px] text-chart-2/50-foreground/70 uppercase tracking-wider font-medium mb-1">Số tiền trả</p>
                  <p className="text-sm font-medium text-chart-2/50-foreground">{formatVND(paidAmount || 0)}</p>
                </div>
  
                <div className="flex shrink-0 text-muted-foreground">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
  
                <div className="flex-1 p-3 bg-card rounded-sm border border-border shadow-sm text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Còn nợ lại</p>
                  <p className="text-sm font-medium text-foreground">{formatVND(remainingDebt)}</p>
                </div>
              </div>
  
              {/* Form Fields: Tập trung vào trải nghiệm nhập liệu */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Số tiền thanh toán */}
                  <FormField
                    control={form.control}
                    name="paidAmount"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel className="text-foreground font-medium">
                          Số tiền chi trả 
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                              className="pl-10 text-sm h-14 border-input focus:ring-4 focus:ring-chart-2/50/10 transition-all font-medium text-chart-2/50"
                            />
                            <span className="absolute left-3 top-4 text-muted-foreground font-medium text-lg group-focus-within:text-chart-2/50">₫</span>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
  
                  {/* Ngày thanh toán */}
                  <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel className="text-foreground font-medium">Ngày chi trả</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} className="h-14 border-input focus:ring-4 focus:ring-chart-2/50/10 transition-all" />
                            <CalendarIcon className="absolute right-4 top-4.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  {/* Ghi chú */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-foreground font-medium">Ghi chú & Nội dung</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập nội dung thanh toán (ví dụ: Chuyển khoản qua ngân hàng...)" 
                            className="min-h-[100px] border-input focus:ring-4 focus:ring-chart-2/50/10 transition-all resize-none bg-transparent"
                            {...field} 
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
  
                {/* Tips nhỏ: Sử dụng Accent Background */}
                <div className="flex items-start gap-2 p-3 bg-accent rounded-lg border border-border">
                  <Info className="w-4 h-4 text-accent-foreground mt-0.5" />
                  <p className="text-xs text-accent-foreground/80 leading-relaxed">
                    Lưu ý: Sau khi xác nhận, số nợ của nhà cung cấp sẽ được cập nhật ngay lập tức vào hệ thống.
                  </p>
                </div>
              </div>
  
              {/* Footer: Cố định và sử dụng Secondary Background */}
              <div className="p-6 border-t bg-secondary/30 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground italic font-medium">Mã NCC: {providerId}</p>
                  <div className="flex gap-3">
                      <DialogClose asChild>
                          <Button variant="ghost" type="button" disabled={submitting} className="px-6 font-semimedium text-muted-foreground hover:text-foreground">
                              Hủy
                          </Button>
                      </DialogClose>
                      <Button type="submit" disabled={submitting} className="bg-chart-2/50 text-chart-2/50-foreground hover:opacity-90 px-10 shadow-lg shadow-chart-2/50/20 font-medium transition-all active:scale-95">
                          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {submitting ? "Đang xử lý..." : "Xác nhận"}
                      </Button>
                  </div>
              </div>
  
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default AddNewHistory; 