import { removeContentById } from "@/services/content";
import { useMutation } from "@tanstack/react-query";

export const useRemoveContentById = () => {
  return useMutation({
    mutationFn: removeContentById,
  });
};
