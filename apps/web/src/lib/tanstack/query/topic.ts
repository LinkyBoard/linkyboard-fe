import { type ContentTypeOptions } from "@/constants/content";
import { TOPIC } from "@/constants/topic";
import { getAllContents, getAllTopics, getTopicBoardById, getTopicById } from "@/services/topic";
import { calculateNextPageParam } from "@linkyboard/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetTopicBoardById = (id: string) => {
  return useQuery({
    queryKey: [TOPIC.GET_TOPIC_BOARD_BY_ID, id],
    queryFn: async () => await getTopicBoardById(id),
    enabled: !!id,
    select: (data) => data.result,
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
    select: (data) => ({
      total: data.pages[0]?.result.totalElements,
      data: data.pages.flatMap((page) => page.result.content),
    }),
  });
};

export const useGetAllContents = (type: ContentTypeOptions) => {
  return useInfiniteQuery({
    queryKey: [TOPIC.GET_ALL_CONTENTS, type],
    queryFn: async ({ pageParam = 0 }) => await getAllContents({ page: pageParam, type }),
    getNextPageParam: (lastPage) =>
      calculateNextPageParam({
        totalPages: lastPage.result.totalPages,
        page: lastPage.result.pageable.pageNumber,
      }),

    initialPageParam: 0,
    select: (data) => data.pages.flatMap((page) => page.result.content),
  });
};

export const useGetTopicById = ({
  id,
  stickerId,
}: {
  id: string | null;
  stickerId: string | null;
}) => {
  return useQuery({
    queryKey: [TOPIC.GET_TOPIC_BY_ID, id, stickerId],
    queryFn: async () => await getTopicById(id as string),
    enabled: !stickerId,
    select: (data) => data.result,
    staleTime: 1000 * 60,
  });
};
