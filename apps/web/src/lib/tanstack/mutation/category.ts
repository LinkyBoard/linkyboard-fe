import { createCategory, removeCategory } from "@/services/category";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: removeCategory,
  });
};
