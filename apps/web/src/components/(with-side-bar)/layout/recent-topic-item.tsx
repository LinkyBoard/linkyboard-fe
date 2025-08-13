import type { TopicDTO } from "@/models/topic";
import { cn } from "@repo/ui/utils/cn";

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
        "mb-2 flex cursor-pointer items-center gap-3 rounded-md p-2 transition-all duration-300",
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
            "text-xs",
            isSelected ? "text-sidebar-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {topic.content}
        </div>
      </div>
    </div>
  );
}
