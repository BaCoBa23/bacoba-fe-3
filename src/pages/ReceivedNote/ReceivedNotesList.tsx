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
  Barcode,
  ChevronDown,
  ChevronRight,
  Edit,
  Edit3,
  MoreHorizontal,
  Plus,
  Trash2,
  Undo2,
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
// Import từ file mock data của bạn
import { MOCK_RECEIVED_NOTES } from "@/types/ReceivedNote";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagCombobox from "@/components/ui/TagCombobox";

function ReceivedNotesList() {
  interface Option {
    id: string;
    name: string;
  }

  const statusOptions: Option[] = [
    { id: "completed", name: "Đã nhập" },
    { id: "draft", name: "Nháp" },
    { id: "cancelled", name: "Hủy" },
  ];

  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic lọc dữ liệu dựa trên trạng thái và tìm kiếm
  const filteredNotes = MOCK_RECEIVED_NOTES.filter((note) => {
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.some((s) => s.id === note.status);
    const matchesSearch = note.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSelectRow = (id: string, itemIds: string[]) => {
    const allIds = [id, ...itemIds];
    const isSelected = selectedRows.includes(id);

    if (isSelected) {
      setSelectedRows((prev) => prev.filter((item) => !allIds.includes(item)));
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleSelectSubItem = (itemId: string) => {
    setSelectedRows((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold";
      case "draft":
        return "text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-semibold";
      case "cancelled":
        return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6">
      <div className="basis-1/4 ">
        <div className="basis-full flex flex-wrap">
          <p className="text-2xl font-bold">Nhập hàng</p>
        </div>
      </div>
      <div className="basis-3/4 flex flex-wrap justify-between">
        <div className="basis-1/2">
          <Input
            type="search"
            placeholder="Tìm theo mã phiếu nhập"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="basis-1/3 flex justify-around items-center">
          <Button variant={"outline"}>
            Nhập hàng <ArrowRight className="ml-2 h-4 w-4" />{" "}
          </Button>
        </div>
      </div>

      <div className="basis-1/4 w-full px-5 ">
        <div className="basis-full w-full flex flex-wrap">
          <div className="basis-full w-full">
            <p className="basis-full text-sm font-bold py-3 ">Trạng thái</p>
            <TagCombobox
              options={statusOptions}
              selected={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              placeholder="Chọn trạng thái..."
            />
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
                  checked={
                    filteredNotes.length > 0 &&
                    filteredNotes.every((n) => selectedRows.includes(n.id))
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const allIds = filteredNotes.flatMap((n) => [
                        n.id,
                        ...(n.receivedProducts?.map((p) => p.id) || []),
                      ]);
                      setSelectedRows(
                        Array.from(new Set([...selectedRows, ...allIds]))
                      );
                    } else {
                      const currentIds = filteredNotes.flatMap((n) => [
                        n.id,
                        ...(n.receivedProducts?.map((p) => p.id) || []),
                      ]);
                      setSelectedRows(
                        selectedRows.filter((id) => !currentIds.includes(id))
                      );
                    }
                  }}
                />
              </TableHead>
              <TableHead className="font-bold">Mã phiếu nhập</TableHead>
              <TableHead className="font-bold">Thời gian</TableHead>
              <TableHead className="text-right font-bold">
                Nhà cung cấp
              </TableHead>
              <TableHead className="text-right font-bold">
                Cần trả NCC
              </TableHead>
              <TableHead className="text-center font-bold">
                Trạng thái
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.map((note) => {
              const productIds = note.receivedProducts?.map((p) => p.id) || [];
              const isNoteSelected = selectedRows.includes(note.id);
              const isExpanded = expandedRows.includes(note.id);

              return (
                <React.Fragment key={note.id}>
                  {/* --- HÀNG CHA: THÔNG TIN TÓM TẮT --- */}
                  <TableRow
                    data-state={isNoteSelected && "selected"}
                    className={isExpanded ? "border-b-0 bg-blue-50/30" : ""}
                  >
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpand(note.id)}
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
                        checked={isNoteSelected}
                        onCheckedChange={() =>
                          handleSelectRow(note.id, productIds)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {note.id}
                    </TableCell>
                    <TableCell className="text-sm">
                      {note.createdAt.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {note.provider?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {(note.total - note.discount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={getStatusStyle(note.status)}>
                        {statusOptions.find((o) => o.id === note.status)?.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => console.log("Edit", note.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* --- HÀNG CHI TIẾT (ĐÃ CẬP NHẬT) --- */}
                  {isExpanded && (
                    <TableRow className="bg-muted/10 hover:bg-muted/20 border-b-0 border-l-2 border-chart-2">
                      <TableCell colSpan={8} className="p-6">
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2">
                          {/* 1. Header chi tiết: ID và Trạng thái */}
                          <div className="flex items-center gap-4 border-b border-border pb-4">
                            <h3 className="text-xl font-bold text-foreground">
                              {note.id}
                            </h3>
                            <span className={getStatusStyle(note.status)}>
                              {
                                statusOptions.find((o) => o.id === note.status)
                                  ?.name
                              }
                            </span>
                          </div>

                          {/* 2. Thông tin chung (Grid 2 cột) */}
                          <div className="grid grid-cols-2 gap-x-20 gap-y-2 text-sm">
                            <div className="flex justify-between border-b border-border py-1">
                              <span className="text-muted-foreground">
                                Ngày nhập:
                              </span>
                              <span className="text-foreground">
                                {note.createdAt.toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-border py-1">
                              <span className="text-muted-foreground">
                                Tên NCC:
                              </span>
                              <span className="text-primary font-medium">
                                {note.provider?.name}
                              </span>
                            </div>
                          </div>

                          {/* 3. Bảng danh sách sản phẩm nhập */}
                          <div className="mt-4 rounded-md border-border overflow-hidden">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow>
                                  {/* Đã bỏ cột Checkbox ở đây */}
                                  <TableHead>Mã hàng</TableHead>
                                  <TableHead>Tên hàng</TableHead>
                                  <TableHead className="text-right">
                                    Số lượng
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Đơn giá
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Giá nhập
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Thành tiền
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {note.receivedProducts?.map((item) => {
                                  const unitPrice =
                                    item.addQuantity > 0
                                      ? item.total / item.addQuantity
                                      : 0;
                                  return (
                                    <TableRow
                                      key={item.id}
                                      className="hover:bg-transparent"
                                    >
                                      {/* Đã bỏ TableCell Checkbox ở đây */}
                                      <TableCell className="text-chart-2 font-medium border-b-0">
                                        {item.productId}
                                      </TableCell>
                                      <TableCell>{item.productName}</TableCell>
                                      <TableCell className="text-right">
                                        {item.addQuantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {unitPrice.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {unitPrice.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right font-medium">
                                        {item.total.toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}

                                {/* --- HÀNG TỔNG CỘNG MỚI THÊM --- */}
                                <TableRow className="bg-muted/20 font-medium border-b-0">
                                  <TableCell colSpan={4}></TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    Tổng tiền hàng:
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-lg">
                                    {note.total.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t-0 border-b-0">
                                  <TableCell colSpan={4}></TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    Giảm giá:
                                  </TableCell>
                                  <TableCell className="text-right ">
                                    -{note.discount.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t-0 border-b-0">
                                  <TableCell colSpan={4}></TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    Đã trả NCC:
                                  </TableCell>
                                  <TableCell className="text-right  ">
                                    {(
                                      note.total - note.discount
                                    ).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-transparent border-t-0 ">
                                  <TableCell colSpan={4}></TableCell>
                                  <TableCell className="text-right font-bold">
                                    Còn nợ NCC:
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-chart-2 ">
                                    {/* Logic nợ: Giả sử ở đây bạn trả hết, nếu có field paid thì note.total - discount - note.paid */}
                                    0
                                  </TableCell>
                                </TableRow>
                                {/* --- 4. HÀNG NÚT THAO TÁC MỚI THÊM --- */}
                                <div className="flex justify-end items-center gap-3 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                      /* Logic in mã vạch */
                                    }}
                                  >
                                    <Barcode className="w-4 h-4" />
                                    In mã vạch
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      /* Logic trả hàng */
                                    }}
                                  >
                                    <Undo2 className="w-4 h-4" />
                                    Trả hàng
                                  </Button>

                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-2 bg-chart-2 hover:bg-chart-2/90"
                                    onClick={() => {
                                      /* Logic chỉnh sửa */
                                    }}
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    Chỉnh sửa
                                  </Button>
                                </div>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
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

export default ReceivedNotesList;
