import {  useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
// import { Separator } from "../ui/separator";
import { mockAttributeTypes, mockAttributes, MOCK_PRODUCT_TYPES } from "@/types";
import TagCombobox from "../ui/TagCombobox";

// Helper format số cho hiển thị và input
const formatNumber = (val: number | string) => {
  if (!val && val !== 0) return "";
  return new Intl.NumberFormat("vi-VN").format(Number(val));
};

// Helper parse string format về number để lưu vào form
const parseFormattedNumber = (val: string) => {
  return Number(val.replace(/\./g, "").replace(/,/g, ""));
};

function AddNewProduct() {
  const FormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tên hàng là bắt buộc"),
    productTypeId: z.string().min(1, "Vui lòng chọn nhóm hàng"),
    brand: z.string().optional(),
    initialPrice: z.coerce.number().min(0, "Giá vốn không được âm"),
    salePrice: z.coerce.number().min(0, "Giá bán không được âm"),
    attributes: z.array(
      z.object({
        typeId: z.string(),
        typeName: z.string(),
        selectedValues: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
    ),
    variants: z.array(
      z.object({
        name: z.string(),
        initialPrice: z.number(),
        salePrice: z.number(),
      })
    ),
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
      // Khởi tạo sẵn tất cả attribute types từ mock data
      attributes: mockAttributeTypes.map((type) => ({
        typeId: type.id,
        typeName: type.name,
        selectedValues: [],
      })),
      variants: [],
    },
  });

  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const watchAttributes = useWatch({ control: form.control, name: "attributes" });
  const watchInitialPrice = useWatch({ control: form.control, name: "initialPrice" });
  const watchSalePrice = useWatch({ control: form.control, name: "salePrice" });

  // Logic tạo biến thể tự động
  useEffect(() => {
    const activeAttrs = watchAttributes?.filter(
      (a) => a.selectedValues && a.selectedValues.length > 0
    );

    if (!activeAttrs || activeAttrs.length === 0) {
      replaceVariants([]);
      return;
    }

    const combinations = activeAttrs.reduce((acc, attr) => {
      const next: any[] = [];
      attr.selectedValues.forEach((val) => {
        if (acc.length === 0) next.push([val.name]);
        else acc.forEach((prev: string[]) => next.push([...prev, val.name]));
      });
      return next;
    }, [] as string[][]);

    const newVariants = combinations.map((combo) => ({
      name: combo.join(" - "),
      initialPrice: watchInitialPrice || 0,
      salePrice: watchSalePrice || 0,
    }));

    replaceVariants(newVariants);
  }, [watchAttributes, watchInitialPrice, watchSalePrice, replaceVariants]);

  const onSubmit = (data: FormValues) => {
    console.log("Dữ liệu gửi lên API:", data);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Plus className="mr-2 h-4 w-4" /> Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[950px] max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 border-border bg-background">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="p-6 pb-2">
              <DialogHeader>
                <DialogTitle className="text-foreground">Thêm hàng hóa mới</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Nhập thông tin chi tiết. Hệ thống sẽ tự tạo các biến thể dựa trên thuộc tính bạn chọn.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2">
              <div className="space-y-6">
                {/* --- THÔNG TIN CHUNG --- */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <FormItem className="col-span-2">
                    <FormLabel className="text-foreground after:content-['*'] after:ml-0.5 after:text-destructive font-medium">
                      Mã hàng
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Mã tự động" disabled className="bg-muted text-muted-foreground border-border" />
                    </FormControl>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-foreground after:content-['*'] after:ml-0.5 after:text-destructive font-medium">
                          Tên hàng
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Áo sơ mi nam" {...field} className="border-border focus:ring-primary" />
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Nhóm hàng</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-border">
                              <SelectValue placeholder="Chọn nhóm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOCK_PRODUCT_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Thương hiệu</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-border">
                              <SelectValue placeholder="Chọn thương hiệu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="brand1">Local Brand</SelectItem>
                            <SelectItem value="brand2">Global Brand</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* --- GIÁ VỐN GIÁ BÁN --- */}
                <Accordion type="single" collapsible defaultValue="prices" className="border-t border-border">
                  <AccordionItem value="prices" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex flex-col items-start text-left">
                        <span className="text-md font-bold text-foreground">Giá vốn, giá bán</span>
                        <span className="text-xs text-muted-foreground font-normal">Thiết lập mức giá chung cho toàn bộ biến thể</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 gap-4 pt-0 pb-4">
                      <FormField
                        control={form.control}
                        name="initialPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Giá vốn</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                className="text-right border-border" 
                                value={formatNumber(field.value)}
                                onChange={(e) => field.onChange(parseFormattedNumber(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Giá bán</FormLabel>
                            <FormControl>
                              <Input 
                                type="text" 
                                className="text-right border-border" 
                                value={formatNumber(field.value)}
                                onChange={(e) => field.onChange(parseFormattedNumber(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* --- THUỘC TÍNH (Hiển thị sẵn) --- */}
                <Accordion type="single" collapsible defaultValue="attributes" className="border-t border-border">
                  <AccordionItem value="attributes" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex flex-col items-start text-left">
                        <span className="text-md font-bold text-foreground">Thuộc tính</span>
                        <span className="text-xs text-muted-foreground font-normal">Chọn giá trị cho từng loại đặc điểm hàng hóa</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      {form.getValues("attributes").map((item, index) => (
                        <div key={item.typeId} className="flex gap-4 items-center bg-muted/20 p-4 rounded-lg border border-border/50">
                          <div className="w-1/4">
                            <span className="text-sm font-bold text-primary uppercase tracking-tight">
                              {item.typeName}
                            </span>
                          </div>

                          <FormField
                            control={form.control}
                            name={`attributes.${index}.selectedValues`}
                            render={({ field }) => (
                              <div className="flex-1">
                                <TagCombobox
                                  options={mockAttributes
                                    .filter(attr => attr.attributeType?.id === item.typeId)
                                    .map(a => ({ id: a.id, name: a.value }))
                                  }
                                  selected={field.value || []}
                                  onChange={field.onChange}
                                  placeholder={`Chọn giá trị cho ${item.typeName}...`}
                                />
                              </div>
                            )}
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* --- BẢNG BIẾN THỂ --- */}
                {variantFields.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-md font-bold text-foreground uppercase tracking-wider">Hàng cùng loại</span>
                        <span className="text-xs text-muted-foreground">Tự động tạo {variantFields.length} biến thể</span>
                      </div>
                      <Button variant="link" size="sm" className="text-primary text-xs font-semibold p-0 h-auto">
                        Thiết lập giá đồng loạt
                      </Button>
                    </div>

                    <div className="border border-border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="w-[350px] text-foreground font-bold">Biến thể</TableHead>
                            <TableHead className="text-foreground font-bold text-right">Giá vốn</TableHead>
                            <TableHead className="text-foreground font-bold text-right">Giá bán</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variantFields.map((v, vIndex) => (
                            <TableRow key={v.id} className="border-border hover:bg-muted/10">
                              <TableCell className="font-semibold text-primary py-3">
                                {v.name}
                              </TableCell>
                              <TableCell className="py-2">
                                <FormField
                                  control={form.control}
                                  name={`variants.${vIndex}.initialPrice`}
                                  render={({ field }) => (
                                    <div className="space-y-1">
                                      <Input 
                                        type="text" 
                                        className="h-9 text-right border-border" 
                                        value={formatNumber(field.value)}
                                        onChange={(e) => field.onChange(parseFormattedNumber(e.target.value))}
                                      />
                                      <p className="text-[10px] text-right text-muted-foreground">
                                        đ
                                      </p>
                                    </div>
                                  )}
                                />
                              </TableCell>
                              <TableCell className="py-2">
                                <FormField
                                  control={form.control}
                                  name={`variants.${vIndex}.salePrice`}
                                  render={({ field }) => (
                                    <div className="space-y-1">
                                      <Input 
                                        type="text" 
                                        className="h-9 text-right border-border" 
                                        value={formatNumber(field.value)}
                                        onChange={(e) => field.onChange(parseFormattedNumber(e.target.value))}
                                      />
                                      <p className="text-[10px] text-right text-muted-foreground">
                                        đ
                                      </p>
                                    </div>
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border bg-background">
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button" className="border-border">Hủy</Button>
                </DialogClose>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]">
                  Tạo {variantFields.length > 0 ? variantFields.length : ""} hàng hóa
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewProduct;