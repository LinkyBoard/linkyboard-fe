import { CATEGORY } from "@/constants/category";
import { MINUTE } from "@/constants/time";
import { getCategories } from "@/services/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORY.GET_CATEGORIES],
    queryFn: getCategories,
    select: (data) => data.result,
    staleTime: MINUTE,
  });
};
