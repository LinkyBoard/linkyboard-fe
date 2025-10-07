"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

import ResizeBar from "@/components/common/resize-bar";
import { CONTENT_TYPE_OPTIONS, type ContentTypeOptions } from "@/constants/content";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreateContent } from "@/lib/tanstack/mutation/topic-content";
import { useGetAllContents } from "@/lib/tanstack/query/topic";
import type { TopicNodeProps } from "@/types/topic";
import { Button, Input } from "@linkyboard/components";
import type { CategoryContentDTO } from "@linkyboard/types";

import { Loader2, Search } from "lucide-react";

import SentinelSpinner from "../../common/sentinel-spinner";
import ContentItem from "../library/content-item";

interface AddContentListProps {
  type: ContentTypeOptions;
  id: string;
  isTopicLoading: boolean;
  nodes: TopicNodeProps[];
}

const MIN_WIDTH = 300;
const MAX_WIDTH = 600;

export default function AddContentList({ type, id, isTopicLoading, nodes }: AddContentListProps) {
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [searchQuery, setSearchQuery] = useState("");

  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: contents,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllContents(type);
  const { mutateAsync: createContent, isPending } = useCreateContent(id);

  const filteredContents = useMemo(() => {
    const filteredBySearch = contents?.filter((content) =>
      content.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    return filteredBySearch?.filter(
      (content) => !nodes.some((node) => node.data.item.id === content.id)
    );
  }, [contents, nodes, debouncedSearchQuery]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!contentPanelRef.current) return;

    const containerRect = contentPanelRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setContentPanelWidth(newWidth);
    }
  };

  const onAddContent = async (content: CategoryContentDTO) => {
    await createContent({
      topicId: id,
      contentId: content.id,
      posX: 0,
      posY: 0,
    });
  };

  return (
    <>
      <div
        ref={contentPanelRef}
        className="bg-card border-border overflow-hidden rounded-l-lg border border-r-0"
        style={{ width: `${contentPanelWidth}px`, minWidth: "300px" }}
      >
        <div className="relative p-4">
          <Search
            className="text-muted-foreground absolute left-8 top-1/2 -translate-y-1/2 transform"
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
        <div className="flex gap-2 px-4 pb-4 shadow">
          <Button
            variant={type === CONTENT_TYPE_OPTIONS.ALL ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/topic/${id}?type=${CONTENT_TYPE_OPTIONS.ALL}`}>모두</Link>
          </Button>
          <Button
            variant={type === CONTENT_TYPE_OPTIONS.WEB ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/topic/${id}?type=${CONTENT_TYPE_OPTIONS.WEB}`}>웹</Link>
          </Button>
          <Button
            variant={type === CONTENT_TYPE_OPTIONS.YOUTUBE ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/topic/${id}?type=${CONTENT_TYPE_OPTIONS.YOUTUBE}`}>유튜브</Link>
          </Button>
        </div>
        <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto p-4">
          {isLoading || isTopicLoading ? (
            <div className="flex justify-center">
              <Loader2 className="text-muted-foreground animate-spin" />
            </div>
          ) : filteredContents?.length === 0 ? (
            <p className="text-muted-foreground text-center">저장된 콘텐츠가 없어요</p>
          ) : (
            filteredContents?.map((item) => (
              <ContentItem
                key={`${item.id}-content-item`}
                item={item}
                onClick={() => onAddContent(item)}
                disabled={isPending}
              />
            ))
          )}
          <SentinelSpinner
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>
      <ResizeBar onMouseMove={onMouseMove} />
    </>
  );
}
