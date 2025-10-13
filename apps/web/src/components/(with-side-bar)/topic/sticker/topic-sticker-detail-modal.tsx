"use client";

import { useRouter } from "next/navigation";

import { useTopicStore } from "@/lib/zustand/topic";
import TopicStickerDetailPage from "@/page/topic/[id]/sticker";

import { MoveDiagonal2, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function TopicStickerDetailModal() {
  const topicStore = useTopicStore();
  const router = useRouter();

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      topicStore.reset();
    }
  };

  const onRouteToDetail = () => {
    router.push(`/topic/${topicStore.topicId}/sticker${queryString}`);
    topicStore.reset();
  };

  const queryString = topicStore.stickerId ? `?stickerId=${topicStore.stickerId}` : "";

  return (
    topicStore.isOpen &&
    createPortal(
      <div
        role="dialog"
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onMouseDown={onMouseDown}
      >
        <div className="bg-background size-4/5 space-y-4 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <button onClick={onRouteToDetail}>
              <MoveDiagonal2 size={20} />
            </button>
            <button onClick={() => router.back()}>
              <X size={20} />
            </button>
          </div>
          <TopicStickerDetailPage id={topicStore.topicId} stickerId={topicStore.stickerId} />
        </div>
      </div>,
      document.body
    )
  );
}
