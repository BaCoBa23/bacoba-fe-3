import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import z from "zod";
function AddNewProduct() {

  const FormSchema = z.object({
    title: z.string().min(5, "Tiêu đề không được để trống."),
    pet: z.string().min(1, "Chọn thú nuôi."),
    description: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;
//   const form = useForm<FormValues>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//         variants: "",
//         productTypeId: "",
//         type: "",
//         brandId: "",
//         initialPrice: 0,
//         salePrice: 0,
//         quantity: 0,
//         description: "",
//         productAttributes: "",
//     },
//   });
  return (
    <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>
                <Plus /> Tạo mới
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4/5 min-h-4/5">
              {/* <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa form nhận nuôi</DialogTitle>
                    <DialogDescription>
                      Tạo đơn nhận nuôi cho từng loài! Giảm bớt thời gian quản
                      lý.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 my-3">
                   
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tiêu đề" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

               
                    <FormField
                      control={form.control}
                      name="pet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thú nuôi</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                              disabled
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn thú nuôi">
                                  {adoptionForm?.pet?.name}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-[10rem]">
                                <SelectGroup>
                                  <SelectLabel>Mã thú nuôi</SelectLabel>
                                  {availablePets.map((s: any) => (
                                    <SelectItem
                                      key={s._id}
                                      value={s._id}
                                      className="flex items-center w-full mx-2 py-1"
                                    >
                                      <Avatar className="rounded-none w-8 h-8">
                                        <AvatarImage
                                          src={s?.photos[0]}
                                          alt={s?.name}
                                          className="w-8 h-8 object-center object-cover"
                                        />
                                        <AvatarFallback className="rounded-none">
                                          <span className="font-medium">
                                            {s.name.charAt(0).toUpperCase()}
                                          </span>
                                        </AvatarFallback>
                                      </Avatar>

                                      <div className="ml-2 flex flex-col overflow-hidden ">
                                        <span className="text-sm font-medium truncate">
                                          {s.name}
                                        </span>
                                        <span className="text-xs text-(--muted-foreground) truncate">
                                          #{s.petCode}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <MinimalTiptapEditor
                              value={field.value || ""}
                              onChange={field.onChange}
                              className="w-full"
                              editorContentClassName="p-5"
                              output="html"
                              placeholder="Enter your description..."
                              autofocus={true}
                              editable={true}
                              hideToolbar={false}
                              editorClassName="focus:outline-hidden"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button className="cursor-pointer" type="submit">
                      Lưu
                    </Button>
                  </DialogFooter>
                </form>
              </Form> */}
            </DialogContent>
          </Dialog>
  );
}

export default AddNewProduct;
