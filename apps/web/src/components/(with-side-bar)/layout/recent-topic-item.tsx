import RemoveTopicDialog from "@/components/topic/remove-topic-dialog";
import type { TopicDTO } from "@/models/topic";
import { Dialog, DialogTrigger } from "@repo/ui/components/dialog";
import { cn } from "@repo/ui/utils/cn";

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

  return (
    <div
      className={cn(
        "group mb-2 flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all duration-300",
        isSelected ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-accent"
      )}
      onClick={onTopicClick}
    >
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <div className="flex-1">
        <div
          className={cn("text-sm font-medium", isSelected ? "text-sidebar-primary-foreground" : "")}
        >
          {topic.title}
        </div>
        <div
          className={cn(
            "line-clamp-1 text-xs",
            isSelected ? "text-sidebar-primary-foreground/80" : "text-muted-foreground"
          )}
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />
      </div>
      <Dialog>
        <DialogTrigger
          className={cn(
            "opacity-0 transition-opacity group-hover:opacity-100",
            "hover:bg-destructive/10 hover:text-destructive rounded p-1",
            "disabled:opacity-50",
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
