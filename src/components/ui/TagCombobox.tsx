import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Option {
  id: string;
  name: string;
}

interface TagComboboxProps {
  options: Option[];
  selected: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  label?: string;
}
export default function TagCombobox({
  label,
  options,
  selected,
  onChange,
  placeholder = "Chọn...",
}: TagComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: Option) => {
    const isSelected = selected.some((s) => s.id === item.id);
    if (isSelected) {
      // Nếu đã tồn tại id này thì xóa khỏi danh sách
      onChange(selected.filter((v) => v.id !== item.id));
    } else {
      // Nếu chưa có thì thêm object mới vàos
      onChange([...selected, item]);
    }
  };

  return (
    <div>
      <label className="text-base font-medium text-foreground block mb-1">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            onClick={() => setOpen(true)}
            className="w-full cursor-pointer min-h-[40px] flex items-center flex-wrap gap-1 px-3 py-2 border border-input rounded-md bg-background text-sm "
          >
            {selected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selected.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1 bg-primary text-primary-foreground"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Lọc bỏ theo id khi nhấn dấu X
                    onChange(selected.filter((item) => item.id !== tag.id));
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Tìm..." />
            <CommandEmpty>Không có kết quả</CommandEmpty>
            <div className="max-h-60 overflow-y-auto">
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    // Truyền name vào value để Command có thể search theo tên
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                  >
                    {/* Kiểm tra tích xanh dựa trên id */}
                    {selected.some((s) => s.id === item.id) ? "✔ " : ""}
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
