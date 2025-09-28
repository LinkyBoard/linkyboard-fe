import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import SentinelSpinner from "@/components/sentinel-spinner";
import { useGetAllTopics } from "@/lib/tanstack/query/topic";
import { useDashboardStore } from "@/lib/zustand/dashboard-store";
import type { TopicDTO } from "@/models/topic";

import { Loader2 } from "lucide-react";

import RecentTopicItem from "./recent-topic-item";

export default function RecentTopicList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setTotalTopics = useDashboardStore((state) => state.setTotalTopics);

  // 현재 선택된 토픽 ID 가져오기
  const currentTopicId = Number(searchParams.get("id") || "");

  const {
    data: recentTopics,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useGetAllTopics();

  const onTopicClick = (topic: TopicDTO) => {
    router.push(`/topic?id=${topic.id}`);
    close(); // 모바일에서 사이드바 닫기
  };

  useEffect(() => {
    if (!isPending) {
      setTotalTopics(recentTopics?.data?.length || 0);
    }
  }, [isPending]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : !recentTopics || recentTopics?.data?.length === 0 ? (
        <p className="text-muted-foreground text-sm">토픽이 없어요.</p>
      ) : (
        recentTopics?.data?.map((topic) => (
          <RecentTopicItem
            key={topic.id}
            isSelected={currentTopicId === topic.id}
            topic={topic}
            onTopicClick={() => onTopicClick(topic)}
          />
        ))
      )}
      <SentinelSpinner
        className="mx-auto"
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
