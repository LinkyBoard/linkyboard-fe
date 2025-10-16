import { useState } from "react";

import { useGetCategories } from "@/lib/tanstack/query/category";
import type { ContentSchemaType } from "@/schemas/content";
import { useOutsideClick } from "@linkyboard/hooks";

import { ChevronDown } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface SelectCategoryProps {
  category: string;
  form: UseFormReturn<ContentSchemaType>;
}

export default function SelectCategory({ category, form }: SelectCategoryProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryOpen(false);
  });

  const { data: userCategories } = useGetCategories();

  const categories = [...(category ? [category] : []), ...(userCategories || [])];

  const watchedCategory = form.watch("category");

  const onCategorySelect = (category: string) => {
    form.setValue("category", category.trim());
    setIsCategoryOpen(false);
  };

  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-medium">카테고리</h2>
      <div ref={dropdownRef} className="relative">
        <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <input
            type="text"
            placeholder="카테고리를 입력하세요"
            className="w-full outline-none"
            onFocus={() => setIsCategoryOpen(true)}
            {...form.register("category")}
          />
          <button type="button" onClick={() => setIsCategoryOpen((prev) => !prev)}>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {isCategoryOpen && (
          <div className="bg-background absolute z-10 mt-5 max-h-52 w-full overflow-y-auto rounded-md border shadow-lg">
            <button
              type="button"
              onClick={() => onCategorySelect(watchedCategory)}
              disabled={!watchedCategory.trim()}
              className="hover:bg-accent text-foreground block w-full px-3 py-2 text-left text-sm"
            >
              {watchedCategory ? `"${watchedCategory}" 사용하기` : "최소 1글자 입력해주세요."}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategorySelect(category)}
                className={`hover:bg-accent block w-full px-3 py-2 text-left text-sm ${
                  watchedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      {form.formState.errors.category && (
        <p className="text-destructive mt-1 text-xs">{form.formState.errors.category.message}</p>
      )}
    </div>
  );
}
