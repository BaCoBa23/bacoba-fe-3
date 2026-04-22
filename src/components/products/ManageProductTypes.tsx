import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers, Plus, Pencil,  Check, X, Loader2 } from "lucide-react";
import { type ProductType } from "@/types/ProductType";
import {
  createProductType,
  editProductType,
  getProductTypes,
} from "@/services/api";
import { toast } from "sonner"; // Hoặc shadcn toast tùy project
import { Skeleton } from "../ui/skeleton";

interface ManageProductTypesProps {
  onSuccess?: () => void;
}

export function ManageProductTypes({onSuccess}:ManageProductTypesProps) {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Tải danh sách khi mở dialog hoặc mount
  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await getProductTypes();
      if (response.success) {
        setTypes(response.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh mục sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Thêm mới loại sản phẩm qua API
  const handleAdd = async () => {
    // 1. Kiểm tra đầu vào (Loại bỏ khoảng trắng thừa)
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    try {
      const response = await createProductType({
        name: trimmedName,
      });

      if (response) {
        toast.success("Đã thêm nhóm hàng mới");

        // Ép kiểu trực tiếp nếu bạn biết chắc chắn nó là 1 object đơn lẻ
        const newData = response.data as unknown as ProductType;
        if (onSuccess) {
          onSuccess();
        }
        setTypes((prev) => [...prev, newData]);

        // 4. Reset input
        setNewName("");
      }
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Lỗi khi thêm nhóm hàng");
    }
    finally {
      setLoading(false);
    }
  };

  // Bắt đầu chế độ chỉnh sửa
  const startEdit = (type: ProductType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  // Lưu cập nhật qua API
  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
  
    try {
      const response = await editProductType(id, { name: editName });
  
      if (response) {
        toast.success("Cập nhật thành công");
        
        // Extract the updated object from the response
        const updatedItem = response.data as unknown as ProductType;
        if (onSuccess) {
          onSuccess();
        }
        // 1. Update the list: Replace the old item with the updated one
        setTypes((prev) => 
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
  
        // 2. Reset UI state
        setEditingId(null);
        setEditName(""); // Ensure you are clearing the correct state variable
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật");
    }
    finally {
      setLoading(false);
    }
  };

  // Xóa loại sản phẩm qua API
  // const handleDelete = async (id: string) => {
  //   if (confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
  //     try {
  //       await deleteProductType(id);
  //       toast.success("Đã xóa nhóm hàng");
  //       fetchTypes();
  //     } catch (error) {
  //       toast.error("Lỗi khi xóa: Nhóm hàng có thể đang chứa sản phẩm");
  //     }
  //   }
  // };

  return (
    <Dialog onOpenChange={(open) => open && fetchTypes()}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="gap-2">
          <Layers className="h-4 w-4" /> Quản lý nhóm hàng
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Danh mục loại sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Form thêm mới */}
          <div className="flex gap-2">
            <Input
              placeholder="Tên loại sản phẩm (VD: Áo sơ mi...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              disabled={loading}
            />
            <Button onClick={handleAdd} disabled={!newName.trim() || loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Thêm
            </Button>
          </div>

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Tên loại sản phẩm</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // SKELETON LOADING STATE
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[200px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : types.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Chưa có loại sản phẩm nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  // DATA STATE
                  types.map((type) => (
                    <TableRow key={type.id} className="group">
                      <TableCell>
                        {editingId === type.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 focus-visible:ring-primary"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleUpdate(type.id)}
                          />
                        ) : (
                          <span className="font-medium">{type.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {editingId === type.id ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:bg-primary/10"
                                onClick={() => handleUpdate(type.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                                onClick={() => startEdit(type)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {/* <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                                onClick={() => handleDelete(type.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button> */}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* ... (Footer giữ nguyên) */}
      </DialogContent>
    </Dialog>
  );
}
