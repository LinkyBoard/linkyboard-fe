"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { KnowledgeItemProps } from "@/types/library";

import { Filter } from "lucide-react";

import KnowledgeItem from "./knowledge-item";
import KnowledgeSidebar from "./knowledge-sidebar";

interface KnowledgeListProps {
  knowledges: KnowledgeItemProps[];
  category?: string;
  id: string;
}

export default function KnowledgeList({ knowledges, category, id }: KnowledgeListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItemProps | null>(null);

  // 모든 지식에서 태그 추출
  const allTags = (() => [...new Set(knowledges.flatMap((knowledge) => knowledge.tags))])();

  // 태그 필터링된 지식들
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

  const onKnowledgeClick = (knowledge: KnowledgeItemProps) => {
    setSelectedKnowledge(knowledge);
    setIsSidebarOpen(true);
  };

  const onCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedKnowledge(null);
  };

  useEffect(() => {
    if (id) {
      const knowledge = knowledges.find((knowledge) => knowledge.id === Number(id));
      if (knowledge) {
        setSelectedKnowledge(knowledge);
        setIsSidebarOpen(true);
      }
    }
  }, [id]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {`${category} - 모든 지식 (${filteredKnowledges.length}개)`}
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
            <KnowledgeItem key={item.id} item={item} onClick={() => onKnowledgeClick(item)} />
          ))}
        </div>
      )}

      {/* 사이드바 */}
      <KnowledgeSidebar
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
        knowledge={selectedKnowledge}
      />
    </div>
  );
}
