import { useRemoveTopicContent } from "@/lib/tanstack/mutation/topic-content";
import { CategoryContentDTO } from "@/models/content";
import { cn } from "@repo/ui/utils/cn";

import { FileText, Globe, Loader2, X, Youtube } from "lucide-react";

import { Button } from "../ui/button";

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
  topicId,
}: {
  item: CategoryContentDTO;
  topicId: string;
}) {
  const { mutateAsync: removeTopicContent, isPending } = useRemoveTopicContent(topicId);

  const onRemoveTopicContent = async () => {
    await removeTopicContent({
      topicId,
      contentId: item.id,
    });
  };

  return (
    <>
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
        <Button
          variant="ghost"
          size="icon"
          className="bg-muted text-muted-foreground hover:bg-destructive h-8 w-8 shrink-0 hover:text-white"
          onClick={onRemoveTopicContent}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
        </Button>
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
    </>
  );
}
