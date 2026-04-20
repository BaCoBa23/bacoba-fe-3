import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList, // Thêm CommandList để quản lý cuộn tốt hơn
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { X, Plus } from "lucide-react"; // Thêm icon Plus
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
  onAdd?: (inputValue: string) => void; // Function để add giá trị mới
  showAddOption?: boolean; // Option để ẩn/hiện nút add
  placeholder?: string;
  label?: string;
}

export default function TagCombobox({
  label,
  options,
  selected,
  onChange,
  onAdd,
  showAddOption = true,
  placeholder = "Chọn...",
}: TagComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State lưu giá trị input search

  const handleSelect = (item: Option) => {
    const isSelected = selected.some((s) => s.id === item.id);
    if (isSelected) {
      onChange(selected.filter((v) => v.id !== item.id));
    } else {
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
            <CommandInput
              placeholder="Tìm..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>Không có kết quả</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                  >
                    {selected.some((s) => s.id === item.id) ? "✔ " : ""}
                    {item.name}
                  </CommandItem>
                ))}
                {showAddOption && inputValue.trim() !== "" && (
                <CommandItem>
                  <button
                    onClick={() => {
                      onAdd?.(inputValue);
                      setInputValue("");
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer text-primary font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới: "{inputValue}"
                  </button>
                </CommandItem>
            )}

              </CommandGroup>
            </CommandList>


          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
