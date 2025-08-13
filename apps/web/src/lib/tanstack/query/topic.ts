import { TOPIC } from "@/constants/topic";
import { getAllTopics } from "@/services/topic";
import { calculateNextPageParam } from "@repo/ui/utils/params";
import { useInfiniteQuery } from "@tanstack/react-query";

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
