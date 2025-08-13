import { TOPIC } from "@/constants/topic";
import type { TopicContentDTO, TopicDTO } from "@/models/topic";
import { getAllTopics, getTopicById, getTopicContentById } from "@/services/topic";
import { BaseResponseDTO } from "@repo/types";
import { calculateNextPageParam } from "@repo/ui/utils/params";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";

export const useGetTopicById = (id: string) => {
  return useQueries({
    queries: [
      {
        queryKey: [TOPIC.GET_TOPIC_BY_ID, id],
        queryFn: async () => await getTopicById(id),
        enabled: !!id,
        select: (data: BaseResponseDTO<TopicDTO>) => data.result,
      },
      {
        queryKey: [TOPIC.GET_TOPIC_CONTENT_BY_ID, id],
        queryFn: async () => await getTopicContentById(id),
        enabled: !!id,
        select: (data: BaseResponseDTO<TopicContentDTO[]>) => data.result,
      },
    ],
  });
};

export const useGetAllTopics = () => {
  return useInfiniteQuery({
    queryKey: [TOPIC.GET_ALL_TOPICS],
    queryFn: async ({ pageParam = 0 }) => await getAllTopics(pageParam),
    getNextPageParam: (lastPage) =>
      calculateNextPageParam({
        totalPages: lastPage.result.totalPages,
        page: lastPage.result.pageable.pageNumber,
      }),

    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.result.content),
  });
};
