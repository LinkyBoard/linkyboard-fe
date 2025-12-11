"use client";

import dynamic from "next/dynamic";

const TopicStickerDetailModal = dynamic(
  () => import("@/components/(with-side-bar)/topic/sticker/topic-sticker-detail-modal"),
  {
    ssr: false,
  }
);

interface TopicBoardLayoutProps {
  children: React.ReactNode;
}

export default function TopicBoardLayout({ children }: TopicBoardLayoutProps) {
  return (
    <>
      {children}
      <TopicStickerDetailModal />
    </>
  );
}
