"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useOutsideClick } from "@repo/ui/hooks/use-outside-click";

import { infoToast } from "@/utils/toast";

import { Input } from "../../ui/input";
import { Topic, useTopicStore } from "@/lib/zustand/topic-store";

export default function AddTopicModal() {
  const router = useRouter();

  const topicStore = useTopicStore();

  const onCloseModal = () => {
    topicStore.setShowNewTopicModal(false);
    topicStore.setEditingTopic(null);
  };

  const [dialogRef] = useOutsideClick<HTMLDivElement>(onCloseModal);

  const onCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const existingTopic = topicStore.topics.find(
      (topic) => topic.title.toLowerCase() === title.toLowerCase()
    );

    if (existingTopic) {
      return infoToast("이미 존재하는 토픽입니다.");
    }

    // 새 토픽 생성 (초기 위치 설정)
    const newTopic: Topic = {
      id: Date.now(),
      title,
      description,
      contents: [],
      x: 50,
      y: 50,
      createdAt: new Date().toISOString(),
    };

    // TODO: API 요청으로 바꾸기
    topicStore.addTopic(newTopic);

    // URL 업데이트하여 새로 생성된 토픽으로 이동
    router.push(`/topic?id=${newTopic.id}`);
    onCloseModal();
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
                defaultValue={topicStore.editingTopic?.description || ""}
                name="description"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCloseModal}>
                취소
              </Button>
              <Button type="submit">{topicStore.editingTopic ? "수정" : "생성"}</Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
