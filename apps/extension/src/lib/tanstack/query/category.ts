import { CATEGORY } from "@/constants/category";
import { getCategories } from "@/services/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORY.GET_CATEGORIES],
    queryFn: getCategories,
    select: (data) => data.result.map((category) => category.name),
    staleTime: 1000 * 60,
  });
};
