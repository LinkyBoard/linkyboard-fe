import { TOPIC } from "@/constants/topic";
import { queryClient } from "@/lib/tanstack";
import { useTopicStore } from "@/lib/zustand/topic";
import type { TopicDTO } from "@/models/topic";
import { getTopicById } from "@/services/topic";
import { Button } from "@linkyboard/components";

import { Edit, NotebookPen } from "lucide-react";

export default function TopicSticker({ item }: { item: TopicDTO }) {
  const topicStore = useTopicStore();

  const onEditTopic = () => {
    topicStore.setIsOpen(true);
    topicStore.setTopicId(item.id.toString());
    topicStore.setStickerId(null);
  };

  const onMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: [TOPIC.GET_TOPIC_BY_ID, item.id.toString(), null],
      queryFn: () => getTopicById(item.id.toString()),
      staleTime: 1000 * 60,
    });
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
            onMouseEnter={onMouseEnter}
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
