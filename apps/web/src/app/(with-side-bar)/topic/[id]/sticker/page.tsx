import TopicStickerDetailPage from "@/page/topic/[id]/sticker";

interface TopicDetailProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    stickerId: string;
  }>;
}

export default async function TopicStickerDetail({ params, searchParams }: TopicDetailProps) {
  const { id } = await params;
  const { stickerId } = await searchParams;

  return <TopicStickerDetailPage id={id} stickerId={stickerId} />;
}
