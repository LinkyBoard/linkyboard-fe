"use client";

import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/utils/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  useDialog,
} from "@repo/ui/components/dialog";

import { Plus } from "lucide-react";

import { Input } from "../ui/input";

interface AddStickerDialogProps {
  addNodeToFlow: (type: string, item: any) => void;
}

function AddStickerDialogContent({ addNodeToFlow }: AddStickerDialogProps) {
  const { close } = useDialog();

  const onCreateSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("description") as string;

    if (!title || !content) {
      return errorToast("제목과 설명을 입력해주세요.");
    }

    addNodeToFlow("custom_sticker", {
      id: new Date().getTime(),
      title,
      content,
    });
    successToast("스티커 생성에 성공했어요.");
    close();
  };

  return (
    <DialogContent>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">새 스티커 생성</h2>
        <p className="text-muted-foreground">새로운 스티커를 생성하고 관리하세요</p>
      </div>
      <form onSubmit={onCreateSticker}>
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
          <Button type="submit">생성</Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default function AddStickerDialog({ addNodeToFlow }: AddStickerDialogProps) {
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>
          <Plus size={16} />새 스티커
        </DialogTrigger>
      </Button>
      <AddStickerDialogContent addNodeToFlow={addNodeToFlow} />
    </Dialog>
  );
}
