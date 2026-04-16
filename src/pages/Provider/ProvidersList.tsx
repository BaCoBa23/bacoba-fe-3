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
  AlertCircle,
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
// Import mock data và types
import { MOCK_PROVIDERS } from "@/types/Provider";
import { MOCK_HISTORY_PROVIDERS } from "@/types/HistoryProvider";
// Import API functions
import {
  getProviders,
  getHistoryProvidersByProviderId,
  deleteProvider,
  deleteHistoryProvider,
  type ProviderResponse,
  type HistoryProviderResponse,
} from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagCombobox from "@/components/ui/TagCombobox";
import AddNewProvider from "@/components/provider/AddNewProvider";
import AddNewHistory from "@/components/provider/AddNewHistory";
import EditProviderDialog from "@/components/provider/EditProviderDialog";
import EditHistoryProvider from "@/components/provider/EditHistoryProvider";

function ProvidersList() {
  interface Option {
    id: string;
    name: string;
  }

  const statusOptions: Option[] = [
    { id: "active", name: "Đang hoạt động" },
    { id: "inactive", name: "Ngừng hoạt động" },
  ];

  // State management
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // API state
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [histories, setHistories] = useState<Record<number, HistoryProviderResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = selectedStatus.length > 0 ? selectedStatus[0].id : undefined;
        const response = await getProviders({
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
          status,
        });

        if (response.success && response.data) {
          setProviders(response.data);
          setTotalItems(response.meta.totalItems);
          setTotalPages(response.meta.totalPages);
          setCurrentPage(response.meta.currentPage);
        } else {
          setError(response.message || "Không thể lấy dữ liệu nhà cung cấp");
          // Fallback to MOCK data if API fails
          setProviders(MOCK_PROVIDERS.map((p) => ({
            id: parseInt(p.id.replace("PROV-", "")),
            name: p.name,
            phoneNumber: p.phoneNumber,
            email: p.email,
            debtTotal: p.debtTotal,
            total: p.total,
            status: p.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })));
        }
      } catch (err: any) {
        console.error("Error fetching providers:", err);
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Lỗi khi lấy danh sách nhà cung cấp";
        setError(errorMsg);
        // Fallback to MOCK data
        setProviders(MOCK_PROVIDERS.map((p) => ({
          id: parseInt(p.id.replace("PROV-", "")),
          name: p.name,
          phoneNumber: p.phoneNumber,
          email: p.email,
          debtTotal: p.debtTotal,
          total: p.total,
          status: p.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [currentPage, pageSize, searchQuery, selectedStatus]);

  // Fetch history when expanding a provider row
  const fetchProviderHistories = async (providerId: number) => {
    try {
      const response = await getHistoryProvidersByProviderId(providerId);
      if (response.success && response.data) {
        setHistories((prev) => ({
          ...prev,
          [providerId]: response.data,
        }));
      }
    } catch (err: any) {
      console.error(`Error fetching histories for provider ${providerId}:`, err);
      // Fallback to MOCK history
      const mockHistories = MOCK_HISTORY_PROVIDERS.slice(
        (providerId - 1) * 2,
        providerId * 2
      );
      setHistories((prev) => ({
        ...prev,
        [providerId]: mockHistories.map((h) => ({
          id: parseInt(h.id.replace("HIST-", "")),
          providerId,
          paidAmount: h.paidAmount,
          description: h.description,
          status: h.status,
          createdAt: h.createdAt instanceof Date 
            ? h.createdAt.toISOString() 
            : new Date(h.createdAt).toISOString(),
          updatedAt: h.updatedAt instanceof Date 
            ? h.updatedAt.toISOString() 
            : new Date(h.updatedAt).toISOString(),
        })),
      }));
    }
  };
  
  // Logic lọc Nhà cung cấp
  const filteredProviders = providers.filter((prov) => {
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.some((s) => s.id === prov.status);
    const matchesSearch =
      prov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prov.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- TÍNH TOÁN TỔNG CỘNG CHO TABLE CHA ---
  const grandTotalBuy = filteredProviders.reduce((sum, p) => sum + p.total, 0);
  const grandTotalDebt = filteredProviders.reduce(
    (sum, p) => sum + p.debtTotal,
    0
  );
  const grandTotalPaid = grandTotalBuy - grandTotalDebt;

  const toggleRowExpand = async (id: number | string) => {
    const idNum = typeof id === "string" ? parseInt(id) : id;
    setExpandedRows((prev) => {
      const isExpanded = prev.includes(idNum.toString());
      if (!isExpanded) {
        // Fetch histories when expanding
        fetchProviderHistories(idNum);
      }
      return isExpanded 
        ? prev.filter((rid) => rid !== idNum.toString()) 
        : [...prev, idNum.toString()];
    });
  };

  const handleSelectRow = (id: number | string) => {
    const idStr = id.toString();
    setSelectedRows((prev) =>
      prev.includes(idStr) ? prev.filter((rid) => rid !== idStr) : [...prev, idStr]
    );
  };

  const handleDeleteProvider = async (providerId: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await deleteProvider(providerId);
        alert("Xóa nhà cung cấp thành công!");
        // Refresh providers list
        setProviders((prev) => prev.filter((p) => p.id !== providerId));
      } catch (err: any) {
        console.error("Error deleting provider:", err);
        const errorMsg =
          err.response?.data?.message || "Lỗi xóa nhà cung cấp";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
  };

  const handleDeleteHistory = async (historyId: number, providerId: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa lịch sử thanh toán này?")) {
      try {
        await deleteHistoryProvider(historyId);
        alert("Xóa lịch sử thanh toán thành công!");
        // Refresh histories for this provider
        setHistories((prev) => ({
          ...prev,
          [providerId]: prev[providerId]?.filter((h) => h.id !== historyId) || [],
        }));
      } catch (err: any) {
        console.error("Error deleting history:", err);
        const errorMsg =
          err.response?.data?.message || "Lỗi xóa lịch sử thanh toán";
        alert(`Lỗi: ${errorMsg}`);
      }
    }
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
          <AddNewProvider />
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải danh sách nhà cung cấp...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Lỗi</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        ) : null}
        
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
                <TableCell
                  colSpan={5}
                  className="text-right text-foreground py-4"
                ></TableCell>
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
              const isExpanded = expandedRows.includes(prov.id.toString());
              const isSelected = selectedRows.includes(prov.id.toString());
              const providerHistories = histories[prov.id] || [];

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
                    <TableCell className="text-sm ">{prov.id}</TableCell>
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
                              onSelect={() => handleDeleteProvider(prov.id)}
                            >
                              Xóa NCC
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-accent cursor-pointer"
                              onSelect={(event) => event.preventDefault()}
                            >
                              <EditProviderDialog provider={{
                                id: prov.id.toString(),
                                name: prov.name,
                                phoneNumber: prov.phoneNumber,
                                email: prov.email,
                                debtTotal: prov.debtTotal,
                                total: prov.total,
                                status: prov.status,
                                createdAt: prov.createdAt,
                                updatedAt: prov.updatedAt,
                                histories: [],
                                receivedNotes: [],
                              }}/>
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
                                          {new Date(hist.createdAt).toLocaleString(
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
                                              hist.status === "active"
                                                ? "text-chart-4 bg-chart-4/10 px-2 py-0.5 rounded text-xs"
                                                : "text-chart-5 bg-chart-5/10 px-2 py-0.5 rounded text-xs"
                                            }
                                          >
                                            {hist.status === "active"
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
                                                onSelect={() => handleDeleteHistory(hist.id, prov.id)}
                                              >
                                                Xóa
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                className="hover:bg-accent cursor-pointer"
                                                onSelect={(event) => event.preventDefault()}
                                              >
                                                <EditHistoryProvider 
                                                providerId={prov.id.toString()}
                                                history={{
                                                  id: hist.id.toString(),
                                                  paidAmount: hist.paidAmount,
                                                  description: hist.description,
                                                  status: hist.status,
                                                  createdAt: new Date(hist.createdAt),
                                                  updatedAt: new Date(hist.updatedAt),
                                                }}
                                                providerName={prov.name}
                                                currentDebtOfProvider={prov.debtTotal}
                                                />
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
                            <AddNewHistory
                              providerId={prov.id.toString()}
                              providerName={prov.name}
                              currentDebt={prov.debtTotal}
                            />
                            
                            
                              <EditProviderDialog provider={{
                                id: prov.id.toString(),
                                name: prov.name,
                                phoneNumber: prov.phoneNumber,
                                email: prov.email,
                                debtTotal: prov.debtTotal,
                                total: prov.total,
                                status: prov.status,
                                createdAt: prov.createdAt,
                                updatedAt: prov.updatedAt,
                                histories: [],
                                receivedNotes: [],
                              }}/>
                           
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
              <PaginationPrevious 
                className="hover:bg-accent cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className={page === currentPage ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {totalPages > 5 && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>}
            
            <PaginationItem>
              <PaginationNext 
                className="hover:bg-accent cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default ProvidersList;
