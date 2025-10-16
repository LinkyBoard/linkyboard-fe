import { useRef, useState } from "react";

import { useGetTags } from "@/lib/tanstack/query/tag";
import type { ContentSchemaType } from "@/schemas/content";
import { Button, infoToast, Input } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";

import { Plus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface SelectTagProps {
  form: UseFormReturn<ContentSchemaType>;
}

export default function SelectTag({ form }: SelectTagProps) {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const tagInputRef = useRef<HTMLInputElement>(null);

  const [tagFormRef] = useOutsideClick<HTMLFormElement>(() => {
    setIsTagDropdownOpen(false);
  });

  const { data: allTags } = useGetTags();

  const watchedTags = form.watch("tags");

  // 필터링된 태그 계산
  const filteredTags = allTags?.filter(
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

  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-medium">태그</h2>
      <div className="space-y-3">
        {/* 기존 태그들 */}
        {watchedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag, index) => (
              <button
                key={index}
                type="button"
                className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center space-x-1 rounded-full px-3 py-1 text-sm transition-all duration-200 hover:scale-105"
                onClick={() => onRemoveTag(index)}
                aria-label={`${tag} 태그 제거`}
              >
                <span>{tag}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {/* 새 태그 추가 */}
        <div className="space-y-2">
          <form ref={tagFormRef} className="relative flex items-center gap-2" onSubmit={onAddTag}>
            <Input
              ref={tagInputRef}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="새 태그 입력"
              className="flex-1"
              onFocus={() => setIsTagDropdownOpen(true)}
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              aria-label="태그 추가"
              className="aspect-square h-full shrink-0"
            >
              <Plus />
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
          <p className="text-muted-foreground text-xs">
            Enter 혹은 + 버튼을 통해 태그를 추가할 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
