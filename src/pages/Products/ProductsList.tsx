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
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  Loader,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProducts, deleteProduct, type ProductResponse, type GetProductsParams } from "@/services/api";
import { MOCK_PRODUCTS } from "@/types/Product";

function ProductsList() {
  interface Option {
    id: string;
    name: string;
  }
  
  // API Data States
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  
  const [selectedTypes, setselectedTypes] = useState<Option[]>([]);
  const [selectedSizes, setselectedSizes] = useState<Option[]>([]);
  const [selectedColors, setselectedColors] = useState<Option[]>([]);
  const [selectedProviders, setselectedProviders] = useState<Option[]>([]);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mock options (sau này lấy từ API)
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

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: GetProductsParams = {
          page: currentPage,
          pageSize: pageSize,
          search: search || undefined,
          status: "active",
        };

        const response = await getProducts(params);
        console.log("API Response:", response);
        
        // API trả về flat list (không có variants), tạm gán vào MOCK để có variants
        // TODO: Khi backend trả variants, xóa MOCK_PRODUCTS
        const productsWithVariants = response.data.map((product: any) => {
          const mockProduct = MOCK_PRODUCTS.find(p => p.id === product.id);
          return mockProduct || product;
        });
        
        setProducts(productsWithVariants.length > 0 ? productsWithVariants : MOCK_PRODUCTS);
        setTotalItems(response.meta.totalItems);
        setTotalPages(response.meta.totalPages);
        setCurrentPage(response.meta.currentPage);
        
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.message || "Lỗi khi tải danh sách sản phẩm");
        // Fallback to MOCK data khi lỗi
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, search, selectedTypes]);

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa sản phẩm ${productId}?`)) {
      return;
    }
    try {
      console.log("Deleting product:", productId);
      const response = await deleteProduct(productId);
      console.log("Delete success:", response);
      // Reload danh sách sau khi xóa
      setProducts(products.filter(p => p.id !== productId));
      alert("Xóa sản phẩm thành công!");
    } catch (err: any) {
      console.error("Delete error full:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Không biết lỗi gì";
      alert(`Lỗi xóa sản phẩm: ${errorMsg}`);
    }
  };

  const handleDeleteVariant = async (productId: string, variantId: string) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa biến thể ${variantId}?`)) {
      return;
    }
    try {
      const updatedProducts = products.map(p => {
        if (p.id === productId && p.variants) {
          return {
            ...p,
            variants: p.variants.filter((v: any) => v.id !== variantId)
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      alert("Xóa biến thể thành công!");
    } catch (err: any) {
      alert("Lỗi xóa biến thể: " + err.message);
    }
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
          <Input 
            type="search" 
            placeholder="Tìm theo mã, tên hàng hóa" 
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
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
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin mr-2" />
            <p>Đang tải danh sách sản phẩm...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[50px]">
                    <Checkbox disabled />
                  </TableHead>
                  <TableHead className="font-bold">Mã hàng</TableHead>
                  <TableHead className="font-bold">Tên hàng hóa</TableHead>
                  <TableHead className="text-right font-bold">Giá vốn</TableHead>
                  <TableHead className="text-right font-bold">Giá bán</TableHead>
                  <TableHead className="text-right font-bold">Số lượng</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const isParentSelected = selectedRows.includes(product.id);
                    const variantIds = product.variants?.map((v: any) => v.id) || [];
                    const isExpanded = expandedRows.includes(product.id);

                    return (
                      <React.Fragment key={product.id}>
                        {/* Parent Product Row */}
                        <TableRow data-state={isParentSelected && "selected"}>
                          <TableCell>
                            <button
                              onClick={() => toggleRowExpand(product.id)}
                              className="p-1"
                            >
                              {isExpanded ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={isParentSelected}
                              onCheckedChange={() => handleSelectRow(product.id)}
                            />
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {product.id}
                          </TableCell>
                          <TableCell className="min-w-[300px] max-w-[300px] text-sm font-medium line-clamp-2 break-words">
                            {product.name || product.type?.name || "---"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {product.initialPrice?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {product.salePrice?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {product.quantity ?? 0}
                          </TableCell>
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
                                  onClick={() => console.log("Edit product", product.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa hàng hóa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => console.log("Add variant to", product.id)}
                                >
                                  <Plus className="mr-2 h-4 w-4" /> Thêm biến thể
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive cursor-pointer"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa hàng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Variant Rows */}
                        {isExpanded &&
                          product.variants?.map((variant: any) => {
                            const isVariantSelected = selectedRows.includes(variant.id);
                            return (
                              <TableRow
                                key={variant.id}
                                data-state={isVariantSelected && "selected"}
                              >
                                <TableCell></TableCell>
                                <TableCell className="pl-8">
                                  <Checkbox
                                    checked={isVariantSelected}
                                    onCheckedChange={() => handleSelectRow(variant.id)}
                                  />
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                  {variant.id}
                                </TableCell>
                                <TableCell className="min-w-[300px] max-w-[300px] pl-8 text-sm italic text-muted-foreground line-clamp-2 break-words">
                                  {variant.name || "---"}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {variant.initialPrice?.toLocaleString() || "0"}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {variant.salePrice?.toLocaleString() || "0"}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                  {variant.quantity ?? 0}
                                </TableCell>
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
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        className="text-destructive cursor-pointer"
                                        onClick={() => handleDeleteVariant(product.id, variant.id)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" /> Xóa biến thể
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      Không có sản phẩm nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Hiển thị {products.length} / {totalItems} sản phẩm
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductsList;
