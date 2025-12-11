import { lazy } from "react";

const TopicStickerDetailModal = lazy(
  () => import("@/components/(with-side-bar)/topic/sticker/topic-sticker-detail-modal")
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
