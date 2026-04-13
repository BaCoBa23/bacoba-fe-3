import AddNewProduct from "@/components/products/AddNewProduct";
import TagCombobox from "@/components/ui/TagCombobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";


function ProductsList() {
  interface Option {
    id: string;
    name: string;
  }
  const typesOptions: Option[] = [
    { id: "1", name: "Quần" },
    { id: "2", name: "Áo" },
    { id: "3", name: "Váy" },
  ];
  const corlorsOptions: Option[] = [
    { id: "1", name: "Xanh" },
    { id: "2", name: "Đỏ" },
    { id: "3", name: "Hồng" },
  ];
  const sizesOptions: Option[] = [
    { id: "1", name: "S" },
    { id: "2", name: "M" },
    { id: "3", name: "Xl" },
  ];
  const providersOptions: Option[] = [
    { id: "1", name: "HAHAH" },
    { id: "2", name: "OKOK" },
    { id: "3", name: "LVLVLV" },
  ];

  // 3. Khởi tạo State để quản lý các mục được chọn
  const [selectedTypes, setselectedTypes] = useState<Option[]>([]);
  const [selectedSizes, setselectedSizes] = useState<Option[]>([]);
  const [selectedColors, setselectedColors] = useState<Option[]>([]);
  const [selectedProviders, setselectedProviders] = useState<Option[]>([]);

 
  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6">
      <div className="basis-1/4 ">
        <div className="basis-full flex flex-wrap">
          <p className="text-2xl font-bold">Hàng hóa</p>
        </div>
      </div>
      <div className="basis-3/4 flex flex-wrap justify-between">
        <div className="basis-1/2">
          <Input type="search" placeholder="Tìm theo mã, tên hàng hóa"/>
        </div>
        <div className="basis-1/3 justify-around">
          <AddNewProduct/>
        </div>
      </div>

      <div className="basis-1/4 w-full px-5 ">
        <div className="basis-full w-full flex flex-wrap">
          <div className="basis-full w-full">
            <p className="basis-full text-sm font-bold py-3 ">Nhóm hàng</p>
            <TagCombobox
              options={typesOptions}
              selected={selectedTypes}
              onChange={(val) => setselectedTypes(val)}
              placeholder="Chọn nhóm hàng..."
            />
          </div>
          <div className="basis-full w-full flex flex-wrap gap-y-2">
            <p className="basis-full text-sm font-bold py-3 ">Thuộc tính</p>
            <div className="basis-full w-full flex flex-wrap px-3">
              <p className="basis-1/4 text-xs text-secondary py-3 ">Size</p>
              <div className="basis-3/4 w-full ">
                <TagCombobox
                  options={sizesOptions}
                  selected={selectedSizes}
                  onChange={(val) => setselectedSizes(val)}
                  placeholder="Chọn ..."
                />
              </div>
            </div>
            <div className="basis-full w-full flex flex-wrap px-3">
              <p className="basis-1/4 text-xs text-secondary py-3 ">Màu</p>
              <div className="basis-3/4 w-full ">
                <TagCombobox
                  options={corlorsOptions}
                  selected={selectedColors}
                  onChange={(val) => setselectedColors(val)}
                  placeholder="Chọn ..."
                />
              </div>
            </div>
            <div className="basis-full w-full flex flex-wrap px-3">
              <p className="basis-1/4 text-xs text-secondary py-3 ">
                Tên thuộc tính
              </p>
              <div className="basis-3/4 w-full ">
                <TagCombobox
                  options={providersOptions}
                  selected={selectedProviders}
                  onChange={(val) => setselectedProviders(val)}
                  placeholder="Chọn ..."
                />
              </div>
            </div>
          </div>
          <div className="basis-full w-full">
            <p className="basis-full text-sm font-bold py-3 ">Nhà cung cấp</p>
            <div className="basis-3/4 w-full ">
              <TagCombobox
                options={providersOptions}
                selected={selectedProviders}
                onChange={(val) => setselectedProviders(val)}
                placeholder="Chọn nhà cung cấp"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="basis-3/4 min-h-[calc(100vh-200px)] flex flex-col justify-between">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                //   checked={selectedRows.length === data.length}
                //   onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Mã hàng</TableHead>
              <TableHead>Tên hàng hóa</TableHead>
              <TableHead className="text-right">Giá vốn</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
            // key={product.id}
            // data-state={selectedRows.includes(product.id) && "selected"}
            >
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right font-medium">500</TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow
            // key={product.id}
            // data-state={selectedRows.includes(product.id) && "selected"}
            >
              <TableCell>
                <Checkbox
                // checked={selectedRows.includes(product.id)}
                // onCheckedChange={() => toggleRow(product.id)}
                />
              </TableCell>
              <TableCell>QT32132</TableCell>
              <TableCell className="min-w-[500px] max-w-[500px] line-clamp-5 whitespace-normal break-words">
                {" "}
                Quần thô Quần - Trắng - S
              </TableCell>
              <TableCell className="text-right">400.000</TableCell>
              <TableCell className="text-right">500.000</TableCell>
              <TableCell className="text-right">10</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow
            // key={product.id}
            // data-state={selectedRows.includes(product.id) && "selected"}
            >
              <TableCell>
                <Checkbox
                // checked={selectedRows.includes(product.id)}
                // onCheckedChange={() => toggleRow(product.id)}
                />
              </TableCell>
              <TableCell>QT32132</TableCell>
              <TableCell className="min-w-[500px] max-w-[500px] line-clamp-5 whitespace-normal break-words">
                {" "}
                Quần thô Quần - Trắng - S
              </TableCell>
              <TableCell className="text-right">400.000</TableCell>
              <TableCell className="text-right">500.000</TableCell>
              <TableCell className="text-right">10</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default ProductsList;
