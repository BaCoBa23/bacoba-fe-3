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
  // ArrowRight,
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
import React, { useState, useMemo } from "react";
import { MOCK_PRODUCTS } from "@/types/Product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import dữ liệu Mock
import { MOCK_PRODUCT_TYPES } from "@/types/ProductType";
import { mockAttributeTypes } from "@/types/AttributeType";
import { mockAttributes } from "@/types/Attribute";
// import { MOCK_PROVIDERS } from "@/types/Provider";
import { AddNewReceivedNote } from "@/components/products/AddNewReceivedNote";
import { ManageAttributeTypes } from "@/components/attibute-types/ManageAttributeTypes";
import { ManageProductTypes } from "@/components/products/ManageProductTypes";


function ProductsList() {
  interface Option {
    id: string;
    name: string;
  }

  // --- Chuyển đổi dữ liệu sang Options cho Combobox ---
  const productTypeOptions: Option[] = useMemo(
    () => MOCK_PRODUCT_TYPES.map((t) => ({ id: t.id, name: t.name })),
    []
  );

  // const providersOptions: Option[] = useMemo(
  //   () => MOCK_PROVIDERS.map((p) => ({ id: p.id, name: p.name })),
  //   []
  // );

  // --- Quản lý State ---
  const [selectedProductTypes, setSelectedProductTypes] = useState<Option[]>(
    []
  );
  // const [selectedProviders, setSelectedProviders] = useState<Option[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, Option[]>
  >({});

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // State lưu trữ danh sách các Object sản phẩm con (variants) được chọn
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

  // --- Logic Xử lý ---
  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  /**
   * Xử lý khi click vào checkbox hàng cha
   * Sẽ thêm hoặc xóa toàn bộ Object sản phẩm con của cha đó
   */
  const handleSelectRow = (variants: any[]) => {
    const variantIds = variants.map((v) => v.id);
    const allSelected = variantIds.every((id) =>
      selectedVariants.some((sv) => sv.id === id)
    );

    if (allSelected) {
      // Nếu tất cả con của cha này đã được chọn -> Xóa chúng khỏi danh sách
      setSelectedVariants((prev) =>
        prev.filter((sv) => !variantIds.includes(sv.id))
      );
    } else {
      // Nếu chưa chọn hết -> Thêm những con chưa có vào danh sách (dưới dạng Object)
      setSelectedVariants((prev) => {
        const existingIds = prev.map((sv) => sv.id);
        const newVariants = variants.filter((v) => !existingIds.includes(v.id));
        return [...prev, ...newVariants];
      });
    }
  };

  /**
   * Xử lý khi click vào checkbox hàng con (biến thể)
   */
  const handleSelectVariant = (variant: any) => {
    setSelectedVariants((prev) =>
      prev.some((sv) => sv.id === variant.id)
        ? prev.filter((sv) => sv.id !== variant.id)
        : [...prev, variant]
    );
  };

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6 bg-background text-foreground">
      {/* Tiêu đề & Thanh công cụ */}
      <div className="basis-1/4">
        <div className="basis-full flex flex-wrap">
          <p className="text-2xl font-bold text-primary">Hàng hóa</p>
        </div>
      </div>
      <div className="basis-3/4 flex flex-wrap justify-between">
        <div className="basis-1/2">
          <Input
            type="search"
            placeholder="Tìm theo mã, tên hàng hóa"
            className="focus-visible:ring-primary border-border"
          />
        </div>
        <div className="basis-1/3 flex justify-around items-center">
          <AddNewProduct />
          <AddNewReceivedNote selectedProducts={selectedVariants} />
          
        </div>
      </div>

      {/* Sidebar Bộ lọc */}
      <div className="basis-1/4 w-full px-5 border-r border-border">
        <div className="basis-full w-full flex flex-wrap gap-y-6">
          <div className="basis-full w-full">
          <p className="basis-full text-sm font-bold py-3 text-foreground flex flex-wrap justify-between">
              <span>Nhóm hàng</span>
              <ManageProductTypes/>
            </p>
            <TagCombobox
              options={productTypeOptions}
              selected={selectedProductTypes}
              onChange={(val) => setSelectedProductTypes(val)}
              placeholder="Chọn nhóm hàng..."
            />
          </div>

          <div className="basis-full w-full flex flex-wrap gap-y-3">
            <p className="basis-full text-sm font-bold py-3 text-foreground flex flex-wrap justify-between">
              <span>Thuộc tính</span>
              <ManageAttributeTypes/>
            </p>
            {mockAttributeTypes.map((type) => {
              const optionsForType = mockAttributes
                .filter((attr) => attr.attributeType?.id === type.id)
                .map((attr) => ({ id: attr.id, name: attr.value }));

              return (
                <div
                  key={type.id}
                  className="basis-full w-full flex flex-wrap items-center px-2"
                >
                  <p className="basis-1/3 text-xs text-muted-foreground font-medium italic">
                    {type.name}
                  </p>
                  <div className="basis-2/3 w-full">
                    <TagCombobox
                      options={optionsForType}
                      selected={selectedAttributes[type.id] || []}
                      onChange={(val) =>
                        setSelectedAttributes((prev) => ({
                          ...prev,
                          [type.id]: val,
                        }))
                      }
                      placeholder={`Chọn ${type.name.toLowerCase()}...`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="basis-full w-full">
            <p className="text-sm font-bold py-3 text-foreground">
              Nhà cung cấp
            </p>
            <TagCombobox
              options={providersOptions}
              selected={selectedProviders}
              onChange={(val) => setSelectedProviders(val)}
              placeholder="Chọn nhà cung cấp..."
            />
          </div> */}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="basis-3/4 min-h-[calc(100vh-200px)] flex flex-col justify-between pl-4">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedVariants.length > 0 &&
                      MOCK_PRODUCTS.every((p) =>
                        p.variants.every((v: any) =>
                          selectedVariants.some((sv) => sv.id === v.id)
                        )
                      )
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const allVariants = MOCK_PRODUCTS.flatMap(
                          (p) => p.variants
                        );
                        setSelectedVariants(allVariants);
                      } else {
                        setSelectedVariants([]);
                      }
                    }}
                    className="border-muted-foreground"
                  />
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Mã hàng
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Tên hàng hóa
                </TableHead>
                <TableHead className="text-right font-bold text-foreground">
                  Giá vốn
                </TableHead>
                <TableHead className="text-right font-bold text-foreground">
                  Giá bán
                </TableHead>
                <TableHead className="text-right font-bold text-foreground">
                  Số lượng
                </TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PRODUCTS.map((product) => {
                const variantIds = product.variants.map((v: any) => v.id);

                // Kiểm tra trạng thái checkbox của hàng cha dựa trên mảng Object
                const isAllChildrenSelected = variantIds.every((id: any) =>
                  selectedVariants.some((sv) => sv.id === id)
                );
                const isSomeChildrenSelected =
                  variantIds.some((id: any) =>
                    selectedVariants.some((sv) => sv.id === id)
                  ) && !isAllChildrenSelected;

                return (
                  <React.Fragment key={product.id}>
                    {/* HÀNG CHA */}
                    <TableRow
                      data-state={isAllChildrenSelected && "selected"}
                      className="border-border hover:bg-muted/30"
                    >
                      <TableCell>
                        <button
                          onClick={() => toggleRowExpand(product.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {expandedRows.includes(product.id) ? (
                            <ChevronDown size={16} className="text-primary" />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="text-muted-foreground"
                            />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={
                            isAllChildrenSelected
                              ? true
                              : isSomeChildrenSelected
                              ? "indeterminate"
                              : false
                          }
                          onCheckedChange={() =>
                            handleSelectRow(product.variants)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-sm font-medium text-primary">
                        {product.id}
                      </TableCell>
                      <TableCell className="min-w-[400px] max-w-[400px] text-sm font-medium whitespace-normal break-words">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {product.initialPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {product.salePrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {product.quantity}
                      </TableCell>

                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:text-primary"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-border"
                          >
                            <DropdownMenuLabel className="text-muted-foreground">
                              Hành động
                            </DropdownMenuLabel>
                            {/* <DropdownMenuItem
                              onClick={() => console.log("Edit", product.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa hàng
                              hóa
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() =>
                                console.log("Add variant", product.id)
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" /> Thêm biến thể
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa hàng
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* HÀNG CON (VARIANTS) */}
                    {expandedRows.includes(product.id) &&
                      product.variants.map((variant: any) => {
                        const isVariantSelected = selectedVariants.some(
                          (sv) => sv.id === variant.id
                        );
                        return (
                          <TableRow
                            key={variant.id}
                            data-state={isVariantSelected && "selected"}
                            className="bg-muted/10 border-border"
                          >
                            <TableCell></TableCell>
                            <TableCell className="pl-8">
                              <Checkbox
                                checked={isVariantSelected}
                                onCheckedChange={() =>
                                  handleSelectVariant(variant)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {variant.id}
                            </TableCell>
                            <TableCell className="pl-10 text-sm italic text-muted-foreground">
                              {variant.name}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground italic">
                              {variant.initialPrice.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground italic font-medium">
                              {variant.salePrice.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {variant.quantity}
                            </TableCell>
                            <TableCell className="text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="border-border"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      console.log("Edit variant", variant.id)
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Sửa biến
                                    thể
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
        </div>

        {/* Phân trang */}
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="hover:bg-primary/10 hover:text-primary border-border"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis className="text-muted-foreground" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className="hover:bg-primary/10 hover:text-primary border-border"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
