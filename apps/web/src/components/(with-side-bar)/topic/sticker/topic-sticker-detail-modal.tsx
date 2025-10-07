"use client";

import { useRouter } from "next/navigation";

import { MoveDiagonal2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface TopicStickerDetailModalProps {
  children: React.ReactNode;
  id: string;
  stickerId: string;
}

export default function TopicStickerDetailModal({
  children,
  id,
  stickerId,
}: TopicStickerDetailModalProps) {
  const router = useRouter();

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      router.back();
    }
  };

  const queryString = stickerId ? `?stickerId=${stickerId}` : "";

  return createPortal(
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
      <div className="bg-background size-4/5 rounded-2xl p-8">
        <div className="mb-4 flex items-center justify-between">
          {/* assign 외에 다른 방안 생각해보기 */}
          <button onClick={() => window.location.assign(`/topic/${id}/sticker${queryString}`)}>
            <MoveDiagonal2 size={20} />
          </button>
          <button onClick={() => router.back()}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
}
