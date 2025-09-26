import { useEffect } from "react";

import { errorToast } from "@linkyboard/utils";
import { useDialog } from "@linkyboard/components";
import { DialogClose, DialogContent } from "@linkyboard/components";
import { Button } from "@linkyboard/components";

interface RemoveDialogContentProps {
  id: number | null;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function RemoveDialogContent({
  id,
  setIsDeleteModalOpen,
  onDelete,
}: RemoveDialogContentProps) {
  const { isOpen, close } = useDialog();

  const onDeleteClick = async () => {
    if (!id) return errorToast("잘못된 요청이에요.");

    close();
    await onDelete(id);
  };

  useEffect(() => {
    setIsDeleteModalOpen(isOpen);
  }, [isOpen]);

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">삭제</h2>
          <p className="text-muted-foreground text-sm">정말 삭제 하시겠습니까?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild className="h-10 text-base">
            <DialogClose>취소</DialogClose>
          </Button>
          <Button onClick={onDeleteClick} className="h-10 text-base">
            삭제
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
