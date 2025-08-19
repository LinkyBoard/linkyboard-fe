import { useContentSidebarStore } from "@/lib/zustand/content-sidebar-store";
import { CategoryContentDTO } from "@/models/content";
import { cn } from "@repo/ui/utils/cn";

import { Check, Edit, FileText, Globe, Youtube } from "lucide-react";

import { Button } from "../ui/button";

interface ContentStickerProps {
  item: CategoryContentDTO;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  height?: number;
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

export default function ContentSticker({
  item,
  isSelected,
  onSelect,
  height,
}: ContentStickerProps) {
  const onOpen = useContentSidebarStore((state) => state.onOpen);

  const onEditTopic = () => {
    onOpen(item.id);
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

      {/* 스티커가 충분히 클 때만 메모를 보여줌 */}
      {shouldShowMemo && (
        <div className="mt-4 flex-1 rounded-lg bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-semibold text-blue-900">메모</h4>
          <p className="text-sm leading-relaxed text-blue-800">ㅇㅁㄹㅇㅁㄴㄹㅁㄴㅇ</p>
        </div>
      )}
    </div>
  );
}
