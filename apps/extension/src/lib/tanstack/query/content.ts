import { CONTENT } from "@/constants/content";
import { getContentById } from "@/services/content";
import { useQuery } from "@tanstack/react-query";

export const useGetContentById = (id: string | null) => {
  return useQuery({
    queryKey: [CONTENT.GET_CONTENT_BY_ID, id],
    queryFn: async () => await getContentById(id as string),
    enabled: !!id,
  });
};
