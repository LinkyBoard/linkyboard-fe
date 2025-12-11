"use client";

import { Suspense, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import ResizeBar from "@/components/common/resize-bar";
import { CONTENT_TYPE_OPTIONS, type ContentTypeOptions } from "@/constants/content";
import { useDebounce } from "@/hooks/use-debounce";
import { Button, Input, Spinner } from "@linkyboard/components";

import { Search } from "lucide-react";

const AddContentList = dynamic(() => import("./add-content-list"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-2">
      <Spinner />
    </div>
  ),
});

interface AddContentListProps {
  type: ContentTypeOptions;
  id: string;
}

const MIN_WIDTH = 300;
const MAX_WIDTH = 600;

export default function AddContent({ type, id }: AddContentListProps) {
  const [contentPanelWidth, setContentPanelWidth] = useState(300); // Content Panel 기본 너비
  const [searchQuery, setSearchQuery] = useState("");

  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const onMouseMove = (e: MouseEvent) => {
    if (!contentPanelRef.current) return;

    const containerRect = contentPanelRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;

    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setContentPanelWidth(newWidth);
    }
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <Suspense
          fallback={
            <div className="flex justify-center py-2">
              <Spinner />
            </div>
          }
        >
          <AddContentList query={debouncedSearchQuery} id={id} type={type} />
        </Suspense>
      </div>
      <ResizeBar onMouseMove={onMouseMove} />
    </>
  );
}
