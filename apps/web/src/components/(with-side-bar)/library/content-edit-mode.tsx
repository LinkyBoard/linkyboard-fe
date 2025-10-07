"use client";

import { useRef, useState } from "react";

import { useGetTags } from "@/lib/tanstack/query/tag";
import type { CategoryDTO } from "@/models/category";
import type { ContentSchemaType } from "@/schemas/content";
import { Button, infoToast, Input } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";
import { cn } from "@linkyboard/utils";

import { ChevronDown, Plus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface ContentEditModeProps {
  form: UseFormReturn<ContentSchemaType>;
  categories: CategoryDTO[];
}

export default function ContentEditMode({ form, categories }: ContentEditModeProps) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const tagInputRef = useRef<HTMLInputElement>(null);

  const [tagFormRef] = useOutsideClick<HTMLFormElement>(() => {
    setIsTagDropdownOpen(false);
  });
  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryDropdownOpen(false);
  });

  const { data: tags } = useGetTags();

  const watchedCategory = form.watch("category");
  const watchedTags = form.watch("tags");

  const filteredTags = tags?.filter(
    (tag) =>
      !watchedTags.includes(tag.name) && tag.name.toLowerCase().includes(newTag.toLowerCase())
  );

  const onAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTag = newTag.trim();

    if (watchedTags.includes(trimmedTag)) {
      return infoToast("이미 존재하는 태그입니다.");
    }

    onUpdateTag(trimmedTag);
  };

  const onUpdateTag = (tag: string) => {
    const newTags = [...watchedTags, tag];
    form.setValue("tags", newTags);
    setNewTag("");
  };

  const onRemoveTag = (index: number) => {
    const newTags = watchedTags.filter((_, i) => i !== index);
    form.setValue("tags", newTags);
    tagInputRef.current?.focus();
  };

  const onCategorySelect = (category: string) => {
    form.setValue("category", category.trim());
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-base font-medium">제목</label>
        <Input {...form.register("title")} placeholder="제목을 입력하세요" className="text-base" />
        {form.formState.errors.title && (
          <p className="text-destructive mt-1 text-sm">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-base font-medium">카테고리</label>
        <div ref={dropdownRef} className="relative">
          <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <input
              type="text"
              placeholder="카테고리를 입력하세요"
              className="w-full outline-none"
              onFocus={() => setIsCategoryDropdownOpen(true)}
              {...form.register("category")}
            />
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isCategoryDropdownOpen && categories && (
            <div className="bg-background absolute z-10 mt-5 max-h-52 w-full overflow-y-auto rounded-md border shadow-lg">
              <button
                type="button"
                onClick={() => onCategorySelect(form.watch("category"))}
                disabled={!watchedCategory.trim()}
                className="hover:bg-accent text-foreground block w-full px-3 py-2 text-left text-base"
              >
                {watchedCategory ? `"${watchedCategory}" 사용하기` : "최소 1글자 입력해주세요."}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategorySelect(category.name)}
                  className={cn(
                    "hover:bg-accent text-foreground block w-full px-3 py-2 text-left text-base",
                    watchedCategory === category.name && "bg-accent text-accent-foreground"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {form.formState.errors.category && (
          <p className="text-destructive mt-1 text-sm">{form.formState.errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-base font-medium">태그</label>
        <div className="space-y-3">
          {watchedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchedTags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center space-x-1 rounded-full px-3 py-1 text-base transition-all duration-200 hover:scale-105"
                  onClick={() => onRemoveTag(index)}
                  aria-label={`${tag} 태그 제거`}
                >
                  <span>{tag}</span>
                  <X className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <form ref={tagFormRef} className="relative flex items-center gap-2" onSubmit={onAddTag}>
              <Input
                ref={tagInputRef}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="새 태그 입력"
                className="h-14 flex-1"
                onFocus={() => setIsTagDropdownOpen(true)}
              />
              <Button
                type="submit"
                size="default"
                variant="outline"
                aria-label="태그 추가"
                className="aspect-square h-14 shrink-0"
              >
                <Plus size={20} />
              </Button>
              {isTagDropdownOpen && (
                <div className="absolute -bottom-2 max-h-40 w-full translate-y-full overflow-auto rounded-md border bg-white shadow-lg">
                  {!filteredTags || filteredTags.length === 0 ? (
                    <p className="text-muted-foreground block w-full px-3 py-2 text-left">
                      태그가 없어요.
                    </p>
                  ) : (
                    filteredTags.map((tag) => (
                      <button
                        key={`${tag.id}-${tag.name}`}
                        type="button"
                        className="hover:bg-accent text-foreground line-clamp-1 block w-full px-3 py-2 text-left"
                        onClick={() => onUpdateTag(tag.name)}
                      >
                        <span>{tag.name}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </form>
            <p className="text-muted-foreground text-sm">
              Enter 혹은 + 버튼을 통해 태그를 추가할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-base font-medium">요약</label>
        <textarea
          {...form.register("summary")}
          placeholder="요약을 입력하세요"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-base font-medium">메모</label>
        <textarea
          {...form.register("memo")}
          placeholder="메모를 입력하세요"
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>
    </div>
  );
}
