import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveCustomSticker } from "@/lib/tanstack/mutation/custom-sticker";
import { errorToast, successToast } from "@/utils/toast";
import { DialogClose, DialogContent, useDialog } from "@repo/ui/components/dialog";

import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";

export default function RemoveUserStickerDialog({ topicId }: { topicId: number }) {
  const { mutateAsync, isPending } = useRemoveCustomSticker();
  const { close } = useDialog();

  const onRemoveTopic = async () => {
    await mutateAsync(topicId, {
      onSuccess: () => {
        successToast("스티커가 삭제되었어요.");
        invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId.toString()]);
        close();
      },
      onError: () => {
        errorToast("스티커 삭제에 실패했어요.");
      },
    });
  };

  return (
    <DialogContent>
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-lg font-semibold">삭제</h2>
          <p className="text-muted-foreground text-sm">스티커를 삭제 하시겠습니까?</p>
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
