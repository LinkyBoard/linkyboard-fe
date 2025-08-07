"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { KnowledgeItemProps } from "@/types/library";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";

import { Edit, Link, Plus, Save, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface KnowledgeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  knowledge: KnowledgeItemProps | null;
  onUpdate: (updatedKnowledge: KnowledgeItemProps) => void;
  onDelete: (id: number) => void;
}

export default function KnowledgeSidebar({
  isOpen,
  onClose,
  knowledge,
  onUpdate,
  onDelete,
}: KnowledgeSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(onClose);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      summary: "",
      memo: "",
      tags: [],
    },
  });

  const watchedTags = watch("tags");

  const onEdit = () => {
    if (knowledge) {
      reset({
        title: knowledge.title,
        summary: knowledge.summary || "",
        memo: knowledge.memo || "",
        tags: knowledge.tags,
      });
      setIsEditing(true);
    }
  };

  const onSave = handleSubmit((data) => {
    if (knowledge) {
      const updatedKnowledge: KnowledgeItemProps = {
        ...knowledge,
        ...data,
      };
      onUpdate(updatedKnowledge);
      setIsEditing(false);
    }
  });

  const onCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onDeleteKnowledge = () => {
    if (knowledge && confirm("정말로 이 지식을 삭제하시겠습니까?")) {
      onDelete(knowledge.id);
      onClose();
    }
  };

  const onAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTag = e.currentTarget.querySelector("input")?.value;
    const trimmedTag = newTag?.trim();

    if (!trimmedTag) {
      return;
    }

    if (watchedTags.includes(trimmedTag)) {
      return;
    }

    const newTags = [...watchedTags, trimmedTag];
    setValue("tags", newTags);
    e.currentTarget.reset();
  };

  const onRemoveTag = (index: number) => {
    const newTags = watchedTags.filter((_, i) => i !== index);
    setValue("tags", newTags);
    tagInputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        isOpen && "pointer-events-auto bg-black/50"
      )}
      aria-label="사이드바 닫기"
    >
      {/* 사이드바 */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-all duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{isEditing ? "콘텐츠 편집" : "콘텐츠 상세"}</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="사이드바 닫기">
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto p-6">
            {isEditing ? (
              // 편집 모드
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">제목</label>
                  <Input {...register("title")} placeholder="제목을 입력하세요" />
                  {errors.title && (
                    <p className="text-destructive mt-1 text-xs">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">요약</label>
                  <textarea
                    {...register("summary")}
                    placeholder="요약을 입력하세요"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                  {errors.summary && (
                    <p className="text-destructive mt-1 text-xs">{errors.summary.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">메모</label>
                  <textarea
                    {...register("memo")}
                    placeholder="메모를 입력하세요"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  />
                  {errors.memo && (
                    <p className="text-destructive mt-1 text-xs">{errors.memo.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">태그</label>
                  <div className="space-y-3">
                    {/* 기존 태그들 */}
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

                    {/* 새 태그 추가 */}
                    <div className="space-y-2">
                      <form className="flex space-x-2" onSubmit={onAddTag}>
                        <Input ref={tagInputRef} placeholder="새 태그 입력" className="flex-1" />
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          aria-label="태그 추가"
                          className="aspect-square h-full shrink-0"
                        >
                          <Plus />
                        </Button>
                      </form>
                      <p className="text-muted-foreground text-xs">
                        Enter 혹은 + 버튼을 통해 태그를 추가할 수 있어요.
                      </p>
                    </div>
                  </div>
                  {errors.tags && (
                    <p className="text-destructive mt-1 text-xs">{errors.tags.message}</p>
                  )}
                </div>
              </div>
            ) : (
              // 보기 모드
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {knowledge?.thumbnail ? (
                    <div className="relative size-24 overflow-hidden rounded-2xl border">
                      <Image
                        src={knowledge?.thumbnail}
                        alt="페이지 썸네일"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="from-primary to-chart-2 flex aspect-square size-24 items-center justify-center rounded-2xl bg-gradient-to-r">
                      <Link className="size-12 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="line-clamp-1 text-xl font-semibold">{knowledge?.title}</h3>
                    <a
                      className="text-muted-foreground line-clamp-1 text-sm underline"
                      href={knowledge?.url}
                      target="_blank"
                    >
                      {knowledge?.url}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">요약</h4>
                  <p className="text-muted-foreground">{knowledge?.summary}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">메모</h4>
                  <p className="text-muted-foreground">{knowledge?.memo}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {knowledge?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground rounded px-2 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="border-t p-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={onSave} className="flex-1">
                  <Save size={16} className="mr-2" />
                  저장
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  취소
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={onEdit} className="flex-1">
                  <Edit size={16} className="mr-2" />
                  편집
                </Button>
                <Button variant="destructive" onClick={onDeleteKnowledge}>
                  <Trash2 size={16} className="mr-2" />
                  삭제
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
