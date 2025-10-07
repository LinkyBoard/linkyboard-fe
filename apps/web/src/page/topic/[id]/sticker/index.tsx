"use client";

import dynamic from "next/dynamic";

interface TopicStickerDetailPageProps {
  id: string;
  stickerId: string;
}

const BlockNote = dynamic(() => import("@/components/(with-side-bar)/topic/sticker/block-note"), {
  ssr: false,
});

export default function TopicStickerDetailPage({ id, stickerId }: TopicStickerDetailPageProps) {
  // stickerId가 있다면 커스텀 스티커(노란색) 조회

  return (
    <main className="flex h-full flex-col gap-4">
      <input
        className="border-border w-full border-b pb-3 text-3xl font-bold outline-none"
        placeholder="제목을 입력해주세요"
      />
      <BlockNote />
    </main>
  );
}
