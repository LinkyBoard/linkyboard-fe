import { TOPIC } from "@/constants/topic";
import { getAllTopics } from "@/services/topic";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetAllTopics = (page: number) => {
  return useInfiniteQuery({
    queryKey: [TOPIC.GET_ALL_TOPICS, page],
    queryFn: async ({ pageParam = 0 }) => await getAllTopics(pageParam),
    getNextPageParam: (lastPage) => {
      //   if (lastPage?.data?.page === lastPage?.data?.totalPages - 1) {
      //     return undefined;
      //   }
      //   return lastPage?.data?.page + 1;
      return 1;
    },
    initialPageParam: 0,
  });
};
