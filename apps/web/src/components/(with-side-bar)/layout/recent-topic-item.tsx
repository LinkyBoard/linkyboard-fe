import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveTopic } from "@/lib/tanstack/mutation/topic";
import type { TopicDTO } from "@/models/topic";
import { revalidatePath } from "@/utils/revalidate";
import { errorToast, infoToast } from "@/utils/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";
import { cn } from "@repo/ui/utils/cn";

import { Loader2, Trash2 } from "lucide-react";

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

function DeleteTopicDialog({ topicId }: { topicId: number }) {
  const router = useRouter();

  const { mutateAsync, isPending } = useRemoveTopic();
  const { close } = useDialog();

  const onRemoveTopic = async () => {
    await mutateAsync(topicId, {
      onSuccess: () => {
        infoToast("토픽이 삭제되었습니다.");
        invalidateQueries([TOPIC.GET_ALL_TOPICS]);
        revalidatePath(`/topic?id=${topicId}`);
        router.back();
        close();
      },
      onError: () => {
        errorToast("토픽 삭제에 실패했습니다.");
      },
    });
  };

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">삭제</h2>
          <p className="text-muted-foreground text-sm">토픽을 삭제 하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild disabled={isPending}>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onRemoveTopic} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "삭제"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

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
            "text-xs",
            isSelected ? "text-sidebar-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {topic.content}
        </div>
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
        <DeleteTopicDialog topicId={topic.id} />
      </Dialog>
    </div>
  );
}
