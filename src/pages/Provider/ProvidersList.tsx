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
  Barcode,
  ChevronDown,
  ChevronRight,
  Edit,
  Edit2,
  History,
  MoreHorizontal,
  Plus,
  Wallet,
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
// Import mock data và types
import { MOCK_PROVIDERS } from "@/types/Provider";
import { MOCK_HISTORY_PROVIDERS } from "@/types/HistoryProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagCombobox from "@/components/ui/TagCombobox";

function ProvidersList() {
  interface Option {
    id: string;
    name: string;
  }

  const statusOptions: Option[] = [
    { id: "active", name: "Đang hoạt động" },
    { id: "inactive", name: "Ngừng hoạt động" },
  ];

  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic lọc Nhà cung cấp
  const filteredProviders = MOCK_PROVIDERS.filter((prov) => {
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.some((s) => s.id === prov.status);
    const matchesSearch =
      prov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prov.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- TÍNH TOÁN TỔNG CỘNG CHO TABLE CHA ---
  const grandTotalBuy = filteredProviders.reduce((sum, p) => sum + p.total, 0);
  const grandTotalDebt = filteredProviders.reduce((sum, p) => sum + p.debtTotal, 0);
  const grandTotalPaid = grandTotalBuy - grandTotalDebt;

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "text-chart-4 bg-chart-4/10 px-2 py-1 rounded-full text-xs font-semibold";
      case "inactive":
        return "text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs font-semibold";
      default:
        return "text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-semibold";
    }
  };

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6">
      <div className="basis-1/4 ">
        <div className="basis-full flex flex-wrap">
          <p className="text-2xl font-bold">Nhà cung cấp</p>
        </div>
      </div>
      <div className="basis-3/4 flex flex-wrap justify-between">
        <div className="basis-1/2">
          <Input
            type="search"
            placeholder="Tìm theo mã hoặc tên NCC..."
            className="border-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="basis-1/3 flex justify-around items-center">
          <button
            className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm nhà cung cấp
          </button>
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
        <Table className="border-collapse">
          <TableHeader className="bg-muted">
            <TableRow className="border-border">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[50px]">
                <Checkbox
                  className="border-input data-[state=checked]:bg-primary"
                  checked={
                    filteredProviders.length > 0 &&
                    filteredProviders.every((p) => selectedRows.includes(p.id))
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRows(filteredProviders.map((p) => p.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="font-bold text-foreground">
                Mã NCC
              </TableHead>
              <TableHead className="font-bold text-foreground">
                Tên nhà cung cấp
              </TableHead>
              <TableHead className="text-right font-bold text-foreground">
                Điện thoại
              </TableHead>
              <TableHead className="text-right font-bold text-foreground">
                Tổng mua
              </TableHead>
              <TableHead className="text-right font-bold text-foreground">
                Đã trả
              </TableHead>
              <TableHead className="text-right font-bold text-foreground">
                Nợ hiện tại
              </TableHead>
              <TableHead className="text-center font-bold text-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* --- HÀNG TỔNG CỘNG CỦA TABLE CHA --- */}
            {filteredProviders.length > 0 && (
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-t-2 border-border font-bold">
                <TableCell colSpan={5} className="text-right text-foreground py-4">
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {grandTotalBuy.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-chart-4">
                  {grandTotalPaid.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  {grandTotalDebt.toLocaleString()}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}
            {filteredProviders.map((prov) => {
              const isExpanded = expandedRows.includes(prov.id);
              const isSelected = selectedRows.includes(prov.id);

              const providerHistories = MOCK_HISTORY_PROVIDERS.filter(
                (hist) => {
                  if (prov.id === "PROV-001")
                    return hist.id === "HIST-001" || hist.id === "HIST-002";
                  if (prov.id === "PROV-002")
                    return hist.id === "HIST-003" || hist.id === "HIST-004";
                  if (prov.id === "PROV-003")
                    return hist.id === "HIST-005" || hist.id === "HIST-006";
                  return false;
                }
              );

              const totalPaidInHistory = providerHistories.reduce(
                (sum, item) => sum + item.paidAmount,
                0
              );

              return (
                <React.Fragment key={prov.id}>
                  <TableRow
                    data-state={isSelected && "selected"}
                    className={`${
                      isExpanded ? "border-b-0 bg-accent/30" : "border-border"
                    } hover:bg-accent/50 transition-colors`}
                  >
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpand(prov.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
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
                        className="border-input data-[state=checked]:bg-primary"
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(prov.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm ">
                      {prov.id}
                    </TableCell>
                    <TableCell className="text-sm font-bold text-primary">
                      {prov.name}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {prov.phoneNumber || "---"}
                    </TableCell>
                    <TableCell className="text-right ">
                      {prov.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right  text-chart-4">
                      {(prov.total - prov.debtTotal).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right  text-destructive">
                      {prov.debtTotal.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={getStatusStyle(prov.status)}>
                        {statusOptions.find((o) => o.id === prov.status)
                          ?.name || prov.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-popover border-border"
                        >
                          <DropdownMenuItem
                            className="hover:bg-accent cursor-pointer"
                            onClick={() => console.log("Edit", prov.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="bg-muted/10 hover:bg-transparent border-b-0 border-l-2 border-chart-2">
                      <TableCell colSpan={10} className="p-6">
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-center gap-4 border-b border-border pb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                              <History className="w-5 h-5 text-chart-2" /> Lịch
                              sử thanh toán: {prov.name}
                            </h3>
                          </div>

                          <div className="mt-2 rounded-md border border-border overflow-hidden bg-card">
                            <Table>
                              <TableHeader className="bg-muted/50">
                                <TableRow className="border-border">
                                  <TableHead className="text-foreground">
                                    Mã phiếu
                                  </TableHead>
                                  <TableHead className="text-foreground">
                                    Ngày thanh toán
                                  </TableHead>
                                  <TableHead className="text-foreground">
                                    Nội dung
                                  </TableHead>
                                  <TableHead className="text-center text-foreground">
                                    Trạng thái
                                  </TableHead>
                                  <TableHead className="text-right text-foreground">
                                    Đã thanh toán
                                  </TableHead>
                                  <TableHead className="text-right text-foreground"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {providerHistories.length > 0 ? (
                                  <>
                                    {providerHistories.map((hist) => (
                                      <TableRow
                                        key={hist.id}
                                        className="border-border hover:bg-accent/20"
                                      >
                                        <TableCell className="font-medium text-chart-2">
                                          {hist.id}
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                          {hist.createdAt.toLocaleString(
                                            "vi-VN"
                                          )}
                                        </TableCell>
                                        <TableCell className="italic text-muted-foreground text-sm">
                                          {hist.description ||
                                            "Không có ghi chú"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <span
                                            className={
                                              hist.status === "completed"
                                                ? "text-chart-4 bg-chart-4/10 px-2 py-0.5 rounded text-xs"
                                                : "text-chart-5 bg-chart-5/10 px-2 py-0.5 rounded text-xs"
                                            }
                                          >
                                            {hist.status === "completed"
                                              ? "Thành công"
                                              : "Chờ duyệt"}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-primary">
                                          {hist.paidAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-accent"
                                              >
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              align="end"
                                              className="bg-popover border-border"
                                            >
                                              <DropdownMenuItem
                                                className="hover:bg-accent cursor-pointer"
                                                onClick={() =>
                                                  console.log("Edit", prov.id)
                                                }
                                              >
                                                <Edit className="mr-2 h-4 w-4" />{" "}
                                                Chỉnh sửa
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/30 border-t-2 border-border font-bold">
                                      <TableCell
                                        colSpan={4}
                                        className="text-right text-foreground"
                                      >
                                        Tổng cộng đã thanh toán:
                                      </TableCell>
                                      <TableCell className="text-right text-chart-4 text-lg">
                                        {totalPaidInHistory.toLocaleString()}
                                      </TableCell>
                                      <TableCell />
                                    </TableRow>
                                  </>
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-center py-8 text-muted-foreground"
                                    >
                                      Không có lịch sử thanh toán cho nhà cung
                                      cấp này.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="flex justify-end items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 border-chart-2 text-chart-2 hover:bg-chart-2/10"
                            >
                              <Wallet className="w-4 h-4" /> Lập phiếu chi trả
                              nợ
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 border-border text-foreground hover:bg-accent"
                            >
                              <Edit2 className="w-4 h-4" /> Chỉnh sửa thông
                              tin
                            </Button>
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
              <PaginationPrevious className="hover:bg-accent" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="bg-primary text-primary-foreground"
                href="#"
                isActive
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className="hover:bg-accent" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default ProvidersList;