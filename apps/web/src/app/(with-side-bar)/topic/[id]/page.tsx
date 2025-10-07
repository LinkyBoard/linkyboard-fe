import TopicDetailPage from "@/page/topic/[id]";

interface TopicDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TopicDetail({ params }: TopicDetailProps) {
  const { id } = await params;

  return <TopicDetailPage id={id} />;
}
