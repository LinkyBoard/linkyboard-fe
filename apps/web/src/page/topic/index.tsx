"use client";

import AddTopicDialog from "@/components/(with-side-bar)/layout/add-topic-dialog";
import SearchHeader from "@/components/(with-side-bar)/layout/search-header";

import { Lightbulb, Plus } from "lucide-react";

export default function NewTopicPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-center justify-between">
        <SearchHeader placeholder="토픽 보드에서 검색하세요" />
        <AddTopicDialog>
          <Plus size={16} />새 토픽
        </AddTopicDialog>
      </header>

      <div className="border-border flex h-full flex-col items-center justify-center rounded-lg border">
        <Lightbulb size={64} className="text-muted-foreground mx-auto mb-6 opacity-50" />
        <h3 className="mb-4 text-xl font-semibold">선택된 토픽이 없습니다</h3>
        <p className="text-muted-foreground mb-6">토픽을 선택하거나 새 토픽을 생성해보세요</p>
        <AddTopicDialog>
          <Plus size={16} />새 토픽 생성
        </AddTopicDialog>
      </div>
    </div>
  );
}
