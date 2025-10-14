import { CONTENT } from "@/constants/content";
import { getCategoryContentById, getContentById } from "@/services/content";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryContentById = (id: string | undefined) => {
  return useQuery({
    queryKey: [CONTENT.GET_CATEGORY_CONTENT_BY_ID, id],
    queryFn: async () => getCategoryContentById(id!),
    select: (data) => data.result,
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};

export const useGetContentById = (id: number | null) => {
  return useQuery({
    queryKey: [CONTENT.GET_CONTENT_BY_ID, id],
    queryFn: async () => getContentById(id!),
    select: (data) => data.result,
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};
