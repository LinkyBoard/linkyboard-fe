"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useGetAllContents } from "@/lib/tanstack/query/topic";
import { CategoryContentDTO } from "@/models/content";
import type { Node } from "@xyflow/react";

import { Loader2, Search } from "lucide-react";

import ContentItem from "../(with-side-bar)/library/content-item";
import { Input } from "../ui/input";

interface ContentListProps {
  contentPanelRef: React.RefObject<HTMLDivElement | null>;
  contentPanelWidth: number;
  setNodes: Dispatch<SetStateAction<Node[]>>;
}

export default function ContentList({
  setNodes,
  contentPanelRef,
  contentPanelWidth,
}: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: contents, isLoading } = useGetAllContents();

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onAddContent = (content: CategoryContentDTO) => {
    const newNode: Node = {
      id: `content-${content.id}`,
      type: "custom",
      position: { x: 0, y: 0 },
      data: { nodeContent: "content", item: content },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  return (
    <div
      ref={contentPanelRef}
      className="bg-card border-border overflow-hidden rounded-l-lg border border-r-0"
      style={{ width: `${contentPanelWidth}px`, minWidth: "300px" }}
    >
      <div className="relative p-4">
        <Search
          className="text-muted-foreground absolute top-1/2 left-8 -translate-y-1/2 transform"
          size={16}
        />
        <Input
          type="text"
          placeholder="콘텐츠를 검색하세요"
          className="pl-10"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex h-[calc(100%-120px)] flex-col gap-3 p-4">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="text-muted-foreground animate-spin" />
          </div>
        ) : contents?.length === 0 ? (
          <p className="text-muted-foreground text-center">저장된 콘텐츠가 없어요</p>
        ) : (
          contents?.map((item) => (
            <ContentItem
              key={`${item.title}-knowledge-item`}
              item={item}
              onClick={() => onAddContent(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
