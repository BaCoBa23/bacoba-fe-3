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
  ChevronDown,
  ChevronRight,
  Undo2,
  FileText,
  ArrowRightLeft,
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
import TagCombobox from "@/components/ui/TagCombobox";
import { MOCK_BILLS } from "@/types";

function BillsList() {
  interface Option {
    id: string;
    name: string;
  }

  const statusOptions: Option[] = [
    { id: "active", name: "Hoàn thành" },
    { id: "cancelled", name: "Hủy" },
    { id: "returned", name: "Trả hàng" },
  ];

  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic lọc hóa đơn
  const filteredBills = MOCK_BILLS.filter((bill: any) => {
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.some((s) => s.id === bill.status);
    const matchesSearch =
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesStatus && matchesSearch;
  });

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleSelectRow = (billId: string, productIds: string[]) => {
    const allIds = [billId, ...productIds];
    const isSelected = selectedRows.includes(billId);

    if (isSelected) {
      setSelectedRows((prev) => prev.filter((item) => !allIds.includes(item)));
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "text-success bg-success/10 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
      case "cancelled":
        return "text-destructive bg-destructive/10 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
      case "returned":
        return "text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
      default:
        return "text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider";
    }
  };

  return (
    <div className="w-full h-full p-5 flex flex-wrap gap-y-6 bg-background">
      {/* HEADER SECTION */}
      <div className="basis-1/4">
        <p className="text-2xl font-bold tracking-tight text-foreground">Hóa đơn</p>
      </div>
      <div className="basis-3/4 flex justify-between">
        <div className="basis-1/2">
          <Input
            type="search"
            placeholder="Tìm theo mã hóa đơn hoặc khách hàng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* FILTER SIDEBAR */}
      <div className="basis-1/4 w-full px-5">
        <div className="basis-full w-full">
          <p className="text-sm font-bold py-3 text-foreground">Trạng thái</p>
          <TagCombobox
            options={statusOptions}
            selected={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
            placeholder="Chọn trạng thái..."
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="basis-3/4 min-h-[calc(100vh-200px)] flex flex-col justify-between">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredBills.length > 0 &&
                      filteredBills.every((b: any) => selectedRows.includes(b.id))
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const allIds = filteredBills.flatMap((b: any) => [
                          b.id,
                          ...(b.billProducts?.map((p: any) => p.id) || []),
                        ]);
                        setSelectedRows(Array.from(new Set([...selectedRows, ...allIds])));
                      } else {
                        const currentIds = filteredBills.flatMap((b: any) => [
                          b.id,
                          ...(b.billProducts?.map((p: any) => p.id) || []),
                        ]);
                        setSelectedRows(selectedRows.filter((id) => !currentIds.includes(id)));
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="font-bold text-foreground">Mã hóa đơn</TableHead>
                <TableHead className="font-bold text-foreground">Thời gian</TableHead>
                <TableHead className="font-bold text-foreground">Khách hàng</TableHead>
                <TableHead className="text-right font-bold text-foreground">Tổng tiền</TableHead>
                <TableHead className="text-center font-bold text-foreground">Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill: any) => {
                const productIds = bill.billProducts?.map((p: any) => p.id) || [];
                const isBillSelected = selectedRows.includes(bill.id);
                const isExpanded = expandedRows.includes(bill.id);

                return (
                  <React.Fragment key={bill.id}>
                    <TableRow
                      data-state={isBillSelected && "selected"}
                      className={isExpanded ? "border-b-0 bg-primary/5" : "hover:bg-muted/30"}
                    >
                      <TableCell>
                        <button onClick={() => toggleRowExpand(bill.id)} className="p-1 hover:text-primary transition-colors">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={isBillSelected}
                          onCheckedChange={() => handleSelectRow(bill.id, productIds)}
                        />
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{bill.id}</span>
                            {bill.id === "BILL-2024-005" && (
                               <span className="text-[10px] text-primary flex items-center gap-1 italic">
                                 <ArrowRightLeft size={10} /> Đổi từ BILL-2024-004
                               </span>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bill.createdAt.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{bill.customerName || "Khách lẻ"}</span>
                          <span className="text-xs text-muted-foreground">{bill.phoneNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-bold ${bill.status === 'returned' ? 'text-muted-foreground line-through' : 'text-primary'}`}>
                        {bill.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={getStatusStyle(bill.status)}>
                          {statusOptions.find((o) => o.id === bill.status)?.name || bill.status}
                        </span>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>

                    {/* DETAILS EXPANDED */}
                    {isExpanded && (
                      <TableRow className="bg-primary/5 hover:bg-primary/5 border-b-0 border-l-4 border-primary">
                        <TableCell colSpan={8} className="p-6">
                          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                              <h3 className="text-xl font-bold text-foreground">
                                Chi tiết hóa đơn <span className="text-primary">{bill.id}</span>
                                {bill.status === 'returned' && <span className="ml-3 text-sm font-normal text-destructive italic">(Đã thực hiện trả hàng/đổi hàng)</span>}
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-x-20 gap-y-2 text-sm">
                              <div className="flex justify-between border-b border-border/50 py-1">
                                <span className="text-muted-foreground">Tên hóa đơn:</span>
                                <span className="text-foreground">{bill.name || "N/A"}</span>
                              </div>
                              <div className="flex justify-between border-b border-border/50 py-1">
                                <span className="text-muted-foreground">Khách hàng:</span>
                                <span className="text-primary font-medium">{bill.customerName}</span>
                              </div>
                            </div>

                            <div className="mt-4 rounded-md overflow-hidden border border-border bg-background">
                              <Table>
                                <TableHeader className="bg-muted/50">
                                  <TableRow>
                                    <TableHead className="text-foreground">Mã hàng</TableHead>
                                    <TableHead className="text-foreground">Tên hàng</TableHead>
                                    <TableHead className="text-right text-foreground">Số lượng</TableHead>
                                    <TableHead className="text-right text-foreground">Đơn giá</TableHead>
                                    <TableHead className="text-right text-foreground">Thành tiền</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {bill.billProducts?.map((item: any) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 border-border">
                                      <TableCell className="text-primary font-medium">
                                        {item.productId}
                                      </TableCell>
                                      <TableCell className="text-foreground">{item.productName}</TableCell>
                                      <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                                      <TableCell className="text-right text-foreground">
                                        {item.salePrice.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-right font-medium text-foreground">
                                        {item.total.toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  ))}

                                  {/* BILL SUMMARY */}
                                  <TableRow className="bg-muted/20 font-medium border-t-2 border-border">
                                    <TableCell colSpan={3}></TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                      Tổng tiền hàng:
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-foreground">
                                      {(bill.total + (bill.discount || 0)).toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow className="hover:bg-transparent border-none">
                                    <TableCell colSpan={3}></TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                      Giảm giá:
                                    </TableCell>
                                    <TableCell className="text-right text-destructive font-medium">
                                      -{bill.discount.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow className="hover:bg-transparent border-none">
                                    <TableCell colSpan={3}></TableCell>
                                    <TableCell className="text-right font-bold text-lg text-foreground">
                                      {bill.status === 'returned' ? 'Tiền đã trả:' : 'Khách phải trả:'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg text-primary">
                                      {bill.total.toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>

                            {/* ACTION BUTTONS */}
                            {bill.status === 'active' && (
                              <div className="flex justify-end items-center gap-3 mt-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-muted font-medium">
                                  <FileText className="w-4 h-4 text-primary" />
                                  Đổi hàng
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center gap-2 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all font-medium"
                                >
                                  <Undo2 className="w-4 h-4" />
                                  Trả toàn bộ hàng
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" className="hover:bg-muted text-foreground" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive className="bg-primary text-primary-foreground hover:bg-primary/90">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis className="text-muted-foreground" /></PaginationItem>
              <PaginationItem><PaginationNext href="#" className="hover:bg-muted text-foreground" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default BillsList;