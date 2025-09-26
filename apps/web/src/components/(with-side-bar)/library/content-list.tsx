"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ContentTypeOptions } from "@/constants/content";
import { CONTENT_TYPE_OPTIONS } from "@/constants/content";
import { useGetCategoryContentById } from "@/lib/tanstack/query/content";
import { useContentSidebarStore } from "@/lib/zustand/content-sidebar-store";
import type { CategoryContentDTO } from "@linkyboard/types";

import { Filter, Loader2 } from "lucide-react";

import ContentItem from "./content-item";

interface ContentListProps {
  category?: string;
}

const TYPE_OPTIONS = [
  {
    label: "모두",
    value: CONTENT_TYPE_OPTIONS.ALL,
  },
  {
    label: "웹",
    value: CONTENT_TYPE_OPTIONS.WEB,
  },
  {
    label: "유튜브",
    value: CONTENT_TYPE_OPTIONS.YOUTUBE,
  },
];

// 카테고리 내 콘텐츠를 태그/유형 필터와 함께 보여주는 리스트 컴포넌트다.
export default function ContentList({ category }: ContentListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ContentTypeOptions>(CONTENT_TYPE_OPTIONS.ALL);
  const [showFilter, setShowFilter] = useState(false);

  const onOpen = useContentSidebarStore((state) => state.onOpen);

  const [categoryId, categoryName] = category?.split(",") || [];

  const { data, isLoading } = useGetCategoryContentById(categoryId);
  const contents: CategoryContentDTO[] = data || [];

  const allTags = useMemo(
    () => [...new Set(contents.flatMap((content) => content.tags))],
    [contents]
  );

  // 복합 필터 조건을 메모이제이션해 카드 목록 계산을 명확하게 유지한다.
  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => content.tags.includes(tag));
      const matchesType =
        selectedType === CONTENT_TYPE_OPTIONS.ALL || content.type === selectedType;

      return matchesTags && matchesType;
    });
  }, [contents, selectedTags, selectedType]);

  const isFilterApplied = selectedTags.length > 0 || selectedType !== CONTENT_TYPE_OPTIONS.ALL;

  const onToggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]
    );
  };

  const onContentClick = (contentId: number) => {
    onOpen(contentId);
  };

  const onResetFilter = () => {
    setSelectedTags([]);
    setSelectedType(CONTENT_TYPE_OPTIONS.ALL);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {`${categoryName} - 모든 지식 (${filteredContents.length}개)`}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          aria-label="태그 필터 토글"
        >
          <Filter size={16} className="mr-2" />
          필터
        </Button>
      </div>

      {showFilter && (
        <div className="bg-card mb-6 space-y-4 rounded-lg border p-4">
          <div>
            <h3 className="mb-2 font-medium">유형</h3>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  variant={selectedType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(option.value)}
                  aria-label={`${option.label} 유형 ${selectedType === option.value ? "해제" : "선택"}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">태그</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tagName) => (
                <Button
                  key={tagName}
                  variant={selectedTags.includes(tagName) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleTag(tagName)}
                  aria-label={`${tagName} 태그 ${selectedTags.includes(tagName) ? "해제" : "선택"}`}
                >
                  {tagName}
                </Button>
              ))}
            </div>
            {isFilterApplied && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilter}
                className="mt-2"
                aria-label="모든 필터 해제"
              >
                필터 초기화
              </Button>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin" />
          <p>콘텐츠를 가져오고 있어요</p>
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4 text-4xl">📄</div>
          <h3 className="mb-2 text-xl font-semibold">콘텐츠가 없습니다</h3>
          <p className="text-muted-foreground">
            카테고리에 해당하는 콘텐츠가 아직 없습니다. 콘텐츠를 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContents.map((item: CategoryContentDTO) => (
            <ContentItem key={item.id} item={item} onClick={() => onContentClick(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
