import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveTopicContentById } from "@/lib/tanstack/mutation/topic-content";
import { errorToast } from "@/utils/toast";

import { Trash2 } from "lucide-react";

import { Button } from "@linkyboard/components";

interface RemoveContentButtonProps {
  topicId: string;
  selectedNodeIds: string[];
  setSelectedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function RemoveContentButton({
  topicId,
  selectedNodeIds,
  setSelectedNodeIds,
}: RemoveContentButtonProps) {
  const contentIds = selectedNodeIds.map((id) => Number(id.split("-")[1]));

  const { mutateAsync, isPending } = useRemoveTopicContentById();

  const onRemoveContent = async () => {
    await mutateAsync(
      {
        topicId,
        contentIds,
      },
      {
        onSuccess: () => {
          invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId]);
          setSelectedNodeIds([]);
        },
        onError: () => {
          errorToast("토픽에서 콘텐츠를 제거하지 못했어요.");
        },
      }
    );
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
