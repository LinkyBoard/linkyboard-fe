import TopicBoardPage from "@/page/topic";

interface TopicBoardProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function TopicBoard({ searchParams }: TopicBoardProps) {
  const { id } = await searchParams;

  return <TopicBoardPage id={id || ""} />;
}
