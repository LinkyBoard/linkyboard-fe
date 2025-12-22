import { useState } from "react";

import { CONTENT } from "@/constants/content";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useUpdateContent } from "@/lib/tanstack/mutation/content";
import { useContentSidebarStore } from "@/lib/zustand/content-sidebar";
import { Button, errorToast } from "@linkyboard/components";
import { useOutsideClick } from "@linkyboard/hooks";
import type { CategoryContentDTO } from "@linkyboard/types";
import { cn } from "@linkyboard/utils";

import { Check, Edit, Ellipsis, FileText, Globe, Youtube } from "lucide-react";

interface ContentStickerProps {
  item: CategoryContentDTO;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  height?: number;
  topicId: string;
}

const contentType = {
  WEB: {
    icon: <Globe />,
    color: "text-blue-500",
  },
  YOUTUBE: {
    icon: <Youtube />,
    color: "text-red-500",
  },
  PDF: {
    icon: <FileText />,
    color: "text-gray-500",
  },
};
const colors = [
  "oklch(1 0 0)",
  "oklch(0.7922 0.12 20.09)",
  "oklch(0.9525 0.1084 100.83)",
  "oklch(0.9318 0.1464 136.17)",
  "oklch(0.7859 0.1077 267.59)",
  "oklch(0.7831 0.1506 310.86)",
];

export default function ContentSticker({
  item,
  isSelected,
  onSelect,
  height,
  topicId,
}: ContentStickerProps) {
  const { mutateAsync: updateContent } = useUpdateContent({
    onSuccess: () => {
      invalidateQueries([CONTENT.GET_CONTENT_BY_ID, item.id.toString()]);
      invalidateQueries([TOPIC.GET_TOPIC_BOARD_BY_ID, topicId]);
    },
    onError: (error) => {
      errorToast("색상 변경에 실패했어요.");
      console.error(error);
    },
  });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerContainerRef] = useOutsideClick<HTMLDivElement>(() => {
    setIsColorPickerOpen(false);
  });

  const onOpen = useContentSidebarStore((state) => state.onOpen);

  const onEditTopic = () => {
    onOpen(item.id);
  };

  const onSelectColor = (color: string) => {
    setIsColorPickerOpen(false);
    updateContent({
      ...item,
      color,
    });
  };

  const shouldShowMemo = height && height >= 300;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 overflow-hidden">
          <div
            className={cn(
              contentType[item?.type || "WEB"].color,
              "flex size-12 items-center justify-center rounded-lg border p-2"
            )}
          >
            {contentType[item?.type || "WEB"].icon}
          </div>
          <div className="line-clamp-1 flex-1 text-lg font-semibold">{item.title}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-muted text-muted-foreground h-8 w-8 shrink-0"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 transition-all",
              isSelected
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-primary hover:text-white"
            )}
            onClick={() => onSelect(`content-${item.id}`)}
            aria-label={isSelected ? "선택 해제" : "선택"}
          >
            <Check size={16} />
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{item.summary}</p>

      <div className="flex items-center justify-between">
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
        <div className="relative h-full">
          <button
            className="h-full text-gray-300"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          >
            <Ellipsis />
          </button>
          {isColorPickerOpen && (
            <div
              ref={colorPickerContainerRef}
              className="absolute right-0 top-full mt-2 translate-y-1/2"
            >
              <div className="triangle absolute right-2 top-0 -translate-y-full" />
              <div className="relative left-2 flex gap-4 rounded-[12px] bg-black/55 p-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="size-10 rounded-full border-4 border-white"
                    style={{ backgroundColor: color }}
                    onClick={() => onSelectColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 스티커가 충분히 클 때만 메모를 보여줌 */}
      {shouldShowMemo && (
        <div className="mt-4 flex-1 rounded-lg bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-semibold text-blue-900">메모</h4>
          <p className="text-sm leading-relaxed text-blue-800">{item.memo || "-"}</p>
        </div>
      )}
    </div>
  );
}
