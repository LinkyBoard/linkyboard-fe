import { createCategory } from "@/services/category";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
  });
};
