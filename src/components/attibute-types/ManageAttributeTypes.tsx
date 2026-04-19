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
import { Settings2, Plus, Pencil, Check, X } from "lucide-react";
import { mockAttributeTypes, type AttributeType } from "@/types";

export function ManageAttributeTypes() {
  const [types, setTypes] = useState<AttributeType[]>(mockAttributeTypes);
  const [newTypeName, setNewTypeName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Thêm mới
  const handleAdd = () => {
    if (!newTypeName.trim()) return;
    const newType: AttributeType = {
      id: `type-${Date.now()}`,
      name: newTypeName,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTypes([...types, newType]);
    setNewTypeName("");
  };

  // Bắt đầu sửa
  const startEdit = (type: AttributeType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  // Lưu sửa đổi
  const handleUpdate = (id: string) => {
    setTypes(
      types.map((t) =>
        t.id === id ? { ...t, name: editName, updatedAt: new Date() } : t
      )
    );
    setEditingId(null);
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
