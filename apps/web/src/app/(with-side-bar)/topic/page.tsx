import type { ContentTypeOptions } from "@/constants/content";
import TopicBoardPage from "@/page/topic";

interface TopicBoardProps {
  searchParams: Promise<{ id?: string; type?: ContentTypeOptions }>;
}

export default async function TopicBoard({ searchParams }: TopicBoardProps) {
  const { id, type } = await searchParams;

  return <TopicBoardPage id={id || ""} type={type || "ALL"} />;
}
