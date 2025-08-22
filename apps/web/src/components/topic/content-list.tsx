"use client";

import { useState } from "react";
import Link from "next/link";

import { CONTENT_TYPE_OPTIONS, type ContentTypeOptions } from "@/constants/content";
import { dummyContents } from "@/constants/dummy-data";
import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import { useGetAllContents } from "@/lib/tanstack/query/topic";
import { useTopicStore } from "@/lib/zustand/topic";
import { CategoryContentDTO } from "@repo/types";

import { Loader2, Search } from "lucide-react";

import ContentItem from "../(with-side-bar)/library/content-item";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ContentListProps {
  contentPanelRef: React.RefObject<HTMLDivElement | null>;
  contentPanelWidth: number;
  type: ContentTypeOptions;
  id: string;
}

export default function ContentList({
  contentPanelRef,
  contentPanelWidth,
  type,
  id,
}: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const addNode = useTopicStore((state) => state.addNode);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onAddContent = async (content: CategoryContentDTO) => {
    addNode("content", content);
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
      <div className="flex gap-2 px-4">
        <Button
          variant={type === CONTENT_TYPE_OPTIONS.ALL ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={`/topic?id=${id}&type=${CONTENT_TYPE_OPTIONS.ALL}`}>모두</Link>
        </Button>
        <Button
          variant={type === CONTENT_TYPE_OPTIONS.WEB ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={`/topic?id=${id}&type=${CONTENT_TYPE_OPTIONS.WEB}`}>웹</Link>
        </Button>
        <Button
          variant={type === CONTENT_TYPE_OPTIONS.YOUTUBE ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={`/topic?id=${id}&type=${CONTENT_TYPE_OPTIONS.YOUTUBE}`}>유튜브</Link>
        </Button>
      </div>
      <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto p-4">
        {dummyContents?.map((item) => (
          <ContentItem
            key={`${item.id}-content-item`}
            item={item}
            onClick={() => onAddContent(item)}
          />
        ))}
      </div>
    </div>
  );
}
