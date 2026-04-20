import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  ShoppingCart,
  User,
  CreditCard,
  X,
  FileText,
  Search,
  Minus,
  ScanBarcode,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PRODUCTS, type Bill, type Product } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_BILLS = 10;
const STORAGE_KEY = "temp_sales_pos_bills";

export default function SalePOS() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeBillId, setActiveBillId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const formatNumber = (num: number) => num.toLocaleString("en-US");
  const parseFormattedNumber = (value: string) => Number(value.replace(/,/g, "")) || 0;

  // --- GIỮ NGUYÊN LOGIC DỮ LIỆU ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const formatted = parsed.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
          billProducts: b.billProducts || [],
        }));
        setBills(formatted);
        if (formatted.length > 0) setActiveBillId(formatted[0].id);
      } catch (e) { createNewBill(); }
    } else { createNewBill(); }
  }, []);

  useEffect(() => {
    if (bills.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [bills]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const results: Product[] = [];
    MOCK_PRODUCTS.forEach((parent) => {
      if (parent.variants && Array.isArray(parent.variants)) {
        parent.variants.forEach((variant: Product) => {
          if (isSearchFocused && !term) results.push(variant);
          else if (term && (variant.name.toLowerCase().includes(term) || variant.id.toLowerCase().includes(term) || (variant.barcode && variant.barcode.toLowerCase().includes(term)))) {
            results.push(variant);
          }
        });
      }
    });
    setSearchResults(results.slice(0, 15));
  }, [searchTerm, isSearchFocused]);

  const activeBill = useMemo(() => bills.find((b) => b.id === activeBillId), [bills, activeBillId]);

  const createNewBill = () => {
    if (bills.length >= MAX_BILLS) {
      toast.error(`Giới hạn tối đa ${MAX_BILLS} hóa đơn!`);
      return;
    }
    const newBill: Bill = {
      id: `HD${Date.now().toString().slice(-6)}`,
      customerName: "", phoneNumber: "", name: "", discount: 0, total: 0,
      status: "active", createdAt: new Date(), updatedAt: new Date(), billProducts: [],
    };
    setBills((prev) => [...prev, newBill]);
    setActiveBillId(newBill.id);
  };

  const updateActiveBill = (fields: Partial<Bill>) => {
    setBills((prev) => prev.map((b) => b.id === activeBillId ? { ...b, ...fields, updatedAt: new Date() } : b));
  };

  const addProductToBill = (product: Product) => {
    if (!activeBillId) return;
    setBills((prev) => prev.map((bill) => {
      if (bill.id !== activeBillId) return bill;
      const products = bill.billProducts || [];
      const existingIdx = products.findIndex((p: any) => p.id === product.id);
      let newProducts: any[];
      if (existingIdx > -1) {
        newProducts = [...products];
        newProducts[existingIdx] = { ...newProducts[existingIdx], quantity: (newProducts[existingIdx].quantity || 0) + 1 };
      } else {
        newProducts = [...products, { ...product, quantity: 1 }];
      }
      return { ...bill, billProducts: newProducts, total: newProducts.reduce((sum, p) => sum + p.salePrice * p.quantity, 0), updatedAt: new Date() };
    }));
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setBills((prev) => prev.map((bill) => {
      if (bill.id !== activeBillId) return bill;
      const newProducts = (bill.billProducts || []).map((p: any) => 
        p.id === productId ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p
      );
      return { ...bill, billProducts: newProducts, total: newProducts.reduce((sum, p) => sum + p.salePrice * p.quantity, 0) };
    }));
  };

  const removeProductFromBill = (productId: string) => {
    setBills((prev) => prev.map((bill) => {
      if (bill.id !== activeBillId) return bill;
      const newProducts = (bill.billProducts || []).filter((p: any) => p.id !== productId);
      return { ...bill, billProducts: newProducts, total: newProducts.reduce((sum, p) => sum + p.salePrice * (p.quantity || 0), 0) };
    }));
  };

  const removeBill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBills = bills.filter((b) => b.id !== id);
    setBills(newBills);
    if (activeBillId === id) setActiveBillId(newBills.length > 0 ? newBills[0].id : null);
  };

  const handleCheckout = () => {
    if (!activeBill?.billProducts?.length) return;
    toast.success(`Thanh toán thành công đơn hàng ${activeBill.id}`);
    const newBills = bills.filter((b) => b.id !== activeBillId);
    setBills(newBills);
    setActiveBillId(newBills.length > 0 ? newBills[0].id : null);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-background text-foreground border-t border-border overflow-hidden">
      
      {/* SIDEBAR LEFT: DANH SÁCH HÓA ĐƠN */}
      <aside className="w-16 lg:w-64 border-r border-border flex flex-col bg-card shrink-0">
        <div className="p-3 border-b border-border flex items-center justify-between h-14 shrink-0">
          <h2 className="font-bold text-xs hidden lg:block uppercase tracking-widest text-muted-foreground">Hóa đơn chờ</h2>
          <Button size="icon" variant="ghost" onClick={createNewBill} className="h-8 w-8 text-primary hover:bg-primary/10">
            <Plus size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {bills.map((bill) => (
            <div
              key={bill.id}
              onClick={() => setActiveBillId(bill.id)}
              className={`p-3 mb-1 rounded-sm border cursor-pointer group flex flex-col ${
                activeBillId === bill.id ? "bg-primary/5 border-primary/40" : "border-transparent hover:bg-muted border-b-border/50"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-mono ${activeBillId === bill.id ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {bill.id}
                </span>
                <X size={14} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => removeBill(bill.id, e)} />
              </div>
              <p className="font-semibold text-sm truncate hidden lg:block">{bill.customerName || "Khách lẻ"}</p>
              <p className="font-bold text-xs mt-1 text-foreground">{bill.total.toLocaleString()}đ</p>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN: KHU VỰC TRUNG TÂM */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        
        {/* HEADER TÌM KIẾM - Dùng Flex thay vì Absolute cho kết quả */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
          <div className="flex-1 max-w-2xl flex items-center gap-2 bg-background border border-border rounded-md px-3 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="text-muted-foreground" size={16} />
            <Input
              ref={searchInputRef}
              placeholder="F2: Tìm sản phẩm (Tên, Mã, Barcode)..."
              className="border-none shadow-none focus-visible:ring-0 h-10 px-0"
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="ml-4 h-10 w-10 hover:text-primary">
            <ScanBarcode size={18} />
          </Button>
        </header>

        {/* CONTAINER CHÍNH CỦA TABLE VÀ SEARCH RESULTS */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
            
          {/* LỚP PHỦ TÌM KIẾM (Chỉ phần này dùng absolute vì nó là dropdown nổi lên trên bảng) */}
          {isSearchFocused && searchResults.length > 0 && (
            <div 
                className="absolute top-0 left-4 right-4 bg-card border border-border shadow-2xl z-[100] max-h-80 overflow-y-auto rounded-b-md"
                onBlur={() => setIsSearchFocused(false)}
            >
                {searchResults.map((p) => (
                    <div key={p.id} className="p-3 hover:bg-primary/5 cursor-pointer border-b border-border/50 flex justify-between items-center" onMouseDown={(e) => e.preventDefault()} onClick={() => addProductToBill(p)}>
                        <div className="flex flex-col"><span className="text-sm font-bold">{p.name}</span><span className="text-[10px] text-muted-foreground">{p.id}</span></div>
                        <span className="text-sm font-black text-primary">{p.salePrice.toLocaleString()}đ</span>
                    </div>
                ))}
            </div>
          )}

          {/* VÙNG BẢNG GIỎ HÀNG - Sử dụng flex-1 và overflow-auto để cuộn nội dung */}
          <section className="flex-1 p-4 bg-muted/10 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col border border-border rounded-md bg-card overflow-hidden">
              <div className="flex-1 overflow-auto custom-scrollbar">
                <Table>
                  <TableHeader className="bg-muted/50 border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="text-xs font-black uppercase">Sản phẩm</TableHead>
                      <TableHead className="text-center w-32 text-xs font-black uppercase">Số lượng</TableHead>
                      <TableHead className="text-right text-xs font-black uppercase">Đơn giá</TableHead>
                      <TableHead className="text-right text-xs font-black uppercase">Thành tiền</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBill?.billProducts?.map((item: any, idx) => (
                      <TableRow key={item.id} className="group hover:bg-muted/30">
                        <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="py-3">
                          <span className="font-bold text-sm block">{item.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.id}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-3">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></Button>
                            <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7 text-primary border-primary/30" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">{item.salePrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-black text-sm">{(item.salePrice * item.quantity).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:text-destructive" onClick={() => removeProductFromBill(item.id)}><Trash2 size={16} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!activeBill || activeBill.billProducts?.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground/30">
                    <ShoppingCart size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-sm font-bold tracking-widest uppercase">Giỏ hàng đang trống</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* SIDEBAR RIGHT: THANH TOÁN */}
      <aside className="w-80 border-l border-border bg-card flex flex-col shrink-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <User size={18} className="text-primary" />
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Khách hàng</span>
            </div>
            <Input placeholder="Tên khách hàng" className="h-10 text-sm" value={activeBill?.customerName ?? ""} onChange={(e) => updateActiveBill({ customerName: e.target.value })} />
            <Input placeholder="Số điện thoại" className="h-10 text-sm" value={activeBill?.phoneNumber ?? ""} onChange={(e) => updateActiveBill({ phoneNumber: e.target.value })} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2.5">
              <FileText size={18} className="text-primary" />
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Thanh toán</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền</span>
                <span className="font-bold">{activeBill?.total.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <div className="flex items-center border-b border-destructive/20 w-24">
                  <Input 
                    type="text" 
                    className="h-8 border-none bg-transparent text-right p-0 focus-visible:ring-0" 
                    value={formatNumber(activeBill?.discount ?? 0)} 
                    onChange={(e) => updateActiveBill({ discount: parseFormattedNumber(e.target.value) })} 
                  />
                  <span className="font-bold text-xs ml-1">đ</span>
                </div>
              </div>
              <div className="pt-3 border-t border-dashed flex justify-between items-end">
                <span className="text-xs font-bold uppercase text-muted-foreground">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">
                  {((activeBill?.total || 0) - (activeBill?.discount || 0)).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
             <textarea className="w-full h-24 bg-background border border-border rounded-md p-3 text-sm outline-none" placeholder="Ghi chú..." value={activeBill?.name ?? ""} onChange={(e) => updateActiveBill({ name: e.target.value })} />
          </div>
        </div>

        <div className="p-5 border-t border-border bg-card shrink-0">
          <Button 
            className="w-full h-16 text-base font-black bg-primary hover:bg-primary/90 flex gap-3" 
            disabled={!activeBill?.billProducts?.length} 
            onClick={handleCheckout}
          >
            <CreditCard size={18} /> THANH TOÁN
          </Button>
        </div>
      </aside>
    </div>
  );
}