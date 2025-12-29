import { useRemoveTopicContentById } from "@/lib/tanstack/mutation/topic-content";
import { Button } from "@linkyboard/components";

import { Trash2 } from "lucide-react";

interface RemoveContentButtonProps {
  topicId: string;
  selectedNodeIds: string[];
  onResetSelectedNodeIds: () => void;
}

export default function RemoveContentButton({
  topicId,
  selectedNodeIds,
  onResetSelectedNodeIds,
}: RemoveContentButtonProps) {
  const contentIds = selectedNodeIds.map((id) => Number(id.split("-")[1]));

  const { mutateAsync, isPending } = useRemoveTopicContentById(topicId, onResetSelectedNodeIds);

  const onRemoveContent = async () => {
    await mutateAsync({
      topicId,
      contentIds,
    });
  };

  return (
    <Button
      className="flex items-center gap-2 bg-red-400 hover:bg-red-500"
      onClick={onRemoveContent}
      disabled={isPending}
    >
      <Trash2 size={16} />
      삭제
    </Button>
  );
}
