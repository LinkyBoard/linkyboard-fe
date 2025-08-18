import { Trash2 } from "lucide-react";

import { Button } from "../ui/button";

interface RemoveContentButtonProps {
  selectedNodeIds: number[];
}

export default function RemoveContentButton({ selectedNodeIds }: RemoveContentButtonProps) {
  const onRemoveContent = async () => {
    // TODO: 변경된 삭제 API 연동
  };

  return (
    <Button
      className="flex items-center gap-2 bg-red-400 hover:bg-red-500"
      onClick={onRemoveContent}
    >
      <Trash2 size={16} />
      삭제하기
    </Button>
  );
}
