import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { contentSchema, type ContentSchemaType } from "@/schemas/content";
import { infoToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";

import { ArrowLeft, ChevronDown, Plus, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";

const categories = ["기본", "기술", "디자인", "비즈니스", "교육", "엔터테인먼트", "기타"];

export default function CreateContent() {
  const [tags, setTags] = useState<string[]>(["기술", "개발"]);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);

  const tagInputRef = useRef<HTMLInputElement>(null);

  const [dropdownRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsCategoryOpen(false);
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "흥미로운 기술 아티클 - 최신 개발 트렌드 분석",
      url: "https://example.com/article/interesting-content",
      thumbnail: "",
      category: "기본",
      summary:
        "이 글에서는 최신 개발 트렌드와 기술 동향에 대해 자세히 분석합니다. 특히 AI와 웹 개발 분야에서의 혁신적인 변화들을 다룹니다.",
      memo: "나중에 참고할 만한 내용들이 많다. 특히 AI 부분은 다시 읽어보기.",
      tags: ["기술", "개발"],
    },
  });

  const navigate = useReplaceNavigate();

  const onGoBack = () => {
    navigate("/search-content");
  };

  const onSave = handleSubmit((data) => {
    console.log("저장하기", data);
  });

  const onAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTag = e.currentTarget.querySelector("input")?.value;

    const trimmedTag = newTag?.trim();

    if (!trimmedTag) {
      return infoToast("태그를 입력해주세요.");
    }

    if (tags.includes(trimmedTag)) {
      return infoToast("이미 존재하는 태그입니다.");
    }

    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setValue("tags", newTags);
    e.currentTarget.reset();
  };

  const onRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue("tags", newTags);
    tagInputRef.current?.focus();
  };

  const onCategorySelect = (category: string) => {
    setValue("category", category);
    setIsCategoryOpen(false);
  };

  const watchedCategory = watch("category");

  return (
    <div className="bg-background min-h-screen p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="text-muted-foreground hover:text-foreground"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-foreground text-xl font-bold">상세 저장</h1>
        </div>
        <Button onClick={onSave} size="sm" aria-label="저장하기">
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <div className="space-y-6">
        {/* 썸네일 */}
        <div>
          <h2 className="text-muted-foreground mb-3 text-sm font-medium">썸네일</h2>
          <div className="h-32 w-32 overflow-hidden rounded-lg border">
            {watch("thumbnail") ? (
              <img
                src={watch("thumbnail")}
                alt="페이지 썸네일"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted h-full w-full" />
            )}
          </div>
        </div>

        {/* URL */}
        <div>
          <h2 className="text-muted-foreground mb-2 text-sm font-medium">URL</h2>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-foreground text-sm break-all">{watch("url")}</p>
          </div>
        </div>

        {/* 제목 */}
        <div>
          <h2 className="text-muted-foreground mb-2 text-sm font-medium">제목</h2>
          <Input {...register("title")} placeholder="제목을 입력하세요" className="w-full" />
          {errors.title && <p className="text-destructive mt-1 text-xs">{errors.title.message}</p>}
        </div>

        {/* 카테고리 */}
        <div>
          <h2 className="text-muted-foreground mb-2 text-sm font-medium">카테고리</h2>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className={watchedCategory ? "text-foreground" : "text-muted-foreground"}>
                {watchedCategory || "카테고리를 선택하세요"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCategoryOpen && (
              <div className="bg-background absolute z-10 mt-5 w-full rounded-md border shadow-lg">
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

        {/* 요약 */}
        <div>
          <h2 className="text-muted-foreground mb-2 text-sm font-medium">요약</h2>
          <textarea
            {...register("summary")}
            placeholder="요약을 입력하세요"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.memo && <p className="text-destructive mt-1 text-xs">{errors.memo.message}</p>}
        </div>

        {/* 태그 */}
        <div>
          <h2 className="text-muted-foreground mb-2 text-sm font-medium">태그</h2>
          <div className="space-y-3">
            {/* 기존 태그들 */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
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
          {errors.tags && <p className="text-destructive mt-1 text-xs">{errors.tags.message}</p>}
        </div>
      </div>
    </div>
  );
}
