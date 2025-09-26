"use client";

import { useRouter } from "next/navigation";

import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useCreateTopic } from "@/lib/tanstack/mutation/topic";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Input,
  useDialog,
} from "@linkyboard/components";
import { errorToast, infoToast } from "@linkyboard/utils";

import { Loader2 } from "lucide-react";

interface AddTopicDialogProps {
  children: React.ReactNode;
}

function AddTopicDialogContent() {
  const router = useRouter();
  const { close } = useDialog();

  const { mutateAsync: createTopic, isPending } = useCreateTopic();

  const onCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("description") as string;

    const body = {
      title,
      content,
    };

    await createTopic(body, {
      onSuccess: (data) => {
        router.push(`/topic?id=${data.result}`);
        invalidateQueries([TOPIC.GET_ALL_TOPICS]);
        close();
      },
      onError: (error: Error) => {
        const isDuplicateError = error.message.includes("409");
        if (isDuplicateError) {
          return infoToast("이미 존재하는 토픽 제목이에요.");
        }

        errorToast("토픽 생성에 실패했어요.");
      },
    });
  };
  return (
    <DialogContent>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">새 토픽 생성</h2>
        <p className="text-muted-foreground">새로운 토픽을 생성하고 관리하세요</p>
      </div>
      <form onSubmit={onCreateTopic}>
        <div className="mb-4">
          <label className="mb-2 block font-medium">토픽 제목</label>
          <Input type="text" placeholder="토픽 제목을 입력하세요" name="title" required />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-medium">설명</label>
          <textarea
            className="border-border bg-background resize-vertical min-h-[100px] w-full rounded-md border p-3"
            placeholder="토픽에 대한 설명을 입력하세요"
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

export default function AddTopicDialog({ children }: AddTopicDialogProps) {
  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger>{children}</DialogTrigger>
      </Button>
      <AddTopicDialogContent />
    </Dialog>
  );
}
