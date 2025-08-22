"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import Image from "@/components/image";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY } from "@/constants/category";
import { CONTENT, CONTENT_TYPE } from "@/constants/content";
import { invalidateMany } from "@/lib/tanstack";
import { useRemoveContentById, useUpdateContent } from "@/lib/tanstack/mutation/content";
import { useGetCategories } from "@/lib/tanstack/query/category";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { useContentSidebarStore } from "@/lib/zustand/content-sidebar-store";
import { ContentDetailDTO } from "@/models/content";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { errorToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";
import { cn } from "@repo/ui/utils/cn";
import { extractYoutubeId } from "@repo/ui/utils/youtube";

import { AlertCircle, ChevronDown, Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import RemoveDialogContent from "../../topic/remove-dialog-content";

const DEFAULT_CONTENT = {
  title: "",
  summary: "",
  memo: "",
  tags: [],
  category: "",
};

export default function ContentSidebar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [categoryId] = currentCategory?.split(",") || [];
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isOpen, onClose, selectedContentId } = useContentSidebarStore();
  const { data, isLoading, isError } = useGetContentById(selectedContentId);
  const { data: categories } = useGetCategories();
  const { mutateAsync: removeContent, isPending: isDeletePending } = useRemoveContentById();
  const { mutateAsync: updateContent, isPending: isUpdatePending } = useUpdateContent();

  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryDropdownOpen(false);
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
  const isYoutube = data?.type === CONTENT_TYPE.YOUTUBE;
  const youtubeId = extractYoutubeId(data?.url || "");

  const onEdit = () => {
    if (!data) return;

    reset({
      ...data,
      memo: data.memo || "",
    });
    setIsEditing(true);
  };

  const onSave = handleSubmit(async (submitData) => {
    if (submitData && selectedContentId) {
      const body = {
        ...data,
        ...submitData,
      } as ContentDetailDTO;

      await updateContent(body, {
        onSuccess: () => {
          setIsEditing(false);
          setIsCategoryDropdownOpen(false);
          invalidateMany([
            [CONTENT.GET_CONTENT_BY_ID, selectedContentId],
            [CONTENT.GET_CATEGORY_CONTENT_BY_ID, categoryId],
            [CATEGORY.GET_CATEGORIES],
          ]);
        },
      });
    }
  });

  const onSidebarClose = () => {
    if (!isDeleteModalOpen) {
      onClose();
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    setIsCategoryDropdownOpen(false);
    reset();
  };

  const onDelete = async () => {
    if (!selectedContentId) return errorToast("잘못된 요청이에요.");
    await removeContent(selectedContentId, {
      onSuccess: () => {
        onClose();
        invalidateMany([
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

  const onCategorySelect = (category: string) => {
    setValue("category", category.trim());
    setIsCategoryDropdownOpen(false);
  };

  return (
    <Sidebar isOpen={isOpen} onClose={onSidebarClose}>
      <div className="flex h-full flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">{isEditing ? "콘텐츠 편집" : "콘텐츠 상세"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="사이드바 닫기">
            <X size={24} />
          </Button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <p className="text-base">콘텐츠 정보를 가져오고 있어요</p>
            </div>
          ) : isError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <AlertCircle className="text-destructive size-8" />
              <p className="text-base">콘텐츠 정보를 가져오는데 실패했어요</p>
            </div>
          ) : isEditing ? (
            // 편집 모드
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-base font-medium">제목</label>
                <Input
                  {...register("title")}
                  placeholder="제목을 입력하세요"
                  className="text-base"
                />
                {errors.title && (
                  <p className="text-destructive mt-1 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-base font-medium">카테고리</label>
                <div ref={dropdownRef} className="relative">
                  <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-base focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                    <input
                      type="text"
                      placeholder="카테고리를 입력하세요"
                      className="w-full outline-none"
                      onFocus={() => setIsCategoryDropdownOpen(true)}
                      {...register("category")}
                    />
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isCategoryDropdownOpen && categories && (
                    <div className="bg-background absolute z-10 mt-5 max-h-52 w-full overflow-y-auto rounded-md border shadow-lg">
                      <button
                        type="button"
                        onClick={() => onCategorySelect(watch("category"))}
                        disabled={!watch("category").trim()}
                        className="hover:bg-accent text-foreground block w-full px-3 py-2 text-left text-base"
                      >
                        {watch("category")
                          ? `"${watch("category")}" 사용하기`
                          : "최소 1글자 입력해주세요."}
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => onCategorySelect(category.name)}
                          className={cn(
                            "hover:bg-accent text-foreground block w-full px-3 py-2 text-left text-base",
                            watch("category") === category.name &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="text-destructive mt-1 text-sm">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-base font-medium">요약</label>
                <textarea
                  {...register("summary")}
                  placeholder="요약을 입력하세요"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                />
                {errors.summary && (
                  <p className="text-destructive mt-1 text-sm">{errors.summary.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-base font-medium">메모</label>
                <textarea
                  {...register("memo")}
                  placeholder="메모를 입력하세요"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-medium">태그</label>
                <div className="space-y-3">
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

                  <div className="space-y-2">
                    <form className="flex items-center gap-2" onSubmit={onAddTag}>
                      <Input ref={tagInputRef} placeholder="새 태그 입력" className="h-14 flex-1" />
                      <Button
                        type="submit"
                        size="default"
                        variant="outline"
                        aria-label="태그 추가"
                        className="aspect-square h-14 shrink-0"
                      >
                        <Plus size={20} />
                      </Button>
                    </form>
                    <p className="text-muted-foreground text-sm">
                      Enter 혹은 + 버튼을 통해 태그를 추가할 수 있어요.
                    </p>
                  </div>
                </div>
                {errors.tags && (
                  <p className="text-destructive mt-1 text-sm">{errors.tags.message}</p>
                )}
              </div>
            </div>
          ) : (
            // 보기 모드
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border">
                  <Image
                    src={data?.thumbnail || ""}
                    alt="페이지 썸네일"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="line-clamp-1 text-2xl font-semibold">{data?.title}</h3>
                  <a
                    className="text-muted-foreground line-clamp-1 text-base underline"
                    href={data?.url}
                    target="_blank"
                  >
                    {data?.url}
                  </a>
                </div>
              </div>

              {isYoutube && (
                <iframe
                  className="aspect-video"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                />
              )}

              <div>
                <h4 className="mb-2 text-lg font-medium">카테고리</h4>
                <p className="text-muted-foreground text-base">{data?.category || "-"}</p>
              </div>

              <div>
                <h4 className="mb-2 text-lg font-medium">요약</h4>
                <p className="text-muted-foreground text-base">{data?.summary || "-"}</p>
              </div>

              <div>
                <h4 className="mb-2 text-lg font-medium">메모</h4>
                <p className="text-muted-foreground text-base">{data?.memo || "-"}</p>
              </div>

              <div>
                <h4 className="mb-2 text-lg font-medium">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {data?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground rounded px-2 py-1 text-base"
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
              <Button onClick={onSave} className="h-12 flex-1 text-base" disabled={isUpdatePending}>
                <Save size={18} className="mr-2" />
                저장
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="h-12 text-base"
                disabled={isUpdatePending}
              >
                취소
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={onEdit} className="h-12 flex-1 text-base" disabled={buttonDisabled}>
                <Edit size={18} className="mr-2" />
                편집
              </Button>
              <Dialog>
                <Button
                  className="h-12 bg-red-400 text-base hover:bg-red-500"
                  asChild
                  disabled={buttonDisabled}
                >
                  <DialogTrigger>
                    <Trash2 size={18} className="mr-2" />
                    삭제
                  </DialogTrigger>
                </Button>
                <RemoveDialogContent
                  id={selectedContentId}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  onDelete={onDelete}
                />
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
