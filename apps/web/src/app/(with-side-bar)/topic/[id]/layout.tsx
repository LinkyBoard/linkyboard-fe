import TopicStickerDetailModal from "@/components/(with-side-bar)/topic/sticker/topic-sticker-detail-modal";

interface TopicStickerDetailLayoutProps {
  children: React.ReactNode;
}

export default function TopicStickerDetailLayout({ children }: TopicStickerDetailLayoutProps) {
  return (
    <>
      {children}
      <TopicStickerDetailModal />
    </>
  );
}
