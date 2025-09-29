import { useEffect, useRef, useState } from "react";

import Logo from "@/assets/logo.svg?react";
import { CONTENT } from "@/constants/content";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { invalidateQueries } from "@/lib/tanstack";
import {
  useFinishDetailSaveContent,
  useFinishDetailSaveYoutubeContent,
  useUpdateContent,
} from "@/lib/tanstack/mutation/content";
import { useGetCategories } from "@/lib/tanstack/query/category";
import { useGetContentById } from "@/lib/tanstack/query/content";
import { useGetTags } from "@/lib/tanstack/query/tag";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, infoToast, Input, successToast } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";

import { ArrowLeft, ChevronDown, Plus, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";

interface CreateContentState {
  thumbnail: string;
  title: string;
  url: string;
  summary: string;
  memo: string;
  tags: string[];
  category: string;
  htmlFile: File;
}

const DEFAULT_STATE: CreateContentState = {
  thumbnail: "",
  title: "",
  url: "",
  summary: "",
  memo: "",
  tags: [],
  category: "",
  htmlFile: new File([], ""),
};

export default function CreateContent() {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");

  const { state } = useLocation() as { state: CreateContentState };
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data: content, isLoading, isRefetching } = useGetContentById(id);

  const tagInputRef = useRef<HTMLInputElement>(null);

  const navigate = useReplaceNavigate();

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryOpen(false);
  });

  const [tagFormRef] = useOutsideClick<HTMLFormElement>(() => {
    setIsTagDropdownOpen(false);
  });

  const {
    mutateAsync: mutateFinishDetailSaveContent,
    isPending: isPendingFinishDetailSaveContent,
  } = useFinishDetailSaveContent();
  const {
    mutateAsync: mutateFinishDetailSaveYoutubeContent,
    isPending: isPendingFinishDetailSaveYoutubeContent,
  } = useFinishDetailSaveYoutubeContent();
  const { mutateAsync: mutateUpdateContent, isPending: isPendingUpdateContent } =
    useUpdateContent();

  const { data: userCategories } = useGetCategories();
  const { data: allTags } = useGetTags();

  const isBadRequest = !id && !state;

  // 기본값을 미리 계산
  const defaultValues = (() => {
    if (isBadRequest || isLoading) {
      return { ...DEFAULT_STATE, memo: "" };
    }

    if (id && !isLoading && content?.result) {
      return content.result;
    }

    return { ...state, memo: "" };
  })();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues,
  });

  // defaultValues가 변경될 때 폼 값 업데이트
  useEffect(() => {
    if (!isLoading && !isRefetching) {
      reset(defaultValues);
    }
  }, [isLoading, isRefetching]);

  // state가 없으면 리다이렉트
  if (isBadRequest) {
    return <Navigate to="/bad-request" replace />;
  }

  const categories = [state?.category || "", ...(userCategories || [])];

  const watchedTags = watch("tags");
  const watchedCategory = watch("category");
  const watchedThumbnail = watch("thumbnail");

  // 필터링된 태그 계산
  const filteredTags = allTags?.filter(
    (tag) =>
      !watchedTags.includes(tag.name) && tag.name.toLowerCase().includes(newTag.toLowerCase())
  );

  const isYoutubeUrl = watch("url").includes("youtube.com");
  const isPending =
    isPendingFinishDetailSaveContent ||
    isPendingFinishDetailSaveYoutubeContent ||
    isPendingUpdateContent;

  const onGoBack = () => {
    navigate("/search-content");
  };

  const onSave = handleSubmit(async (data) => {
    if (id) {
      await mutateUpdateContent(
        {
          id: id as string,
          ...data,
          thumbnail: data.thumbnail || "",
          summary: data.summary || "",
          memo: data.memo || "",
        },
        {
          onSuccess: () => {
            successToast("저장에 성공했어요.");
            navigate("/search-content");
            invalidateQueries([CONTENT.GET_CONTENT_BY_ID, id]);
          },
        }
      );
      return;
    }
    if (isYoutubeUrl) {
      await mutateFinishDetailSaveYoutubeContent(
        {
          ...data,
          memo: data.memo || "",
          summary: data.summary || "",
          transcript: "",
          thumbnail: data.thumbnail || "",
        },
        {
          onSuccess: () => {
            successToast("저장에 성공했어요.");
            navigate("/search-content");
          },
        }
      );
    } else {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("url", data.url);
      formData.append("thumbnail", data.thumbnail || "");
      formData.append("memo", data.memo || "");
      formData.append("summary", data.summary || "");
      formData.append("category", data.category);
      for (const tag of data.tags) {
        formData.append("tags", tag);
      }
      formData.append("htmlFile", state.htmlFile);

      await mutateFinishDetailSaveContent(formData, {
        onSuccess: () => {
          successToast("저장에 성공했어요.");
          navigate("/search-content");
        },
      });
    }
  });

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
    setIsCategoryOpen(false);
  };

  return (
    <>
      {/* 헤더 */}
      <header className="bg-background sticky top-0 z-10 flex items-center justify-between p-6 shadow">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="text-muted-foreground hover:text-foreground"
            disabled={isPending}
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-foreground text-xl font-bold">상세 저장</h1>
        </div>
        <Button onClick={onSave} size="sm" aria-label="저장하기" disabled={isPending}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </header>
      <div className="bg-background p-6">
        <div className="space-y-6">
          {/* 썸네일 */}
          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium">썸네일</h2>
            {watchedThumbnail ? (
              <div className="size-32 overflow-hidden rounded-2xl border">
                <img
                  src={watchedThumbnail}
                  alt="페이지 썸네일"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <Logo className="size-32" />
            )}
          </div>

          {/* URL */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">URL</h2>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-foreground line-clamp-1 text-sm">{watch("url")}</p>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">제목</h2>
            <Input {...register("title")} placeholder="제목을 입력하세요" className="w-full" />
            {errors.title && (
              <p className="text-destructive mt-1 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">카테고리</h2>
            <div ref={dropdownRef} className="relative">
              <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <input
                  type="text"
                  placeholder="카테고리를 입력하세요"
                  className="w-full outline-none"
                  onFocus={() => setIsCategoryOpen(true)}
                  {...register("category")}
                />
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                />
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
            {errors.category && (
              <p className="text-destructive mt-1 text-xs">{errors.category.message}</p>
            )}
          </div>

          {/* 태그 */}
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
            {errors.tags && <p className="text-destructive mt-1 text-xs">{errors.tags.message}</p>}
          </div>

          {/* 요약 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">요약</h2>
            <textarea
              {...register("summary")}
              placeholder="요약을 입력하세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.summary && (
              <p className="text-destructive mt-1 text-xs">{errors.summary.message}</p>
            )}
          </div>

          {/* 메모 */}
          <div>
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">메모</h2>
            <textarea
              {...register("memo")}
              placeholder="메모를 입력하세요"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.memo && <p className="text-destructive mt-1 text-xs">{errors.memo.message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
