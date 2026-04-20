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
  Barcode,
  ChevronDown,
  ChevronRight,
  // Edit,
  // Edit3,
  // MoreHorizontal,
  // Plus,
  // Trash2,
  Undo2,
  Loader2,
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
// Import API service
import {
  getReceivedNotes,
  type ReceivedNoteResponse,
  type GetReceivedNotesParams,
} from "@/services/api";
import { MOCK_RECEIVED_NOTES } from "@/types/ReceivedNote";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import TagCombobox from "@/components/ui/TagCombobox";
import { EditReceivedNote } from "@/components/products/EditReceivedNote";

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

  // State management
  const [receivedNotes, setReceivedNotes] = useState<ReceivedNoteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch received notes from API
  useEffect(() => {
    const fetchReceivedNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: GetReceivedNotesParams = {
          page: currentPage,
          pageSize: pageSize,
          search: searchQuery || undefined,
          status:
            selectedStatus.length > 0 ? selectedStatus[0].id : undefined,
        };

        const response = await getReceivedNotes(params);
        if (response.success) {
          setReceivedNotes(response.data);
          setTotalPages(response.meta.totalPages);
        } else {
          setError(response.message || "Failed to fetch received notes");
          setReceivedNotes(MOCK_RECEIVED_NOTES);
        }
      } catch (err) {
        console.error("Error fetching received notes:", err);
        setError("Error loading received notes");
        // Fallback to MOCK data
        setReceivedNotes(MOCK_RECEIVED_NOTES);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedNotes();
  }, [currentPage, pageSize, searchQuery, selectedStatus]);

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

  // const handleSelectSubItem = (itemId: string) => {
  //   setSelectedRows((prev) =>
  //     prev.includes(itemId)
  //       ? prev.filter((id) => id !== itemId)
  //       : [...prev, itemId]
  //   );
  // };

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

  // Calculate pagination
  const paginationLinks = Array.from({ length: totalPages }, (_, i) => i + 1);

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
          {/* <Button variant={"outline"}>
            Nhập hàng <ArrowRight className="ml-2 h-4 w-4" />{" "}
          </Button> */}
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
                      {/* <DropdownMenu>
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
                      </DropdownMenu> */}
                    </TableCell>
                  </TableRow>

                      {/* Expanded Detail Row */}
                      {expandedRows.includes(note.id) && (
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableCell colSpan={8} className="p-0">
                            <div className="p-4">
                              {/* 1. Thông tin chung */}
                              <div className="grid grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Mã phiếu
                                  </p>
                                  <p className="font-semibold">{note.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Ngày tạo
                                  </p>
                                  <p className="font-semibold">
                                    {new Date(note.createdAt).toLocaleDateString(
                                      "vi-VN",
                                      {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    NCC
                                  </p>
                                  <p className="font-semibold">
                                    {note.provider?.name || "---"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    SĐT
                                  </p>
                                  <p className="font-semibold">
                                    {note.phoneNumber || "---"}
                                  </p>
                                </div>
                              </div>

                              {/* 2. Table sản phẩm nhập */}
                              <div className="mt-4 rounded-md border-border overflow-hidden">
                                <Table>
                                  <TableHeader className="bg-muted/50">
                                    <TableRow>
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
                                    {note.receivedProducts &&
                                    note.receivedProducts.length > 0 ? (
                                      note.receivedProducts.map((item) => {
                                        const unitPrice =
                                          item.addQuantity > 0
                                            ? item.total / item.addQuantity
                                            : 0;
                                        return (
                                          <TableRow
                                            key={item.id}
                                            className="hover:bg-transparent"
                                          >
                                            <TableCell className="text-chart-2 font-medium border-b-0">
                                              {item.productId}
                                            </TableCell>
                                            <TableCell>
                                              {item.productName}
                                            </TableCell>
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
                                              {item.total?.toLocaleString() ||
                                                "0"}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={6}>
                                          Không có sản phẩm
                                        </TableCell>
                                      </TableRow>
                                    )}

                                    {/* Total Row */}
                                    <TableRow className="bg-muted/20 font-medium border-b-0">
                                      <TableCell colSpan={4}></TableCell>
                                      <TableCell className="text-right text-muted-foreground">
                                        Tổng tiền hàng:
                                      </TableCell>
                                      <TableCell className="text-right font-bold text-lg">
                                        {note.total?.toLocaleString() || "0"}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent border-t-0 border-b-0">
                                      <TableCell colSpan={4}></TableCell>
                                      <TableCell className="text-right text-muted-foreground">
                                        Giảm giá:
                                      </TableCell>
                                      <TableCell className="text-right">
                                        -{note.discount?.toLocaleString() || "0"}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent border-t-0 border-b-0">
                                      <TableCell colSpan={4}></TableCell>
                                      <TableCell className="text-right text-muted-foreground">
                                        Đã trả NCC:
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {(
                                          (note.total || 0) -
                                          (note.discount || 0)
                                        ).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent border-t-0">
                                      <TableCell colSpan={4}></TableCell>
                                      <TableCell className="text-right font-bold">
                                        Còn nợ NCC:
                                      </TableCell>
                                      <TableCell className="text-right font-bold text-chart-2">
                                        {note.debtMoney?.toLocaleString() ||
                                          "0"}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              {/* 3. Action Buttons */}
                              <div className="flex justify-end items-center gap-3 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => {
                                    console.log("Print barcode:", note.id);
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
                                    console.log("Return goods:", note.id);
                                  }}
                                >
                                  <Undo2 className="w-4 h-4" />
                                  Trả hàng
                                </Button>

                                  
                                  <EditReceivedNote
                                    receivedNote={note}
                                  />
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

        {/* Pagination */}
        {!loading && receivedNotes.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {paginationLinks.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default ReceivedNotesList;

