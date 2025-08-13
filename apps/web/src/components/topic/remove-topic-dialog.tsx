import { useRouter } from "next/navigation";

import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useRemoveTopic } from "@/lib/tanstack/mutation/topic";
import { revalidatePath } from "@/utils/revalidate";
import { errorToast, infoToast } from "@/utils/toast";
import { DialogClose, DialogContent, useDialog } from "@repo/ui/components/dialog";

import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";

export default function RemoveTopicDialog({ topicId }: { topicId: number }) {
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
