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
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

function AddNewProduct() {
  const FormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tên hàng là bắt buộc"),
    productTypeId: z.string().min(1, "Vui lòng chọn nhóm hàng"),
    brand: z.string().optional(),
    initialPrice: z.coerce.number().min(0, "Giá vốn không được âm"),
    salePrice: z.coerce.number().min(0, "Giá bán không được âm"),
  });

  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      productTypeId: "",
      brand: "",
      initialPrice: 0,
      salePrice: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Dữ liệu gửi lên API:", data);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Plus /> Tạo mới
        </Button>
      </DialogTrigger>

      {/* THAY ĐỔI 1: Thiết kế DialogContent với flexbox và chiều cao cố định (v.d 80vh)
          Bỏ overflow-y-auto ở đây vì chúng ta muốn Header/Footer cố định.
      */}
      <DialogContent className="min-w-3xl max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            {/* THAY ĐỔI 2: Header bọc trong padding riêng */}
            <div className="p-6 pb-2">
              <DialogHeader>
                <DialogTitle>Thêm hàng hóa mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin chi tiết cho hàng hóa mới. Các trường có dấu
                  (*) là bắt buộc.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* THAY ĐỔI 3: Phần Content bọc trong div có flex-1 và overflow-y-auto 
                Đây là phần duy nhất sẽ cuộn khi dữ liệu quá dài.
            */}
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <FormItem className="col-span-2">
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Mã hàng
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Tự động" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                          Tên hàng
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Bắt buộc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhóm hàng</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="group1">áo</SelectItem>
                            <SelectItem value="group2">quần</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thương hiệu</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thương hiệu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="brand1">A Hoa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Accordion
                  defaultValue="prices"
                  type="single"
                  collapsible
                  className="w-full border-t"
                >
                  <AccordionItem value="prices" className="border-none">
                    <AccordionTrigger className="hover:no-underline cursor-pointer py-4 border-0">
                      {/* Thêm div bọc để căn chỉnh text */}
                      <div className="flex flex-col items-start text-left">
                        <span className="text-md font-bold">
                          Giá vốn, giá bán
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Thiết lập giá nhập kho và giá bán lẻ cho sản phẩm
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 pt-2 pb-4">
                        <FormField
                          control={form.control}
                          name="initialPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá vốn</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="text-right"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá bán</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="text-right"
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

                {/* Dummy content để test scroll nếu cần */}
                {/* <div className="h-96 bg-slate-50 border-dashed border-2 flex items-center justify-center">Nội dung thêm</div> */}
              </div>
            </div>

            {/* THAY ĐỔI 4: Footer luôn nằm ngoài phần scroll 
                Thêm border-t và padding để tách biệt rõ ràng.
            */}
            <div className="p-6 border-t bg-background">
              <DialogFooter className="flex items-center">
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Hủy
                    </Button>
                  </DialogClose>
                  <Button type="submit">Tạo mới</Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewProduct;
