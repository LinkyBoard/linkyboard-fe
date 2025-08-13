"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TOPIC } from "@/constants/topic";
import { invalidateQueries } from "@/lib/tanstack";
import { useCreateTopic, useUpdateTopic } from "@/lib/tanstack/mutation/topic";
import { useTopicStore } from "@/lib/zustand/topic-store";
import { errorToast, infoToast } from "@/utils/toast";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";

import { Loader2 } from "lucide-react";

import { Input } from "../../ui/input";

export default function AddTopicModal() {
  const router = useRouter();

  const topicStore = useTopicStore();

  const { mutateAsync: createTopic, isPending: isCreateTopicPending } = useCreateTopic();
  const { mutateAsync: updateTopic, isPending: isUpdateTopicPending } = useUpdateTopic();

  const isPending = isCreateTopicPending || isUpdateTopicPending;

  const onCloseModal = () => {
    topicStore.setShowNewTopicModal(false);
    topicStore.setEditingTopic(null);
  };

  const [dialogRef] = useOutsideClick<HTMLDivElement>(onCloseModal);

  const onCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("description") as string;

    const body = {
      title,
      content,
    };

    if (topicStore.editingTopic) {
      await updateTopic(
        {
          id: topicStore.editingTopic.id,
          ...body,
        },
        {
          onSuccess: () => {
            invalidateQueries([TOPIC.GET_ALL_TOPICS]);
            invalidateQueries([TOPIC.GET_TOPIC_BY_ID, topicStore.editingTopic?.id.toString()]);
            infoToast("토픽 수정에 성공했어요.");
            onCloseModal();
          },
          onError: () => {
            errorToast("토픽 수정에 실패했어요.");
          },
        }
      );
    } else {
      await createTopic(body, {
        onSuccess: (data) => {
          router.push(`/topic?id=${data.result}`);
          invalidateQueries([TOPIC.GET_ALL_TOPICS]);
          onCloseModal();
        },
        onError: (error: Error) => {
          const isDuplicateError = error.message.includes("409");
          if (isDuplicateError) {
            return infoToast("이미 존재하는 토픽 제목이에요.");
          }

          errorToast("토픽 생성에 실패했어요.");
        },
      });
    }
  };

  return (
    topicStore.showNewTopicModal && (
      <div
        role="dialog"
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 transition-opacity duration-300"
        aria-modal="true"
      >
        <div ref={dialogRef} className="m-5 w-full max-w-lg rounded-2xl bg-white p-5" tabIndex={-1}>
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">
              {topicStore.editingTopic ? "토픽 편집" : "새 토픽 생성"}
            </h2>
            <p className="text-muted-foreground">
              {topicStore.editingTopic ? "토픽을 수정하세요" : "새로운 토픽을 생성하고 관리하세요"}
            </p>
          </div>
          <form onSubmit={onCreateTopic}>
            <div className="mb-4">
              <label className="mb-2 block font-medium">토픽 제목</label>
              <Input
                type="text"
                placeholder="토픽 제목을 입력하세요"
                defaultValue={topicStore.editingTopic?.title || ""}
                name="title"
                required
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block font-medium">설명</label>
              <textarea
                className="border-border bg-background resize-vertical min-h-[100px] w-full rounded-md border p-3"
                placeholder="토픽에 대한 설명을 입력하세요"
                defaultValue={topicStore.editingTopic?.content || ""}
                name="description"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCloseModal}>
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : topicStore.editingTopic ? (
                  "수정"
                ) : (
                  "생성"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
