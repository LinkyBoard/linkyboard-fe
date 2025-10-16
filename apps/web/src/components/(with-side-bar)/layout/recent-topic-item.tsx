import RemoveTopicDialog from "@/components/(with-side-bar)/topic/remove-topic-dialog";
import { MINUTE } from "@/constants/time";
import { TOPIC } from "@/constants/topic";
import { queryClient } from "@/lib/tanstack";
import type { TopicDTO } from "@/models/topic";
import { getTopicBoardById } from "@/services/topic";
import { Dialog, DialogTrigger } from "@linkyboard/components";
import { cn } from "@linkyboard/utils";

import { Trash2 } from "lucide-react";

interface RecentTopicItemProps {
  isSelected: boolean;
  topic: TopicDTO;
  onTopicClick: () => void;
}

const getTopicColor = (topicId: number) => {
  const colorMap = ["green", "orange", "blue", "purple", "red"];
  const selectedColor = colorMap[topicId % colorMap.length];

  switch (selectedColor) {
    case "green":
      return "bg-green-500";
    case "orange":
      return "bg-orange-500";
    case "blue":
      return "bg-blue-500";
    case "purple":
      return "bg-purple-500";
    case "red":
      return "bg-red-500";
    default:
      return "bg-purple-500";
  }
};

export default function RecentTopicItem({ isSelected, topic, onTopicClick }: RecentTopicItemProps) {
  const color = getTopicColor(topic.id);

  const onMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: [TOPIC.GET_TOPIC_BOARD_BY_ID, topic.id.toString()],
      queryFn: async () => await getTopicBoardById(topic.id.toString()),
      staleTime: MINUTE,
    });
  };

  return (
    <div
      className={cn(
        "group mb-2 flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-all duration-300",
        isSelected ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-accent"
      )}
      onClick={onTopicClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <div
          className={cn("text-sm font-medium", isSelected ? "text-sidebar-primary-foreground" : "")}
        >
          {topic.title}
        </div>
      </div>
      <Dialog>
        <DialogTrigger
          className={cn(
            "hover:bg-destructive/10 hover:text-destructive rounded p-1 opacity-0 transition-opacity disabled:opacity-50 group-hover:opacity-100",
            isSelected && "text-sidebar-primary-foreground/60 hover:text-sidebar-primary-foreground"
          )}
          aria-label="토픽 삭제"
        >
          <Trash2 size={14} />
        </DialogTrigger>
        <RemoveTopicDialog topicId={topic.id} />
      </Dialog>
    </div>
  );
}
