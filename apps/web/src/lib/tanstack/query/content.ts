import { CONTENT } from "@/constants/content";
import { getCategoryContentById } from "@/services/content";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryContentById = (id?: string) => {
  return useQuery({
    queryKey: [CONTENT.GET_CATEGORY_CONTENT_BY_ID, id],
    queryFn: async () => getCategoryContentById(id!),
    select: (data) => data.result,
  });
};
