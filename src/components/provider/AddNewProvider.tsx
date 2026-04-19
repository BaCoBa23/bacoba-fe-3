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
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useForm } from "react-hook-form";
  import z from "zod";
  import { Button } from "../ui/button";
  import { Plus, UserPlus } from "lucide-react";
  import { Input } from "../ui/input";
  import { Separator } from "../ui/separator";
  
  function AddNewProvider() {
    const FormSchema = z.object({
        name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
        phoneNumber: z.string().optional().nullable(),
        email: z.string().email("Email không hợp lệ").optional().or(z.literal("")).nullable(),
        status: z.string().min(1, "Trạng thái là bắt buộc"), // Bỏ .default() ở đây nếu bạn đã có defaultValues
        debtTotal: z.coerce.number().min(0, "Nợ không được âm"),
        total: z.coerce.number().min(0, "Tổng mua không được âm"),
      });
      
      // 2. Để TypeScript tự suy luận kiểu từ Schema (thay vì tự viết interface)
      type FormValues = z.infer<typeof FormSchema>;
      
      // 3. Khai báo useForm mà không cần truyền Generic quá phức tạp, 
      // hoặc đảm bảo defaultValues khớp 100%
      const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          name: "",
          phoneNumber: "",
          email: "",
          status: "active", // Giá trị mặc định thực tế nằm ở đây
          debtTotal: 0,
          total: 0,
        },
      });
  
    const onSubmit = (data: FormValues) => {
      console.log("Dữ liệu Nhà cung cấp mới:", data);
      // Logic gọi API ở đây
      form.reset();
    };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className="">
            <Plus className="mr-2 h-4 w-4" /> Thêm nhà cung cấp
          </Button>
        </DialogTrigger>
  
        <DialogContent className="min-w-3xl max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              {/* Header cố định */}
              <div className="p-6 pb-2">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Thêm nhà cung cấp mới
                  </DialogTitle>
                  <DialogDescription>
                    Thiết lập thông tin đối tác cung ứng. Các trường có dấu (*) là bắt buộc.
                  </DialogDescription>
                </DialogHeader>
              </div>
  
              {/* Nội dung Form có thể Scroll */}
              <div className="flex-1 overflow-y-auto p-6 pt-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <FormItem className="col-span-2">
                      <FormLabel>Mã nhà cung cấp</FormLabel>
                      <FormControl>
                        <Input placeholder="Mã tự động tạo" disabled className="bg-muted" />
                      </FormControl>
                    </FormItem>
  
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Tên nhà cung cấp
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên công ty hoặc cá nhân..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="028..." {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" {...field} value={field.value ?? ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Đang hoạt động</SelectItem>
                              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
  
                  {/* Phần thiết lập tài chính (Nợ/Tổng mua) */}
                  <Accordion
                    defaultValue="finance"
                    type="single"
                    collapsible
                    className="w-full border-t"
                  >
                    <AccordionItem value="finance" className="border-none">
                      <AccordionTrigger className="hover:no-underline cursor-pointer py-4 border-0">
                        <div className="flex flex-col items-start text-left">
                          <span className="text-md font-bold text-foreground">
                            Thông tin nợ đầu kỳ
                          </span>
                          <span className="text-xs text-muted-foreground font-normal">
                            Cập nhật số nợ hiện tại và tổng giao dịch với nhà cung cấp
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 pt-2 pb-4">
                          <FormField
                            control={form.control}
                            name="total"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tổng mua (VNĐ)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="text-right font-semibold"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="debtTotal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nợ hiện tại (VNĐ)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="text-right text-destructive font-semibold"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                      <Separator />
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
  
              {/* Footer cố định */}
              <div className="p-6 border-t bg-background">
                <DialogFooter className="flex items-center">
                  <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Hủy bỏ
                      </Button>
                    </DialogClose>
                    <Button type="submit">Lưu nhà cung cấp</Button>
                  </div>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default AddNewProvider;