import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveTopicContentById } from "@/lib/tanstack/mutation/topic-content";
import { useTopicStore } from "@/lib/zustand/topic";
import { errorToast } from "@/utils/toast";

import { Trash2 } from "lucide-react";

import { Button } from "../ui/button";

interface RemoveContentButtonProps {
  topicId: string;
  selectedNodeIds: string[];
  setSelectedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function RemoveContentButton({
  selectedNodeIds,
  setSelectedNodeIds,
}: RemoveContentButtonProps) {
  const contentIds = selectedNodeIds.map((id) => Number(id.split("-")[1]));
  const { removeNode } = useTopicStore();

  const onRemoveContent = async () => {
    contentIds.forEach((id) => {
      removeNode(id);
    });
    setSelectedNodeIds([]);
  };

  return (
    <Button
      className="flex items-center gap-2 bg-red-400 hover:bg-red-500"
      onClick={onRemoveContent}
    >
      <Trash2 size={16} />
      삭제
    </Button>
  );
}
