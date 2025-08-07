"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { KnowledgeItemProps } from "@/types/library";
import { cn } from "@repo/ui/utils/cn";

import { File, FileText, Filter, type LucideIcon, StickyNote, Video } from "lucide-react";

interface KnowledgeListProps {
  knowledges: KnowledgeItemProps[];
  category: string;
}

const getIconClass = (type: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    article: FileText,
    pdf: File,
    note: StickyNote,
    video: Video,
  };
  return iconMap[type] || FileText;
};

const getIconName = (type: string) => {
  const nameMap: Record<string, string> = {
    article: "아티클",
    pdf: "PDF",
    note: "노트",
    video: "비디오",
  };
  return nameMap[type] || "파일";
};

const getIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    article: "bg-blue-100 text-blue-600",
    pdf: "bg-red-100 text-red-600",
    note: "bg-green-100 text-green-600",
    video: "bg-orange-100 text-orange-600",
  };
  return colorMap[type] || "bg-muted text-muted-foreground";
};

function KnowledgeItem({ item }: { item: KnowledgeItemProps }) {
  const IconComponent = getIconClass(item.type);

  return (
    <div className="bg-card border-border hover:border-primary group cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-md",
            getIconColor(item.type)
          )}
        >
          <IconComponent size={24} />
        </div>
        <div className="flex-1">
          <div className="line-clamp-1 text-lg font-semibold">{item.title}</div>
          <div className="text-muted-foreground mt-1 text-sm">{getIconName(item.type)}</div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{item.description}</p>

      <div className="flex flex-wrap gap-1">
        {item.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">
            +{item.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

export default function KnowledgeList({ knowledges, category }: KnowledgeListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const allTags = (() => [...new Set(knowledges.flatMap((knowledge) => knowledge.tags))])();

  const filteredKnowledges = (() => {
    if (selectedTags.length === 0) return knowledges;

    return knowledges.filter((knowledge) =>
      selectedTags.some((tag) => knowledge.tags.includes(tag))
    );
  })();

  const onToggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{`${category} - 모든 지식 (${filteredKnowledges.length}개)`}</h2>
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
        <div className="bg-card mb-6 rounded-lg border p-4">
          <h3 className="mb-3 font-medium">태그로 필터링</h3>
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
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="mt-2"
              aria-label="모든 필터 해제"
            >
              필터 초기화
            </Button>
          )}
        </div>
      )}

      {filteredKnowledges.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4 text-4xl">📄</div>
          <h3 className="mb-2 text-xl font-semibold">콘텐츠가 없습니다</h3>
          <p className="text-muted-foreground">
            카테고리에 해당하는 콘텐츠가 아직 없습니다. 콘텐츠를 추가해주세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredKnowledges.map((item: KnowledgeItemProps) => (
            <KnowledgeItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
