import { useState } from "react";
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
import { Layers, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { MOCK_PRODUCT_TYPES, type ProductType } from "@/types";

export function ManageProductTypes() {
  const [types, setTypes] = useState<ProductType[]>(MOCK_PRODUCT_TYPES);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Thêm mới loại sản phẩm
  const handleAdd = () => {
    if (!newName.trim()) return;
    const newType: ProductType = {
      id: `TYPE-${Date.now()}`,
      name: newName,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTypes([newType, ...types]);
    setNewName("");
  };

  // Bắt đầu chế độ chỉnh sửa
  const startEdit = (type: ProductType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  // Lưu cập nhật
  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    setTypes(
      types.map((t) =>
        t.id === id ? { ...t, name: editName, updatedAt: new Date() } : t
      )
    );
    setEditingId(null);
  };

  // Xóa loại sản phẩm
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
      setTypes(types.filter((t) => t.id !== id));
    }
  };

  return (
    <Dialog>
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
          {/* Form thêm mới nhanh */}
          <div className="flex gap-2">
            <Input
              placeholder="Tên loại sản phẩm (VD: Áo sơ mi...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={!newName.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </Button>
          </div>

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Tên loại sản phẩm</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                      Chưa có loại sản phẩm nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  types.map((type) => (
                    <TableRow key={type.id}>
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
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
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
                                className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                onClick={() => startEdit(type)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(type.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        <DialogFooter className="sm:justify-start">
          <p className="text-[11px] text-muted-foreground italic">
            * Lưu ý: Việc xóa hoặc đổi tên loại sản phẩm sẽ ảnh hưởng đến các dữ liệu liên quan.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}