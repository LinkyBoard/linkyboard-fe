"use client";

import dynamic from "next/dynamic";

import { Loader2 } from "lucide-react";

interface TopicStickerDetailPageProps {
  id: string | null;
  stickerId: string | null;
}

const BlockNote = dynamic(() => import("@/components/(with-side-bar)/topic/sticker/block-note"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Loader2 size={24} className="animate-spin" />
    </div>
  ),
});

export default function TopicStickerDetailPage({ id, stickerId }: TopicStickerDetailPageProps) {
  return (
    <main className="flex h-full flex-col gap-4">
      <BlockNote topicId={id} stickerId={stickerId} />
    </main>
  );
}
