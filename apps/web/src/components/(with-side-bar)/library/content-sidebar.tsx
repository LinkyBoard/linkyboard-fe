"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY } from "@/constants/category";
import { CONTENT } from "@/constants/content";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveContentById } from "@/lib/tanstack/mutation/content";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { errorToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";

import { AlertCircle, Edit, Link, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface KnowledgeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContentId: number | null;
  categoryId: string;
}

const DEFAULT_CONTENT = {
  title: "",
  summary: "",
  memo: "",
  tags: [],
};

function DeleteDialogContent({
  id,
  setIsDeleteModalOpen,
  onDelete,
}: {
  id: number | null;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const { isOpen, close } = useDialog();

  const onDeleteClick = async () => {
    if (!id) return errorToast("잘못된 요청이에요.");

    close();
    await onDelete(id);
  };

  useEffect(() => {
    setIsDeleteModalOpen(isOpen);
  }, [isOpen]);

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">삭제</h2>
          <p className="text-muted-foreground text-sm">정말 삭제 하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onDeleteClick}>삭제</Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function ContentSidebar({
  categoryId,
  isOpen,
  onClose,
  selectedContentId,
}: KnowledgeSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetContentById(selectedContentId);
  const { mutateAsync, isPending: isDeletePending } = useRemoveContentById();

  const tagInputRef = useRef<HTMLInputElement>(null);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (!isDeleteModalOpen) {
      onClose();
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: data || DEFAULT_CONTENT,
  });

  const watchedTags = watch("tags");
  const buttonDisabled = isLoading || isError || isDeletePending;

  const onEdit = () => {
    if (data) {
      reset({
        title: data.title,
        summary: data.summary || "",
        memo: data.memo || "",
        tags: data.tags,
      });
      setIsEditing(true);
    }
  };

  const onSave = handleSubmit((data) => {
    if (data) {
      setIsEditing(false);
    }
  });

  const onCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onDelete = async () => {
    if (!selectedContentId) return errorToast("잘못된 요청이에요.");
    await mutateAsync(selectedContentId, {
      onSuccess: () => {
        onClose();
        invalidateQueries([
          [CONTENT.GET_CONTENT_BY_ID, selectedContentId],
          [CONTENT.GET_CATEGORY_CONTENT_BY_ID, categoryId],
          [CATEGORY.GET_CATEGORIES],
        ]);
      },
    });
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
            {isLoading ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                <p>콘텐츠 정보를 가져오고 있어요</p>
              </div>
            ) : isError ? (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <AlertCircle className="text-destructive size-8" />
                <p>콘텐츠 정보를 가져오는데 실패했어요</p>
              </div>
            ) : isEditing ? (
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
                  {data?.thumbnail ? (
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border">
                      <Image
                        src={data?.thumbnail}
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
                    <h3 className="line-clamp-1 text-xl font-semibold">{data?.title}</h3>
                    <a
                      className="text-muted-foreground line-clamp-1 text-sm underline"
                      href={data?.url}
                      target="_blank"
                    >
                      {data?.url}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">요약</h4>
                  <p className="text-muted-foreground">{data?.summary}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">메모</h4>
                  <p className="text-muted-foreground">{data?.memo}</p>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {data?.tags.map((tag) => (
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
                <Button onClick={onEdit} className="flex-1" disabled={buttonDisabled}>
                  <Edit size={16} className="mr-2" />
                  편집
                </Button>
                <Dialog>
                  <Button className="bg-red-400 hover:bg-red-500" asChild disabled={buttonDisabled}>
                    <DialogTrigger>
                      <Trash2 size={16} className="mr-2" />
                      삭제
                    </DialogTrigger>
                  </Button>
                  <DeleteDialogContent
                    id={selectedContentId}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    onDelete={onDelete}
                  />
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
