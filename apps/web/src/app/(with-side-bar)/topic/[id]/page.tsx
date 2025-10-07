import { redirect, RedirectType } from "next/navigation";

import type { ContentTypeOptions } from "@/constants/content";
import TopicBoardPage from "@/page/topic/[id]";

interface TopicBoardProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: ContentTypeOptions }>;
}

export default async function TopicBoard({ params, searchParams }: TopicBoardProps) {
  const { id } = await params;
  const { type } = await searchParams;

  if (!id) {
    return redirect("/topic", RedirectType.replace);
  }

  return <TopicBoardPage id={id} type={type || "ALL"} />;
}
