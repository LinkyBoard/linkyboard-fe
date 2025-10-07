"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import Image from "@/components/common/image";
import ResizeBar from "@/components/common/resize-bar";
import { CATEGORY } from "@/constants/category";
import { CONTENT, CONTENT_TYPE } from "@/constants/content";
import { invalidateMany } from "@/lib/tanstack";
import { useRemoveContentById, useUpdateContent } from "@/lib/tanstack/mutation/content";
import { useGetCategories } from "@/lib/tanstack/query/category";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { useGetTags } from "@/lib/tanstack/query/tag";
import { useContentSidebarStore } from "@/lib/zustand/content-sidebar-store";
import { useDashboardStore } from "@/lib/zustand/dashboard-store";
import type { ContentDetailDTO } from "@/models/content";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogTrigger,
  errorToast,
  infoToast,
  Input,
} from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";
import { cn, extractYoutubeId } from "@linkyboard/utils";
import { YouTubeEmbed } from "@next/third-parties/google";

import { AlertCircle, ChevronDown, Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import RemoveDialogContent from "../topic/remove-dialog-content";

const DEFAULT_CONTENT = {
  title: "",
  summary: "",
  memo: "",
  tags: [],
  category: "",
};

const MIN_WIDTH = 448;
const MAX_WIDTH = 576;

export default function ContentSidebar() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [categoryId] = currentCategory?.split(",") || [];

  const [sidebarWidth, setSidebarWidth] = useState(448);

  const [sidebarRef] = useOutsideClick<HTMLDivElement>(() => {
    if (isOpen) {
      onClose();
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagFormRef] = useOutsideClick<HTMLFormElement>(() => {
    setIsTagDropdownOpen(false);
  });

  const { isOpen, onClose, selectedContentId } = useContentSidebarStore();
  const { data, isLoading, isError } = useGetContentById(selectedContentId);
  const { data: categories, isPending: isCategoriesPending } = useGetCategories();
  const { data: tags } = useGetTags();
  const { mutateAsync: removeContent, isPending: isDeletePending } = useRemoveContentById();
  const { mutateAsync: updateContent, isPending: isUpdatePending } = useUpdateContent();

  const tagInputRef = useRef<HTMLInputElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryDropdownOpen(false);
  });

  const setTotalLibraries = useDashboardStore((state) => state.setTotalLibraries);

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
  const filteredTags = tags?.filter(
    (tag) =>
      !watchedTags.includes(tag.name) && tag.name.toLowerCase().includes(newTag.toLowerCase())
  );
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
      setIsEditing(false);
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

    const trimmedTag = newTag.trim();

    if (watchedTags.includes(trimmedTag)) {
      return infoToast("이미 존재하는 태그입니다.");
    }

    onUpdateTag(trimmedTag);
  };

  const onUpdateTag = (tag: string) => {
    const newTags = [...watchedTags, tag];
    setValue("tags", newTags);
    setNewTag("");
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

  const onMouseMove = (e: MouseEvent) => {
    const newWidth = window.innerWidth - e.clientX;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    if (!isCategoriesPending) {
      const totalLibraries = categories?.reduce((acc, category) => acc + category.contentCount, 0);
      setTotalLibraries(totalLibraries || 0);
    }
  }, [isCategoriesPending]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-50",
        isOpen && "pointer-events-auto bg-black/50"
      )}
      aria-label="사이드바 닫기"
    >
      <div
        ref={sidebarRef}
        className={cn(
          "fixed right-0 top-0 z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
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
                    <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-base focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                      <form
                        ref={tagFormRef}
                        className="relative flex items-center gap-2"
                        onSubmit={onAddTag}
                      >
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
                  {errors.tags && (
                    <p className="text-destructive mt-1 text-sm">{errors.tags.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-base font-medium">요약</label>
                  <textarea
                    {...register("summary")}
                    placeholder="요약을 입력하세요"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  />
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
                  <div className="aspect-video">
                    <YouTubeEmbed
                      videoid={youtubeId || ""}
                      params="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    />
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-lg font-medium">카테고리</h4>
                  <p className="text-muted-foreground text-base">{data?.category || "-"}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-lg font-medium">태그</h4>
                  <div className="flex flex-wrap gap-2">
                    {!data || data?.tags.length === 0 ? (
                      <p className="text-muted-foreground text-base">-</p>
                    ) : (
                      data?.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-muted-foreground rounded px-2 py-1 text-base"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-lg font-medium">요약</h4>
                  <p className="text-muted-foreground text-base">{data?.summary || "-"}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-lg font-medium">메모</h4>
                  <p className="text-muted-foreground text-base">{data?.memo || "-"}</p>
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="border-t p-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={onSave}
                  className="h-12 flex-1 text-base"
                  disabled={isUpdatePending}
                >
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
                <Button
                  onClick={onEdit}
                  className="h-12 flex-1 text-base"
                  disabled={buttonDisabled}
                >
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
        <ResizeBar className="absolute left-0 top-0 h-full" onMouseMove={onMouseMove} />
      </div>
    </div>
  );
}
