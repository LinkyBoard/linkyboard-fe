import { useRouter } from "next/navigation";

import type { TopicDTO } from "@/models/topic";
import { Button } from "@linkyboard/components";

import { Edit, NotebookPen } from "lucide-react";

export default function TopicSticker({ item }: { item: TopicDTO }) {
  const router = useRouter();

  const onEditTopic = () => {
    router.push(`/topic/${item.id}/sticker`);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div className="size-15 flex shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
          <NotebookPen size={24} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 bg-white/20 text-white hover:bg-white/30"
            onClick={onEditTopic}
          >
            <Edit size={16} />
          </Button>
        </div>
      </div>
      <div>
        <h2 className="mb-3 line-clamp-1 text-2xl font-bold leading-tight">{item.title}</h2>
        <p
          className="text-lg leading-relaxed opacity-90"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    </div>
  );
}
