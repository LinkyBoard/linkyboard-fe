import { TAG } from "@/constants/tag";
import { getTags } from "@/services/tag";
import { useQuery } from "@tanstack/react-query";

export const useGetTags = () => {
  return useQuery({
    queryKey: [TAG.GET_TAGS],
    queryFn: getTags,
    select: (data) => data.result,
  });
};
