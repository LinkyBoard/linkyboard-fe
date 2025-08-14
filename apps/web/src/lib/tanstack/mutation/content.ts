import { removeContentById, updateContent } from "@/services/content";
import { useMutation } from "@tanstack/react-query";

export const useRemoveContentById = () => {
  return useMutation({
    mutationFn: removeContentById,
  });
};

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: updateContent,
  });
};
