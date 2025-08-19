"use client";

import { Button } from "@/components/ui/button";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useCreateCustomSticker } from "@/lib/tanstack/mutation/custom-sticker";
import { errorToast, infoToast } from "@/utils/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";

import { Loader2, Plus } from "lucide-react";

import { Input } from "../ui/input";

interface AddStickerDialogContentProps {
  topicId: string;
}

function AddStickerDialogContent({ topicId }: AddStickerDialogContentProps) {
  const { close } = useDialog();

  const { mutateAsync: createCustomSticker, isPending } = useCreateCustomSticker();

  const onCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("description") as string;

    const body = {
      topicId,
      title,
      content,
    };

    await createCustomSticker(body, {
      onSuccess: () => {
        invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicId]);
        close();
      },
      onError: (error: Error) => {
        const isDuplicateError = error.message.includes("409");
        if (isDuplicateError) {
          return infoToast("이미 존재하는 스티커 제목이에요.");
        }

        errorToast("스티커 생성에 실패했어요.");
      },
    });
  };
  return (
    <DialogContent>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">새 스티커 생성</h2>
        <p className="text-muted-foreground">새로운 스티커를 생성하고 관리하세요</p>
      </div>
      <form onSubmit={onCreateTopic}>
        <div className="mb-4">
          <label className="mb-2 block font-medium">스티커 제목</label>
          <Input type="text" placeholder="스티커 제목을 입력하세요" name="title" required />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-medium">설명</label>
          <textarea
            className="border-border bg-background resize-vertical min-h-[100px] w-full rounded-md border p-3"
            placeholder="스티커에 대한 설명을 입력하세요"
            name="description"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <DialogClose>취소</DialogClose>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "생성"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default function AddStickerDialog({ topicId }: AddStickerDialogContentProps) {
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>
          <Plus size={16} />새 스티커
        </DialogTrigger>
      </Button>
      <AddStickerDialogContent topicId={topicId} />
    </Dialog>
  );
}
