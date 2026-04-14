import AddNewProduct from "@/components/products/AddNewProduct";
import TagCombobox from "@/components/ui/TagCombobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  ArrowBigRightDash,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { MOCK_PRODUCTS } from "@/types/Product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };
  // --- Logic Xử lý Checkbox ---
  const handleSelectRow = (id: string, variantIds: string[]) => {
    const allIds = [id, ...variantIds];
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      // Nếu đang chọn thì bỏ chọn cả cha lẫn con
      setSelectedRows((prev) => prev.filter((item) => !allIds.includes(item)));
    } else {
      // Nếu chưa chọn thì thêm cả cha lẫn con vào list
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleSelectVariant = (variantId: string) => {
    setSelectedRows((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6">
      <div className="basis-1/4 ">
        <div className="basis-full flex flex-wrap">
          <p className="text-2xl font-bold">Hàng hóa</p>
        </div>
      </div>
      <div className="basis-3/4 flex flex-wrap justify-between">
        <div className="basis-1/2">
          <Input type="search" placeholder="Tìm theo mã, tên hàng hóa" />
        </div>
        <div className="basis-1/3 flex justify-around aglin-center ">
          <AddNewProduct />
          <Button variant={"outline"}>Nhập hàng <ArrowRight/> </Button>
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
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[50px]">
                <Checkbox
                  // Logic check all như cũ
                  disabled
                />
              </TableHead>
              <TableHead className="font-bold  ">Mã hàng</TableHead>
              <TableHead className="font-bold  ">Tên hàng hóa</TableHead>
              <TableHead className="text-right font-bold ">Giá vốn</TableHead>
              <TableHead className="text-right font-bold ">Giá bán</TableHead>
              <TableHead className="text-right font-bold ">Số lượng</TableHead>
              {/* Tiêu đề cho cột Action */}
              <TableHead className=" text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PRODUCTS.map((product) => {
              const variantIds = product.variants.map((v: any) => v.id);
              const isParentSelected = selectedRows.includes(product.id);

              return (
                <React.Fragment key={product.id}>
                  {/* --- HÀNG CHA --- */}
                  <TableRow data-state={isParentSelected && "selected"}>
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpand(product.id)}
                        className="p-1"
                      >
                        {expandedRows.includes(product.id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={isParentSelected}
                        onCheckedChange={() =>
                          handleSelectRow(product.id, variantIds)
                        }
                      />
                    </TableCell>
                    <TableCell className=" text-sm font-medium">
                      {product.id}
                    </TableCell>
                    <TableCell className="min-w-[500px] max-w-[500px]  text-sm font-medium pt-3 line-clamp-5 whitespace-normal break-words">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.initialPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.salePrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.quantity}
                    </TableCell>

                    {/* ACTION CHO HÀNG CHA */}
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("Edit product", product.id)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa hàng hóa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              console.log("Add variant to", product.id)
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" /> Thêm biến thể
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa hàng
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* --- CÁC HÀNG CON (VARIANTS) --- */}
                  {expandedRows.includes(product.id) &&
                    product.variants.map((variant: any) => {
                      const isVariantSelected = selectedRows.includes(
                        variant.id
                      );
                      return (
                        <TableRow
                          key={variant.id}
                          className=""
                          data-state={isVariantSelected && "selected"}
                        >
                          <TableCell></TableCell>
                          <TableCell className="pl-8">
                            <Checkbox
                              checked={isVariantSelected}
                              onCheckedChange={() =>
                                handleSelectVariant(variant.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {variant.id}
                          </TableCell>
                          <TableCell className="min-w-[500px] max-w-[500px] pl-10 text-sm italic text-muted-foreground line-clamp-5 whitespace-normal break-words">
                            {variant.name}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {variant.initialPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {variant.salePrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {variant.quantity}
                          </TableCell>

                          {/* ACTION CHO HÀNG CON */}
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    console.log("Edit variant", variant.id)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Sửa biến thể
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa biến
                                  thể
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </React.Fragment>
              );
            })}
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
