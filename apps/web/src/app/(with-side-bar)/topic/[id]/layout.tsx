import TopicStickerDetailModal from "@/components/(with-side-bar)/topic/sticker/topic-sticker-detail-modal";

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
