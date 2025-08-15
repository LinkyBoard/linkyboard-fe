import { useRemoveTopicContent } from "@/lib/tanstack/mutation/topic-content";
import { CategoryContentDTO } from "@/models/content";

import { Loader2, X } from "lucide-react";

import Image from "../image";
import { Button } from "../ui/button";

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
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border">
            <Image src={item.thumbnail} alt="페이지 썸네일" fill className="object-cover" />
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
