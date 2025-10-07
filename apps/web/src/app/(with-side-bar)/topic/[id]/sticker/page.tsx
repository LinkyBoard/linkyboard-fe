import TopicStickerDetailPage from "@/page/topic/[id]/sticker";

interface TopicDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TopicStickerDetail({ params }: TopicDetailProps) {
  const { id } = await params;

  return <TopicStickerDetailPage id={id} />;
}
