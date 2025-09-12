import { CONTENT } from "@/constants/content";
import { getAllContents, getContentById } from "@/services/content";
import { useQuery } from "@tanstack/react-query";

export const useGetContentById = (id: string | null) => {
  return useQuery({
    queryKey: [CONTENT.GET_CONTENT_BY_ID, id],
    queryFn: async () => await getContentById(id as string),
    enabled: !!id,
  });
};

export const useGetAllContents = (isLoggedIn: boolean) => {
  return useQuery({
    queryKey: [CONTENT.GET_ALL_CONTENTS],
    queryFn: getAllContents,
    enabled: isLoggedIn,
  });
};
