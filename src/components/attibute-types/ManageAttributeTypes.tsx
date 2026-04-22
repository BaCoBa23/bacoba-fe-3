import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Settings2, Plus, Pencil, Check, X } from "lucide-react";
import {  type AttributeType } from "@/types";
import { createAttributeType, editAttributeType, getAttributeTypes } from "@/services/api";
import { toast } from "sonner";

interface ManageAttributeTypesProps {
  types: AttributeType[];
  setTypes: React.Dispatch<React.SetStateAction<AttributeType[]>>;
  onSuccess?: () => void;
}

export function ManageAttributeTypes({ types, setTypes, onSuccess }: ManageAttributeTypesProps) {
  const [, setLoading] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dữ liệu từ API
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await getAttributeTypes();
      if (response.success) {
        setTypes(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại thuộc tính:", error);
      toast.error("Không thể tải danh sách loại thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetch khi component mount (hoặc có thể fetch khi nhấn vào Trigger)
  useEffect(() => {
    fetchTypes();
  }, []);

  // Thêm mới
  const handleAdd = async () => {
    const trimmedName = newTypeName.trim();
    if (!trimmedName) return;

    try {
      const response = await createAttributeType({
        name: trimmedName,
      });

      if (response) {
        toast.success("Đã thêm nhóm hàng mới");

        // Ép kiểu trực tiếp nếu bạn biết chắc chắn nó là 1 object đơn lẻ
        const newData = response.data as unknown as AttributeType;

        setTypes((prev) => [...prev, newData]);
        if (onSuccess) {
          onSuccess();
        }
        // 4. Reset input
        setNewTypeName("");
      }
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Lỗi khi thêm nhóm hàng");
    }
    finally {
      setLoading(false);
    }
  };


  // Bắt đầu sửa
  const startEdit = (type: AttributeType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  // Lưu sửa đổi
  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
  
    try {
      const response = await editAttributeType(id, { name: editName });
  
      if (response) {
        toast.success("Cập nhật thành công");
        
        // Extract the updated object from the response
        const updatedItem = response.data as unknown as AttributeType;
  
        // 1. Update the list: Replace the old item with the updated one
        setTypes((prev) => 
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
        if (onSuccess) {
          onSuccess();
        }
  
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

  // Xóa
  //   const handleDelete = (id: string) => {
  //     if (confirm("Bạn có chắc chắn muốn xóa loại thuộc tính này?")) {
  //       setTypes(types.filter((t) => t.id !== id));
  //     }
  //   };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="gap-2 text-primary p-0 h-auto font-semibold"
        >
          <Settings2 className="h-4 w-4" /> Quản lý loại thuộc tính
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Quản lý loại thuộc tính
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Form thêm mới nhanh */}
          <div className="flex gap-2">
            <Input
              placeholder="Tên loại thuộc tính mới (VD: Độ dày...)"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="border-border focus-visible:ring-primary"
            />
            <Button
              onClick={handleAdd}
              disabled={!newTypeName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </Button>
          </div>

          <div className="border border-border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-bold">
                    Tên loại thuộc tính
                  </TableHead>
                  <TableHead className="w-[120px] text-right text-foreground font-bold">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type) => (
                  <TableRow
                    key={type.id}
                    className="border-border hover:bg-muted/10"
                  >
                    <TableCell>
                      {editingId === type.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 border-primary focus-visible:ring-primary"
                          autoFocus
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleUpdate(type.id)
                          }
                        />
                      ) : (
                        <span className="font-medium text-foreground">
                          {type.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {editingId === type.id ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleUpdate(type.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => startEdit(type)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {/* <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:justify-start">
          <p className="text-[11px] text-muted-foreground italic w-full">
            * Lưu ý: Việc xóa loại thuộc tính có thể ảnh hưởng đến các sản phẩm
            đang sử dụng trong hệ thống.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
